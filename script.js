/**********************
 * script.js（2025-10-31 最終整合）
 * - 週→月→總 三層邏輯
 * - A/B 單位切換：B 隱藏 C 碼，薪資不含 C
 * - 居服薪資(6/4)：AA碼 + 額度 *0.6
 * - 移除 AA 價格欄
 **********************/

/**********************
 * 服務清單
 **********************/
const serviceData = {
  BA: [
    { code: "BA01", name: "基本身體清潔", price: 260 },
    { code: "BA02", name: "基本日常照顧", price: 195 },
    { code: "BA03", name: "測量生命徵象", price: 35 },
    { code: "BA04", name: "協助進食或管灌", price: 130 },
    { code: "BA05", name: "餐食照顧", price: 310 },
    { code: "BA07", name: "協助沐浴及洗頭", price: 325 },
    { code: "BA08", name: "足部照護", price: 500 },
    { code: "BA09", name: "到宅沐浴-1", price: 2200 },
    { code: "BA09a", name: "到宅沐浴-2", price: 2500 },
    { code: "BA10", name: "翻身拍背", price: 155 },
    { code: "BA11", name: "肢體關節活動", price: 195 },
    { code: "BA12", name: "協助上下樓梯", price: 130 },
    { code: "BA13", name: "陪同外出", price: 195 },
    { code: "BA14", name: "陪同就醫", price: 685 },
    { code: "BA15", name: "家務協助", price: 195 },
    { code: "BA16", name: "代購", price: 130 },
    { code: "BA17a", name: "人工氣道管抽吸", price: 75 },
    { code: "BA17b", name: "口腔內抽吸", price: 65 },
    { code: "BA17c", name: "管路清潔", price: 50 },
    { code: "BA17d", name: "通便/驗血糖", price: 50 },
    { code: "BA17e", name: "依指示置入藥盒", price: 50 },
    { code: "BA18", name: "安全看視", price: 200 },
    { code: "BA20", name: "陪伴服務", price: 175 },
    { code: "BA22", name: "巡視服務", price: 130 },
    { code: "BA23", name: "協助洗頭", price: 200 },
    { code: "BA24", name: "協助排泄", price: 220 },
  ],
  BD: [
    { code: "BD01", name: "社區式協助沐浴", price: 200 },
    { code: "BD02", name: "社區式晚餐", price: 150 },
    { code: "BD03", name: "社區式服務交通接送", price: 115 },
  ],
  C: [
    { code: "CA07", name: "IADLs/ADLs 復能照護(3次含評估)", price: 4500 },
    { code: "CA08", name: "ISP擬定與執行(4次含評估)", price: 6000 },
    { code: "CB01", name: "營養照護(3次含評估)", price: 6000 },
    { code: "CB02", name: "進食與吞嚥照護(6次含評估)", price: 9000 },
    { code: "CB03", name: "困擾行為照護(3次含評估)", price: 4500 },
    { code: "CB04", name: "臥床/長期活動受限照護(6次含評估)", price: 9000 },
    { code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 },
    { code: "CD02", name: "居家護理指導與諮詢(3次+1次評估)", price: 6000 },
  ],
  GA: [{ code: "GA09", name: "喘息 2 小時/支", price: 770 }],
  SC: [{ code: "SC09", name: "短照 2 小時/支", price: 770 }],
};

/**********************
 * 額度設定
 **********************/
const cmsQuota = { 2:10020, 3:15460, 4:18580, 5:24100, 6:28070, 7:32090, 8:36180 };
const GA_CAP = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
const SC_CAP = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };

/**********************
 * 參數設定
 **********************/
const ADDONS = [{code:"AA05"},{code:"AA06"},{code:"AA08"},{code:"AA09"},{code:"AA11"}];
const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);
let currentUnit = localStorage.getItem("unit") || "B";
const lastCalc = { gov_inc:0,self_inc:0, gov_exC:0,self_exC:0 };

/**********************
 * 初始化
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  bindUnitToggle();
  applyUnitEffects();
  updateSCAvailability();
  updateResults();
  $("#btnSaveAddons")?.addEventListener("click", ()=>{ saveAddons(); updateResults(); });
  $("#btnReset")?.addEventListener("click", resetAll);
  $("#tables")?.addEventListener("input", ()=>updateResults());
});

/**********************
 * 左卡 AA 區塊（移除價格欄）
 **********************/
