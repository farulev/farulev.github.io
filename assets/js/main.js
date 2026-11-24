(function(){
  var top=document.querySelector('.top'),nav=document.getElementById('nav'),bg=document.querySelector('.burger');
  function s(){top.classList.toggle('solid',window.scrollY>40||nav.classList.contains('open'))}
  window.addEventListener('scroll',s,{passive:true});s();
  bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o);s()});
  nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');bg.setAttribute('aria-expanded',false);s()}});
  // YouTube facade (privacy-enhanced, loads only on click)
  document.querySelectorAll('.yt').forEach(function(b){
    b.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src=b.dataset.rt?'https://rutube.ru/play/embed/'+b.dataset.rt+'?autoplay=1':'https://www.youtube-nocookie.com/embed/'+b.dataset.id+'?autoplay=1&rel=0';
      f.title=b.getAttribute('aria-label')||'YouTube video';
      f.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen=true;b.innerHTML='';b.appendChild(f);b.style.cursor='default';
    },{once:true});
  });
  // Self-hosted videos: only one plays at a time
  document.querySelectorAll('.sv').forEach(function(w){var v=w.querySelector('video'),b=w.querySelector('.svp');v.controls=false;
    b.addEventListener('click',function(){w.classList.add('on');v.controls=true;v.play()});v.addEventListener('play',function(){w.classList.add('on');v.controls=true})});
  var vs=document.querySelectorAll('.sv video');vs.forEach(function(v){v.addEventListener('play',function(){vs.forEach(function(o){if(o!==v)o.pause()})})});
  // Video tabs
  document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
    document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('on',p.dataset.panel===b.dataset.tab);if(p.dataset.panel!==b.dataset.tab)p.querySelectorAll('video').forEach(function(v){v.pause()})});
  })});
  // Gallery: show more
  var mp=document.querySelector('.more-ph'),gl=document.querySelector('.gal');
  if(mp&&gl){mp.addEventListener('click',function(){gl.classList.add('all');mp.remove()})}
  // Lightbox
  var links=[].slice.call(document.querySelectorAll('.gal a')),lb=document.querySelector('.lb');
  if(!lb||!links.length)return;
  var img=lb.querySelector('img'),i=0;
  function vis(){return links.filter(function(a){return a.offsetParent!==null})}
  function show(n){var v=vis();i=(n+v.length)%v.length;img.src=v[i].href;img.alt=v[i].querySelector('img').alt;lb.classList.add('on')}
  links.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();show(vis().indexOf(a))})});
  lb.querySelector('.x').onclick=function(){lb.classList.remove('on')};
  lb.querySelector('.pv').onclick=function(e){e.stopPropagation();show(i-1)};
  lb.querySelector('.nx').onclick=function(e){e.stopPropagation();show(i+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('on')});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
})();
