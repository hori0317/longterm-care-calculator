/**********************
 * script.js（完整版）
 * 2025-10-31
 * - 週→月→總（BA/BD/GA/SC）
 * - C碼：一包制（月組數 × 單價）
 * - SC09 不被底欄遮擋（CSS 控制）
 * - 居服薪資(6/4)：AA碼＋額度合計 ×0.6
 **********************/

/**********************
 * 服務清單與單價
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
 * 額度表
 **********************/
const cmsQuota = {
  2: 10020, 3: 15460, 4: 18580,
  5: 24100, 6: 28070, 7: 32090, 8: 36180
};
const GA_CAP = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
const SC_CAP = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };

/**********************
 * 其他設定
 **********************/
const ADDONS = [
  { code:"AA05" },{ code:"AA06" },{ code:"AA08" },{ code:"AA09" },{ code:"AA11" },
];
const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);

/**********************
 * 初始化
 **********************/
document.addEventListener('DOMContentLoaded', () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  updateSCAvailability();
  updateResults();

  $("#btnSaveAddons")?.addEventListener("click", saveAddons);
  $("#btnReset")?.addEventListener("click", resetAll);

  $("#tables")?.addEventListener("input", (e)=>{
    if(e.target.tagName === "INPUT" || e.target.tagName === "SELECT"){
      updateResults();
    }
  });
});

/**********************
 * 左卡加成（AA碼）
 **********************/
function renderAddons(){
  const saved = JSON.parse(localStorage.getItem("addons")||"{}");
  const host = $("#addonRows"); if(!host) return;
  host.innerHTML="";
  ADDONS.forEach(a=>{
    const row = document.createElement("div");
    row.className="addon-row";
    row.innerHTML = `
      <div>${a.code}</div>
      <div><input type="number" id="${a.code}_p" value="${saved[`${a.code}_p`]??0}" min="0" step="1" /></div>
      <div><input type="number" id="${a.code}_n" value="${saved[`${a.code}_n`]??0}" min="0" step="1" /></div>
    `;
    host.appendChild(row);
  });
}
function saveAddons(){
  const data={};
  ADDONS.forEach(a=>{
    data[`${a.code}_p`] = parseInt($(`#${a.code}_p`)?.value)||0;
    data[`${a.code}_n`] = parseInt($(`#${a.code}_n`)?.value)||0;
  });
  localStorage.setItem("addons", JSON.stringify(data));
  const hint=$("#addonHint"); if(hint){ hint.textContent="已儲存加成次數"; hint.classList.remove("warn"); }
  updateResults(); // 儲存後立即更新薪資
}

/**********************
 * 服務表格生成
 **********************/
function renderTables(){
  const container = $("#tables"); if(!container) return;
  container.innerHTML="";
  const titles = {
    BA:"BA碼（照顧服務）",
    BD:"BD碼（社區服務）",
    C :"C碼（專業服務｜一包制）",
    GA:"GA碼（喘息服務）",
    SC:"SC碼（短期替代照顧）"
  };

  Object.keys(serviceData).forEach(code=>{
    const h3=document.createElement("h3"); h3.textContent=titles[code]; container.appendChild(h3);
    const table=document.createElement("table");

    if(code === "C"){
      table.innerHTML = `
        <thead><tr>
          <th style="min-width:260px">服務項目</th>
          <th>單價(每組)</th>
          <th>每月組數</th>
          <th>總金額</th>
        </tr></thead><tbody></tbody>`;
    }else{
      table.innerHTML=`
        <thead><tr>
          <th style="min-width:260px">服務項目</th>
          <th>單價</th>
          <th>週次數</th>
          <th>月次數</th>
          <th>總次數</th>
          <th>總金額</th>
        </tr></thead><tbody></tbody>`;
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
        tr.querySelector(".inp-c-groups").addEventListener("input",()=>{
          updateOneRow(code,i);
          updateResults();
        });
      }else{
        tr.innerHTML=`
          <td>${item.code} ${item.name}</td>
          <td>${item.price.toLocaleString()}</td>
          <td><input class="inp-week" type="number" min="0" step="1" value="0"/></td>
          <td><input class="inp-month" value="0" readonly/></td>
          <td><input class="inp-total" type="number" min="0" step="1" value="0"/></td>
          <td class="cell-amount">0</td>`;
        const week=tr.querySelector(".inp-week");
        const month=tr.querySelector(".inp-month");
        const total=tr.querySelector(".inp-total");
        week.addEventListener("input",()=>{
          const w=Math.max(0,parseInt(week.value)||0);
          const m=Math.ceil(w*WEEKS_PER_MONTH);
          month.value=m;
          tr.dataset.manual="0";
          total.value=m;
          updateOneRow(code,i);
          updateResults();
        });
        total.addEventListener("input",()=>{
          tr.dataset.manual="1";
          updateOneRow(code,i);
          updateResults();
        });
      }
      tbody.appendChild(tr);
    });
    container.appendChild(table);
  });
}

