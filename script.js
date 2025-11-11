 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index 1e359290b316b130009381f63143aead4d2af2d8..60bc114833ba6730c39c4b69026756d9cd8a6662 100644
--- a/script.js
+++ b/script.js
@@ -73,59 +73,59 @@ const serviceData = {
   SC: [{ code:"SC09", name:"短照 2 小時/支", price:770 }],
 };
 
 /* 額度 */
 const cmsQuota = { 2:10020, 3:15460, 4:18580, 5:24100, 6:28070, 7:32090, 8:36180 };
 const GA_CAP   = { 2:32340, 3:32340, 4:32340, 5:32340, 6:32340, 7:48510, 8:48510 };
 const SC_CAP   = { 2:87780, 3:87780, 4:87780, 5:87780, 6:87780, 7:71610, 8:71610 };
 
 /* 狀態 */
 let currentUnit = localStorage.getItem("unit") || ($("#btnUnitToggle")?.dataset.unit || "B");
 const lastCalc  = { gov_inc:0, self_inc:0, gov_exC:0, self_exC:0 };
 
 /* 初始化 */
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
 
-  adjustTopbarPadding();
-  adjustDockPadding();
-  window.addEventListener('resize', ()=>{ adjustTopbarPadding(); adjustDockPadding(); });
-  window.addEventListener('orientationchange', ()=>{ adjustTopbarPadding(); adjustDockPadding(); });
-
-  const dock = document.getElementById('bottomDock');
-  if(window.ResizeObserver && dock){ new ResizeObserver(()=>adjustDockPadding()).observe(dock); }
-  const topbar = document.querySelector('.topbar');
-  if(window.ResizeObserver && topbar){ new ResizeObserver(()=>adjustTopbarPadding()).observe(topbar); }
+  adjustTopbarPadding?.();
+  adjustDockPadding?.();
+  window.addEventListener('resize', ()=>{ adjustTopbarPadding?.(); adjustDockPadding?.(); });
+  window.addEventListener('orientationchange', ()=>{ adjustTopbarPadding?.(); adjustDockPadding?.(); });
+
+  const dock = document.getElementById('bottomDock');
+  if(window.ResizeObserver && dock){ new ResizeObserver(()=>adjustDockPadding?.()).observe(dock); }
+  const topbar = document.querySelector('.topbar');
+  if(window.ResizeObserver && topbar){ new ResizeObserver(()=>adjustTopbarPadding?.()).observe(topbar); }
 });
 
 /* AA 區 */
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
@@ -500,66 +500,26 @@ function applyUnitEffects(){
       if (currentUnit === "B"){
         tr.classList.add("hidden");
         tr.dataset.use = "0";
         const week  = tr.querySelector(".inp-week");
         const month = tr.querySelector(".inp-month");
         const total = tr.querySelector(".inp-total");
         if (week)  { week.value  = 0; week.disabled  = true; }
         if (month) { month.value = 0; }
         if (total) { total.value = 0; total.disabled = true; }
         const cell = tr.querySelector(".cell-amount");
         if (cell) cell.textContent = "0";
       }else{
         tr.classList.remove("hidden");
         tr.querySelectorAll("input").forEach(inp=>{ inp.disabled = false; });
       }
     });
   }
 }
 
 /* 小工具 */
 function setText(sel, num){ const el=$(sel); if(!el) return; el.textContent = Number(num).toLocaleString(); }
 function toggle(sel, show){ const el=$(sel); if(!el) return; show ? el.classList.remove("hidden") : el.classList.add("hidden"); }
 function resetAll(){ localStorage.removeItem("addons"); location.reload(); }
 
 /* 避位 */
-function adjustDockPadding(){
-  const dock = document.getElementById('bottomDock');
-  if(!dock) return;
-  const h = dock.offsetHeight || 0;
-  document.documentElement.style.setProperty('--dock-h', h + 'px');
-}
-function adjustTopbarPadding(){
-  const topbar = document.querySelector('.topbar');
-  if(!topbar) return;
-  const h = topbar.offsetHeight || 0;
-  document.documentElement.style.setProperty('--topbar-h', h + 'px');
-}
-
-/* ---- 導覽：依當前網址自動高亮（支援 /page 與 page.html） ---- */
-(function(){
-  function norm(href){
-    try{
-      const u = new URL(href, location.origin);
-      let p = u.pathname.trim();
-
-      // 去尾斜線
-      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
-
-      // / → /index；移除 .html
-      p = p.replace(/\/(index\.html?)?$/i, '/index')
-           .replace(/\.html?$/i, '');
-
-      const parts = p.split('/');
-      const last  = parts[parts.length - 1];
-      return last.toLowerCase();
-    }catch(e){
-      return '';
-    }
-  }
-
-  const here = norm(location.href);   // 目前頁面
-  document.querySelectorAll('.nav-links a[href]').forEach(a=>{
-    const target = norm(a.getAttribute('href'));  // 連結目標
-    if (target && target === here) a.classList.add('active');
-  });
-})();
+/* layout helpers provided by site.js */
 
EOF
)
