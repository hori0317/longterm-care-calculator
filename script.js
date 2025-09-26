/* -------------------------
   服務資料（全碼別）
-------------------------- */
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
    { code: "BA17d", name: "通便/驗血糖", price: 50 },
    { code: "BA17e", name: "依指示置入藥盒", price: 50 },
    { code: "BA18", name: "安全看視", price: 50 },
    { code: "BA20", name: "陪伴服務", price: 200 },
    { code: "BA22", name: "導視服務", price: 175 },
    { code: "BA23", name: "協助洗頭", price: 130 },
    { code: "BA24", name: "協助排泄", price: 200 }
  ],
  BB: [
    { code: "BB01", name: "日照(全日)-第1型", price: 675 },
    { code: "BB02", name: "日照(半日)-第1型", price: 340 },
    { code: "BB03", name: "日照(全日)-第2型", price: 840 },
    { code: "BB04", name: "日照(半日)-第2型", price: 420 },
    { code: "BB05", name: "日照(全日)-第3型", price: 920 },
    { code: "BB06", name: "日照(半日)-第3型", price: 460 },
    { code: "BB07", name: "日照(全日)-第4型", price: 1045 },
    { code: "BB08", name: "日照(半日)-第4型", price: 525 },
    { code: "BB09", name: "日照(全日)-第5型", price: 1130 },
    { code: "BB10", name: "日照(半日)-第5型", price: 565 },
    { code: "BB11", name: "日照(全日)-第6型", price: 1210 },
    { code: "BB12", name: "日照(半日)-第6型", price: 605 },
    { code: "BB13", name: "日照(全日)-第7型", price: 1285 },
    { code: "BB14", name: "日照(半日)-第7型", price: 645 }
  ],
  BC: [
    { code: "BC01", name: "家托(全日)-第1型", price: 625 },
    { code: "BC02", name: "家托(半日)-第1型", price: 315 },
    { code: "BC03", name: "家托(全日)-第2型", price: 760 },
    { code: "BC04", name: "家托(半日)-第2型", price: 380 },
    { code: "BC05", name: "家托(全日)-第3型", price: 790 },
    { code: "BC06", name: "家托(半日)-第3型", price: 395 },
    { code: "BC07", name: "家托(全日)-第4型", price: 885 },
    { code: "BC08", name: "家托(半日)-第4型", price: 440 },
    { code: "BC09", name: "家托(全日)-第5型", price: 960 },
    { code: "BC10", name: "家托(半日)-第5型", price: 480 },
    { code: "BC11", name: "家托(全日)-第6型", price: 980 },
    { code: "BC12", name: "家托(半日)-第6型", price: 490 },
    { code: "BC13", name: "家托(全日)-第7型", price: 1040 },
    { code: "BC14", name: "家托(半日)-第7型", price: 520 }
  ],
  BD: [
    { code: "BD01", name: "社區式協助沐浴", price: 200 },
    { code: "BD02", name: "社區式晚餐", price: 150 },
    { code: "BD03", name: "社區式服務交通接送", price: 100 }
  ],
  CA: [
    { code: "CA07", name: "IADLs/ADLs復能", price: 4500 },
    { code: "CA08", name: "ISP 擬定與執行", price: 6000 }
  ],
  CB: [
    { code: "CB01", name: "營養照護", price: 4000 },
    { code: "CB02", name: "進食與吞嚥照護", price: 9000 },
    { code: "CB03", name: "困難行為照護", price: 9000 },
    { code: "CB04", name: "臥床或長期病房免照護", price: 5000 }
  ],
  CC: [{ code: "CC01", name: "居家環境安全/無障礙規劃", price: 2000 }],
  CD: [
    { code: "CD01", name: "居家護理訪視", price: 1300 },
    { code: "CD02", name: "居家護理指導與諮詢", price: 1500 }
  ],
  DA: [{ code: "DA01", name: "交通接送", price: 230 }],
  EA: [{ code: "EA01", name: "馬桶增高器/止滑墊/洗澡椅", price: 1200 }],
  EB: [
    { code: "EB01", name: "單支拐杖-不鏽鋼", price: 1000 },
    { code: "EB02", name: "單支拐杖-鋁製", price: 500 },
    { code: "EB03", name: "助行器", price: 800 },
    { code: "EB04", name: "帶輪助步車(助行椅)", price: 300 }
  ],
  EC: [
    { code: "EC01", name: "輪椅A(非標準化)", price: 3500 },
    { code: "EC02", name: "輪椅B(輕便)", price: 4500 },
    { code: "EC03", name: "輪椅C(訂製)", price: 9000 },
    { code: "EC04", name: "輪椅附加功能A(移位)", price: 5000 },
    { code: "EC05", name: "輪椅附加功能B(仰躺)", price: 2000 },
    { code: "EC06", name: "輪椅附加功能C(傾倒)", price: 4000 },
    { code: "EC07", name: "擺位系統A", price: 1000 },
    { code: "EC08", name: "擺位系統B", price: 6000 },
    { code: "EC09", name: "擺位系統C", price: 3000 },
    { code: "EC10", name: "擺位系統D(頸部)", price: 2500 },
    { code: "EC11", name: "電動輪椅(租)", price: 2500 },
    { code: "EC12", name: "電動代步車(租)", price: 1200 }
  ],
  ED: [
    { code: "ED01", name: "移位腰帶", price: 1500 },
    { code: "ED02", name: "移位板", price: 2000 },
    { code: "ED03", name: "人力移位吊帶", price: 4000 },
    { code: "ED04", name: "移位滑墊A", price: 3000 },
    { code: "ED05", name: "移位滑墊B", price: 3000 },
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
    { code: "EG01", name: "氣墊床A(組購)", price: 8000 },
    { code: "EG02", name: "氣墊床B(組購)", price: 12000 },
    { code: "EG03", name: "輪椅座墊A", price: 500 },
    { code: "EG04", name: "輪椅座墊B", price: 10000 },
    { code: "EG05", name: "輪椅座墊C", price: 10000 },
    { code: "EG06", name: "輪椅座墊D", price: 8000 },
    { code: "EG07", name: "輪椅座墊E", price: 5000 },
    { code: "EG09", name: "輪椅座墊G", price: 5000 }
  ],
  EH: [
    { code: "EH01", name: "居家用照顧床(租/購)", price: 8000 },
    { code: "EH02", name: "照顧床附加(床面升降)", price: 10000 },
    { code: "EH03", name: "照顧床附加(電動升降)", price: 15000 },
    { code: "EH04", name: "床椅機(單槍)(租)", price: 700 },
    { code: "EH05", name: "床椅機(月)(租)", price: 400 }
  ],
  FA: [
    { code: "FA01", name: "居家無障礙-扶手", price: 150 },
    { code: "FA02", name: "居家無障礙-可動扶手", price: 360 },
    { code: "FA03", name: "居家無障礙-斜坡板A", price: 3500 },
    { code: "FA04", name: "居家無障礙-斜坡板B", price: 1500 },
    { code: "FA05", name: "居家無障礙-斜坡板C", price: 1000 },
    { code: "FA06", name: "居家無障礙-固定式斜坡板", price: 10000 },
    { code: "FA07", name: "浴室或地板扶手", price: 5000 },
    { code: "FA08", name: "浴缸扶手", price: 2000 },
    { code: "FA09", name: "隔間", price: 6000 },
    { code: "FA10", name: "防滑措施", price: 3000 },
    { code: "FA11", name: "門檻", price: 7000 },
    { code: "FA12", name: "門B板", price: 10000 },
    { code: "FA13", name: "水龍頭", price: 900 },
    { code: "FA14", name: "浴缸", price: 7000 },
    { code: "FA15", name: "改裝洗臉台", price: 3000 },
    { code: "FA16", name: "改裝馬桶", price: 5000 },
    { code: "FA17", name: "壁掛式沖水馬桶", price: 5000 },
    { code: "FA18", name: "軟墊", price: 300 },
    { code: "FA19", name: "特製簡易洗澡椅", price: 1000 },
    { code: "FA20", name: "特製簡易洗澡椅(款2)", price: 2000 },
    { code: "FA21", name: "特製簡易浴槽", price: 5000 }
  ],
  GA: [
    { code: "GA03", name: "日照中心喘息-全日", price: 1250 },
    { code: "GA04", name: "日照中心喘息-半日", price: 650 },
    { code: "GA05", name: "機構住宿式喘息", price: 2310 },
    { code: "GA06", name: "小規模多機能-夜間喘息", price: 1700 },
    { code: "GA07", name: "巷弄長照站喘息", price: 200 },
    { code: "GA09", name: "居家喘息服務", price: 770 }
  ]
};

