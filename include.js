<script>
/** include.js — 注入 header/footer、導覽高亮、A/B 單位切換、通用按鈕繫結 */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** 取得當前檔名（容忍 /index.html 與子路徑） */
  function getCurrentFile() {
    try {
      const url = new URL(window.location.href);
      let path = url.pathname;
      // GitHub Pages 子路徑處理：/repo/ 或 /repo/sub/...
      if (path.endsWith('/')) path += 'index.html';
      const file = path.split('/').pop();
      return file || 'index.html';
    } catch {
      return 'index.html';
    }
  }

  /** 注入外部片段到容器 */
  async function inject(targetSel, url) {
    const box = $(targetSel);
    if (!box) return null;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      const html = await res.text();
      box.innerHTML = html;
      return box;
    } catch (e) {
      console.warn('載入失敗：', url, e);
      return null;
    }
  }

  /** 設定導覽高亮與網站標題 */
  function initHeaderBehavior(scope) {
    if (!scope) return;

    // 1) 依檔名高亮
    const cur = getCurrentFile();
    const links = $$('.nav-links a', scope);
    links.forEach(a => {
      try {
        const href = a.getAttribute('href') || '';
        // 只比對檔名；允許相對位址
        const name = href.split('/').pop() || 'index.html';
        if (name === cur) a.classList.add('active');
      } catch {}
    });

    // 2) 網站標題文字依頁面 title 帶入（只取「｜」前半段）
    const t = document.title || '';
    const siteTitle = $('#siteTitle', scope);
    if (siteTitle) {
      const pageName = t.includes('｜') ? t.split('｜')[0] : t;
      if (pageName.trim()) siteTitle.textContent = pageName.trim();
    }

    // 3) 通用按鈕繫結（列印/清空）
    const printBtn = $('#btnPrint', scope);
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const resetBtn = $('#btnReset', scope) || $('#btnResetAll', scope);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (typeof window.resetAll === 'function') {
          window.resetAll();              // 你原本的全清邏輯
        } else {
          // 後備：清空所有 <input type="number/text">
          $$('input[type="number"], input[type="text"]').forEach(i => { if (!i.readOnly) i.value = ''; });
        }
      });
    }

    // 4) A/B 單位切換（寫到 <html data-unit>，廣播 unit-change）
    const htmlEl = document.documentElement;
    const btnToggle = $('#btnUnitToggle', scope);

    function setUnit(u) {
      const unit = (u === 'A' || u === 'B') ? u : 'A';
      htmlEl.dataset.unit = unit;
      try { localStorage.setItem('unit', unit); } catch {}
      if (btnToggle) btnToggle.textContent = unit + '單位';

      // 廣播事件
      window.dispatchEvent(new CustomEvent('unit-change', { detail: { unit } }));

      // 嘗試呼叫你既有的效果函式
      try { window.applyUnitEffects ? window.applyUnitEffects(unit) : null; } catch (e) {
        console.warn('applyUnitEffects 執行例外：', e);
      }
    }

    // 初始化單位（localStorage → data-unit）
    let init = 'A';
    try { init = localStorage.getItem('unit') || 'A'; } catch {}
    setUnit(init);

    if (btnToggle) {
      btnToggle.addEventListener('click', () => setUnit(htmlEl.dataset.unit === 'A' ? 'B' : 'A'));
    }
  }

  /** 頁尾備註不需特殊行為，保留空間即可 */
  function initFooterBehavior(scope) {
    // 預留：若未來要在 footer 放切換或動態年份，可在此處理
  }

  // ===== 實際注入流程 =====
  async function boot() {
    // header：若頁面已有 #__header，就注入；否則忽略（不改你的版面）
    const h = await inject('#__header', 'header.html');
    if (h) initHeaderBehavior(h);

    // footer：同理
    const f = await inject('#__footer', 'footer.html');
    if (f) initFooterBehavior(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
</script>
