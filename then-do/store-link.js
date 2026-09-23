(() => {
  const { userAgent, platform, maxTouchPoints } = navigator;
  const isIPadDesktop = /Mac/i.test(platform || userAgent) && maxTouchPoints > 1;
  const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent) || isIPadDesktop;
  for (const label of document.querySelectorAll('[data-store-label]')) {
    label.textContent = isMobile ? 'App Store' : 'Mac App Store';
  }
})();
