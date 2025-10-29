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
    { code: "BA17d", name: "通便驗血糖", price: 50 },
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
  CA: [
    { code: "CA07", name: "IADLs復能、ADLs復能照護(3次含評估)", price: 4500 },
    { code: "CA08", name: "個別化服務計畫(ISP)擬定與執行(4次含評估)", price: 6000 },
  ],
  CB: [
    { code: "CB01", name: "營養照護(3次含評估)", price: 4500 },
    { code: "CB02", name: "進食與吞嚥照護(6次含評估)", price: 9000 },
    { code: "CB03", name: "困擾行為照護(3次含評估)", price: 4500 },
    { code: "CB04", name: "臥床或長期活動受限照護(6次含評估)", price: 9000 },
  ],
  CC: [
    { code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 },
  ],
  CD: [
    { code: "CD02", name: "居家護理指導與諮詢(3次含評估+1次評估)", price: 6000 },
  ],
  GA: [
    { code: "GA09", name: "喘息2小時/支", price: 770 },
  ],
  SC: [
    { code: "SC09", name: "短期2小時/支", price: 770 },
  ],
};

// CMS × 身分別補助上限
const limitTable = {
  一般戶: [0, 0, 14320, 17920, 21520, 25120, 28720, 32320, 35920],
  中低收入戶: [0, 0, 27100, 33900, 40700, 47500, 54300, 61100, 67900],
  低收入戶: [0, 0, 36000, 45000, 54000, 63000, 72000, 81000, 90000],
};

window.onload = function () {
  generateTables();
  updateResults();
};

function generateTables() {
  const container = document.getElementById("tables");
  container.innerHTML = "";

  for (const key in serviceData) {
    const section = document.createElement("section");
    section.innerHTML = `<h3>${key} 碼</h3>`;
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>服務項目</th>
          <th>單價</th>
          <th>週次數</th>
          <th>月次數</th>
          <th>總金額</th>
        </tr>
      </thead>
      <tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    serviceData[key].forEach((item, i) => {
      const row = tbody.insertRow();
      row.insertCell().textContent = `${item.code} ${item.name}`;
      row.insertCell().textContent = item.price;

      const weekInput = document.createElement("input");
      weekInput.type = "number";
      weekInput.min = "1";
      weekInput.value = "0";
      weekInput.oninput = () => updateRow(key, i);
      row.insertCell().appendChild(weekInput);

      const monthInput = document.createElement("input");
      monthInput.type = "number";
      monthInput.min = "0";
      monthInput.value = "0";
      monthInput.readOnly = true;
      row.insertCell().appendChild(monthInput);

      const totalCell = row.insertCell();
      totalCell.textContent = "0";
    });

    section.appendChild(table);
    container.appendChild(section);
  }
}

function updateRow(code, i) {
  const table = document.querySelectorAll("table");
  const section = serviceData[code][i];
  const weekInput = table[getSectionIndex(code)].rows[i + 1].cells[2].querySelector("input");
  const monthInput = table[getSectionIndex(code)].rows[i + 1].cells[3].querySelector("input");
  const totalCell = table[getSectionIndex(code)].rows[i + 1].cells[4];

  let week = parseInt(weekInput.value) || 0;
  const month = Math.ceil(week * 4.5);
  monthInput.value = month;
  const total = month * section.price;
  totalCell.textContent = total.toLocaleString();

  updateResults();
}

function getSectionIndex(code) {
  return Object.keys(serviceData).indexOf(code);
}

function updateResults() {
  let total = 0;
  document.querySelectorAll("table tbody tr").forEach((row) => {
    total += parseInt(row.cells[4].textContent.replace(/,/g, "")) || 0;
  });

  const cms = parseInt(document.getElementById("cmsLevel").value);
  const identity = document.getElementById("identity").value;
  const limit = limitTable[identity][cms];
  const remain = Math.max(0, limit - total);

  document.getElementById("totalAmount").textContent = `總額：${total.toLocaleString()} 元`;
  document.getElementById("limitAmount").textContent = `補助上限：${limit.toLocaleString()} 元`;
  document.getElementById("remainAmount").textContent = `剩餘額度：${remain.toLocaleString()} 元`;

  const over = document.getElementById("overMsg");
  if (total > limit) over.classList.remove("hidden");
  else over.classList.add("hidden");
}

function resetAll() {
  document.querySelectorAll("input[type='number']").forEach((input) => (input.value = 0));
  updateResults();
}
