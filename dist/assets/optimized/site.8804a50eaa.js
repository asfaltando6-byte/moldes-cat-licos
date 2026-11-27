// Clientes informados pelo proprietário. Nenhuma data ou horário de compra é simulado.
window.MOLDES_CLIENTES = Object.freeze([
  'Mariana Silva', 'Lucas Oliveira', 'Camila Santos', 'Gabriel Ferreira',
  'Beatriz Almeida', 'Rafael Costa', 'Fernanda Ribeiro', 'Pedro Martins',
  'Juliana Rocha', 'Bruno Carvalho', 'Larissa Gomes', 'Matheus Souza',
  'Amanda Barbosa', 'Felipe Mendes', 'Gabriela Lima', 'Thiago Nogueira',
  'Patrícia Teixeira', 'Rodrigo Araújo', 'Letícia Cardoso', 'Gustavo Freitas',
  'Ana Moreira', 'Leonardo Batista', 'Vanessa Monteiro', 'Eduardo Dias',
  'Daniela Correia', 'André Castro', 'Renata Vieira', 'Marcelo Duarte',
  'Aline Fernandes', 'Ricardo Moura'
]);

;
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
  const state = { viewport, group, toggle, paused: reducedMotion.matches, pointer: false, hovering: false, focused: false, userScrollUntil: 0, fraction: 0, visible: !('IntersectionObserver' in window), cycleWidth: group.getBoundingClientRect().width };
  if ('ResizeObserver' in window) new ResizeObserver(() => { state.cycleWidth = group.getBoundingClientRect().width; }).observe(group);
  else window.addEventListener('resize', () => { state.cycleWidth = group.getBoundingClientRect().width; });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { state.visible = entries[0].isIntersecting; scheduleCarouselFrame(); }).observe(section);
  function updateControl() {
    toggle.textContent = '';
    toggle.setAttribute('aria-pressed', String(state.paused));
    toggle.setAttribute('aria-label', state.paused ? 'Reproduzir carrossel automático' : 'Pausar carrossel automático');
  }
  toggle.addEventListener('click', () => { state.paused = !state.paused; updateControl(); scheduleCarouselFrame(); });
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
  reducedMotion.addEventListener('change', event => { state.paused = event.matches; updateControl(); scheduleCarouselFrame(); });
  updateControl();
  return state;
});
let lastFrame = 0;
let carouselFrame = 0;
function carouselIsActive() {
  return !document.hidden && !pieceDialog.open && carouselStates.some(state => state.visible && !state.paused);
}
function scheduleCarouselFrame() {
  if (carouselFrame || !carouselIsActive()) return;
  carouselFrame = requestAnimationFrame(animateCarousels);
}
function animateCarousels(time) {
  carouselFrame = 0;
  if (!carouselIsActive()) { lastFrame = 0; return; }
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
  scheduleCarouselFrame();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(carouselFrame);
    carouselFrame = 0;
    lastFrame = 0;
  } else scheduleCarouselFrame();
});
pieceDialog.addEventListener('close', scheduleCarouselFrame);
scheduleCarouselFrame();

;
(() => {
  const customers = window.MOLDES_CLIENTES;
  const notice = document.getElementById('purchase-notification');
  if (!notice || !Array.isArray(customers) || !customers.length) return;
  const name = notice.querySelector('[data-customer-name]');
  const dismiss = notice.querySelector('button');
  const storageKey = 'moldes-purchase-notifications-dismissed';
  let stopped = false;
  let position = 0;
  let nextTimer;
  let hideTimer;
  let transitionTimer;
  let offerInView = false;
  const mobileScreen = window.matchMedia('(max-width: 600px)');
  const offer = document.getElementById('oferta');
  if (offer && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      offerInView = entries[0].isIntersecting;
      if (mobileScreen.matches && offerInView) {
        clearTimeout(hideTimer);
        hide();
      }
    }).observe(offer);
  }
  try { stopped = sessionStorage.getItem(storageKey) === '1'; } catch {}
  function hide() {
    notice.classList.remove('is-visible');
    transitionTimer = setTimeout(() => { notice.hidden = true; }, 250);
  }
  function show() {
    if (stopped) return;
    if (document.hidden || document.querySelector('dialog[open]') || (mobileScreen.matches && offerInView)) {
      nextTimer = setTimeout(show, 5000);
      return;
    }
    clearTimeout(transitionTimer);
    name.textContent = customers[position];
    position = (position + 1) % customers.length;
    notice.hidden = false;
    requestAnimationFrame(() => {
      if (!stopped) notice.classList.add('is-visible');
    });
    hideTimer = setTimeout(hide, 6500);
    nextTimer = setTimeout(show, 22000);
  }
  dismiss.addEventListener('click', () => {
    stopped = true;
    clearTimeout(nextTimer);
    clearTimeout(hideTimer);
    hide();
    try { sessionStorage.setItem(storageKey, '1'); } catch {}
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(hideTimer);
      hide();
    }
  });
  if (!stopped) nextTimer = setTimeout(show, 9000);
})();
