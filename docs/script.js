
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Theatre accordion
  document.querySelectorAll('.production-entry').forEach(function (entry) {
    const head = entry.querySelector('.production-head');
    if (head) {
      head.addEventListener('click', function (e) {
        if (e.target.closest('.arrow-btn')) return;
        entry.classList.toggle('open');
      });
    }
  });

  // Theatre carousels
  document.querySelectorAll('.carousel').forEach(function(carousel){
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    const count = carousel.querySelector('.carousel-count');
    let index = 0;
    function render(){
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      if (count) count.textContent = (index + 1) + ' / ' + slides.length;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }
    if (prev) prev.addEventListener('click', function(e){ e.stopPropagation(); if(index > 0){ index--; render(); }});
    if (next) next.addEventListener('click', function(e){ e.stopPropagation(); if(index < slides.length - 1){ index++; render(); }});
    render();
  });

  // Gallery and photography filters with load more
  function initFilterArea(area) {
    const items = Array.from(area.querySelectorAll('[data-item]'));
    const buttons = Array.from(area.querySelectorAll('[data-filter]'));
    const loadMore = area.querySelector('[data-load-more]');
    const perPage = parseInt(area.getAttribute('data-per-page') || '12', 10);
    let currentFilter = 'all';
    let visibleCount = perPage;

    function getFiltered() {
      return items.filter(item => {
        const tags = (item.getAttribute('data-category') || '').split(' ');
        return currentFilter === 'all' || tags.includes(currentFilter);
      });
    }

    function render() {
      const filtered = getFiltered();
      items.forEach(item => item.classList.add('hidden'));
      filtered.forEach((item, idx) => {
        if (idx < visibleCount) item.classList.remove('hidden');
      });
      if (loadMore) {
        loadMore.classList.toggle('hidden', filtered.length <= visibleCount);
      }
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', function(){
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        visibleCount = perPage;
        render();
      });
    });

    if (loadMore) {
      loadMore.addEventListener('click', function(){
        visibleCount += perPage;
        render();
      });
    }

    render();
  }

  document.querySelectorAll('[data-filter-area]').forEach(initFilterArea);

  // Film filter
  const filmMenu = document.querySelector('[data-film-filter]');
  if (filmMenu) {
    const links = Array.from(filmMenu.querySelectorAll('[data-filter]'));
    const cards = Array.from(document.querySelectorAll('.film-results > .credit-card'));
    function render(filter) {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('data-filter') === filter));
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        card.classList.toggle('hidden', !(filter === 'all' || filter === cat));
      });
    }
    links.forEach(link => {
      link.addEventListener('click', function(e){
        e.preventDefault();
        render(link.getAttribute('data-filter'));
      });
    });
    render('all');
  }

  // Click-to-load video embeds
  document.querySelectorAll('[data-video-src]').forEach(function(card){
    const button = card.querySelector('.video-load');
    if (!button) return;
    button.addEventListener('click', function(){
      const src = card.getAttribute('data-video-src');
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.loading = 'lazy';
      iframe.title = card.getAttribute('data-video-title') || 'Video';
      iframe.setAttribute('allowfullscreen', '');
      card.innerHTML = '';
      card.appendChild(iframe);
    }, { once: true });
  });

  // Poetry book cover front/back toggle
  const bookViewer = document.querySelector('[data-book-viewer]');
  if (bookViewer) {
    const img = bookViewer.querySelector('img');
    const btn = bookViewer.querySelector('[data-book-toggle]');
    let front = true;
    if (btn && img) {
      btn.addEventListener('click', function(){
        front = !front;
        img.src = front ? 'assets/images/poetry-book-cover.jpg' : 'assets/images/poetry-book-cover2.jpg';
        img.alt = front ? 'Poetry book cover front' : 'Poetry book cover back';
        btn.textContent = front ? 'View Back Cover' : 'View Front Cover';
      });
    }
  }
});
