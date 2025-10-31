console.log('script.js loaded ✔');

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
    { code: "CB01", name: "營養照護(3次含評估)", price: 4500 },
    { code: "CB02", name: "進食與吞嚥照護(6次含評估)", price: 9000 },
    { code: "CB03", name: "困擾行為照護(3次含評估)", price: 4500 },
    { code: "CB04", name: "臥床/長期活動受限照護(6次含評估)", price: 9000 },
    { code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 },
    { code: "CD02", name: "居家護理指導與諮詢(3次+1次評估)", price: 6000 },
  ],
  GA: [{ code: "GA09", name: "喘息 2 小時/支", price: 770 }],
  SC: [{ code: "SC09", name: "短照 2 小時/支", price: 770 }],
};

const limitTable = {
  "一般戶":     [0, 0, 14320, 17920, 21520, 25120, 28720, 32320, 35920],
  "中低收入戶": [0, 0, 27100, 33900, 40700, 47500, 54300, 61100, 67900],
  "低收入戶":   [0, 0, 36000, 45000, 54000, 63000, 72000, 81000, 90000],
};
const GA_CAP = { 2:32340,3:32340,4:32340,5:32340,6:32340,7:48510,8:48510 };
const SC_CAP = { 2:87780,3:87780,4:87780,5:87780,6:87780,7:71610,8:71610 };
const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);

/* ---------------- 載入後初始化 ---------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  renderTables();
  bindHeaderInputs();
  updateSCAvailability();
  updateResults();
});

/* ---------------- 產生表格 ---------------- */
function renderTables(){
  const tables = $("#tables");
  tables.innerHTML = "";
  Object.keys(serviceData).forEach(code=>{
    const sectionTitle = {
      BA:"BA碼（照顧服務）",
      BD:"BD碼（社區服務）",
      C:"C碼（專業服務）",
      GA:"GA碼（喘息服務）",
      SC:"SC碼（短期替代照顧）"
    }[code];
    const title = document.createElement("h3");
    title.textContent = sectionTitle;
    tables.appendChild(title);

    const table = document.createElement("table");
    table.innerHTML = `
      <thead><tr>
        <th>服務項目</th>
        <th>單價</th>
        <th>週次數</th>
        <th>月次數</th>
        <th>總次數</th>
        <th>總金額</th>
      </tr></thead>
      <tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    serviceData[code].forEach((s,i)=>{
      const tr=document.createElement("tr");
      tr.innerHTML=`
        <td>${s.code} ${s.name}</td>
        <td>${s.price.toLocaleString()}</td>
        <td><input type="number" min="1" step="1" value="0"></td>
        <td><input type="number" value="0" readonly></td>
        <td><input type="number" min="0" step="1" value="0"></td>
        <td>0</td>`;
      const [w,m,t]=[tr.cells[2].querySelector("input"),tr.cells[3].querySelector("input"),tr.cells[4].querySelector("input")];
      w.addEventListener("input",()=>updateRow(code,i));
      t.addEventListener("input",()=>updateRow(code,i,true));
      tbody.appendChild(tr);
    });
    tables.appendChild(table);
  });
}

/* ---------------- 更新一列 ---------------- */
function updateRow(code,i,fromTotal=false){
  const tIndex = Object.keys(serviceData).indexOf(code);
  const table=document.querySelectorAll("#tables table")[tIndex];
  const tr=table.tBodies[0].rows[i];
  const price=serviceData[code][i].price;
  const week=parseInt(tr.cells[2].querySelector("input").value)||0;
  const month=Math.ceil(week*WEEKS_PER_MONTH);
  tr.cells[3].querySelector("input").value=month;
  const total=parseInt(tr.cells[4].querySelector("input").value)||0;
  const useCnt=total>0?total:month;
  tr.cells[5].textContent=(price*useCnt).toLocaleString();
  updateResults();
}

/* ---------------- 綁定上方條件 ---------------- */
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty'],input[name='cms'],input[name='foreign']")
    .forEach(el=>el.addEventListener("change",()=>{updateSCAvailability();updateResults();}));
  $("#keepQuota").addEventListener("input",updateResults);
}

/* ---------------- SC 外籍限制 ---------------- */
function updateSCAvailability(){
  const fgYes=(document.querySelector("input[name='foreign']:checked")||{}).value==="1";
  const scTable=[...document.querySelectorAll("#tables table")].find(t=>t.previousSibling.textContent.includes("SC"));
  if(!scTable)return;
  scTable.querySelectorAll("input").forEach(inp=>{
    inp.disabled=!fgYes;
    if(!fgYes)inp.value=0;
  });
  const warn=$("#warnSCfg");if(!warn)return;
  if(!fgYes)warn.classList.remove("hidden");else warn.classList.add("hidden");
}

/* ---------------- 計算 ---------------- */
function updateResults(){
  let totalMain=0,totalGA=0,totalSC=0;
  const tables=document.querySelectorAll("#tables table");
  const groups=Object.keys(serviceData);
  groups.forEach((g,idx)=>{
    tables[idx]?.querySelectorAll("tbody tr").forEach((tr,i)=>{
      const p=serviceData[g][i].price;
      const w=parseInt(tr.cells[2].querySelector("input").value)||0;
      const m=Math.ceil(w*WEEKS_PER_MONTH);
      const t=parseInt(tr.cells[4].querySelector("input").value)||0;
      const useCnt=t>0?t:m;
      const amt=p*useCnt;
      if(g==="GA")totalGA+=amt; else if(g==="SC")totalSC+=amt; else totalMain+=amt;
    });
  });
  const idty=(document.querySelector("input[name='idty']:checked")||{}).value||"一般戶";
  const cms=parseInt((document.querySelector("input[name='cms']:checked")||{}).value||"2");
  const keep=parseInt($("#keepQuota").value)||0;
  const mainGrant=(limitTable[idty][cms]||0)+keep;
  const gaGrant=GA_CAP[cms]||0;
  const scGrant=SC_CAP[cms]||0;
  const rate=idty==="一般戶"?0.16:(idty==="中低收入戶"?0.05:0);
  const overMain=Math.max(0,totalMain-mainGrant);
  const remainMain=Math.max(0,mainGrant-totalMain);
  const overGA=Math.max(0,totalGA-gaGrant);
  const overSC=Math.max(0,totalSC-scGrant);
  const grand=totalMain+totalGA+totalSC;
  const copay=Math.round(grand*rate);
  const selfpay=copay+overMain+overGA+overSC;
  $("#grantQuota").value=mainGrant.toLocaleString();
  $("#sumGrant").textContent=mainGrant.toLocaleString();
  $("#sumRemain").textContent=remainMain.toLocaleString();
  $("#sumCopay").textContent=copay.toLocaleString();
  $("#sumSelfpay").textContent=selfpay.toLocaleString();
  toggle("#overMain",overMain>0);
  toggle("#overGA",overGA>0);
  toggle("#overSC",overSC>0);
}
function toggle(sel,show){const e=$(sel);if(!e)return;show?e.classList.remove("hidden"):e.classList.add("hidden");}

/* ---------------- 重置 ---------------- */
function resetAll(){
  document.querySelectorAll("input[name='idty']")[0].checked=true;
  document.querySelectorAll("input[name='cms']")[0].checked=true;
  document.querySelectorAll("input[name='foreign']")[0].checked=true;
  $("#keepQuota").value="";
  document.querySelectorAll("#tables input").forEach(inp=>{inp.value=0;});
  document.querySelectorAll("#tables td:last-child").forEach(td=>td.textContent="0");
  updateResults();
}