/* 常用月上限（可改成你單位版本） */
const capsByCMS = {
  2: 20000,
  3: 32000,
  4: 36000,
  5: 44000,
  6: 56000,
  7: 70000,
  8: 90000
};

const WEEKS_PER_MONTH = 4.33;

let currentCopayRate = 0.16;
let currentCMS = 2;

/* 初始化 */
window.addEventListener('DOMContentLoaded', () => {
  wireIdentity();
  wireCMS();
  renderServiceTable();
  updateCapsAndSummary();
  document.getElementById('reservedBudget').addEventListener('input', updateCapsAndSummary);
  document.getElementById('resetBtn').addEventListener('click', resetAll);
});

/* 身分別切換 */
function wireIdentity(){
  document.querySelectorAll('.seg-btn[data-copay]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.seg-btn[data-copay]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentCopayRate = +btn.dataset.copay;
      updateCapsAndSummary();
    });
  });
}

/* CMS 切換 */
function wireCMS(){
  document.querySelectorAll('#cmsSeg .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#cmsSeg .seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentCMS = +btn.dataset.cms;
      updateCapsAndSummary();
    });
  });
}

/* 產出大表（扁平化所有碼） */
function renderServiceTable(){
  const tbody = document.querySelector('#serviceTable tbody');
  tbody.innerHTML = '';

  const allRows = [];
  Object.keys(serviceData).forEach(group=>{
    serviceData[group].forEach(item=>{
      allRows.push({ group, ...item });
    });
  });
  // 依代碼排序（BA01、BA02…）
  allRows.sort((a,b)=> a.code.localeCompare(b.code, 'zh-Hant'));

  allRows.forEach((item, idx)=>{
    const tr = document.createElement('tr');

    const td0 = document.createElement('td');
    td0.style.textAlign = 'left';
    td0.innerHTML = `<div><strong>${item.code}</strong> ${item.name}</div>`;
    tr.appendChild(td0);

    const td1 = document.createElement('td');      // 價格
    td1.textContent = item.price.toLocaleString();
    tr.appendChild(td1);

    const td2 = document.createElement('td');      // 週次
    const w = document.createElement('input');
    w.type='number'; w.min='0'; w.step='0.1'; w.value='0';
    w.id = `w_${item.code}_${idx}`;
    w.addEventListener('input', ()=>weekToMonth(item.code, idx));
    td2.appendChild(w); tr.appendChild(td2);

    const td3 = document.createElement('td');      // 月次
    const m = document.createElement('input');
    m.type='number'; m.min='0'; m.step='0.1'; m.value='0';
    m.id = `m_${item.code}_${idx}`;
    m.addEventListener('input', ()=>monthToWeek(item.code, idx));
    td3.appendChild(m); tr.appendChild(td3);

    const td4 = document.createElement('td');      // 總次數（=月次）
    td4.id = `t_${item.code}_${idx}`;
    td4.textContent = '0';
    tr.appendChild(td4);

    const td5 = document.createElement('td');      // 使用額度
    td5.id = `u_${item.code}_${idx}`;
    td5.textContent = '0';
    tr.appendChild(td5);

    tbody.appendChild(tr);
  });
}

