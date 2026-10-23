(()=>{
 const root=document.getElementById('iyab-topic-content');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let active=null;
 function draw(){if(!active)return;const {region,era,topic}=active,api=window.IyabContent,language=window.IyabI18n?.language||'ar';const records=api.selection(region,era,topic);root.dataset.i18nNative='';root.innerHTML=records.length?records.map(e=>`<article style="padding:22px 0;border-bottom:1px solid #d8c1a3"><h2>${esc(e[language].title)}</h2><p style="white-space:pre-wrap">${esc(e[language].description)}</p><a href="${esc(e.source)}" target="_blank" rel="noopener noreferrer">${language==='ar'?'مرجع المصدر ↗':'Source reference ↗'}</a></article>`).join(''):`<h2>${language==='ar'?'لا يوجد محتوى متاح لهذا الاختيار':'No content available for this selection'}</h2><p>${language==='ar'?'اختَر موضوعًا أو حقبة أخرى. لن نعرض مادة من حقبة مختلفة عن اختيارك.':'Choose another topic or period. Content from a different period will not be shown for this selection.'}</p>`}
 window.iyabOpenManagedContent=(selection)=>{active=null;delete root.dataset.i18nNative;const records=window.IyabContent?.selection(selection.region,selection.era,selection.topic);if(!records)return false;if(selection.region===0&&records.some(e=>e.builtin&&!e.modified)){root.replaceChildren();return false}active=selection;draw();return true};
 window.iyabManagedSelection=()=>active;
 // Keep the map labels in place; the small note sits below each region name.
 function updateRegionAvailability(){
  const api=window.IyabContent;if(!api)return;
  const entries=api.load(),language=window.IyabI18n?.language||'ar';
  document.querySelectorAll('#iyab-map .map-label[data-region]').forEach(button=>{
   const region=api.regionIds[Number(button.dataset.region)];
   const available=entries.some(entry=>entry.region===region);
   let note=button.querySelector('.region-coming-soon');
   if(available){note?.remove();return}
   if(!note){
    note=document.createElement('span');note.className='region-coming-soon';
    note.dataset.i18nNative='';button.appendChild(note);
   }
   note.textContent=language==='en'?'Coming soon':'قريبًا';
  });
 }
 updateRegionAvailability();
 window.addEventListener('iyab:content-change',updateRegionAvailability);
 window.addEventListener('iyab:language-change',updateRegionAvailability);
 window.addEventListener('storage',updateRegionAvailability);

 window.addEventListener('iyab:language-change',draw);
 window.addEventListener('storage',()=>{if(active)draw()});
})();
