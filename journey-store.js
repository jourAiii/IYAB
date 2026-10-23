/* Local prototype storage only; account authentication/authorization requires a backend. */
(() => {
  const regions=['الوسطى','الغربية','الشرقية','الجنوبية','الشمالية'];
  const eras=['الماضي البعيد','بدايات المملكة','منتصف القرن','العصر الحديث'];
  const topics=['الطعام','الملابس','النقل','التجارة','الترفيه'];
  function owner(){
    try{const user=JSON.parse(localStorage.getItem('iyab-user'));
      return localStorage.getItem('iyab-session')==='active'&&typeof user?.email==='string'&&user.email.trim()?user.email.trim().toLowerCase():null;
    }catch{return null;}
  }
  const key=email=>'iyab-saved-journeys-v1:'+encodeURIComponent(email);
  const validSelection=j=>j&&Number.isInteger(j.region)&&j.region>=0&&j.region<5&&Number.isInteger(j.era)&&j.era>=0&&j.era<4;
  const valid=j=>validSelection(j)&&Number.isInteger(j.topic)&&j.topic>=0&&j.topic<5&&j.id===`${j.region}:${j.era}`&&typeof j.title==='string'&&j.title.length>0;
  function list(){const email=owner();if(!email)throw Error('LOGIN_REQUIRED');
    const raw=JSON.parse(localStorage.getItem(key(email))||'[]');
    if(!Array.isArray(raw))throw Error('INVALID_STORAGE');
    return raw.filter(j=>j?.owner===email&&valid(j)).sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
  }
  function save(selection,title){const email=owner();if(!email)throw Error('LOGIN_REQUIRED');
    const record={id:`${selection.region}:${selection.era}`,owner:email,region:selection.region,era:selection.era,topic:selection.topic,title:String(title||'').slice(0,180),savedAt:new Date().toISOString(),snapshot:JSON.parse(JSON.stringify(selection))};
    if(!valid(record))throw Error('INVALID_JOURNEY');
    const records=list(),index=records.findIndex(j=>j.id===record.id);if(index<0)records.push(record);else records[index]=record;
    localStorage.setItem(key(email),JSON.stringify(records));return record;
  }
  window.IyabJourneys={owner,list,save,get:id=>list().find(j=>j.id===id)||null,validSelection,regions,eras,topics};
})();
