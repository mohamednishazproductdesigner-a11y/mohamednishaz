(() => {
  const videos = [...document.querySelectorAll('.fit-assistant-cover')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const update = () => videos.forEach(video => {
    if (motion.matches || document.hidden || !visible.has(video)) video.pause();
    else video.play().catch(() => {});
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    update();
  });
  videos.forEach(video => { video.removeAttribute('autoplay'); observer.observe(video); });
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
})();
