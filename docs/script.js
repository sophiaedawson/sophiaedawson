
document.addEventListener('DOMContentLoaded', function () {
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
  if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  const heroVideo=document.querySelector('.hero-video video');
  const heroSection=document.querySelector('.hero-video');
  function markPlaying(){if(heroSection)heroSection.classList.add('is-playing');}
  function tryPlayHero(){if(heroVideo){heroVideo.muted=true;heroVideo.defaultMuted=true;heroVideo.setAttribute('muted','');heroVideo.setAttribute('playsinline','');heroVideo.setAttribute('webkit-playsinline','');heroVideo.removeAttribute('controls');const p=heroVideo.play();if(p&&p.then)p.then(markPlaying).catch(()=>{});else markPlaying();}}
  if(heroVideo){
    heroVideo.removeAttribute('poster');
    heroVideo.removeAttribute('controls');
    heroVideo.preload='auto';
    heroVideo.loop=true;
    heroVideo.muted=true;
    heroVideo.defaultMuted=true;
    heroVideo.playsInline=true;
    heroVideo.setAttribute('webkit-playsinline','');
    heroVideo.setAttribute('muted','');
    ['DOMContentLoaded','load','scroll','touchstart','touchend','click','visibilitychange','pageshow','focus'].forEach(evt=>{
      window.addEventListener(evt,tryPlayHero,{passive:true});
      document.addEventListener(evt,tryPlayHero,{passive:true});
    });
    heroVideo.addEventListener('canplay',tryPlayHero);
    heroVideo.addEventListener('canplaythrough',tryPlayHero);
    heroVideo.addEventListener('loadedmetadata',tryPlayHero);
    heroVideo.addEventListener('playing',markPlaying);
    heroVideo.addEventListener('ended',()=>{heroVideo.currentTime=0;tryPlayHero();});
    // Retry several times on iOS where the first attempt sometimes fails silently
    tryPlayHero();
    setTimeout(tryPlayHero,150);
    setTimeout(tryPlayHero,500);
    setTimeout(tryPlayHero,1500);
    setTimeout(tryPlayHero,3000);
    // Fallback: even if autoplay fails, reveal the video after 3s so the user sees the first frame instead of a blank box
    setTimeout(markPlaying,3000);
  }
  // Theatre carousel — wraps around so Next at last slide returns to slide 1, Prev at slide 1 jumps to last.
  document.querySelectorAll('.carousel').forEach(function(carousel){
    const slides=carousel.querySelectorAll('.carousel-slide'),prev=carousel.querySelector('.prev'),next=carousel.querySelector('.next'),count=carousel.querySelector('.carousel-count');
    let index=0;
    function render(){
      slides.forEach((s,i)=>s.classList.toggle('active',i===index));
      if(count)count.textContent=(index+1)+' / '+slides.length;
    }
    if(prev)prev.addEventListener('click',e=>{e.stopPropagation();index=(index-1+slides.length)%slides.length;render();});
    if(next)next.addEventListener('click',e=>{e.stopPropagation();index=(index+1)%slides.length;render();});
    render();
  });
  function initFilterArea(area){const items=Array.from(area.querySelectorAll('[data-item]')),buttons=Array.from(area.querySelectorAll('[data-filter]')),loadMore=area.querySelector('[data-load-more]'),perPage=parseInt(area.getAttribute('data-per-page')||'12',10);let current='all',visible=perPage;function filtered(){return items.filter(item=>{const tags=(item.getAttribute('data-category')||'').split(' ');return current==='all'||tags.includes(current);});}function render(){const f=filtered();items.forEach(i=>i.classList.add('hidden'));f.forEach((i,idx)=>{if(idx<visible)i.classList.remove('hidden');});if(loadMore)loadMore.classList.toggle('hidden',f.length<=visible);}buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');current=btn.getAttribute('data-filter');visible=perPage;render();}));if(loadMore)loadMore.addEventListener('click',()=>{visible+=perPage;render();});render();}
  document.querySelectorAll('[data-filter-area]').forEach(initFilterArea);
  const filmMenu=document.querySelector('[data-film-filter]');if(filmMenu){const links=Array.from(filmMenu.querySelectorAll('[data-filter]')),cards=Array.from(document.querySelectorAll('.film-results>.credit-card'));function render(filter){links.forEach(l=>l.classList.toggle('active',l.getAttribute('data-filter')===filter));cards.forEach(c=>{const cat=c.getAttribute('data-category');c.classList.toggle('hidden',!(filter==='all'||filter===cat));});}links.forEach(l=>l.addEventListener('click',e=>{e.preventDefault();render(l.getAttribute('data-filter'));const filmSection=document.querySelector('.film-layout')||document.querySelector('main .section');if(filmSection){const top=filmSection.getBoundingClientRect().top+window.pageYOffset-90;window.scrollTo({top:Math.max(0,top),behavior:'smooth'});}}));render('all');}
  const book=document.querySelector('[data-book-viewer]');if(book){const img=book.querySelector('img'),btn=book.querySelector('[data-book-toggle]');let front=true;if(img){img.src='assets/images/poetry-book-cover2.jpg';img.alt='Poetry book cover front';}if(btn&&img)btn.addEventListener('click',()=>{front=!front;img.src=front?'assets/images/poetry-book-cover2.jpg':'assets/images/poetry-book-cover.jpg';img.alt=front?'Poetry book cover front':'Poetry book cover back';btn.textContent=front?'View Back Cover':'View Front Cover';});}

  // Short Stories pager — 3 at a time with Previous / Next, no slow incremental loading.
  const storyList=document.querySelector('[data-story-list]');
  if(storyList){
    const cards=Array.from(storyList.querySelectorAll('[data-story-card]'));
    function getPageSize(){return window.matchMedia('(max-width: 760px)').matches?1:2;}
    let pageSize=getPageSize();
    let page=0;
    function getTotalPages(){return Math.max(1,Math.ceil(cards.length/pageSize));}
    // Replace any existing single load-more button with a prev/next pager
    const oldMore=document.querySelector('[data-story-load-more]');
    const pager=document.createElement('div');
    pager.className='story-pager';
    pager.innerHTML='<button class="ghost-button" type="button" data-story-prev>← Previous</button><span class="story-page-count" data-story-count></span><button class="pill-button" type="button" data-story-next>Next →</button>';
    if(oldMore&&oldMore.parentNode){oldMore.parentNode.replaceChild(pager,oldMore);}else{storyList.parentNode.appendChild(pager);}
    const prevBtn=pager.querySelector('[data-story-prev]');
    const nextBtn=pager.querySelector('[data-story-next]');
    const countEl=pager.querySelector('[data-story-count]');
    function loadStoryFrame(card){
      const frame=card.querySelector('iframe[data-src]');
      if(frame){frame.src=frame.getAttribute('data-src');frame.removeAttribute('data-src');}
    }
    function unloadStoryFrame(card){
      // Stop hidden iframes from playing/loading in the background
      const frame=card.querySelector('iframe');
      if(frame&&frame.src&&!frame.hasAttribute('data-src')){
        frame.setAttribute('data-src',frame.src);
        frame.src='';
      }
    }
    function renderStories(){
      const totalPages=getTotalPages();
      if(page>=totalPages)page=totalPages-1;
      const start=page*pageSize;
      const end=start+pageSize;
      cards.forEach((card,idx)=>{
        const show=idx>=start&&idx<end;
        card.classList.toggle('hidden',!show);
        if(show)loadStoryFrame(card);else unloadStoryFrame(card);
      });
      if(countEl)countEl.textContent=(page+1)+' / '+totalPages;
      if(prevBtn)prevBtn.disabled=page===0;
      if(nextBtn)nextBtn.disabled=page>=totalPages-1;
    }
    if(prevBtn)prevBtn.addEventListener('click',()=>{if(page>0){page--;renderStories();window.scrollTo({top:storyList.offsetTop-100,behavior:'smooth'});}});
    if(nextBtn)nextBtn.addEventListener('click',()=>{if(page<getTotalPages()-1){page++;renderStories();window.scrollTo({top:storyList.offsetTop-100,behavior:'smooth'});}});
    // Re-render if user resizes between mobile and desktop breakpoints
    let resizeTimer;
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const newSize=getPageSize();if(newSize!==pageSize){pageSize=newSize;page=0;renderStories();}},200);},{passive:true});
    renderStories();
  }

  // Lightbox + keyboard nav (arrow keys to navigate, space or esc to close), no mobile double-tap zoom on lightbox image
  const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<button class="lightbox-close" type="button">Close</button><button class="lightbox-prev" type="button">←</button><img alt=""><button class="lightbox-next" type="button">→</button>';document.body.appendChild(lb);
  const lbImg=lb.querySelector('img'),close=lb.querySelector('.lightbox-close'),prev=lb.querySelector('.lightbox-prev'),next=lb.querySelector('.lightbox-next');
  let currentImages=[],currentIndex=0;
  function openLightbox(img){const area=img.closest('[data-lightbox-area]');currentImages=Array.from((area||document).querySelectorAll('img')).filter(i=>!i.closest('.hidden')&&i.offsetParent!==null);currentIndex=Math.max(0,currentImages.indexOf(img));renderLightbox();lb.classList.add('open');}
  function renderLightbox(){const img=currentImages[currentIndex];if(!img)return;lbImg.src=img.src;lbImg.alt=img.alt||'';}
  function closeLightbox(){lb.classList.remove('open');}
  function nextLightbox(){if(currentImages.length){currentIndex=(currentIndex+1)%currentImages.length;renderLightbox();}}
  function prevLightbox(){if(currentImages.length){currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;renderLightbox();}}
  document.querySelectorAll('[data-lightbox-area] img').forEach(img=>img.addEventListener('click',()=>openLightbox(img)));
  close.addEventListener('click',closeLightbox);
  lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox();});
  prev.addEventListener('click',prevLightbox);
  next.addEventListener('click',nextLightbox);
  // Keyboard: ← / → navigate, Space or Esc closes lightbox
  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open'))return;
    if(e.key==='ArrowLeft'){e.preventDefault();prevLightbox();}
    else if(e.key==='ArrowRight'){e.preventDefault();nextLightbox();}
    else if(e.key===' '||e.key==='Spacebar'||e.key==='Escape'){e.preventDefault();closeLightbox();}
  });
  // Prevent iOS double-tap zoom on the lightbox image
  let lastTap=0;
  lbImg.addEventListener('touchend',e=>{
    const now=Date.now();
    if(now-lastTap<350){e.preventDefault();}
    lastTap=now;
  },{passive:false});
});