/**********************
 * 單列金額更新
 **********************/
function updateOneRow(code,idx){
  const tIndex=Object.keys(serviceData).indexOf(code);
  const table=document.querySelectorAll("#tables table")[tIndex];
  const tr=table.tBodies[0].rows[idx];
  const price=serviceData[code][idx].price;

  if(tr.dataset.cmode==="1"){
    const g=Math.max(0,parseInt(tr.querySelector(".inp-c-groups").value)||0);
    tr.querySelector(".cell-amount").textContent=(price*g).toLocaleString();
    return;
  }
  const week=parseInt(tr.querySelector(".inp-week").value)||0;
  const month=Math.ceil(week*WEEKS_PER_MONTH);
  tr.querySelector(".inp-month").value=month;
  const manual=tr.dataset.manual==="1";
  const tVal=parseInt(tr.querySelector(".inp-total").value)||0;
  const use=manual?tVal:month;
  tr.querySelector(".cell-amount").textContent=(price*use).toLocaleString();
}

/**********************
 * 綁定條件輸入
 **********************/
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty'],input[name='cms'],input[name='foreign']")
    .forEach(el=>el.addEventListener("change",()=>{updateSCAvailability();updateResults();}));
  $("#keepQuota")?.addEventListener("input",updateResults);
}

/**********************
 * SC 僅外籍看護可用
 **********************/
function updateSCAvailability(){
  const tables=document.querySelectorAll("#tables table");
  if(!tables.length)return;
  const scTable=[...tables].find(t=>t.previousSibling&&t.previousSibling.textContent.includes("SC"));
  if(!scTable)return;
  const hasForeign=(document.querySelector("input[name='foreign']:checked")||{}).value==="1";
  scTable.querySelectorAll("input").forEach(inp=>{
    inp.disabled=!hasForeign;
    if(!hasForeign)inp.value=0;
  });
  const warn=$("#warnSCfg");
  if(warn){!hasForeign?warn.classList.remove("hidden"):warn.classList.add("hidden");}
}

/**********************
 * 計算核心
 **********************/
function updateResults(){
  let sumBA=0,sumGA=0,sumSC=0;
  const tables=document.querySelectorAll("#tables table");
  const groups=Object.keys(serviceData);
  groups.forEach((g,idx)=>{
    const tbody=tables[idx]?.tBodies[0]; if(!tbody)return;
    [...tbody.rows].forEach((tr,i)=>{
      const price=serviceData[g][i].price;
      if(tr.dataset.cmode==="1"){
        const gCnt=parseInt(tr.querySelector(".inp-c-groups").value)||0;
        const amt=price*gCnt;
        sumBA+=amt;
        tr.querySelector(".cell-amount").textContent=amt.toLocaleString();
        return;
      }
      const w=parseInt(tr.querySelector(".inp-week").value)||0;
      const m=Math.ceil(w*WEEKS_PER_MONTH);
      const manual=tr.dataset.manual==="1";
      const t=parseInt(tr.querySelector(".inp-total").value)||0;
      const use=manual?t:m;
      const amt=price*use;
      if(g==="GA")sumGA+=amt;
      else if(g==="SC")sumSC+=amt;
      else sumBA+=amt;
      tr.querySelector(".cell-amount").textContent=amt.toLocaleString();
    });
  });

  const idtyRaw=(document.querySelector("input[name='idty']:checked")||{}).value||"一般戶";
  const cms=Number((document.querySelector("input[name='cms']:checked")||{}).value||2);
  const keep=Math.max(0,parseInt($("#keepQuota")?.value)||0);
  const rateMap={"一般戶":0.16,"中低收入戶":0.05,"低收入戶":0};
  const rate=rateMap[idtyRaw]??0.16;

  const grantBA=(cmsQuota[cms]||0)+keep;
  const grantGA=GA_CAP[cms]||0;
  const grantSC=SC_CAP[cms]||0;

  const allowBA=Math.min(sumBA,grantBA);
  const allowGA=Math.min(sumGA,grantGA);
  const allowSC=Math.min(sumSC,grantSC);
  const subsidyBase=allowBA+allowGA+allowSC;

  const overBA=Math.max(0,sumBA-grantBA);
  const overGA=Math.max(0,sumGA-grantGA);
  const overSC=Math.max(0,sumSC-grantSC);

  const copay=Math.round(subsidyBase*rate);
  const govSubsidy=subsidyBase-copay;
  const selfpay=copay+overBA+overGA+overSC;
  const grandTotal=govSubsidy+selfpay;

  setText("#sumGrantBA",grantBA);
  setText("#sumRemainBA",Math.max(0,grantBA-allowBA));
  setText("#sumGrantGA",grantGA);
  setText("#sumRemainGA",Math.max(0,grantGA-allowGA));
  setText("#sumGrantSC",grantSC);
  setText("#sumRemainSC",Math.max(0,grantSC-allowSC));

  setText("#sumRemainBA_foot",Math.max(0,grantBA-allowBA));
  setText("#sumRemainGA_foot",Math.max(0,grantGA-allowGA));
  setText("#sumRemainSC_foot",Math.max(0,grantSC-allowSC));

  setText("#sumCopay",copay);
  setText("#sumSelfpay",selfpay);
  setText("#sumGovSubsidy",govSubsidy);
  setText("#sumGrand",grandTotal);

  setText("#sumGovSubsidy_foot",govSubsidy);
  setText("#sumSelfpay_foot",selfpay);
  setText("#sumGrand_foot",grandTotal);

  toggle("#overMain",overBA>0);
  toggle("#overGA",overGA>0);
  toggle("#overSC",overSC>0);

  updateCaregiverSalary(); // ➕ 計算居服薪資
}

