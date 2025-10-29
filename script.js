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
  GA: [  // 喘息（獨立額度池）
    { code: "GA09", name: "喘息2小時/支", price: 770 },
  ],
  SC: [  // 短照（獨立額度池；需外籍看護）
    { code: "SC09", name: "短照2小時/支", price: 770 },
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

/********* 主額度（依身分別×CMS） *********/
const limitTable = {
  "一般戶":     [0, 0, 14320, 17920, 21520, 25120, 28720, 32320, 35920],
  "中低收入戶": [0, 0, 27100, 33900, 40700, 47500, 54300, 61100, 67900],
  "低收入戶":   [0, 0, 36000, 45000, 54000, 63000, 72000, 81000, 90000],
};
/********* GA/SC 獨立額度 *********/
const GA_QUOTA = { 2:32340,3:32340,4:32340,5:32340,6:32340,7:48510,8:48510 };
const SC_QUOTA = { 2:87780,3:87780,4:87780,5:87780,6:87780,7:71610,8:71610 };

const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);

window.onload = ()=>{
  renderAddons();
  renderTables();
  bindHeaderInputs();
  updateSCAvailability();
  updateResults();
};

/********* 左卡加成 *********/
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

/********* 產生各表格（含 總次數 欄位） *********/
function renderTables(){
  const container = $("#tables");
  container.innerHTML = "";

  Object.keys(serviceData).forEach(group=>{
    const titleMap = {
      BA:"BA碼（照顧服務）",
      BD:"BD碼（社區服務）",
      C:"C碼（專業服務）",
      GA:"GA碼（喘息服務／獨立額度）",
      SC:"SC碼（短期替代照顧／獨立額度，須外籍看護）",
    };
    const caption = document.createElement("div");
    caption.className = "table-title";
    caption.textContent = titleMap[group] || `${group}碼`;
    container.appendChild(caption);

    const table = document.createElement("table");
    table.dataset.group = group;
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

    serviceData[group].forEach((item, i)=>{
      const tr = document.createElement("tr");

      // 服務項目
      const c0 = tr.insertCell(); c0.textContent = `${item.code} ${item.name}`;
      // 單價
      const c1 = tr.insertCell(); c1.textContent = item.price.toLocaleString();

      // 週次數
      const c2 = tr.insertCell();
      const week = document.createElement("input");
      week.type="number"; week.min="1"; week.step="1"; week.value="0";
      week.oninput = ()=>updateRow(group, i);
      c2.appendChild(week);

      // 月次數（唯讀，由週次數 4.5 無條件進位而來）
      const c3 = tr.insertCell();
      const month = document.createElement("input");
      month.type="number"; month.min="0"; month.step="1"; month.value="0"; month.readOnly = true;
      c3.appendChild(month);

      // 總次數（可由使用者直接輸入，若 >0 以它計價）
      const c4 = tr.insertCell();
      const totalCnt = document.createElement("input");
      totalCnt.type="number"; totalCnt.min="0"; totalCnt.step="1"; totalCnt.value="0";
      totalCnt.oninput = ()=>updateRow(group, i); // 重新計價
      c4.appendChild(totalCnt);

      // 總金額
      const c5 = tr.insertCell(); c5.textContent = "0";

      tbody.appendChild(tr);
    });

    container.appendChild(table);
  });
}

/********* 週→月(無條件進位)、總次數優先、更新金額 *********/
function updateRow(group, idx){
  const table  = [...document.querySelectorAll("#tables table")].find(t=>t.dataset.group===group);
  const row    = table.tBodies[0].rows[idx];

  const price = serviceData[group][idx].price;

  // 取值
  const w = Math.max(0, parseInt(row.cells[2].querySelector("input").value)||0); // 週
  const m = Math.ceil(w * WEEKS_PER_MONTH);                                      // 週→月（無條件進位）
  row.cells[3].querySelector("input").value = m;

  // 總次數（如果 > 0 則優先）
  const cntUser = Math.max(0, parseInt(row.cells[4].querySelector("input").value)||0);
  const useCnt = cntUser > 0 ? cntUser : m;

  // 金額
  row.cells[5].textContent = (price * useCnt).toLocaleString();

  updateResults();
}

/********* 綁定上方條件 & 外籍看護邏輯 *********/
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty']").forEach(el=>el.addEventListener("change", updateResults));
  document.querySelectorAll("input[name='cms']").forEach(el=>el.addEventListener("change", ()=>{ updateSCAvailability(); updateResults(); }));
  document.querySelectorAll("input[name='foreign']").forEach(el=>el.addEventListener("change", ()=>{ updateSCAvailability(); updateResults(); }));
  $("#keepQuota").addEventListener("input", updateResults);
}

