(() => {
 const api=window.IyabJourneys,list=document.querySelector('#saved-journey-list');
 const empty=document.querySelector('.empty-state'),boat=document.querySelector('.boat-illustration');
 const login=document.querySelector('#saved-login'),status=document.querySelector('#saved-status');
 function render(){
  list.replaceChildren();list.hidden=true;empty.hidden=true;boat.hidden=true;empty.classList.add('saved-empty');
  login.hidden=Boolean(api.owner());
  if(!api.owner()){status.textContent='سجّل الدخول لعرض رحلاتك واستكمالها.';return;}
  let records;try{records=api.list();}catch{status.textContent='تعذّر قراءة الرحلات المحفوظة. لم نغيّر بياناتك؛ جرّب تحديث الصفحة.';return;}
  status.textContent='الحفظ في هذه النسخة محلي في هذا المتصفح، وليس مزامنة بين الأجهزة.';
  if(!records.length){empty.hidden=false;boat.hidden=false;return;}
  list.hidden=false;
  records.forEach(record=>{
   const card=document.createElement('article');card.className='saved-journey-card';
   const heading=document.createElement('h2');heading.textContent=api.regions[record.region]+' · '+api.eras[record.era];
   const item=record.snapshot?.contentId&&window.IyabContent?.get(record.snapshot.contentId);
   const language=window.IyabI18n?.language||'ar';
   const title=item&&(item.modified||!item.builtin)?item[language].title:record.title;
   const content=document.createElement('p');content.textContent='آخر محتوى محفوظ: '+title;
   const time=document.createElement('time');const date=new Date(record.savedAt);if(!Number.isNaN(+date)){time.dateTime=record.savedAt;time.textContent='آخر حفظ: '+date.toLocaleString(window.IyabI18n?.language==='en'?'en-GB':'ar-SA');}
   const resume=document.createElement('a');resume.className='button button-primary';resume.textContent='استكمل الرحلة ←';resume.href='timeline.html?resume='+encodeURIComponent(record.id);
   card.append(heading,content,time,resume);list.appendChild(card);
  });
 }
 window.addEventListener('iyab:language-change',render);window.addEventListener('pageshow',render);window.addEventListener('storage',render);render();
})();
