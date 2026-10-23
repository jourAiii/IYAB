(()=>{
 const inner=location.pathname.includes('/timeline/'),prefix=inner?'../':'';
 const lang=()=>window.IyabI18n?.language||'ar';
 const siteRoot=new URL(prefix||'./',location.href);
 window.iyabLocalUrl=target=>{const url=new URL(target,location.href);url.searchParams.set('lang',lang());return url.href};
 // Query propagation also works when a browser isolates local-file storage by page.
 document.addEventListener('click',event=>{const anchor=event.target.closest('a[href]');if(!anchor)return;const raw=anchor.getAttribute('href');if(!raw||raw.startsWith('#'))return;const url=new URL(raw,location.href);if(url.origin===siteRoot.origin&&url.pathname.startsWith(siteRoot.pathname)&&/\.html$/.test(url.pathname)){url.searchParams.set('lang',lang());anchor.href=url.href}},true);
 const setupFrame=frame=>{const raw=frame.getAttribute('src');if(!raw||!/^timeline\/|^window-/.test(raw))return;const url=new URL(raw,location.href);url.searchParams.set('lang',lang());if(frame.src!==url.href)frame.src=url.href};
 document.querySelectorAll('[data-timeline-frame],[data-window-frame]').forEach(setupFrame);
 document.querySelectorAll('.search-form').forEach(form=>{
  form.addEventListener('submit',e=>{e.preventDefault();const input=form.querySelector('input');if(!input)return;const word=input.value.trim();if(!word){input.setCustomValidity(lang()==='ar'?'اكتبي كلمة للبحث أولًا.':'Enter a keyword to search.');input.reportValidity();return}const target=new URL(prefix+'content.html',location.href);target.searchParams.set('q',word);target.searchParams.set('lang',lang());if(inner)window.parent.location.href=target.href;else location.href=target.href});
  form.querySelector('input')?.addEventListener('input',e=>e.target.setCustomValidity(''));
 });
 // Keep the existing header unchanged; management is reachable through the account menu.
 document.querySelectorAll('[data-user-menu]').forEach(menu=>{if(menu.querySelector('[data-admin-link]'))return;const link=document.createElement('a');link.href=prefix+'content.html?view=admin';link.dataset.adminLink='';link.textContent='إدارة المحتوى';menu.appendChild(link)});
 const profile=document.querySelector('.profile-content');if(profile&&!profile.querySelector('[data-admin-link]')){const link=document.createElement('a');link.href='content.html?view=admin';link.dataset.adminLink='';link.className='button button-secondary';link.textContent='إدارة المحتوى';profile.appendChild(link)}
 window.addEventListener('iyab:language-change',()=>document.querySelectorAll('.search-form input').forEach(input=>input.setCustomValidity('')));
 const style=document.createElement('style');style.textContent='html[lang="en"] .brand-tagline{letter-spacing:0}html[lang="en"] .main-navigation{min-width:0;gap:clamp(6px,1vw,16px)}html[lang="en"] .main-navigation a{white-space:normal;text-align:start}html[lang="en"] .header-capsule{min-width:0}html[lang="en"] .hero-copy,html[lang="en"] .profile-content{text-align:start}html[lang="en"] .footer-main .project-details{min-width:0}html[lang="en"] .project-details span{white-space:normal}.profile-content>[data-admin-link]{display:inline-block;margin-top:22px}';document.head.appendChild(style);
 window.IyabI18n?.apply();
})();
