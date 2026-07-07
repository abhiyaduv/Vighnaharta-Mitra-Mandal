/* ==========================================================================
   PARTICLES.JS — Starfield + floating golden particles on canvas
   Runs behind the entire page (fixed canvas), lightweight vanilla implementation
   ========================================================================== */

(function () {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  let stars = [];
  let motes = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initStars() {
    const count = Math.floor((width * height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function initMotes() {
    const count = Math.floor((width * height) / 60000);
    motes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height + height,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.15,
      drift: Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // Stars
    stars.forEach((s) => {
      const twinkle = Math.sin(time * s.twinkleSpeed + s.phase) * 0.4 + 0.6;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha * twinkle})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Golden floating motes
    motes.forEach((m) => {
      m.y -= m.speed;
      m.x += m.drift * 0.05;
      if (m.y < -20) {
        m.y = height + 20;
        m.x = Math.random() * width;
      }
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
      grad.addColorStop(0, `rgba(255,215,0,${m.alpha})`);
      grad.addColorStop(1, 'rgba(255,215,0,0)');
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  initStars();
  initMotes();

  window.addEventListener('resize', () => {
    resize();
    initStars();
    initMotes();
  });

  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
