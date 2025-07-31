const serviceData = {
  BA: [
    { code: "BA01", name: "基本身體清潔", price: 260 },
    { code: "BA02", name: "基本日常照顧", price: 195 },
    { code: "BA03", name: "測量生命徵象", price: 35 },
    { code: "BA04", name: "協助進食或管灌餵食", price: 120 },
    { code: "BA05", name: "餐食照顧", price: 310 },
    { code: "BA07", name: "協助沐浴及洗頭", price: 325 },
    { code: "BA08", name: "足部照護", price: 500 },
    { code: "BA09", name: "到宅沐浴車服務-第1型", price: 2200 },
    { code: "BA09a", name: "到宅沐浴車服務-第2型", price: 2500 },
    { code: "BA10", name: "翻身拍背", price: 155 },
    { code: "BA11", name: "肢體關節活動", price: 195 },
    { code: "BA12", name: "協助上下(下)樓梯", price: 130 },
    { code: "BA13", name: "陪同外出", price: 195 },
    { code: "BA14", name: "陪同就醫", price: 685 },
    { code: "BA15-1", name: "家務協助(自用)", price: 195 },
    { code: "BA15-2", name: "家務協助(共用)", price: 114 },
    { code: "BA16", name: "代購或代表領或代送服務(自用)", price: 130 },
    { code: "BA16-2", name: "代購或代表領或代送服務(共用)", price: 76 },
    { code: "BA17a", name: "人工氣道管內分泌物吸物", price: 75 },
    { code: "BA17b", name: "口鼻抽吸", price: 65 },
    { code: "BA17C", name: "管路(尿管、鼻胃管)清潔", price: 50 },
    { code: "BA17d", name: "出診採樣/血糖機驗血糖", price: 50 },
    { code: "BA17e", name: "依指示置入藥盒", price: 50 },
    { code: "BA18", name: "安全看視", price: 50 },
    { code: "BA20", name: "陪伴服務", price: 200 },
    { code: "BA22", name: "導視服務", price: 175 },
    { code: "BA23", name: "協助洗頭", price: 130 },
    { code: "BA24", name: "協助排泄", price: 200 }
  ],
  BB: [
    { code: "BB01", name: "日間照顧(全日)-第1型", price: 675 },
    { code: "BB02", name: "日間照顧(半日)-第1型", price: 340 },
    { code: "BB03", name: "日間照顧(全日)-第2型", price: 840 },
    { code: "BB04", name: "日間照顧(半日)-第2型", price: 420 },
    { code: "BB05", name: "日間照顧(全日)-第3型", price: 920 },
    { code: "BB06", name: "日間照顧(半日)-第3型", price: 460 },
    { code: "BB07", name: "日間照顧(全日)-第4型", price: 1045 },
    { code: "BB08", name: "日間照顧(半日)-第4型", price: 525 },
    { code: "BB09", name: "日間照顧(全日)-第5型", price: 1130 },
    { code: "BB10", name: "日間照顧(半日)-第5型", price: 565 },
    { code: "BB11", name: "日間照顧(全日)-第6型", price: 1210 },
    { code: "BB12", name: "日間照顧(半日)-第6型", price: 605 },
    { code: "BB13", name: "日間照顧(全日)-第7型", price: 1285 },
    { code: "BB14", name: "日間照顧(半日)-第7型", price: 645 }
  ],
  // ...其餘碼別請依上方完整對照表續補
};

window.onload = function() {
  generateTables();
};

function generateTables() {
  const tableContainer = document.getElementById("tables");
  tableContainer.innerHTML = "";
  for (const code in serviceData) {
    const section = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = code + "碼";
    section.appendChild(title);

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>服務項目</th>
          <th>每週次數</th>
          <th>每月次數</th>
          <th>單價</th>
          <th>總金額</th>
        </tr>
      </thead>
      <tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    serviceData[code].forEach((item, i) => {
      const row = tbody.insertRow();
      row.insertCell().textContent = `${item.code} ${item.name}`;
      const weekCell = row.insertCell();
      const weekInput = document.createElement("input");
      weekInput.type = "number";
      weekInput.value = 0;
      weekInput.min = 0;
      weekInput.id = `${code}_week_${i}`;
      weekInput.oninput = () => autoCalcMonth(code, i);
      weekCell.appendChild(weekInput);

      const monthCell = row.insertCell();
      const monthInput = document.createElement("input");
      monthInput.type = "number";
      monthInput.value = 0;
      monthInput.min = 0;
      monthInput.id = `${code}_month_${i}`;
      monthInput.oninput = () => calcTotal(code, i);
      monthCell.appendChild(monthInput);

      row.insertCell().textContent = item.price;

      const totalCell = row.insertCell();
      totalCell.id = `${code}_total_${i}`;
      totalCell.textContent = 0;
    });

    section.appendChild(table);
    tableContainer.appendChild(section);
  }
}

function autoCalcMonth(code, i) {
  const week = Number(document.getElementById(`${code}_week_${i}`).value);
  const month = week * 4.5;
  document.getElementById(`${code}_month_${i}`).value = month.toFixed(1);
  calcTotal(code, i);
}

function calcTotal(code, i) {
  const price = serviceData[code][i].price;
  const month = Number(document.getElementById(`${code}_month_${i}`).value);
  const total = price * month;
  document.getElementById(`${code}_total_${i}`).textContent = total.toFixed(0);
}

function calculate() {
  let totalAll = 0;
  let detail = "";
  for (const code in serviceData) {
    let subTotal = 0;
    for (let i = 0; i < serviceData[code].length; i++) {
      subTotal += Number(document.getElementById(`${code}_total_${i}`).textContent);
    }
    detail += `<li>${code}碼合計：${subTotal} 元</li>`;
    totalAll += subTotal;
  }
  document.getElementById("results").innerHTML =
    `<h3>總計：${totalAll} 元</h3><ul>${detail}</ul>`;
}
