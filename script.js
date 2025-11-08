document.addEventListener('DOMContentLoaded', () => {
  // Service Worker registration for PWA support (GitHub Pages)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Mobile detection and optimizations
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Add mobile class to body for mobile-specific styles
    document.body.classList.add('mobile-device');

    // Optimize video playback for mobile
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // Set mobile-optimized video attributes
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true; // Ensure autoplay works on mobile
    });
  }

  // Loading screen with optimized timing
  setTimeout(() => {
    const load = document.getElementById('loading-screen');
    if (load) {
      load.style.opacity = 0;
      load.setAttribute('aria-hidden', 'true');
      setTimeout(() => load.remove(), 700);
    }
  }, 800);

  // Social media collapsible functionality - Enhanced
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

  // GSAP animations with mobile optimizations
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Mobile-friendly animations (reduced complexity for mobile)
    if (isMobile) {
      gsap.from('.card', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.services',
          start: 'top 85%'
        }
      });
    } else {
      // Desktop parallax
      gsap.to('#headerVideo', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.header-video',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      gsap.to('#heroVideo', {
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top 80%',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      gsap.from('.card', {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.services',
          start: 'top 80%'
        }
      });
    }
  }

  // Enhanced IntersectionObserver for video performance
  const vids = document.querySelectorAll('video');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, {
    threshold: isMobile ? 0.5 : 0.3, // Higher threshold on mobile for better performance
    rootMargin: '50px' // Start loading videos 50px before they come into view
  });
  vids.forEach(v => io.observe(v));

  // Enhanced video optimization
  document.querySelectorAll('video').forEach(v => {
    v.style.filter = 'none';
    // Add mobile-specific video loading
    if (isMobile) {
      v.preload = 'metadata'; // Reduce mobile data usage
    }
  });

  // Mobile-specific touch improvements
  if (isMobile) {
    // Improve touch responsiveness
    document.body.style.webkitTapHighlightColor = 'transparent';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';

    // Add touch event listeners for better mobile interaction
    const buttons = document.querySelectorAll('.btn, .chat-btn, .social-toggle');
    buttons.forEach(button => {
      button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });

      button.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
  }

  // Accessibility: keyboard focus detection
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
  });

  // GitHub Pages specific optimizations
  if (window.location.hostname.includes('github.io')) {
    console.log('Running on GitHub Pages - optimizations applied');
    // Add any GitHub Pages specific code here if needed
  }
});

// ========================================
// 2025 MODERN VISUAL EFFECTS - OPTIMIZED JAVASCRIPT
// ========================================

// Performance optimization and mobile detection
const isMobile = window.innerWidth <= 600;
const isTablet = window.innerWidth <= 900 && window.innerWidth > 600;
const isGitHubPages = window.location.hostname.includes('github.io');

// Scroll Reveal Animation System - Optimized
function initScrollReveal() {
  const elements = document.querySelectorAll('.hero, .services, .card, .contact, .footer, .header-inner');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for sequential animations
        const delay = isMobile ? index * 50 : index * 100;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        // Enhanced reveal effects
        if (entry.target.classList.contains('card')) {
          entry.target.style.transform = 'translateY(0) scale(1)';
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
  });

  // Initially hide elements and add scroll-reveal class
  elements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// Parallax Effects - Optimized for performance
function initParallax() {
  if (isMobile) return; // Disable parallax on mobile for performance

  let ticking = false;
  const parallaxElements = document.querySelectorAll('.header-bg-video, .hero-video, .footer-bg');

  function updateParallax() {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((element, index) => {
      const speed = index * 0.3 + 0.2; // Different speeds for depth effect
      const yPos = -(scrolled * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestParallaxUpdate);
}

// Typing Effect for Titles - Optimized
function initTypingEffect() {
  const titles = document.querySelectorAll('.brand-title, .hero-copy h2, .services h3, .contact h3');

  titles.forEach(title => {
    if (isMobile) return; // Skip on mobile for performance

    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--accent)';
    title.style.animation = 'blink 1s infinite';

    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, isTablet ? 75 : 50);
      } else {
        setTimeout(() => {
          title.style.borderRight = 'none';
          title.style.animation = 'none';
        }, 1000);
      }
    }

    // Start typing effect when element comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeWriter, 500);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(title);
  });
}

