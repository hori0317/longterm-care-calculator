/* =========================
   服務資料（可直接修改維護）
   ========================= */
const serviceData = {
  // BA 照顧到宅（你提供的版）
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
    { code: "BA17c", name: "管路(尿管、鼻胃管)清潔", price: 50 },
    { code: "BA17d", name: "出診採樣/血糖機驗血糖", price: 50 },
    { code: "BA17e", name: "依指示置入藥盒", price: 50 },
    { code: "BA18", name: "安全看視", price: 50 },
    { code: "BA20", name: "陪伴服務", price: 200 },
    { code: "BA22", name: "導視服務", price: 175 },
    { code: "BA23", name: "協助洗頭", price: 130 },
    { code: "BA24", name: "協助排泄", price: 200 }
  ],

  // BB 日間照顧（你提供的版）
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

  // BC 家庭托顧（你提供的版）
  BC: [
    { code: "BC01", name: "家庭托顧(全日)-第1型", price: 625 },
    { code: "BC02", name: "家庭托顧(半日)-第1型", price: 315 },
    { code: "BC03", name: "家庭托顧(全日)-第2型", price: 760 },
    { code: "BC04", name: "家庭托顧(半日)-第2型", price: 380 },
    { code: "BC05", name: "家庭托顧(全日)-第3型", price: 790 },
    { code: "BC06", name: "家庭托顧(半日)-第3型", price: 395 },
    { code: "BC07", name: "家庭托顧(全日)-第4型", price: 885 },
    { code: "BC08", name: "家庭托顧(半日)-第4型", price: 440 },
    { code: "BC09", name: "家庭托顧(全日)-第5型", price: 960 },
    { code: "BC10", name: "家庭托顧(半日)-第5型", price: 480 },
    { code: "BC11", name: "家庭托顧(全日)-第6型", price: 980 },
    { code: "BC12", name: "家庭托顧(半日)-第6型", price: 490 },
    { code: "BC13", name: "家庭托顧(全日)-第7型", price: 1040 },
    { code: "BC14", name: "家庭托顧(半日)-第7型", price: 520 }
  ],

  // BD 社區式（你提供的版）
  BD: [
    { code: "BD01", name: "社區式協助沐浴", price: 200 },
    { code: "BD02", name: "社區式晚餐", price: 150 },
    { code: "BD03", name: "社區式服務交通接送", price: 100 }
  ],

  // CA（你指定 CA07/CA08）
  CA: [
    { code: "CA07", name: "IADLs復能、ADLs復能", price: 4500 },
    { code: "CA08", name: "個別化服務計畫(ISP)擬定與執行", price: 6000 }
  ],

  // CB（你提供的版）
  CB: [
    { code: "CB01", name: "營養照護", price: 4000 },
    { code: "CB02", name: "進食與吞嚥照護", price: 9000 },
    { code: "CB03", name: "困難行為照護", price: 9000 },
    { code: "CB04", name: "臥床或長期病房免照護", price: 5000 }
  ],

  // CC / CD（你提供的版）
  CC: [{ code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 }],
  CD: [
    { code: "CD01", name: "居家護理訪視", price: 1300 },
    { code: "CD02", name: "居家護理指導與諮詢", price: 1500 }
  ],

  // D 交通
  DA: [{ code: "DA01", name: "交通接送", price: 230 }],

  // E/F 輔具與環境（你提供的版）
  EA: [{ code: "EA01", name: "馬桶增高器、浴缸止滑墊或洗澡椅", price: 1200 }],
  EB: [
    { code: "EB01", name: "單支拐杖-不鏽鋼", price: 1000 },
    { code: "EB02", name: "單支拐杖-鋁製", price: 500 },
    { code: "EB03", name: "助行器", price: 800 },
    { code: "EB04", name: "帶輪特型助步車(助行椅)", price: 300 }
  ],
  EC: [
    { code: "EC01", name: "輪椅-A款(非標準化產製)", price: 3500 },
    { code: "EC02", name: "輪椅B款(輕便化產製)一般型", price: 4500 },
    { code: "EC03", name: "輪椅C款(重身訂製)訂製型", price: 9000 },
    { code: "EC04", name: "輪椅附加功能-A款(具利於移位功能)", price: 5000 },
    { code: "EC05", name: "輪椅附加功能-B款(具仰躺功能)", price: 2000 },
    { code: "EC06", name: "輪椅附加功能-C款(具空中傾倒功能)", price: 4000 },
    { code: "EC07", name: "擺位系統-A款(平面型椅背靠背)", price: 1000 },
    { code: "EC08", name: "擺位系統-B款(曲面型椅背靠背)", price: 6000 },
    { code: "EC09", name: "擺位系統-C款(椅背框架伸側擴架)", price: 3000 },
    { code: "EC10", name: "擺位系統-D款(椅背頸部系統)", price: 2500 },
    { code: "EC11", name: "電動輪椅(EC11, EC12擇一)(租)", price: 2500 },
    { code: "EC12", name: "電動代步車(EC11, EC12擇一)(租)", price: 1200 }
  ],
  ED: [
    { code: "ED01", name: "移位腰帶", price: 1500 },
    { code: "ED02", name: "移位板", price: 2000 },
    { code: "ED03", name: "人力移位吊帶", price: 4000 },
    { code: "ED04", name: "移位滑墊A款", price: 3000 },
    { code: "ED05", name: "移位滑墊B款", price: 3000 },
    { code: "ED06", name: "移位帶", price: 500 },
    { code: "ED07", name: "移位機(租/購)", price: 20000 },
    { code: "ED08", name: "移位機吊帶", price: 5000 }
  ],
  EE: [
    { code: "EE01", name: "電話擴音器", price: 2000 },
    { code: "EE02", name: "電話閃光提示器", price: 2000 },
    { code: "EE03", name: "火災閃光警示器", price: 2000 },
    { code: "EE04", name: "門檻閃光器", price: 2000 },
    { code: "EE05", name: "無線震動警示器", price: 2000 }
  ],
  EF: [
    { code: "EF01", name: "衣著用輔具", price: 500 },
    { code: "EF02", name: "居家生活輔具", price: 500 },
    { code: "EF03", name: "飲食用輔具", price: 500 }
  ],
  EG: [
    { code: "EG01", name: "氣墊床-A款(組購)", price: 8000 },
    { code: "EG02", name: "氣墊床-B款(組購)", price: 12000 },
    { code: "EG03", name: "輪椅座墊-A款", price: 500 },
    { code: "EG04", name: "輪椅座墊-B款", price: 10000 },
    { code: "EG05", name: "輪椅座墊-C款", price: 10000 },
    { code: "EG06", name: "輪椅座墊-D款", price: 8000 },
    { code: "EG07", name: "輪椅座墊-E款", price: 5000 },
    { code: "EG09", name: "輪椅座墊-G款", price: 5000 }
  ],
  EH: [
    { code: "EH01", name: "居家用照顧床(租/購)", price: 8000 },
    { code: "EH02", name: "居家用照顧床-附加功能款(床面升降)", price: 10000 },
    { code: "EH03", name: "居家用照顧床-附加功能款(電動升降)", price: 15000 },
    { code: "EH04", name: "床椅機(單槍)(租)", price: 700 },
    { code: "EH05", name: "床椅機(月)(租)", price: 400 }
  ],
  FA: [
    { code: "FA01", name: "居家無障礙設施-扶手", price: 150 },
    { code: "FA02", name: "居家無障礙設施-可動扶手", price: 360 },
    { code: "FA03", name: "居家無障礙設施-非固定式斜坡板A款", price: 3500 },
    { code: "FA04", name: "居家無障礙設施-非固定式斜坡板B款", price: 1500 },
    { code: "FA05", name: "居家無障礙設施-非固定式斜坡板C款", price: 1000 },
    { code: "FA06", name: "居家無障礙設施-固定式斜坡板", price: 10000 },
    { code: "FA07", name: "居家無障礙設施-浴室或地板扶手", price: 5000 },
    { code: "FA08", name: "居家無障礙設施-浴缸扶手", price: 2000 },
    { code: "FA09", name: "居家無障礙設施-隔間", price: 6000 },
    { code: "FA10", name: "居家無障礙設施-防滑措施", price: 3000 },
    { code: "FA11", name: "居家無障礙設施-門檻", price: 7000 },
    { code: "FA12", name: "居家無障礙設施-門B板", price: 10000 },
    { code: "FA13", name: "居家無障礙設施-水龍頭", price: 900 },
    { code: "FA14", name: "居家無障礙設施-浴缸", price: 7000 },
    { code: "FA15", name: "居家無障礙設施-改裝洗臉台", price: 3000 },
    { code: "FA16", name: "居家無障礙設施-改裝馬桶", price: 5000 },
    { code: "FA17", name: "居家無障礙設施-壁掛式沖水馬桶", price: 5000 },
    { code: "FA18", name: "居家無障礙設施-軟墊", price: 300 },
    { code: "FA19", name: "居家無障礙設施-特製簡易洗澡椅", price: 1000 },
    { code: "FA20", name: "居家無障礙設施-特製簡易洗澡椅", price: 2000 },
    { code: "FA21", name: "居家無障礙設施-特製簡易浴槽", price: 5000 }
  ],

  // GA 喘息（你提供的＋補足常見兩項）
  GA: [
    { code: "GA03", name: "自日間照顧中心喘息服務-全日", price: 1250 },
    { code: "GA04", name: "日間照顧中心喘息服務-半日", price: 650 },
    { code: "GA05", name: "機構住宿式喘息服務", price: 2310 },
    { code: "GA06", name: "小規模多機能服務-夜間喘息", price: 1700 },
    { code: "GA07", name: "巷弄長照站喘息", price: 200 },
    { code: "GA09", name: "居家喘息服務", price: 770 }
  ],

  // S 短期替代照顧（你先前提到 S14 / S24）
  S: [
    { code: "S14", name: "短期替代照顧(到宅)", price: 1800 },
    { code: "S24", name: "短期替代照顧(機構)", price: 2000 }
  ]
};

