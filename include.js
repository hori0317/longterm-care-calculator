/* 共用：載入 header/footer、導覽高亮、單位切換（A/B）、常用按鈕接線
   強化點：
   - 載入後立即掛事件，並用 MutationObserver 保險
   - 單位切換：同步 html[data-unit] + localStorage + 事件廣播 + 呼叫 applyUnitEffects(unit)
   - 強制水印不擋點擊
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
      if(!name) name = 'index.html';
      return name;
    }catch(_){
      const p = location.pathname.split('/').pop();
      return p || 'index.html';
    }
  }
  function pageTitleText(){
    const raw = document.title || '';
    if(!raw) return '長照工具';
    const i = raw.indexOf('｜');
    return i>0 ? raw.slice(0,i).trim() : raw.trim();
  }

  async function inject(targetSel, url, fallbackHTML){
    const mount = QS(targetSel);
    if(!mount) return null;
    try{
      const res = await fetch(url, {cache:'no-store'});
      if(!res.ok) throw new Error(res.status+' '+res.statusText);
      mount.innerHTML = await res.text();
    }catch(e){
      console.warn('[include.js] 載入失敗', url, e);
      mount.innerHTML = fallbackHTML || '';
    }
    return mount;
  }

  function wireHeaderOnce(root){
    if(!root) return;
    if(root.__wired) return; // 防重複
    root.__wired = true;

    // 1) 標題文字
    const titleSpan = root.querySelector('#siteTitle');
    if(titleSpan) titleSpan.textContent = pageTitleText();

    // 2) 導覽 active
    const cur = pageFile();
    root.querySelectorAll('.nav-links a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      const name = href.split('/').pop() || '';
      if(name === cur) a.classList.add('active');
    });

    // 3) 客製右側按鈕槽位（若頁面內有 #header-actions-slot）
    const slot = QS('#header-actions-slot');
    const actions = root.querySelector('#headerActions');
    if(slot && actions){
      actions.replaceChildren(...Array.from(slot.childNodes));
    }

    // 4) 單位切換（多重保險絲 + 事件廣播）
    const btnUnit = root.querySelector('#btnUnitToggle');
    function setUnit(u){
      const unit = (u==='A'||u==='B') ? u : 'A';
      document.documentElement.dataset.unit = unit;
      try{ localStorage.setItem('unit', unit); }catch{}
      if(btnUnit) btnUnit.textContent = unit + '單位';
      // 廣播與主程式銜接
      window.dispatchEvent(new CustomEvent('unit-change', {detail:{unit}}));
      try{
        if(typeof window.applyUnitEffects === 'function') window.applyUnitEffects(unit);
        else if(typeof window.applyUnitEffects === 'function') window.applyUnitEffects(); // 後備
      }catch(e){ console.warn('applyUnitEffects 例外：', e); }
    }
    if(btnUnit && !btnUnit.__wired){
      btnUnit.__wired = true;
      let init = 'A'; try{ init = localStorage.getItem('unit') || 'A'; }catch{}
      setUnit(init);
      btnUnit.addEventListener('click', ()=> setUnit(document.documentElement.dataset.unit === 'A' ? 'B' : 'A'));
    }else{
      // 沒找到按鈕也要初始化資料層，避免其他頁需要 unit 狀態
      let init = 'A'; try{ init = localStorage.getItem('unit') || 'A'; }catch{}
      setUnit(init);
    }

    // 5) 列印/清空接線（不影響你的既有邏輯）
    const btnPrint = root.querySelector('#btnPrint');
    if(btnPrint && !btnPrint.__wired){
      btnPrint.__wired = true;
      btnPrint.addEventListener('click', ()=>window.print());
    }
    const btnReset = root.querySelector('#btnResetAll') || root.querySelector('#btnReset');
    if(btnReset && !btnReset.__wired){
      btnReset.__wired = true;
      btnReset.addEventListener('click', ()=>{
        if(typeof window.resetAll === 'function') window.resetAll();
        else location.reload();
      });
    }

    // 6) 水印不要擋點擊
    const wm = QS('.watermark');
    if(wm){
      wm.style.pointerEvents = 'none';
      const zi = parseInt(getComputedStyle(wm).zIndex || '0',10);
      if(zi >= 10010) wm.style.zIndex = '100';
    }
  }

  // 監看 header 節點變化，若被重繪（或 slot 替換）則重掛事件
  function observeHeader(root){
    if(!root) return;
    if(root.__observer) return;
    const mo = new MutationObserver(()=>{ root.__wired = false; wireHeaderOnce(root); });
    mo.observe(root, {childList:true, subtree:true});
    root.__observer = mo;
  }

  async function boot(){
    // 先載 header（避免「看起來消失」）
    const header = await inject('#__header', PATH_HEADER, `
      <header class="topbar">
        <div class="inner">
          <div class="brand"><a class="logo-link" href="index.html">LOGO</a><span id="siteTitle">${pageTitleText()}</span></div>
          <div class="nav-wrap"><nav class="nav-links">
            <a href="index.html">額度計算機</a>
            <a href="payroll.html">薪資計算機</a>
            <a href="care-info.html">長照相關資訊</a>
            <a href="news.html">最新公告</a>
            <a href="contact.html">聯繫方式</a>
            <a href="about.html">關於我們</a>
          </nav></div>
          <div class="actions" id="headerActions">
            <button class="btn pill btn-orange" id="btnUnitToggle" type="button">A單位</button>
            <button class="btn pill btn-gray"   id="btnPrint"       type="button">列印</button>
            <button class="btn pill btn-green"  id="btnResetAll"    type="button">清空</button>
          </div>
        </div>
      </header>
      <div class="divider"></div>
    `);
    wireHeaderOnce(header);
    observeHeader(header);

    // 再載 footer
    await inject('#__footer', PATH_FOOTER, `
      <footer class="site-footer"><div class="inner">
        <section class="notes">
          <h3 class="note-title">備註與說明</h3>
          <ul class="note-list"><li>投保級距：每年 2 月與 8 月調整；以最新公告為準。</li></ul>
          <p class="muted small">@hori 版權所有</p>
        </section>
      </div></footer>
    `);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