// Mouse Following Light Effect - Desktop only
function initMouseLight() {
  if (isMobile || isTablet) return; // Skip on mobile/tablet for performance

  let mouseLight = null;

  function createMouseLight() {
    mouseLight = document.createElement('div');
    mouseLight.className = 'mouse-light';
    mouseLight.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0,255,255,0.08) 0%, rgba(163,102,255,0.04) 50%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      mix-blend-mode: screen;
      transition: transform 0.1s ease-out;
      filter: blur(20px);
    `;
    document.body.appendChild(mouseLight);
  }

  createMouseLight();

  document.addEventListener('mousemove', (e) => {
    if (mouseLight) {
      mouseLight.style.left = e.clientX - 150 + 'px';
      mouseLight.style.top = e.clientY - 150 + 'px';

      // Add trailing effect
      mouseLight.style.transform = `scale(1.1)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (mouseLight) {
      mouseLight.style.opacity = '0';
    }
  });

  document.addEventListener('mouseenter', () => {
    if (mouseLight) {
      mouseLight.style.opacity = '1';
    }
  });
}

// Enhanced Button Interactions with Neón Effects - Optimized
function initButtonEffects() {
  const buttons = document.querySelectorAll('.btn, .chat-btn, .social-toggle, .social');

  buttons.forEach(button => {
    // Add neón glow on hover
    button.addEventListener('mouseenter', function() {
      if (isMobile) return;

      this.style.filter = 'brightness(1.2) saturate(1.3)';
      this.style.boxShadow = `var(--neon-glow), 0 0 30px rgba(0,255,255,0.3)`;

      // Add pulsing effect
      this.style.animation = 'buttonPulse 0.6s ease-in-out';
    });

    button.addEventListener('mouseleave', function() {
      if (isMobile) return;

      this.style.filter = 'brightness(1)';
      this.style.boxShadow = '';
      this.style.animation = '';
    });

    // Add ripple effect on click
    button.addEventListener('click', function(e) {
      if (isMobile) return; // Skip ripple on mobile

      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for button pulse animation
  if (!document.querySelector('#button-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'button-pulse-style';
    style.textContent = `
      @keyframes buttonPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// 3D Tilt Effect for Cards and Buttons - Desktop only
function initTiltEffect() {
  const elements = document.querySelectorAll('.card, .header-inner');

  elements.forEach(element => {
    if (isMobile || isTablet) return; // Skip on mobile/tablet

    element.style.transformStyle = 'preserve-3d';

    element.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;

      // Add dynamic lighting
      this.style.boxShadow = `
        ${-rotateY/2}px ${rotateX/2}px 30px rgba(0,0,0,0.3),
        ${-rotateY}px ${rotateX}px 50px rgba(0,255,255,0.1)
      `;
    });

    element.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      this.style.boxShadow = '';
    });
  });
}

// Floating Animation for UI Elements - Optimized
function initFloatingAnimation() {
  const floatingElements = document.querySelectorAll('.social-toggle, .chat-btn, .social-legend');

  floatingElements.forEach((element, index) => {
    if (isMobile) return; // Skip on mobile

    const randomDelay = Math.random() * 2;
    const randomDuration = 3 + Math.random() * 2;
    const randomDirection = Math.random() > 0.5 ? 1 : -1;

    element.style.animation = `floatingElement ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate`;
    element.style.transformOrigin = 'center center';
  });

  // Add CSS for floating animation if not exists
  if (!document.querySelector('#floating-animation-style')) {
    const style = document.createElement('style');
    style.id = 'floating-animation-style';
    style.textContent = `
      @keyframes floatingElement {
        0% {
          transform: translateY(0px) rotate(0deg);
        }
        33% {
          transform: translateY(-8px) rotate(1deg);
        }
        66% {
          transform: translateY(4px) rotate(-1deg);
        }
        100% {
          transform: translateY(0px) rotate(0deg);
        }
      }

      @keyframes blink {
        0%, 50% { border-color: var(--accent); }
        51%, 100% { border-color: transparent; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Enhanced Loading Screen Effects - Optimized
function initLoadingEffects() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  // Add particle effect to loading screen
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
  `;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  loadingScreen.appendChild(canvas);

  const particles = [];
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 3 + 1
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'var(--accent)';

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Footer Entrance Effects - Optimized
function initFooterEffects() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add light sweep effect
        const lightSweep = document.createElement('div');
        lightSweep.style.cssText = `
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(0,255,255,0.2) 50%,
            transparent 100%);
          animation: footerLightSweep 2s ease-out;
          pointer-events: none;
        `;

        entry.target.style.position = 'relative';
        entry.target.appendChild(lightSweep);

        setTimeout(() => {
          lightSweep.remove();
        }, 2000);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(footer);

  // Add CSS for footer light sweep
  if (!document.querySelector('#footer-effects-style')) {
    const style = document.createElement('style');
    style.id = 'footer-effects-style';
    style.textContent = `
      @keyframes footerLightSweep {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Glassmorphism Enhancement - Optimized
function initGlassmorphism() {
  const glassElements = document.querySelectorAll('.header-inner, .footer-glass, .social-dropdown');

  glassElements.forEach(element => {
    // Add dynamic glass effect based on scroll position
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      element.style.background = `linear-gradient(135deg,
        rgba(255,255,255,${0.08 + scrolled * 0.0001}) 0%,
        rgba(255,255,255,${0.03 + scrolled * 0.00005}) 50%,
        rgba(255,255,255,${0.01 + scrolled * 0.00002}) 100%)`;
    });
  });
}

// Performance monitoring and optimization
function optimizePerformance() {
  // Reduce animation complexity on low-end devices
  if (isMobile) {
    // Disable complex effects on mobile
    document.body.classList.add('mobile-optimized');

    // Simplify animations
    const style = document.createElement('style');
    style.textContent = `
      .mobile-optimized * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
      }

      .mobile-optimized .brand-title {
        animation: none !important;
      }

      .mobile-optimized .card {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Enable hardware acceleration
  const animatedElements = document.querySelectorAll('.btn, .card, .social-toggle, .chat-btn');
  animatedElements.forEach(el => {
    el.style.willChange = 'transform';
    el.style.transform = 'translateZ(0)';
  });
}

// GitHub Pages specific optimizations
function initGitHubPagesOptimizations() {
  if (isGitHubPages) {
    console.log('🚀 GitHub Pages detected - Applying 2025 visual effects optimizations');

    // Add performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`📊 Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
      });
    }

    // Optimize for GitHub Pages hosting
    const style = document.createElement('style');
    style.textContent = `
      /* GitHub Pages specific optimizations */
      .github-pages-optimized {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('github-pages-optimized');
  }
}

// Initialize all 2025 effects - Optimized loading
function init2025Effects() {
  console.log('✨ Initializing 2025 Modern Visual Effects...');

  initScrollReveal();
  initParallax();
  initTypingEffect();
  initMouseLight();
  initButtonEffects();
  initTiltEffect();
  initFloatingAnimation();
  initLoadingEffects();
  initFooterEffects();
  initGlassmorphism();
  optimizePerformance();
  initGitHubPagesOptimizations();

  // Add particle effect only on high-end devices
  if (!isMobile && !isTablet) {
    setTimeout(() => {
      // Could add particle background here if needed
      console.log('🎭 All 2025 visual effects initialized successfully');
    }, 2000);
  }
}

// Main DOMContentLoaded event - Optimized
document.addEventListener('DOMContentLoaded', () => {
  // Loading screen
  setTimeout(() => {
    const load = document.getElementById('loading-screen');
    if (load) {
      load.style.opacity = 0;
      load.setAttribute('aria-hidden', 'true');
      setTimeout(() => load.remove(), 700);
    }
  }, 800);

  // Initialize all 2025 effects
  init2025Effects();

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

  // GSAP animations with 2025 enhancements
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Enhanced hero animations
    gsap.from('.header-inner', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.header-video',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Parallax and other animations
    if (!isMobile) {
      gsap.to('#headerVideo', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.header-video',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      gsap.to('#heroVideo', {
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top 80%',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    // Enhanced services cards animation
    gsap.from('.card', {
      y: 50,
      opacity: 0,
      scale: 0.9,
      stagger: isMobile ? 0.05 : 0.15,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.services',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });

    // Latest Projects section animations
    gsap.from('.latest-projects-header', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.latest-projects',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from('.latest-project-card', {
      y: 50,
      opacity: 0,
      scale: 0.9,
      stagger: isMobile ? 0.1 : 0.2,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.latest-projects-grid',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  // Enhanced video optimization
  const vids = document.querySelectorAll('video');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, {
    threshold: isMobile ? 0.5 : 0.3,
    rootMargin: '50px'
  });
  vids.forEach(v => io.observe(v));

  // Ensure videos are visible without overlays
  document.querySelectorAll('video').forEach(v => {
    v.style.filter = 'none';
    v.style.willChange = 'transform';
  });

  // Enhanced accessibility
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('show-focus');
    }
  });

  // Performance monitoring
  if (isGitHubPages) {
    console.log('✅ All systems ready - 2025 Visual Effects active');
  }
});

// Error handling for GitHub Pages
window.addEventListener('error', (e) => {
  if (isGitHubPages) {
    console.warn('⚠️ GitHub Pages environment detected - Some effects may be limited');
  }
});