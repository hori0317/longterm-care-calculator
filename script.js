/**********************
 * script.js（總次數鎖定最終修正版）
 * 重點：manual=1 後，任何地方都不覆寫總次數與 data-use
 * script.js（週→月→總；總可改，但改週即重置同步）
 **********************/

/* 公用 */
@@ -172,7 +171,7 @@ function renderTables(){

    serviceData[code].forEach((item,i)=>{
      const tr=document.createElement("tr");
      tr.dataset.manual = "0";  // 0=未手動，1=手動輸入總次
      tr.dataset.manual = "0";  // 0=自動(總次跟月次同步)；1=使用者手動輸入總次
      tr.dataset.use    = "0";  // 最終使用次數（或 C 的組數）

      if(code === "C"){
@@ -204,23 +203,19 @@ function renderTables(){
        const month = tr.querySelector(".inp-month");
        const total = tr.querySelector(".inp-total");

        // 週次變更：manual=1 時，只更新月次，不改總次與 data-use
        // ✅ 週次一改：月次=ceil(週*4.5)，且「總次數=月次數」（強制回同步），manual=0，use=月次
        const onWeekChange = ()=>{
          const w = toInt(week.value);
          const m = Math.ceil(w * WEEKS_PER_MONTH);
          month.value = m;

          if(tr.dataset.manual === "0"){
            // 未手動：總次 = 月次，並同步到 data-use
            total.value    = m;
            tr.dataset.use = String(m);
          }
          // manual=1：不動 total / data-use
          month.value       = m;
          total.value       = m;          // 強制回同步
          tr.dataset.manual = "0";        // 回到自動模式
          tr.dataset.use    = String(m);  // 計算使用月次
          updateOneRow(code, i);
          updateResults();
        };

        // 總次變更：手動鎖定，之後不再被週次覆蓋
        // ✅ 總次可自由改：manual=1，之後都用總次計；直到你再次改「週次」才會被重設
        const onTotalChange = ()=>{
          tr.dataset.manual = "1";
          const t = toInt(total.value);
@@ -243,7 +238,7 @@ function renderTables(){
    container.appendChild(groupBox);
  });

  applyUnitEffects();
  applyUnitEffects(); // B 單位隱藏 C
}

/* 單列金額（只讀 data-use） */
@@ -279,7 +274,7 @@ function updateSCAvailability(){
  if(warn){ !hasForeign ? warn.classList.remove("hidden") : warn.classList.add("hidden"); }
}

/* 統計（含 C / 排 C 兩組；**不覆蓋 manual=1 的列**） */
/* 統計（含 C / 排 C 兩組；不主動覆寫使用者的 total） */
function updateResults(){
  let sumBA=0, sumGA=0, sumSC=0, sumC=0;

@@ -292,15 +287,14 @@ function updateResults(){
      const price = Number(serviceData[g][i].price) || 0;
      let use = toInt(tr.dataset.use);

      // 只有在「非 C 且 manual !== 1」時，才允許用週→月初始化 data-use
      if(tr.dataset.cmode!=="1" && tr.dataset.manual!=="1" && !use){
      // 初次（use=0 且非 C）：依週→月種初值一次（不動 total；避免覆寫你的手動輸入）
      if(tr.dataset.cmode!=="1" && !use){
        const w = toInt(tr.querySelector(".inp-week")?.value);
        const m = Math.ceil(w * WEEKS_PER_MONTH);
        if(m>0){
          tr.dataset.use = String(m);
          tr.querySelector(".inp-month").value = m;
          tr.querySelector(".inp-total").value = m;
          // manual 維持 0
          // 不寫回 .inp-total（交給週次事件或使用者）
          use = m;
        }
      }
