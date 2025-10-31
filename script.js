/**********************
 * script.js（直接覆蓋）
 * 保持你的HTML/CSS不變：三結構版
 **********************/

/**********************
 * 服務清單與上限（依你提供）
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

/* 主(BA)額度：CMS */
const cmsQuota = {
  2: 10020, 3: 15460, 4: 18580,
  5: 24100, 6: 28070, 7: 32090, 8: 36180
};

/* 身分別 → 共用主額度（身分影響的是部分負擔率，不影響額度本身） */
const limitTable = {
  "一般戶":      cmsQuota,
  "中低收入戶":  cmsQuota,
  "低收入戶":    cmsQuota,
};

/********* GA/SC 專屬池（依你提供） *********/
const GA_CAP = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
const SC_CAP = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };

/********* Addons（本機儲存加次數；不參與計算，只保留UI與資料） *********/
const ADDONS = [
  { code:"AA05" },{ code:"AA06" },{ code:"AA08" },{ code:"AA09" },{ code:"AA11" },
];

const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);

/* ========= 初始化 ========= */
document.addEventListener('DOMContentLoaded', () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  updateSCAvailability();
  updateResults();

  $("#btnSaveAddons")?.addEventListener("click", saveAddons);
  $("#btnReset")?.addEventListener("click", resetAll);

  // 事件委派：任何在 #tables 的 input/select 變更都會重算（防止漏綁）
  $("#tables")?.addEventListener("input", (e)=>{
    if(e.target.tagName === "INPUT" || e.target.tagName === "SELECT"){
      updateResults();
    }
  });
});

/********* 左卡加成 *********/
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
}

/********* 產生各表格（含總次數） *********/
function renderTables(){
  const container = $("#tables"); if(!container) return;
  container.innerHTML="";
  const titles = { BA:"BA碼（照顧服務）", BD:"BD碼（社區服務）", C:"C碼（專業服務）", GA:"GA碼（喘息服務）", SC:"SC碼（短期替代照顧）" };

  Object.keys(serviceData).forEach(code=>{
    const h3=document.createElement("h3"); h3.textContent=titles[code]; container.appendChild(h3);

    const table=document.createElement("table");
    table.innerHTML=`
      <thead><tr>
        <th style="min-width:260px">服務項目</th>
        <th>單價</th>
        <th>週次數</th>
        <th>月次數</th>
        <th>總次數</th>
        <th>總金額</th>
      </tr></thead>
      <tbody></tbody>`;
    const tbody=table.querySelector("tbody");

    serviceData[code].forEach((item,i)=>{
      const tr=document.createElement("tr");
      tr.innerHTML=`
        <td>${item.code} ${item.name}</td>
        <td>${item.price.toLocaleString()}</td>
        <td><input type="number" min="0" step="1" value="0" /></td>
        <td><input type="number" value="0" readonly /></td>
        <td><input type="number" min="0" step="1" value="0" /></td>
        <td>0</td>`;
      const week = tr.cells[2].querySelector("input");
      const total = tr.cells[4].querySelector("input");

      week.addEventListener("input", ()=>updateRow(code,i,false));
      total.addEventListener("input",()=>updateRow(code,i,true));

      tbody.appendChild(tr);
    });
    container.appendChild(table);
  });
}

/********* 每行更新（週→月：無條件進位 4.5） *********/
function updateRow(code, idx, fromTotal=false){
  const tIndex = Object.keys(serviceData).indexOf(code);
  const table = document.querySelectorAll("#tables table")[tIndex];
  const tr = table.tBodies[0].rows[idx];

  const price = serviceData[code][idx].price;
  const w = Math.max(0, parseInt(tr.cells[2].querySelector("input").value)||0);
  const m = Math.ceil(w * WEEKS_PER_MONTH);
  tr.cells[3].querySelector("input").value = m;

  const t = Math.max(0, parseInt(tr.cells[4].querySelector("input").value)||0);
  const use = t > 0 ? t : m;

  tr.cells[5].textContent = (price * use).toLocaleString();
  updateResults();
}

/********* 綁定上方條件 *********/
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty'], input[name='cms'], input[name='foreign']")
    .forEach(el=>el.addEventListener("change", ()=>{ updateSCAvailability(); updateResults(); }));
  $("#keepQuota")?.addEventListener("input", updateResults);
}

/********* SC 僅外籍看護「有」可用 *********/
function updateSCAvailability(){
  const tables = document.querySelectorAll("#tables table");
  if(!tables.length) return;
  // 找到 SC 表
  const scTable = [...tables].find(t=>t.previousSibling && t.previousSibling.textContent.includes("SC"));
  if(!scTable) return;
  const hasForeign = (document.querySelector("input[name='foreign']:checked")||{}).value === "1";
  scTable.querySelectorAll("input").forEach(inp=>{
    inp.disabled = !hasForeign;
    if(!hasForeign){ inp.value = 0; }
  });
  const warn=$("#warnSCfg");
  if(warn){ !hasForeign ? warn.classList.remove("hidden") : warn.classList.add("hidden"); }
}

