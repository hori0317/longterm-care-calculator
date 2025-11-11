(function(){
  // 依據實際高度回寫 --topbar-h，避免 sticky 表頭被吃掉
  function setTopbarHeight(){
    const tb = document.getElementById('appTopbar');
    const h  = tb ? tb.offsetHeight : 56;
    document.documentElement.style.setProperty('--topbar-h', h + 'px');
  }

  // 讓滑鼠上下滾輪能左右滾動導覽列（nav-links）
  function enableNavWheelScroll(){
    const el = document.querySelector('.nav-links');
    if (!el) return;
    el.addEventListener('wheel', (e)=>{
      // 若上下位移量大於左右，將其視為水平卷動
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();   // 阻止頁面整體上下捲動
      }
    }, {passive:false});
  }

  // 初次與後續字體載入/視窗調整時都更新
  window.addEventListener('load', ()=>{
    setTopbarHeight();
    enableNavWheelScroll();
  }, { once:true });

  window.addEventListener('resize', setTopbarHeight, { passive:true });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(setTopbarHeight); }
})();
