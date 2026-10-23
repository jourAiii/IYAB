// Persist interactive state in the current browser.
if (!window.IyabLocalState) {
 let saved = null;
 try { saved = JSON.parse(localStorage.getItem('iyab-clothing-transport-v1') || 'null'); } catch (_) {}
 window.IyabLocalState = {
  widgetState: saved,
  setWidgetState: async function(next) {
   this.widgetState = next;
   try { localStorage.setItem('iyab-clothing-transport-v1', JSON.stringify(next)); } catch (_) {}
  }
 };
}
(async()=>{
const root=document.getElementById('iyab-map'),$=id=>root.querySelector('#'+id);


root.style.setProperty('--header','url("'+"assets/header.jpg"+'")');root.style.setProperty('--footer','url("'+"assets/footer.jpg"+'")');
const vehicles=["assets/timeline-camel.webp", "assets/timeline-shaas.svg", "assets/timeline-gmc.svg", "assets/timeline-metro.svg"];
const eras=[{id:'camel',label:'الماضي البعيد',title:'الجمل',description:'بداية الرحلة على دروب القوافل؛ وسيلة بطيئة تمنحنا وقتًا لملاحظة المكان والحكايات.'},{id:'shas',label:'بدايات المملكة',title:'الشاص',description:'ننتقل إلى طريق صحراوي أطول؛ الشاص يحمل المسافر والمؤن بين القرى والمحطات.'},{id:'gmc',label:'منتصف القرن',title:'الجمس',description:'تتسع الرحلة مع الجمس، وتصبح المدن والأسواق أقرب في يوم واحد.'},{id:'metro',label:'العصر الحديث',title:'المترو',description:'اليوم نصل بسرعة داخل المدينة؛ تبقى الحكاية في الوجهة التي نختار استكشافها.'}];
const names=['الوسطى','الغربية','الشرقية','الجنوبية','الشمالية'],topics=['الطعام','الملابس','النقل','التجارة','الترفيه'];
let state={region:null,era:0,eraChosen:false,page:'selection',topic:null},reached=0,moving=false;
let journeySave=null;
const fromSaved=window.IyabLocalState?.widgetState?.privateContent?.journey;
function valid(s){return s&&[null,0,1,2,3,4].includes(s.region)&&Number.isInteger(s.era)&&s.era>=0&&s.era<4}
if(valid(fromSaved)){state={...state,...fromSaved};reached=state.era}
// Opening the timeline starts with the map; a homepage station may preselect an era.
state.page='selection';
const requestedEra=new URLSearchParams(location.search).get('era');
if(requestedEra!==null&&/^[0-3]$/.test(requestedEra)){state.era=Number(requestedEra);state.eraChosen=true;reached=state.era;}
const stations=[...root.querySelectorAll('.station')],runner=$('iyab-runner'),progress=$('iyab-progress'),trailLayer=$('iyab-trail-layer');
stations.forEach((b,i)=>b.querySelector('img').src=vehicles[i]);
function persist(){window.IyabLocalState?.setWidgetState({modelContent:{region:names[state.region]||null,period:state.eraChosen?eras[state.era].label:null,page:state.page,topic:topics[state.topic]||null},privateContent:{journey:state}})?.catch(()=>{})}
function setRegion(id){state.region=id;sync();persist()}
root.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>setRegion(+b.dataset.region)));
root.querySelectorAll('[data-map-region]').forEach(p=>p.addEventListener('click',()=>setRegion(+p.dataset.mapRegion)));
function sync(){document.getElementById('ct-trade').hidden=state.page!=='central-trade';document.getElementById('food-focus').hidden=state.page!=='food';updateTopicImages();root.querySelectorAll('[data-piece]').forEach(g=>g.classList.toggle('selected',+g.dataset.piece===state.region));const front=root.querySelector('[data-piece="'+state.region+'"]');if(front)front.parentNode.appendChild(front);root.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.region===state.region)));root.querySelectorAll('[data-map-region]').forEach(p=>p.classList.toggle('selected',+p.dataset.mapRegion===state.region));$('iyab-region-status').textContent=state.region===null?'اختر منطقتك':'المنطقة '+names[state.region];$('iyab-status').textContent=moving?'في الطريق إلى محطتك…':state.region===null?'اختر منطقة من الخريطة':!state.eraChosen?'اختر الحقبة الزمنية':names[state.region]+' · '+eras[state.era].label;$('iyab-continue').disabled=moving||state.region===null||!state.eraChosen;stations.forEach((b,i)=>{b.classList.toggle('active',i===state.era);b.setAttribute('aria-pressed',String(i===state.era))});$('iyab-selection').hidden=state.page!=='selection';$('iyab-categories').hidden=state.page!=='categories';$('iyab-clothing').hidden=state.page!=='clothing';$('iyab-transport').hidden=state.page!=='transport';$('iyab-leisure').hidden=state.page!=='leisure';$('iyab-journey-label').textContent=names[state.region]+' / '+eras[state.era].label}
function arrived(){stations.forEach((b,i)=>b.querySelector('.vehicle').classList.toggle('visible',i===reached));const e=eras[reached];$('iyab-arrival-title').textContent=e.title;$('iyab-arrival-description').textContent=e.description;$('iyab-arrival-image').src=vehicles[reached];progress.style.width=(reached/3*75)+'%'}
const left=i=>(87.5-i*25)+'%';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function startTrail(step,reduced){
 if(reduced||step>2)return ()=>{};
 let n=0;
 const emit=()=>{
  const bounds=runner.getBoundingClientRect(),track=$('iyab-timeline').getBoundingClientRect();
  const mark=document.createElement('span');
  mark.className='trail-mark '+(step===0?'footprint':step===1?'smoke smoke-black':'smoke smoke-white');
  mark.style.left=(bounds.left-track.left+bounds.width*(step===0?.82:.96))+'px';
  mark.style.top=(step===0?35+(n%2)*6:20+(n%3)*2)+'px';
  trailLayer.appendChild(mark);n++;setTimeout(()=>mark.remove(),1100);
 };
 const timer=setInterval(emit,step===0?155:130);
 return ()=>clearInterval(timer);
}

