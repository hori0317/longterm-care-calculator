(async function(){
  // 依 body data-header 切換完整或精簡 Header
  const headerType = document.body.dataset.header === 'lite' ? 'header-lite.html' : 'header.html';

  async function inject(id, url){
    const el = document.getElementById(id);
    if(!el) return;
    try{
      const res = await fetch(url, { cache: 'no-cache' });
      const html = await res.text();
      el.innerHTML = html;
    }catch(e){
      el.innerHTML = `<div style="color:#b00020;font-weight:700;">無法載入 ${url}</div>`;
    }
  }

  // 載入共用 header / footer
  await inject('__header', headerType);
  await inject('__footer', 'footer.html');

  // -------- 共用：頁面偵測與標題、導覽高亮 --------
  function slug(){
    try{
      const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      return (p.replace(/\.html?$/,'') || 'index');
    }catch{ return 'index'; }
  }
  const s = slug();
  const titleMap = {
    'index':'額度計算機',
    'payroll':'薪資計算機',
    'care-info':'長照相關資訊',
    'news':'最新公告',
    'contact':'聯繫方式',
    'about':'關於我們'
  };

  // 導覽高亮 + 標題同步
  (function syncHeaderUI(){
    document.querySelectorAll('.nav-links a[href]').forEach(a=>{
      const t = (a.getAttribute('href')||'').replace(/\.html?$/,'').toLowerCase() || 'index';
      if(t===s) a.classList.add('active');
    });
    const st = document.getElementById('siteTitle');
    if(st) st.textContent = titleMap[s] || '長照工具';
    document.title = `${titleMap[s] || '長照工具'}｜長照工具`;
  })();

  // -------- 每頁右側按鈕（僅控制右側 actions，不動版面）--------
  (function setupPageActions(){
    const host = document.getElementById('headerActions');
    if(!host) return; // lite 版沒有 actions

    function addBtn({cls,id,text,on}){
      const el = document.createElement('button');
      el.className = cls;
      el.id = id;
      el.type = 'button';
      el.textContent = text;
      if(typeof on === 'function') el.addEventListener('click', on);
      host.appendChild(el);
    }

    if(s === 'index'){
      // 頁面：額度計算機（ID 與你的 script.js 綁定一致）
      addBtn({ cls:'btn pill btn-orange', id:'btnUnitToggle', text:'B單位' });
      addBtn({ cls:'btn pill btn-green',  id:'btnReset',      text:'重置'  });
      addBtn({ cls:'btn pill btn-gray',   id:'btnPrint',      text:'列印', on:()=>window.print() });
    }else if(s === 'payroll'){
      // 頁面：薪資計算機
      addBtn({ cls:'btn pill btn-gray',  id:'btnPrint',    text:'列印',     on:()=>window.print() });
      addBtn({ cls:'btn pill btn-green', id:'btnResetAll', text:'全部清空' });
    }else{
      // 其他頁預設不放按鈕；有需要可再擴充
    }
  })();

  // -------- Footer 備註（集中在 footer.html，且支援每頁自定備註）--------
  (function setupFooterNotes(){
    // 預設共用備註（從你原本頁面搬來一致管理）
    const defaultNotes = [
      '※ 每年 2 月與 8 月調整投保級距，並於次月 1 號生效。'
    ];
    // 讀取該頁額外備註：<body data-notes="備註一||備註二">
    const extra = (document.body.dataset.notes || '')
      .split('||')
      .map(s=>s.trim())
      .filter(Boolean);

    const notes = [...defaultNotes, ...extra];

    const box = document.getElementById('footerNotes');
    if(!box) return;

    // 以 span 顯示（沿用 .foot 佈局）
    box.innerHTML = '';
    notes.forEach(t=>{
      const sp = document.createElement('span');
      sp.className = 'ok';
      sp.textContent = t;
      box.appendChild(sp);
    });
  })();

})();
