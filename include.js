<script>
/*!
 * include.js (robust)
 * - 動態載入 header.html / footer.html（多路徑重試 + no-store）
 * - 失敗時以內建後備模板渲染，避免導覽/LOGO整排消失
 * - 管理 A/B 單位：<html data-unit> + localStorage，同步外觀，廣播 unit-change
 * - 注入後觸發導覽高亮（交由頁面的 script.js 既有邏輯處理）
 */

(function(){
  /** 動態決定可能的相對/絕對路徑候選 */
  function candidatePaths(file){
    const paths = [];
    // 1) 同層
    paths.push(file);                 // "header.html"
    paths.push("./" + file);          // "./header.html"

    // 2) 子路徑（GitHub Pages / 子資料夾部署）
    //   e.g. https://user.github.io/repo/sub/page.html → base = /repo/sub/
    const pn = location.pathname;
    const segs = pn.split("/").filter(Boolean);
    // 逐層往上拼接當前層
    // /a/b/c/page.html -> 試 /a/b/header.html → /a/header.html → /header.html
    for (let i = segs.length; i >= 0; i--){
      const base = "/" + segs.slice(0, i).join("/") + "/";
      paths.push(base + file);
    }

    // 去重
    return [...new Set(paths)];
  }

  /** 以多個路徑依序嘗試載入，成功即返回字串；全部失敗回 null */
  async function tryFetchMany(file){
    const qs = `?v=${Date.now()}`; // 破壞快取，避免抓到舊空殼
    const tries = candidatePaths(file);
    for (const p of tries){
      try{
        const res = await fetch(p + qs, { cache: "no-store" });
        if (res.ok){
          const html = await res.text();
          // 防呆：若檔案意外是空白或僅空白字元，視同失敗
          if (html && html.replace(/\s+/g,"").length > 10) return html;
        }
      }catch(e){}
    }
    return null;
  }

  /** 後備 Header（避免整排消失） */
  function fallbackHeader(){
    return `
<header class="topbar">
  <div class="inner">
    <div class="brand">
      <a href="index.html" class="logo-link" aria-label="回首頁">
        <img src="org-logo.png" alt="logo" onerror="this.style.opacity=0.2" />
      </a>
      <span class="site-title" id="siteTitle">額度計算機</span>
    </div>
    <div class="nav-wrap">
      <nav class="nav-links" aria-label="主選單">
        <a href="index.html">額度計算機</a>
        <a href="payroll.html">薪資計算機</a>
        <a href="care-info.html">長照相關資訊</a>
        <a href="news.html">最新公告</a>
        <a href="contact.html">聯繫方式</a>
        <a href="about.html">關於我們</a>
      </nav>
    </div>
    <div class="actions">
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

  /** 將 HTML 片段塞進指定容器 */
  function setFragment(containerId, html){
    const host = document.getElementById(containerId);
    if (!host) return null;
    host.innerHTML = html;
    return host;
  }

  /** 單位狀態存取（不主動呼叫頁面 applyUnitEffects，避免循環） */
  const UnitStore = {
    key: "unit",
    get(){
      const d = document.documentElement.dataset.unit;
      if (d === "A" || d === "B") return d;
      const s = localStorage.getItem(this.key);
      return (s==="A"||s==="B") ? s : "A";
    },
    set(u){
      const v = (u==="A"||u==="B") ? u : "A";
      document.documentElement.dataset.unit = v;
      localStorage.setItem(this.key, v);
      // 同步按鈕外觀（若已注入）
      const btn = document.getElementById("btnUnitToggle");
      if (btn){
        btn.textContent = `${v}單位`;
        btn.dataset.unit = v;
        btn.classList.remove("btn-green","btn-orange");
        btn.classList.add(v==="A" ? "btn-green" : "btn-orange");
      }
      // 對頁面廣播：由各頁 script.js 接手 applyUnitEffects() + updateResults()
      window.dispatchEvent(new CustomEvent("unit-change", { detail:{ unit: v }}));
    }
  };

  /** 綁定 header 按鈕（只綁一次） */
  function wireHeaderOnce(){
    const btnUnit = document.getElementById("btnUnitToggle");
    if (btnUnit && !btnUnit.__wired){
      btnUnit.__wired = true;
      btnUnit.addEventListener("click", ()=>{
        const next = UnitStore.get()==="A" ? "B" : "A";
        UnitStore.set(next);
      });
    }
    const btnPrint = document.getElementById("btnPrint");
    if (btnPrint && !btnPrint.__wired){
      btnPrint.__wired = true;
      btnPrint.addEventListener("click", ()=> window.print());
    }
    const btnReset = document.getElementById("btnReset") || document.getElementById("btnResetAll");
    if (btnReset && !btnReset.__wired && typeof window.resetAll === "function"){
      btnReset.__wired = true;
      btnReset.addEventListener("click", ()=> window.resetAll());
    }
  }

  /** 觸發一次導覽高亮（header 注入後） */
  function pokeNavHighlight(){
    // 你的 script.js 會在 DOMContentLoaded/popstate 中處理高亮
    window.dispatchEvent(new Event("popstate"));
  }

  async function boot(){
    // 先寫入 data-unit，避免初載入顏色閃爍
    document.documentElement.dataset.unit = UnitStore.get();

    // 載入 header
    let headerHtml = await tryFetchMany("header.html");
    if (!headerHtml) headerHtml = fallbackHeader();
    setFragment("__header", headerHtml);

    // 載入 footer
    let footerHtml = await tryFetchMany("footer.html");
    if (!footerHtml) footerHtml = fallbackFooter();
    setFragment("__footer", footerHtml);

    // 綁定按鈕、同步單位外觀
    wireHeaderOnce();
    UnitStore.set(UnitStore.get()); // 寫回一次，讓按鈕外觀/顏色與 data-unit 保持一致

    // 通知「header-ready」（若你頁面有需要）
    window.dispatchEvent(new Event("header-ready"));

    // 做一次導覽高亮
    pokeNavHighlight();
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // 對外：提供 getUnit()
  window.getUnit = () => UnitStore.get();

})();
</script>
