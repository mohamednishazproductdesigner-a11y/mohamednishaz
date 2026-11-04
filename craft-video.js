// Play motion work only while its section is visible and the tab is active.
(() => {
  const section = document.getElementById('crafts');
  const videos = section?.querySelectorAll('.craft-video');
  if (!videos?.length || !('IntersectionObserver' in window)) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const sync = () => {
    if (visible && !document.hidden && !reducedMotion.matches) {
      videos.forEach(video => video.play().catch(() => {})); // Native controls remain available if autoplay is blocked.
    } else videos.forEach(video => video.pause());
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0 });
  observer.observe(section);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
})();
