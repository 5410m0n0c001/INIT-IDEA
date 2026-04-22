// ============================================================
//  INIT IDEA — script.js
//  Mobile-first performance + crash prevention
// ============================================================

'use strict';

// ── DETECCIÓN DE DISPOSITIVO ─────────────────────────────────

const Device = {
  isMobile: /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent)
    || window.innerWidth < 768,

  isLowEnd: (() => {
    // Relaxed detection: only very old devices or extremely slow connections
    const mem   = navigator.deviceMemory;       
    const cores = navigator.hardwareConcurrency; 
    const conn  = navigator.connection?.effectiveType; 
    return (mem && mem < 2)
      || (cores && cores < 2)
      || conn === '2g'
      || conn === 'slow-2g';
  })(),

  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// Aplicar clase lite-mode al <html> lo antes posible
if (Device.isLowEnd || Device.prefersReducedMotion) {
  document.documentElement.classList.add('lite-mode');
}

// ── PANTALLAS DE CARGA ───────────────────────────────────────

(function initLoadingScreens() {
  const splash  = document.getElementById('splash-screen');
  const loading = document.getElementById('loading-screen');

  function hide(el, delay = 0) {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity    = '0';
      setTimeout(() => {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      }, 420);
    }, delay);
  }

  // Timeout de seguridad: si algo falla, se ocultan igual
  const splashTimeout  = setTimeout(() => hide(splash),        1500);
  const loadingTimeout = setTimeout(() => hide(loading),       2800);

  window.addEventListener('load', () => {
    clearTimeout(splashTimeout);
    clearTimeout(loadingTimeout);
    hide(splash, 200);
    hide(loading, 900);
  }, { once: true });
})();

// ── HERO VIDEO ───────────────────────────────────────────────

function initHeroVideo() {
  const video = document.getElementById('headerVideo');
  if (!video) return;

  // Gama baja o reducción de movimiento: no reproducir video
  if (Device.isLowEnd || Device.prefersReducedMotion) {
    video.style.display = 'none';
    // El poster queda visible como fondo estático
    return;
  }

  // Móvil normal: intentar reproducir con manejo de error
  if (Device.isMobile) {
    video.preload = 'metadata'; // no precargar buffer completo
    video.addEventListener('canplay', () => {
      video.play().catch(() => {
        // Autoplay bloqueado por política del browser → ocultar
        video.style.display = 'none';
      });
    }, { once: true });
    video.load();
    return;
  }

  // Desktop: reproducción inmediata
  video.play().catch(() => {
    video.style.display = 'none';
  });
}

// ── LAZY LOAD DE VIDEOS DE PROYECTOS ────────────────────────

function initProjectVideos() {
  const videos = document.querySelectorAll('.lazy-video');
  if (!videos.length) return;

  // Optimized IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;

      if (entry.isIntersecting) {
        // High-performance loading
        if (!v.querySelector('source') && v.dataset.src) {
          const src = document.createElement('source');
          src.src  = v.dataset.src;
          src.type = 'video/mp4';
          v.appendChild(src);
          v.load();
        }
        
        // Ensure play is only called when ready and handle errors gracefully
        v.play().catch(error => {
          console.warn('[Video] Playback blocked or failed:', error);
          // Fallback: If autoplay fails, we keep the poster/static preview
        });

      } else {
        // Free GPU memory when not visible
        v.pause();
      }
    });
  }, {
    rootMargin: '200px 0px', // Pre-load slightly earlier
    threshold:  0.01,         // Trigger as soon as 1% is visible
  });

  videos.forEach(v => observer.observe(v));
}

// ── TOGGLE DE IDIOMA ─────────────────────────────────────────

function initLangToggle() {
  const btn  = document.getElementById('langToggle');
  const body = document.body;
  if (!btn) return;

  // Leer idioma guardado (si existe)
  const saved = localStorage.getItem('init-idea-lang');
  if (saved === 'en') body.classList.replace('lang-es', 'lang-en');

  btn.addEventListener('click', () => {
    const isEs = body.classList.contains('lang-es');
    body.classList.replace(
      isEs ? 'lang-es' : 'lang-en',
      isEs ? 'lang-en' : 'lang-es'
    );
    localStorage.setItem('init-idea-lang', isEs ? 'en' : 'es');
  });
}

// ── BOTÓN DE SHARE ───────────────────────────────────────────

function initShareBtn() {
  const btn = document.getElementById('shareBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'INIT IDEA',
          text:  '¡Conoce INIT IDEA — Diseño Web, IA y más!',
          url:   window.location.href,
        });
      } catch (e) {
        if (e.name !== 'AbortError') fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  });

  function fallbackCopy() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('¡Enlace copiado al portapapeles!'))
      .catch(() => {});
  }
}

// ── SOCIAL TOGGLE ────────────────────────────────────────────

function initSocialToggle() {
  const toggle   = document.getElementById('socialToggle');
  const dropdown = document.getElementById('socialDropdown');
  if (!toggle || !dropdown) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    dropdown.setAttribute('aria-hidden', String(isOpen));
    dropdown.classList.toggle('open', !isOpen);
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', e => {
    const container = document.getElementById('socialContainer');
    if (container && !container.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
      dropdown.classList.remove('open');
    }
  });
}

// ── ANIMACIONES DE SCROLL (solo en dispositivos capaces) ─────

function initScrollAnimations() {
  // No animar en gama baja o reduced-motion
  if (Device.isLowEnd || Device.prefersReducedMotion) return;

  const animElements = document.querySelectorAll(
    '.card, .project-card, .testimonial-card, .scroll-reveal, .pricing-card-preview, [data-animate]'
  );
  if (!animElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animar solo una vez
      }
    });
  }, { threshold: 0.05 });

  animElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// ── SERVICE WORKER REGISTRATION ──────────────────────────────

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(reg => {
          console.log('[SW] Registrado:', reg.scope);

          // Notificar al usuario si hay una actualización disponible
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed'
                && navigator.serviceWorker.controller
              ) {
                // Hay versión nueva disponible — puedes mostrar un toast aquí
                console.log('[SW] Nueva versión disponible. Recarga para actualizar.');
              }
            });
          });
        })
        .catch(err => console.warn('[SW] Error al registrar:', err));
    });
  }
}

// ── INIT PRINCIPAL ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initProjectVideos();
  initLangToggle();
  initShareBtn();
  initSocialToggle();
  initScrollAnimations();
  registerServiceWorker();
});