<script>
/* include.js ─ 動態注入 header/footer，並處理導覽高亮 + A/B 按鈕行為 */
(async function(){
  // 確保有佔位元素
  if(!document.getElementById('__header')){
    const h = document.createElement('div'); h.id = '__header';
    document.body.prepend(h);
  }
  if(!document.getElementById('__footer')){
    const f = document.createElement('div'); f.id = '__footer';
    document.body.appendChild(f);
  }

  const headerUrl = (document.body.dataset.header === 'lite')
    ? 'header-lite.html' : 'header.html';

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

  await inject('__header', headerUrl);
  await inject('__footer', 'footer.html');

  /* 導覽高亮與標題 */
  (function(){
    function norm(pathname){
      let p = String(pathname||'/').trim();
      if (p.length>1 && p.endsWith('/')) p = p.slice(0,-1);
      p = p.replace(/\/(index\.html?)?$/i,'/index').replace(/\.html?$/i,'');
      return (p.split('/').pop()||'index').toLowerCase();
    }
    const here = norm(location.pathname);
    document.querySelectorAll('.nav-links a[href]').forEach(a=>{
      const raw=(a.getAttribute('href')||'').trim();
      if(!raw) return;
      const tgt = raw.replace(/^\.\//,'').replace(/\.html?$/i,'').replace(/\/$/,'') || 'index';
      if(tgt===here) a.classList.add('active');
    });
    const map = {
      index:'額度計算機', payroll:'薪資計算機', 'care-info':'長照相關資訊',
      news:'最新公告', contact:'聯繫方式', about:'關於我們'
    };
    const title = map[here] || '額度計算機';
    const st = document.getElementById('siteTitle'); if(st) st.textContent = title;
    document.title = `${title}｜長照工具`;
  })();

  /* A/B 單位與常用按鈕（不改你原本 script.js，僅廣播 unit-change） */
  (function(){
    const html = document.documentElement;
    const KEY = 'unit';
    const getUnit = () => (localStorage.getItem(KEY)==='B' ? 'B' : 'A');
    const setUnit = (u) => {
      localStorage.setItem(KEY,u);
      html.dataset.unit = u;
      window.dispatchEvent(new CustomEvent('unit-change',{detail:{unit:u}}));
    };
    setUnit(getUnit()); // 初始化

    const btnUnit = document.getElementById('btnUnitToggle');
    const btnPrint = document.getElementById('btnPrint');
    const btnReset = document.getElementById('btnReset') || document.getElementById('btnResetAll');

    if (btnUnit){
      const sync = ()=> btnUnit.textContent = `${getUnit()}單位`;
      sync();
      btnUnit.addEventListener('click', ()=>{ setUnit(getUnit()==='A'?'B':'A'); sync(); });
    }
    if (btnPrint){ btnPrint.addEventListener('click', ()=>window.print()); }
    if (btnReset){
      btnReset.addEventListener('click', ()=>{
        if (typeof window.resetAll === 'function') return window.resetAll();
        ['pl-aa','pl-ba','pl-ga','pl-sc','pl-params','addons'].forEach(k=>localStorage.removeItem(k));
        location.reload();
      });
    }
  })();
})();
</script>
