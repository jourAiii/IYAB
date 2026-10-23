(() => {
  let previous=0;
  const report=()=>{
    const height=Math.ceil(document.querySelector('main').getBoundingClientRect().height+4);
    if(height===previous)return;
    previous=height;
    parent.postMessage({type:'iyab-window-height',height},'*');
  };
  new ResizeObserver(report).observe(document.querySelector('main'));
  window.addEventListener('load',report);
  document.fonts.ready.then(report);
  report();
})();
