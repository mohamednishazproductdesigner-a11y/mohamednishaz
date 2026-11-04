(()=>{
  const root=document.documentElement;
  const loader=document.querySelector('.name-loader');
  if(!loader)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let done=false;
  const finish=()=>{
    if(done)return;
    done=true;
    root.classList.remove('name-loading');
    loader.remove();
    document.dispatchEvent(new Event('portfolio-ready'));
  };
  // Never block navigation or trap focus behind the intro.
  const content=[...document.body.children].filter(el=>el.matches('header,main,footer'));
  if(!motion.matches)content.forEach(el=>el.inert=true);
  const reveal=()=>{content.forEach(el=>el.inert=false);loader.classList.add('is-revealing');};
  const leave=()=>{reveal();finish();};
  loader.querySelector('button').addEventListener('click',leave);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')leave();});
  motion.addEventListener('change',e=>{if(e.matches)leave();});
  window.addEventListener('pageshow',e=>{if(e.persisted)leave();});
  if(motion.matches){leave();return;}
  setTimeout(reveal,3100);
  setTimeout(leave,3750);
})();
