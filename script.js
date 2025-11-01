/**********************
 * script.js（總次數修正版｜穩定）
 **********************/

/* ── 公用 ── */
function toInt(v){
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : 0;
  if (v === null || v === undefined) return 0;
  const fw={'０':'0','１':'1','２':'2','３':'3','４':'4','５':'5','６':'6','７':'7','８':'8','９':'9','，':',','．':'.','＋':'+','－':'-'};
  let s=String(v).replace(/[０-９，．＋－]/g,ch=>fw[ch]??ch);
  s=s.replace(/,/g,'').trim();
  const m=s.match(/^[+-]?\d+/);
  return m?parseInt(m[0],10):0;
}
const $ = s => document.querySelector(s);
const WEEKS_PER_MONTH = 4.5;

/* ── AA 區（只顯示項目＋次數；計算用） ── */
const AA_PRICE = { AA05:200, AA06:200, AA08:385, AA09:770, AA11:50 };
const ADDONS = Object.keys(AA_PRICE).map(code=>({code}));

/* ── 服務清單 ── */
const serviceData = {
  BA: [
    { code:"BA01", name:"基本身體清潔", price:260 },
    { code:"BA02", name:"基本日常照顧", price:195 },
    { code:"BA03", name:"測量生命徵象", price:35 },
    { code:"BA04", name:"協助進食或管灌", price:130 },
    { code:"BA05", name:"餐食照顧", price:310 },
    { code:"BA07", name:"協助沐浴及洗頭", price:325 },
    { code:"BA08", name:"足部照護", price:500 },
    { code:"BA09", name:"到宅沐浴-1", price:2200 },
    { code:"BA09a", name:"到宅沐浴-2", price:2500 },
    { code:"BA10", name:"翻身拍背", price:155 },
    { code:"BA11", name:"肢體關節活動", price:195 },
    { code:"BA12", name:"協助上下樓梯", price:130 },
    { code:"BA13", name:"陪同外出", price:195 },
    { code:"BA14", name:"陪同就醫", price:685 },
    { code:"BA15", name:"家務協助", price:195 },
    { code:"BA16", name:"代購", price:130 },
    { code:"BA17a", name:"人工氣道管抽吸", price:75 },
    { code:"BA17b", name:"口腔內抽吸", price:65 },
    { code:"BA17c", name:"管路清潔", price:50 },
    { code:"BA17d", name:"通便/驗血糖", price:50 },
    { code:"BA17e", name:"依指示置入藥盒", price:50 },
    { code:"BA18", name:"安全看視", price:200 },
    { code:"BA20", name:"陪伴服務", price:175 },
    { code:"BA22", name:"巡視服務", price:130 },
    { code:"BA23", name:"協助洗頭", price:200 },
    { code:"BA24", name:"協助排泄", price:220 },
  ],
  BD: [
    { code:"BD01", name:"社區式協助沐浴", price:200 },
    { code:"BD02", name:"社區式晚餐", price:150 },
    { code:"BD03", name:"社區式服務交通接送", price:115 },
  ],
  C: [
    { code:"CA07", name:"IADLs/ADLs 復能照護(3次含評估)", price:4500 },
    { code:"CA08", name:"ISP擬定與執行(4次含評估)", price:6000 },
    { code:"CB01", name:"營養照護(3次含評估)", price:6000 },
    { code:"CB02", name:"進食與吞嚥照護(6次含評估)", price:9000 },
    { code:"CB03", name:"困擾行為照護(3次含評估)", price:4500 },
    { code:"CB04", name:"臥床/長期活動受限照護(6次含評估)", price:9000 },
    { code:"CC01", name:"居家環境安全或無障礙空間規劃", price:2000 },
    { code:"CD02", name:"居家護理指導與諮詢(3次+1次評估)", price:6000 },
  ],
  GA: [{ code:"GA09", name:"喘息 2 小時/支", price:770 }],
  SC: [{ code:"SC09", name:"短照 2 小時/支", price:770 }],
};

/* ── 額度 ── */
const cmsQuota = { 2:10020, 3:15460, 4:18580, 5:24100, 6:28070, 7:32090, 8:36180 };
const GA_CAP   = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
const SC_CAP   = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };

/* ── 狀態 ── */
let currentUnit = localStorage.getItem("unit") || ($("#btnUnitToggle")?.dataset.unit || "B");
const lastCalc  = { gov_inc:0, self_inc:0, gov_exC:0, self_exC:0 };

