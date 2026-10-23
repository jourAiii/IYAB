function mountJourneySave({snapshot,restore,onUnavailable}){
 const api=window.IyabJourneys,bar=document.getElementById('journey-save-bar'),message=document.getElementById('journey-save-message'),login=document.getElementById('journey-save-login');
 let signature='',blocked=false;
 function current(){const data=snapshot();return data&&api.validSelection(data.selection)&&Number.isInteger(data.selection.topic)?data:null;}
 function refresh(){const data=current();const hidden=!data&&!blocked;if(bar.hidden!==hidden)bar.hidden=hidden;if(!data)return;
  const next=JSON.stringify(data.selection);if(next!==signature){message.textContent='';signature=next;}
  const signedIn=Boolean(api.owner());if(login.hidden!==signedIn)login.hidden=signedIn;login.href='../login.html?returnTo='+encodeURIComponent(`timeline.html?open=${data.selection.region}:${data.selection.era}:${data.selection.topic}`);
 }
 function save(){const data=current();if(!data)return;refresh();
  try{api.save(data.selection,data.title);message.textContent='تم حفظ تقدم الرحلة ✓ يمكنك استكمالها من «رحلاتي المحفوظة».';}
  catch(error){message.textContent=error.message==='LOGIN_REQUIRED'?'سجّل الدخول أولًا، ثم اضغط حفظ تقدم الرحلة.':'تعذّر الحفظ في هذا المتصفح؛ لم يتم تأكيد حفظ الرحلة.';}
 }
 document.getElementById('journey-save-button').onclick=save;
 const observer=new MutationObserver(refresh);observer.observe(document.getElementById('iyab-map'),{subtree:true,attributes:true,attributeFilter:['hidden']});
 window.addEventListener('pageshow',refresh);window.addEventListener('storage',refresh);
 const query=new URLSearchParams(location.search),id=query.get('resume'),open=query.get('open');
 if(id){try{const record=api.get(id);if(record)restore(record);else onUnavailable(null,'هذه الرحلة غير متاحة لهذا الحساب. اختر رحلة أخرى.');}
  catch(error){blocked=true;message.textContent=error.message==='LOGIN_REQUIRED'?'سجّل الدخول لاستكمال رحلتك.':'تعذّر قراءة الرحلة المحفوظة.';bar.hidden=false;login.hidden=false;login.href='../login.html?returnTo='+encodeURIComponent('timeline.html?resume='+id);}
 }else if(open&&/^[0-4]:[0-3]:[0-4]$/.test(open)){
  const [region,era,topic]=open.split(':').map(Number);restore({region,era,topic,snapshot:{region,era,topic}});
 }
 refresh();return {save,refresh};
}
