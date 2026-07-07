/* ==========================================================================
   APP.JS — Core site logic: loader, counters, gallery, lightbox, countdowns,
   ripple buttons, mandala petal generation, footer year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('js-ready');
    }, 900);
  });
  // Fallback in case 'load' fires very late (slow assets/CDN)
  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.classList.add('js-ready');
  }, 3500);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.num-counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('en-IN');
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Ripple buttons ---------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Event countdown badges ---------- */
  function updateCountdowns() {
    document.querySelectorAll('[data-countdown]').forEach((badge) => {
      const target = new Date(badge.dataset.countdown).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        badge.textContent = 'Happening now / completed';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      badge.textContent = days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`;
    });
  }
  updateCountdowns();
  setInterval(updateCountdowns, 60000);

  /* =====================================================================
     GALLERY — masonry grid with category filters + custom lightbox
     Images live in /images/gallery/ named bappa1, bappa2, ... bappaN.
     Since a static site can't list a folder's contents, we probe for each
     numbered file (trying common extensions) until a number is missing,
     then build the grid from whatever was found — in order, 1..N.
     ===================================================================== */
  const GALLERY_FOLDER = 'images/gallery/';
  const GALLERY_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];
  const GALLERY_MAX_SCAN = 60; // safety ceiling on how many bappaN files to probe for
  const GALLERY_CATEGORIES = [
    { cat: 'festival', label: 'Ganesh Festival' },
    { cat: 'decoration', label: 'Decoration' },
    { cat: 'aarti', label: 'Aarti' },
    { cat: 'visarjan', label: 'Visarjan' },
    { cat: 'social', label: 'Social Activities' },
    { cat: 'sports', label: 'Sports' }
  ];

  function tryLoadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function findBappaImage(index) {
    for (const ext of GALLERY_EXTENSIONS) {
      const found = await tryLoadImage(`${GALLERY_FOLDER}bappa${index}.${ext}`);
      if (found) return found;
    }
    return null;
  }

  async function loadGalleryImages() {
    const found = [];
    for (let i = 1; i <= GALLERY_MAX_SCAN; i++) {
      const src = await findBappaImage(i);
      if (!src) break; // stop at the first missing number — bappa files are expected to be contiguous
      found.push(src);
    }
    return found;
  }

  const masonryGrid = document.getElementById('masonryGrid');
  const lightboxImages = [];

  function buildGalleryItem(src, i) {
    const category = GALLERY_CATEGORIES[i % GALLERY_CATEGORIES.length];
    lightboxImages.push(src);

    const fig = document.createElement('div');
    fig.className = 'masonry-item';
    fig.dataset.category = category.cat;
    fig.dataset.index = i;
    fig.innerHTML = `
      <img src="${src}" alt="Vighnaharta Mitra Mandal — ${category.label}" loading="lazy">
      <div class="item-overlay"><span>${category.label}</span></div>
    `;
    fig.addEventListener('click', () => openLightbox(i));
    masonryGrid.appendChild(fig);

    // Attach to the shared reveal observer set up in scroll.js
    if (window.__revealObserver) window.__revealObserver.observe(fig);
  }

  loadGalleryImages().then((images) => {
    if (images.length === 0) {
      // No bappaN images found yet — keep the section from looking broken.
      masonryGrid.innerHTML = '<p class="gallery-empty">Gallery photos coming soon.</p>';
      return;
    }
    images.forEach((src, i) => buildGalleryItem(src, i));
  });

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.masonry-item').forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- Custom lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = lightboxImages[currentIndex];
    lightbox.classList.add('open');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
  }
  function showNext(dir) {
    currentIndex = (currentIndex + dir + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentIndex];
  }
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => showNext(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => showNext(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });

  /* ---------- Mandala petal generation (decorative SVG signature element) ---------- */
  function generatePetals(groupId, count, radius) {
    const group = document.getElementById(groupId);
    if (!group) return;
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i;
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      petal.setAttribute('cx', 250 + radius * Math.cos((angle * Math.PI) / 180));
      petal.setAttribute('cy', 250 + radius * Math.sin((angle * Math.PI) / 180));
      petal.setAttribute('r', 3);
      petal.setAttribute('fill', '#FFD700');
      petal.setAttribute('opacity', '0.7');
      group.appendChild(petal);
    }
  }
  generatePetals('petalsOuter', 24, 240);
});
