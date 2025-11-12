<script>
/** include.js — 注入 header/footer、導覽高亮、A/B 單位切換（含後備模板與防遮擋） */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---- 後備模板（當載入 header.html / footer.html 失敗時使用） ---- */
  const FALLBACK_HEADER = `
<header class="topbar" style="position:sticky;top:0;z-index:10001;">
  <div class="inner">
    <div class="brand">
      <a href="index.html" class="logo-link" aria-label="回首頁">
        <img src="org-logo.png" alt="logo" onerror="this.style.opacity=0.2" />
      </a>
      <span class="site-title" id="siteTitle">額度計算機</span>
    </div>
    <div class="nav-wrap">
      <nav class="nav-links" aria-label="主選單">
        <a href="index.html">額度計算機</a>
        <a href="payroll.html">薪資計算機</a>
        <a href="care-info.html">長照相關資訊</a>
        <a href="news.html">最新公告</a>
        <a href="contact.html">聯繫方式</a>
        <a href="about.html">關於我們</a>
      </nav>
    </div>
    <div class="actions">
      <button class="btn pill btn-orange" id="btnUnitToggle" type="button">A單位</button>
      <button class="btn pill btn-gray"   id="btnPrint"       type="button">列印</button>
      <button class="btn pill btn-green"  id="btnReset"       type="button">清空</button>
    </div>
  </div>
</header>
<div class="divider"></div>`.trim();

  const FALLBACK_FOOTER = `
<footer class="site-footer">
  <div class="inner">
    <section class="notes">
      <h4>備註</h4>
      <ul>
        <li>投保級距調整：每年 <b>2 月</b> 與 <b>8 月</b> 例行檢視與更新。</li>
        <li>金額與代碼以最新公告為準；如遇版本差異，請以主管機關文件為依據。</li>
      </ul>
    </section>
    <div class="copy">
      <small>&copy; <span id="yearNow"></span> @hori 版權所有｜本頁為內部工具，請勿外流。</small>
    </div>
  </div>
  <div class="divider"></div>
  <script>(function(){var y=document.getElementById('yearNow'); if(y) y.textContent=new Date().getFullYear();})();<\/script>
</footer>`.trim();

  /* ---- 取得當前檔名 ---- */
  function getCurrentFile() {
    try {
      const url = new URL(window.location.href);
      let path = url.pathname;
      if (path.endsWith('/')) path += 'index.html';
      return (path.split('/').pop() || 'index.html');
    } catch { return 'index.html'; }
  }

  /* ---- 注入外部片段，失敗則用後備模板 ---- */
  async function inject(targetSel, url, fallbackHTML) {
    const box = $(targetSel);
    if (!box) return null;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      const html = await res.text();
      box.innerHTML = html;
      return box;
    } catch (e) {
      console.warn('載入失敗，使用後備模板：', url, e);
      box.innerHTML = fallbackHTML;
      return box;
    }
  }

  /* ---- Header 行為 ---- */
  function initHeaderBehavior(scope) {
    if (!scope) return;

    // 讓導覽永遠在浮水印之上
    try {
      const topbar = scope.querySelector('.topbar');
      if (topbar) {
        topbar.style.position = topbar.style.position || 'sticky';
        topbar.style.top = topbar.style.top || '0';
        topbar.style.zIndex = String(Math.max(10001, parseInt(getComputedStyle(topbar).zIndex || '0',10)));
      }
    } catch {}

    // 導覽高亮（比對檔名）
    const cur = getCurrentFile();
    $$('.nav-links a', scope).forEach(a => {
      const href = a.getAttribute('href') || '';
      const name = href.split('/').pop() || 'index.html';
      if (name === cur) a.classList.add('active');
    });

    // 標題字帶入 <title> 前半段
    const t = document.title || '';
    const siteTitle = $('#siteTitle', scope);
    if (siteTitle) {
      const pageName = t.includes('｜') ? t.split('｜')[0] : t;
      if (pageName.trim()) siteTitle.textContent = pageName.trim();
    }

    // 列印／清空
    const printBtn = $('#btnPrint', scope);
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const resetBtn = $('#btnReset', scope) || $('#btnResetAll', scope);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (typeof window.resetAll === 'function') window.resetAll();
        else $$('input[type="number"], input[type="text"]').forEach(i => { if (!i.readOnly) i.value=''; });
      });
    }

    // A/B 切換（<html data-unit> + 廣播）
    const htmlEl = document.documentElement;
    const btnToggle = $('#btnUnitToggle', scope);
    function setUnit(u) {
      const unit = (u==='A'||u==='B') ? u : 'A';
      htmlEl.dataset.unit = unit;
      try { localStorage.setItem('unit', unit); } catch {}
      if (btnToggle) btnToggle.textContent = unit + '單位';
      window.dispatchEvent(new CustomEvent('unit-change', { detail:{ unit } }));
      try { window.applyUnitEffects && window.applyUnitEffects(unit); } catch(e) {
        console.warn('applyUnitEffects 執行例外：', e);
      }
    }
    let init = 'A'; try { init = localStorage.getItem('unit') || 'A'; } catch {}
    setUnit(init);
    if (btnToggle) btnToggle.addEventListener('click', () => setUnit(htmlEl.dataset.unit==='A' ? 'B' : 'A'));
  }

  function initFooterBehavior(_scope){}

  /* ---- 開機流程 ---- */
  async function boot() {
    // 若你的頁面沒有容器，就不動它（不改版面）
    const h = await inject('#__header', 'header.html', FALLBACK_HEADER);
    if (h) initHeaderBehavior(h);

    const f = await inject('#__footer', 'footer.html', FALLBACK_FOOTER);
    if (f) initFooterBehavior(f);

    // 若有浮水印層，避免遮擋：把浮水印 z-index 調低（不影響點擊，pointer-events 已為 none）
    const wm = document.querySelector('.watermark');
    if (wm) {
      const zi = parseInt(getComputedStyle(wm).zIndex || '0', 10);
      if (!Number.isNaN(zi) && zi >= 10001) wm.style.zIndex = '1000';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>
