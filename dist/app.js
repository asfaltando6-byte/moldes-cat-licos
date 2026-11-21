const names = ['Nossa Senhora Aparecida', 'São Francisco de Assis', 'Espírito Santo', 'Sagrada Família', 'Anjinhos e lembrancinhas', 'Terços e presentes'];
const pieceDialog = document.getElementById('piece-dialog');
document.querySelectorAll('.piece-open').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.piece);
  const picture = document.getElementById('large-piece');
  picture.className = `sprite p${index}`;
  picture.setAttribute('aria-label', names[index]);
  document.getElementById('piece-title').textContent = names[index];
  pieceDialog.showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const carouselStates = [...document.querySelectorAll('.pages-section')].map(section => {
  const viewport = section.querySelector('.carousel-window');
  const group = section.querySelector('.carousel-run');
  const toggle = section.querySelector('.carousel-toggle');
  const state = { viewport, group, toggle, paused: reducedMotion.matches, pointer: false, hovering: false, focused: false, userScrollUntil: 0, fraction: 0, visible: true, cycleWidth: group.getBoundingClientRect().width };
  if ('ResizeObserver' in window) new ResizeObserver(() => { state.cycleWidth = group.getBoundingClientRect().width; }).observe(group);
  else window.addEventListener('resize', () => { state.cycleWidth = group.getBoundingClientRect().width; });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { state.visible = entries[0].isIntersecting; }).observe(section);
  function updateControl() {
    toggle.textContent = '';
    toggle.setAttribute('aria-pressed', String(state.paused));
    toggle.setAttribute('aria-label', state.paused ? 'Reproduzir carrossel automático' : 'Pausar carrossel automático');
  }
  toggle.addEventListener('click', () => { state.paused = !state.paused; updateControl(); });
  viewport.addEventListener('pointerdown', () => { state.pointer = true; });
  window.addEventListener('pointerup', () => { state.pointer = false; });
  window.addEventListener('pointercancel', () => { state.pointer = false; });
  viewport.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') state.hovering = true; });
  viewport.addEventListener('pointerleave', () => { state.hovering = false; });
  viewport.addEventListener('focusin', () => { state.focused = viewport.matches(':focus-visible'); });
  viewport.addEventListener('focusout', () => { state.focused = false; });
  viewport.addEventListener('wheel', () => { state.userScrollUntil = performance.now() + 2500; }, { passive: true });
  viewport.addEventListener('touchstart', () => { state.userScrollUntil = performance.now() + 4000; }, { passive: true });
  viewport.addEventListener('touchend', () => { state.userScrollUntil = performance.now() + 2500; }, { passive: true });
  reducedMotion.addEventListener('change', event => { state.paused = event.matches; updateControl(); });
  updateControl();
  return state;
});
let lastFrame = 0;
function animateCarousels(time) {
  const elapsed = lastFrame ? Math.min(time - lastFrame, 50) : 0;
  lastFrame = time;
  const blocked = document.hidden || pieceDialog.open;
  for (const state of carouselStates) {
    if (blocked || !state.visible || state.paused || state.pointer || state.hovering || state.focused || time <= state.userScrollUntil) continue;
    const cycleWidth = state.cycleWidth;
    state.fraction += elapsed * 0.036;
    const distance = Math.floor(state.fraction);
    state.fraction -= distance;
    state.viewport.scrollLeft += distance;
    if (cycleWidth && state.viewport.scrollLeft >= cycleWidth) state.viewport.scrollLeft -= cycleWidth;
  }
  requestAnimationFrame(animateCarousels);
}
requestAnimationFrame(animateCarousels);

const deferredMedia = document.querySelectorAll('[data-lazy-media]');
if ('IntersectionObserver' in window) {
  const mediaObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('media-ready');
      mediaObserver.unobserve(entry.target);
    }
  }, { rootMargin: '160px 0px' });
  deferredMedia.forEach(section => mediaObserver.observe(section));
  window.addEventListener('error', event => {
    if (event.filename && event.filename.includes('app.js')) document.documentElement.classList.remove('lazy-media-supported');
  }, { once: true });
} else deferredMedia.forEach(section => section.classList.add('media-ready'));