/* ── 初始化 ── */
document.addEventListener('DOMContentLoaded', () => {
  renderAddons();
  renderTables();
  bindHeaderInputs();
  bindUnitToggle();
  applyUnitEffects();
  updateSCAvailability();
  updateResults();

  $("#btnSaveAddons")?.addEventListener("click", ()=>{ saveAddons(); updateResults(); });
  $("#btnReset")?.addEventListener("click", resetAll);

  // 避位（頂/底列）
  adjustTopbarPadding();
  adjustDockPadding();
  window.addEventListener('resize', ()=>{ adjustTopbarPadding(); adjustDockPadding(); });
  window.addEventListener('orientationchange', ()=>{ adjustTopbarPadding(); adjustDockPadding(); });

  const dock = document.getElementById('bottomDock');
  if(window.ResizeObserver && dock){ new ResizeObserver(()=>adjustDockPadding()).observe(dock); }
  const topbar = document.querySelector('.topbar');
  if(window.ResizeObserver && topbar){ new ResizeObserver(()=>adjustTopbarPadding()).observe(topbar); }
});

/* ── AA 區 ── */
function renderAddons(){
  const saved = JSON.parse(localStorage.getItem("addons")||"{}");
  const host = $("#addonRows"); if(!host) return;
  host.innerHTML="";
  ADDONS.forEach(a=>{
    const row = document.createElement("div");
    row.className="addon-row";
    row.innerHTML = `
      <div>${a.code}</div>
      <div class="addon-inputs">
        <input type="number" id="${a.code}_count" value="${toInt(saved[`${a.code}_count`])}" min="0" step="1" />
      </div>`;
    host.appendChild(row);
  });
}
function saveAddons(){
  const data={};
  ADDONS.forEach(a=>{
    data[`${a.code}_count`] = toInt($(`#${a.code}_count`)?.value);
  });
  localStorage.setItem("addons", JSON.stringify(data));
  const hint=$("#addonHint"); if(hint){ hint.textContent="已儲存加成次數"; hint.classList.remove("warn"); }
}

/* ── 表格：分群生成（C 與其餘邏輯不同） ── */
function renderTables(){
  const container = $("#tables"); if(!container) return;
  container.innerHTML="";
  const titles = {
    BA:"BA碼（照顧服務）",
    BD:"BD碼（社區服務）",
    C :"C碼（專業服務｜一包制）",
    GA:"GA碼（喘息服務）",
    SC:"SC碼（短期替代照顧）"
  };

  Object.keys(serviceData).forEach(code=>{
    const groupBox = document.createElement("div");
    groupBox.dataset.group = code;

    const h3=document.createElement("h3"); h3.textContent=titles[code];
    const table=document.createElement("table");

    if(code === "C"){
      table.innerHTML = `
        <thead><tr>
          <th style="min-width:260px">服務項目</th>
          <th>單價(每組)</th>
          <th>每月組數</th>
          <th>總金額</th>
        </tr></thead>
        <tbody></tbody>`;
    }else{
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
    }

    const tbody=table.querySelector("tbody");

    serviceData[code].forEach((item,i)=>{
      const tr=document.createElement("tr");
      tr.dataset.manual = "0";  // 0=未手動，1=手動
      tr.dataset.use    = "0";  // 最終使用的「次數」（或 C 的組數）

      if(code === "C"){
        tr.dataset.cmode = "1";
        tr.innerHTML = `
          <td>${item.code} ${item.name}</td>
          <td class="cell-price">${item.price.toLocaleString()}</td>
          <td><input class="inp-c-groups" type="number" min="0" step="1" value="0" /></td>
          <td class="cell-amount">0</td>`;
        const gInp = tr.querySelector(".inp-c-groups");
        const onCGroupChange = ()=>{
          tr.dataset.use = String(toInt(gInp.value));
          updateOneRow(code, i);
          updateResults();
        };
        gInp.addEventListener("input", onCGroupChange);
        gInp.addEventListener("change", onCGroupChange);

      }else{
        tr.innerHTML=`
          <td>${item.code} ${item.name}</td>
          <td class="cell-price">${item.price.toLocaleString()}</td>
          <td><input class="inp-week"  type="number" min="0" step="1" value="0" /></td>
          <td><input class="inp-month" type="number" value="0" readonly /></td>
          <td><input class="inp-total" type="number" min="0" step="1" value="0" /></td>
          <td class="cell-amount">0</td>`;

        const week  = tr.querySelector(".inp-week");
        const month = tr.querySelector(".inp-month");
        const total = tr.querySelector(".inp-total");

        // ✅ 週次數一改：月次數=ceil(週*4.5)，總次數=月次數（覆蓋任何手動），manual=0
        const onWeekChange = ()=>{
          const w = toInt(week.value);
          const m = Math.ceil(w * WEEKS_PER_MONTH);
          month.value      = m;
          tr.dataset.manual= "0";
          total.value      = m;
          tr.dataset.use   = String(m);
          updateOneRow(code, i);
          updateResults();
        };

        // ✅ 總次數一改：manual=1，之後金額一律用總次數
        const onTotalChange = ()=>{
          tr.dataset.manual = "1";
          const t = toInt(total.value);
          tr.dataset.use = String(t);
          updateOneRow(code, i);
          updateResults();
        };

        week.addEventListener("input", onWeekChange);
        week.addEventListener("change", onWeekChange);
        total.addEventListener("input", onTotalChange);
        total.addEventListener("change", onTotalChange);
      }

      tbody.appendChild(tr);
    });

    groupBox.appendChild(h3);
    groupBox.appendChild(table);
    container.appendChild(groupBox);
  });

  applyUnitEffects(); // B 單位隱藏 C
}

