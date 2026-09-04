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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;

      if (entry.isIntersecting) {
        // Load video if not already loaded
        if (!v.querySelector('source') && v.dataset.src) {
          const src = document.createElement('source');
          src.src  = v.dataset.src;
          src.type = 'video/mp4';
          v.appendChild(src);
          v.load();
        }
        
        // Play video
        v.play().catch(() => {
          // Silently fail if autoplay blocked
        });

      } else {
        v.pause();
        // Critical: unload video on mobile or low-end to save GPU memory
        if (Device.isMobile || Device.isLowEnd) {
          const sources = v.querySelectorAll('source');
          if (sources.length) {
            sources.forEach(s => s.remove());
            v.load(); // This unloads the video resource
          }
        }
      }
    });
  }, {
    rootMargin: '250px 0px',
    threshold:  0.01,
  });

  videos.forEach(v => {
    v.style.display = 'block';
    observer.observe(v);
  });
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

// ── WIDGET STICKY DE CONTACTO (inyectado en TODAS las páginas) ──

function initContactWidget() {
  // Evitar duplicados si la página ya trae su propio widget
  if (document.getElementById('contactWidget')) return;

  const wrap = document.createElement('div');
  wrap.className = 'contact-widget';
  wrap.id = 'contactWidget';
  wrap.innerHTML = `
    <div class="contact-widget-dropdown" id="contactDropdown" aria-hidden="true">
      <a class="contact-widget-item" href="tel:+527772383264" rel="nofollow">
        <i class="fas fa-phone" aria-hidden="true"></i><span>Llamar ahora</span>
      </a>
      <a class="contact-widget-item" href="https://wa.me/527772383264?text=Me%20quisiera%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-whatsapp" aria-hidden="true"></i><span>Enviar WhatsApp</span>
      </a>
      <a class="contact-widget-item" href="mailto:5410m0n.r4m1r3z@gmail.com">
        <i class="fas fa-envelope" aria-hidden="true"></i><span>Enviar correo</span>
      </a>
      <a class="contact-widget-item" href="https://t.me/initidea" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-telegram-plane" aria-hidden="true"></i><span>Enviar Telegram</span>
      </a>
      <a class="contact-widget-item" href="contact.vcf" download="INIT-IDEA-contact.vcf">
        <i class="fas fa-address-book" aria-hidden="true"></i><span>Agregar contacto</span>
      </a>
      <button type="button" class="contact-widget-item" id="contactWidgetShare">
        <i class="fas fa-share-alt" aria-hidden="true"></i><span>Compartir</span>
      </button>
      <a class="contact-widget-item" href="tel:+527777107522">
        <i class="fas fa-phone-alt" aria-hidden="true"></i><span>Teléfono del estudio</span>
      </a>
    </div>
    <button type="button" class="contact-widget-toggle" id="contactWidgetToggle" aria-label="Abrir opciones de contacto" aria-expanded="false">
      <i class="fas fa-comment-dots cw-icon-open" aria-hidden="true"></i>
      <i class="fas fa-xmark cw-icon-close" aria-hidden="true"></i>
    </button>
    <div class="contact-widget-legend">Contáctanos</div>
  `;

  // Resolver rutas relativas si la página está en una subcarpeta (no aplica hoy, pero por seguridad)
  document.body.appendChild(wrap);

  const toggle   = document.getElementById('contactWidgetToggle');
  const dropdown = document.getElementById('contactDropdown');
  const shareBtn = document.getElementById('contactWidgetShare');

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    dropdown.setAttribute('aria-hidden', String(isOpen));
    dropdown.classList.toggle('open', !isOpen);
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
      dropdown.classList.remove('open');
    }
  });

  shareBtn.addEventListener('click', async () => {
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
    function fallbackCopy() {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('¡Enlace copiado al portapapeles!'))
        .catch(() => {});
    }
  });
}

// ── CARRUSEL 3D REUTILIZABLE (estilo cover-flow) ──────────────

