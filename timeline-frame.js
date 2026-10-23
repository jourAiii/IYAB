// Only accept size and navigation requests from an embedded timeline owned by this page.
document.querySelectorAll('[data-timeline-frame]').forEach(frame => {
  if (frame.getAttribute('src') === 'timeline/index.html' && location.search) frame.src = 'timeline/index.html' + location.search;
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || !event.data || event.data.type !== 'iyab-timeline-height') return;
    const height = Number(event.data.height);
    if (Number.isFinite(height) && height >= 120 && height <= 12000) frame.style.height = `${Math.ceil(height)}px`;
  });
});