async function travel(target){if(moving)return;state.eraChosen=true;state.era=target;moving=true;sync();const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(target<reached){reached=0;arrived()}
for(let step=reached;step<target;step++){stations[step].querySelector('.vehicle').classList.remove('visible');runner.className='runner '+eras[step].id;runner.querySelector('img').src=vehicles[step];runner.style.left=left(step);void runner.offsetWidth;runner.classList.add('moving');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{runner.style.left=left(step+1);resolve()})));const stopTrail=startTrail(step,reduced);await pause(reduced?0:1350);stopTrail();runner.classList.add('exiting');reached=step+1;stations[reached].querySelector('.vehicle').classList.add('visible');progress.style.width=(reached/3*75)+'%';await pause(reduced?0:280);runner.className='runner'}
reached=target;arrived();moving=false;sync();persist()}
stations.forEach((b,i)=>b.addEventListener('click',()=>travel(i)));
$('iyab-continue').onclick=()=>{if(moving||state.region===null||!state.eraChosen)return;state.page='categories';sync();persist()};$('iyab-back').onclick=()=>{state.page='selection';sync();persist()};
$('iyab-topics').innerHTML=topics.map((t,i)=>`<button type="button" class="topic cursor-interaction" data-topic="${i}" aria-pressed="false"><span class="image-slot"><i data-lucide="image" aria-hidden="true"></i><span>الصورة غير متوفرة</span></span><span class="topic-name">${t}</span></button>`).join('');
const centralPastTopicImages=[
 ['assets/central-past-food-user-approved.png','صورة بالأبيض والأسود لقدر وخبز وتمر ضمن موضوع الطعام'],
 ['assets/central-past-clothing-user-approved.png','صورة بالأبيض والأسود لملابس مزخرفة وقماش فوق صندوق خشبي ضمن موضوع الملابس'],
 ['assets/central-past-transport-user-approved.jpg','صورة بالأبيض والأسود لراكب جمل بين بيوت طينية ضمن موضوع النقل'],
 ['assets/central-past-trade-user-approved.png','صورة بالأبيض والأسود لتبادل بضاعة بجوار ميزان ضمن موضوع التجارة'],
 ['assets/central-past-leisure-user-approved.png','صورة بالأبيض والأسود لأطفال يجلسون بحلقة ويلعبون بالحصى ضمن موضوع الترفيه']
];
const centralKingdomTopicImages=[
 ['assets/central-kingdom-food-user-approved.png','صورة لمائدة شعبية وتقديم المرق ضمن موضوع الطعام في بدايات المملكة'],
 ['assets/central-kingdom-clothing-user-approved.png','صورة لثوب وبشت وأقمشة مطوية ضمن موضوع الملابس في بدايات المملكة'],
 ['assets/central-kingdom-transport-user-approved.png','صورة لسيارة قديمة أمام ورشة ضمن موضوع النقل في بدايات المملكة'],
 ['assets/central-kingdom-trade-user-approved.png','صورة لبائع يزن الحبوب ضمن موضوع التجارة في بدايات المملكة'],
 ['assets/central-kingdom-leisure-user-approved.png','صورة لأطفال يلعبون بالدنّانة ضمن موضوع الترفيه في بدايات المملكة']
];
const centralMidcenturyTopicImages=[
 ['assets/central-midcentury-food-user-approved.png','صورة لكبسة دجاج وأوانٍ على سفرة ضمن موضوع الطعام في منتصف القرن'],
 ['assets/central-midcentury-clothing-user-approved.png','صورة لثوب وبشت وأقمشة داخل دولاب خشبي ضمن موضوع الملابس في منتصف القرن'],
 ['assets/central-midcentury-transport-user-approved.png','صورة لسيارة جمس في حي سكني ضمن موضوع النقل في منتصف القرن'],
 ['assets/central-midcentury-trade-user-approved.png','ميزان وأوزان نحاسية وأساور ذهب داخل متجر ضمن موضوع التجارة في منتصف القرن'],
 ['assets/central-midcentury-leisure-user-approved.png','صورة لتلفزيون وراديو في مجلس ضمن موضوع الترفيه في منتصف القرن']
];
const centralModernTopicImages=[
 ['assets/central-modern-food-user-approved.png','صورة لإعداد المراصيع ضمن موضوع الطعام في العصر الحديث'],
 ['assets/central-modern-clothing-user-approved.png','صورة لاختيار عباءة ضمن موضوع الملابس في العصر الحديث'],
 ['assets/central-modern-transport-user-approved.png','صورة لإطلالة على الرياض من داخل المترو ضمن موضوع النقل في العصر الحديث'],
 ['assets/central-modern-trade-user-approved.png','رسم توضيحي لشموع الأسهم وخط المؤشر على لوح زجاجي بدرجات بنية ضمن موضوع التجارة في العصر الحديث'],
 ['assets/central-modern-leisure-user-approved.png','صورة الترفيه لمدينة ألعاب حديثة، مع إبقاء شعار المصدر الموجود بالصورة']
];
let topicImagesKey=null;
let modernTradeDetail=null;
function updateTopicImages(){
 $('iyab-trade').hidden=state.page!=='trade';
 const images=state.region===0?([centralPastTopicImages,centralKingdomTopicImages,centralMidcenturyTopicImages,centralModernTopicImages][state.era]||null):null;
 const key=images?'central-'+state.era:'placeholder';
 if(key===topicImagesKey)return;
 modernTradeDetail?.destroy();modernTradeDetail=null;
 topicImagesKey=key;
 root.querySelectorAll('.topic[data-topic]').forEach(button=>{
  const slot=button.querySelector('.image-slot');
  const imageData=images?.[Number(button.dataset.topic)];
  slot.classList.toggle('has-photo',Boolean(imageData));
  if(imageData){
   const [src,alt]=imageData;
   const image=document.createElement('img');image.src=src;image.alt=alt;image.decoding='async';image.loading='lazy';
   slot.replaceChildren(image);
  }else slot.innerHTML='<i data-lucide="image" aria-hidden="true"></i><span>الصورة غير متوفرة</span>';
 });
 if(globalThis.lucide)lucide.createIcons();
}
function openModernTrade(){state.page='trade';sync();$('iyab-trade-label').textContent=names[state.region]+' / '+eras[state.era].label+' / التجارة';$('iyab-trade').scrollIntoView?.({block:'start',behavior:'auto'});}
function selectTopic(i){modernTradeDetail?.destroy();modernTradeDetail=null;state.topic=i;if(window.iyabOpenManagedContent?.({region:state.region,era:state.era,topic:i})){state.page='categories';sync();return;}if(i===3&&state.region===0&&state.era<3){state.page='central-trade';sync();window.iyabOpenCentralTrade(state.era);return;}if(i===0&&state.region===0){state.page='food';sync();window.iyabStartCooking(state.era);return;}if(i===4&&state.region===0){state.page='leisure';state.leisure={view:'menu',art:0,part:0};renderLeisure();sync();return;}if(i===2&&state.region===0){state.page='transport';renderTransport();sync();return;}if(i===1&&state.region===0){state.page='clothing';renderWardrobe();sync();return;}root.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.topic===i)));if(i===3&&state.region===0&&state.era===3){openModernTrade();return;}$('iyab-topic-content').innerHTML='<span class="eyebrow">'+names[state.region]+' · '+eras[state.era].label+'</span><h2>'+topics[i]+'</h2><p>لا يوجد محتوى متاح لهذا الاختيار حاليًا.</p>'}
const roomImages=["assets/wardrobe-past-hq.png", "assets/wardrobe-kingdom-hq.png", "assets/wardrobe-midcentury-hq.png", "assets/wardrobe-modern-hq.png"];
const sourceOld='https://www.saudibureau.org/files/SAUDI-TRADITIONAL-FASHION.pdf#page=17';
const sourceEarly='https://www.communityjameel.org/news/bc4c2294-9a44-4f53-aff8-80adb8fe4340';
const sourceThobe='https://saudipedia.com/الثوب-السعودي';
const closetData=[
{place:'خارج بيت الشعر',paper:'telegram',paperName:'رسالة من الماضي',items:[['الثوب المقطّع','ثوب تتكوّن قصّته من قطع تُخاط معًا، وأكمامه تنتهي عند الرسغ. يُظهر هذا النموذج اختلاف تفصيل الثوب القديم عن شكله المعاصر.',sourceOld],['المرودن','رداء يُلبس فوق الثوب، يتميّز بأكمامه الواسعة المثلثة التي يتدلّى طرفها إلى أسفل. اتساع الأكمام هو أبرز ما نلاحظه عند تأمّل القطعة.',sourceOld],['الدراعة','لباس نسائي طويل، من القطع التي ترد ضمن وصف أزياء الوسطى. تُفهم خامته وزخرفته مع استخدام القطعة والمناسبة، وليس من اسم الحقبة وحده.',sourceOld],['الثوب النسائي الواسع','قطعة خارجية واسعة تُلبس فوق اللباس الداخلي. هذا الشكل بصري مبدئي، ونطابق قصّته وزخرفته مع القطعة المرجعية قبل الاعتماد.',sourceOld]]},
{place:'داخل بيت نجدي',paper:'newspaper',paperName:'من خزانة نجد',items:[['الثوب الرجالي','نموذج للثوب الرجالي في المشهد النجدي. شكل الياقة والأكمام والأزرار يحتاج صورة مؤرّخة قبل اعتماد تفاصيله لهذه الحقبة.',sourceThobe],['البشت','رداء خارجي مفتوح يُلبس فوق الثوب، وله حضور في المناسبات. تختلف تفاصيل القماش والحواف بين القطع.', 'https://saudipedia.com/المشلح'],['ثوب مناسبات نجدي','توجد أثواب نجدية واسعة مزينة بخيوط معدنية، ضمن مجموعة أُهديت عامَي 1942 و1952م. هي مرجع لملابس المناسبات، وليست تمثيلًا للملابس اليومية لكل النساء.',sourceEarly],['اللباس الداخلي للثوب','نموذج للقطعة التي تظهر تحت الثوب الخارجي الواسع. نُكمل مطابقة القصّة والخامة مع توثيق الطقم المختار.',sourceEarly]]},
{place:'غرفة بدولاب خشبي',paper:'archive',paperName:'بطاقة من الأرشيف',items:[['الثوب الأبيض','نموذج بصري للثوب الرجالي داخل غرفة هذه الحقبة. لا يُعتمد شكل القطعة تاريخيًا حتى نربطه بصورة مؤرّخة من الوسطى.',sourceThobe],['الثوب الشتوي','يوضّح النموذج كيف يمكن عرض قطعة بخامة ولون مختلفين داخل الخزانة. تحديد القماش وتاريخه ما زال قيد التوثيق.',null],['فستان منزلي','نموذج تجريبي لفستان بأكمام طويلة وقصّة عند الخصر. نحتاج مرجعًا مؤرّخًا من الوسطى قبل اعتماده وربط اسمه بهذه الحقبة.',null],['عباءة الرأس','تصوّر لطريقة عرض عباءة الرأس داخل الخزانة. تاريخ القطعة وتفاصيلها الدقيقة لم تُعتمَد بعد.',null]]},
{place:'غرفة ملابس معاصرة',paper:'digital',paperName:'بطاقة القطعة',items:[['الثوب السعودي','تتميّز النماذج المعاصرة بتفاصيل الياقة والأزرار والجيوب. اضغط على القطع وقارن مظهرها بالملابس في الحقب السابقة.',sourceThobe],['البشت','رداء خارجي تقليدي ما زال حاضرًا في المناسبات؛ استمرار القطعة عبر الزمن جزء من قصتها، حتى حين تتغيّر تفاصيلها.', 'https://saudipedia.com/المشلح'],['العباءة العادية','عباءة كتف سوداء بقصّة بسيطة ضمن المشهد المعاصر. هذا نموذج واحد لملابس الخروج، وليس كل ما تلبسه المرأة في حياتها اليومية.',null],['الشيلة','قطعة سوداء مستقلة تُعرض بجوار العباءة. نختارها هنا كجزء من الطقم المعاصر في المشهد.',null]]}
];
let activeGarment=null;
const garmentSprite="assets/garment-sprite-hq-transparent.png";
const garmentDescriptions=[
[
['الثوب المقطّع','ثوب طويل يتكوّن من قطع تُجمع بالخياطة. في هذا النموذج تظهر فتحة رقبة بسيطة وأكمام تصل إلى الرسغ؛ يمكنك ملاحظة اختلاف قصّته عن الثوب المعاصر.','رجالي','قصة طويلة وفتحة رقبة بسيطة'],
['المرودن','رداء يُلبس فوق الثوب، وأبرز ما يميّزه اتساع الأكمام وشكلها المثلث المتدلّي. سمّي المرودن لاتساع أردانه، أي أكمامه.','رجالي','أكمام واسعة مثلثة'],
['الدراعة','لباس نسائي طويل، يظهر هنا بلون أخضر داكن وأكمام طويلة وقصّة واسعة. تختلف الزخارف باختلاف القطعة والمناسبة.','نسائي','قصة واسعة وأكمام طويلة'],
['الثوب النسائي الواسع','قطعة خارجية فضفاضة تُعرض هنا بلون عنّابي مع حواف مزخرفة. اتساعها يجعلها مختلفة بصريًا عن القطعة الأضيق التي تُلبس تحتها.','نسائي','طبقة خارجية واسعة']
],
[
['الثوب الرجالي','ثوب بلون عاجي بأكمام طويلة وتفاصيل بسيطة عند الصدر. المعروض يوضّح طريقة استكشاف الثوب؛ أما تفصيلاته المؤرّخة فنثبتها بصورة مرجعية من الحقبة.','رجالي','أكمام طويلة وقصة مستقيمة'],
['البشت','رداء خارجي فضفاض ومفتوح من الأمام يُلبس فوق الثوب. في هذه القطعة يبرز اللون البني وشريط الزينة عند الأطراف، ويظهر البشت ضمن أزياء المناسبات.','رجالي','فتحة أمامية وحواف مزينة'],
['ثوب مناسبات نجدي','ثوب خارجي واسع بزخارف بارزة وخيوط لامعة. تدعم مجموعة الأثواب النجدية المُهداة في عامَي 1942 و1952م اختيار هذا النوع للمناسبات في هذه الفترة.','نسائي · مناسبات','اتساع وزخارف بخيوط معدنية'],
['القطعة الداخلية للثوب','فستان طويل أضيق من الثوب الخارجي، يظهر هنا بلون داكن وزخرفة عند الصدر. يساعدنا عرضه منفصلًا على فهم طبقات الطقم بدل رؤيته قطعة واحدة.','نسائي','قطعة أساسية تحت الثوب الخارجي']
],
[
['الثوب الأبيض','نموذج لثوب أبيض بقصة مستقيمة، وياقة وأزرار عند الصدر. عند تكبيره نلاحظ بناء الأكمام والجزء الأمامي، بدل الاكتفاء بلونه الأبيض.','رجالي','ياقة وأزرار أمامية'],
['الثوب الشتوي','ثوب رمادي بأكمام طويلة وقصة مستقيمة. يظهر هنا باللون الرمادي لتوضيح تنوّع القطع داخل الخزانة؛ الرسم نموذج توضيحي يحتاج مرجعًا مؤرّخًا قبل اعتماده لهذه الحقبة.','رجالي','لون رمادي وقصة طويلة مستقيمة'],
['الفستان المنزلي','فستان طويل بأكمام طويلة ونقشة زهور صغيرة. تظهر فيه قصة عند الخصر واتساع في الجزء السفلي؛ هذه تفاصيل النموذج المعروض وليست تأريخًا نهائيًا لظهوره.','نسائي','نقشة صغيرة وقصة عند الخصر'],
['عباءة الرأس','رداء أسود واسع ينسدل من أعلى الرأس. تظهر القطعة هنا معلّقة حتى تتضح مساحتها وطريقة سقوط القماش، وتُراجع تفاصيلها مع المرجع التاريخي.','نسائي · خروج','انسدال واسع من أعلى']
],
[
['الثوب السعودي المعاصر','ثوب أبيض بتفاصيل واضحة في الياقة والأزرار والأكمام. يجمع الشكل المعروض بين القصة الطويلة والتشطيب المنظم في الأطراف والجزء الأمامي.','رجالي','ياقة وأزرار وتشطيب معاصر'],
['البشت','بشت بلون بيج فاتح، مفتوح من الأمام وتحيط بأطرافه حواف مزينة. استمرار هذه القطعة في المناسبات يوضح أن بعض الأزياء تبقى حاضرة مع تغيّر التفاصيل.','رجالي · مناسبات','بيج فاتح وحواف مزينة'],
['العباءة العادية','عباءة كتف سوداء بقصة بسيطة، وأكمام طويلة وفتحة أمامية، دون تطريز بارز. هذا المثال من ملابس الخروج المعاصرة، وليس تمثيلًا لكل ملابس المرأة اليومية.','نسائي · خروج','قصة بسيطة ولون أسود'],
['الشيلة','قطعة سوداء مستطيلة تُستخدم غطاءً للرأس، وتُعرض هنا مستقلة بجوار العباءة حتى يمكن استكشافها كجزء من الطقم.','نسائي','قماش منسدل ومستطيل']
]
];
let lastGarmentButton=null;
function renderWardrobe(){
 const data=closetData[state.era];activeGarment=null;
 $('iyab-clothing-label').textContent='الوسطى / '+eras[state.era].label+' / الملابس';$('iyab-clothing-place').textContent=data.place;
 const xs=[[32,47,62,77],[23,38,56,73],[30,43,56,68],[26,43,61,78]][state.era];
 $('iyab-wardrobe-scene').innerHTML='<img src="'+roomImages[state.era]+'" alt="'+data.place+' مع قطع الملابس">'+data.items.map((it,i)=>'<button type="button" class="garment cursor-interaction" data-garment="'+i+'" aria-label="تكبير '+it[0]+' وقراءة وصفه" aria-pressed="false" style="left:'+xs[i]+'%"><span>'+it[0]+'</span></button>').join('');
 $('iyab-wardrobe-scene').querySelectorAll('[data-garment]').forEach(b=>b.onclick=()=>{lastGarmentButton=b;activeGarment=+b.dataset.garment;renderLetter();$('iyab-inspect-close').focus();persist()});
 const names=root.querySelector('.scene-caption');
 names.setAttribute('aria-label','اختيار قطعة الملابس');
 names.innerHTML=data.items.map((it,i)=>'<button type="button" class="garment-name cursor-interaction" data-name="'+i+'">'+it[0]+'</button>').join('');
 names.querySelectorAll('[data-name]').forEach(b=>b.onclick=()=>{const piece=$('iyab-wardrobe-scene').querySelectorAll('[data-garment]')[+b.dataset.name];piece.onclick()});
 $('iyab-clothing-feedback').textContent='';renderLetter();
}

