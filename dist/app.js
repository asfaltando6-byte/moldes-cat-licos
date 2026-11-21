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
const purchaseDialog = document.getElementById('purchase-dialog');
document.querySelectorAll('.purchase').forEach(button => button.addEventListener('click', () => {
  document.getElementById('selected-plan').textContent = button.dataset.plan;
  document.getElementById('selected-price').textContent = button.dataset.price;
  purchaseDialog.showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
const carousel = document.querySelector('.carousel-window');
const carouselGroup = document.querySelector('.carousel-run');
const toggle = document.getElementById('carousel-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let manuallyPaused = reducedMotion.matches;
let pointerActive = false;
let hovering = false;
let focused = false;
let lastFrame = 0;
let scrollFraction = 0;
let userScrollUntil = 0;
function updateControl() {
  toggle.textContent = manuallyPaused ? '▶' : 'Ⅱ';
  toggle.setAttribute('aria-pressed', String(manuallyPaused));
  toggle.setAttribute('aria-label', manuallyPaused ? 'Reproduzir carrossel automático' : 'Pausar carrossel automático');
}
toggle.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updateControl(); });
carousel.addEventListener('pointerdown', () => { pointerActive = true; });
window.addEventListener('pointerup', () => { pointerActive = false; });
window.addEventListener('pointercancel', () => { pointerActive = false; });
carousel.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovering = true; });
carousel.addEventListener('pointerleave', () => { hovering = false; });
carousel.addEventListener('focusin', () => { focused = true; });
carousel.addEventListener('focusout', () => { focused = false; });
carousel.addEventListener('wheel', () => { userScrollUntil = performance.now() + 2500; }, { passive: true });
carousel.addEventListener('touchstart', () => { userScrollUntil = performance.now() + 4000; }, { passive: true });
carousel.addEventListener('touchend', () => { userScrollUntil = performance.now() + 2500; }, { passive: true });
reducedMotion.addEventListener('change', event => { manuallyPaused = event.matches; updateControl(); });
function animateCarousel(time) {
  const elapsed = lastFrame ? Math.min(time - lastFrame, 50) : 0;
  lastFrame = time;
  if (!manuallyPaused && !pointerActive && !hovering && !focused && !document.hidden && time > userScrollUntil && !document.querySelector('dialog[open]')) {
    const cycleWidth = carouselGroup.getBoundingClientRect().width;
    scrollFraction += elapsed * 0.036;
    const distance = Math.floor(scrollFraction);
    scrollFraction -= distance;
    carousel.scrollLeft += distance;
    if (cycleWidth && carousel.scrollLeft >= cycleWidth) carousel.scrollLeft -= cycleWidth;
  }
  requestAnimationFrame(animateCarousel);
}
updateControl();
requestAnimationFrame(animateCarousel);
