// Scroll stays native: a sticky scene opens the box and unpacks each artwork.
(()=>{
  const section=document.querySelector('.unpack-section');
  if(!section)return;
  const stage=section.querySelector('.unpack-stage');
  const cards=[...section.querySelectorAll('.unpack-card')];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const t=clamp(value);return t*t*t*(t*(t*6-15)+10)};
  const mix=(from,to,progress)=>from+(to-from)*progress;
  let metrics,frame=0,current=0,target=0,lastTime=0;
  function measure(){
    const height=stage.clientHeight,width=stage.clientWidth;
    const mobile=innerWidth<=760;
    const cardRatio=3/2;
    const cardWidth=mobile?Math.min(width,height*.205*cardRatio,340):Math.min(360,(width-48)/3);
    const boxWidth=mobile?Math.min(230,width*.7,height*.28):Math.min(350,width*.4,height*.45);
    const boxTop=height*(mobile?.81:.62);
    metrics={height,width,mobile,cardWidth,cardHeight:cardWidth/cardRatio,boxWidth,boxTop,top:section.getBoundingClientRect().top+scrollY,travel:Math.max(1,section.offsetHeight-height)};
    stage.style.setProperty('--unpack-card-width',`${cardWidth}px`);
    stage.style.setProperty('--box-width',`${boxWidth}px`);
    stage.style.setProperty('--box-top',`${boxTop}px`);
  }
  function draw(progress){
    const {height,mobile,cardWidth,cardHeight,boxWidth,boxTop}=metrics;
    const opening=smooth((progress-.035)/.23);
    stage.style.setProperty('--lid-angle',`${mix(66,172,opening)}deg`);
    stage.style.setProperty('--hint-opacity',`${1-smooth(progress/.22)}`);
    stage.style.setProperty('--shadow-scale',`${mix(1,.9,opening)}`);
    const initialY=boxTop+boxWidth*.31;
    cards.forEach((card,index)=>{
      const lift=smooth((progress-(.19+index*(mobile?.115:.075)))/(mobile?.42:.33));
      const spread=smooth((progress-(.43+index*.055))/.36);
      const x=mobile?0:(index-1)*(cardWidth+24)*spread;
      const destination=height*(mobile?(.255+index*.22):.4);
      const centerY=mobile?mix(initialY,destination,lift):mix(mix(initialY,height*.35,lift),destination,spread);
      const scale=mobile?mix(.44,1,lift):mix(mix(.44,.78,lift),1,spread);
      const settle=mobile?lift:spread;
      card.style.setProperty('--card-x',`${x.toFixed(3)}px`);
      card.style.setProperty('--card-y',`${(centerY-cardHeight/2).toFixed(3)}px`);
      card.style.setProperty('--card-scale',scale.toFixed(4));
      card.style.setProperty('--card-rotate',`${mix([-9,3,11][index],0,settle).toFixed(3)}deg`);
      card.style.setProperty('--card-tilt',`${mix(18,0,lift).toFixed(3)}deg`);
      card.style.setProperty('--card-opacity',`${smooth(lift/.15)}`);
    });
    section.classList.toggle('is-unpacking',progress>0&&progress<.995);
  }
  function tick(time){
    const delta=lastTime?Math.min(time-lastTime,50):16;
    lastTime=time;
    current+=(target-current)*(1-Math.exp(-delta/65));
    if(Math.abs(target-current)<.00015)current=target;
    draw(current);
    if(current!==target)frame=requestAnimationFrame(tick);
    else{frame=0;lastTime=0}
  }
  function update(){
    if(motion.matches)return;
    target=clamp((scrollY-metrics.top)/metrics.travel);
    if(!frame)frame=requestAnimationFrame(tick);
  }
  function configure(){
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    section.classList.toggle('unpack-enhanced',!motion.matches);
    if(motion.matches){section.classList.remove('is-unpacking');return}
    measure();
    current=target=clamp((scrollY-metrics.top)/metrics.travel);
    draw(current);
  }
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',configure);
  addEventListener('pageshow',configure);
  motion.addEventListener('change',configure);
  configure();
})();
