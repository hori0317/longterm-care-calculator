/**********************
 * 服務清單（依你提供的精簡版本）
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
  GA: [{ code: "GA09", name: "喘息2小時/支", price: 770 }],
  SC: [{ code: "SC09", name: "短照2小時/支", price: 770 }],
};

/********* 左卡加成（示意，可儲存） *********/
const addonItems = [
  { code: "AA05", key: "AA05" },
  { code: "AA06", key: "AA06" },
  { code: "AA08", key: "AA08" },
  { code: "AA09", key: "AA09" },
  { code: "AA11", key: "AA11" },
];

/********* 額度上限表（僅依 CMS 等級，單位：元） *********
 * 你要求「額度總計 = CMS 等級額度 + 留用額度」
 * 這裡的 baseGrantByCMS 只含 CMS 基本額度，身分別不影響上限本身，
 * 但身分別會影響『部份負擔』與『自付』。
 *************************************************************/
const baseGrantByCMS = {
  2: 14320,
  3: 17920,
  4: 21520,
  5: 25120,
  6: 28720,
  7: 32320,
  8: 35920,
};

/********* 身分別係數（用於部分負擔、自付） *********/
const identityRate = {
  "一般戶": 0.16,
  "中低收入戶": 0.05,
  "低收入戶": 0,
};

const WEEKS_PER_MONTH = 4.5;
const $ = (s) => document.querySelector(s);

window.onload = () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  updateResults();

  $("#btnSaveAddons").addEventListener("click", saveAddons);
  $("#btnReset").addEventListener("click", resetAll);
  $("#btnPrint").addEventListener("click", () => window.print());
};

/********* 左卡加成 *********/
function renderAddons() {
  const saved = JSON.parse(localStorage.getItem("addons") || "{}");
  const host = $("#addonRows");
  host.innerHTML = "";
  addonItems.forEach((it) => {
    const row = document.createElement("div");
    row.className = "addon-row";
    row.innerHTML = `
      <div>${it.code}</div>
      <div><input type="number" id="${it.key}_p" min="0" step="1" value="${saved[`${it.key}_p`] ?? 0}"></div>
      <div><input type="number" id="${it.key}_n" min="0" step="1" value="${saved[`${it.key}_n`] ?? 0}"></div>
    `;
    host.appendChild(row);
  });
}
function saveAddons() {
  const data = {};
  addonItems.forEach((it) => {
    data[`${it.key}_p`] = parseInt($(`#${it.key}_p`).value) || 0;
    data[`${it.key}_n`] = parseInt($(`#${it.key}_n`).value) || 0;
  });
  localStorage.setItem("addons", JSON.stringify(data));
  const hint = $("#addonHint");
  hint.textContent = "已儲存加成次數";
  hint.classList.remove("warn");
}

