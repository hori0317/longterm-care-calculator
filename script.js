console.log('script.js loaded ✔');

/**********************
 * 服務清單
 *  - BA / BD / C（合併CA/CB/CC/CD）/ GA / SC
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
  // 合併後的 C 碼（專業服務）
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
  GA: [
    { code: "GA09", name: "喘息 2 小時/支", price: 770 },
  ],
  SC: [
    { code: "SC09", name: "短照 2 小時/支", price: 770 },
  ],
};

/********* 左卡加成（示意，可儲存） *********/
const addonItems = [
  { code: "AA05", key: "AA05" },
  { code: "AA06", key: "AA06" },
  { code: "AA08", key: "AA08" },
  { code: "AA09", key: "AA09" },
  { code: "AA11", key: "AA11" },
];

/********* 上限（依身分別×CMS等級） *********/
const limitTable = {
  "一般戶":     [0, 0, 14320, 17920, 21520, 25120, 28720, 32320, 35920],
  "中低收入戶": [0, 0, 27100, 33900, 40700, 47500, 54300, 61100, 67900],
  "低收入戶":   [0, 0, 36000, 45000, 54000, 63000, 72000, 81000, 90000],
};
/********* GA/SC 專屬池 *********/
const GA_CAP = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
const SC_CAP = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };

const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);

document.addEventListener('DOMContentLoaded', () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  updateSCAvailability();
  updateResults();

  $("#btnSaveAddons").addEventListener('click', saveAddons);
  $("#btnReset").addEventListener('click', resetAll);
});

/* ---------------- 左卡加成 ---------------- */
function renderAddons(){
  const saved = JSON.parse(localStorage.getItem("addons")||"{}");
  const host = $("#addonRows");
  host.innerHTML = "";
  addonItems.forEach(it=>{
    const row = document.createElement("div");
    row.className = "addon-row";
    row.innerHTML = `
      <div>${it.code}</div>
      <div><input type="number" id="${it.key}_p" min="0" step="1" value="${saved[`${it.key}_p`]??0}"></div>
      <div><input type="number" id="${it.key}_n" min="0" step="1" value="${saved[`${it.key}_n`]??0}"></div>
    `;
    host.appendChild(row);
  });
}
function saveAddons(){
  const data = {};
  addonItems.forEach(it=>{
    data[`${it.key}_p`] = parseInt($(`#${it.key}_p`).value)||0;
    data[`${it.key}_n`] = parseInt($(`#${it.key}_n`).value)||0;
  });
  localStorage.setItem("addons", JSON.stringify(data));
  const hint = $("#addonHint");
  hint.textContent = "已儲存加成次數";
  hint.classList.remove("warn");
}

/* ---------------- 產生各表格（含「總次數」欄） ---------------- */
function renderTables(){
  const container = $("#tables");
  container.innerHTML = "";

  Object.keys(serviceData).forEach(code=>{
    const titleMap = {
      BA:"BA碼（照顧服務）",
      BD:"BD碼（社區服務）",
      C:"C碼（專業服務）",
      GA:"GA碼（喘息服務）",
      SC:"SC碼（短期替代照顧）",
    };
    const caption = document.createElement("div");
    caption.className = "table-title";
    caption.textContent = titleMap[code] || `${code}碼`;
    container.appendChild(caption);

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th style="min-width:260px">服務項目</th>
          <th>單價</th>
          <th>週次數</th>
          <th>月次數</th>
          <th>總次數</th>
          <th>總金額</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    serviceData[code].forEach((item, i)=>{
      const tr = document.createElement("tr");

      const c0 = tr.insertCell(); c0.textContent = `${item.code} ${item.name}`;
      const c1 = tr.insertCell(); c1.textContent = item.price.toLocaleString();

      const c2 = tr.insertCell();
      const week = document.createElement("input");
      week.type = "number"; week.min="1"; week.step="1"; week.value="0";
      week.addEventListener('input', ()=>updateRow(code, i));
      c2.appendChild(week);

      const c3 = tr.insertCell();
      const month = document.createElement("input");
      month.type = "number"; month.min="0"; month.step="1"; month.value="0"; month.readOnly = true;
      c3.appendChild(month);

      const c4 = tr.insertCell();
      const totalCnt = document.createElement("input");
      totalCnt.type = "number"; totalCnt.min="0"; totalCnt.step="1"; totalCnt.value="0";
      totalCnt.addEventListener('input', ()=>updateRow(code, i, /*fromTotal*/true));
      c4.appendChild(totalCnt);

      const c5 = tr.insertCell(); c5.textContent = "0";

      tbody.appendChild(tr);
    });

    container.appendChild(table);
  });
}

/* 週→月(無條件進位)、總次數優先、更新金額 */
function updateRow(code, idx, fromTotal=false){
  const tIndex = Object.keys(serviceData).indexOf(code);
  const table  = document.querySelectorAll("#tables table")[tIndex];
  const row    = table.tBodies[0].rows[idx];

  const price = serviceData[code][idx].price;
  const weekInput  = row.cells[2].querySelector("input");
  const monthInput = row.cells[3].querySelector("input");
  const totalInput = row.cells[4].querySelector("input");

  let week  = Math.max(0, parseInt(weekInput.value)||0);
  let month = Math.ceil(week * WEEKS_PER_MONTH);
  monthInput.value = month;

  let totalCount = Math.max(0, parseInt(totalInput.value)||0);
  const useCount = totalCount > 0 ? totalCount : month;

  row.cells[5].textContent = (price * useCount).toLocaleString();

  updateResults();
}