/* 互算＆更新 */
function weekToMonth(code, idx){
  const w = +document.getElementById(`w_${code}_${idx}`).value || 0;
  const m = (w * WEEKS_PER_MONTH);
  document.getElementById(`m_${code}_${idx}`).value = m.toFixed(1);
  calcRow(code, idx);
}
function monthToWeek(code, idx){
  const m = +document.getElementById(`m_${code}_${idx}`).value || 0;
  const w = (m / WEEKS_PER_MONTH);
  document.getElementById(`w_${code}_${idx}`).value = w.toFixed(1);
  calcRow(code, idx);
}
function calcRow(code, idx){
  const m = +document.getElementById(`m_${code}_${idx}`).value || 0;
  document.getElementById(`t_${code}_${idx}`).textContent = m.toFixed(1);

  // 找 price
  let price = 0;
  outer: for(const g in serviceData){
    for(const it of serviceData[g]){
      if(it.code === code){ price = it.price; break outer; }
    }
  }
  const used = Math.round(price * m);
  document.getElementById(`u_${code}_${idx}`).textContent = used.toLocaleString();
  updateCapsAndSummary();
}

/* 統計/額度/自付 */
function updateCapsAndSummary(){
  // 使用額度總和
  let used = 0;
  document.querySelectorAll('[id^="u_"]').forEach(td=>{
    used += +(td.textContent.replace(/,/g,'')) || 0;
  });
  document.getElementById('usedBudget').value = used.toLocaleString();

  // 額度上限
  const cap = capsByCMS[currentCMS] || 0;
  document.getElementById('capTotal').textContent = cap.toLocaleString();

  // 留用額度
  const reserved = +(document.getElementById('reservedBudget').value || 0);

  // 剩餘額度
  const remain = Math.max(cap - reserved - used, 0);
  document.getElementById('capRemain').textContent = remain.toLocaleString();

  // 部分負擔與自付總計（這裡假設=使用額度×身分別比例）
  const copay = Math.round(used * currentCopayRate);
  document.getElementById('copay').textContent = copay.toLocaleString();
  document.getElementById('selfTotal').textContent = copay.toLocaleString();
}

/* 重置 */
function resetAll(){
  document.querySelectorAll('input[type="number"]').forEach(i=>{ if(i.id.startsWith('w_')||i.id.startsWith('m_')) i.value='0'; });
  document.querySelectorAll('[id^="t_"],[id^="u_"]').forEach(td=>td.textContent='0');
  document.getElementById('reservedBudget').value = '0';
  document.getElementById('usedBudget').value = '0';
  updateCapsAndSummary();
}