/* ============== 規則區 ============== */
// 以 4.5 週/月換算，且「無條件進位」
const WEEKS_PER_MONTH = 4.5;

// 若你要把「每週最小必須 >= 1」，把 ALLOW_ZERO 改成 false
const ALLOW_ZERO = true;

/* ============== 初始化 ============== */
window.addEventListener('DOMContentLoaded', () => {
  generateTables();
});

/* ============== 產表（扁平化所有碼） ============== */
function generateTables() {
  const container = document.getElementById("tables");
  container.innerHTML = "";

  // 依群組順序展開
  Object.keys(serviceData).forEach(group => {
    const section = document.createElement("section");
    const title = document.createElement("h3");
    title.textContent = `${group}碼`;
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
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    serviceData[group].forEach((item, idx) => {
      const tr = document.createElement("tr");

      // 服務項目
      const tdName = document.createElement("td");
      tdName.textContent = `${item.code} ${item.name}`;
      tdName.style.textAlign = "left";
      tr.appendChild(tdName);

      // 週次
      const tdW = document.createElement("td");
      const w = document.createElement("input");
      w.type = "number";
      w.step = "1";
      w.min  = ALLOW_ZERO ? "0" : "1"; // ← 若要強制 >=1，改 false
      w.value = "0";
      w.id = `w_${group}_${idx}`;
      w.addEventListener("input", () => weekToMonth(group, idx, item.price));
      tdW.appendChild(w);
      tr.appendChild(tdW);

      // 月次
      const tdM = document.createElement("td");
      const m = document.createElement("input");
      m.type = "number";
      m.step = "1";
      m.min  = "0";
      m.value = "0";
      m.id = `m_${group}_${idx}`;
      m.addEventListener("input", () => monthToWeek(group, idx, item.price));
      tdM.appendChild(m);
      tr.appendChild(tdM);

      // 單價
      const tdP = document.createElement("td");
      tdP.textContent = item.price.toLocaleString();
      tr.appendChild(tdP);

      // 總金額
      const tdT = document.createElement("td");
      tdT.id = `t_${group}_${idx}`;
      tdT.textContent = "0";
      tr.appendChild(tdT);

      tbody.appendChild(tr);
    });

    section.appendChild(table);
    container.appendChild(section);
  });
}

