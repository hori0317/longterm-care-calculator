/**********************
 * script.js（最終整合版）
 * - 安全數字轉換 toInt()：避免逗號/全形數字/空白導致 ×10 錯算
 * - 非 C 碼：週→月→總（總可手動覆寫）
 * - C 碼：一包制（每組價 × 每月組數）
 * - AA 區：單一輸入欄，localStorage 保存
 * - A/B 切換：B 隱藏 C，且薪資排除 C
 * - 居服薪資(6/4)：(AA 總 + 政府補助 + 自付) × 0.6
 * - 頂/底工具列動態避位
 **********************/

/* ---------- 小工具：安全數字轉整數 ---------- */
// 將任何輸入安全轉成整數（移除逗號、全形數字、空白等）
function toInt(v){
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : 0;
  if (v === null || v === undefined) return 0;
  // 全形數字與標點轉半形
  const fullWidthMap = {'０':'0','１':'1','２':'2','３':'3','４':'4','５':'5','６':'6','７':'7','８':'8','９':'9','，':',','．':'.','＋':'+','－':'-'};
  let s = String(v).replace(/[０-９，．＋－]/g, ch => fullWidthMap[ch] ?? ch);
  // 去千分位與空白
  s = s.replace(/,/g, '').trim();
  // 只取前段整數
  const m = s.match(/^[+-]?\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

/* ---------- 服務與單價 ---------- */
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
    { code: "CB01", name: "營養照護(3次含評估)", price: 6000 },
    { code: "CB02", name: "進食與吞嚥照護(6次含評估)", price: 9000 },
    { code: "CB03", name: "困擾行為照護(3次含評估)", price: 4500 },
    { code: "CB04", name: "臥床/長期活動受限照護(6次含評估)", price: 9000 },
    { code: "CC01", name: "居家環境安全或無障礙空間規劃", price: 2000 },
    { code: "CD02", name: "居家護理指導與諮詢(3次+1次評估)", price: 6000 },
  ],
  GA: [{ code: "GA09", name: "喘息 2 小時/支", price: 770 }],
  SC: [{ code: "SC09", name: "短照 2 小時/支", price: 770 }],
};

/* ---------- 額度 ---------- */
const cmsQuota = { 2:10020, 3:15460, 4:18580, 5:24100, 6:28070, 7:32090, 8:36180 };
const GA_CAP   = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
const SC_CAP   = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };

/* ---------- 其他設定 ---------- */
const ADDONS = [{code:"AA05"},{code:"AA06"},{code:"AA08"},{code:"AA09"},{code:"AA11"}];
const WEEKS_PER_MONTH = 4.5;
const $ = (s)=>document.querySelector(s);

/* ---------- 單位狀態 & 最近計算（含/排C） ---------- */
let currentUnit = localStorage.getItem("unit") || ($("#btnUnitToggle")?.dataset.unit || "B");
const lastCalc  = { gov_inc:0, self_inc:0, gov_exC:0, self_exC:0 };

/* ---------- 初始化 ---------- */
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

  $("#tables")?.addEventListener("input", (e)=>{
    if(e.target.tagName === "INPUT" || e.target.tagName === "SELECT"){ updateResults(); }
  });

  // 避位：頂/底高度動態量測
  adjustTopbarPadding();
  adjustDockPadding();
  window.addEventListener('resize', ()=>{ adjustTopbarPadding(); adjustDockPadding(); });
  window.addEventListener('orientationchange', ()=>{ adjustTopbarPadding(); adjustDockPadding(); });

  const dock = document.getElementById('bottomDock');
  if(window.ResizeObserver && dock){ new ResizeObserver(()=>adjustDockPadding()).observe(dock); }
  const topbar = document.querySelector('.topbar');
  if(window.ResizeObserver && topbar){ new ResizeObserver(()=>adjustTopbarPadding()).observe(topbar); }
});

