document.querySelectorAll('[data-window-frame]').forEach(frame=>{
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||event.data?.type!=='iyab-window-height')return;
    const height=Number(event.data.height);
    if(Number.isFinite(height)&&height>=120&&height<=12000)frame.style.height=`${Math.ceil(height)}px`;
  });
});
