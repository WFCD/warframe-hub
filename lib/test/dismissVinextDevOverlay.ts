/** Remove vinext dev hydration overlay so Cypress can interact with the page. */
export const dismissVinextDevOverlay = (doc: Document = document): void => {
  const message = doc.querySelector('[data-testid="vinext-dev-error-message"]');
  if (!message) return;

  let node: HTMLElement | null = message.parentElement;
  while (node?.parentElement && node.parentElement !== doc.body) {
    node = node.parentElement;
  }

  node?.remove();
};
