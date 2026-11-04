// Reveal the introduction word by word with native scrolling, in both directions.
(()=>{
  const statement=document.querySelector('.hero-statement');
  if(!statement)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const walker=document.createTreeWalker(statement,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  const words=[];
  nodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part=>{
      if(!part)return;
      if(/\s/.test(part)){fragment.append(document.createTextNode(part));return}
      const word=document.createElement('span');
      word.className='statement-word';
      word.textContent=part;
      words.push(word);
      fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  const clamp=value=>Math.max(0,Math.min(1,value));
  let start=0,travel=1,frame=0;
  function draw(){
    frame=0;
    const progress=motion.matches?1:clamp((scrollY-start)/travel);
    words.forEach((word,index)=>{
      const amount=clamp((progress*1.15-index/words.length)/.15);
      word.style.setProperty('--word-progress',`${(amount*100).toFixed(2)}%`);
    });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
  function measure(){
    const bounds=statement.getBoundingClientRect();
    const top=bounds.top+scrollY;
    start=Math.max(0,top-innerHeight*.85);
    const end=Math.max(start+innerHeight*.45,top-innerHeight*.3+bounds.height*.4);
    travel=end-start;
    schedule();
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',measure);
  addEventListener('pageshow',measure);
  motion.addEventListener('change',schedule);
  new ResizeObserver(measure).observe(statement);
  measure();
})();