const refFemale='https://saudipedia.com/الأزياء-الشعبية-النسائية-في-السعودية';
const refBisht='https://saudipedia.com/المشلح';
const clothingReferences=[
[[sourceOld.replace('page=17','page=18'),'الأزياء التقليدية — ص 18','مرجع القصّة'],[sourceOld.replace('page=17','page=18'),'الأزياء التقليدية — ص 18','مرجع الأكمام'],[sourceOld.replace('page=17','page=25'),'الأزياء التقليدية — ص 25','مرجع الدراعة'],[refFemale,'سعوديبيديا — أزياء الوسطى','مرجع عام للثوب الخارجي']],
[[sourceThobe,'سعوديبيديا — الثوب السعودي','مرجع عام للثوب؛ لا يؤرّخ هذه الرسمة'],[refBisht,'سعوديبيديا — المشلح','مرجع تعريف البشت'],[sourceEarly,'مجتمع جميل — الأثواب النجدية','مرجع أثواب المناسبات'],[refFemale,'سعوديبيديا — أزياء الوسطى','مرجع عام لطبقات اللباس؛ النموذج توضيحي']],
[[sourceThobe,'سعوديبيديا — الثوب السعودي','مرجع عام؛ لا يؤرّخ النموذج'],[sourceThobe,'سعوديبيديا — الثوب السعودي','مرجع عام للثوب؛ اللون في الرسم توضيحي'],[refFemale,'سعوديبيديا — الأزياء النسائية','مرجع سياقي؛ الفستان المرسوم غير موثّق تاريخيًا'],[refFemale,'سعوديبيديا — العباءة','مرجع تعريف عباءة الرأس']],
[[sourceThobe,'سعوديبيديا — الثوب السعودي','مرجع تعريف الثوب'],[refBisht,'سعوديبيديا — المشلح','مرجع تعريف البشت'],[refFemale,'سعوديبيديا — العباءة','مرجع تعريف عباءة الكتف'],[refFemale,'سعوديبيديا — حجاب المرأة السعودية','مرجع تعريف الشيلة']]
];
function renderSources(era,index){const r=clothingReferences[era][index];return '<div class="piece-resources"><a class="source-link" href="'+r[0]+'" target="_blank" rel="noopener">'+r[1]+' ↗</a><span>'+r[2]+'</span><small>الرسم توضيحي للتجربة، وليس صورة من المرجع.</small></div>'}

