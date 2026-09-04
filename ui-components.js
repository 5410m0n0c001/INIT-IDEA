// ============================================================
//  INIT IDEA — Componentes de UI compartidos
//  Carrusel 3D reutilizable + widget sticky de contacto.
//  Se auto-inicializa y es independiente de script.js, para
//  poder usarse también en páginas con su propio JS
//  (por ejemplo manual-comercial.js).
// ============================================================

'use strict';

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
        if (!href) return;

        // Páginas de una sola vista (p. ej. el manual comercial): dejar que
        // su propio manejador de anclas abra la sección correspondiente.
        if (href.startsWith('#')) {
          const link = document.querySelector('.nav-menu a[href="' + href + '"]');
          if (link) link.click();
          else window.location.hash = href;
          return;
        }

        const target = card.dataset.target || '_self';
        if (target === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
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

document.addEventListener('DOMContentLoaded', () => {
  initContactWidget();
  initCarousel3D();
});
