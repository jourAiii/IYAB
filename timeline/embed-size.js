(() => {
  let last = 0;
  const report = () => {
    const height = Math.ceil(document.getElementById('iyab-map').getBoundingClientRect().height + 4);
    if (height === last) return;
    last = height;
    parent.postMessage({type:'iyab-timeline-height',height}, '*');
  };
  new ResizeObserver(report).observe(document.getElementById('iyab-map'));
  window.addEventListener('load', report);
  document.fonts.ready.then(report);
  report();
})();
