document.addEventListener('DOMContentLoaded', ()=> {
  // ===== AOS INITIALIZATION =====
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 0
    });
  }

  // ===== ENHANCED GSAP ANIMATIONS =====
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    
    // Enhanced parallax for hero and header videos
    gsap.to('#headerVideo', {
      yPercent: 8,
      ease:'none',
      scrollTrigger:{
        trigger:'.header-video',
        start:'top top',
        end:'bottom top',
        scrub:0.6
      }
    });
    
    gsap.to('#heroVideo', {
      scale:1.02,
      ease:'none',
      scrollTrigger:{
        trigger:'.hero',
        start:'top 80%',
        end:'bottom top',
        scrub:0.6
      }
    });

    // Enhanced service cards animation
    gsap.from('.card', {
      y: 30,
      opacity: 0,
      scale: 0.8,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.1)',
      scrollTrigger: {
        trigger: '.services',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    // Parallax scroll effects
    gsap.utils.toArray('.parallax-element').forEach((element) => {
      gsap.to(element, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  // ===== LOADING SCREEN =====
  setTimeout(()=> {
    const load = document.getElementById('loading-screen');
    if(load){
      load.style.opacity = 0;
      load.setAttribute('aria-hidden','true');
      setTimeout(()=> load.remove(),700);
    }
  }, 1200);

  // ===== MOUSE CURSOR FOLLOWER =====
  const cursor = document.querySelector('.cursor-follower');
  if (cursor) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale cursor on hover
    document.querySelectorAll('a, button, [data-tilt]').forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        cursor.style.opacity = '1';
      });
      element.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        cursor.style.opacity = '0.7';
      });
    });
  }

  // ===== 3D TILT EFFECT =====
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transition = 'none';
    });
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transition = 'transform 0.3s ease';
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // ===== ENHANCED VIDEO MANAGEMENT =====
  const vids = document.querySelectorAll('video');
  const io = new IntersectionObserver((entries)=> {
    entries.forEach(e=>{
      const v = e.target;
      if(e.isIntersecting){
        v.play().catch(()=>{});
      } else {
        v.pause();
      }
    });
  }, {threshold: 0.3});
  vids.forEach(v=> io.observe(v));

  // ===== ENHANCED VIDEO MANAGEMENT FOR PROJECT BUTTONS =====
  const projectVideos = document.querySelectorAll('.video-button');
  
  function initializeVideo(video) {
    // Set essential attributes for reliable playback
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('loop', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('preload', 'auto');
    
    // Function to attempt video playback
    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playing successfully:', video.src);
          })
          .catch(error => {
            console.warn('Autoplay failed, will retry:', video.src, error);
            // Retry after a short delay
            setTimeout(playVideo, 1000);
          });
      }
    };

    // Multiple event listeners for reliable playback
    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);
    
    // Handle video end - restart immediately
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      setTimeout(playVideo, 100);
    });
    
    // Handle video errors with detailed logging
    video.addEventListener('error', (e) => {
      console.error('Video error for:', video.src, e);
      // Try to reload and play again
      setTimeout(() => {
        video.load();
        playVideo();
      }, 2000);
    });
    
    // Try to play immediately
    setTimeout(playVideo, 100);
  }

  // Initialize all project videos
  projectVideos.forEach(initializeVideo);

  // Special handling for c3.mp4 to ensure it works
  const c3Video = document.querySelector('video[src="c3.mp4"]');
  if (c3Video) {
    c3Video.addEventListener('loadstart', () => {
      console.log('c3.mp4 started loading');
    });
    c3Video.addEventListener('canplaythrough', () => {
      console.log('c3.mp4 can play through');
      c3Video.play().catch(e => console.warn('c3.mp4 play failed:', e));
    });
    
    // Force c3.mp4 to reload and play
    setTimeout(() => {
      if (c3Video.paused) {
        console.log('Forcing c3.mp4 to play');
        c3Video.load();
        c3Video.play().catch(e => console.warn('c3.mp4 forced play failed:', e));
      }
    }, 2000);
  }

  // Special handling for c4.mp4
  const c4Video = document.querySelector('video[src="c4.mp4"]');
  if (c4Video) {
    c4Video.addEventListener('loadstart', () => {
      console.log('c4.mp4 started loading');
    });
    c4Video.addEventListener('canplaythrough', () => {
      console.log('c4.mp4 can play through');
      c4Video.play().catch(e => console.warn('c4.mp4 play failed:', e));
    });
    
    setTimeout(() => {
      if (c4Video.paused) {
        console.log('Forcing c4.mp4 to play');
        c4Video.load();
        c4Video.play().catch(e => console.warn('c4.mp4 forced play failed:', e));
      }
    }, 2000);
  }

  // Global function to ensure all videos are playing
  function ensureAllVideosPlaying() {
    projectVideos.forEach(video => {
      if (video.paused && video.readyState >= 2) {
        video.play().catch(() => {});
      }
      // Extra attention to c3.mp4 and c4.mp4
      if ((video.src.includes('c3.mp4') || video.src.includes('c4.mp4')) && video.paused) {
        console.log('Video is paused, attempting to play:', video.src);
        video.play().catch(e => console.warn('Video play error:', e));
      }
    });
  }

  // Check video status periodically
  setInterval(ensureAllVideosPlaying, 3000);

  // User interaction fallback
  ['click', 'scroll', 'touchstart', 'mouseover'].forEach(event => {
    document.addEventListener(event, ensureAllVideosPlaying, { passive: true });
  });

  // ===== SOCIAL BAR FUNCTIONALITY =====
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