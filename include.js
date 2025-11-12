<script>
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
      fetch(url, {cache:"no-store"}).then(r=>{clearTimeout(id);resolve(r)}).catch(e=>{clearTimeout(id);reject(e)});
    });
  }

  /** 多路徑嘗試（每個路徑也套逾時） */
  async function tryFetchMany(file, timeoutMs=1200){
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
  function fallbackHeader(){
    return `
<header class="topbar" style="position:sticky;top:0;z-index:1000;">
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

  /** 寫入容器 */
  function setFragment(containerId, html){
    const host = document.getElementById(containerId);
    if(!host) return null;
    host.innerHTML = html;
    return host;
  }

  /** A/B 單位狀態 */
  const UnitStore={
    key:"unit",
    get(){
      const d=document.documentElement.dataset.unit;
      if(d==="A"||d==="B") return d;
      const s=localStorage.getItem(this.key);
      return (s==="A"||s==="B")?s:"A";
    },
    set(u){
      const v=(u==="A"||u==="B")?u:"A";
      document.documentElement.dataset.unit=v;
      localStorage.setItem(this.key,v);
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

    // 嘗試載入 header / footer（各自有逾時）
    let headerHtml = await tryFetchMany("header.html", 1200);
    if(!headerHtml) headerHtml=fallbackHeader();
    setFragment("__header", headerHtml);

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
</script>
