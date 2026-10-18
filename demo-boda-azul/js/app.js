(() => {
  const cfg = window.INVITACION;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const silencio = location.search.includes('debug'); // pruebas: sin música ni recorrido guiado

  // ---------- Aviso breve ----------
  let avisoT;
  window.avisar = (texto) => {
    const a = $('#aviso');
    a.textContent = texto;
    a.classList.add('visible');
    clearTimeout(avisoT);
    avisoT = setTimeout(() => a.classList.remove('visible'), 2800);
  };

  // ---------- Sobre + música ----------
  // La música es el sonido del video de la historia (sección antes de la portada). El botón de la bocina
  // solo silencia: el video sigue corriendo.
  const sobre = $('#sobre');
  const video = $('#video-historia');
  const btnMusica = $('#musica');
  const btnCompartir = $('#compartir');
  const nav = $('#navegacion');

  function mostrarControles() {
    btnMusica.hidden = false;
    btnCompartir.hidden = false;
    nav.hidden = false;
  }
  function abrirSobre() {
    if (sobre.classList.contains('abriendo')) return;
    sobre.classList.add('abriendo');
    document.body.classList.remove('sobre-cerrado');
    video.muted = silencio;
    video.play().catch(() => { video.muted = true; video.play().catch(() => {}); }).finally(marcarSonido);
    marcarSonido();
    mostrarControles();
    requestAnimationFrame(() => btnCompartir.classList.add('entra'));
    // con el sobre cerrado la página medía una pantalla: las animaciones recalculan sus posiciones
    requestAnimationFrame(() => window.refrescarAnimaciones?.());
    setTimeout(() => { sobre.remove(); window.refrescarAnimaciones?.(); recorrido(); }, 2700);
  }
  // el sello es el botón accesible; tocar cualquier parte del sobre también abre
  sobre.addEventListener('click', abrirSobre);
  sobre.addEventListener('pointerup', abrirSobre);

  // ---------- Llegada desde el QR de las mesas: ?action=take-photo ----------
  const llegada = $('#llegada');
  function entrarAlAlbum() {
    llegada.remove();
    sobre.remove();
    document.body.classList.remove('sobre-cerrado');
    mostrarControles();
    btnMusica.classList.add('pausada');
    btnCompartir.classList.add('entra');
    window.refrescarAnimaciones?.();
    $('#album').scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  if (window.__volvioDeCamara) {
    // el celular recargó la página al abrir la cámara: regresa al álbum, no al sobre
    entrarAlAlbum();
    addEventListener('load', () => $('#album').scrollIntoView({ behavior: 'instant', block: 'start' }));
  } else if (new URLSearchParams(location.search).get('action') === 'take-photo') {
    llegada.hidden = false;
    $('#llegada-camara').addEventListener('click', () => {
      entrarAlAlbum();
      window.abrirCamara?.(); // en el mismo toque, para que el navegador lo permita
    });
    $('#llegada-ver').addEventListener('click', () => llegada.remove());
  }

  function marcarSonido() {
    const mudo = video.muted || video.paused;
    btnMusica.classList.toggle('pausada', mudo);
    btnMusica.setAttribute('aria-label', mudo ? 'Activar sonido' : 'Silenciar');
  }
  btnMusica.addEventListener('click', () => {
    const activar = video.muted || video.paused; // silenciado o detenido → que suene
    video.muted = !activar;
    if (video.paused) video.play().catch(() => {});
    marcarSonido();
  });
  // pausar si la persona cambia de app
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !video.paused) { video.pause(); video.dataset.reanudar = '1'; }
    else if (!document.hidden && video.dataset.reanudar) { video.play().catch(() => {}); delete video.dataset.reanudar; }
  });

  // ---------- Videos de sección ("Nuestra historia" y "Un poquito de nosotros") ----------
  // Solo traen efectos de sonido, así que suenan junto con la música. Al aparecer
  // intentan reproducirse con sonido; si el navegador no lo permite, arrancan en
  // silencio y el botón deja activarlo. Al salir de la pantalla se pausan.
  [['#video-nuestra-historia', '#nuestra-historia-sonido'],
   ['#video-sentenciados',     '#sentenciados-sonido']].forEach(([selVideo, selBoton]) => {
    const v = $(selVideo), b = $(selBoton);
    if (!v || !b) return;
    function marcar() {
      b.setAttribute('aria-pressed', String(!v.muted));
      b.querySelector('span').textContent = v.muted ? 'Activar sonido' : 'Silenciar';
      b.querySelector('use').setAttribute('href', v.muted ? '#i-sonido' : '#i-silencio');
    }
    b.addEventListener('click', () => { v.muted = !v.muted; v.play().catch(() => {}); marcar(); });
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) { v.pause(); return; }
      if (document.body.classList.contains('sobre-cerrado')) return;
      if (!v.dataset.probado) { v.dataset.probado = '1'; v.muted = silencio; } // primera vez: con sonido
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }).finally(marcar);
    }, { threshold: 0.45 }).observe(v);
  });

  // ---------- Progreso de la portada (--p) y salida de la foto fija (--salida) ----------
  const portada = $('#portada');
  // las variables se escriben solo en los elementos que las usan: en la raíz obligarían a
  // recalcular el estilo de toda la página en cada cuadro de scroll
  const fotoPortada = $('.portada-foto');
  let pendienteP = false, ultP = '', ultS = '';
  function progreso() {
    pendienteP = false;
    const r = portada.getBoundingClientRect();
    const recorrido = r.height - innerHeight;
    const p = reducir || recorrido <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / recorrido));
    // solo cuando cambian: ya pasada la portada no se tocan los estilos en cada scroll
    const vp = p.toFixed(3), vs = Math.min(innerHeight * 1.2, Math.max(0, innerHeight - r.bottom)).toFixed(0);
    if (vp !== ultP) { ultP = vp; portada.style.setProperty('--p', vp); fotoPortada.style.setProperty('--p', vp); }
    if (vs !== ultS) { ultS = vs; fotoPortada.style.setProperty('--salida', vs); }
  }
  addEventListener('scroll', () => { if (!pendienteP) { pendienteP = true; requestAnimationFrame(progreso); } }, { passive: true });
  addEventListener('resize', progreso);
  progreso();

  // ---------- Barra de navegación (demo): resalta la sección que se está viendo ----------
  const enlacesNav = $$('#navegacion a');
  const destinos = enlacesNav.map((a) => $(a.getAttribute('href')));
  let pendienteNav = false;
  function marcarNav() {
    pendienteNav = false;
    let activo = 0;
    destinos.forEach((d, i) => { if (d && d.getBoundingClientRect().top <= innerHeight * 0.45) activo = i; });
    enlacesNav.forEach((a, i) => a.classList.toggle('activo', i === activo));
  }
  addEventListener('scroll', () => { if (!pendienteNav) { pendienteNav = true; requestAnimationFrame(marcarNav); } }, { passive: true });
  marcarNav();

  // ---------- Aparición ----------
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visto'); obs.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('.revelar').forEach((el) => obs.observe(el));
  // escalonar: cada elemento que aparece dentro de una misma sección entra un poco después
  $$('main > section').forEach((sec) => $$('.revelar', sec).forEach((el, i) => el.style.setProperty('--i', Math.min(i, 6))));

  // ---------- Cuenta regresiva (al llegar a cero: celebración) ----------
  const objetivo = new Date(cfg.fechaEvento).getTime();
  const fin = new Date(cfg.finEvento).getTime();
  const celdas = $$('[data-c]'); // portada y sección de fecha
  const dos = (n) => String(n).padStart(2, '0');
  let celebrado = false;
  function tic() {
    const d = Math.max(0, objetivo - Date.now());
    const v = { dias: Math.floor(d / 864e5), horas: Math.floor(d / 36e5) % 24, minutos: Math.floor(d / 6e4) % 60, segundos: Math.floor(d / 1e3) % 60 };
    celdas.forEach((el) => { el.textContent = dos(v[el.dataset.c]); });
    if (d === 0 && Date.now() < fin && !celebrado) celebrar();
  }
  function celebrar() {
    celebrado = true;
    $('#cuenta-fin').hidden = false;
    if (reducir || !window.confetti) return;
    const colores = ['#142a5c', '#4a74c9', '#ffffff', '#b5122f', '#f2c9cf'];
    const ahora = performance.now();
    (function rafaga() {
      window.confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: colores });
      window.confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: colores });
      if (performance.now() - ahora < 3500) requestAnimationFrame(rafaga);
    })();
  }
  tic();
  setInterval(tic, 1000);

  // ---------- Agendar en el calendario ----------
  const fechaCal = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const titulo = cfg.titulo;
  const detalles = 'Ceremonia religiosa a las 4:00 p. m. y recepción en el mismo jardín.' + (cfg.mapa ? `\nUbicación: ${cfg.mapa}` : '');
  const inicio = fechaCal(objetivo), termino = fechaCal(fin);
  $('#cal-google').href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${inicio}/${termino}&details=${encodeURIComponent(detalles)}&location=${encodeURIComponent(cfg.lugar)}`;
  $('#cal-outlook').href = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(titulo)}&startdt=${new Date(objetivo).toISOString()}&enddt=${new Date(fin).toISOString()}&body=${encodeURIComponent(detalles)}&location=${encodeURIComponent(cfg.lugar)}`;
  // Botón principal: en iPhone/iPad/Mac abre el archivo .ics (Calendario lo agrega); en Android abre
  // Google Calendar; en computadora descarga el .ics. 'Otras opciones' muestra todas.
  const btnAgendar = $('#agendar-btn'), opciones = $('#agendar-opciones'), btnMas = $('#agendar-mas');
  const android = /Android/i.test(navigator.userAgent);
  if (android) { btnAgendar.href = $('#cal-google').href; btnAgendar.removeAttribute('download'); btnAgendar.target = '_blank'; }
  else if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) btnAgendar.removeAttribute('download'); // Safari lo abre directo en Calendario
  btnMas.addEventListener('click', () => {
    opciones.hidden = !opciones.hidden;
    btnMas.setAttribute('aria-expanded', String(!opciones.hidden));
  });

  // ---------- Ubicación, clima y regalos (se activan al llenar js/config.js) ----------
  $$('[data-mapa]').forEach((a) => {
    if (cfg.mapa) a.href = cfg.mapa;
    else a.addEventListener('click', (e) => { e.preventDefault(); window.avisar('La ubicación estará disponible muy pronto'); });
  });
  const clima = $('#clima-enlace');
  if (cfg.clima.lat != null) {
    clima.href = `https://www.windy.com/${cfg.clima.lat}/${cfg.clima.lon}?${cfg.clima.lat},${cfg.clima.lon},12`;
    $('#clima-pendiente').hidden = true;
  } else clima.addEventListener('click', (e) => { e.preventDefault(); window.avisar('El pronóstico estará disponible muy pronto'); });

  // ---------- Menú: pestañas ----------
  const pestanas = $$('.menu-pestanas [role="tab"]');
  pestanas.forEach((tab) => tab.addEventListener('click', () => {
    pestanas.forEach((t) => {
      const activa = t === tab;
      t.setAttribute('aria-selected', String(activa));
      const panel = $(`#${t.getAttribute('aria-controls')}`);
      panel.hidden = !activa;
      if (activa) panel.classList.add('visto');
    });
  }));

  // ---------- Visor de fotos (galería y álbum) ----------
  const visor = $('#visor');
  const visorImg = $('.visor-img', visor);
  let lista = [], idx = 0;
  function mostrar(i) {
    idx = (i + lista.length) % lista.length;
    visorImg.src = lista[idx];
    $('.visor-prev', visor).hidden = $('.visor-sig', visor).hidden = lista.length < 2;
  }
  window.visor = {
    abrir(urls, i = 0) {
      lista = urls; mostrar(i);
      visor.hidden = false;
      document.body.style.overflow = 'hidden';
      $('.visor-cerrar', visor).focus();
    },
  };
  function cerrarVisor() { visor.hidden = true; visorImg.removeAttribute('src'); document.body.style.overflow = ''; }
  $('.visor-cerrar', visor).addEventListener('click', cerrarVisor);
  $('.visor-prev', visor).addEventListener('click', () => mostrar(idx - 1));
  $('.visor-sig', visor).addEventListener('click', () => mostrar(idx + 1));
  visor.addEventListener('click', (e) => { if (e.target === visor) cerrarVisor(); });
  addEventListener('keydown', (e) => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrarVisor();
    if (e.key === 'ArrowLeft') mostrar(idx - 1);
    if (e.key === 'ArrowRight') mostrar(idx + 1);
  });
  let x0 = null;
  visor.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  visor.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) mostrar(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  const piezas = $$('#mosaico .m');
  const urlsGaleria = piezas.map((b) => b.dataset.full);
  piezas.forEach((b, i) => b.addEventListener('click', () => window.visor.abrir(urlsGaleria, i)));

  // ---------- Copiar cuenta ----------
  $$('[data-copiar]').forEach((b) => b.addEventListener('click', async () => {
    const dato = $(b.dataset.copiar);
    if (dato.classList.contains('pendiente')) { window.avisar('Los datos bancarios estarán disponibles muy pronto'); return; }
    const texto = dato.textContent.replace(/\s/g, '');
    try { await navigator.clipboard.writeText(texto); window.avisar('Cuenta copiada'); }
    catch { window.avisar(texto); }
  }));

  // ---------- Compartir invitación ----------
  // El menú se abre en el mismo toque (Safari lo exige) mientras el ícono gira y florece en rosa;
  // al cerrarse, la rosa vuelve a ser el ícono de compartir.
  let regreso;
  // `datos` = { title, text, url?, files? }. Lo usa también el modo organizador.
  window.compartir = async (datos) => {
    clearTimeout(regreso);
    btnCompartir.classList.remove('vuelve', 'brilla', 'girando');
    void btnCompartir.offsetWidth; // reinicia la animación si se toca dos veces
    btnCompartir.classList.add('girando');
    const inicioC = performance.now();

    if (navigator.share) {
      try { await navigator.share(datos); } catch (err) { if (err.name !== 'AbortError') console.warn(err); }
    } else {
      // sin menú nativo (algunas computadoras): copia el texto y descarga los pases
      const texto = [datos.text, datos.url].filter(Boolean).join('\n');
      try { await navigator.clipboard.writeText(texto); window.avisar('Mensaje copiado, ¡pégalo donde quieras!'); }
      catch { window.avisar(datos.url || datos.text); }
      (datos.files || []).forEach((f) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(f); a.download = f.name; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      });
    }
    const espera = Math.max(1200, 2500 - (performance.now() - inicioC));
    regreso = setTimeout(() => {
      btnCompartir.classList.remove('girando');
      btnCompartir.classList.add('vuelve');
    }, espera);
  };
  btnCompartir.addEventListener('click', () => {
    if (window.organizador?.activo()) { window.organizador.abrir(); return; } // elige pases primero
    window.compartir({
      title: document.title,
      text: 'Renata y Mauricio te invitan a celebrar su boda el sábado 20 de noviembre de 2027. ¡Acompáñanos!',
      url: location.origin + location.pathname,
    });
  });
  // un destello suave de vez en cuando para recordar que existe
  setInterval(() => {
    if (btnCompartir.hidden || btnCompartir.classList.contains('girando')) return;
    btnCompartir.classList.remove('brilla', 'vuelve'); void btnCompartir.offsetWidth; btnCompartir.classList.add('brilla');
  }, 14000);

  // ---------- WhatsApp: buzón y confirmación ----------
  const abrirWhatsApp = (texto) => {
    if (!cfg.whatsapp) { window.avisar('Las confirmaciones se habilitarán muy pronto'); return; }
    location.href = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(texto)}`;
  };
  // Buzón de deseos: el mensaje puede ir con una imagen (un recuerdo, una selfie o "el detalle" que dejen).
  // Un enlace de WhatsApp no puede llevar imágenes: con imagen se abre el menú de compartir del teléfono
  // (el invitado elige WhatsApp y a los novios) y el texto se copia por si la app no lo pega.
  const fotoDeseo = $('#deseo-foto'), vistaDeseo = $('#deseo-vista'), imgDeseo = $('#deseo-vista-img');
  fotoDeseo.addEventListener('change', () => {
    const f = fotoDeseo.files[0];
    if (imgDeseo.src) URL.revokeObjectURL(imgDeseo.src);
    vistaDeseo.hidden = !f;
    if (f) imgDeseo.src = URL.createObjectURL(f); else imgDeseo.removeAttribute('src');
  });
  $('#deseo-quitar').addEventListener('click', () => { fotoDeseo.value = ''; fotoDeseo.dispatchEvent(new Event('change')); });
  $('#form-deseos').addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = `💌 Un deseo para Renata y Mauricio:\n\n${$('#deseo').value.trim()}`;
    const f = fotoDeseo.files[0];
    if (!f) { abrirWhatsApp(texto); return; }
    const datos = { files: [new File([f], f.name || 'deseo.jpg', { type: f.type || 'image/jpeg' })], text: texto };
    navigator.clipboard?.writeText(texto).catch(() => {}); // sin await: el menú de compartir debe abrirse en el mismo toque
    if (navigator.canShare?.(datos)) {
      window.avisar('Elige WhatsApp y el chat de los novios');
      try { await navigator.share(datos); } catch (err) { if (err.name !== 'AbortError') console.warn(err); }
    } else {
      window.avisar('Tu mensaje se copió: adjunta la imagen en el chat con el clip 📎');
      setTimeout(() => abrirWhatsApp(texto), 1600);
    }
  });
  $('#form-rsvp').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = $('#rsvp-nombre').value.trim();
    const asiste = $('input[name="asiste"]:checked').value === 'si';
    const inv = window.invitado || {}; // viene del enlace con pases (js/pases.js)
    const quien = inv.para && inv.para !== nombre ? `${nombre} (${inv.para})` : nombre;
    let texto;
    if (!asiste) texto = `Hola, soy ${quien}. Lamentablemente no podré asistir a su boda. ¡Muchas felicidades!`;
    else if (inv.lugares) {
      const n = +$('#rsvp-cuantos').value;
      texto = `¡Hola! ${quien} confirma la asistencia de ${n} de ${inv.lugares} ${inv.lugares === 1 ? 'lugar' : 'lugares'} para su boda.`;
    } else texto = `Hola, soy ${quien} y confirmo mi asistencia a su boda.`;
    abrirWhatsApp(texto);
  });

  // ---------- Recorrido guiado (demo): toda la invitación y después el panel del anfitrión ----------
  // Primero recorre cada sección explicando para qué sirve; luego enseña el lado que solo ve quien
  // organiza. Cierra aclarando que el precio depende de cuánto se incluya, no de un "desde $500"
  // que haría pensar que todo lo anterior cuesta eso.
  // Se muestra una vez por teléfono; con ?recorrido en la URL se repite para una demostración.
  function recorrido() {
    const driver = window.driver?.js?.driver;
    if (!driver || silencio) return;
    const repetir = location.search.includes('recorrido');
    if (!repetir) {
      try { if (localStorage.getItem('demo-recorrido')) return; localStorage.setItem('demo-recorrido', '1'); } catch { return; }
    }
    const abrirPanel = () => window.organizador?.abrir();
    const cerrarPanel = () => {
      const f = $('#org-envio');
      if (f && !f.hidden) { f.hidden = true; document.body.style.overflow = ''; }
    };
    const paso = (element, title, description, extra = {}) =>
      (element ? { element, popover: { title, description }, ...extra } : { popover: { title, description }, ...extra });

    const guia = driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Listo',
      progressText: '{{current}} de {{total}}',
      popoverClass: 'recorrido',
      onDestroyStarted: () => { cerrarPanel(); guia.destroy(); },
      steps: [
        paso(null, 'Invitación de muestra',
          'Esta es una invitación real de INIT IDEA con datos de ejemplo. La vamos a recorrer sección por sección para que veas <b>qué hace cada parte</b>, y al final te enseñamos el lado que solo ve quien organiza.'),

        paso('#intro-video', 'Abre con su historia',
          'Lo primero al abrir el sobre es un video. Puede ser su sesión de fotos, un clip de la pedida o el que ustedes quieran. Es el gancho: el invitado se queda viendo antes de leer nada.'),

        paso('#portada', 'Portada y cuenta regresiva',
          'Los nombres, la fecha y los días que faltan, corriendo en vivo. La rosa es un modelo 3D de verdad: se va abriendo conforme el invitado baja.'),

        paso('#navegacion', 'Navegación rápida',
          'Con estos íconos salta a cualquier sección sin deslizar: la fecha, el lugar, su mesa, el menú, los regalos, el álbum o la confirmación.'),

        paso('#fecha', 'Que no se les olvide',
          'Un toque y el evento se guarda en su propio calendario, sea Google, Apple u Outlook, con la hora, el lugar y el enlace. El recordatorio les llega solo.'),

        paso('#lugares', 'Cómo llegar',
          'Dirección y botón de mapa que abre su app de navegación. Más abajo está hasta el <b>pronóstico del clima</b> para ese día, para que sepan cómo vestirse.'),

        paso('#ubica', 'Ubica tu mesa, en 3D',
          'El invitado busca su nombre y el salón gira hasta su mesa. Se acabó el "¿dónde me toca?" y el amontonamiento en la entrada.'),

        paso('#programa', 'Minuto a minuto',
          'La hora exacta de cada momento: ceremonia, cóctel, comida, vals, pastel. Los invitados dejan de preguntar y nadie se pierde lo importante.'),

        paso('#menu', 'El menú',
          'Lo que se va a servir, tiempo por tiempo. Útil de verdad para quien tiene alguna alergia o restricción.'),

        paso('#sentenciados', 'Un poquito de ustedes',
          'Un segundo video, más personal. Aquí cabe lo que quieran: cómo se conocieron, un mensaje para sus invitados o algo que los haga reír.'),

        paso('#vestimenta', 'Código de vestimenta',
          'Qué ponerse y qué colores están reservados, con los tonos a la vista. Para que nadie llegue del color de la novia.'),

        paso('#regalos', 'Regalos',
          'Lluvia de sobres, transferencia o mesa de regalos, lo que ustedes decidan. Con el dato listo para copiar de un toque, sin que nadie tenga que preguntarlo.'),

        paso('#album', 'Álbum en vivo',
          'Durante la fiesta tus invitados suben sus fotos desde su celular y <b>todos las ven al instante</b>. Hay código QR para las mesas y una ruleta de retos que los anima a tomar fotos divertidas. Terminas con cientos de fotos que ningún fotógrafo habría alcanzado.'),

        paso('#buzon', 'Buzón de deseos',
          'Quien no pueda ir, o quiera decirles algo, les deja un mensaje que llega directo a su WhatsApp.'),

        paso('#confirmar', 'Confirmación',
          'Confirma con un toque y la respuesta les llega al celular. Si recibió pases, solo puede confirmar hasta los lugares que le dieron.'),

        paso('#compartir', 'Compartir',
          'Un clic y la invitación viaja a WhatsApp, Instagram, Telegram o correo. A donde sea.'),

        paso('#nombres-portada', 'Ahora, lo que solo ves tú',
          'Hasta aquí, lo que ve tu invitado. Toca <b>3 veces rápido</b> sobre los nombres y se abre el panel de administrador. Pide una clave: en este demo es <b>demo</b>. Tus invitados nunca la ven.'),

        paso('#org-nombre', '1. A quién se la mandas',
          'Escribes el nombre del invitado. Por ejemplo, <b>Familia López</b>. Ese nombre aparece en su sobre y la invitación lo saluda al abrirla.',
          { onHighlightStarted: abrirPanel }),

        paso('#org-pases', '2. Cuántos lugares le das',
          'Tocas el número de personas que entran con ese pase. ¿Van 6? Tocas el 4 y luego el 2. Solo podrá confirmar hasta esos lugares: se acabó el "éramos cuatro pero llegamos siete".',
          { onHighlightStarted: abrirPanel }),

        paso('#org-enviar', '3. Enviar, y listo',
          'Un solo envío lleva su nombre, su enlace y las imágenes de sus pases. Nada de copiar, pegar ni buscar fotos en la galería. Al volver de WhatsApp el panel ya está vacío, listo para el siguiente invitado.',
          { onHighlightStarted: abrirPanel }),

        paso('#org-descargas-abrir', 'Tus fotos y tus videos',
          'Desde aquí descargas los videos, las fotos de la sesión, las tarjetas de los pases y todo lo que subieron tus invitados durante la fiesta.',
          { onHighlightStarted: abrirPanel }),

        // El panel se cierra antes del cierre: si sigue abierto queda encima y el texto no se lee.
        paso(null, '¿Cuánto cuesta algo así?',
          'Acabas de recorrer <b>una de las versiones más completas</b>, con casi todo incluido. No es el precio de entrada.<br><br>Los niveles van <b>desde $500</b> la más sencilla, con portada, fecha, mapa y confirmación, hasta <b>$3,000</b> la Premium con diseño a la medida. Extras como el álbum en vivo, los pases por invitado o la mesa en 3D se suman aparte.<br><br>El precio depende de <b>hasta dónde quieras llegar</b>. Todos los niveles y extras están a la vista, sin que tengas que preguntar:<br><b>5410m0n0c001.github.io/INIT-IDEA</b>',
          { onHighlightStarted: cerrarPanel }),
      ],
    });
    guia.drive();
  }
})();
