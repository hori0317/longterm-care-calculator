// include.js
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const LS_UNIT_KEY = 'ltc-unit'; // 'A' | 'B'

  // 依頁面檔名推斷標題
  const PAGE_TITLES = {
    'index.html': '額度計算機',
    'payroll.html': '薪資計算機',
    'quickref.html': '碼別速查'
  };

  function getPageName() {
    try {
      const u = new URL(location.href);
      const p = u.pathname.split('/').filter(Boolean).pop() || 'index.html';
      return p.toLowerCase();
    } catch {
      return 'index.html';
    }
  }

  function getUnit() {
    try {
      const v = localStorage.getItem(LS_UNIT_KEY);
      return v === 'B' ? 'B' : 'A';
    } catch { return 'A'; }
  }

  function setUnit(unit) {
    const u = unit === 'B' ? 'B' : 'A';
    try { localStorage.setItem(LS_UNIT_KEY, u); } catch {}
    document.documentElement.dataset.unit = u; // <html data-unit="A|B">
    // 按鈕外觀
    const a = $('#btnUnitA'), b = $('#btnUnitB');
    if (a && b) {
      a.setAttribute('aria-pressed', String(u === 'A'));
      b.setAttribute('aria-pressed', String(u === 'B'));
      a.classList.toggle('active', u === 'A');
      b.classList.toggle('active', u === 'B');
    }
    // 廣播事件給各頁（index.html 的 script.js 可接收）
    const ev = new CustomEvent('unit-change', { detail: { unit: u } });
    window.dispatchEvent(ev);
  }

  async function fetchText(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(url + ' load failed');
    return await r.text();
  }

  async function loadShell() {
    // 載入 header
    const headerHost = $('#__header');
    if (headerHost) {
      headerHost.innerHTML = await fetchText('header.html');
    }
    // 載入 footer
    const footerHost = $('#__footer');
    if (footerHost) {
      footerHost.innerHTML = await fetchText('footer.html');
    }
  }

  function applyTitleAndNav() {
    const page = getPageName();
    const title = PAGE_TITLES[page] || '長照工具';
    // 設定 <title>
    const t = document.title || '';
    if (!t.includes(title)) document.title = `${title}｜長照工具`;

    // Header 標題連結文字
    const brand = $('[data-title]');
    if (brand) brand.textContent = title;

    // 導覽高亮
    $$('[data-nav]').forEach(a => {
      const key = (a.getAttribute('data-nav') || '').toLowerCase();
      const href = (a.getAttribute('href') || '').toLowerCase();
      const active = href.endsWith(page) || key && page.startsWith(key);
      a.classList.toggle('active', !!active);
      if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function wireHeaderActions() {
    // A/B 單位
    const btnA = $('#btnUnitA');
    const btnB = $('#btnUnitB');
    if (btnA) btnA.addEventListener('click', () => setUnit('A'));
    if (btnB) btnB.addEventListener('click', () => setUnit('B'));

    // 初始 unit
    setUnit(getUnit());

    // 列印/清空按鈕的實作由各頁監聽（避免改動你原本頁面邏輯）
    // 這裡不處理行為，只保留按鈕節點（index/payroll 內已有監聽）
  }

  async function boot() {
    try {
      await loadShell();
      applyTitleAndNav();
      wireHeaderActions();
    } catch (e) {
      console.error('include.js init error:', e);
    }
  }

  // 啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 對外（可被頁面用到）
  window.getUnit = getUnit;
  window.setUnit = setUnit;
})();
