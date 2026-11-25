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
  document.querySelectorAll('.sv').forEach(function(w){
    var v=w.querySelector('video'),b=w.querySelector('.svp');
    if(!v) return;
    v.controls=false;
    v.playsInline=true;
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    function start(){w.classList.add('on');v.controls=true;v.play()}
    if(b) b.addEventListener('click',start);
    v.addEventListener('play',function(){w.classList.add('on');v.controls=true});
    v.addEventListener('ended',function(){w.classList.remove('on');v.controls=false;v.currentTime=0});
  });
  var vs=document.querySelectorAll('.sv video');vs.forEach(function(v){v.addEventListener('play',function(){vs.forEach(function(o){if(o!==v)o.pause()})})});
  // Video tabs
  document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
    document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('on',p.dataset.panel===b.dataset.tab);if(p.dataset.panel!==b.dataset.tab)p.querySelectorAll('video').forEach(function(v){v.pause()})});
  })});
  // Gallery: show more
  var mp=document.querySelector('.more-ph'),gl=document.querySelector('.gal');
  if(mp&&gl){mp.addEventListener('click',function(){
    var on=gl.classList.toggle('all');
    mp.setAttribute('aria-expanded',on);
    mp.textContent=on?(mp.dataset.less||mp.textContent):(mp.dataset.more||mp.textContent);
  })}
  // Pause audio when a video starts
  document.querySelectorAll('.sv video').forEach(function(v){v.addEventListener('play',function(){var a=window.__farulevAudio;if(a)a.pause()})});
  // Listen player
  (function(){
    var box=document.querySelector('.player');
    if(!box)return;
    var audio=new Audio();
    window.__farulevAudio=audio;
    audio.preload='metadata';
    var playBtn=box.querySelector('.pplay'), titleEl=box.querySelector('.ptitle'), bar=box.querySelector('.pbar'), cur=box.querySelector('.pcur'), dur=box.querySelector('.pdur');
    var tracks=[].slice.call(document.querySelectorAll('.track'));
    function fmt(t){t=isFinite(t)?t:0;var m=Math.floor(t/60),s=Math.floor(t%60);return m+':'+(s<10?'0':'')+s}
    function load(li,auto){
      tracks.forEach(function(x){x.classList.toggle('on',x===li)});
      audio.src=li.dataset.src;
      if(titleEl) titleEl.textContent=li.dataset.title||'';
      if(auto){document.querySelectorAll('.sv video').forEach(function(v){v.pause()});audio.play()}
    }
    if(playBtn) playBtn.addEventListener('click',function(){if(audio.paused){document.querySelectorAll('.sv video').forEach(function(v){v.pause()});audio.play()}else audio.pause()});
    audio.addEventListener('play',function(){box.classList.add('on');if(playBtn)playBtn.classList.add('on')});
    audio.addEventListener('pause',function(){box.classList.remove('on');if(playBtn)playBtn.classList.remove('on')});
    audio.addEventListener('timeupdate',function(){if(bar&&!bar.matches(':active'))bar.value=audio.duration?Math.round(audio.currentTime/audio.duration*1000):0;if(cur)cur.textContent=fmt(audio.currentTime)});
    audio.addEventListener('loadedmetadata',function(){if(dur)dur.textContent=fmt(audio.duration)});
    audio.addEventListener('ended',function(){var i=tracks.findIndex(function(x){return x.classList.contains('on')});if(i>=0&&i<tracks.length-1)load(tracks[i+1],true)});
    if(bar) bar.addEventListener('input',function(){if(audio.duration)audio.currentTime=bar.value/1000*audio.duration});
    tracks.forEach(function(li){li.addEventListener('click',function(e){if(e.target.closest('.tvid'))return;load(li,true)})});
    if(tracks[0]) load(tracks[0],false);
  })();
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
