// ============================================================
//  INIT IDEA — Componentes de UI compartidos
//  Carrusel 3D reutilizable + widget sticky de contacto.
//  Se auto-inicializa y es independiente de script.js, para
//  poder usarse también en páginas con su propio JS
//  (por ejemplo manual-comercial.js).
// ============================================================

'use strict';

// ── WIDGET STICKY DE REDES SOCIALES (inyectado en TODAS las páginas) ──

function initSocialWidget() {
  // Evitar duplicados si la página ya trae el bloque en su HTML
  if (document.getElementById('socialContainer')) return;

  const redes = [
    ['https://www.facebook.com/profile.php?id=61562772009526', 'fab fa-facebook',      'Facebook personal'],
    ['https://www.facebook.com/profile.php?id=61582855106237', 'fab fa-facebook-f',    'Facebook INIT IDEA'],
    ['https://www.instagram.com/alexros2.0/',                  'fab fa-instagram',     'Instagram'],
    ['https://discord.gg/4kHSzxNz',                            'fab fa-discord',       'Discord'],
    ['https://www.linkedin.com/in/salomon-ramirez-ortega-b8988a329/', 'fab fa-linkedin-in', 'LinkedIn'],
    ['https://x.com/alexros2_0',                               'fab fa-x-twitter',     'X (Twitter)'],
    ['https://youtube.com/@salomonramirezortega',              'fab fa-youtube',       'YouTube'],
    ['https://github.com/5410m0n0c001',                        'fab fa-github',        'GitHub'],
    ['https://www.tiktok.com/@alexros2.0',                     'fab fa-tiktok',        'TikTok'],
  ];

  const enlaces = redes.map(([href, icon, label]) => `
      <a class="social" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">
        <i class="${icon}" aria-hidden="true"></i><span>${label}</span>
      </a>`).join('');

  // Un <div>, no un <aside>: algunas páginas (manual-comercial.css) estilizan
  // el elemento aside para su barra lateral y se llevarían el widget con él.
  const wrap = document.createElement('div');
  wrap.className = 'social-container';
  wrap.id = 'socialContainer';
  wrap.setAttribute('role', 'complementary');
  wrap.setAttribute('aria-label', 'Redes sociales');
  wrap.innerHTML = `
    <button id="socialToggle" class="social-toggle" aria-label="Ver redes sociales" aria-expanded="false">
      <img src="logo2.0.jpeg" alt="" class="social-logo" loading="lazy">
    </button>
    <div id="socialDropdown" class="social-dropdown" aria-hidden="true">${enlaces}
    </div>
    <div class="social-legend">Síguenos</div>
  `;
  document.body.appendChild(wrap);

  const toggle   = document.getElementById('socialToggle');
  const dropdown = document.getElementById('socialDropdown');

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

// ── ANILLO 3D EN GIRO CONTINUO ────────────────────────────────
// Las fotos se reparten sobre un cilindro que gira sin parar. No hay
// pasos ni transiciones entre una y otra: es un movimiento constante.

function initRing3D() {
  const anillos = document.querySelectorAll('.ring3d');
  if (!anillos.length) return;

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  anillos.forEach(root => {
    const track = root.querySelector('.ring3d-track');
    const spin  = root.querySelector('.ring3d-spin');
    const stage = root.querySelector('.ring3d-stage');
    const items = Array.from(root.querySelectorAll('.ring3d-item'));
    if (!track || !spin || !items.length) return;

    const total = items.length;
    const paso  = 360 / total;

    function repartir() {
      const ancho = items[0].offsetWidth || 230;
      // Radio que separa las fotos sin que se encimen, más un respiro
      const radio = Math.round((ancho / 2) / Math.tan(Math.PI / total)) + 40;
      track.style.transform = 'translateZ(' + (-radio) + 'px)';
      items.forEach((el, i) => {
        el.style.transform = 'rotateY(' + (paso * i) + 'deg) translateZ(' + radio + 'px)';
      });
    }
    repartir();
    window.addEventListener('resize', repartir);
    window.addEventListener('load', repartir, { once: true });

    // A partir de aquí el giro lo lleva el JS, no la animación CSS: así se
    // puede cambiar de sentido, arrastrar con el dedo y retomar al soltar.
    root.classList.add('ring3d-manual');

    const vuelta = parseFloat(root.dataset.vuelta) > 0 ? parseFloat(root.dataset.vuelta) : 22;
    const gradosPorSeg = 360 / vuelta;

    let angulo = 0;
    let sentido = -1;          // -1 avanza a la derecha; 1 a la izquierda
    let arrastrando = false;
    let enHover = false;
    let ultimoX = 0;
    let ultimo = null;

    function pintar() {
      spin.style.transform = 'rotateY(' + angulo + 'deg)';
    }

    function paso_(ts) {
      if (ultimo === null) ultimo = ts;
      const dt = (ts - ultimo) / 1000;
      ultimo = ts;
      if (!arrastrando && !enHover && !sinMovimiento) {
        angulo += sentido * gradosPorSeg * dt;
        pintar();
      }
      requestAnimationFrame(paso_);
    }
    pintar();
    requestAnimationFrame(paso_);

    // Botones de sentido
    root.querySelectorAll('[data-sentido]').forEach(btn => {
      btn.addEventListener('click', () => {
        sentido = parseFloat(btn.dataset.sentido);
        root.querySelectorAll('[data-sentido]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });

    // Pausa al pasar el cursor, para poder mirar una foto
    if (stage) {
      stage.addEventListener('mouseenter', () => { enHover = true; });
      stage.addEventListener('mouseleave', () => { enHover = false; });
    }

    // Arrastre: el usuario mueve el anillo a mano y al soltar sigue solo
    const destino = stage || root;

    function iniciar(x) { arrastrando = true; ultimoX = x; destino.classList.add('arrastrando'); }
    function mover(x) {
      if (!arrastrando) return;
      angulo += (x - ultimoX) * 0.35; // grados por píxel
      ultimoX = x;
      pintar();
    }
    function soltar() { arrastrando = false; destino.classList.remove('arrastrando'); }

    destino.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;
      iniciar(e.clientX);
    });
    // En la ventana, para no perder el gesto si el puntero sale del anillo
    window.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      mover(e.clientX);
    });
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);

    destino.addEventListener('touchstart', e => iniciar(e.touches[0].clientX), { passive: true });
    destino.addEventListener('touchmove',  e => mover(e.touches[0].clientX),   { passive: true });
    destino.addEventListener('touchend',   soltar);
  });
}

// ── CARRUSEL 3D REUTILIZABLE (estilo cover-flow) ──────────────

function initCarousel3D() {
  const carousels = document.querySelectorAll('.carousel3d');
  if (!carousels.length) return;

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carousels.forEach(setupCarousel);

  function setupCarousel(root) {
    const track   = root.querySelector('.carousel3d-track');
    let   cards   = Array.from(root.querySelectorAll('.carousel3d-card'));
    const dotsEl  = root.querySelector('.carousel3d-dots');
    const prevBtn = root.querySelector('.carousel3d-prev');
    const nextBtn = root.querySelector('.carousel3d-next');
    const stage   = root.querySelector('.carousel3d-stage');
    if (!track || !cards.length) return;

    const originales = cards.length;

    // El recorrido es circular: al pasar la última sigue la primera. Para que
    // ese salto ocurra fuera de la vista y no parezca un rebote, hacen falta
    // más tarjetas de las que caben en pantalla; si hay pocas, se clonan.
    const MINIMO = 7;
    if (originales < MINIMO) {
      const copias = Math.ceil(MINIMO / originales) - 1;
      for (let c = 0; c < copias; c++) {
        cards.slice(0, originales).forEach(orig => {
          const clon = orig.cloneNode(true);
          clon.classList.remove('is-active');
          clon.dataset.clon = '1';
          track.appendChild(clon);
        });
      }
      cards = Array.from(root.querySelectorAll('.carousel3d-card'));
    }

    const total = cards.length;

    // La posición es decimal: entre 3.0 y 4.0 la tarjeta va en camino. De ahí
    // que el movimiento se vea continuo y no como una transición entre pasos.
    let pos = Math.max(cards.findIndex(c => c.classList.contains('is-active')), 0);
    let objetivo = pos;          // a dónde llegar tras un clic
    let sentido = 1;             // 1 avanza a la derecha; -1 a la izquierda
    let arrastrando = false;
    let huboArrastre = false;   // para no abrir el enlace al soltar un arrastre
    let enHover = false;
    let ultimoX = 0;
    let ultimoTs = null;

    // Velocidad de crucero, en tarjetas por segundo
    const porSegundo = parseFloat(root.dataset.velocidad) > 0
      ? parseFloat(root.dataset.velocidad)
      : 0.26;                    // ~3.8 s por tarjeta

    // Un indicador por tarjeta real: los clones no cuentan
    let dots = [];
    if (dotsEl) {
      dotsEl.innerHTML = '';
      dots = Array.from({ length: originales }, (_, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel3d-dot';
        d.setAttribute('aria-label', 'Ir a la tarjeta ' + (i + 1));
        d.addEventListener('click', () => irA(i));
        dotsEl.appendChild(d);
        return d;
      });
    }

    function geometry() {
      const w = window.innerWidth;
      if (w <= 640)  return { x: 150, z: 90,  rot: 32, scaleStep: 0.16, maxVisible: 2 };
      if (w <= 1024) return { x: 210, z: 120, rot: 34, scaleStep: 0.15, maxVisible: 3 };
      return { x: 260, z: 150, rot: 38, scaleStep: 0.14, maxVisible: 3 };
    }

    // Distancia con signo más corta alrededor del anillo
    function desfase(i) {
      let d = i - pos;
      while (d >  total / 2) d -= total;
      while (d < -total / 2) d += total;
      return d;
    }

    // Previsualizaciones en iframe: solo la del frente queda cargada, para que
    // ninguna invitación con música suene de fondo ni se empalmen dos.
    const previewFrames = cards.map(c => c.querySelector('.c3d-media iframe'));
    previewFrames.forEach(frame => {
      if (!frame) return;
      if (!frame.dataset.src) frame.dataset.src = frame.getAttribute('src') || '';
      frame.setAttribute('allow', "autoplay 'none'; camera 'none'; microphone 'none'");
      frame.setAttribute('src', 'about:blank');
    });

    let frenteAnterior = -1;
    function syncPreviewFrames(frente) {
      if (frente === frenteAnterior) return;
      frenteAnterior = frente;
      previewFrames.forEach((frame, i) => {
        if (!frame || !frame.dataset.src) return;
        const quiere = (i === frente) ? frame.dataset.src : 'about:blank';
        if (frame.getAttribute('src') !== quiere) frame.setAttribute('src', quiere);
      });
    }

    function ajustarAltura() {
      if (!stage || !root.classList.contains('is-tall')) return;
      const alta = cards.reduce((max, c) => Math.max(max, c.offsetHeight), 0);
      if (!alta) return;
      const alto = alta + 70;
      const nuevo = alto + 'px';
      if (stage.style.height === nuevo) return;
      stage.style.height = nuevo;
      [prevBtn, nextBtn].forEach(b => { if (b) b.style.top = (alto / 2) + 'px'; });
    }
    if ('ResizeObserver' in window) new ResizeObserver(ajustarAltura).observe(root);

    // Modo órbita: las tarjetas dan vueltas alrededor del objeto del centro,
    // pasando por delante y por detrás de él, en lugar de abrirse en abanico.
    const enOrbita = root.classList.contains('is-orbit');
    const inclinable = root.classList.contains('is-inclinable');
    const telefono = root.querySelector('.carousel3d-phone');
    // Si hay modelo 3D no se le aplica un giro CSS —quedaría deformado—: se
    // mueve su cámara, que es lo que de verdad lo hace girar.
    const modelo = root.querySelector('model-viewer');

    // El modelo 3D se dibuja en WebGL, así que el navegador no puede
    // intercalarlo con las tarjetas dentro del mismo espacio CSS. Se usan dos
    // capas —una delante y otra detrás del teléfono— y cada tarjeta cambia de
    // capa al cruzar los costados, que es cuando no se nota.
    let capaDetras = null;
    if (enOrbita && modelo && stage) {
      capaDetras = document.createElement('div');
      capaDetras.className = 'carousel3d-track carousel3d-track-detras';
      stage.insertBefore(capaDetras, stage.firstChild);
    }

    function ubicarEnCapa(card, alFrente) {
      if (!capaDetras) return;
      const destino = alFrente ? track : capaDetras;
      if (card.parentElement !== destino) destino.appendChild(card);
    }

    function radioOrbita() {
      const anchoTarjeta = cards[0].offsetWidth || 150;
      const mitadEscenario = (stage ? stage.getBoundingClientRect().width : 900) / 2;
      const holgado = Math.round((anchoTarjeta / 2) / Math.tan(Math.PI / total)) + 30;
      return Math.max(160, Math.min(holgado, mitadEscenario - anchoTarjeta / 2 - 10));
    }

    function renderOrbita() {
      const R = radioOrbita();
      let frente = 0, mejor = Infinity;

      cards.forEach((card, i) => {
        const off = desfase(i);
        const abs = Math.abs(off);
        if (abs < mejor) { mejor = abs; frente = i; }

        const grados = (off / total) * 360;
        const rad = grados * Math.PI / 180;
        const z = Math.cos(rad);            // 1 al frente, -1 detrás
        // Con modelo 3D la inclinación no va en la pista (deformaría el
        // teléfono), así que cada tarjeta la lleva en su propio giro.
        const inclina = modelo ? 'rotateX(' + inclinacion + 'deg) ' : '';
        const desinclina = modelo ? ' rotateX(' + (-inclinacion) + 'deg)' : '';

        card.classList.toggle('is-active', abs < 0.5);
        card.style.pointerEvents = 'auto';
        // Las de atrás se atenúan para dar profundidad, sin desaparecer
        card.style.opacity = String(0.42 + 0.58 * ((z + 1) / 2));
        card.style.zIndex = String(Math.round(500 + z * 100));
        // El segundo giro cancela el primero: la tarjeta orbita pero siempre
        // mira de frente, como los pétalos alrededor de la rosa.
        card.style.transform =
          'translate(-50%, -50%) ' + inclina +
          'rotateY(' + grados + 'deg) translateZ(' + R + 'px) rotateY(' + (-grados) + 'deg)' + desinclina;

        ubicarEnCapa(card, z >= 0);
      });

      dots.forEach((d, i) => d.classList.toggle('is-active', i === frente % originales));
      syncPreviewFrames(frente);
      sincronizarModelo();
    }

    function render() {
      if (enOrbita) return renderOrbita();
      const g = geometry();
      let frente = 0, mejor = Infinity;

      cards.forEach((card, i) => {
        const off = desfase(i);
        const abs = Math.abs(off);
        if (abs < mejor) { mejor = abs; frente = i; }

        card.classList.toggle('is-active', abs < 0.5);

        if (abs > g.maxVisible) {
          const lejos = (off > 0 ? 1 : -1) * 640;
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = 'translate3d(calc(-50% + ' + lejos + 'px), -50%, -640px) scale(0.4)';
          card.style.zIndex = '0';
          return;
        }

        const escala = Math.max(1 - abs * g.scaleStep, 0.5);
        const tx  = off * g.x;
        const tz  = -abs * g.z;
        const rot = -off * g.rot;

        card.style.opacity = String(Math.max(1 - abs * 0.32, 0.35));
        card.style.pointerEvents = 'auto';
        card.style.zIndex = String(Math.round(100 - abs * 10));
        card.style.transform =
          'translate3d(calc(-50% + ' + tx + 'px), -50%, ' + tz + 'px) rotateY(' + rot + 'deg) scale(' + escala + ')';
      });

      dots.forEach((d, i) => d.classList.toggle('is-active', i === frente % originales));
      syncPreviewFrames(frente);
      ajustarAltura();
    }

    function normalizar() {
      while (pos < 0)      { pos += total; objetivo += total; }
      while (pos >= total) { pos -= total; objetivo -= total; }
    }

    function latido(ts) {
      if (ultimoTs === null) ultimoTs = ts;
      const dt = Math.min((ts - ultimoTs) / 1000, 0.1);
      ultimoTs = ts;

      if (!arrastrando) {
        const resto = objetivo - pos;
        if (Math.abs(resto) > 0.002) {
          // Llegar a la tarjeta pedida sin frenar de golpe
          pos += resto * Math.min(dt * 6, 1);
        } else if (!enHover && !sinMovimiento) {
          pos += sentido * porSegundo * dt;
          objetivo = pos;
        }
        normalizar();
        render();
      }
      requestAnimationFrame(latido);
    }

    // Se busca la copia más cercana de esa tarjeta, para no cruzar el anillo
    function irA(i) {
      let mejor = null;
      for (let k = i; k < total; k += originales) {
        const d = desfase(k);
        if (mejor === null || Math.abs(d) < Math.abs(mejor)) mejor = d;
      }
      objetivo = pos + (mejor === null ? 0 : mejor);
    }

    // Las flechas avanzan una tarjeta y además fijan el sentido del recorrido
    prevBtn?.addEventListener('click', () => { sentido = -1; objetivo = pos - 1; });
    nextBtn?.addEventListener('click', () => { sentido =  1; objetivo = pos + 1; });

    cards.forEach((card, i) => {
      card.addEventListener('click', e => {
        // Si se venía arrastrando, este clic es el final del gesto, no una
        // intención de abrir la tarjeta
        if (huboArrastre) { huboArrastre = false; e.preventDefault(); return; }

        const href = card.dataset.href;

        // Sin destino (fichas informativas) la tarjeta solo se trae al frente
        if (!href) { irA(i % originales); return; }

        // Con destino se abre al primer clic, esté al centro o de lado: pedir
        // dos clics se siente como que la tarjeta no responde.

        if (card.dataset.target === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer');
          return;
        }

        // Un ancla de la misma página no se resuelve cambiando el hash: hay
        // páginas (el manual) que muestran una sección a la vez y escuchan el
        // clic en su menú. Se reusa ese enlace para que hagan su trabajo.
        if (href.charAt(0) === '#') {
          const enlace = document.querySelector('a[href="' + href + '"]');
          if (enlace) { enlace.click(); return; }
          const destino = document.getElementById(href.slice(1));
          if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        window.location.href = href;
      });
    });

    // Al acercar el cursor se detiene, para poder leer y hacer clic con calma
    if (stage) {
      stage.addEventListener('mouseenter', () => { enHover = true; });
      stage.addEventListener('mouseleave', () => { enHover = false; });
    }

    // Arrastre: se mueve a mano y al soltar retoma su marcha
    const zona = stage || root;
    const pasoPx = () => geometry().x;

    // Un clic y un arrastre empiezan igual, así que no se arrastra hasta que
    // el puntero recorre unos píxeles. Antes de ese umbral el gesto sigue
    // siendo un clic normal y la tarjeta conserva su enlace.
    const UMBRAL = 5;
    let inicioX = 0;
    let pendiente = false;   // se apretó, aún no se sabe si es clic o arrastre


    // Inclinación vertical: arrastrando hacia arriba o abajo se mira la
    // escena desde otro ángulo. Solo donde se pide con is-inclinable.
    // La órbita arranca ligeramente inclinada: vista de canto parecería una
    // simple fila horizontal en vez de un giro alrededor del teléfono.
    // Inclinación de partida: negativa mira desde abajo, positiva desde
    // arriba. Un teléfono luce de frente; una laptop, ligeramente en picada.
    let inclinacion = root.dataset.inclinacion !== undefined
      ? parseFloat(root.dataset.inclinacion)
      : (root.classList.contains('is-orbit') ? -14 : 0);
    let inicioY = 0, ultimoY = 0;

    function aplicarInclinacion() {
      const giro = 'rotateX(' + inclinacion + 'deg)';
      if (!modelo) {
        track.style.transform = giro;
        if (telefono) telefono.style.transform = 'translate(-50%, -50%) ' + giro;
      }
      sincronizarModelo();
    }

    // Ángulo desde el que se mira el modelo: el que deja la pantalla de frente
    const thetaBase = parseFloat(root.dataset.modeloTheta || '0');

    // El teléfono dibujado en CSS se ve mientras el modelo carga; se retira
    // cuando este ya está listo (model-viewer no siempre refleja el atributo).
    if (modelo) {
      const respaldo = root.querySelector('.phone-respaldo');
      const retirar = () => { if (respaldo) respaldo.style.display = 'none'; };
      if (modelo.loaded) retirar();
      else modelo.addEventListener('load', retirar, { once: true });
    }
    // El teléfono gira en sentido contrario al de los iconos —de ahí el signo
    // invertido— y acompaña la inclinación del conjunto.
    function sincronizarModelo() {
      if (!modelo) return;
      const theta = thetaBase - (pos / total) * 360;
      const phi = Math.max(25, Math.min(135, 90 - inclinacion));
      modelo.setAttribute('camera-orbit', theta.toFixed(1) + 'deg ' + phi.toFixed(1) + 'deg 105%');
    }

    function apretar(x, y) {
      pendiente = true;
      inicioX = x; ultimoX = x;
      inicioY = y; ultimoY = y;
    }

    function mover(x, y) {
      if (!pendiente && !arrastrando) return;
      const dy = (y === undefined) ? 0 : y - inicioY;
      if (!arrastrando) {
        if (Math.abs(x - inicioX) < UMBRAL && Math.abs(dy) < UMBRAL) return;
        arrastrando = true;
        huboArrastre = true;
        zona.classList.add('arrastrando');
      }
      pos -= (x - ultimoX) / pasoPx();
      ultimoX = x;

      if (inclinable && y !== undefined) {
        // Se limita para que la escena no llegue a verse por detrás
        inclinacion = Math.max(-38, Math.min(38, inclinacion + (y - ultimoY) * 0.35));
        ultimoY = y;
        aplicarInclinacion();
      }

      normalizar();
      render();
    }

    function soltar() {
      pendiente = false;
      if (!arrastrando) return;
      arrastrando = false;
      objetivo = pos;
      zona.classList.remove('arrastrando');
    }

    zona.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;
      apretar(e.clientX, e.clientY);
    });
    // El seguimiento va en la ventana para no perder el gesto si el puntero
    // se sale del carrusel, pero sin capturarlo: capturarlo desviaría el clic.
    window.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      mover(e.clientX, e.clientY);
    });
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);

    zona.addEventListener('touchstart', e => apretar(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    zona.addEventListener('touchmove',  e => mover(e.touches[0].clientX, e.touches[0].clientY),   { passive: true });
    zona.addEventListener('touchend',   soltar);

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { sentido = -1; objetivo = pos - 1; }
      if (e.key === 'ArrowRight') { sentido =  1; objetivo = pos + 1; }
    });

    window.addEventListener('resize', render);
    window.addEventListener('load', ajustarAltura, { once: true });
    if (inclinable) aplicarInclinacion();
    render();
    requestAnimationFrame(latido);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSocialWidget();
  initContactWidget();
  initCarousel3D();
  initRing3D();
});
