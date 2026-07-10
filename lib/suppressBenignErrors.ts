/** Chrome fires this when ResizeObserver callbacks resize in same frame — harmless noise. */
const RESIZE_OBSERVER_LOOP = /ResizeObserver loop (completed with undelivered notifications|limit exceeded)/;

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (RESIZE_OBSERVER_LOOP.test(event.message)) {
      event.stopImmediatePropagation();
    }
  });
}