function renderLetter(){
 $('iyab-clothing-save').disabled=!Number.isInteger(activeGarment);
 const overlay=$('iyab-inspect'),stage=$('iyab-wardrobe-stage');
 overlay.hidden=activeGarment===null;stage.classList.toggle('modal-open',activeGarment!==null);
 $('iyab-wardrobe-scene').querySelectorAll('[data-garment]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.garment===activeGarment)));
 if(activeGarment===null)return;
 const data=closetData[state.era],item=garmentDescriptions[state.era][activeGarment],paper=$('iyab-inspect-paper'),panel=$('iyab-clothing-letter');
 const forms=['telegram','newspaper','tv-old','tv-modern'];paper.className='inspect-paper '+(state.era>=2?forms[state.era]:'');panel.className='letter '+(state.era<2?forms[state.era]:'digital');
 const headings=['الماضي البعيد','جريدة خزانة نجد','تلفزيون إياب — من الأرشيف','إياب — بطاقة أزياء معاصرة'];
 panel.innerHTML=(state.era===0?'':'<div class="letter-meta"><span>'+headings[state.era]+'</span><span>'+eras[state.era].label+'</span></div>')+(state.era===1?'<div class="paper-name">من خزانة نجد</div>':'')+'<h2 id="iyab-piece-title">'+item[0]+'</h2><p>'+item[1]+'</p><div class="piece-facts"><span>الفئة: '+item[2]+'</span><span>التفصيل المميز: '+item[3]+'</span></div>'+(state.era===0?'<span class="stamp">حكاية من الوسطى</span>':'')+renderSources(state.era,activeGarment);
 paper.querySelector('.tv-controls')?.remove();if(state.era===2){const controls=document.createElement('span');controls.className='tv-controls';controls.setAttribute('aria-hidden','true');paper.appendChild(controls)}
 const zoom=$('iyab-piece-zoom');
 zoom.innerHTML='<div class="isolated-garment" role="img" aria-label="'+item[0]+'" style="background-image:url('+garmentSprite+');background-position:'+(activeGarment*100/3)+'% '+(state.era*100/3)+'%"></div>';
 zoom.style.backgroundImage='none';$('iyab-piece-caption').textContent=item[0];


}
function closeInspection(){activeGarment=null;renderLetter();lastGarmentButton?.focus()}
$('iyab-inspect-close').onclick=closeInspection;
$('iyab-inspect').onclick=e=>{if(e.target===$('iyab-inspect'))closeInspection()};
root.addEventListener('keydown',e=>{if(activeGarment===null||state.page!=='clothing')return;if(e.key==='Escape'){e.preventDefault();closeInspection()}if(e.key==='Tab'){const nodes=[...$('iyab-inspect').querySelectorAll('button,a[href]')];if(!nodes.length)return;const a=nodes[0],b=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus()}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus()}}});
$('iyab-clothing-back').onclick=()=>{closeInspection();state.page='categories';state.topic=null;sync();persist();$('iyab-back').focus()};
$('iyab-clothing-map').onclick=()=>{closeInspection();state.page='selection';state.topic=null;sync();persist()};
$('iyab-clothing-save').onclick=()=>{journeySave?.save();$('iyab-clothing-feedback').textContent=$('journey-save-message').textContent;};

