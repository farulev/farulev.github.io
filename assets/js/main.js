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

(function(){
  function boot(root){
    var slides=[].slice.call(root.querySelectorAll('picture'));
    if(slides.length<2) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('no-fade');
    var i=0, ms=parseInt(root.getAttribute('data-interval')||'6000',10);
    var timer=null;
    function load(el){
      if(!el) return;
      var imgs=el.querySelectorAll('img');
      for(var k=0;k<imgs.length;k++){
        imgs[k].loading='eager';
        if(imgs[k].decode) imgs[k].decode().catch(function(){});
      }
    }
    slides.forEach(load);
    function go(){
      var n=(i+1)%slides.length;
      slides[i].classList.remove('on');
      slides[n].classList.add('on');
      i=n;
      load(slides[(i+1)%slides.length]);
    }
    function stop(){ if(timer){clearInterval(timer);timer=null} }
    function start(){ if(!timer) timer=setInterval(go, ms); }
    document.addEventListener('visibilitychange', function(){
      if(document.hidden) stop(); else start();
    });
    // Pause only when the block is off-screen; never wait on IO to start
    // (a late or false-negative observer would freeze the first slide).
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        var on=entries[0].isIntersecting && !document.hidden;
        if(on) start(); else stop();
      }, {threshold:0.01});
      io.observe(root);
    }
    if(!document.hidden) start();
  }
  var roots=document.querySelectorAll('.hero-slides, .about-slides');
  for(var r=0;r<roots.length;r++) boot(roots[r]);
})();

(function(){
  var dataEl=document.getElementById('shop-data');
  if(!dataEl) return;
  var cfg;
  try{ cfg=JSON.parse(dataEl.textContent); }catch(e){ return; }
  var byId={};
  (cfg.products||[]).forEach(function(p){ byId[p.id]=p; });
  var chosen={};
  (cfg.products||[]).forEach(function(p){
    if(p.sizes&&p.sizes.length) chosen[p.id]=p.sizes.indexOf('M')>=0?'M':p.sizes[0];
  });

  function orderHref(p, sz){
    var txt=(cfg.order_prefix||'Order: ')+p.name+(sz?' ('+sz+')':'')+' - '+p.price_fmt;
    if(cfg.china){
      return 'mailto:'+cfg.email+'?subject='+encodeURIComponent(txt)+'&body='+encodeURIComponent(txt+'\n');
    }
    return cfg.tg_base+'?text='+encodeURIComponent(txt);
  }

  function syncCard(id){
    var p=byId[id];
    if(!p) return;
    var sz=chosen[id]||'';
    document.querySelectorAll('.product[data-pid="'+id+'"]').forEach(function(card){
      card.querySelectorAll('.sz').forEach(function(b){
        var on=b.dataset.size===sz;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on?'true':'false');
      });
      var tg=card.querySelector('.tg-order');
      if(tg) tg.href=orderHref(p, sz);
    });
  }

  document.addEventListener('click', function(e){
    var szBtn=e.target.closest('.sz');
    if(szBtn){
      var host=szBtn.closest('[data-pid]');
      if(host){
        var id=host.dataset.pid;
        chosen[id]=szBtn.dataset.size;
        syncCard(id);
        if(modal&&modal.classList.contains('on')&&modal.dataset.pid===id) renderModalSizes(id);
      }
      return;
    }
    var tab=e.target.closest('.stab');
    if(tab){
      var cat=tab.dataset.cat;
      document.querySelectorAll('.stab').forEach(function(x){
        var on=x===tab;
        x.classList.toggle('on', on);
        x.setAttribute('aria-selected', on?'true':'false');
      });
      document.querySelectorAll('.shop-grid .product').forEach(function(card){
        var show=(cat==='all'||card.dataset.cat===cat);
        card.hidden=!show;
      });
      return;
    }
    var openEl=e.target.closest('.p-open');
    if(openEl){
      var card=openEl.closest('.product');
      if(card) openModal(card.dataset.pid);
    }
  });

  // Product modal
  var modal=document.querySelector('.pmodal');
  if(!modal) return;
  var mImg=modal.querySelector('.pm-main img');
  var mThumbs=modal.querySelector('.pm-thumbs');
  var mKicker=modal.querySelector('.pm-k');
  var mTitle=modal.querySelector('.pm-title');
  var mPrice=modal.querySelector('.pm-price');
  var mColor=modal.querySelector('.pm-color');
  var mDesc=modal.querySelector('.pm-desc');
  var mSzWrap=modal.querySelector('.pm-sz-wrap');
  var mSzList=modal.querySelector('.pm-sizes');
  var mBuy=modal.querySelector('.pm-buy');
  var mTg=modal.querySelector('.pm-tg');
  var mNote=modal.querySelector('.pm-note');

  function renderModalSizes(id){
    var p=byId[id];
    if(!p) return;
    var sz=chosen[id]||'';
    if(!p.sizes||!p.sizes.length){
      mSzWrap.hidden=true;
      mSzList.innerHTML='';
    } else {
      mSzWrap.hidden=false;
      mSzList.innerHTML='';
      p.sizes.forEach(function(s){
        var b=document.createElement('button');
        b.type='button';
        b.className='sz'+(s===sz?' on':'');
        b.dataset.size=s;
        b.setAttribute('role','radio');
        b.setAttribute('aria-checked',s===sz?'true':'false');
        b.textContent=s;
        mSzList.appendChild(b);
      });
    }
    if(mTg&&!mTg.hidden) mTg.href=orderHref(p, sz);
  }

  function openModal(id){
    var p=byId[id];
    if(!p) return;
    modal.dataset.pid=id;
    var gal=(p.gallery&&p.gallery.length)?p.gallery:[p.img];
    mImg.src=gal[0];
    mImg.alt=p.alt||p.name;
    mThumbs.innerHTML='';
    if(gal.length>1){
      mThumbs.hidden=false;
      gal.forEach(function(src,idx){
        var tb=document.createElement('button');
        tb.type='button';
        tb.className='pm-th'+(idx===0?' on':'');
        tb.setAttribute('aria-label',(p.name||'')+' '+(idx+1));
        var im=document.createElement('img');
        im.src=src; im.alt='';
        tb.appendChild(im);
        tb.addEventListener('click',function(){
          mImg.src=src;
          mThumbs.querySelectorAll('.pm-th').forEach(function(x){x.classList.toggle('on',x===tb)});
        });
        mThumbs.appendChild(tb);
      });
    } else {
      mThumbs.hidden=true;
    }
    mKicker.textContent=p.badge||cfg.kicker||'FARULEV';
    mTitle.textContent=p.name;
    mPrice.textContent=p.price_fmt;
    mColor.textContent=p.color||'';
    mColor.hidden=!p.color;
    mDesc.textContent=p.desc;
    if(p.buy_url){
      mBuy.hidden=false;
      mBuy.href=p.buy_url;
      mBuy.textContent=cfg.buy_label;
      mTg.className='btn xs tg-btn tg-order pm-tg';
      mTg.textContent=cfg.tg_label;
    } else {
      mBuy.hidden=true;
      mTg.className='btn acc xs tg-order pm-tg';
      mTg.textContent=cfg.tg_label;
    }
    mNote.textContent=p.digital?(cfg.digital_note||''):(p.made_to_order?(cfg.mto_note||''):(cfg.delivery_note||''));
    renderModalSizes(id);
    modal.classList.add('on');
    document.body.style.overflow='hidden';
  }

  function closeModal(){
    modal.classList.remove('on');
    document.body.style.overflow='';
  }

  modal.querySelector('.pm-close').addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'&&modal.classList.contains('on')) closeModal(); });
})();
