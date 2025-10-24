document.addEventListener('DOMContentLoaded', ()=> {
  // loading screen
  setTimeout(()=> {
    const load = document.getElementById('loading-screen');
    if(load){ load.style.opacity = 0; load.setAttribute('aria-hidden','true'); setTimeout(()=> load.remove(),700); }
  }, 800);

  // GSAP animations (register safely)
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    // subtle parallax for hero and header videos
    gsap.to('#headerVideo', {yPercent: 8, ease:'none', scrollTrigger:{trigger:'.header-video', start:'top top', end:'bottom top', scrub:0.6}});
    gsap.to('#heroVideo', {scale:1.02, ease:'none', scrollTrigger:{trigger:'.hero', start:'top 80%', end:'bottom top', scrub:0.6}});
    gsap.from('.card', {y:30, opacity:0, stagger:0.12, duration:0.8, scrollTrigger:{trigger:'.services', start:'top 80%'}});
  }

  // IntersectionObserver: pause videos when not visible (saves mobile battery)
  const vids = document.querySelectorAll('video');
  const io = new IntersectionObserver((entries)=> {
    entries.forEach(e=>{
      const v = e.target;
      if(e.isIntersecting){ v.play().catch(()=>{}); } else { v.pause(); }
    });
  }, {threshold: 0.3});
  vids.forEach(v=> io.observe(v));

  // Social bar adaptiveness to prevent overlap:
  const socialBar = document.getElementById('socialBar');
  function adaptSocial(){
    const items = socialBar.querySelectorAll('.social').length;
    const requiredHeight = items * 48; // approx per item
    if(window.innerHeight < requiredHeight + 120){ // if not enough vertical space
      socialBar.style.flexDirection = 'row';
      socialBar.style.right = '50%';
      socialBar.style.transform = 'translateX(50%)';
      socialBar.style.bottom = '12px';
      socialBar.style.gap = '8px';
    } else {
      socialBar.style.flexDirection = 'column';
      socialBar.style.right = '18px';
      socialBar.style.transform = '';
      socialBar.style.bottom = '18px';
      socialBar.style.gap = '10px';
    }
  }
  adaptSocial();
  window.addEventListener('resize', adaptSocial);

  // Ensure videos are visible without overlays (force CSS safety)
  document.querySelectorAll('video').forEach(v => { v.style.filter = 'none'; });

  // Accessibility: keyboard focus detection
  document.body.addEventListener('keyup', (e) => { if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
});