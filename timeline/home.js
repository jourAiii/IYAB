(() => {
 const root=document.getElementById('iyab-map'), $=id=>root.querySelector('#'+id);
 const vehicles=['assets/timeline-camel.webp','assets/timeline-shaas.svg','assets/timeline-gmc.svg','assets/timeline-metro.svg'];
 const eras=[
  {id:'camel',title:'الجمل',description:'بداية الرحلة على دروب القوافل؛ وسيلة بطيئة تمنحنا وقتًا لملاحظة المكان والحكايات.'},
  {id:'shas',title:'الشاص',description:'ننتقل إلى طريق صحراوي أطول؛ الشاص يحمل المسافر والمؤن بين القرى والمحطات.'},
  {id:'gmc',title:'الجمس',description:'تتسع الرحلة مع الجمس، وتصبح المدن والأسواق أقرب في يوم واحد.'},
  {id:'metro',title:'المترو',description:'اليوم نصل بسرعة داخل المدينة؛ تبقى الحكاية في الوجهة التي نختار استكشافها.'}
 ];
 const stations=[...root.querySelectorAll('.station')],runner=$('iyab-runner'),progress=$('iyab-progress'),trail=$('iyab-trail-layer');
 let reached=0,moving=false;
 const left=i=>(87.5-i*25)+'%',pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 stations.forEach((button,i)=>{button.querySelector('img').src=vehicles[i];button.addEventListener('click',()=>travel(i));});
 function arrived(){
  stations.forEach((button,i)=>{button.querySelector('.vehicle').classList.toggle('visible',i===reached);button.classList.toggle('active',i===reached);button.setAttribute('aria-pressed',String(i===reached));});
  $('iyab-arrival-title').textContent=eras[reached].title;$('iyab-arrival-description').textContent=eras[reached].description;$('iyab-arrival-image').src=vehicles[reached];progress.style.width=(reached/3*75)+'%';
  $('open-timeline').href='../timeline.html?era='+reached;
 }
 function startTrail(step,reduced){
  if(reduced||step>2)return()=>{};
  let n=0;const timer=setInterval(()=>{const r=runner.getBoundingClientRect(),t=$('iyab-timeline').getBoundingClientRect(),mark=document.createElement('span');mark.className='trail-mark '+(step===0?'footprint':step===1?'smoke smoke-black':'smoke smoke-white');mark.style.left=(r.left-t.left+r.width*(step===0?.82:.96))+'px';mark.style.top=(step===0?35+n%2*6:20+n%3*2)+'px';trail.append(mark);n++;setTimeout(()=>mark.remove(),1100);},step===0?155:130);return()=>clearInterval(timer);
 }
 async function travel(target){
  if(moving)return;moving=true;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(target<reached){reached=0;arrived();}
  for(let step=reached;step<target;step++){
   stations[step].querySelector('.vehicle').classList.remove('visible');runner.className='runner '+eras[step].id;runner.querySelector('img').src=vehicles[step];runner.style.left=left(step);void runner.offsetWidth;runner.classList.add('moving');
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{runner.style.left=left(step+1);resolve();})));
   const stop=startTrail(step,reduced);await pause(reduced?0:1350);stop();runner.classList.add('exiting');reached=step+1;stations[reached].querySelector('.vehicle').classList.add('visible');progress.style.width=(reached/3*75)+'%';await pause(reduced?0:280);runner.className='runner';
  }
  reached=target;arrived();moving=false;
 }
 arrived();
})();
