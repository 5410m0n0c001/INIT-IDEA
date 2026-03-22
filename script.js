/**
 * INIT IDEA - Core Script 2025
 * Consolidated and optimized for mobile performance.
 */

// 1. Global constants and mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isTablet = !isMobile && (window.innerWidth <= 1024);
const isGitHubPages = window.location.hostname.includes('github.io');

// 2. Initialization functions
function startLoadingScreen() {
  const splashScreen = document.getElementById('splash-screen');
  const load = document.getElementById('loading-screen');

  const removeLoading = () => {
    if (load) {
      load.style.opacity = 0;
      load.setAttribute('aria-hidden', 'true');
      setTimeout(() => load.remove(), 700);
    }
  };

  if (splashScreen) {
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      setTimeout(() => {
        splashScreen.remove();
        setTimeout(removeLoading, 500);
      }, 800);
    }, 1800);
  } else {
    setTimeout(removeLoading, 800);
  }
}

// Scroll Reveal Animation System
function initScrollReveal() {
  const elements = document.querySelectorAll('.hero, .services, .contact, .footer, .header-inner, .latest-project-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = isMobile ? index * 50 : index * 100;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
  });

  elements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// Typing Effect for Titles
function initTypingEffect() {
  if (isMobile) return; 
  const titles = document.querySelectorAll('.brand-title, .hero-copy h2, .services h3, .contact h3');

  titles.forEach(title => {
    const langSpanEs = title.querySelector('.lang-es');
    const langSpanEn = title.querySelector('.lang-en');
    
    let targetElement = title;
    let textToType = title.textContent;

    if (langSpanEs && langSpanEn) {
      const isEs = document.body.classList.contains('lang-es');
      targetElement = isEs ? langSpanEs : langSpanEn;
      textToType = targetElement.textContent;
      langSpanEs.textContent = isEs ? '' : langSpanEs.textContent;
      langSpanEn.textContent = !isEs ? '' : langSpanEn.textContent;
    } else {
      title.textContent = '';
    }

    title.style.borderRight = '2px solid var(--accent)';
    title.style.animation = 'blink 1s infinite';

    let i = 0;
    function typeWriter() {
      if (i < textToType.length) {
        targetElement.textContent += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, isTablet ? 75 : 50);
      } else {
        setTimeout(() => {
          title.style.borderRight = 'none';
          title.style.animation = 'none';
        }, 1000);
      }
    }

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

// Video optimizations
function initVideoOptimizations() {
  const vids = document.querySelectorAll('video');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (v.id === 'footerVideo') return;
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

  // Detect if device is low-end or struggling (Lite Mode)
  const isLiteMode = isMobile && (navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 4);
  
  vids.forEach(v => {
    // If Lite Mode, only allow header video to play
    if (isLiteMode && v.id !== 'headerVideo' && v.id !== 'footerVideo') {
      v.autoplay = false;
      v.preload = 'none';
      return;
    }

    io.observe(v);
    v.style.filter = 'none';
    if (isMobile) v.preload = 'metadata';
    v.setAttribute('playsinline', 'true');
    v.setAttribute('webkit-playsinline', 'true');
    if (v.id !== 'footerVideo') v.muted = true;

    // Error handling to prevent repetitive play attempts
    v.addEventListener('error', () => {
      console.log('Video error on:', v.src);
      v.style.display = 'none'; // Hide broken videos to save layout
    });
  });
}

// 2025 effects initialization
function init2025Effects() {
  initScrollReveal();
  initTypingEffect();
  initVideoOptimizations();
  if (isGitHubPages) console.log('🚀 Visual effects initialized');
}


// ========================================
// 2025 MODERN VISUAL EFFECTS - OPTIMIZED JAVASCRIPT
// ========================================

// 3. Main DOMContentLoaded entry point
document.addEventListener('DOMContentLoaded', () => {
  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW failed:', err));
    });
  }

  // Body classes
  if (isMobile) document.body.classList.add('mobile-device');
  document.body.classList.add('lang-es');

  // Initialization
  startLoadingScreen();
  init2025Effects();

  // Social Toggle
  const socialToggle = document.getElementById('socialToggle');
  const socialDropdown = document.getElementById('socialDropdown');
  const socialContainer = document.getElementById('socialContainer');

  if (socialToggle && socialDropdown && socialContainer) {
    socialToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = socialDropdown.classList.toggle('open');
      socialToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!socialContainer.contains(e.target)) {
        socialDropdown.classList.remove('open');
        socialToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Share Button
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'INIT IDEA | Estudio Digital',
        text: 'Te comparto el trabajo de INIT IDEA...',
        url: 'https://5410m0n0c001.github.io/INIT-IDEA/'
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          alert('Copiado al portapapeles');
        } catch (e) {}
      }
    });
  }

  // Language Toggle
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const isEs = document.body.classList.contains('lang-es');
      document.body.classList.toggle('lang-es', !isEs);
      document.body.classList.toggle('lang-en', isEs);
    });
  }
});

// Global error handling fallback
window.addEventListener('load', () => {
  setTimeout(() => {
    const load = document.getElementById('loading-screen');
    if (load) load.style.display = 'none';
  }, 5000);
});