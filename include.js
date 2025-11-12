<script>
(async function(){
  const headerFile = (document.body.dataset.header === 'lite') ? 'header-lite.html' : 'header.html';

  async function inject(id, url){
    const el = document.getElementById(id);
    if(!el) return false;
    try{
      const res = await fetch(url, { cache: 'no-cache' });
      el.innerHTML = await res.text();
      return true;
    }catch(e){
      el.innerHTML = `<div style="color:#b00020;font-weight:700;">無法載入 ${url}</div>`;
      return false;
    }
  }

  // 先注入
  await inject('__header', headerFile);
  await inject('__footer', 'footer.html');

  // 再做導覽高亮與 <title>
  function slug(){
    const p=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    return p.replace(/\.html?$/,'')||'index';
  }
  function setActive(){
    const s=slug();
    document.querySelectorAll('.nav-links a[href]').forEach(a=>{
      const t=(a.getAttribute('href')||'').replace(/\.html?$/,'').toLowerCase()||'index';
      if(t===s) a.classList.add('active');
    });
    const map={
      index:'額度計算機', payroll:'薪資計算機', 'care-info':'長照相關資訊',
      news:'最新公告', contact:'聯繫方式', about:'關於我們'
    };
    const title=(map[s]||'額度計算機')+'｜長照工具';
    document.title = title;
    const st=document.querySelector('.site-title');
    if(st) st.textContent = map[s] || '額度計算機';
  }
  setActive();
  window.addEventListener('hashchange', setActive);

  // 通知其他腳本「頂欄已就緒」
  document.dispatchEvent(new CustomEvent('layout:header-ready'));
})();
</script>
