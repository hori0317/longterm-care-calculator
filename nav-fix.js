/* === 自動更新 topbar 高度變數 === */
(function setTopbarH() {
  const tb = document.getElementById('appTopbar') || document.querySelector('.topbar');
  if (!tb) return;
  const apply = () => {
    const h = Math.round(tb.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--topbar-h', h + 'px');
  };
  window.addEventListener('load', apply);
  window.addEventListener('resize', apply);
  new ResizeObserver(apply).observe(tb);
  setTimeout(apply, 0);
})();

/* === 導覽橫向滑動輔助 === */
(function navScrollHelpers() {
  const nav = document.getElementById('topNav');
  if (!nav) return;
  const track = nav.querySelector('.nav-track') || nav;

  // 垂直滾輪 → 水平滑動
  nav.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      nav.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  // 滑鼠拖曳捲動
  let isDown = false, startX = 0, startL = 0;
  nav.addEventListener('mousedown', e => { isDown = true; startX = e.pageX; startL = nav.scrollLeft; nav.style.cursor = 'grabbing'; });
  nav.addEventListener('mouseleave', () => { isDown = false; nav.style.cursor = ''; });
  nav.addEventListener('mouseup', () => { isDown = false; nav.style.cursor = ''; });
  nav.addEventListener('mousemove', e => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    nav.scrollLeft = startL - dx;
  });

  // 檢查是否超寬（確保能滑回最左）
  const check = () => {
    if (track.scrollWidth > nav.clientWidth && nav.scrollLeft < 0)
      nav.scrollLeft = 0;
  };
  window.addEventListener('load', check);
  window.addEventListener('resize', check);
  new ResizeObserver(check).observe(track);
  check();
})();