const v2Assets={"camel": "assets/transport-camel.webp", "gmc": "assets/transport-gmc.avif", "workshop": "assets/old-workshop.webp", "cars": ["assets/old-car-ford.avif", "assets/old-car-pierce.avif"], "modernPlaza": "assets/modern-plaza.avif", "modernViews": "assets/modern-vehicle-views.avif"};
const v2Titles=['جهّز راحلتك','بدايات السيارة في الوسطى','ادخل إلى الجمس','الرياض… طرق جديدة للحكاية'];
const v2Prompts=['الجمل أمامك بوضوح؛ أضف كل تجهيز إلى موضعه على الظهر.','اختَر السيارة، ثم اسحب يمينًا أو يسارًا لاستعراضها من كل الجهات.','افتح الباب الأمامي واركب، ثم انظر إلى الطريق أو التفت للمقصورة.','اختَر رقمًا فوق الوسيلة، واقترب من تفاصيل التنقّل اليوم.'];
const v2Cars=[['فورد تي','جُلبت عام 1921 حسب المرجع','https://saudipedia.com/سيارات-الملك-عبدالعزيز'],['بيرس أرو','طراز 1934 مذكور في المرجع','https://saudipedia.com/سيارات-الملك-عبدالعزيز']];
const v2Gear=[['الشداد','يستقر تجهيز الركوب على أعلى الظهر حول السنام، وتثبّته الأربطة.'],['الجاعد','غطاء يُوضع فوق مركب الراكب؛ يظهر هنا مستقرًا على الشداد.'],['الخرج','حقيبتان متصلتان تتدلّيان من تجهيز الظهر لحمل المتاع.']];
const v2Gmc=[['من الخارج','نبدأ من الباب الأمامي','اضغط علامة الباب لفتحه، ثم ادخل من موضع الراكب.'],['افتح الباب','باب مفتوح وخطوة للدخول','تقدّم إلى المقصورة من الباب الأمامي؛ اضغط العلامة مرة أخرى للركوب.'],['اركب','من منظور الراكب الأمامي','أنت الآن داخل المقصورة، تنظر إلى لوحة القيادة والطريق. الرسم تصوّر لطراز قديم، وليس صورة أرشيفية لسيارة محلية بعينها.'],['التفت للخلف','تأمّل امتداد المقصورة','ننظر من الداخل إلى الخلف لنتأمّل امتداد المقصورة والمساحة خلف الراكب.']];
let v3Observer=null;
let v2={camel:0,car:null,angle:0,gmc:0,origin:0,modern:null,modernAngle:0},v2Timers=[],v2Token=0,v2OrbitLayer=0;
function v2Clear(){if(v3Observer){v3Observer.disconnect();v3Observer=null}v2Token++;v2Timers.forEach(clearTimeout);v2Timers=[]}
function v2Later(f,ms){const id=setTimeout(f,ms);v2Timers.push(id);return id}
function v2Save(){state.transportV2={...v2};persist()}
function v2Restore(){const x=state.transportV2;if(!x)return;v2.modern=[0,1,2].includes(x.modern)?x.modern:null;v2.modernAngle=Number.isInteger(x.modernAngle)?((x.modernAngle%4)+4)%4:0;v2.destination=x.destination===1?1:0;v2.stamps=Array.isArray(x.stamps)?x.stamps.filter(v=>/^[0-3]:[01]$/.test(v)).slice(-8):[];v2.camel=Number.isInteger(x.camel)?Math.max(0,Math.min(3,x.camel)):0;v2.car=[0,1].includes(x.car)?x.car:null;v2.angle=Number.isInteger(x.angle)?((x.angle%8)+8)%8:0;v2.gmc=[0,1,2,3].includes(x.gmc)?x.gmc:0;v2.origin=[0,1,2,3].includes(x.origin)?x.origin:0}
function renderTransport(){v2Clear();v2Restore();$('iyab-transport-label').textContent='الوسطى / '+eras[state.era].label+' / النقل';$('iyab-transport-title').textContent=v2Titles[state.era];$('iyab-transport-prompt').textContent=v2Prompts[state.era];[v2Camel,v2Workshop,v2Family,v2Metro][state.era]()}
const v2Pos=i=>(i%2?100:0)+'% '+(i>1?100:0)+'%';
const v2CarPos=i=>((i%4)*100/3)+'% '+(i>3?100:0)+'%';
function v2Camel(){
 $('iyab-experience').innerHTML='<div class="v2-scene camel" id="iyab-v2-camel" role="img" aria-label="الجمل وتجهيزه على أعلى الظهر"><div class="v2-camel-stage" id="iyab-camel-old" style="background-image:url('+v2Assets.camel+');background-position:'+v2Pos(v2.camel)+'"></div><div class="v2-camel-stage visible" id="iyab-camel-current" style="background-image:url('+v2Assets.camel+');background-position:'+v2Pos(v2.camel)+'"></div><span class="v2-caption" id="iyab-camel-label">'+(v2.camel===0?'قبل التجهيز':v2.camel===3?'اكتمل التجهيز ✓':v2Gear[v2.camel-1][0])+'</span></div><div class="v2-steps">'+v2Gear.map((g,i)=>'<button type="button" class="cursor-interaction" data-v2-gear="'+(i+1)+'" aria-pressed="'+(v2.camel>=i+1)+'"><span class="v2-step-number">'+(i+1)+'</span>'+g[0]+(v2.camel>=i+1?' ✓':'')+'</button>').join('')+'</div><div class="v2-info"><h2 id="iyab-camel-info-title">'+(v2.camel?v2Gear[v2.camel-1][0]:'ابدأ بالشداد')+'</h2><div><p id="iyab-camel-info">'+(v2.camel?v2Gear[v2.camel-1][1]:'كل قطعة ستظهر في مكانها داخل الرسم نفسه؛ يبدأ الشداد فوق الظهر، ثم الغطاء، ثم الخرج.')+'</p><button type="button" class="exp-text-button cursor-interaction" id="iyab-v2-camel-reset">إعادة التجهيز</button><br><a class="v2-source" href="https://www.spa.gov.sa/N2233250" target="_blank" rel="noopener">مرجع التجهيزات: وكالة الأنباء السعودية ↗</a></div></div>';
 root.querySelectorAll('[data-v2-gear]').forEach(b=>b.onclick=()=>{const n=+b.dataset.v2Gear;if(n>v2.camel+1){$('iyab-camel-info').textContent='نركّب '+v2Gear[v2.camel][0]+' أولًا.';return}v2SetCamel(n)});$('iyab-v2-camel-reset').onclick=()=>v2SetCamel(0);
}
function v2SetCamel(n){const prev=v2.camel;v2.camel=n;const old=$('iyab-camel-old'),current=$('iyab-camel-current');old.style.backgroundPosition=v2Pos(prev);old.classList.add('visible');current.classList.remove('visible');current.style.backgroundPosition=v2Pos(n);requestAnimationFrame(()=>requestAnimationFrame(()=>{current.classList.add('visible');old.classList.remove('visible')}));$('iyab-camel-label').textContent=n===0?'قبل التجهيز':n===3?'اكتمل التجهيز ✓':v2Gear[n-1][0];$('iyab-camel-info-title').textContent=n?v2Gear[n-1][0]:'ابدأ بالشداد';$('iyab-camel-info').textContent=n?v2Gear[n-1][1]:'اختَر الشداد ليظهر في موضعه على أعلى الظهر.';root.querySelectorAll('[data-v2-gear]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v2Gear<=n)));v2Save()}
function v2Workshop(){
 if(v2.car!==null){v2Viewer();return}
 $('iyab-experience').innerHTML='<div class="v2-scene v3-workshop"><img class="v2-full" src="'+v2Assets.workshop+'" alt="تصوّر ناعم لورشة قديمة وسيارتين من بدايات دخول السيارات"><button type="button" class="v3-car-hit cursor-interaction" data-v2-car="0" style="left:2%" aria-label="استعراض فورد تي"></button><button type="button" class="v3-car-hit cursor-interaction" data-v2-car="1" style="left:51%" aria-label="استعراض بيرس أرو"></button></div><div class="v2-car-name-row v3-two-cars">'+v2Cars.map((c,i)=>'<button type="button" class="cursor-interaction" data-v2-car="'+i+'">'+c[0]+'<small>'+c[1]+'</small></button>').join('')+'</div><div class="v3-context">فورد تي وبيرس أرو مذكورتان ضمن سيارات الملك عبدالعزيز. تاريخ الجميح يوثّق بدايتها في شقراء عام 1936 ثم مقرّها في الرياض. الرسوم تصوّر توضيحي وليست صورًا أرشيفية.<br><a class="v2-source" href="https://saudipedia.com/سيارات-الملك-عبدالعزيز" target="_blank" rel="noopener">مرجع السيارات ↗</a> · <a class="v2-source" href="https://www.aljomaih.com/en/history" target="_blank" rel="noopener">مرجع السوق في شقراء والرياض ↗</a></div>';
 root.querySelectorAll('[data-v2-car]').forEach(b=>b.onclick=()=>{v2.car=+b.dataset.v2Car;v2.angle=0;v2Viewer();v2Save()});
}
function v2Viewer(){const c=v2Cars[v2.car];
 $('iyab-experience').innerHTML='<div class="v2-viewer"><button type="button" class="v2-viewer-close cursor-interaction" id="iyab-v2-close" aria-label="العودة للورشة">×</button><span class="v2-subtitle">من ورشة الطريق</span><h2 style="font-family:Amiri,serif;font-size:28px;color:#6b472b;margin:0">'+c[0]+'</h2><div class="v2-orbit-surface" id="iyab-orbit-surface" role="group" aria-label="استعراض زوايا السيارة بالسحب"><div class="v2-orbit-layer" id="iyab-orbit-a" style="background-image:url('+v2Assets.cars[v2.car]+');background-position:'+v2CarPos(v2.angle)+'"></div><div class="v2-orbit-layer" id="iyab-orbit-b" style="opacity:0;background-image:url('+v2Assets.cars[v2.car]+');background-position:'+v2CarPos(v2.angle)+'"></div></div><div class="v2-angle-label" id="iyab-orbit-label"></div><div class="v2-orbit-controls"><button type="button" class="cursor-interaction" id="iyab-orbit-prev" aria-label="الزاوية السابقة">‹</button><input type="range" id="iyab-orbit-range" min="0" max="7" step="1" value="'+v2.angle+'" aria-label="زاوية عرض السيارة"><button type="button" class="cursor-interaction" id="iyab-orbit-next" aria-label="الزاوية التالية">›</button></div></div><div class="v2-toolbar"><span class="v2-note">اسحب يمينًا ويسارًا · ثماني زوايا مصوّرة</span><a class="v2-source" href="'+c[2]+'" target="_blank" rel="noopener">مرجع الطراز ↗</a></div>';
 v2OrbitLayer=0;v2SetAngle(v2.angle,true);$('iyab-v2-close').onclick=()=>{const selected=v2.car;v2.car=null;v2Workshop();root.querySelectorAll('[data-v2-car]')[selected]?.focus();v2Save()};$('iyab-orbit-prev').onclick=()=>v2SetAngle(v2.angle-1);$('iyab-orbit-next').onclick=()=>v2SetAngle(v2.angle+1);$('iyab-orbit-range').oninput=e=>v2SetAngle(+e.target.value);$('iyab-orbit-range').onchange=v2Save;
 const surface=$('iyab-orbit-surface');let startX=null,startAngle=0;
 surface.onpointerdown=e=>{startX=e.clientX;startAngle=v2.angle;surface.setPointerCapture?.(e.pointerId)};
 surface.onpointermove=e=>{if(startX===null)return;const step=Math.round((e.clientX-startX)/45);v2SetAngle(startAngle+step)};
 surface.onpointerup=surface.onpointercancel=()=>{startX=null;v2Save()};
}
function v2SetAngle(i,initial=false){const n=((i%8)+8)%8;const same=n===v2.angle;v2.angle=n;const names=['أمامي مائل','الجانب الأيسر','خلفي مائل','من الخلف','خلفي مائل','الجانب الأيمن','أمامي مائل','من الأمام'];$('iyab-orbit-label').textContent=names[n];$('iyab-orbit-range').value=n;if(!initial&&same)return;const a=$('iyab-orbit-a'),b=$('iyab-orbit-b'),next=v2OrbitLayer? a:b,old=v2OrbitLayer?b:a;next.style.backgroundPosition=v2CarPos(n);next.style.opacity=1;old.style.opacity=0;v2OrbitLayer=1-v2OrbitLayer;if(initial){a.style.backgroundPosition=v2CarPos(n);a.style.opacity=1;b.style.opacity=0;v2OrbitLayer=0}if(!initial)v2Save()}
function v2Family(){const info=v2Gmc[v2.gmc];
 $('iyab-experience').innerHTML='<div class="v2-scene" style="aspect-ratio:3/2"><div id="iyab-gmc-old" class="v2-gmc-frame" style="background-image:url('+v2Assets.gmc+');background-position:'+v2Pos(v2.gmc)+'"></div><div id="iyab-gmc-current" class="v2-gmc-frame visible" style="background-image:url('+v2Assets.gmc+');background-position:'+v2Pos(v2.gmc)+'"></div><span class="v2-caption" id="iyab-gmc-caption">'+info[0]+'</span><button type="button" id="iyab-v3-door" class="v3-entry-button cursor-interaction" aria-label="'+(v2.gmc===0?'فتح الباب الأمامي':'الركوب من الباب الأمامي')+'" '+(v2.gmc>1?'hidden':'')+'><i data-lucide="door-open" aria-hidden="true"></i></button></div><div class="v2-toolbar"><div class="v2-gmc-actions">'+v2Gmc.map((g,i)=>'<button type="button" class="v2-soft-button cursor-interaction" data-v2-gmc="'+i+'" aria-pressed="'+(v2.gmc===i)+'">'+g[0]+'</button>').join('')+'</div></div><div class="v2-info"><h2 id="iyab-gmc-title">'+info[1]+'</h2><div><p id="iyab-gmc-description">'+info[2]+'</p><div class="v3-context">تاريخ الجميح يوثّق حضورها في شقراء والرياض، ووكالة جنرال موتورز عام 1967. المقصورة تصوّر توضيحي للركوب وليست صورة مؤرّخة لسيارة محلية بعينها.<br><a class="v2-source" href="https://www.aljomaih.com/en/history" target="_blank" rel="noopener">الجميح: شقراء والرياض ↗</a> · <a class="v2-source" href="https://m-jomaih.org.sa/مسيرة-المؤسس/" target="_blank" rel="noopener">وكالة جنرال موتورز 1967 ↗</a></div></div></div>';
 root.querySelectorAll('[data-v2-gmc]').forEach(b=>b.onclick=()=>v3ChooseGmc(+b.dataset.v2Gmc));$('iyab-v3-door').onclick=()=>v3ChooseGmc(v2.gmc===0?1:2);if(globalThis.lucide)lucide.createIcons();
}
function v3ChooseGmc(n){v2Clear();if(n===2&&v2.gmc===0){v3GmcFrame(1);v2Later(()=>v3GmcFrame(2),700)}else v3GmcFrame(n)}
function v3GmcFrame(n){const prev=v2.gmc;v2.gmc=n;$('iyab-gmc-old').style.backgroundPosition=v2Pos(prev);$('iyab-gmc-old').classList.add('visible');$('iyab-gmc-current').classList.remove('visible');$('iyab-gmc-current').style.backgroundPosition=v2Pos(n);requestAnimationFrame(()=>requestAnimationFrame(()=>{$('iyab-gmc-current').classList.add('visible');$('iyab-gmc-old').classList.remove('visible')}));$('iyab-gmc-caption').textContent=v2Gmc[n][0];$('iyab-gmc-title').textContent=v2Gmc[n][1];$('iyab-gmc-description').textContent=v2Gmc[n][2];$('iyab-v3-door').hidden=n>1;$('iyab-v3-door').setAttribute('aria-label',n===0?'فتح الباب الأمامي':'الركوب من الباب الأمامي');root.querySelectorAll('[data-v2-gmc]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v2Gmc===n)));v2Save()}
const v7Vehicles=[
{name:'مترو الرياض',tag:'قطار إنسبايرو · سيمنس',dateLabel:'اكتمال أول قطار وعرضه',date:'٢٣ فبراير ٢٠١٦',dateNote:'هذا تاريخ أول قطار سيمنس للمشروع، وليس تاريخ بدء تشغيل الشبكة.',facts:['يسير آليًا دون سائق على المسارين الأزرق والأحمر.','تجهيزات خاصة تمنع دخول الرمل إلى الأبواب والمكابح والمحركات.','تكييف أقوى صُمّم لمواجهة حرارة الرياض.'],source:'https://press.siemens.com/global/en/pressrelease/siemens-presents-new-metro-riyadh'},
{name:'حافلات الرياض',tag:'شبكة تربط أحياء المدينة',dateLabel:'بداية تشغيل الخدمة',date:'مارس ٢٠٢٣',dateNote:'تاريخ التشغيل موثّق؛ سنة تصنيع الحافلة المرسومة تحديدًا غير موثّقة.',facts:['بدأت الشبكة العمل على مراحل خلال عام ٢٠٢٣.','تضم حافلات من مرسيدس وMAN وفق تقرير سابتكو لعام ٢٠٢٥.','تتكامل الحافلات مع شبكة القطار لخدمة الرحلات داخل الرياض.'],source:'https://www.saptco.com.sa/riyadh-bus',extra:'https://saptco.com.sa/pdf/fs/SAPTCO-Annual-Report-2025-Arabic-Full.pdf'},
{name:'سير · CEER EXOBOT',tag:'سيارة كهربائية بهوية سعودية',dateLabel:'الكشف الرسمي عن EXOBOT',date:'٢١ سبتمبر ٢٠٢٦',dateNote:'هذا تاريخ الكشف، وليس تاريخ تصنيع سيارة بعينها.',facts:['تأتي عائلة EXOBOT بنسختين: سيدان وسيارة SUV.','تقول سير إن التصميم يستلهم تضاريس المملكة وعمارة الحِجر.','مقر تصنيعها المعلن مجمّع سير في مدينة الملك عبدالله الاقتصادية.'],source:'https://ceermotors.com/news/exobot-bold-extraordinary-saudi//'}
];
function v2Metro(){if(v2.modern!==null&&v2.modern!==undefined){v7Viewer();return}
 $('iyab-experience').innerHTML='<div class="v2-scene v7-plaza"><img class="v2-full" src="'+v2Assets.modernPlaza+'" alt="تصوّر لساحة تنقّل حديثة بالرياض تضم قطارًا على سكة مرتفعة وحافلة وسيارة كهربائية"><button type="button" class="v7-hit v7-hit-metro cursor-interaction" data-v7-vehicle="0" aria-label="استعراض مترو الرياض"><span class="v7-number">١</span></button><button type="button" class="v7-hit v7-hit-bus cursor-interaction" data-v7-vehicle="1" aria-label="استعراض حافلات الرياض"><span class="v7-number">٢</span></button><button type="button" class="v7-hit v7-hit-ceer cursor-interaction" data-v7-vehicle="2" aria-label="استعراض سيارة سير"><span class="v7-number">٣</span></button></div><div class="v2-car-name-row v7-names">'+v7Vehicles.map((v,i)=>'<button type="button" class="cursor-interaction" data-v7-vehicle="'+i+'">'+v.name+'<small>'+v.tag+'</small></button>').join('')+'</div><p class="v2-note">ساحة متخيّلة بطابع الرياض · اختَر وسيلة لتقترب منها وتستعرض زواياها.</p>';
 root.querySelectorAll('[data-v7-vehicle]').forEach(b=>b.onclick=()=>{v2.modern=+b.dataset.v7Vehicle;v2.modernAngle=0;v7Viewer();v2Save()});
}
function v7Viewer(){const v=v7Vehicles[v2.modern];
 $('iyab-experience').innerHTML='<div class="v8-detail"><div class="v8-art"><div class="v2-viewer v7-viewer"><button type="button" class="v2-viewer-close cursor-interaction" id="iyab-v7-close" aria-label="العودة إلى ساحة التنقّل">×</button><span class="v2-subtitle">استعرض الوسيلة</span><h2>'+v.name+'</h2><div class="v2-orbit-surface v7-orbit" id="iyab-v7-orbit" role="group" aria-label="استعراض أربع زوايا بالسحب"><div class="v7-sprite" id="iyab-v7-sprite" style="background-image:url('+v2Assets.modernViews+')"></div></div><div class="v2-angle-label" id="iyab-v7-angle"></div><div class="v2-orbit-controls"><button type="button" class="cursor-interaction" id="iyab-v7-prev" aria-label="الزاوية السابقة">‹</button><input type="range" id="iyab-v7-range" min="0" max="3" step="1" value="'+(v2.modernAngle||0)+'" aria-label="زاوية عرض الوسيلة"><button type="button" class="cursor-interaction" id="iyab-v7-next" aria-label="الزاوية التالية">›</button></div><p class="v2-note">اسحب أو استخدم الأسهم · أربع زوايا توضيحية</p></div></div><div class="v8-story"><span class="eyebrow">'+v.tag+'</span><h2>'+v.name+'</h2><div class="v8-date"><span>'+v.dateLabel+'</span><strong>'+v.date+'</strong></div><p class="v8-date-note">'+v.dateNote+'</p><h3>وش يميّزها؟</h3><ul>'+v.facts.map(f=>'<li>'+f+'</li>').join('')+'</ul><a class="v2-source" href="'+v.source+'" target="_blank" rel="noopener">المصدر الرسمي ↗</a>'+(v.extra?' · <a class="v2-source" href="'+v.extra+'" target="_blank" rel="noopener">تقرير الأسطول ↗</a>':'')+'<p class="v8-date-note">الصور للاستعراض التوضيحي، وليست صور المنتج الرسمية.</p></div></div>';

 const surface=$('iyab-v7-orbit');let x=null,start=0;
 surface.onpointerdown=e=>{x=e.clientX;start=v2.modernAngle||0;surface.setPointerCapture?.(e.pointerId)};surface.onpointermove=e=>{if(x===null)return;v7SetAngle(start+Math.round((e.clientX-x)/60))};surface.onpointerup=surface.onpointercancel=()=>{x=null;v2Save()};
 $('iyab-v7-close').onclick=()=>{const selected=v2.modern;v2.modern=null;v2Metro();root.querySelectorAll('[data-v7-vehicle]')[selected]?.focus();v2Save()};$('iyab-v7-prev').onclick=()=>v7SetAngle((v2.modernAngle||0)-1);$('iyab-v7-next').onclick=()=>v7SetAngle((v2.modernAngle||0)+1);$('iyab-v7-range').oninput=e=>v7SetAngle(+e.target.value);v7SetAngle(v2.modernAngle||0,false);
}
function v7SetAngle(n,save=true){n=((n%4)+4)%4;v2.modernAngle=n;$('iyab-v7-sprite').style.backgroundPosition=(n*100/3)+'% '+(v2.modern*50)+'%';$('iyab-v7-range').value=n;$('iyab-v7-angle').textContent=['أمامي مائل','من الجانب','خلفي مائل','من الخلف'][n];if(save)v2Save()}

function leaveTransport(page){v2Clear();v2.car=null;state.page=page;state.topic=null;sync();persist()}
$('iyab-transport-back').onclick=()=>leaveTransport('categories');$('iyab-transport-map').onclick=()=>leaveTransport('selection');

const renderLeisure=mountIyabLeisure({names,eras,getJourney:()=>state,saveJourney:persist,onNavigate:page=>{state.page=page;state.topic=null;sync();persist();}});
function leaveModernTrade(page){modernTradeDetail?.destroy();modernTradeDetail=null;state.page=page;state.topic=null;sync();persist();}
$('iyab-trade-back').onclick=()=>leaveModernTrade('categories');$('iyab-trade-map').onclick=()=>leaveModernTrade('selection');
root.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{selectTopic(+b.dataset.topic);persist()});
window.iyabCentralTradeRoute=page=>{state.page=page;state.topic=null;sync();persist()};
window.iyabFoodBack=()=>{state.page='categories';state.topic=null;sync();persist()};
arrived();sync();if(state.page==='food')window.iyabStartCooking(state.era);if(state.page==='leisure')renderLeisure();if(state.page==='transport')renderTransport();
if(state.page==='clothing'){renderWardrobe();if(Number.isInteger(state.lastGarment)&&state.lastGarment>=0&&state.lastGarment<4){activeGarment=state.lastGarment;renderLetter()}}
if(globalThis.lucide)lucide.createIcons();
window.addEventListener('iyab:restore-state',e=>{const saved=e.detail?.globals?.widgetState?.privateContent?.journey;if(['transport','central-trade'].includes(state.page)&&saved?.page===state.page&&JSON.stringify(saved)===JSON.stringify(state))return;if(!moving&&valid(saved)){const currentPiece=activeGarment;state={...state,...saved};reached=state.era;arrived();sync();if(state.page==='central-trade'&&state.region===0&&state.era<3)window.iyabOpenCentralTrade(state.era);if(state.page==='leisure')renderLeisure();if(state.page==='transport')renderTransport();if(state.page==='clothing'){renderWardrobe();if(currentPiece!==null){activeGarment=currentPiece;renderLetter()}}}});

function journeySnapshot(){
 const managed=window.iyabManagedSelection?.();
 if(managed&&state.page==='categories'&&state.region===managed.region&&state.era===managed.era&&state.topic===managed.topic){const record=window.IyabContent.selection(managed.region,managed.era,managed.topic)[0];if(!record)return null;return {selection:{...state,contentId:record.id},title:record.ar.title};}
 const allowed={food:0,clothing:1,transport:2,'central-trade':3,trade:3,leisure:4};
 if(state.region!==0||!state.eraChosen||allowed[state.page]!==state.topic)return null;
 if(state.page==='clothing'&&!Number.isInteger(activeGarment))return null;
 if(state.page==='leisure'&&(!state.leisure||state.leisure.view==='menu'))return null;
 const contentId=window.IyabContent?.selection(state.region,state.era,state.topic).find(e=>e.builtin)?.id;
 const selection=JSON.parse(JSON.stringify({...state,contentId,lastGarment:activeGarment,transportV2:{...v2}}));
 let title=topics[state.topic];
 if(state.topic===0)title=['الجريش','القرصان','الكبسة','المصابيب'][state.era];
 if(state.topic===1&&Number.isInteger(activeGarment))title=closetData[state.era].items[activeGarment]?.[0]||title;
 if(state.topic===2)title=$('iyab-transport-title').textContent||title;
 if(state.topic===3)title=state.era===3?'الرياض… مدينة الأعمال':$('ct-title').textContent;
 if(state.topic===4&&state.leisure?.view==='arts')title='الفنون الأدائية · '+['الصفّان','الشعر','الإيقاع والحركة'][state.leisure.art||0];
 if(state.topic===4&&state.leisure?.view==='games')title=[['الشعر النجدي','الحكاوي','لغز المجلس'],['الحَبْلة','الدنّانة'],['الراديو','التلفزيون'],['الألعاب الإلكترونية','السينما']][state.era][state.leisure.part||0]||title;
 return {selection,title:window.IyabI18n?.original(title)||title};
}
function unavailableJourney(record,message){
 if(record&&window.IyabJourneys.validSelection(record)){state.region=record.region;state.era=record.era;state.eraChosen=true;reached=state.era;state.page='categories';state.topic=null;arrived();sync();}
 $('journey-resume-notice').hidden=false;$('journey-resume-notice').textContent=message;
}
function restoreJourney(record){
 if(!Number.isInteger(record.topic)||record.topic<0||record.topic>4||(window.IyabContent?!window.IyabContent.selection(record.region,record.era,record.topic).length:record.region!==0)){unavailableJourney(record,'المحتوى المحفوظ غير متاح ضمن هذه الرحلة حاليًا. يمكنك اختيار محتوى متاح أو تغيير الرحلة.');return;}
 const saved=record.snapshot||{};
 if(saved.contentId&&window.IyabContent){const content=window.IyabContent.get(saved.contentId);const api=window.IyabContent;if(!content||content.region!==api.regionIds[record.region]||content.period!==api.periodIds[record.era]||content.topic!==api.topicIds[record.topic]){unavailableJourney(record,'المحتوى المحفوظ غير متاح ضمن هذه الرحلة حاليًا. يمكنك اختيار محتوى متاح أو تغيير الرحلة.');return;}}
 if(record.topic===1&&saved.lastGarment!=null&&(!Number.isInteger(saved.lastGarment)||!closetData[record.era]?.items[saved.lastGarment])){unavailableJourney(record,'قطعة الملابس المحفوظة لم تعد متاحة. هذه الأبواب المتاحة ضمن المنطقة والحقبة المحفوظتين.');return;}
 state={...state,region:record.region,era:record.era,eraChosen:true,topic:record.topic,page:'categories',lastGarment:null,transportV2:saved.transportV2||null};
 reached=state.era;arrived();selectTopic(record.topic);
 if(record.topic===1&&Number.isInteger(saved.lastGarment)&&saved.lastGarment>=0&&saved.lastGarment<4){activeGarment=saved.lastGarment;renderLetter();}
 if(record.topic===4&&saved.leisure){state.leisure=saved.leisure;renderLeisure();}
 sync();persist();
}
journeySave=mountJourneySave({snapshot:journeySnapshot,restore:restoreJourney,onUnavailable:unavailableJourney});
})();