function updateSCAvailability(){
  const hasFG = (document.querySelector("input[name='foreign']:checked")||{}).value === "1";
  const scTable = [...document.querySelectorAll("#tables table")].find(t=>t.dataset.group==="SC");
  if(!scTable) return;
  scTable.querySelectorAll("tbody tr").forEach(tr=>{
    const week = tr.cells[2].querySelector("input");
    const cnt  = tr.cells[4].querySelector("input");
    if(hasFG){
      week.disabled = cnt.disabled = false;
    }else{
      week.value = 0; cnt.value = 0;
      week.disabled = cnt.disabled = true;
      tr.cells[3].querySelector("input").value = 0;  // 月
      tr.cells[5].textContent = "0";                 // 金額
    }
  });
}

/********* 摘要計算 *********/
function updateResults(){
  // 1) 逐表累計
  const totalByGroup = { BA:0, BD:0, C:0, GA:0, SC:0 };
  document.querySelectorAll("#tables table").forEach(table=>{
    const g = table.dataset.group;
    let sum = 0;
    table.querySelectorAll("tbody tr").forEach(tr=>{
      sum += parseInt(tr.cells[5].textContent.replace(/,/g,""))||0;
    });
    totalByGroup[g] = sum;
  });

  const totalAll = Object.values(totalByGroup).reduce((a,b)=>a+b,0);

  // 2) 取得條件
  const idty = (document.querySelector("input[name='idty']:checked")||{}).value || "一般戶";
  const cms  = parseInt((document.querySelector("input[name='cms']:checked')")?.value || "2"); // 防呆
  const cmsSel = parseInt((document.querySelector("input[name='cms']:checked")||{}).value || "2");
  const keep = Math.max(0, parseInt($("#keepQuota").value)||0);
  const fg = (document.querySelector("input[name='foreign']:checked")||{}).value === "1";

  // 3) 額度池
  const grantMain = (limitTable[idty][cmsSel]||0) + keep;      // 主額度（+留用）
  const grantGA   = GA_QUOTA[cmsSel] || 0;                     // GA 獨立額度
  const grantSC   = fg ? (SC_QUOTA[cmsSel] || 0) : 0;          // SC 獨立額度（需外籍看護）

  // 4) 各池消耗
  const useMain = (totalByGroup.BA||0) + (totalByGroup.BD||0) + (totalByGroup.C||0);
  const useGA   = totalByGroup.GA||0;
  const useSC   = totalByGroup.SC||0;

  // 5) 部分負擔（全部消耗 × 身分係數）
  const idRate = idty === "一般戶" ? 0.16 : (idty === "中低收入戶" ? 0.05 : 0);
  const copay  = Math.round(totalAll * idRate);

  // 6) 超額（各池分開計）
  const overMain = Math.max(0, useMain - grantMain);
  const overGA   = Math.max(0, useGA   - grantGA);
  const overSC   = Math.max(0, useSC   - grantSC);
  const overAll  = overMain + overGA + overSC;

  // 7) 顯示
  $("#grantQuota").value = grantMain.toLocaleString();
  $("#sumGrant").textContent  = grantMain.toLocaleString();
  $("#sumRemain").textContent = Math.max(0, grantMain - useMain).toLocaleString();
  $("#sumCopay").textContent  = copay.toLocaleString();
  $("#sumSelfpay").textContent= (copay + overAll).toLocaleString();

  // 8) 超額訊息
  const over = $("#overMsg");
  const msgs = [];
  if(overMain>0) msgs.push(`主額度超額 ${overMain.toLocaleString()} 元`);
  if(overGA>0)   msgs.push(`GA 喘息額度超額 ${overGA.toLocaleString()} 元`);
  if(overSC>0)   msgs.push(`SC 短照額度超額 ${overSC.toLocaleString()} 元`);
  if(msgs.length){
    over.classList.remove("hidden");
    over.innerHTML = msgs.map(s=>`• ${s}`).join("<br>");
  }else{
    over.classList.add("hidden");
    over.innerHTML = "";
  }
}

/********* 重置 *********/
function resetAll(){
  $("#keepQuota").value = "";
  document.getElementById("id-normal").checked = true;
  document.getElementById("cms2").checked = true;
  document.getElementById("fg-no").checked = true;

  document.querySelectorAll("#tables tbody tr").forEach(tr=>{
    tr.cells[2].querySelector("input").value = 0;   // 週
    tr.cells[3].querySelector("input").value = 0;   // 月
    tr.cells[4].querySelector("input").value = 0;   // 總次數
    tr.cells[5].textContent = "0";                  // 金額
  });

  $("#addonHint").textContent = "請儲存加成次數";
  $("#addonHint").classList.add("warn");

  updateSCAvailability();
  updateResults();
}