/* ---------- 左卡 AA 區（項目＋單一輸入欄） ---------- */
function renderAddons(){
  const saved = JSON.parse(localStorage.getItem("addons") || "{}");
  const host = $("#addonRows"); if(!host) return;
  host.innerHTML = "";
  ADDONS.forEach(a=>{
    const row = document.createElement("div");
    row.className = "addon-row";
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

/* ---------- 服務表格（群組包裝，便於隱藏 C） ---------- */
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
      tr.dataset.manual = "0";
      if(code === "C"){
        tr.dataset.cmode = "1";
        tr.innerHTML = `
          <td>${item.code} ${item.name}</td>
          <td class="cell-price">${item.price.toLocaleString()}</td>
          <td><input class="inp-c-groups" type="number" min="0" step="1" value="0" /></td>
          <td class="cell-amount">0</td>`;
        tr.querySelector(".inp-c-groups").addEventListener("input", ()=>{ updateOneRow(code, i); updateResults(); });
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
        week.addEventListener("input", ()=>{
          const w = toInt(week.value);
          const m = Math.ceil(w * WEEKS_PER_MONTH);
          month.value = m;
          tr.dataset.manual = "0";
          total.value = m;
          updateOneRow(code, i);
          updateResults();
        });
        total.addEventListener("input", ()=>{ tr.dataset.manual = "1"; updateOneRow(code, i); updateResults(); });
      }
      tbody.appendChild(tr);
    });

    groupBox.appendChild(h3);
    groupBox.appendChild(table);
    container.appendChild(groupBox);
  });

  applyUnitEffects(); // 初始依單位顯示/隱藏 C
}

/* ---------- 單列金額更新（使用 toInt） ---------- */
function updateOneRow(code, idx){
  const tIndex = Object.keys(serviceData).indexOf(code);
  const table = document.querySelectorAll("#tables table")[tIndex];
  if(!table) return;
  const tr = table.tBodies[0].rows[idx];
  if(!tr) return;

  const price = Number(serviceData[code][idx].price) || 0;

  // C 碼：每月組數 × 每組單價
  if(tr.dataset.cmode === "1"){
    const groups = toInt(tr.querySelector(".inp-c-groups")?.value);
    const amt    = price * groups;
    tr.querySelector(".cell-amount").textContent = amt.toLocaleString();
    return;
  }

  // 其他碼別：週→月→總（總可手動覆蓋）
  const week  = toInt(tr.querySelector(".inp-week")?.value);
  const month = Math.ceil(week * WEEKS_PER_MONTH);
  const mInp  = tr.querySelector(".inp-month");
  if(mInp) mInp.value = month;

  const manual = tr.dataset.manual === "1";
  const total  = toInt(tr.querySelector(".inp-total")?.value);
  const use    = manual ? total : month;

  const amt    = price * use;
  tr.querySelector(".cell-amount").textContent = amt.toLocaleString();
}

/* ---------- 條件輸入綁定 ---------- */
function bindHeaderInputs(){
  document.querySelectorAll("input[name='idty'], input[name='cms'], input[name='foreign']")
    .forEach(el=>el.addEventListener("change", ()=>{ updateSCAvailability(); updateResults(); }));
  $("#keepQuota")?.addEventListener("input", updateResults);
}

/* ---------- SC 僅外籍看護可用 ---------- */
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

