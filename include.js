 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/include.js b/include.js
index d80b0dec7d2d97e75dc5d6720ba2a9b0f091313a..fd1d54c336b098616fb2fc8912c82347a3e9d173 100644
--- a/include.js
+++ b/include.js
@@ -1,189 +1,249 @@
-<script>
 /*!
  * include.js (robust+timeout fallback)
  * - 動態載入 header.html / footer.html（多路徑重試 + no-store + 逾時）
  * - 失敗或逾時 ⇒ 以內建後備模板渲染，避免整排消失
  * - 管理 A/B 單位：<html data-unit> + localStorage，同步外觀，廣播 unit-change
  * - 觸發導覽高亮（用 popstate 讓你現有 script.js 接手）
  */
 
 (function(){
   /** 產生候選路徑 */
   function candidatePaths(file){
-    const paths = [];
-    paths.push(file, "./"+file);
+    const set = new Set();
+    if(!file) return [];
+    set.add(file);
+    if(!file.startsWith("./") && !file.startsWith("/") && !/^https?:/i.test(file)){
+      set.add("./"+file);
+    }
     const segs = location.pathname.split("/").filter(Boolean);
-    for(let i=segs.length;i>=0;i--){
-      const base = "/"+segs.slice(0,i).join("/")+"/";
-      paths.push(base+file);
+    let upPath = "";
+    for(let i=0;i<(segs.length>0?segs.length-1:0);i++){
+      upPath += "../";
+      set.add(upPath+file);
     }
-    return [...new Set(paths)];
+    return Array.from(set);
   }
 
   /** 具逾時的 fetch */
   function fetchWithTimeout(url, ms){
     return new Promise((resolve,reject)=>{
       const id = setTimeout(()=>reject(new Error("timeout")), ms);
       fetch(url, {cache:"no-store"}).then(r=>{clearTimeout(id);resolve(r)}).catch(e=>{clearTimeout(id);reject(e)});
     });
   }
 
   /** 多路徑嘗試（每個路徑也套逾時） */
   async function tryFetchMany(file, timeoutMs=1200){
+    if(typeof fetch !== "function") return null;
     const qs = `?v=${Date.now()}`;
     for(const p of candidatePaths(file)){
       try{
         const res = await fetchWithTimeout(p+qs, timeoutMs);
         if(res.ok){
           const html = await res.text();
           if(html && html.replace(/\s+/g,"").length>10) return html;
         }
       }catch(e){}
     }
     return null;
   }
 
   /** 後備 Header */
-  function fallbackHeader(){
-    return `
+  function fallbackHeader(mode="full"){
+    const common = `
 <header class="topbar" style="position:sticky;top:0;z-index:1000;">
-  <div class="inner">
-    <div class="brand">
-      <a href="index.html" class="logo-link" aria-label="回首頁">
-        <img src="org-logo.png" alt="logo" onerror="this.style.opacity=0.2" />
+  <div class="inner" style="display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;padding:12px 20px;">
+    <div class="brand" style="display:flex;align-items:center;gap:16px;min-width:max-content;">
+      <a href="index.html" class="logo-link" aria-label="回首頁" style="display:inline-flex;align-items:center;">
+        <img src="org-logo.png" alt="logo" onerror="this.style.opacity=0.2" style="height:52px;width:auto;display:block;" />
       </a>
-      <span class="site-title" id="siteTitle">額度計算機</span>
+      <span class="site-title" id="siteTitle" style="font-size:20px;font-weight:700;white-space:nowrap;">額度計算機</span>
     </div>
-    <div class="nav-wrap">
-      <nav class="nav-links" aria-label="主選單">
-        <a href="index.html">額度計算機</a>
-        <a href="payroll.html">薪資計算機</a>
-        <a href="care-info.html">長照相關資訊</a>
-        <a href="news.html">最新公告</a>
-        <a href="contact.html">聯繫方式</a>
-        <a href="about.html">關於我們</a>
+    <div class="nav-wrap" style="grid-column:2;overflow-x:auto;">
+      <nav class="nav-links" aria-label="主選單" style="display:flex;justify-content:center;align-items:center;gap:32px;white-space:nowrap;">
+        <a href="index.html" style="text-decoration:none;color:#333;font-weight:600;">額度計算機</a>
+        <a href="payroll.html" style="text-decoration:none;color:#333;font-weight:600;">薪資計算機</a>
+        <a href="care-info.html" style="text-decoration:none;color:#333;font-weight:600;">長照相關資訊</a>
+        <a href="news.html" style="text-decoration:none;color:#333;font-weight:600;">最新公告</a>
+        <a href="contact.html" style="text-decoration:none;color:#333;font-weight:600;">聯繫方式</a>
+        <a href="about.html" style="text-decoration:none;color:#333;font-weight:600;">關於我們</a>
       </nav>
-    </div>
-    <div class="actions">
+    </div>`;
+    if(mode==="lite"){
+      return `${common}
+    <div class="actions actions-ghost"></div>
+  </div>
+</header>
+<div class="divider"></div>`;
+    }
+    return `${common}
+    <div class="actions" style="display:flex;align-items:center;gap:10px;justify-self:end;">
       <button class="btn pill btn-orange" id="btnUnitToggle" type="button" data-unit="A">A單位</button>
       <button class="btn pill btn-gray"   id="btnPrint"       type="button">列印</button>
       <button class="btn pill btn-green"  id="btnReset"       type="button">清空</button>
     </div>
   </div>
 </header>
 <div class="divider"></div>`;
   }
 
   /** 後備 Footer */
   function fallbackFooter(){
     return `
 <footer class="site-footer">
   <div class="inner">
     <section class="notes">
       <h3>備註</h3>
       <ul>
         <li>每年 2 月、8 月調整投保級距。</li>
         <li>本工具僅供輔助計算，實際申報以政府公告及個案核定為準。</li>
         <li>隱私保護：請勿輸入可識別個人身分之資訊。</li>
       </ul>
     </section>
     <section class="legal">
       <small>© <span id="yCopy"></span> hori. All rights reserved.</small>
     </section>
   </div>
 </footer>
 <script>(function(){var y=document.getElementById("yCopy"); if(y) y.textContent=new Date().getFullYear();})();</script>`;
   }
 
   /** 寫入容器 */
   function setFragment(containerId, html){
     const host = document.getElementById(containerId);
     if(!host) return null;
     host.innerHTML = html;
     return host;
   }
 
+  /** localStorage 安全取用（某些模式可能封鎖存取） */
+  const SafeStorage={
+    get(key){
+      try{
+        return window.localStorage ? window.localStorage.getItem(key) : null;
+      }catch(_){
+        return null;
+      }
+    },
+    set(key,val){
+      try{
+        if(window.localStorage){
+          window.localStorage.setItem(key,val);
+        }
+      }catch(_){
+        /* ignore */
+      }
+    }
+  };
+
   /** A/B 單位狀態 */
   const UnitStore={
     key:"unit",
     get(){
       const d=document.documentElement.dataset.unit;
       if(d==="A"||d==="B") return d;
-      const s=localStorage.getItem(this.key);
+      const s=SafeStorage.get(this.key);
       return (s==="A"||s==="B")?s:"A";
     },
     set(u){
       const v=(u==="A"||u==="B")?u:"A";
       document.documentElement.dataset.unit=v;
-      localStorage.setItem(this.key,v);
+      SafeStorage.set(this.key,v);
       const btn=document.getElementById("btnUnitToggle");
       if(btn){
         btn.textContent=`${v}單位`;
         btn.dataset.unit=v;
         btn.classList.remove("btn-green","btn-orange");
         btn.classList.add(v==="A"?"btn-green":"btn-orange");
       }
-      window.dispatchEvent(new CustomEvent("unit-change",{detail:{unit:v}}));
+      try{
+        window.dispatchEvent(new CustomEvent("unit-change",{detail:{unit:v}}));
+        window.dispatchEvent(new CustomEvent("unit:toggle",{detail:{unit:v}}));
+      }catch(_){
+        // 舊瀏覽器沒有 CustomEvent：忽略
+      }
     }
   };
 
+  function resolveHeaderRequest(){
+    const host = document.getElementById("__header");
+    const hostHint = host && host.dataset ? host.dataset.header : "";
+    const bodyHint = document.body && document.body.dataset ? document.body.dataset.header : "";
+    const hintRaw = (hostHint || bodyHint || "").trim();
+    if(!hintRaw){
+      return {file:"header.html", mode:"full"};
+    }
+    const hint = hintRaw.toLowerCase();
+    if(hint === "lite"){
+      return {file:"header-lite.html", mode:"lite"};
+    }
+    if(hint.endsWith(".html")){
+      return {file:hintRaw, mode:hint.includes("lite")?"lite":"full"};
+    }
+    return {file:`${hintRaw}.html`, mode:hint.includes("lite")?"lite":"full"};
+  }
+
   /** 綁一次 header 按鈕 */
   function wireHeaderOnce(){
     const btnUnit=document.getElementById("btnUnitToggle");
     if(btnUnit && !btnUnit.__wired){
       btnUnit.__wired=true;
       btnUnit.addEventListener("click",()=>{
         UnitStore.set(UnitStore.get()==="A"?"B":"A");
       });
     }
     const btnPrint=document.getElementById("btnPrint");
     if(btnPrint && !btnPrint.__wired){
       btnPrint.__wired=true;
       btnPrint.addEventListener("click",()=>window.print());
     }
     const btnReset=document.getElementById("btnReset")||document.getElementById("btnResetAll");
     if(btnReset && !btnReset.__wired && typeof window.resetAll==="function"){
       btnReset.__wired=true;
       btnReset.addEventListener("click",()=>window.resetAll());
     }
   }
 
   /** 觸發導覽高亮（交給你現有 script.js） */
   function pokeNavHighlight(){
     window.dispatchEvent(new Event("popstate"));
   }
 
   async function boot(){
     // 先套單位，避免首屏顏色錯亂
     document.documentElement.dataset.unit=UnitStore.get();
 
-    // 嘗試載入 header / footer（各自有逾時）
-    let headerHtml = await tryFetchMany("header.html", 1200);
-    if(!headerHtml) headerHtml=fallbackHeader();
-    setFragment("__header", headerHtml);
+    const headerReq = resolveHeaderRequest();
+    setFragment("__header", fallbackHeader(headerReq.mode));
+    let headerHtml = await tryFetchMany(headerReq.file, 1200);
+    if(headerHtml) setFragment("__header", headerHtml);
 
+    setFragment("__footer", fallbackFooter());
     let footerHtml = await tryFetchMany("footer.html", 1200);
-    if(!footerHtml) footerHtml=fallbackFooter();
-    setFragment("__footer", footerHtml);
+    if(footerHtml) setFragment("__footer", footerHtml);
 
     // 綁按鈕、同步外觀
     wireHeaderOnce();
     UnitStore.set(UnitStore.get());
 
     // 告知頁面「header-ready」，讓需要的頁面去做額外處理
-    window.dispatchEvent(new Event("header-ready"));
+    try{
+      window.dispatchEvent(new Event("header-ready"));
+      window.dispatchEvent(new Event("include:ready"));
+    }catch(_){
+      // IE 的 Event() 可能失敗；忽略
+    }
 
     // 做一次導覽高亮
     pokeNavHighlight();
   }
 
   if(document.readyState==="loading"){
     document.addEventListener("DOMContentLoaded", boot);
   }else{
     boot();
   }
 
   // 給外部查詢
   window.getUnit=()=>UnitStore.get();
 })();
-</script>
 
EOF
)
