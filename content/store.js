/* Front-end repository only. No server authentication or cross-device database. */
(()=>{
 const {regions,periods,topics,seeds}=window.IyabContentSeed;
 const regionIds=['central','western','eastern','southern','northern'];
 const periodIds=['past','kingdom','mid','modern'];
 const topicIds=['food','clothing','transport','trade','leisure'];
 const foodNames=[['الجريش','Jareesh'],['القرصان','Qursan'],['الكبسة','Kabsa'],['المصابيب','Masabeeb']];
 const descriptions=[
  ['استكشف الطعام وطريقة إعداده في التجربة التفاعلية المعتمدة.','Explore food and its preparation in the approved interactive experience.'],
  ['افتح خزانة الملابس واستكشف القطع وتفاصيلها ومراجعها.','Open the wardrobe to explore garments, their details and references.'],
  ['اقترب من وسائل التنقّل وتعرّف على أدواتها وتفاصيلها.','Explore transport, its equipment and its details.'],
  ['استكشف حكاية التجارة ومراجعها ضمن الحقبة المختارة.','Explore the trade story and its references for the selected period.'],
  ['اكتشف الفنون والألعاب والفعاليات ضمن تجربة الترفيه.','Discover performing arts, games and activities in the leisure experience.']
 ];
 const sources=['https://saudipedia.com/الجريش','https://saudipedia.com/الثوب-السعودي','https://www.spa.gov.sa/N2233250','https://saudipedia.com/الأسواق-في-الدولة-السعودية-الأولى','https://ich.unesco.org/en/RL/alardah-alnajdiyah-dance-drumming-and-poetry-in-saudi-arabia-01196'];
 const builtins=periodIds.flatMap((period,era)=>topicIds.map((topic,i)=>({id:`central-${period}-${topic}`,region:'central',period,topic,builtin:true,ar:{title:(i===0?foodNames[era][0]:topics[topic][0])+' · '+periods[period][0],description:descriptions[i][0]},en:{title:(i===0?foodNames[era][1]:topics[topic][1])+' · '+periods[period][1],description:descriptions[i][1]},source:i===0?['https://saudipedia.com/الجريش','https://saudipedia.com/القرصان','https://saudipedia.com/الكبسة-السعودية','https://saudipedia.com/المصابيب'][era]:i===3&&era===3?'https://www.kafd.sa/en/business/office-spaces':sources[i]})));
 const summaries=[
  [['الجريش: قمح مجروش يُطهى على نار هادئة. استكشف المجراشة والحطب والمرق وتجربة الطبخ.','Jareesh: cracked wheat simmered over low heat. Explore the grain mill, firewood, broth and cooking experience.'],['المرودن والدراعة والثوب المقطّع والثوب النسائي الواسع؛ استكشف القصّات والأكمام وطبقات الملابس ومراجعها.','Explore the murawdan, daraa, muqatta thobe and wide women’s overdress, their cuts, sleeves, layers and references.'],['الجمل وتجهيز راحلة السفر: الشداد والجاعد والخرج؛ أضف كل قطعة إلى موضعها واستكشف استخدامها.','Prepare a camel for travel with its saddle frame, covering and saddlebags, placing each item and exploring its use.'],['على قدّ المكيال: جهّز كمية القمح المطلوبة في سوق متخيّل، واضبط المكيال ثم اربط كيس الحبوب.','Measured just right: prepare the required wheat quantity in an imagined market, fill the measure and tie the grain sack.'],['العرضة والشعر النجدي ومحمد بن لعبون، وحكاية سوق الموسم في الدرعية، ولغز المشط الذي له أسنان ولا يعض.','Ardah, Najdi poetry and Muhammad ibn Labun, Al-Mawsim Market in Diriyah, and the riddle of a comb with teeth that cannot bite.']],
  [['القرصان: خبز رقيق يُخبز على الصاج ثم يُسقى بمرق اللحم والخضار. جرّب تجهيز الحطب والعجين وضبط النار.','Qursan: thin griddle-baked bread soaked in meat and vegetable broth. Prepare firewood and dough and adjust the heat.'],['الثوب الرجالي والبشت وثوب المناسبات النجدي واللباس الداخلي؛ استكشف القطع وطبقات الطقم مع المراجع.','Explore the men’s thobe, bisht, Najdi occasion dress and undergarment, with outfit layers and references.'],['فورد تي وبيرس أرو وبدايات السيارة في الوسطى؛ استعرض زوايا السيارات في مشهد ورشة توضيحي.','Ford Model T, Pierce-Arrow and early motoring in Central Arabia; explore vehicle angles in an illustrative workshop.'],['دكّان ودفتر حساب: جهّز طلب التمر والقمح والقماش، واحسب المجموع ثم اختم سجل البيع.','A shop and account book: prepare dates, wheat and cloth, calculate the total and stamp the sales record.'],['العرضة وألعاب الحوش: الحَبْلة أو نط الحبل، والدنّانة بعجلتها وقضيب الدفع. جرّب التوقيت والتوازن.','Ardah and courtyard games: habla, or skipping rope, and dannanah hoop rolling with its pushing rod. Try timing and balance.']],
  [['الكبسة: أرز يُطهى بمرق اللحم أو الدجاج والبهارات. تعرّف على تنويعاتها ثم جرّب طبخها.','Kabsa: rice cooked in meat or chicken broth and spices. Discover its variations and try cooking it.'],['الثوب الأبيض والثوب الشتوي والفستان المنزلي وعباءة الرأس؛ استكشف الملابس داخل دولاب خشبي.','Explore a white thobe, winter thobe, house dress and head abaya in a wooden wardrobe.'],['الجمس ومقصورته: افتح الباب الأمامي واركب وتأمّل لوحة القيادة والمساحة الخلفية، مع المراجع السياقية.','Explore the GMC cabin: open the front door, get in and look at the dashboard and rear space, with contextual references.'],['على ميزان الذهب: وازن السوار بالأثقال، واقرأ الوزن ثم احسب قيمة الذهب والمصنعية لإتمام البيع.','On the gold scale: balance a bracelet with weights, read its weight and calculate gold value and making charges.'],['الراديو والتلفزيون السعودي: حرّك مؤشر التردد لالتقاط المحطات، واضبط الهوائي والقناة لتوضيح الصورة.','Saudi radio and television: tune the radio dial to find stations and adjust the television antenna and channel.']],
  [['المصابيب أو المراصيع: أقراص من خليط دقيق تُصب على الصاج وتُقدّم بالعسل والسمن. جرّب إعدادها.','Masabeeb, also called marasee: small flour-batter pancakes cooked on a griddle and served with honey and ghee. Try preparing them.'],['الثوب السعودي والبشت والعباءة والشيلة؛ استكشف قطع الطقم المعاصر وقارنها بالحقب السابقة.','Explore the contemporary Saudi thobe, bisht, abaya and shayla and compare them with earlier periods.'],['مترو الرياض وحافلات الرياض وسيارة سير الكهربائية؛ استعرض الوسائل وزواياها وتفاصيلها ومصادرها.','Explore Riyadh Metro, Riyadh buses and the Ceer electric car, their angles, details and sources.'],['الرياض مدينة الأعمال: كافد ومساحات المكاتب، وسلوشنز من stc وخدمات التقنية، وبرنامج المقرات الإقليمية.','Riyadh as a city of business: KAFD offices, solutions by stc technology services and the Regional Headquarters Programme.'],['الألعاب الإلكترونية وتجربة تسديد الكرة، وسينما مركز المملكة واختيار المقاعد والتذكرة، مع الفنون الأدائية.','Video games and a football-shooting experience, Kingdom Centre cinema seats and tickets, and performing arts.']]
 ];
 const transportSources=['https://www.spa.gov.sa/N2233250','https://saudipedia.com/سيارات-الملك-عبدالعزيز','https://www.aljomaih.com/en/history','https://press.siemens.com/global/en/pressrelease/siemens-presents-new-metro-riyadh'];
 const tradeSources=['https://saudipedia.com/الأسواق-في-الدولة-السعودية-الأولى','https://saudipedia.com/قائمة-أسواق-مدينة-الرياض-القديمة','https://saudipedia.com/الأسواق-الشعبية-في-منطقة-الرياض','https://www.kafd.sa/en/business/office-spaces'];
 builtins.forEach((entry,index)=>{const era=Math.floor(index/5),topic=index%5;entry.ar.description=summaries[era][topic][0];entry.en.description=summaries[era][topic][1];if(topic===2)entry.source=transportSources[era];if(topic===3)entry.source=tradeSources[era]});
 const defaults=[...builtins,...seeds.map(x=>({...x,id:'regional-'+x.id}))];
 const key='iyab-content-v2';
 let memory=null,failedWrite=false;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const valid=e=>e&&typeof e.id==='string'&&regions[e.region]&&periods[e.period]&&topics[e.topic]&&['ar','en'].every(l=>e[l]&&typeof e[l].title==='string'&&typeof e[l].description==='string')&&/^https?:\/\//i.test(e.source);
 // Remove the six bundled sample articles from older browser copies too.
 // Preserve edited interactive entries, custom additions and previous deletions.
 const retiredSampleIds=new Set(['regional-1','regional-2','regional-3','regional-4','regional-5','regional-6']);
 function load(){
  if(failedWrite&&memory)return clone(memory);
  try{
   const raw=localStorage.getItem(key);
   if(raw){
    const data=JSON.parse(raw);
    if(data.version===2&&Array.isArray(data.entries)&&data.entries.every(valid)){
     const entries=data.entries.filter(entry=>!retiredSampleIds.has(entry.id));
     if(entries.length!==data.entries.length){
      try{localStorage.setItem(key,JSON.stringify({...data,entries}))}catch{}
     }
     return entries;
    }
   }
  }catch{}
  return memory||clone(defaults);
 }
 function save(entries){if(!Array.isArray(entries)||!entries.every(valid))throw Error('INVALID_CONTENT');memory=clone(entries);try{localStorage.setItem(key,JSON.stringify({version:2,entries:memory}));failedWrite=false;window.dispatchEvent(new Event('iyab:content-change'));return true}catch{failedWrite=true;return false}}
 function get(id){return load().find(e=>e.id===id)||null}
 function selection(region,era,topic){return load().filter(e=>e.region===regionIds[region]&&e.period===periodIds[era]&&e.topic===topicIds[topic])}
 function route(e){return 'timeline.html?open='+[regionIds.indexOf(e.region),periodIds.indexOf(e.period),topicIds.indexOf(e.topic)].join(':')}
 window.IyabContent={load,save,get,selection,route,valid,regions,periods,topics,regionIds,periodIds,topicIds,defaults:clone(defaults)};
})();
