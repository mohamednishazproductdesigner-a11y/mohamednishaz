(()=>{
  const mockups=[
    {src:'assets/design-wall-bookings.png',label:'Bookings'},
    {src:'assets/design-wall-vehicle-marketplace.png',label:'Vehicle marketplace'},
    {src:'assets/design-wall-apple-juice.png',label:'Product website'},
    {src:'assets/design-wall-coaching.png',label:'Coaching website'},
    {src:'assets/design-wall-helmet.png',label:'Helmet website'},
    {src:'assets/design-wall-learning-dashboard.png',label:'Learning dashboard'},
    {src:'assets/design-wall-vehicle-inspection.png',label:'Vehicle inspection'}
  ];
  // Replace each empty array with that company's images: {src:'assets/...',label:'...'}.
  // Until then, use the supplied mockups as temporary preview artwork.
  const experienceImages={
    'index-holding':[
      {src:'assets/index-holding/design-workshop.jpeg',label:'Sitemap to wireframe',alt:'Mohamed and colleagues in an INDEX Holding meeting room, reviewing interface designs, with a Sitemap to Wireframe caption'},
      {src:'assets/index-holding/wireframe-review.jpeg',label:'Wireframe review',alt:'Interface wireframes displayed on a laptop and wall screen in an INDEX Holding meeting room'},
      {src:'assets/index-holding/office.jpeg',label:'INDEX Holding office',alt:'INDEX Holding office building with company signage, flags, and a landscaped lawn'}
    ],
    'pickme':[
      {src:'assets/pickme/recognition-2024.jpeg',label:'2024 recognition',alt:'Gold PickMe recognition artwork for the Digital Outlook Report 2024'},
      {src:'assets/pickme/welcome-kit.jpeg',label:'Welcome kit',alt:'PickMe welcome kit with a laptop, notebooks, branded merchandise, and backpack'},
      {src:'assets/pickme/ride-hailing.webp',label:'Ride hailing',alt:'PickMe taxi booking and live map artwork with the heading Hail taxis with one tap'},
      {src:'assets/pickme/food-delivery.webp',label:'Food delivery',alt:'PickMe Food restaurant discovery and ordering artwork with the heading Order food to your doorstep'}
    ],
    'rootcodelabs':[
      {src:'assets/rootcodelabs/team.jpg',label:'RootcodeLabs team',alt:'RootcodeLabs team gathered for a group photo'},
      {src:'assets/rootcodelabs/ux-workshop.jpeg',label:'UX workshop',alt:'Nishaz presenting an introduction to UI and UX at RootcodeLabs'},
      {src:'assets/rootcodelabs/ui-presentation.jpeg',label:'UI presentation',alt:'Nishaz explaining user interface design during a RootcodeLabs presentation'},
      {src:'assets/rootcodelabs/design-advice.jpeg',label:'Design advice',alt:'Rootcode designer advice featuring Nishaz on empathy, creativity, and improving your own work'}
    ],
    'expert-republic':[
      {src:'assets/expert-republic/video-consultation.jpeg',label:'Video consultation',alt:'Expert Republic enterprise video-consultation app with a mobile service discovery screen'},
      {src:'assets/expert-republic/schedule-booking.jpeg',label:'Schedule booking',alt:'Expert Republic date, calendar, and available time-slot selection screen'},
      {src:'assets/expert-republic/dashboard.jpeg',label:'Bookings dashboard',alt:'Expert Republic bookings dashboard displayed on a laptop and phone'},
      {src:'assets/expert-republic/wellness-consultation.jpeg',label:'Wellness consultation',alt:'Expert Republic wellness campaign with a video consultation and mobile fitness service screen'},
      {src:'assets/expert-republic/product-hunt.jpeg',label:'Product Hunt launch',alt:'Expert Republic Product Hunt feature announcement with illustrated supporters'},
      {src:'assets/expert-republic/mentoring-guide.png',label:'Mentoring guide',alt:'Expert Republic illustrated guide to connecting with a mentor and getting personalized advice'},
      {src:'assets/expert-republic/get-started.jpeg',label:'Get started',alt:'Expert Republic service detail screen with booking and chat actions'}
    ],
    'ellipsis':[]
  };
  document.querySelectorAll('[data-experience]').forEach((row,rowIndex)=>{
    const company=row.querySelector('h3').textContent;
    const supplied=experienceImages[row.dataset.experience];
    if(row.dataset.experience==='ellipsis')return;
    const images=supplied?.length?supplied:mockups.map((_,i)=>mockups[(i+rowIndex)%mockups.length]);
    const gallery=document.createElement('div');
    gallery.className='experience-previews';
    gallery.setAttribute('role','group');
    gallery.setAttribute('aria-label',`${company} image previews`);
    const heading=document.createElement('span');
    heading.className='experience-preview-label';heading.textContent=supplied?.length?'Selected work':'Preview artwork';
    const list=document.createElement('ul');
    list.className='experience-preview-list';list.id=`previews-${row.dataset.experience}`;
    const hasMore=images.length>4;
    const tiles=images.map((data,index)=>{
      const tile=document.createElement('li');tile.className='experience-preview-card';
      tile.style.setProperty('--preview-index',Math.min(index,6));
      tile.hidden=hasMore&&index>=3;
      const link=document.createElement('a');
      link.href=data.src;link.target='_blank';link.rel='noopener noreferrer';
      link.setAttribute('aria-label',`Open ${data.label} preview image in a new tab`);
      const image=document.createElement('img');
      image.src=data.src;image.alt=data.alt||`${data.label} mockup preview`;
      image.loading='lazy';image.decoding='async';image.width=800;image.height=600;
      const caption=document.createElement('span');caption.textContent=data.label;
      link.append(image,caption);tile.append(link);list.append(tile);return tile;
    });
    gallery.append(heading,list);
    if(hasMore){
      const moreTile=document.createElement('li');moreTile.className='experience-preview-more';
      const toggle=document.createElement('button');toggle.type='button';
      toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',list.id);
      toggle.setAttribute('aria-label',`Show all ${images.length} preview images for ${company}`);
      toggle.innerHTML='<strong>4+</strong><span>View all</span>';
      moreTile.append(toggle);list.append(moreTile);
      toggle.addEventListener('click',()=>{
        const expanded=toggle.getAttribute('aria-expanded')!=='true';
        const oldHeight=list.getBoundingClientRect().height;
        gallery.classList.toggle('is-expanded',expanded);
        tiles.forEach((tile,index)=>{tile.hidden=!expanded&&index>=3});
        toggle.setAttribute('aria-expanded',String(expanded));
        toggle.setAttribute('aria-label',expanded?`Show fewer preview images for ${company}`:`Show all ${images.length} preview images for ${company}`);
        toggle.innerHTML=expanded?'<strong>−</strong><span>Show less</span>':'<strong>4+</strong><span>View all</span>';
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
          list.animate([{height:`${oldHeight}px`},{height:`${list.getBoundingClientRect().height}px`}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
        }
      });
    }
    row.append(gallery);
  });
})();