/* ── 單列金額（**只讀 data-use**）── */
function updateOneRow(code, idx){
  const tIndex = Object.keys(serviceData).indexOf(code);
  const table  = document.querySelectorAll("#tables table")[tIndex];
  if(!table) return;
  const tr     = table.tBodies[0].rows[idx];
  if(!tr) return;

  const price  = Number(serviceData[code][idx].price) || 0;
  const use    = toInt(tr.dataset.use);
  tr.querySelector(".cell-amount").textContent = (price * use).toLocaleString();
}

/* ── 條件輸入 ── */
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty'], input[name='cms'], input[name='foreign']")
    .forEach(el=>el.addEventListener("change", ()=>{ updateSCAvailability(); updateResults(); }));
  $("#keepQuota")?.addEventListener("input", updateResults);
}

/* ── SC 只能外籍看護用 ── */
function updateSCAvailability(){
  const scBox = document.querySelector('[data-group="SC"]');
  if(!scBox) return;
  const hasForeign = (document.querySelector("input[name='foreign']:checked")||{}).value === "1";
  scBox.querySelectorAll("input").forEach(inp=>{
    inp.disabled = !hasForeign;
    if(!hasForeign) inp.value = 0;
  });
  const warn=$("#warnSCfg");
  if(warn){ !hasForeign ? warn.classList.remove("hidden") : warn.classList.add("hidden"); }
}

/* ── 統計（含 C / 排 C 兩組；不動 data-use） ── */
function updateResults(){
  let sumBA=0, sumGA=0, sumSC=0, sumC=0;

  const tables = document.querySelectorAll("#tables table");
  const groups = Object.keys(serviceData);

  groups.forEach((g, idx) => {
    const tbody = tables[idx]?.tBodies[0]; if(!tbody) return;
    [...tbody.rows].forEach((tr, i) => {
      const price = Number(serviceData[g][i].price) || 0;
      let use = toInt(tr.dataset.use);

      // 第一次還沒建立 data-use 且為非 C：以週→月推一次（不覆蓋手動邏輯，因 manual 初始為 0）
      if(!use && tr.dataset.cmode!=="1"){
        const w = toInt(tr.querySelector(".inp-week")?.value);
        const m = Math.ceil(w * WEEKS_PER_MONTH);
        if(m>0){
          tr.dataset.use = String(m);
          tr.querySelector(".inp-month").value = m;
          tr.querySelector(".inp-total").value = m;
          tr.dataset.manual = "0";
          use = m;
        }
      }

      const amt = price * use;

      if (tr.dataset.cmode === "1"){ sumBA += amt; sumC += amt; }
      else if (g==="GA") sumGA += amt;
      else if (g==="SC") sumSC += amt;
      else sumBA += amt;

      const cell=tr.querySelector(".cell-amount");
      if(cell) cell.textContent = amt.toLocaleString();
    });
  });

  // 身分/額度
  const idtyRaw = (document.querySelector("input[name='idty']:checked")||{}).value || "一般戶";
  const cms  = toInt((document.querySelector("input[name='cms']:checked")||{}).value || 2);
  const keep = Math.max(0, toInt($("#keepQuota")?.value));

  const rateMap = { "一般戶":0.16, "中低收入戶":0.05, "低收入戶":0 };
  const rate = rateMap[idtyRaw] ?? 0.16;

  const grantBA = (cmsQuota[cms] || 0) + keep;
  const grantGA = GA_CAP[cms] || 0;
  const grantSC = SC_CAP[cms] || 0;

  const calc = (ba,ga,sc)=>{
    const allowBA = Math.min(ba, grantBA);
    const allowGA = Math.min(ga, grantGA);
    const allowSC = Math.min(sc, grantSC);
    const subsidyBase = allowBA + allowGA + allowSC;
    const overBA = Math.max(0, ba - grantBA);
    const overGA = Math.max(0, ga - grantGA);
    const overSC = Math.max(0, sc - grantSC);
    const copay = Math.round(subsidyBase * rate);
    const gov   = subsidyBase - copay;
    const self  = copay + overBA + overGA + overSC;
    const grand = gov + self;
    return {allowBA,allowGA,allowSC,overBA,overGA,overSC,copay,gov,self,grand};
  };

  const inc = calc(sumBA, sumGA, sumSC);          // 含 C
  const exC = calc(sumBA - sumC, sumGA, sumSC);   // 排 C（B 單位薪資用）

  // 顯示（採含 C）
  $("#grantQuota") && ($("#grantQuota").value = grantBA.toLocaleString());
  const rBA = Math.max(0, grantBA - inc.allowBA);
  const rGA = Math.max(0, grantGA - inc.allowGA);
  const rSC = Math.max(0, grantSC - inc.allowSC);

  setText("#sumGrantBA", grantBA);
  setText("#sumRemainBA", rBA);
  setText("#sumGrantGA", grantGA);
  setText("#sumRemainGA", rGA);
  setText("#sumGrantSC", grantSC);
  setText("#sumRemainSC", rSC);

  setText("#sumRemainBA_foot", rBA);
  setText("#sumRemainGA_foot", rGA);
  setText("#sumRemainSC_foot", rSC);

  setText("#sumCopay", inc.copay);
  setText("#sumSelfpay", inc.self);
  setText("#sumGovSubsidy", inc.gov);
  setText("#sumGrand", inc.grand);

  setText("#sumGovSubsidy_foot", inc.gov);
  setText("#sumSelfpay_foot", inc.self);
  setText("#sumGrand_foot", inc.grand);

  toggle("#overMain", inc.overBA>0);
  toggle("#overGA",   inc.overGA>0);
  toggle("#overSC",   inc.overSC>0);

  // 薪資兩組值（含C／排C）
  lastCalc.gov_inc = inc.gov;   lastCalc.self_inc = inc.self;
  lastCalc.gov_exC = exC.gov;   lastCalc.self_exC = exC.self;

  updateCaregiverSalary();
}