function renderAddons(){
  const saved = JSON.parse(localStorage.getItem("addons")||"{}");
  const host = $("#addonRows"); if(!host) return;
  host.innerHTML="";
  ADDONS.forEach(a=>{
    const row=document.createElement("div");
    row.className="addon-row";
    row.innerHTML=`
      <div>${a.code}</div>
      <div class="addon-inputs">
        <input type="number" id="${a.code}_p" value="${saved[`${a.code}_p`]??0}" min="0" step="1"/>
        <input type="number" id="${a.code}_n" value="${saved[`${a.code}_n`]??0}" min="0" step="1"/>
      </div>`;
    host.appendChild(row);
  });
}
function saveAddons(){
  const data={};
  ADDONS.forEach(a=>{
    data[`${a.code}_p`]=parseInt($(`#${a.code}_p`)?.value)||0;
    data[`${a.code}_n`]=parseInt($(`#${a.code}_n`)?.value)||0;
  });
  localStorage.setItem("addons",JSON.stringify(data));
  const hint=$("#addonHint");
  if(hint){hint.textContent="已儲存加成次數";hint.classList.remove("warn");}
}

/**********************
 * A/B 切換
 **********************/
function bindUnitToggle(){
  const btn=$("#btnUnitToggle");
  if(!btn) return;
  btn.addEventListener("click",()=>{
    currentUnit=(currentUnit==="A")?"B":"A";
    localStorage.setItem("unit",currentUnit);
    applyUnitEffects();
    updateResults();
  });
}
function applyUnitEffects(){
  const btn=$("#btnUnitToggle");
  if(btn){btn.textContent=`${currentUnit}單位`;btn.dataset.unit=currentUnit;}
  const cBox=document.querySelector('[data-group="C"]');
  if(cBox){
    if(currentUnit==="B"){cBox.classList.add("hidden");}
    else{cBox.classList.remove("hidden");}
  }
}

/**********************
 * 主表生成
 **********************/
function renderTables(){
  const container=$("#tables"); if(!container) return;
  container.innerHTML="";
  const titles={BA:"BA碼（照顧服務）",BD:"BD碼（社區服務）",C:"C碼（專業服務｜一包制）",GA:"GA碼（喘息服務）",SC:"SC碼（短期替代照顧）"};
  Object.keys(serviceData).forEach(code=>{
    const group=document.createElement("div");
    group.dataset.group=code;
    const h3=document.createElement("h3");h3.textContent=titles[code];
    const table=document.createElement("table");
    if(code==="C"){
      table.innerHTML=`
        <thead><tr><th style="min-width:260px">服務項目</th><th>單價(每組)</th><th>每月組數</th><th>總金額</th></tr></thead><tbody></tbody>`;
    }else{
      table.innerHTML=`
        <thead><tr><th style="min-width:260px">服務項目</th><th>單價</th><th>週次數</th><th>月次數</th><th>總次數</th><th>總金額</th></tr></thead><tbody></tbody>`;
    }
    const tbody=table.querySelector("tbody");
    serviceData[code].forEach((item,i)=>{
      const tr=document.createElement("tr");
      tr.dataset.manual="0";
      if(code==="C"){
        tr.dataset.cmode="1";
        tr.innerHTML=`
          <td>${item.code} ${item.name}</td>
          <td>${item.price.toLocaleString()}</td>
          <td><input class="inp-c-groups" type="number" min="0" step="1" value="0"/></td>
          <td class="cell-amount">0</td>`;
        tr.querySelector(".inp-c-groups").addEventListener("input",()=>{updateOneRow(code,i);updateResults();});
      }else{
        tr.innerHTML=`
          <td>${item.code} ${item.name}</td>
          <td>${item.price.toLocaleString()}</td>
          <td><input class="inp-week" type="number" min="0" step="1" value="0"/></td>
          <td><input class="inp-month" value="0" readonly/></td>
          <td><input class="inp-total" type="number" min="0" step="1" value="0"/></td>
          <td class="cell-amount">0</td>`;
        const w=tr.querySelector(".inp-week");
        const m=tr.querySelector(".inp-month");
        const t=tr.querySelector(".inp-total");
        w.addEventListener("input",()=>{
          const val=Math.ceil((parseInt(w.value)||0)*WEEKS_PER_MONTH);
          m.value=val;t.value=val;tr.dataset.manual="0";
          updateOneRow(code,i);updateResults();
        });
        t.addEventListener("input",()=>{tr.dataset.manual="1";updateOneRow(code,i);updateResults();});
      }
      tbody.appendChild(tr);
    });
    group.appendChild(h3);group.appendChild(table);container.appendChild(group);
  });
  applyUnitEffects();
}

