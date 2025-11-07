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

  // Social bar toggle functionality
  const socialToggle = document.getElementById('socialToggle');
  if (socialToggle) {
    socialToggle.addEventListener('click', () => {
      socialBar.classList.toggle('collapsed');
    });
  }

  // Social bar adaptiveness to prevent overlap:
  function adaptSocial(){
    // Hide the social links on mobile to save space, show only toggle button
    if (window.innerWidth < 768) {
      socialBar.classList.add('collapsed');
    } else {
      // On desktop, keep expanded by default
      socialBar.classList.remove('collapsed');
    }
  }
  adaptSocial();
  window.addEventListener('resize', adaptSocial);

  // Ensure videos are visible without overlays (force CSS safety)
  document.querySelectorAll('video').forEach(v => { v.style.filter = 'none'; });

  // Accessibility: keyboard focus detection
  document.body.addEventListener('keyup', (e) => { if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
});