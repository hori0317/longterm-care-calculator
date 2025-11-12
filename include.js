<script>
/*!
 * include.js
 * - 動態載入 header.html / footer.html
 * - 管理 A/B 單位狀態
 * - 廣播 unit-change 事件（交由各頁面的 script.js 接）
 * - 導覽高亮在 header 注入後再執行一次
 */

(function(){
  /** 讀取外部片段 */
  async function loadFragment(id, url){
    const host = document.getElementById(id);
    if(!host) return null;
    try{
      const res = await fetch(url, { cache: "no-store" });
      const html = await res.text();
      host.innerHTML = html;
      return host;
    }catch(e){
      console.error(`[include.js] 載入 ${url} 失敗`, e);
      return null;
    }
  }

  /** 單位狀態存取（只負責 <html data-unit> 與 localStorage；不呼叫頁面的 applyUnitEffects，避免循環） */
  const UnitStore = {
    key: "unit",
    get(){
      const d = document.documentElement.dataset.unit;
      if(d === "A" || d === "B") return d;
      const s = localStorage.getItem(this.key);
      return (s==="A"||s==="B") ? s : "A";
    },
    set(u){
      const v = (u==="A"||u==="B") ? u : "A";
      document.documentElement.dataset.unit = v;
      localStorage.setItem(this.key, v);
      // 同步按鈕文字
      const btn = document.getElementById("btnUnitToggle");
      if(btn){
        btn.textContent = `${v}單位`;
        btn.dataset.unit = v;
        btn.classList.remove("btn-green","btn-orange");
        btn.classList.add(v==="A" ? "btn-green" : "btn-orange");
      }
      // 廣播事件，頁面自己的 script.js 會接手 applyUnitEffects() + updateResults()
      window.dispatchEvent(new CustomEvent("unit-change", { detail:{ unit: v }}));
    }
  };

  /** 綁定 header 裡的按鈕（只綁一次） */
  function wireHeaderOnce(){
    const btnUnit = document.getElementById("btnUnitToggle");
    if(btnUnit && !btnUnit.__wired){
      btnUnit.__wired = true;
      btnUnit.addEventListener("click", ()=>{
        const next = UnitStore.get() === "A" ? "B" : "A";
        UnitStore.set(next);
      });
    }
    // 其他共用按鈕（列印 / 清空），交給各頁現有邏輯接管
    const btnPrint = document.getElementById("btnPrint");
    if(btnPrint && !btnPrint.__wired){
      btnPrint.__wired = true;
      btnPrint.addEventListener("click", ()=> window.print());
    }
    const btnReset = document.getElementById("btnReset") || document.getElementById("btnResetAll");
    if(btnReset && !btnReset.__wired){
      btnReset.__wired = true;
      if(typeof window.resetAll === "function") btnReset.addEventListener("click", ()=> window.resetAll());
    }
  }

  /** 注入後做一次導覽高亮 */
  function highlightNav(){
    // 你的頁面 script.js 已有高亮邏輯（hashchange/popstate），這裡只在 header 注入完成後觸發一次
    const evt = new Event("popstate");
    window.dispatchEvent(evt);
  }

  async function boot(){
    // 先設定 data-unit（避免畫面初載入閃爍）
    document.documentElement.dataset.unit = UnitStore.get();

    // 載入 header / footer
    await loadFragment("__header", "header.html");
    await loadFragment("__footer", "footer.html");

    // header 就緒：綁定按鈕、同步外觀、對外宣告
    wireHeaderOnce();
    UnitStore.set(UnitStore.get());
    window.dispatchEvent(new Event("header-ready"));

    // 導覽高亮（確保 .nav-links 已出現在 DOM）
    highlightNav();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }

  // 對外提供取得目前單位的方法（必要時可用）
  window.getUnit = () => UnitStore.get();

})();
</script>
