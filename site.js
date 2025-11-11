 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/site.js b/site.js
new file mode 100644
index 0000000000000000000000000000000000000000..6c618080983fed5b54bf5f8056c1c854de885bbb
--- /dev/null
+++ b/site.js
@@ -0,0 +1,79 @@
+(function () {
+  const WATERMARK_COUNT = 15;
+
+  function ensureWatermark() {
+    if (document.querySelector('.watermark')) return;
+    const text = document.body?.dataset?.watermark || '@hori版權所有';
+    if (!text) return;
+
+    const host = document.createElement('div');
+    host.className = 'watermark';
+    for (let i = 0; i < WATERMARK_COUNT; i += 1) {
+      const span = document.createElement('span');
+      span.className = 'wm-item';
+      span.textContent = text;
+      host.appendChild(span);
+    }
+    document.body.appendChild(host);
+  }
+
+  function normalizeHref(href) {
+    try {
+      const url = new URL(href, window.location.origin);
+      let path = url.pathname.trim();
+      if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
+      path = path.replace(/\/(index\.html?)?$/i, '/index').replace(/\.html?$/i, '');
+      const parts = path.split('/');
+      return (parts[parts.length - 1] || '').toLowerCase();
+    } catch (err) {
+      return '';
+    }
+  }
+
+  function highlightCurrentNav() {
+    const here = normalizeHref(window.location.href);
+    document.querySelectorAll('.nav-links a[href]').forEach((anchor) => {
+      const target = normalizeHref(anchor.getAttribute('href'));
+      if (target && target === here) anchor.classList.add('active');
+    });
+  }
+
+  function adjustTopbarPadding() {
+    const topbar = document.querySelector('.topbar');
+    const height = topbar ? topbar.offsetHeight : 0;
+    document.documentElement.style.setProperty('--topbar-h', `${height}px`);
+  }
+
+  function adjustDockPadding() {
+    const dock = document.getElementById('bottomDock');
+    const height = dock ? dock.offsetHeight : 0;
+    document.documentElement.style.setProperty('--dock-h', `${height}px`);
+  }
+
+  function handleResize() {
+    adjustTopbarPadding();
+    adjustDockPadding();
+  }
+
+  document.addEventListener('DOMContentLoaded', () => {
+    ensureWatermark();
+    highlightCurrentNav();
+    handleResize();
+
+    window.addEventListener('resize', handleResize);
+    window.addEventListener('orientationchange', handleResize);
+
+    const topbar = document.querySelector('.topbar');
+    if (window.ResizeObserver && topbar) {
+      new ResizeObserver(adjustTopbarPadding).observe(topbar);
+    }
+
+    const dock = document.getElementById('bottomDock');
+    if (window.ResizeObserver && dock) {
+      new ResizeObserver(adjustDockPadding).observe(dock);
+    }
+  });
+
+  window.adjustTopbarPadding = adjustTopbarPadding;
+  window.adjustDockPadding = adjustDockPadding;
+})();
 
EOF
)
