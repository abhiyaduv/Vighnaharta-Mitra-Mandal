/* ==========================================================================
   CURSOR.JS — Custom cursor dot + ambient glow, with hover-state scaling
   ========================================================================== */

(function () {
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow) return;

  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Dot follows tightly
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

    // Glow follows loosely for a trailing ambient effect
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  const hoverTargets = 'a, button, .filter-btn, .masonry-item, .jctrl-btn, input, textarea, [data-link]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.remove('hovering');
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
})();