/* ---------- 核心計算（含 C / 排 C 兩套，同步更新） ---------- */
function updateResults(){
  let sumBA = 0, sumGA = 0, sumSC = 0, sumC = 0;

  const tables = document.querySelectorAll("#tables table");
  const groups = Object.keys(serviceData);

  groups.forEach((g,idx)=>{
    const tbody = tables[idx]?.tBodies[0]; if(!tbody) return;
    [...tbody.rows].forEach((tr,i)=>{
      const price = Number(serviceData[g][i].price) || 0;

      if(tr.dataset.cmode === "1"){
        const cnt = toInt(tr.querySelector(".inp-c-groups")?.value);
        const amt = price * cnt;
        sumBA += amt;  // C 併入主池
        sumC  += amt;  // 另存給「排 C」
        tr.querySelector(".cell-amount").textContent = amt.toLocaleString();
        return;
      }

      const w  = toInt(tr.querySelector(".inp-week")?.value);
      const m  = Math.ceil(w * WEEKS_PER_MONTH);
      const manual = tr.dataset.manual === "1";
      const t  = toInt(tr.querySelector(".inp-total")?.value);
      const use = manual ? t : m;

      const amt = price * use;
      if (g === "GA") sumGA += amt;
      else if (g === "SC") sumSC += amt;
      else sumBA += amt;

      tr.querySelector(".cell-amount").textContent = amt.toLocaleString();
    });
  });

  // 條件
  const idtyRaw = (document.querySelector("input[name='idty']:checked")||{}).value || "一般戶";
  const cms  = toInt((document.querySelector("input[name='cms']:checked")||{}).value || 2);
  const keep = Math.max(0, toInt($("#keepQuota")?.value));

  const rateMap = { "一般戶":0.16, "中低收入戶":0.05, "低收入戶":0 };
  const rate = rateMap[idtyRaw] ?? 0.16;

  // 額度
  const grantBA = (cmsQuota[cms] || 0) + keep;
  const grantGA = GA_CAP[cms] || 0;
  const grantSC = SC_CAP[cms] || 0;

  // 計算輔函數
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

  // 1) 含 C
  const inc = calc(sumBA, sumGA, sumSC);
  // 2) 排 C（給 B 單位薪資用）
  const exC = calc(sumBA - sumC, sumGA, sumSC);

  // 顯示（沿用含 C）
  $("#grantQuota") && ($("#grantQuota").value = grantBA.toLocaleString());

  setText("#sumGrantBA", grantBA);
  setText("#sumRemainBA", Math.max(0, grantBA - inc.allowBA));
  setText("#sumGrantGA", grantGA);
  setText("#sumRemainGA", Math.max(0, grantGA - inc.allowGA));
  setText("#sumGrantSC", grantSC);
  setText("#sumRemainSC", Math.max(0, grantSC - inc.allowSC));

  setText("#sumRemainBA_foot", Math.max(0, grantBA - inc.allowBA));
  setText("#sumRemainGA_foot", Math.max(0, grantGA - inc.allowGA));
  setText("#sumRemainSC_foot", Math.max(0, grantSC - inc.allowSC));

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

  // 保存兩組結果供薪資使用
  lastCalc.gov_inc = inc.gov;   lastCalc.self_inc = inc.self;
  lastCalc.gov_exC = exC.gov;   lastCalc.self_exC = exC.self;

  updateCaregiverSalary();
}

/* ---------- 居服薪資(6/4) ---------- */
/* (AA總 + 政府補助 + 自付) × 0.6
   AA 價格：AA05:200、AA06:200、AA08:385、AA09:770、AA11:50 */
function updateCaregiverSalary(){
  const AA_PRICE={AA05:200,AA06:200,AA08:385,AA09:770,AA11:50};
  const saved=JSON.parse(localStorage.getItem("addons")||"{}");
  let aaTotal=0;
  Object.keys(AA_PRICE).forEach(c=>{
    aaTotal += toInt(saved[`${c}_count`]) * AA_PRICE[c];
  });

  // A：含 C；B：排 C
  const baseGov  = (currentUnit==="B") ? lastCalc.gov_exC  : lastCalc.gov_inc;
  const baseSelf = (currentUnit==="B") ? lastCalc.self_exC : lastCalc.self_inc;
  const total=Math.round((aaTotal + baseGov + baseSelf) * 0.6);

  let target=$("#caregiverSalary");
  if(!target){
    const title=[...document.querySelectorAll(".card h2.card-title")].find(el=>el.textContent.includes("居服薪資"));
    if(title){
      const box=document.createElement("div");
      box.id="caregiverSalary";
      box.style.marginTop="10px";
      box.style.fontWeight="700";
      box.style.textAlign="right";
      box.style.color="#2e7d32";
      title.parentElement.appendChild(box);
      target=box;
    }
  }
  if(target) target.textContent=`居服員薪資合計：${total.toLocaleString()} 元`;
}

/* ---------- A/B 單位切換與 C 顯示控制 ---------- */
function bindUnitToggle(){
  const btn=$("#btnUnitToggle");
  if(!btn) return;
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
  if(cBox){
    currentUnit==="B" ? cBox.classList.add("hidden") : cBox.classList.remove("hidden");
  }
}

/* ---------- 小工具 ---------- */
function setText(sel, num){ const el=$(sel); if(!el) return; el.textContent = Number(num).toLocaleString(); }
function toggle(sel, show){ const el=$(sel); if(!el) return; show ? el.classList.remove("hidden") : el.classList.add("hidden"); }
function resetAll(){ localStorage.removeItem("addons"); location.reload(); }

/* ---------- 避位：量測底/頂工具列高度，寫入 CSS 變數 ---------- */
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
