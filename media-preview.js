(() => {
  const home = !!document.querySelector('#crafts');
  const selector = home ? '.unpack-card img, .experience-previews img, .wall-art, .craft-video' : 'section img, section video';
  const media = [...document.querySelectorAll(selector)].filter(el => !el.closest('a[href]:not(.experience-preview)') || el.closest('.experience-previews'));
  if (!media.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'media-preview-dialog';
  dialog.setAttribute('aria-label', 'Media preview');
  dialog.innerHTML = '<div class="media-preview-toolbar"><button type="button" data-prev aria-label="Previous image or video">←</button><p aria-live="polite"></p><button type="button" data-next aria-label="Next image or video">→</button><button type="button" data-close aria-label="Close preview">Close ×</button></div><div class="media-preview-content"></div>';
  document.body.append(dialog);
  const style = document.createElement('style');
  style.textContent = '.media-preview-dialog{position:fixed;inset:0;width:96vw;max-width:1500px;height:94dvh;max-height:94dvh;margin:auto;padding:16px;border:1px solid #555;border-radius:16px;background:#111;color:#fff;overflow:hidden}.media-preview-dialog::backdrop{background:#000d}.media-preview-dialog[open]{display:flex;flex-direction:column;gap:12px}.media-preview-toolbar{display:flex;align-items:center;gap:12px;flex:none}.media-preview-toolbar p{flex:1;min-width:0;margin:0;font:14px/1.4 Arial,sans-serif}.media-preview-toolbar button,.media-expand{padding:10px 14px;border:1px solid #777;border-radius:8px;background:#222;color:#fff;font:14px Arial,sans-serif;cursor:pointer}.media-preview-toolbar button:focus-visible,.media-expand:focus-visible,[data-media-preview]:focus-visible{outline:3px solid #b8acf9;outline-offset:3px}.media-preview-content{display:flex;align-items:center;justify-content:center;flex:1;min-height:0;overflow:auto}.media-preview-content img,.media-preview-content video{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}.media-expand{position:absolute;right:10px;top:10px;z-index:2;background:#111d}[data-media-preview]{cursor:zoom-in}@media(max-width:600px){.media-preview-dialog{padding:10px;width:98vw}.media-preview-toolbar{gap:6px}.media-preview-toolbar button{padding:10px}.media-preview-toolbar p{font-size:12px}}';
  document.head.append(style);
  let index = 0, trigger, previousOverflow, resume = [];
  const content = dialog.querySelector('.media-preview-content');
  const show = i => {
    content.querySelector('video')?.pause();
    index = (i + media.length) % media.length;
    const original = media[index], isVideo = original.tagName === 'VIDEO';
    const copy = document.createElement(isVideo ? 'video' : 'img');
    copy.src = original.currentSrc || original.src || original.querySelector('source')?.src;
    const title = original.alt || original.getAttribute('aria-label') || 'Image preview';
    if (isVideo) { copy.controls = true; copy.playsInline = true; copy.loop = true; copy.muted = true; }
    else copy.alt = title;
    content.replaceChildren(copy);
    dialog.querySelector('p').textContent = title;
    if (isVideo) copy.play().catch(() => {});
  };
  const open = (i, button) => {
    trigger = button;
    resume = [...document.querySelectorAll('video')].filter(v => !v.paused);
    resume.forEach(v => v.pause());
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    show(i); dialog.showModal(); dialog.querySelector('[data-close]').focus();
  };
  media.forEach((el, i) => {
    if (el.tagName === 'VIDEO') {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'media-expand'; button.textContent = 'Expand ↗';
      button.setAttribute('aria-label', 'Preview ' + (el.getAttribute('aria-label') || 'video'));
      el.parentElement.append(button); button.addEventListener('click', () => open(i, button));
    } else {
      const link = el.closest('a'); const target = link || el;
      if (!link) { target.tabIndex = 0; target.setAttribute('role', 'button'); }
      target.dataset.mediaPreview = '';
      target.setAttribute('aria-label', 'Preview ' + (el.alt || 'image'));
      target.addEventListener('click', event => { event.preventDefault(); open(i, target); });
      if (!link) target.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(i, target); }
      });
    }
  });
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.querySelector('[data-prev]').onclick = () => show(index - 1);
  dialog.querySelector('[data-next]').onclick = () => show(index + 1);
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  dialog.addEventListener('close', () => {
    content.querySelector('video')?.pause(); content.replaceChildren();
    document.documentElement.style.overflow = previousOverflow;
    resume.forEach(v => { if (!document.hidden) v.play().catch(() => {}); });
    trigger?.focus({ preventScroll: true });
  });
})();
