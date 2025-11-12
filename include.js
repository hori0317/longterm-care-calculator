<script>
/* include.js ─ 動態載入 header/footer，並處理導覽高亮＋右上角按鈕行為 */
(async function(){
  // 依 body data-header 選 lite 或完整
  const headerUrl = (document.body.dataset.header === 'lite') ? 'header-lite.html' : 'header.html';

  async function inject(id, url){
    const host = document.getElementById(id);
    if(!host) return;
    try{
      const res = await fetch(url, { cache: 'no-cache' });
      host.innerHTML = await res.text();
    }catch(e){
      host.innerHTML = `<div style="color:#b00020;font-weight:700;">無法載入 ${url}</div>`;
    }
  }

  // 1) 載入
  await inject('__header', headerUrl);
  await inject('__footer', 'footer.html');

  // 2) 導覽高亮＋標題同步（在插入 header 後執行）
  (function(){
    function norm(pathname){
      let p = String(pathname||'/').trim();
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0,-1);
      p = p.replace(/\/(index\.html?)?$/i, '/index').replace(/\.html?$/i,'');
      return (p.split('/').pop() || 'index').toLowerCase();
    }
    const here = norm(location.pathname);
    // 高亮
    document.querySelectorAll('.nav-links a[href]').forEach(a=>{
      const raw = (a.getAttribute('href')||'').trim();
      if(!raw) return;
      let tgt = raw.replace(/^\.\//,'').replace(/\.html?$/i,'').replace(/\/$/,'') || 'index';
      if (tgt === here) a.classList.add('active');
    });
    // 標題
    const map = {
      index:'額度計算機',
      payroll:'薪資計算機',
      'care-info':'長照相關資訊',
      news:'最新公告',
      contact:'聯繫方式',
      about:'關於我們'
    };
    const title = map[here] || '額度計算機';
    const st = document.getElementById('siteTitle');
    if (st) st.textContent = title;
    document.title = `${title}｜長照工具`;
  })();

  // 3) A/B 單位按鈕 & 列印/清空 綁定（不改你既有 script.js，僅負責發事件）
  (function(){
    const html = document.documentElement;
    const KEY = 'unit';

    function getUnit(){
      const s = localStorage.getItem(KEY);
      return (s === 'A' || s === 'B') ? s : 'A';
    }
    function setUnit(u){
      localStorage.setItem(KEY, u);
      html.dataset.unit = u;
      // 廣播給頁面自身（你的 script.js 可在 unit-change 之後跑 applyUnitEffects）
      window.dispatchEvent(new CustomEvent('unit-change', { detail: { unit:u }}));
    }
    // 初始寫入 data-unit（避免 CSS/JS 取不到）
    setUnit(getUnit());

    // 綁定三顆按鈕（若頁面沒有就略過）
    const btnUnit = document.getElementById('btnUnitToggle');
    const btnPrint = document.getElementById('btnPrint');
    const btnReset = document.getElementById('btnReset') || document.getElementById('btnResetAll');

    if (btnUnit){
      // 依目前狀態顯示文字
      const syncText = () => { btnUnit.textContent = `${getUnit()}單位`; };
      syncText();

      btnUnit.addEventListener('click', ()=>{
        const next = (getUnit()==='A') ? 'B' : 'A';
        setUnit(next);
        syncText();
      });
    }

    if (btnPrint){
      btnPrint.addEventListener('click', ()=> window.print());
    }

    if (btnReset){
      btnReset.addEventListener('click', ()=>{
        // 盡量呼叫你頁面原本的 resetAll()；若沒有就刷新
        if (typeof window.resetAll === 'function') {
          window.resetAll();
        } else {
          // 退而求其次：清幾個常見的地方儲存鍵
          ['pl-aa','pl-ba','pl-ga','pl-sc','pl-params','addons'].forEach(k=>localStorage.removeItem(k));
          location.reload();
        }
      });
    }
  })();
})();
</script>