/********* 產生各表格（含「總次數」欄） *********/
function renderTables() {
  const container = $("#tables");
  container.innerHTML = "";

  Object.keys(serviceData).forEach((code) => {
    const titleMap = {
      BA: "BA碼（照顧服務）",
      BD: "BD碼（社區服務）",
      C: "C碼（專業服務）",
      GA: "GA碼（喘息服務）",
      SC: "SC碼（短期替代照顧）",
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
          <th class="right">單價</th>
          <th class="right">週次數</th>
          <th class="right">月次數</th>
          <th class="right">總次數</th>
          <th class="right">總金額</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    serviceData[code].forEach((item, i) => {
      const tr = document.createElement("tr");

      const c0 = tr.insertCell();
      c0.textContent = `${item.code} ${item.name}`;

      const c1 = tr.insertCell();
      c1.className = "right";
      c1.textContent = item.price.toLocaleString();

      // 週次數（整數、最小 0）
      const c2 = tr.insertCell();
      c2.className = "right";
      const week = document.createElement("input");
      week.type = "number";
      week.min = "0";
      week.step = "1";
      week.value = "0";
      week.oninput = () => updateRow(code, i);
      c2.appendChild(week);

      // 月次數（由週換算得，無條件進位，只讀）
      const c3 = tr.insertCell();
      c3.className = "right";
      const month = document.createElement("input");
      month.type = "number";
      month.min = "0";
      month.step = "1";
      month.value = "0";
      month.readOnly = true;
      c3.appendChild(month);

      // 總次數（可獨立輸入，若 >0 則覆蓋月次數做計價）
      const c4 = tr.insertCell();
      c4.className = "right";
      const totalCount = document.createElement("input");
      totalCount.type = "number";
      totalCount.min = "0";
      totalCount.step = "1";
      totalCount.value = "0";
      totalCount.oninput = () => updateRow(code, i);
      c4.appendChild(totalCount);

      // 總金額
      const c5 = tr.insertCell();
      c5.className = "right";
      c5.textContent = "0";

      tbody.appendChild(tr);
    });

    container.appendChild(table);
  });
}

/********* 週→月(無條件進位)、總次數優先、更新金額 *********/
function updateRow(code, idx) {
  const tIndex = Object.keys(serviceData).indexOf(code);
  const table = document.querySelectorAll("#tables table")[tIndex];
  const row = table.tBodies[0].rows[idx];

  const price = serviceData[code][idx].price;

  const w = Math.max(0, parseInt(row.cells[2].querySelector("input").value) || 0);
  const m = Math.ceil(w * WEEKS_PER_MONTH);
  row.cells[3].querySelector("input").value = m;

  const userTotal = Math.max(0, parseInt(row.cells[4].querySelector("input").value) || 0);

  // 計價次數：使用者輸入「總次數」>0 優先；否則用月次數
  const chargeCount = userTotal > 0 ? userTotal : m;

  row.cells[5].textContent = (price * chargeCount).toLocaleString();

  updateResults();
}

/********* 綁定上方條件 *********/
function bindHeaderInputs() {
  document.querySelectorAll("input[name='idty']").forEach((el) =>
    el.addEventListener("change", updateResults)
  );
  document.querySelectorAll("input[name='cms']").forEach((el) =>
    el.addEventListener("change", updateResults)
  );
  $("#keepQuota").addEventListener("input", updateResults);
}

/********* 摘要計算（符合你最新規則） *********/
function updateResults() {
  // 服務總額
  let total = 0;
  document.querySelectorAll("#tables tbody tr").forEach((tr) => {
    total += parseInt(tr.cells[5].textContent.replace(/,/g, "")) || 0;
  });

  // 條件
  const idty = (document.querySelector("input[name='idty']:checked") || {}).value || "一般戶";
  const cms = parseInt((document.querySelector("input[name='cms']:checked") || {}).value || "2");
  const keep = Math.max(0, parseInt($("#keepQuota").value) || 0);

  // 額度總計 = CMS 基本額度 + 留用額度
  const grantBase = baseGrantByCMS[cms] || 0;
  const grant = grantBase + keep;

  // 剩餘額度
  const remain = Math.max(0, grant - total);

  // 部分負擔
  const rate = identityRate[idty] ?? 0.16;
  const copay = Math.round(total * rate);

  // 超額（若服務總額 > 額度總計）
  const over = Math.max(0, total - grant);

  // 自付總計 = 部分負擔 + 超額
  const selfpay = copay + over;

  // 更新畫面（右欄 + 中欄顯示）
  $("#grantQuota").value = grant.toLocaleString();
  $("#sumGrant").textContent = grant.toLocaleString();
  $("#sumRemain").textContent = remain.toLocaleString();
  $("#sumCopay").textContent = copay.toLocaleString();
  $("#sumSelfpay").textContent = selfpay.toLocaleString();
  $("#sumTotal").textContent = total.toLocaleString();

  const overMsg = $("#overMsg");
  if (over > 0) overMsg.classList.remove("hidden");
  else overMsg.classList.add("hidden");
}

/********* 重置 *********/
function resetAll() {
  $("#keepQuota").value = "";
  document.getElementById("id-normal").checked = true;
  document.getElementById("cms2").checked = true;

  document.querySelectorAll("#tables tbody tr").forEach((tr) => {
    tr.cells[2].querySelector("input").value = 0; // 週
    tr.cells[3].querySelector("input").value = 0; // 月(只讀)
    tr.cells[4].querySelector("input").value = 0; // 總次數
    tr.cells[5].textContent = "0";               // 總金額
  });

  $("#addonHint").textContent = "請儲存加成次數";
  $("#addonHint").classList.add("warn");

  updateResults();
}
