// Animaciones al estilo de la invitación Carmesí (GSAP + ScrollTrigger), con elementos 3D:
//  - Imágenes (fotos, galería, tarjetas, hojas de lugares): entran por los lados girando desde la esquina
//    y se acomodan al ritmo del scroll (scrub), alternando izquierda/derecha.
//  - Guirnaldas de rosas azules y blancas (renders 3D de models/rosa.glb) que florecen con el scroll.
//  - Rosas grandes que entran girando por los costados entre secciones (decoraciones "reloj" de Carmesí).
//  - Pétalos azules y blancos cayendo sobre la portada.
// Con "reducir movimiento" o sin GSAP, todo queda en su lugar sin animación.
(() => {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const azar = (a, b) => a + Math.random() * (b - a);

  // ---------- guirnaldas (divisores): rosas que florecen con el scroll ----------
  // Cada flor apila 6 etapas renderizadas en Blender (img/deco/flor/*-0..5.webp, de botón a abierta);
  // al avanzar el scroll se funden de una etapa a la siguiente, la flor crece y gira un poco.
  // Es reversible: si se regresa, la flor se vuelve a cerrar.
  const ETAPAS = 6;
  const flores = [];
  $$('.cadena').forEach((cadena, c) => {
    const n = 5;
    for (let i = 0; i < n; i++) {
      if (i < n - 1) { // ramas con hojas entre flor y flor
        const rama = document.createElement('img');
        rama.className = 'guirnalda-rama';
        rama.src = 'img/deco/flor/rama.webp';
        rama.alt = '';
        rama.style.setProperty('--x', `${((i + 0.5) / (n - 1)) * 100}%`);
        rama.style.setProperty('--r', `${90 + azar(-25, 25)}deg`);
        cadena.append(rama);
      }
      const color = (i + c) % 3 === 1 ? 'blanca' : 'azul';
      const flor = document.createElement('span');
      flor.className = 'flor';
      flor.style.setProperty('--x', `${(i / (n - 1)) * 100}%`);
      flor.style.setProperty('--y', `${50 + Math.sin(i * 1.7 + c) * 14}%`);
      flor.style.setProperty('--w', `${azar(0.85, 1.15).toFixed(2)}`);
      flor.style.zIndex = 10 + Math.round(azar(0, 9));
      for (let k = 0; k < ETAPAS; k++) {
        const img = document.createElement('img');
        img.src = `img/deco/flor/flor-${color}-${k}.webp`;
        img.alt = '';
        img.loading = 'lazy';
        flor.append(img);
      }
      cadena.append(flor);
      // cada flor abre en su propio momento (orden alternado, no de izquierda a derecha)
      flores.push({ el: flor, cadena, retraso: ((i * 3 + c) % n) / n * 0.35, giro: azar(-35, 35), imgs: [...flor.children] });
    }
  });
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  let pendienteF = false;
  function florecer() {
    pendienteF = false;
    const cache = new Map();
    for (const f of flores) {
      let p = cache.get(f.cadena);
      if (p === undefined) {
        const r = f.cadena.getBoundingClientRect();
        // 0 cuando la guirnalda asoma por abajo; 1 cuando llega al 35 % superior de la pantalla
        // guirnaldas lejos de la pantalla: no se tocan (ahorra trabajo en cada scroll)
        p = r.bottom < -innerHeight || r.top > innerHeight * 2 ? -1 : (reducir ? 1 : clamp01((innerHeight - r.top) / (innerHeight * 0.75)));
        cache.set(f.cadena, p);
      }
      if (p < 0) continue;
      const local = Math.round(clamp01((p - f.retraso) / 0.6) * 200) / 200;
      if (local === f.ultimo) continue; // sin cambio: no se escribe nada
      f.ultimo = local;
      const e = local * (ETAPAS - 1);
      f.imgs.forEach((img, k) => { img.style.opacity = clamp01(1 - Math.abs(e - k)).toFixed(3); });
      f.el.style.transform = `rotate(${(f.giro * (1 - local) * 2 + f.giro * 0.25).toFixed(1)}deg) scale(${(0.55 + 0.45 * local).toFixed(3)})`;
    }
  }
  addEventListener('scroll', () => { if (!pendienteF) { pendienteF = true; requestAnimationFrame(florecer); } }, { passive: true });
  addEventListener('resize', florecer);
  florecer();

  const vigiaPetalos = new IntersectionObserver((es) => es.forEach((e) => {
    e.target.querySelector('.petalos')?.classList.toggle('pausado', !e.isIntersecting);
  }));
  document.querySelectorAll('.petalos').forEach((p) => vigiaPetalos.observe(p.parentElement));

  // ---------- rosas grandes que entran por los costados ----------
  const LADOS = [
    ['.familia', 'izq', 'rosa-azul-tallo'], ['#lugares', 'der', 'rosa-blanca'], ['#programa', 'izq', 'rosa-azul-1'],
    ['#menu', 'der', 'rosa-azul-2'], ['#regalos', 'der', 'rosa-azul-tallo'], ['.galeria', 'izq', 'rosa-blanca'],
    ['.deseos', 'der', 'rosa-azul-1'], ['#confirmar', 'izq', 'rosa-azul-2'],
  ];
  LADOS.forEach(([sel, lado, sprite]) => {
    const sec = document.querySelector(sel);
    if (!sec) return;
    const flor = document.createElement('img');
    flor.className = `flor-lado flor-${lado}`;
    flor.src = `img/deco/${sprite}.webp`;
    flor.alt = '';
    flor.loading = 'lazy';
    flor.setAttribute('aria-hidden', 'true');
    sec.prepend(flor);
  });

  // ---------- pétalos de la portada ----------
  // (portada y sección del video)
  if (!reducir) document.querySelectorAll('.petalos').forEach((petalos) => {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--x', `${Math.random() * 100}%`);
      p.style.setProperty('--d', `${azar(7, 14)}s`);
      p.style.setProperty('--t', `${-Math.random() * 12}s`);
      p.style.setProperty('--s', azar(0.6, 1.4).toFixed(2));
      p.style.setProperty('--g', `${(Math.random() < 0.5 ? -1 : 1) * azar(400, 1000)}deg`);
      if (i % 3 === 0) p.style.setProperty('--color-petalo', 'radial-gradient(circle at 30% 30%, #ffffff, #dfe6f3 70%)');
      petalos.append(p);
    }
  });

  function animar() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger || reducir) return;
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('con-gsap');

    // entrada lateral con giro desde la esquina (fotoGsap de Carmesí), ligada al scroll
    const entrarDeLado = (el, derecha, { x = 60, y = 25, giro = 18, start = 'top bottom', end = 'center 55%', scrub = 0.8, ease = 'sine.inOut' } = {}) => {
      el.classList.remove('revelar'); // la transición CSS frenaría el scrub
      gsap.fromTo(el,
        { xPercent: derecha ? x : -x, yPercent: y, rotation: derecha ? giro : -giro, opacity: 0.2, transformOrigin: derecha ? 'bottom right' : 'bottom left' },
        { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, ease, scrollTrigger: { trigger: el, start, end, scrub } });
    };

    $$('.foto-slide .foto-full').forEach((img, i) => entrarDeLado(img, i % 2 !== 0, { x: 55, y: 25, giro: 28 }));
    $$('.hoja').forEach((hoja) => entrarDeLado(hoja, hoja.dataset.entra === 'der', { x: 65, y: 30, giro: 12, start: 'top 98%', end: 'top 60%', scrub: 0.6 }));
    $$('#mosaico .m').forEach((m, i) => entrarDeLado(m, i % 2 !== 0, { x: 85, y: 25, giro: 22, end: 'center 60%' }));
    $$('.despedida-foto').forEach((t) => entrarDeLado(t, true, { x: 55, y: 25, giro: 28 }));
    $$('.tarjeta, .menu-panel, .album-qr').forEach((t, i) => entrarDeLado(t, i % 2 === 0, { x: 40, y: 15, giro: 8, start: 'top 98%', end: 'top 65%', scrub: 0.8 }));

    // cuenta regresiva: cada cuadro cae girando
    gsap.from('#cuenta > div', {
      y: -50, rotation: (i) => (i % 2 ? 12 : -12), opacity: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.1,
      scrollTrigger: { trigger: '#cuenta', start: 'top 90%', once: true },
    });

    // rosas de los costados: entran rodando desde fuera de la pantalla y luego giran despacio
    $$('.flor-lado').forEach((flor) => {
      const izq = flor.classList.contains('flor-izq');
      gsap.fromTo(flor,
        { xPercent: izq ? -130 : 130, rotation: izq ? -220 : 220, scale: 0.4 },
        { xPercent: 0, rotation: izq ? 15 : -15, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: flor.parentElement, start: 'top 85%', end: 'top 35%', scrub: 1.5 } });
    });

    // íconos de tarjetas y del minuto a minuto: aparecen con giro (show-p-x de Carmesí)
    $$('.tarjeta > svg, .linea svg').forEach((ico) => {
      gsap.from(ico, {
        scale: 0, rotation: -120, duration: 0.9, ease: 'back.out(2)',
        scrollTrigger: { trigger: ico, start: 'top 92%', once: true },
      });
    });

    // la página cambia de alto al abrir el sobre y cuando cargan fotos y álbum: recalcular posiciones
    window.refrescarAnimaciones = () => ScrollTrigger.refresh();
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', animar);
  else animar();
})();
