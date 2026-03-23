/**
 * INIT IDEA - Core Script 2025
 * FIXED: Mobile crash bugs - video memory, SW, scroll, duplicate classes
 */

// 1. Global constants and mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isTablet = !isMobile && (window.innerWidth <= 1024);
const isGitHubPages = window.location.hostname.includes('github.io');

// Detect low-end devices early (used across functions)
const isLiteMode = isMobile || (
  (navigator.deviceMemory !== undefined && navigator.deviceMemory < 4) ||
  (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4)
);

// 2. Loading Screen
function startLoadingScreen() {
  const splashScreen = document.getElementById('splash-screen');
  const load = document.getElementById('loading-screen');

  const removeLoading = () => {
    if (load) {
      load.style.opacity = 0;
      load.setAttribute('aria-hidden', 'true');
      setTimeout(() => { if (load.parentNode) load.remove(); }, 700);
    }
  };

  if (splashScreen) {
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      setTimeout(() => {
        if (splashScreen.parentNode) splashScreen.remove();
        setTimeout(removeLoading, 500);
      }, 800);
    }, 1800);
  } else {
    setTimeout(removeLoading, 800);
  }
}

// 3. Scroll Reveal - lightweight, no GSAP
function initScrollReveal() {
  const elements = document.querySelectorAll('.services, .footer, .header-inner, .latest-project-card');
  
  if (!window.IntersectionObserver) return; // guard for old browsers
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = isMobile ? index * 30 : index * 80;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -80px 0px'
  });

  elements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// 4. Typing Effect (desktop only - skip on mobile to save resources)
function initTypingEffect() {
  if (isMobile) return;
  const titles = document.querySelectorAll('.brand-title, .services h3');

  titles.forEach(title => {
    const langSpanEs = title.querySelector('.lang-es');
    const langSpanEn = title.querySelector('.lang-en');

    let targetElement = title;
    let textToType = title.textContent;

    if (langSpanEs && langSpanEn) {
      const isEs = document.body.classList.contains('lang-es');
      targetElement = isEs ? langSpanEs : langSpanEn;
      textToType = targetElement.textContent.trim();
      langSpanEs.textContent = isEs ? '' : langSpanEs.textContent;
      langSpanEn.textContent = !isEs ? '' : langSpanEn.textContent;
    } else {
      textToType = title.textContent.trim();
      title.textContent = '';
    }

    title.style.borderRight = '2px solid var(--accent)';
    title.style.animation = 'blink 1s infinite';

    let i = 0;
    function typeWriter() {
      if (i < textToType.length) {
        targetElement.textContent += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 55);
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

// 5. Video optimizations - prevents mobile memory crash
function initVideoOptimizations() {
  const headerVideo = document.getElementById('headerVideo');
  const footerVideo = document.getElementById('footerVideo');
  const projectVideos = document.querySelectorAll('.project-card-video');

  // Helper to load video source from data-src
  const loadSource = (video) => {
    if (video.dataset.loaded) return false;
    
    const source = video.querySelector('source[data-src]');
    if (source) {
      source.src = source.getAttribute('data-src');
      source.removeAttribute('data-src');
      video.load();
      video.dataset.loaded = "true";
      return true;
    }
    return false;
  };

  // --- HEADER VIDEO ---
  if (headerVideo) {
    headerVideo.muted = true;
    headerVideo.setAttribute('playsinline', 'true');
    headerVideo.setAttribute('webkit-playsinline', 'true');
    // On strong mobile/desktop, we play. On very low end, we might skip.
    headerVideo.play().catch(() => {});
    headerVideo.addEventListener('error', () => {
      headerVideo.style.display = 'none';
    });
  }

  // --- FOOTER VIDEO: load only when visible ---
  if (footerVideo) {
    footerVideo.muted = true;
    footerVideo.preload = 'none';
    footerVideo.setAttribute('playsinline', 'true');
    footerVideo.setAttribute('webkit-playsinline', 'true');

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          loadSource(footerVideo);
          footerVideo.play().catch(err => console.warn('[VIDEO] Footer play failed:', err));
          footerObserver.unobserve(footerVideo);
        }
      });
    }, { threshold: 0.01, rootMargin: '400px' });

    footerObserver.observe(footerVideo);
    footerVideo.addEventListener('error', () => {
      footerVideo.style.display = 'none';
    });
  }

  // --- PROJECT CARD VIDEOS: pause when off-screen to save memory ---
  if (projectVideos.length > 0) {
    // If specifically detected as very low end, we can disable them entirely
    // but the user wants it optimized, not stripped. We'll use strict lazy load first.
    
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) {
          loadSource(v);
          // Small delay to ensure load() has initialized
          setTimeout(() => {
            v.play().catch(err => {
              // If it fails, we try again on next interaction or keep it as is
              console.warn('[VIDEO] Project play failed:', err);
            });
          }, 50);
        } else {
          if (!isMobile) v.pause();
          // We don't pause on mobile to avoid the "flicker" when re-entering, 
          // unless it's way off screen. Memory management is handled by lazy load.
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: isMobile ? '300px' : '500px'
    });

    projectVideos.forEach(v => {
      v.muted = true;
      v.preload = 'none';
      v.setAttribute('playsinline', 'true');
      v.setAttribute('webkit-playsinline', 'true');
      v.addEventListener('error', () => { v.style.display = 'none'; });
      videoObserver.observe(v);
    });
  }
}

// 6. Main DOMContentLoaded entry point
document.addEventListener('DOMContentLoaded', () => {
  // Service Worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => console.warn('[SW] registration failed:', err));
    });
  }

  // Mobile and performance classes
  if (isMobile) document.body.classList.add('mobile-device');
  if (isLiteMode) document.body.classList.add('lite-mode');

  // Initialize everything
  startLoadingScreen();
  initScrollReveal();
  initTypingEffect();
  initVideoOptimizations();

  if (isGitHubPages) console.log('[INIT] 🚀 INIT IDEA loaded');

  // Social Toggle
  const socialToggle = document.getElementById('socialToggle');
  const socialDropdown = document.getElementById('socialDropdown');
  const socialContainer = document.getElementById('socialContainer');

  if (socialToggle && socialDropdown && socialContainer) {
    socialToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = socialDropdown.classList.toggle('open');
      socialToggle.setAttribute('aria-expanded', String(isOpen));
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

  // Order Card Modal
  const orderModal = document.getElementById('orderModal');
  if (orderModal) {
    // Close on overlay click (outside the box)
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) orderModal.classList.remove('open');
    });
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && orderModal.classList.contains('open')) {
        orderModal.classList.remove('open');
      }
    });
  }
});

// Safety net: remove loading screen after 5 seconds no matter what
window.addEventListener('load', () => {
  setTimeout(() => {
    const load = document.getElementById('loading-screen');
    if (load && load.parentNode) load.remove();
    const splash = document.getElementById('splash-screen');
    if (splash && splash.parentNode) splash.remove();
  }, 5000);
});