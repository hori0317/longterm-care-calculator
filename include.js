 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/include.js b/include.js
index d80b0dec7d2d97e75dc5d6720ba2a9b0f091313a..bf1a9a81b4752a289dde86724deb8d98e8ac61b1 100644
--- a/include.js
+++ b/include.js
@@ -1,26 +1,25 @@
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
     const paths = [];
     paths.push(file, "./"+file);
     const segs = location.pathname.split("/").filter(Boolean);
     for(let i=segs.length;i>=0;i--){
       const base = "/"+segs.slice(0,i).join("/")+"/";
       paths.push(base+file);
     }
     return [...new Set(paths)];
   }
 
   /** 具逾時的 fetch */
   function fetchWithTimeout(url, ms){
     return new Promise((resolve,reject)=>{
       const id = setTimeout(()=>reject(new Error("timeout")), ms);
@@ -81,63 +80,83 @@
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
       window.dispatchEvent(new CustomEvent("unit-change",{detail:{unit:v}}));
     }
   };
 
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
@@ -164,26 +183,25 @@
 
     let footerHtml = await tryFetchMany("footer.html", 1200);
     if(!footerHtml) footerHtml=fallbackFooter();
     setFragment("__footer", footerHtml);
 
     // 綁按鈕、同步外觀
     wireHeaderOnce();
     UnitStore.set(UnitStore.get());
 
     // 告知頁面「header-ready」，讓需要的頁面去做額外處理
     window.dispatchEvent(new Event("header-ready"));
 
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
