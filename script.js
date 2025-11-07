document.addEventListener('DOMContentLoaded', ()=> {
  // loading screen
  setTimeout(()=> {
    const load = document.getElementById('loading-screen');
    if(load){ load.style.opacity = 0; load.setAttribute('aria-hidden','true'); setTimeout(()=> load.remove(),700); }
  }, 800);

  // Social media collapsible functionality
  const socialToggle = document.getElementById('socialToggle');
  const socialDropdown = document.getElementById('socialDropdown');
  
  if (socialToggle && socialDropdown) {
    socialToggle.addEventListener('click', () => {
      const isOpen = socialDropdown.classList.contains('open');
      
      if (isOpen) {
        // Close dropdown
        socialDropdown.classList.remove('open');
        socialToggle.setAttribute('aria-expanded', 'false');
        socialDropdown.setAttribute('aria-hidden', 'true');
      } else {
        // Open dropdown
        socialDropdown.classList.add('open');
        socialToggle.setAttribute('aria-expanded', 'true');
        socialDropdown.setAttribute('aria-hidden', 'false');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const socialContainer = document.getElementById('socialContainer');
      if (!socialContainer.contains(e.target)) {
        socialDropdown.classList.remove('open');
        socialToggle.setAttribute('aria-expanded', 'false');
        socialDropdown.setAttribute('aria-hidden', 'true');
      }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        socialDropdown.classList.remove('open');
        socialToggle.setAttribute('aria-expanded', 'false');
        socialDropdown.setAttribute('aria-hidden', 'true');
        socialToggle.focus();
      }
    });
  }

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

  // Ensure videos are visible without overlays (force CSS safety)
  document.querySelectorAll('video').forEach(v => { v.style.filter = 'none'; });

  // Accessibility: keyboard focus detection
  document.body.addEventListener('keyup', (e) => { if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
});