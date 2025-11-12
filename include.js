/* 共用注入與保護：導覽、標題、單位切換、footer 備註
   - 把 header.html 插入 #__header；footer.html 插入 #__footer
   - 依據 <title> 自動設定頂欄標題（取「｜」前段，否則整段）
   - 導覽 active 以檔名比對
   - 單位切換：localStorage('unit')；廣播 'unit-change' 事件；呼叫 window.applyUnitEffects(unit)（若存在）
   - 防浮水印遮擋頂欄
*/
(function(){
  const QS = (s, r=document)=>r.querySelector(s);
  const QSA = (s, r=document)=>Array.from(r.querySelectorAll(s));

  const PATH_HEADER = 'header.html';
  const PATH_FOOTER = 'footer.html';

  function pageFile(){
    try{
      const u = new URL(location.href);
      let name = u.pathname.split('/').pop();
      if(!name || name === '') name = 'index.html';
      return name;
    }catch(_){
      // file:// 或其他情況
      const m = location.pathname.split('/').pop();
      return m || 'index.html';
    }
  }

  function pageTitleText(){
    const raw = document.title || '';
    if(!raw) return '長照工具';
    const i = raw.indexOf('｜');
    return i > 0 ? raw.slice(0, i).trim() : raw.trim();
  }

  async function injectHeader(){
    const mount = QS('#__header');
    if(!mount) return;

    try{
      const res = await fetch(PATH_HEADER, { cache:'no-store' });
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();
      mount.innerHTML = html;
    }catch(e){
      // Fallback：無法取 header.html 時，提供簡易版本避免「看起來消失」
      console.warn('[include.js] 載入 header.html 失敗：', e);
      mount.innerHTML = `
        <header class="topbar">
          <div class="inner">
            <div class="brand">
              <a href="index.html" class="logo-link" aria-label="回首頁">LOGO</a>
              <span class="site-title" id="siteTitle">${pageTitleText()}</span>
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
            <div class="actions" id="headerActions">
              <button class="btn pill btn-orange" id="btnUnitToggle" type="button">A單位</button>
              <button class="btn pill btn-gray"   id="btnPrint"       type="button">列印</button>
              <button class="btn pill btn-green"  id="btnResetAll"    type="button">清空</button>
            </div>
          </div>
        </header>
        <div class="divider"></div>
        <div style="background:#fff3cd;color:#7a5c00;padding:8px;border:1px solid #ffe69c; margin:8px 0;">
          ⚠️ 無法載入 <code>header.html</code>。請確認與本頁同資料夾，且以 <b>http(s)</b> 方式開啟（勿用 file://）。
        </div>
      `;
    }

    applyHeaderBehaviors();
  }

  async function injectFooter(){
    const mount = QS('#__footer');
    if(!mount) return;

    try{
      const res = await fetch(PATH_FOOTER, { cache:'no-store' });
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();
      mount.innerHTML = html;
    }catch(e){
      console.warn('[include.js] 載入 footer.html 失敗：', e);
      mount.innerHTML = `
        <footer class="site-footer">
          <div class="inner">
            <section class="notes">
              <h3 class="note-title">備註與說明</h3>
              <ul class="note-list">
                <li>投保級距：每年 <b>2 月</b> 與 <b>8 月</b> 會調整；請以最新公告為準。</li>
              </ul>
              <p class="muted small">@hori 版權所有</p>
            </section>
          </div>
        </footer>
      `;
    }
  }

  function applyHeaderBehaviors(){
    // 1) 依 <title> 設定頂欄標題
    const titleSpan = QS('#siteTitle');
    if(titleSpan) titleSpan.textContent = pageTitleText();

    // 2) 導覽 active 以檔名比對
    const cur = pageFile();
    QSA('.nav-links a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      const name = href.split('/').pop() || '';
      if(name === cur) a.classList.add('active');
    });

    // 3) 客製按鈕槽位（若該頁提供 #header-actions-slot，就用它取代預設 actions）
    const slot = QS('#header-actions-slot');
    const actions = QS('#headerActions');
    if(slot && actions){
      actions.replaceChildren(...Array.from(slot.childNodes));
    }

    // 4) 單位切換保險絲
    const btn = QS('#btnUnitToggle');
    if(btn && !btn.dataset.wired){
      btn.dataset.wired = '1';
      function setUnit(u){
        const unit = (u === 'A' || u === 'B') ? u : 'A';
        document.documentElement.dataset.unit = unit;
        try{ localStorage.setItem('unit', unit); }catch{}
        btn.textContent = unit + '單位';
        // 通知全站
        window.dispatchEvent(new CustomEvent('unit-change', { detail:{unit} }));
        // 呼叫你的主程式（若存在）
        try{
          if(typeof window.applyUnitEffects === 'function') window.applyUnitEffects(unit);
          else if(typeof window.applyUnitEffects === 'undefined' && typeof window.applyUnitEffects === 'function'){ window.applyUnitEffects(); }
        }catch(e){ console.warn('applyUnitEffects 執行例外：', e); }
      }
      let init = 'A'; try{ init = localStorage.getItem('unit') || 'A'; }catch{}
      setUnit(init);
      btn.addEventListener('click', ()=> setUnit(document.documentElement.dataset.unit === 'A' ? 'B' : 'A'));
    }

    // 5) 綁定列印／清空到你現有邏輯（若找得到）
    const printBtn = QS('#btnPrint');
    if(printBtn && !printBtn.dataset.wired){
      printBtn.dataset.wired='1';
      printBtn.addEventListener('click', ()=>window.print());
    }
    const resetAllBtn = QS('#btnResetAll') || QS('#btnReset');
    if(resetAllBtn && !resetAllBtn.dataset.wired){
      resetAllBtn.dataset.wired='1';
      resetAllBtn.addEventListener('click', ()=>{
        if(typeof window.resetAll === 'function') window.resetAll();
        else location.reload();
      });
    }

    // 6) 防止浮水印遮擋頂欄
    const wm = QS('.watermark');
    if(wm){
      const zi = parseInt(getComputedStyle(wm).zIndex || '0',10);
      if(!Number.isNaN(zi) && zi >= 10010) wm.style.zIndex = '100';
      wm.style.pointerEvents = 'none';
    }

    // 7) 確保頂欄可見（避免被其它樣式 display:none）
    const topbar = QS('.topbar');
    if(topbar){
      topbar.style.position = topbar.style.position || 'sticky';
      topbar.style.top = topbar.style.top || '0';
      topbar.style.zIndex = String(Math.max(10010, parseInt(getComputedStyle(topbar).zIndex || '0',10)));
    }
    const navWrap = QS('.nav-wrap');
    if(navWrap){ navWrap.style.display = 'block'; }
    const navLinks = QS('.nav-links');
    if(navLinks){
      const disp = getComputedStyle(navLinks).display;
      if(disp === 'none') navLinks.style.display = 'flex';
    }

    // 8) 初次套用單位到本頁（若別處已存）
    try{
      const unit = localStorage.getItem('unit');
      if(unit){
        document.documentElement.dataset.unit = unit;
        if(btn) btn.textContent = unit + '單位';
        window.dispatchEvent(new CustomEvent('unit-change', { detail:{unit} }));
        try{ if(typeof window.applyUnitEffects === 'function') window.applyUnitEffects(unit); }catch(e){}
      }
    }catch(_){}
  }

  function boot(){
    injectHeader().then(()=>{});  // header 先載，確保導覽顯示
    injectFooter().then(()=>{});
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }
})();
