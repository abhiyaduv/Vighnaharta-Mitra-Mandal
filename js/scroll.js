/* ==========================================================================
   SCROLL.JS — AOS init, GSAP ScrollTrigger reveals, parallax, navbar state
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* ---------- GSAP + ScrollTrigger ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax on mandala rings
    gsap.to('.mandala-outer', {
      y: -40,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    gsap.to('.mandala-inner', {
      y: -20,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    gsap.to('.ganpati-art, .ganpati-fallback', {
      y: -60,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Fog parallax drift on scroll
    gsap.to('.fog-1', {
      y: 100,
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });
    gsap.to('.fog-2', {
      y: -120,
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });

    // Section head subtle rise (in addition to AOS, for a layered feel)
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%' }
      });
    });
  }

  /* ---------- Navbar scrolled state ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* ---------- Masonry scroll-reveal (IntersectionObserver, works with dynamically injected items) ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  window.__revealObserver = revealObserver; // exposed for app.js to attach to dynamic items
});
