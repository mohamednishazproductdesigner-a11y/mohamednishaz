const hero=document.querySelector('.hero'), cursor=document.querySelector('.viewer-cursor'), title=document.querySelector('.name-title');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nameLetters=[];
// Fixed letter windows roll through alternate glyphs, as in the reference video.
title.querySelectorAll('.name-line').forEach((line,lineIndex)=>{
  const word=line.textContent;
  line.textContent='';
  Array.from(word).forEach((letter,index)=>{
    const slot=document.createElement('span');
    slot.className='name-letter';
    const sizer=document.createElement('span');
    sizer.className='name-sizer';
    sizer.textContent=letter;
    const track=document.createElement('span');
    track.className='name-track';
    const alternate=lineIndex===0&&index===1?'a':letter;
    const startsEmpty=(lineIndex===0&&index===6)||(lineIndex===1&&index>3);
    const glyphs=[startsEmpty?'':alternate,letter,letter];
    glyphs.forEach(character=>{
      const glyph=document.createElement('span');
      glyph.className='name-glyph';
      glyph.textContent=character;
      track.append(glyph);
    });
    slot.append(sizer,track);
    line.append(slot);
    nameLetters.push({slot,track,index,lineIndex});
    // The bolt is an inserted ornament; all letters of Nishaz remain visible.
    if(lineIndex===1&&index===2){
      const gap=document.createElement('span');
      gap.className='name-bolt-gap';
      line.append(gap);
    }
  });
});
const rotor=hero.querySelector('.shape-rotor');
const star=hero.querySelector('.shape-star');
const bolt=hero.querySelector('.shape-bolt');
const spring=hero.querySelector('.shape-spring');
const stage=hero.querySelector('.name-stage');
function placeNameObjects(){
  const bounds=stage.getBoundingClientRect();
  const em=parseFloat(getComputedStyle(title).fontSize);
  const first=title.querySelector('.name-line').getBoundingClientRect();
  const aSlot=nameLetters.find(letter=>letter.lineIndex===0&&letter.index===3).slot.querySelector('.name-sizer').getBoundingClientRect();
  const gap=title.querySelector('.name-bolt-gap').getBoundingClientRect();
  const hSlot=nameLetters.find(letter=>letter.lineIndex===1&&letter.index===3).slot.querySelector('.name-sizer').getBoundingClientRect();
  function place(shape,x,y,size,height=size){
    Object.assign(shape.style,{left:`${x-bounds.left}px`,top:`${y-bounds.top}px`,width:`${size}px`,height:`${height}px`});
  }
  place(rotor,first.left+em*.74,first.top-em*.12,em*.49);
  place(star,aSlot.left+(aSlot.width-em*.51)/2,aSlot.top+em*.37,em*.51);
  place(bolt,gap.left+em*.015,gap.top+em*.21,em*.25,em*.65);
  place(spring,hSlot.left-em*.035,hSlot.top+em*.72,em*.36,em*.59);
}
placeNameObjects();
new ResizeObserver(placeNameObjects).observe(title);
if(!reduced){
  nameLetters.forEach(({track,index,lineIndex})=>{
    if(index===0)return;
    const isStarSlot=lineIndex===0&&index===3;
    const delay=isStarSlot?880:20+index*50+lineIndex*80;
    const duration=isStarSlot?550:600+index*55;
    if(isStarSlot)track.children[0].textContent=track.children[1].textContent='';
    track.animate([
      {transform:'translateY(0)',offset:0},
      {transform:'translateY(0)',offset:.12,easing:'cubic-bezier(.65,0,.25,1)'},
      {transform:'translateY(-1.05em)',offset:.36},
      {transform:'translateY(-1.05em)',offset:.68,easing:'cubic-bezier(.65,0,.25,1)'},
      {transform:'translateY(-2.1em)',offset:1}
    ],{duration,delay,fill:'both'});
    if(lineIndex===1&&index===5){
      track.lastElementChild.animate([{transform:'rotate(24deg) translateY(.15em)'},{transform:'rotate(0) translateY(0)'}],{duration:550,delay:950,fill:'both',easing:'cubic-bezier(.2,.75,.2,1)'});
    }
  });
  star.animate([
    {opacity:1,transform:'rotate(-35deg) scale(.9)'},
    {opacity:1,transform:'rotate(120deg) scale(1)',offset:.63},
    {opacity:0,transform:'rotate(180deg) scale(0)'}
  ],{duration:1300,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
  bolt.animate([
    {opacity:0,transform:'scaleY(.1) rotate(-10deg)'},
    {opacity:1,transform:'scaleY(1.1) rotate(4deg)',offset:.55},
    {opacity:1,transform:'scaleY(1) rotate(0)'}
  ],{duration:550,delay:100,easing:'ease-out',fill:'both'});
  spring.animate([{opacity:0,transform:'translateY(-.2em) scaleY(.3)'},{opacity:1,transform:'translateY(0) scaleY(1)'}],{duration:650,delay:230,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
}else{
  star.hidden=true;
}
const heroVisibility=new IntersectionObserver(entries=>{
  hero.classList.toggle('is-offscreen',!entries[0].isIntersecting);
});
heroVisibility.observe(hero);
hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hero.classList.add('custom-pointer');cursor.classList.add('visible');}});
hero.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('visible');hero.classList.add('custom-pointer');}});
function hideCursor(){cursor.classList.remove('visible');hero.classList.remove('custom-pointer')}
hero.addEventListener('pointerleave',hideCursor);window.addEventListener('blur',hideCursor);document.addEventListener('visibilitychange',()=>{if(document.hidden)hideCursor()});
// Header links remain regular navigation; the hero has no action buttons.

