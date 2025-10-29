/**********************
 * 服務清單
 *  — BA, BD, GA, SC 獨立
 *  — C碼 = 合併 CA/CB/CC/CD
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
    // CA
    { code: "CA07", name: "IADLs/ADLs 復能照護(3次含評估)", price: 4500 },
    { code: "CA08", name: "ISP擬定與執行(4次含評估)", price: 6000 },
    // CB
    { code: "CB01", name: "營養照護(3次含評估)", price: 4500 },
    { code: "CB02", name: "進食與吞嚥照護(6次含評估)", price: 9000 },
    { code: "CB03", name: "困擾行為照護(3次含評估)", price: 4500 },
    { code: "CB04", name: "臥床/長期活動受限照護(6次含評估)", price: 9000 },
    // CC
    { code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 },
    // CD
    { code: "CD02", name: "居家護理指導與諮詢(3次+1次評估)", price: 6000 },
  ],
  GA: [
    { code: "GA09", name: "喘息2小時/支", price: 770 },
  ],
  SC: [
    { code: "SC09", name: "短照2小時/支", price: 770 },
  ],
};

/********* 加成（左卡示意） *********/
const addonItems = [
  { code: "AA05", name: "項目AA05", price: 0, key: "AA05" },
  { code: "AA06", name: "項目AA06", price: 0, key: "AA06" },
  { code: "AA08", name: "項目AA08", price: 0, key: "AA08" },
  { code: "AA09", name: "項目AA09", price: 0, key: "AA09" },
  { code: "AA11", name: "項目AA11", price: 0, key: "AA11" },
];

/********* 上限（依身分別×CMS等級） *********/
const limitTable = {
  "一般戶":     [0, 0, 14320, 17920, 21520, 25120, 28720, 32320, 35920],
  "中低收入戶": [0, 0, 27100, 33900, 40700, 47500, 54300, 61100, 67900],
  "低收入戶":   [0, 0, 36000, 45000, 54000, 63000, 72000, 81000, 90000],
};

const WEEKS_PER_MONTH = 4.5; // 以 4.5 週換算
const $ = (sel) => document.querySelector(sel);

/********* Init *********/
window.onload = () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  updateResults();
};

/********* 左卡：加成 *********/
function renderAddons() {
  const host = $("#addonRows");
  host.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("addons") || "{}");

  addonItems.forEach((it) => {
    const row = document.createElement("div");
    row.className = "addon-row";
    row.innerHTML = `
      <div>${it.code}</div>
      <div><input type="number" min="0" step="1" value="${saved[`${it.key}_p`] ?? 0}" id="${it.key}_p"></div>
      <div><input type="number" min="0" step="1" value="${saved[`${it.key}_n`] ?? 0}" id="${it.key}_n"></div>
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
  $("#addonHint").textContent = "已儲存加成次數";
  $("#addonHint").classList.remove("warn");
}

/********* 表格渲染 *********/
function renderTables() {
  const container = $("#tables");
  container.innerHTML = "";

  Object.keys(serviceData).forEach((code) => {
    const cardTitle = ({
      BA: "BA碼（照顧服務）",
      BD: "BD碼（社區服務）",
      C:  "C碼（專業服務）",
      GA: "GA碼（喘息服務）",
      SC: "SC碼（短期替代照顧）",
    })[code] || `${code}碼`;

    const section = document.createElement("section");
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th style="min-width:240px">服務項目</th>
          <th>單價</th>
          <th>週次數</th>
          <th>月次數</th>
          <th>總金額</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const caption = document.createElement("div");
    caption.className = "card-title";
    caption.textContent = cardTitle;
    section.appendChild(caption);

    const tbody = table.querySelector("tbody");
    serviceData[code].forEach((item, i) => {
      const tr = document.createElement("tr");

      const td0 = tr.insertCell(); td0.textContent = `${item.code} ${item.name}`;
      const td1 = tr.insertCell(); td1.textContent = item.price.toLocaleString();

      const td2 = tr.insertCell();
      const weekInput = document.createElement("input");
      weekInput.type = "number"; weekInput.min = "1"; weekInput.step = "1"; weekInput.value = "0";
      weekInput.oninput = () => updateRow(code, i);
      td2.appendChild(weekInput);

      const td3 = tr.insertCell();
      const monthInput = document.createElement("input");
      monthInput.type = "number"; monthInput.min = "0"; monthInput.step = "1"; monthInput.value = "0"; monthInput.readOnly = true;
      td3.appendChild(monthInput);

      const td4 = tr.insertCell(); td4.textContent = "0";

      tbody.appendChild(tr);
    });

    section.appendChild(table);
    container.appendChild(section);
  });
}

/********* 行更新：週→月(無條件進位)、金額 *********/
function updateRow(code, idx) {
  const tableIndex = Object.keys(serviceData).indexOf(code);
  const table = document.querySelectorAll("#tables table")[tableIndex];
  const row = table.tBodies[0].rows[idx];

  const price = serviceData[code][idx].price;
  const week = Math.max(0, parseInt(row.cells[2].querySelector("input").value) || 0);

  const month = Math.ceil(week * WEEKS_PER_MONTH);
  row.cells[3].querySelector("input").value = month;

  const total = price * month;
  row.cells[4].textContent = total.toLocaleString();

  updateResults();
}

/********* 條件變更綁定 *********/
function bindHeaderInputs() {
  document.querySelectorAll("input[name='idty']").forEach(el => el.addEventListener("change", updateResults));
  document.querySelectorAll("input[name='cms']").forEach(el => el.addEventListener("change", updateResults));
}

/********* 計算摘要 *********/
function updateResults() {
  // 1) 服務總額
  let totalService = 0;
  document.querySelectorAll("#tables tbody tr").forEach(tr => {
    totalService += parseInt(tr.cells[4].textContent.replace(/,/g, "")) || 0;
  });

  // 2) 條件
  const idty = (document.querySelector("input[name='idty']:checked") || {}).value || "一般戶";
  const cms = parseInt((document.querySelector("input[name='cms']:checked") || {}).value || "2");
  const keep = Math.max(0, parseInt($("#keepQuota").value) || 0);

  // 3) 上限＆可用額度
  const grant = limitTable[idty][cms] || 0;
  const usable = Math.max(0, grant - keep);

  // 4) 超額/自付
  const selfpay = Math.max(0, totalService - usable);
  const remain = Math.max(0, usable - totalService);

  // 5) 顯示
  $("#grantQuota").value = grant.toLocaleString();
  $("#sumTotal").textContent   = totalService.toLocaleString();
  $("#sumRemain").textContent  = remain.toLocaleString();
  $("#sumCopay").textContent   = selfpay.toLocaleString();
  $("#sumSelfpay").textContent = selfpay.toLocaleString();

  const over = $("#overMsg");
  if (totalService > usable) over.classList.remove("hidden");
  else over.classList.add("hidden");
}

/********* 重置 *********/
function resetAll() {
  // 條件
  $("#keepQuota").value = "";
  document.getElementById("id-normal").checked = true;
  document.getElementById("cms2").checked = true;

  // 表格
  document.querySelectorAll("#tables tbody tr").forEach(tr => {
    tr.cells[2].querySelector("input").value = 0; // week
    tr.cells[3].querySelector("input").value = 0; // month
    tr.cells[4].textContent = "0";               // total
  });

  // 左卡加成提示
  $("#addonHint").textContent = "請儲存加成次數";
  $("#addonHint").classList.add("warn");

  updateResults();
}
