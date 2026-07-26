/** Remove vinext hydration/error overlay so Cypress can interact with the page. */
export const dismissVinextDevOverlay = (doc: Document = document): void => {
  const markers = doc.querySelectorAll(
    '[data-testid="vinext-dev-error-message"], [data-testid="vinext-dev-error-overlay"]',
  );
  for (const message of markers) {
    let node: HTMLElement | null = message.parentElement;
    while (node?.parentElement && node.parentElement !== doc.body) {
      node = node.parentElement;
    }
    node?.remove();
  }
};