const entries=document.querySelector('.experience-entries');document.querySelectorAll('[data-view]').forEach(button=>{if(button.tagName!=='BUTTON')return;button.addEventListener('click',()=>{entries.dataset.view=button.dataset.view;document.querySelectorAll('.view-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});});

const principleCharacters=[document.querySelector('.character-1'),document.querySelector('.character-1'),document.querySelector('.character-3'),document.querySelector('.character-2')];
const principles=Array.from(document.querySelectorAll('.principle'));
function updatePrincipleCharacters(){
  new Set(principleCharacters).forEach(character=>{
    const active=principles.some((step,index)=>principleCharacters[index]===character&&(step.matches(':hover')||step===document.activeElement));
    character.classList.toggle('is-colored',active);
  });
}
principles.forEach(step=>{step.tabIndex=0;['pointerenter','pointerleave','focus','blur'].forEach(event=>step.addEventListener(event,updatePrincipleCharacters))});


const book=document.querySelector('.journey-book');
const bookCover=book.querySelector('.book-cover');
const bookSpread=book.querySelector('.book-spread');
const previousPage=document.querySelector('.book-previous');
const nextPage=document.querySelector('.book-next');
const bookProgress=document.querySelector('.book-progress');
const journeyIllustration='Images/1751126969056.jpeg';
const bookPages=[
  [{chapter:'2019 / COLOMBO',kind:'story',message:'In 2019, I was just a boy in Colombo, trying to support my father and find my place in the world. I struggled to get my first job in UX. It was tough — rejections, doubts, and a lot of self-learning.'},{kind:'image',image:journeyIllustration,alt:'Illustration of a young man running through Colombo in the rain, carrying a shoulder bag, with tuk-tuks and city buildings behind him'}],
  [{chapter:'02 / THE PATH',message:'More to come.'},{chapter:'03 / THE WORK',message:'More to come.'}],
  [{chapter:'04 / WHAT’S NEXT',message:'More to come.'},{chapter:'THE NEXT PAGE',message:'Still being written.'}]
];
let currentBookPage=0;
let bookTurning=false;
function fillBookPage(page,data,number){
  page.classList.toggle('has-story',data.kind==='story');
  page.classList.toggle('has-art',data.kind==='image');
  page.querySelector('.book-page-kicker').hidden=data.kind==='image';
  const content=page.querySelector('.book-page-content');
  content.replaceChildren();
  if(data.kind==='image'){
    if(data.image){
      const artwork=document.createElement('img');
      artwork.className='book-page-art';
      artwork.src=data.image;artwork.alt=data.alt;
      artwork.width=1536;artwork.height=1024;artwork.decoding='async';
      content.append(artwork);
    }
  }else{
    const chapter=document.createElement('span');chapter.className='book-chapter';chapter.textContent=data.chapter;
    const message=document.createElement('p');message.className='book-page-message';message.textContent=data.message;
    content.append(chapter,message);
  }
  page.querySelector('.book-page-number').textContent=String(number).padStart(2,'0');
}
function renderBook(){
  book.dataset.page=String(currentBookPage);
  bookSpread.hidden=currentBookPage===0;
  bookCover.hidden=currentBookPage!==0;
  previousPage.disabled=currentBookPage===0;
  nextPage.disabled=currentBookPage===bookPages.length;
  previousPage.setAttribute('aria-label',currentBookPage===1?'Close book':'Previous pages');
  nextPage.setAttribute('aria-label',currentBookPage===0?'Open book':'Next pages');
  bookProgress.textContent=currentBookPage===0?'Cover':`${currentBookPage} / ${bookPages.length}`;
  if(currentBookPage===0)return;
  const pages=bookPages[currentBookPage-1];
  bookSpread.querySelectorAll(':scope > .book-page').forEach((page,index)=>fillBookPage(page,pages[index],(currentBookPage-1)*2+index+1));
}
function makeTurningSheet(direction,destination){
  const forward=direction>0;
  const sheet=document.createElement('div');
  sheet.className='book-turn-sheet '+(forward?'is-forward':'is-back');
  sheet.setAttribute('aria-hidden','true');
  const front=bookSpread.querySelector(forward?':scope > .book-page-right':':scope > .book-page-left').cloneNode(true);
  front.classList.add('book-turn-face');
  const back=bookSpread.querySelector(forward?':scope > .book-page-left':':scope > .book-page-right').cloneNode(true);
  back.classList.add('book-turn-face','is-back-face');
  const destinationIndex=forward?0:1;
  fillBookPage(back,bookPages[destination-1][destinationIndex],(destination-1)*2+destinationIndex+1);
  sheet.append(front,back);
  bookSpread.append(sheet);
  return sheet;
}
function turnBook(direction){
  const destination=Math.max(0,Math.min(bookPages.length,currentBookPage+direction));
  if(bookTurning||destination===currentBookPage)return;
  bookTurning=true;
  if(reduced){currentBookPage=destination;renderBook();bookTurning=false;return}
  if(currentBookPage===0){
    currentBookPage=destination;
    renderBook();
    bookSpread.classList.add('is-opening');
    window.setTimeout(()=>{bookSpread.classList.remove('is-opening');renderBook();bookTurning=false},850);
    return;
  }
  if(destination===0){
    bookSpread.classList.add('is-closing');
    window.setTimeout(()=>{bookSpread.classList.remove('is-closing');currentBookPage=0;renderBook();bookTurning=false},700);
    return;
  }
  const sheet=makeTurningSheet(direction,destination);
  window.setTimeout(()=>{currentBookPage=destination;renderBook()},475);
  window.setTimeout(()=>{
    sheet.remove();
    renderBook();
    bookTurning=false;
  },950);
}
bookCover.addEventListener('click',()=>turnBook(1));
previousPage.addEventListener('click',()=>turnBook(-1));
nextPage.addEventListener('click',()=>turnBook(1));
book.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();
    turnBook(event.key==='ArrowRight'?1:-1);
  }
});
renderBook();
document.querySelector('#footer-year').textContent=new Date().getFullYear();

const dubaiClock=document.querySelector('[data-dubai-clock]');
if(dubaiClock){
  const dubaiClockValue=dubaiClock.querySelector('[data-dubai-clock-value]');
  const dubaiClockPeriod=dubaiClock.querySelector('[data-dubai-clock-period]');
  const dubaiTime=new Intl.DateTimeFormat('en-US',{
    timeZone:'Asia/Dubai',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:true
  });
  function updateDubaiClock(){
    const now=new Date();
    const parts=Object.fromEntries(dubaiTime.formatToParts(now).map(part=>[part.type,part.value]));
    dubaiClockValue.textContent=`${parts.hour}:${parts.minute}:${parts.second}`;
    dubaiClockPeriod.textContent=parts.dayPeriod;
    dubaiClock.dateTime=now.toISOString();
    dubaiClock.title=`Current time in Dubai: ${dubaiClockValue.textContent} ${dubaiClockPeriod.textContent}`;
  }
  updateDubaiClock();
  window.setInterval(updateDubaiClock,1000);
}

const portrait=document.querySelector('.footer-portrait');
const portraitSkill=portrait.querySelector('.portrait-skill');
const portraitSkills=['Product Design','User Research','UI Design','Prototyping','Design Systems','Interaction Design'];
let portraitSkillIndex=0;
function showNextPortraitSkill(){
  portraitSkill.textContent=portraitSkills[portraitSkillIndex];
  portraitSkillIndex=(portraitSkillIndex+1)%portraitSkills.length;
  portrait.classList.add('has-skill');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    portraitSkill.getAnimations().forEach(animation=>animation.cancel());
    portraitSkill.animate([{opacity:0,transform:'translateY(10px) rotate(-4deg)'},{opacity:1,transform:'translateY(0) rotate(-4deg)'}],{duration:240,easing:'ease-out'});
  }
}
portrait.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')showNextPortraitSkill()});
portrait.addEventListener('focus',()=>{if(portrait.matches(':focus-visible'))showNextPortraitSkill()});
portrait.addEventListener('click',showNextPortraitSkill);
function hidePortraitSkill(){
  portraitSkill.getAnimations().forEach(animation=>animation.cancel());
  portrait.classList.remove('has-skill');
  portraitSkill.textContent='';
}
portrait.addEventListener('pointerleave',hidePortraitSkill);
portrait.addEventListener('blur',hidePortraitSkill);
document.addEventListener('pointerdown',event=>{if(!portrait.contains(event.target))hidePortraitSkill()});
