 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/include.js b/include.js
index d80b0dec7d2d97e75dc5d6720ba2a9b0f091313a..9d7050e964f168d9d9f76b0bf1f802ab6e1b6eca 100644
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
@@ -164,26 +163,25 @@
 
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
