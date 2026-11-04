// Remember the homepage position before opening a case study.
(() => {
  const key = 'portfolio-home-return';
  const read = () => {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
  };
  const isHome = /\/(?:index\.html)?$/.test(location.pathname);
  if (isHome) {
    document.addEventListener('click', event => {
      const link = event.composedPath().find(node => node instanceof HTMLAnchorElement);
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.includes('/case-studies/')) return;
      try {
        sessionStorage.setItem(key, JSON.stringify({ url: location.href, x: scrollX, y: scrollY }));
      } catch {}
    }, true);
    addEventListener('pageshow', () => {
      const url = new URL(location.href);
      if (!url.searchParams.has('portfolio-return')) return;
      const saved = read();
      url.searchParams.delete('portfolio-return');
      history.replaceState(history.state, '', url);
      if (!saved || new URL(saved.url).pathname !== location.pathname) return;
      const restore = () => scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
      restore();
      requestAnimationFrame(() => requestAnimationFrame(restore));
    });
  } else {
    const saved = read();
    if (!saved) return;
    const url = new URL(saved.url, location.href);
    if (url.origin !== location.origin || !/\/(?:index\.html)?$/.test(url.pathname)) return;
    url.searchParams.set('portfolio-return', '1');
    document.querySelectorAll('[data-portfolio-shell="header"]').forEach(host => {
      const back = host.shadowRoot?.querySelector('.case-back');
      if (back) back.href = url.href;
    });
  }
})();