/**********************
 * 計算邏輯
 **********************/
function updateResults(){
  let sumBA=0,sumGA=0,sumSC=0,sumC=0;
  document.querySelectorAll("#tables table").forEach((table,idx)=>{
    const code=Object.keys(serviceData)[idx];
    [...table.tBodies[0].rows].forEach((tr,i)=>{
      const p=serviceData[code][i].price;
      if(tr.dataset.cmode==="1"){
        const g=parseInt(tr.querySelector(".inp-c-groups").value)||0;
        const amt=p*g;sumBA+=amt;sumC+=amt;
        tr.querySelector(".cell-amount").textContent=amt.toLocaleString();return;
      }
      const w=parseInt(tr.querySelector(".inp-week").value)||0;
      const m=Math.ceil(w*WEEKS_PER_MONTH);
      const manual=tr.dataset.manual==="1";
      const t=parseInt(tr.querySelector(".inp-total").value)||0;
      const use=manual?t:m;const amt=p*use;
      if(code==="GA")sumGA+=amt;else if(code==="SC")sumSC+=amt;else sumBA+=amt;
      tr.querySelector(".cell-amount").textContent=amt.toLocaleString();
    });
  });
  const idty=(document.querySelector("input[name='idty']:checked")||{}).value||"一般戶";
  const cms=Number((document.querySelector("input[name='cms']:checked")||{}).value||2);
  const keep=Math.max(0,parseInt($("#keepQuota")?.value)||0);
  const rateMap={"一般戶":0.16,"中低收入戶":0.05,"低收入戶":0};
  const rate=rateMap[idty]??0.16;
  const grantBA=(cmsQuota[cms]||0)+keep,grantGA=GA_CAP[cms]||0,grantSC=SC_CAP[cms]||0;
  const calc=(ba,ga,sc)=>{
    const aB=Math.min(ba,grantBA),aG=Math.min(ga,grantGA),aS=Math.min(sc,grantSC);
    const sub=aB+aG+aS;const overB=Math.max(0,ba-grantBA),overG=Math.max(0,ga-grantGA),overS=Math.max(0,sc-grantSC);
    const cop=Math.round(sub*rate);const gov=sub-cop;const self=cop+overB+overG+overS;
    return{gov,self};
  };
  const inc=calc(sumBA,sumGA,sumSC);
  const exC=calc(sumBA-sumC,sumGA,sumSC);
  lastCalc.gov_inc=inc.gov;lastCalc.self_inc=inc.self;lastCalc.gov_exC=exC.gov;lastCalc.self_exC=exC.self;
  updateCaregiverSalary();
}

/**********************
 * 居服薪資(6/4)
 **********************/
function updateCaregiverSalary(){
  const AA_PRICE={AA05:200,AA06:200,AA08:385,AA09:770,AA11:50};
  const saved=JSON.parse(localStorage.getItem("addons")||"{}");
  let aaTotal=0;Object.keys(AA_PRICE).forEach(c=>{aaTotal+=(parseInt(saved[`${c}_p`]||0)+parseInt(saved[`${c}_n`]||0))*AA_PRICE[c];});
  const gov=(currentUnit==="B")?lastCalc.gov_exC:lastCalc.gov_inc;
  const self=(currentUnit==="B")?lastCalc.self_exC:lastCalc.self_inc;
  const total=Math.round((aaTotal+gov+self)*0.6);
  let box=$("#caregiverSalary");
  if(!box){
    const card=[...document.querySelectorAll(".card h2.card-title")].find(el=>el.textContent.includes("居服薪資"));
    if(card){box=document.createElement("div");box.id="caregiverSalary";box.style.marginTop="10px";box.style.textAlign="right";box.style.fontWeight="700";box.style.color="#2e7d32";card.parentElement.appendChild(box);}
  }
  if(box) box.textContent=`居服員薪資合計：${total.toLocaleString()} 元`;
}

/**********************
 * 輔助功能
 **********************/
function resetAll(){localStorage.removeItem("addons");location.reload();}
