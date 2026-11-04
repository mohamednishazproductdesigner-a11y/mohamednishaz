// Native scrolling + a sticky stage; all transforms are scrubbed, never time-triggered.
(()=>{
  const section=document.querySelector('.design-wall-section');
  if(!section)return;
  const stage=section.querySelector('.wall-stage');
  const viewport=section.querySelector('.wall-viewport');
  const grid=section.querySelector('.wall-grid');
  const cards=[...grid.children];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  // Individual windows and starting rotations: center first, outer columns, lower row.
  const entrances=[
    {start:.17,end:.65,x:-.28,rx:-62,ry:24,rz:-9,z:-420,lift:1.12},
    {start:.055,end:.51,x:-.12,rx:-70,ry:12,rz:-5,z:-560,lift:1},
    {start:.10,end:.56,x:.16,rx:-66,ry:-16,rz:6,z:-480,lift:1.08},
    {start:.24,end:.73,x:.32,rx:-58,ry:-26,rz:11,z:-380,lift:1.16},
    {start:.35,end:.84,x:-.22,rx:-64,ry:18,rz:-7,z:-520,lift:1.14},
    {start:.30,end:.79,x:-.08,rx:-72,ry:9,rz:4,z:-640,lift:1.06},
    {start:.27,end:.81,x:.13,rx:-60,ry:-14,rz:-5,z:-440,lift:1.1},
    {start:.43,end:.91,x:.26,rx:-68,ry:-22,rz:8,z:-580,lift:1.2}
  ];
  const clamp=n=>Math.max(0,Math.min(1,n));
  const smooth=n=>n*n*(3-2*n);
  let metrics,frame=0,measureFrame=0,current=0,target=0,lastTime=0;

  function measure(){
    const mobile=innerWidth<=760;
    const height=stage.offsetHeight;
    const distance=innerHeight*(mobile?2.25:2.65);
    section.style.setProperty('--wall-stage-height',`${height}px`);
    section.style.setProperty('--wall-scroll-distance',`${distance}px`);
    metrics={mobile,height,distance,top:section.getBoundingClientRect().top+scrollY,
      positions:cards.map(card=>({width:card.offsetWidth,height:card.offsetHeight,
        top:viewport.offsetTop+grid.offsetTop+card.offsetTop}))};
  }
  function draw(progress){
    const {mobile,height,positions}=metrics;
    cards.forEach((card,index)=>{
      const entry=entrances[index];
      // On phones, assemble the first two rows early; later rows follow below.
      const start=mobile?[.07,.11,.20,.25,.34,.39,.46,.51][index]:entry.start;
      const end=mobile?[.48,.52,.61,.66,.75,.80,.86,.91][index]:entry.end;
      const local=clamp((progress-start)/(end-start));
      const travel=1-Math.pow(1-local,3);
      const straighten=smooth(local);
      const position=positions[index];
      const remaining=1-straighten;
      // Keep every projected panel below the viewport at the start, including
      // deep panels whose negative Z would otherwise project towards the center.
      const initialY=height*(mobile?1.55:2.05)*entry.lift+position.height-position.top;
      const y=initialY*(1-travel);
      const x=position.width*entry.x*(1-travel)*(mobile?.55:1);
      const rotation=mobile?.48:1;
      const z=entry.z*remaining*(mobile?.4:1);
      card.style.transform=`translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,${z.toFixed(3)}px) rotateX(${(entry.rx*remaining*rotation).toFixed(3)}deg) rotateY(${(entry.ry*remaining*rotation).toFixed(3)}deg) rotateZ(${(entry.rz*remaining*rotation).toFixed(3)}deg)`;
      card.style.visibility=local===0?'hidden':'visible';
    });
    section.classList.toggle('is-assembling',progress>0&&progress<.999);
  }
  function tick(time){
    const delta=lastTime?Math.min(time-lastTime,64):16;
    lastTime=time;
    current+=(target-current)*(1-Math.exp(-delta/105));
    if(Math.abs(target-current)<.0001)current=target;
    draw(current);
    if(current!==target)frame=requestAnimationFrame(tick);
    else{frame=0;lastTime=0}
  }
  function update(){
    if(motion.matches||!metrics)return;
    target=clamp((scrollY-metrics.top)/metrics.distance);
    if(!frame)frame=requestAnimationFrame(tick);
  }
  function configure(){
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    section.classList.toggle('wall-enhanced',!motion.matches);
    if(motion.matches){
      section.classList.remove('is-assembling');
      cards.forEach(card=>{card.style.removeProperty('transform');card.style.removeProperty('visibility')});
      return;
    }
    measure();
    current=target=clamp((scrollY-metrics.top)/metrics.distance);
    draw(current);
  }
  function scheduleMeasure(){
    if(measureFrame)return;
    measureFrame=requestAnimationFrame(()=>{measureFrame=0;configure()});
  }
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',scheduleMeasure);
  addEventListener('pageshow',scheduleMeasure);
  motion.addEventListener('change',configure);
  // Layout changes above the scene (experience expansion, fonts, images) must
  // update its document offset. Observing main catches those without polling.
  new ResizeObserver(scheduleMeasure).observe(section.closest('main'));
  new ResizeObserver(scheduleMeasure).observe(stage);
  section.querySelectorAll('img').forEach(img=>{
    if(!img.complete)img.addEventListener('load',scheduleMeasure,{once:true});
  });
  document.fonts.ready.then(scheduleMeasure);
  configure();
})();