/********* 總額度/自付計算（BA/GA/SC 分池；部分負擔僅對額度內金額） *********/
function updateResults(){
  // 先彙總各池消耗（BD/C 併入 BA 主池）
  let sumBA = 0, sumGA = 0, sumSC = 0;

  const tables = document.querySelectorAll("#tables table");
  const groups = Object.keys(serviceData); // ["BA","BD","C","GA","SC"]
  groups.forEach((g,idx)=>{
    const tbody = tables[idx]?.tBodies[0]; if(!tbody) return;
    [...tbody.rows].forEach((tr,i)=>{
      const price = serviceData[g][i].price;
      const w = Math.max(0, parseInt(tr.cells[2].querySelector("input").value)||0);
      const m = Math.ceil(w * WEEKS_PER_MONTH);  // 週→月 無條件進位 4.5
      const t = Math.max(0, parseInt(tr.cells[4].querySelector("input").value)||0);
      const use = t > 0 ? t : m;
      const amt = price * use;

      if(g==="GA") sumGA += amt;
      else if(g==="SC") sumSC += amt;
      else sumBA += amt; // BA / BD / C 都算在主池
    });
  });

  // 取條件
  const idtyRaw = (document.querySelector("input[name='idty']:checked")||{}).value || "一般戶";
  const cms  = Number((document.querySelector("input[name='cms']:checked")||{}).value || 2);
  const keep = Math.max(0, parseInt($("#keepQuota")?.value)||0);

  // 部分負擔率（支援文字與代碼）
  const rateMap = { "一般戶":0.16, "中低收入戶":0.05, "低收入戶":0, "normal":0.16, "midlow":0.05, "low":0 };
  const rate = rateMap[idtyRaw] ?? 0.16;

  // 各池額度（主池＋留用；GA/SC 專屬池）
  const grantBA = ((limitTable[idtyRaw] && limitTable[idtyRaw][cms]) ? limitTable[idtyRaw][cms] : 0) + keep;
  const grantGA = GA_CAP[cms] || 0;
  const grantSC = SC_CAP[cms] || 0;

  // 額度內可補助金額
  const allowBA = Math.min(sumBA, grantBA);
  const allowGA = Math.min(sumGA, grantGA);
  const allowSC = Math.min(sumSC, grantSC);
  const subsidyBase = allowBA + allowGA + allowSC;

  // 超額（額度外）：不計部分負擔
  const overBA = Math.max(0, sumBA - grantBA);
  const overGA = Math.max(0, sumGA - grantGA);
  const overSC = Math.max(0, sumSC - grantSC);

  // 部分負擔（僅額度內）
  const copay = Math.round(subsidyBase * rate);

  // 政府補助 & 自付 & 總金額
  const govSubsidy = subsidyBase - copay;
  const selfpay    = copay + overBA + overGA + overSC;
  const grandTotal = govSubsidy + selfpay; // ＝ sumBA + sumGA + sumSC

  // 中區顯示：給付額度（BA 主額度＋留用）
  const grantQuotaEl = $("#grantQuota"); if(grantQuotaEl) grantQuotaEl.value = grantBA.toLocaleString();

  // 右區顯示（分池）
  const remainBA = Math.max(0, grantBA - allowBA);
  const remainGA = Math.max(0, grantGA - allowGA);
  const remainSC = Math.max(0, grantSC - allowSC);

  setText("#sumGrantBA", grantBA);
  setText("#sumRemainBA", remainBA);
  setText("#sumGrantGA", grantGA);
  setText("#sumRemainGA", remainGA);
  setText("#sumGrantSC", grantSC);
  setText("#sumRemainSC", remainSC);

  // Footer 同步（若存在）
  setText("#sumRemainBA_foot", remainBA);
  setText("#sumRemainGA_foot", remainGA);
  setText("#sumRemainSC_foot", remainSC);

  // 費用總結
  setText("#sumCopay", copay);
  setText("#sumSelfpay", selfpay);
  setText("#sumGovSubsidy", govSubsidy);
  setText("#sumGrand", grandTotal);

  setText("#sumGovSubsidy_foot", govSubsidy);
  setText("#sumSelfpay_foot", selfpay);
  setText("#sumGrand_foot", grandTotal);

  // 超額提醒
  toggle("#overMain", overBA>0);
  toggle("#overGA",   overGA>0);
  toggle("#overSC",   overSC>0);

  // 如需排錯可打開：
  // console.log({sumBA,sumGA,sumSC,grantBA,grantGA,grantSC,allowBA,allowGA,allowSC,overBA,overGA,overSC,rate,copay,govSubsidy,selfpay,grandTotal});
}

function setText(sel, num){
  const el=$(sel); if(!el) return;
  el.textContent = Number(num).toLocaleString();
}

function toggle(sel, show){
  const el=$(sel); if(!el) return;
  show ? el.classList.remove("hidden") : el.classList.add("hidden");
}

/********* 重置 *********/
function resetAll(){
  const idN = document.getElementById("id-normal");
  if(idN) idN.checked = true;
  const cms2 = document.getElementById("cms2");
  if(cms2) cms2.checked = true;
  const foreignNo = document.querySelector("input[name='foreign'][value='0']");
  if(foreignNo) foreignNo.checked = true;
  const keep = $("#keepQuota"); if(keep) keep.value = "";

  document.querySelectorAll("#tables input").forEach(inp=>{ inp.value = 0; });
  document.querySelectorAll("#tables td:last-child").forEach(td=>td.textContent="0");

  updateSCAvailability();
  updateResults();

  const hint=$("#addonHint");
  if(hint){ hint.textContent="請儲存加成次數"; hint.classList.add("warn"); }
}
