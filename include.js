// include.js － 共用導覽／頁尾注入 + 路徑與高亮處理（完整版）
(async function(){
  /* ========== A. 修正浮水印層級，避免蓋住頂欄 ========== */
  try{
    const fix = document.createElement('style');
    fix.textContent = `.watermark{z-index:0 !important}`;
    document.head.appendChild(fix);
  }catch(_){}

  /* ========== B. 自動偵測 GitHub Pages 子路徑 ========== *
   * 你的站台根目錄是 /longterm-care-calculator/ ，
   * 但若日後搬家，這段仍會用當前 URL 自動推算基底路徑。
   */
  const path = location.pathname;
  const basePath = path.includes('/longterm-care-calculator/')
    ? '/longterm-care-calculator/'
    : path.replace(/[^/]*$/, ''); // 退回到目前路徑的資料夾
  function urlOf(file){ return new URL(file, location.origin + basePath).href; }

  /* ========== C. 動態注入 header / footer ========== */
  const headerFile = (document.body.dataset.header === 'lite')
    ? 'header-lite.html'
    : 'header.html';

  async function inject(id, file){
    const host = document.getElementById(id);
    if(!host) return { ok:false, why:`找不到 #${id}` };
    const url = urlOf(file);
    try{
      const res = await fetch(url, { cache:'no-cache' });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      host.innerHTML = await res.text();
      return { ok:true };
    }catch(e){
      host.innerHTML =
        `<div style="padding:10px;color:#fff;background:#b00020;font-weight:800;">
           無法載入 ${file}（${e.message||e}）
         </div>`;
      return { ok:false, why:String(e) };
    }
  }

  const h = await inject('__header', headerFile);
  const f = await inject('__footer', 'footer.html');

  // 若頂欄仍沒出現，顯示明顯提示
  if(!document.querySelector('.topbar')){
    const warn = document.createElement('div');
    warn.style.cssText = 'position:sticky;top:0;z-index:2000;background:#b00020;color:#fff;padding:8px 12px;font-weight:800';
    warn.textContent = `⚠️ 頂欄未載入成功：${h.ok ? '樣式衝突或被隱藏' : (h.why || '未知錯誤')}`;
    document.body.prepend(warn);
  }

  /* ========== D. 導覽高亮與 <title> 設定 ========== */
  function slug(){
    const p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p.replace(/\.html?$/,'') || 'index';
  }
  function setActive(){
    const s = slug();
    // 高亮當前頁
    document.querySelectorAll('.nav-links a[href]').forEach(a=>{
      const t = (a.getAttribute('href') || '').replace(/\.html?$/,'').toLowerCase() || 'index';
      if(t === s) a.classList.add('active');
    });
    // 設定 <title> 與 .site-title
    const map = {
      index:'額度計算機',
      payroll:'薪資計算機',
      'care-info':'長照相關資訊',
      news:'最新公告',
      contact:'聯繫方式',
      about:'關於我們'
    };
    const title = (map[s] || '額度計算機') + '｜長照工具';
    document.title = title;
    const st = document.querySelector('.site-title');
    if(st) st.textContent = map[s] || '額度計算機';
  }
  setActive();
  window.addEventListener('hashchange', setActive);

  /* ========== E. 通知其他腳本「頂欄已準備好」 ========== */
  document.dispatchEvent(new CustomEvent('layout:header-ready'));
})();