/* ---------------- 綁定上方條件 ---------------- */
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty']").forEach(el=>el.addEventListener("change", updateResults));
  document.querySelectorAll("input[name='cms']").forEach(el=>el.addEventListener("change", ()=>{
    updateSCAvailability();
    updateResults();
  }));
  document.querySelectorAll("input[name='foreign']").forEach(el=>el.addEventListener("change", ()=>{
    updateSCAvailability();
    updateResults();
  }));
  $("#keepQuota").addEventListener('input', updateResults);
}

/* 外籍看護＝否時，SC09 禁用 */
function updateSCAvailability(){
  const foreignYes = (document.querySelector("input[name='foreign']:checked")||{}).value === "1";
  const tables = document.querySelectorAll("#tables table");
  const scTableIndex = Object.keys(serviceData).indexOf("SC");
  if (scTableIndex < 0 || !tables[scTableIndex]) return;

  const inputs = tables[scTableIndex].querySelectorAll("input[type='number']");
  inputs.forEach(inp=>{
    inp.disabled = !foreignYes;
    if (!foreignYes){
      // 清空
      inp.value = 0;
    }
  });

  // 提醒字樣
  const warnSC = $("#warnSCfg");
  if (!foreignYes) warnSC.classList.remove("hidden");
  else warnSC.classList.add("hidden");
}

/* ---------------- 摘要計算 ---------------- */
function updateResults(){
  // 累計各群組金額，同時計算 GA/SC 的支出
  let totalMain = 0; // 主額度要扣的（不包含 GA/SC）
  let totalGA   = 0;
  let totalSC   = 0;

  // 走訪每一群組的表格
  const groupKeys = Object.keys(serviceData);
  const tables = document.querySelectorAll("#tables table");

  groupKeys.forEach((gKey, gi)=>{
    const rows = tables[gi]?.tBodies[0]?.rows || [];
    rows.forEach((tr, idx)=>{
      const item = serviceData[gKey][idx];
      const price = item.price;
      const week  = Math.max(0, parseInt(tr.cells[2].querySelector("input").value)||0);
      const month = Math.ceil(week * WEEKS_PER_MONTH);
      const total = Math.max(0, parseInt(tr.cells[4].querySelector("input").value)||0);
      const useCnt = total > 0 ? total : month;
      const amount = price * useCnt;

      if (gKey === "GA") totalGA += amount;
      else if (gKey === "SC") totalSC += amount;
      else totalMain += amount;
    });
  });

  // 條件
  const idty = (document.querySelector("input[name='idty']:checked")||{}).value || "一般戶";
  const cms  = parseInt((document.querySelector("input[name='cms']:checked")||{}).value || "2");
  const keep = Math.max(0, parseInt($("#keepQuota").value)||0);

  const mainGrant = (limitTable[idty][cms]||0) + keep; // 主額度 + 留用
  const gaGrant   = GA_CAP[cms] || 0;
  const scGrant   = SC_CAP[cms] || 0;

  // 身分別部分負擔比率
  const rate = (idty === "一般戶") ? 0.16 : (idty === "中低收入戶" ? 0.05 : 0);

  // 主額度：只對「非GA/SC」合計的金額做比較
  const overMain = Math.max(0, totalMain - mainGrant);
  const remainMain = Math.max(0, mainGrant - totalMain);

  // 專屬池：只對 GA 與 SC 的金額做比較（不影響主額度）
  const overGA  = Math.max(0, totalGA - gaGrant);
  const overSC  = Math.max(0, totalSC - scGrant);

  // 部分負擔：依「全部服務總額」乘以比率
  const grandTotal = totalMain + totalGA + totalSC;
  const copay = Math.round(grandTotal * rate);

  // 自付總計：部分負擔 + 主額度不足的差額（GA/SC 超額不會補貼，亦需自付）
  const selfpay = copay + overMain + overGA + overSC;

  // 輸出
  $("#grantQuota").value = mainGrant.toLocaleString();
  $("#sumGrant").textContent = mainGrant.toLocaleString();
  $("#sumRemain").textContent = remainMain.toLocaleString();
  $("#sumCopay").textContent = copay.toLocaleString();
  $("#sumSelfpay").textContent = selfpay.toLocaleString();

  // 提示：超額顯示
  const elOverMain = $("#overMain");
  const elOverGA   = $("#overGA");
  const elOverSC   = $("#overSC");

  if (overMain > 0) elOverMain.classList.remove("hidden");
  else elOverMain.classList.add("hidden");

  if (overGA > 0) elOverGA.classList.remove("hidden");
  else elOverGA.classList.add("hidden");

  // 只有外籍看護＝有時才允許 SC，否則 SC 金額會是 0
  const foreignYes = (document.querySelector("input[name='foreign']:checked")||{}).value === "1";
  if (overSC > 0 && foreignYes) elOverSC.classList.remove("hidden");
  else elOverSC.classList.add("hidden");
}

/* ---------------- 重置 ---------------- */
function resetAll(){
  // 條件
  $("#keepQuota").value = "";
  $("#id-normal").checked = true;
  $("#cms2").checked = true;
  $("#fg-no").checked = true;

  // 表格清空
  document.querySelectorAll("#tables tbody tr").forEach(tr=>{
    tr.cells[2].querySelector("input").value = 0; // 週
    tr.cells[3].querySelector("input").value = 0; // 月
    tr.cells[4].querySelector("input").value = 0; // 總次數
    tr.cells[5].textContent = "0";               // 金額
  });

  // 加成提示還原
  $("#addonHint").textContent = "請儲存加成次數";
  $("#addonHint").classList.add("warn");

  updateSCAvailability();
  updateResults();
}
