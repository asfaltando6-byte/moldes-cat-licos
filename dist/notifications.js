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
  try { stopped = sessionStorage.getItem(storageKey) === '1'; } catch {}
  function hide() {
    notice.classList.remove('is-visible');
    transitionTimer = setTimeout(() => { notice.hidden = true; }, 250);
  }
  function show() {
    if (stopped) return;
    if (document.hidden || document.querySelector('dialog[open]')) {
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