/* ── 居服薪資(6/4) = (AA總 + 補助 + 自付) × 0.6 ── */
function updateCaregiverSalary(){
  const saved=JSON.parse(localStorage.getItem("addons")||"{}");
  let aaTotal=0;
  Object.keys(AA_PRICE).forEach(c=>{
    aaTotal += toInt(saved[`${c}_count`]) * AA_PRICE[c];
  });

  const baseGov  = (currentUnit==="B") ? lastCalc.gov_exC  : lastCalc.gov_inc;
  const baseSelf = (currentUnit==="B") ? lastCalc.self_exC : lastCalc.self_inc;
  const total=Math.round((aaTotal + baseGov + baseSelf) * 0.6);

  const target=$("#caregiverSalary");
  if(target) target.textContent=`居服員薪資合計：${total.toLocaleString()} 元`;
}

/* ── A/B 切換：B 隱藏 C、薪資不含 C ── */
function bindUnitToggle(){
  const btn=$("#btnUnitToggle"); if(!btn) return;
  btn.addEventListener("click", ()=>{
    currentUnit = (currentUnit==="A") ? "B" : "A";
    localStorage.setItem("unit", currentUnit);
    applyUnitEffects();
    updateResults();
  });
}
function applyUnitEffects(){
  const btn=$("#btnUnitToggle");
  if(btn){
    btn.textContent = `${currentUnit}單位`;
    btn.dataset.unit = currentUnit;
    btn.classList.remove("btn-green","btn-orange");
    btn.classList.add(currentUnit==="A" ? "btn-green" : "btn-orange");
  }
  const cBox = document.querySelector('[data-group="C"]');
  if(cBox){ currentUnit==="B" ? cBox.classList.add("hidden") : cBox.classList.remove("hidden"); }
}

/* ── 小工具 ── */
function setText(sel, num){ const el=$(sel); if(!el) return; el.textContent = Number(num).toLocaleString(); }
function toggle(sel, show){ const el=$(sel); if(!el) return; show ? el.classList.remove("hidden") : el.classList.add("hidden"); }
function resetAll(){ localStorage.removeItem("addons"); location.reload(); }

/* ── 避位：量測頂/底列高度 ── */
function adjustDockPadding(){
  const dock = document.getElementById('bottomDock');
  if(!dock) return;
  const h = dock.offsetHeight || 0;
  document.documentElement.style.setProperty('--dock-h', h + 'px');
}
function adjustTopbarPadding(){
  const topbar = document.querySelector('.topbar');
  if(!topbar) return;
  const h = topbar.offsetHeight || 0;
  document.documentElement.style.setProperty('--topbar-h', h + 'px');
}