/**********************
 * 居服薪資(6/4) 計算邏輯
 **********************/
function updateCaregiverSalary(){
  const AA_PRICE={AA05:200,AA06:200,AA08:385,AA09:770,AA11:50};
  const saved=JSON.parse(localStorage.getItem("addons")||"{}");
  let aaTotal=0;
  Object.keys(AA_PRICE).forEach(code=>{
    const p=parseInt(saved[`${code}_p`]||0);
    const n=parseInt(saved[`${code}_n`]||0);
    aaTotal+=(p+n)*AA_PRICE[code];
  });
  const gov=parseInt($("#sumGovSubsidy").textContent.replace(/,/g,""))||0;
  const self=parseInt($("#sumSelfpay").textContent.replace(/,/g,""))||0;
  const total=Math.round((aaTotal+gov+self)*0.6);

  let target=$("#caregiverSalary");
  if(!target){
    const card=[...document.querySelectorAll(".card h2.card-title")]
      .find(el=>el.textContent.includes("居服薪資"));
    if(card){
      const box=document.createElement("div");
      box.id="caregiverSalary";
      box.style.marginTop="10px";
      box.style.fontWeight="700";
      box.style.textAlign="right";
      box.style.color="#2e7d32";
      card.parentElement.appendChild(box);
      target=box;
    }
  }
  if(target) target.textContent=`居服員薪資合計：${total.toLocaleString()} 元`;
}

/**********************
 * 工具
 **********************/
function setText(sel,num){const el=$(sel);if(!el)return;el.textContent=Number(num).toLocaleString();}
function toggle(sel,show){const el=$(sel);if(!el)return;show?el.classList.remove("hidden"):el.classList.add("hidden");}

/**********************
 * 重置
 **********************/
function resetAll(){
  const idN=document.getElementById("id-normal");
  if(idN)idN.checked=true;
  const cms2=document.getElementById("cms2");
  if(cms2)cms2.checked=true;
  const foreignNo=document.querySelector("input[name='foreign'][value='0']");
  if(foreignNo)foreignNo.checked=true;
  const keep=$("#keepQuota");if(keep)keep.value="";
  document.querySelectorAll("#tables table tbody tr").forEach(tr=>{
    tr.dataset.manual="0";
    if(tr.dataset.cmode==="1"){
      tr.querySelector(".inp-c-groups").value=0;
      tr.querySelector(".cell-amount").textContent="0";
    }else{
      tr.querySelectorAll("input").forEach(inp=>inp.value=0);
      const last=tr.querySelector(".cell-amount");if(last)last.textContent="0";
    }
  });
  updateSCAvailability();
  updateResults();
  const hint=$("#addonHint");
  if(hint){hint.textContent="請儲存加成次數";hint.classList.add("warn");}
}

/**********************
 * 底部工具列避位
 **********************/
function adjustDockPadding(){
  const dock=document.getElementById('bottomDock');
  if(!dock)return;
  const h=dock.offsetHeight||0;
  document.documentElement.style.setProperty('--dock-h',h+'px');
}
document.addEventListener('DOMContentLoaded',()=>{
  adjustDockPadding();
  window.addEventListener('resize',adjustDockPadding);
  window.addEventListener('orientationchange',adjustDockPadding);
  const dock=document.getElementById('bottomDock');
  if(window.ResizeObserver&&dock){
    const ro=new ResizeObserver(()=>adjustDockPadding());
    ro.observe(dock);
  }
});
