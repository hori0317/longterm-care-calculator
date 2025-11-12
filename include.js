/* include.js
 * 共用頁首／頁尾注入、導覽高亮、行為初始化
 * 2025-11-12 hori 版
 */
(function(){
  "use strict";

  /* =========================
   * A. 小工具
   * ========================= */
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function log(...args){ try{ console.log("[include]", ...args); }catch(_){} }
  function warn(...args){ try{ console.warn("[include]", ...args); }catch(_){} }

  // 正規化路徑：/foo/index.html → foo/index
  function normHref(href){
    try{
      const u = new URL(href, location.origin);
      let p = u.pathname.trim();
      if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
      p = p.replace(/\/(index\.html?)?$/i, "/index").replace(/\.html?$/i, "");
      return p.split("/").pop().toLowerCase();
    }catch(e){ return ""; }
  }

  // 目前頁面 slug
  function getSlug(){
    const p = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    return p.replace(/\.html?$/,"") || "index";
  }

  // 依 slug 取得中文頁名
  function pageNameOf(slug){
    const map = {
      index: "額度計算機",
      payroll: "薪資計算機",
      "care-info": "長照相關資訊",
      news: "最新公告",
      contact: "聯繫方式",
      about: "關於我們"
    };
    return map[slug] || "額度計算機";
  }

  // fetch + 注入
  async function injectHtml(hostSelector, url){
    const host = $(hostSelector);
    if(!host){ warn("找不到容器：", hostSelector); return null; }
    try{
      const res = await fetch(url, { cache: "no-cache" });
      if(!res.ok) throw new Error(res.status + " " + res.statusText);
      const html = await res.text();
      host.innerHTML = html;
      return host;
    }catch(e){
      host.innerHTML = `<div style="color:#b00020;font-weight:700;padding:8px 12px;border:1px solid #f2b8b5;background:#fdecea;border-radius:8px;">
        無法載入 ${url}：${(e && (e.message||e.statusText)) || e}
      </div>`;
      warn("注入失敗：", url, e);
      return host;
    }
  }

  // 廣播自訂事件（讓頁面主程式可以監聽）
  function fire(name, detail){
    try{
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }catch(_){}
  }

  /* =========================
   * B. 導覽初始化（高亮、<title>、site-title）
   * ========================= */
  function initNavHighlight(){
    const slug = getSlug();
    const anchors = $$(".nav-links a[href]");
    anchors.forEach(a=>{
      const t = normHref(a.getAttribute("href"));
      if (t && t === slug) a.classList.add("active");
    });

    // 更新 header 內的 .site-title 與 <title>
    const name = pageNameOf(slug);
    const st = $(".site-title");
    if (st) st.textContent = name;
    document.title = `${name}｜長照工具`;
  }

  /* =========================
   * C. 導覽列可視化優化（active 自動置中／滾輪左右捲動）
   * ========================= */
  function enhanceScrollableNav(){
    const wrap = $(".nav-wrap");
    const active = $(".nav-links a.active") || $(".nav-links a");
    if (!wrap) return;

    // 若超出寬度，將 active 捲到可視範圍
    try{
      if (wrap.scrollWidth > wrap.clientWidth && active){
        active.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
      }
    }catch(_){}

    // 把滑鼠滾輪的上下捲，轉成左右捲
    wrap.addEventListener("wheel", (e)=>{
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        wrap.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive:false });
  }

  /* =========================
   * D. 綁定右上方按鈕（若存在）
   * ========================= */
  function bindHeaderActions(){
    const btnUnit = $("#btnUnitToggle");
    const btnReset = $("#btnReset");
    const btnPrint = $(".actions .btn.btn-gray[onclick], #btnPrint");

    // B/A 單位切換：更新 data-unit 與按鈕文字，並廣播事件
    if (btnUnit){
      btnUnit.addEventListener("click", ()=>{
        const cur = (btnUnit.getAttribute("data-unit") || "B").toUpperCase();
        const next = cur === "B" ? "A" : "B";
        btnUnit.setAttribute("data-unit", next);
        btnUnit.textContent = `${next}單位`;
        fire("unit:toggle", { unit: next });
      });
    }

    // 重置：若頁面提供 window.resetAll()，就呼叫；否則清 localStorage + 重新整理
    if (btnReset){
      btnReset.addEventListener("click", ()=>{
        fire("app:reset", {});
        try{
          if (typeof window.resetAll === "function"){
            window.resetAll();
          }else{
            // 清掉與你常用 key 相近的快取（不會清瀏覽器所有資料）
            Object.keys(localStorage).forEach(k=>{
              if (/^(pl-|aa-|ba-|ga-|sc-|ps-|ins-|params|cfg)/i.test(k)) localStorage.removeItem(k);
            });
            location.reload();
          }
        }catch(e){
          warn("重置程序拋例外，改為重新整理：", e);
          location.reload();
        }
      });
    }

    if (btnPrint){
      // 有些頁面已經在 HTML 綁 onclick="window.print()"，這裡再補一次保險
      btnPrint.addEventListener("click", ()=> window.print());
    }
  }

  /* =========================
   * E. 主程序：注入 header/footer → 初始化
   * ========================= */
  (async function main(){
    // 讀取 body 的 data-header：lite / none / (預設為完整版)
    const headerMode = (document.body.dataset.header || "").toLowerCase().trim();
    const headerUrl = headerMode === "lite"
      ? "header-lite.html"
      : (headerMode === "none" ? null : "header.html");

    // 注入 Header
    let headerInjected = null;
    if (headerUrl){
      headerInjected = await injectHtml("#__header", headerUrl);
    }

    // 注入 Footer（若頁面沒有 __footer 容器也無妨）
    await injectHtml("#__footer", "footer.html");

    // Header 注入完成後再跑導覽高亮與標題設定
    initNavHighlight();

    // 導覽列可視化優化（水平滑動/置中）
    enhanceScrollableNav();

    // 綁定右上方按鈕（若存在）
    bindHeaderActions();

    // 告知外界「共用版面已就緒」
    fire("include:ready", { header: !!headerInjected });

    log("include.js 完成初始化");
  })();

})();