function initCarousel3D() {
  const carousels = document.querySelectorAll('.carousel3d');
  if (!carousels.length) return;

  carousels.forEach(setupCarousel);

  function setupCarousel(root) {
    const track  = root.querySelector('.carousel3d-track');
    const cards  = Array.from(root.querySelectorAll('.carousel3d-card'));
    const dotsEl = root.querySelector('.carousel3d-dots');
    const prevBtn = root.querySelector('.carousel3d-prev');
    const nextBtn = root.querySelector('.carousel3d-next');
    if (!track || !cards.length) return;

    let active = cards.findIndex(c => c.classList.contains('is-active'));
    if (active < 0) active = 0;

    // Construir dots
    let dots = [];
    if (dotsEl) {
      dotsEl.innerHTML = '';
      dots = cards.map((_, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel3d-dot';
        d.setAttribute('aria-label', `Ir a la tarjeta ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
        return d;
      });
    }

    function geometry() {
      const w = window.innerWidth;
      if (w <= 640) return { x: 150, z: 90, rot: 32, scaleStep: 0.16, maxVisible: 2 };
      if (w <= 1024) return { x: 210, z: 120, rot: 34, scaleStep: 0.15, maxVisible: 3 };
      return { x: 260, z: 150, rot: 38, scaleStep: 0.14, maxVisible: 3 };
    }

    function render() {
      const g = geometry();
      cards.forEach((card, i) => {
        let offset = i - active;
        // Distancia circular más corta (para loop suave)
        if (offset > cards.length / 2) offset -= cards.length;
        if (offset < -cards.length / 2) offset += cards.length;

        const abs = Math.abs(offset);
        card.classList.toggle('is-active', offset === 0);

        if (abs > g.maxVisible) {
          const farX = (offset > 0 ? 1 : -1) * 640;
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = `translate3d(${farX}px, 0, -640px) scale(0.4)`;
          card.style.zIndex = '0';
          return;
        }

        const scale = Math.max(1 - abs * g.scaleStep, 0.5);
        const tx = offset * g.x;
        const tz = -abs * g.z;
        const rot = offset === 0 ? 0 : (offset > 0 ? -g.rot : g.rot);

        card.style.opacity = String(Math.max(1 - abs * 0.32, 0.35));
        card.style.pointerEvents = 'auto';
        card.style.zIndex = String(100 - abs);
        card.style.transform =
          `translate3d(${tx}px, 0, ${tz}px) rotateY(${rot}deg) scale(${scale})`;
      });

      dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
    }

    function goTo(i) {
      active = (i + cards.length) % cards.length;
      render();
    }
    function next() { goTo(active + 1); }
    function prev() { goTo(active - 1); }

    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (i !== active) {
          e.preventDefault();
          goTo(i);
          return;
        }
        // Tarjeta activa: seguir su enlace/acción
        const href = card.dataset.href;
        if (href) {
          const target = card.dataset.target || '_self';
          if (target === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = href;
          }
        }
      });
    });

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    // Swipe / drag
    let startX = 0, deltaX = 0, dragging = false;
    const stage = root.querySelector('.carousel3d-stage') || root;

    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; dragging = true;
    }, { passive: true });
    stage.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    stage.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      if (deltaX > 40) prev();
      else if (deltaX < -40) next();
      deltaX = 0;
    });

    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // ya cubierto por touch events
      startX = e.clientX; dragging = true;
    });
    stage.addEventListener('pointerup', (e) => {
      if (!dragging || e.pointerType === 'touch') return;
      dragging = false;
      const d = e.clientX - startX;
      if (d > 40) prev();
      else if (d < -40) next();
    });

    // Teclado
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    window.addEventListener('resize', render);
    render();
  }
}

// ── ANIMACIONES DE SCROLL (solo en dispositivos capaces) ─────

function initScrollAnimations() {
  // No animar en gama baja o si el usuario prefiere movimiento reducido
  if (Device.prefersReducedMotion) return;

  const animElements = document.querySelectorAll(
    '.card, .latest-project-card, .testimonial-card, .scroll-reveal, .pricing-card-preview, [data-animate]'
  );
  if (!animElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animElements.forEach(el => {
    // Add initialization class and observe
    el.classList.add('animate-on-scroll', 'init');
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
  initContactWidget();
  initCarousel3D();
  initScrollAnimations();
  registerServiceWorker();
});