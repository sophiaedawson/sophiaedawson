
document.addEventListener('DOMContentLoaded', function () {
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
  if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  const heroVideo=document.querySelector('.hero-video video');
  function tryPlayHero(){if(heroVideo&&heroVideo.paused)heroVideo.play().catch(()=>{});}
  if(heroVideo){heroVideo.loop=true;heroVideo.muted=true;heroVideo.playsInline=true;['scroll','touchend','visibilitychange','pageshow'].forEach(evt=>{window.addEventListener(evt,tryPlayHero,{passive:true});document.addEventListener(evt,tryPlayHero,{passive:true});});heroVideo.addEventListener('ended',()=>{heroVideo.currentTime=0;tryPlayHero();});}

  // Notes upgrade: stronger iPhone hero autoplay/replay handling.
  if(heroVideo){
    heroVideo.removeAttribute('poster');
    heroVideo.setAttribute('preload','auto');
    heroVideo.setAttribute('playsinline','');
    heroVideo.setAttribute('webkit-playsinline','');
    heroVideo.muted=true;
    function forceHero(){
      try{ heroVideo.load(); }catch(e){}
      const p=heroVideo.play();
      if(p&&p.catch)p.catch(()=>{});
    }
    ['DOMContentLoaded','pageshow','focus','visibilitychange','touchstart','click','scroll'].forEach(evt=>{
      window.addEventListener(evt,forceHero,{passive:true});
      document.addEventListener(evt,forceHero,{passive:true});
    });
    setTimeout(forceHero,120);
    setTimeout(forceHero,900);
  }
  // Notes upgrade: load Short Stories with Sophia a few at a time to protect iPhone.
  const storiesWrap=document.querySelector('#short-stories .story-grid');
  const loadStories=document.querySelector('[data-load-more-stories]');
  if(storiesWrap){
    const storyCards=Array.from(storiesWrap.querySelectorAll('.story-card'));
    let visibleStories=4;
    function hydrate(card){
      const frame=card.querySelector('iframe[data-src]');
      if(frame){frame.src=frame.getAttribute('data-src');frame.removeAttribute('data-src');}
    }
    function renderStories(){
      storyCards.forEach((card,i)=>{
        const show=i<visibleStories;
        card.classList.toggle('story-deferred',!show);
        card.classList.toggle('story-visible',show);
        if(show)hydrate(card);
      });
      if(loadStories)loadStories.classList.toggle('hidden',visibleStories>=storyCards.length);
    }
    if(loadStories)loadStories.addEventListener('click',()=>{visibleStories+=4;renderStories();});
    renderStories();
  }

  document.querySelectorAll('.carousel').forEach(function(carousel){const slides=carousel.querySelectorAll('.carousel-slide'),prev=carousel.querySelector('.prev'),next=carousel.querySelector('.next'),count=carousel.querySelector('.carousel-count');let index=0;function render(){slides.forEach((s,i)=>s.classList.toggle('active',i===index));if(count)count.textContent=(index+1)+' / '+slides.length;if(prev)prev.disabled=index===0;if(next)next.disabled=index===slides.length-1;}if(prev)prev.addEventListener('click',e=>{e.stopPropagation();if(index>0){index--;render();}});if(next)next.addEventListener('click',e=>{e.stopPropagation();if(index<slides.length-1){index++;render();}});render();});
  function initFilterArea(area){const items=Array.from(area.querySelectorAll('[data-item]')),buttons=Array.from(area.querySelectorAll('[data-filter]')),loadMore=area.querySelector('[data-load-more]'),perPage=parseInt(area.getAttribute('data-per-page')||'12',10);let current='all',visible=perPage;function filtered(){return items.filter(item=>{const tags=(item.getAttribute('data-category')||'').split(' ');return current==='all'||tags.includes(current);});}function render(){const f=filtered();items.forEach(i=>i.classList.add('hidden'));f.forEach((i,idx)=>{if(idx<visible)i.classList.remove('hidden');});if(loadMore)loadMore.classList.toggle('hidden',f.length<=visible);}buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');current=btn.getAttribute('data-filter');visible=perPage;render();}));if(loadMore)loadMore.addEventListener('click',()=>{visible+=perPage;render();});render();}
  document.querySelectorAll('[data-filter-area]').forEach(initFilterArea);
  const filmMenu=document.querySelector('[data-film-filter]');if(filmMenu){const links=Array.from(filmMenu.querySelectorAll('[data-filter]')),cards=Array.from(document.querySelectorAll('.film-results>.credit-card'));function render(filter){links.forEach(l=>l.classList.toggle('active',l.getAttribute('data-filter')===filter));cards.forEach(c=>{const cat=c.getAttribute('data-category');c.classList.toggle('hidden',!(filter==='all'||filter===cat));});}links.forEach(l=>l.addEventListener('click',e=>{e.preventDefault();render(l.getAttribute('data-filter'));}));render('all');}
  const book=document.querySelector('[data-book-viewer]');if(book){const img=book.querySelector('img'),btn=book.querySelector('[data-book-toggle]');let front=true;if(img){img.src='assets/images/poetry-book-cover2.jpg';img.alt='Poetry book cover front';}if(btn&&img)btn.addEventListener('click',()=>{front=!front;img.src=front?'assets/images/poetry-book-cover2.jpg':'assets/images/poetry-book-cover.jpg';img.alt=front?'Poetry book cover front':'Poetry book cover back';btn.textContent=front?'View Back Cover':'View Front Cover';});}
  const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<button class="lightbox-close" type="button">Close</button><button class="lightbox-prev" type="button">←</button><img alt=""><button class="lightbox-next" type="button">→</button>';document.body.appendChild(lb);const lbImg=lb.querySelector('img'),close=lb.querySelector('.lightbox-close'),prev=lb.querySelector('.lightbox-prev'),next=lb.querySelector('.lightbox-next');let currentImages=[],currentIndex=0;function openLightbox(img){const area=img.closest('[data-lightbox-area]');currentImages=Array.from((area||document).querySelectorAll('img')).filter(i=>!i.closest('.hidden')&&i.offsetParent!==null);currentIndex=Math.max(0,currentImages.indexOf(img));renderLightbox();lb.classList.add('open');}function renderLightbox(){const img=currentImages[currentIndex];if(!img)return;lbImg.src=img.src;lbImg.alt=img.alt||'';}document.querySelectorAll('[data-lightbox-area] img').forEach(img=>img.addEventListener('click',()=>openLightbox(img)));close.addEventListener('click',()=>lb.classList.remove('open'));lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open');});prev.addEventListener('click',()=>{if(currentImages.length){currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;renderLightbox();}});next.addEventListener('click',()=>{if(currentImages.length){currentIndex=(currentIndex+1)%currentImages.length;renderLightbox();}});
});
