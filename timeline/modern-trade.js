/* Approved first concept: glass line board. All curves are illustrative, not quotes. */
function mountIyabModernTrade(target,{preview=false}={}){
 const companies=['أرامكو السعودية','مصرف الراجحي','معادن','الأهلي السعودي','stc'];
 const base=[31,36,33,42,39,48,45,51,47,57,54,64,61,68,63,74,70,78];
 const svgNS='http://www.w3.org/2000/svg';
 let company=4,phase=0,frame=0,destroyed=false;
 const root=document.createElement('div');root.className='iyab-market'+(preview?' is-preview':'');root.dir='rtl';root.setAttribute('aria-live','off');
 const el=(tag,cls,text,parent)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;parent?.appendChild(n);return n;};
 const svgEl=(tag,attrs,parent,text)=>{const n=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;parent.appendChild(n);return n;};
 let chips=null,move=null;
 if(!preview){
  const head=el('div','market-head','',root),heading=el('div','','',head);
  el('span','market-eyebrow','التجارة · العصر الحديث',heading);el('h2','','من الدكّان… إلى سوق المال',heading);
  move=el('button','market-move cursor-interaction','جرّبي الحركة ↗',head);move.type='button';
  chips=el('div','market-companies','',root);chips.setAttribute('aria-label','اختيار الشركة');
 }
 const scene=el('div','market-scene','',root);el('div','market-floor','',scene);
 const glass=el('div','market-glass','',scene),title=el('div','market-board-title','',glass);
 const name=el('span','',companies[company],title);if(!preview)name.setAttribute('aria-live','polite');
 el('small','','مؤشر بصري افتراضي',title);
 const chart=el('div','market-chart','',glass);chart.setAttribute('role','img');chart.setAttribute('aria-label','خط بني تجريبي، لا يمثل أسعار الأسهم أو أداء الشركات الحقيقي');
 const note=el('div','market-note','',root);
 el('span','market-disclaimer','بيانات تجريبية، ليست أسعار أسهم',note);
 if(preview)root.setAttribute('aria-hidden','true');
 target.replaceChildren(root);
 const values=(c,p)=>base.map((v,i)=>Math.max(14,Math.min(88,v+Math.sin(i*.91+c*1.9+p)*7+Math.cos(i*.55+p)*3)));
 function draw(series=values(company,phase)){
  if(destroyed)return;
  const w=Math.max(preview?150:220,Math.round(chart.getBoundingClientRect().width||300));
  const h=Math.max(preview?65:180,Math.round(chart.getBoundingClientRect().height||230));
  chart.replaceChildren();const svg=svgEl('svg',{viewBox:`0 0 ${w} ${h}`},chart);
  const left=preview?7:38,right=preview?7:14,top=preview?8:16,bottom=preview?8:38;
  const x=i=>left+i/(series.length-1)*(w-left-right),y=v=>top+(100-v)/100*(h-top-bottom);
  [20,40,60,80].forEach(v=>{svgEl('line',{x1:left,y1:y(v),x2:w-right,y2:y(v),stroke:'#ad9475','stroke-opacity':'.2','stroke-width':1},svg);if(!preview)svgEl('text',{x:left-8,y:y(v)+4,'text-anchor':'end',fill:'#796851','font-size':11},svg,String(v));});
  if(!preview)svgEl('text',{x:left,y:h-8,fill:'#796851','font-size':11},svg,'مقياس بصري');
  const d=series.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ');
  const id='iyab-market-shade-'+Math.random().toString(36).slice(2),defs=svgEl('defs',{},svg),g=svgEl('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},defs);
  svgEl('stop',{offset:'0%','stop-color':'#805333','stop-opacity':'.18'},g);svgEl('stop',{offset:'100%','stop-color':'#805333','stop-opacity':'0'},g);
  svgEl('path',{d:d+`L${x(series.length-1)} ${h-bottom}L${left} ${h-bottom}Z`,fill:`url(#${id})`},svg);
  svgEl('path',{d,fill:'none',stroke:'#805333','stroke-width':preview?2:2.7,'stroke-linecap':'round','stroke-linejoin':'round'},svg);
  svgEl('circle',{cx:x(series.length-1),cy:y(series.at(-1)),r:preview?3:4,fill:'#805333'},svg);
 }
 function select(nextCompany,nextPhase){
  cancelAnimationFrame(frame);const from=values(company,phase),to=values(nextCompany,nextPhase);company=nextCompany;phase=nextPhase;name.textContent=companies[company];
  chips.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===company)));
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){draw(to);return;}
  const start=performance.now();function step(t){if(destroyed)return;const p=Math.min(1,(t-start)/650),ease=p*p*(3-2*p);draw(from.map((v,i)=>v+(to[i]-v)*ease));if(p<1)frame=requestAnimationFrame(step);}frame=requestAnimationFrame(step);
 }
 if(chips){companies.forEach((c,i)=>{const b=el('button','cursor-interaction',c,chips);b.type='button';b.setAttribute('aria-pressed',String(i===company));b.onclick=()=>select(i,phase);});move.onclick=()=>select(company,phase+1.4);}
 draw();
 const observer=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(root.isConnected)draw();else observer.disconnect();}):null;
 observer?.observe(chart);
 return {root,destroy(){destroyed=true;cancelAnimationFrame(frame);observer?.disconnect();}};
}