/* ============== 互算＆計算 ============== */
// 週 → 月：月 = ceil(週 × 4.5)
function weekToMonth(group, idx, price) {
  let w = parseInt(document.getElementById(`w_${group}_${idx}`).value || "0", 10);
  if (isNaN(w) || w < 0) w = 0;
  if (!ALLOW_ZERO && w < 1) w = 1;
  document.getElementById(`w_${group}_${idx}`).value = String(w);

  const m = (w <= 0) ? 0 : Math.ceil(w * WEEKS_PER_MONTH);
  document.getElementById(`m_${group}_${idx}`).value = String(m);

  calcTotal(group, idx, price);
}

// 月 → 週：週 = ceil(月 ÷ 4.5)
function monthToWeek(group, idx, price) {
  let m = parseInt(document.getElementById(`m_${group}_${idx}`).value || "0", 10);
  if (isNaN(m) || m < 0) m = 0;
  document.getElementById(`m_${group}_${idx}`).value = String(m);

  const w = (m <= 0) ? 0 : Math.ceil(m / WEEKS_PER_MONTH);
  if (!ALLOW_ZERO && w < 1 && m > 0) {
    // 若不允許 0，且 m>0，則至少為 1
    document.getElementById(`w_${group}_${idx}`).value = "1";
  } else {
    document.getElementById(`w_${group}_${idx}`).value = String(w);
  }

  calcTotal(group, idx, price);
}

// 單列總額 = 單價 × 月次
function calcTotal(group, idx, price) {
  const m = parseInt(document.getElementById(`m_${group}_${idx}`).value || "0", 10) || 0;
  const total = price * m;
  document.getElementById(`t_${group}_${idx}`).textContent = total.toLocaleString();
}

/* ============== 總計輸出 ============== */
function calculate() {
  let totalAll = 0;
  let detail = "";

  Object.keys(serviceData).forEach(group => {
    let sub = 0;
    serviceData[group].forEach((item, idx) => {
      const v = parseInt((document.getElementById(`t_${group}_${idx}`).textContent || "0").replace(/,/g, ""), 10) || 0;
      sub += v;
    });
    totalAll += sub;
    detail += `<li>${group}碼合計：${sub.toLocaleString()} 元</li>`;
  });

  document.getElementById("results").innerHTML = `
    <h3>總計：${totalAll.toLocaleString()} 元</h3>
    <ul>${detail}</ul>
  `;
}
