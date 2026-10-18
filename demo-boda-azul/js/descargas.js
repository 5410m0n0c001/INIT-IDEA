// Descargar fotos y videos (solo en el panel de administrador).
// Muestra los videos (incluido "Un poquito de nosotros", que no aparece en la invitación pública),
// las fotos de la sesión, las tarjetas de los pases y las fotos que suben los invitados al álbum.
// Cada cosa se puede descargar con su flechita o seleccionar varias y descargarlas juntas.
// En iPhone, "Guardar en Fotos" usa el menú de compartir (Safari guarda las descargas en Archivos).
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const cfg = window.INVITACION;
  const panel = $('#org-descargas'), lista = $('#desc-lista');
  const btnBajar = $('#desc-bajar'), btnGuardar = $('#desc-guardar'), todo = $('#desc-todo');
  const total = $('#desc-total'), estado = $('#desc-estado');
  if (!panel) return;

  const nombreFoto = (n) => `Renata-y-Mauricio-foto-${String(n).padStart(2, '0')}.jpg`;
  const GRUPOS = [
    { titulo: 'Videos', tipo: 'video', items: [
      { nombre: 'Video de nuestra historia', url: 'video/historia.mp4', poster: 'video/historia-poster.jpg', archivo: 'Renata-y-Mauricio-nuestra-historia.mp4' },
      { nombre: 'Nuestra historia (celular)', url: 'video/nuestra-historia.mp4', poster: 'video/nuestra-historia-poster.jpg', archivo: 'Renata-y-Mauricio-nuestra-historia-celular.mp4' },
      { nombre: 'Un poquito de nosotros', url: 'video/sentenciados.mp4?v=2', poster: 'video/sentenciados-poster.jpg', archivo: 'Renata-y-Mauricio-un-poquito-de-nosotros.mp4' },
    ] },
    { titulo: 'Fotos de la sesión', tipo: 'foto', items: Array.from({ length: 10 }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return { nombre: `Foto ${i + 1}`, url: `img/foto-${n}.jpg`, mini: `img/foto-${n}-sm.jpg`, archivo: nombreFoto(i + 1) };
    }) },
    { titulo: 'Tarjetas de los pases', tipo: 'foto', items: [1, 2, 3, 4, 5].map((n) => (
      { nombre: `Pase de ${n}`, url: `img/pases/pase-${n}.jpg`, mini: `img/pases/pase-${n}.jpg`, archivo: `Pase-${n}-${n === 1 ? 'persona' : 'personas'}.jpg` }
    )) },
  ];
  const elegidos = new Set();
  const todos = [];
  let pintado = false;

  function casilla(item) {
    const c = document.createElement('input');
    c.type = 'checkbox';
    c.className = 'desc-check';
    c.setAttribute('aria-label', `Seleccionar ${item.nombre}`);
    c.addEventListener('change', () => { c.checked ? elegidos.add(item) : elegidos.delete(item); marcar(); });
    item.casilla = c;
    return c;
  }
  function botonBajar(item) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'desc-flecha';
    b.setAttribute('aria-label', `Descargar ${item.nombre}`);
    b.textContent = '↓';
    b.addEventListener('click', async () => { estado.textContent = `Descargando ${item.nombre}…`; await bajar(item); estado.textContent = `Listo: ${item.nombre}`; });
    return b;
  }

  function pintarGrupo(g) {
    const sec = document.createElement('section');
    sec.className = 'desc-grupo';
    const h = document.createElement('h3');
    h.textContent = g.titulo;
    const rejilla = document.createElement('div');
    rejilla.className = g.tipo === 'video' ? 'desc-videos' : 'desc-fotos';
    g.items.forEach((item) => {
      todos.push(item);
      const tarjeta = document.createElement('div');
      tarjeta.className = 'desc-item';
      if (g.tipo === 'video') {
        const v = document.createElement('video');
        v.controls = true; v.playsInline = true; v.preload = 'none'; v.poster = item.poster; v.src = item.url;
        tarjeta.append(v);
      } else {
        const img = document.createElement('img');
        img.src = item.mini; img.alt = item.nombre; img.loading = 'lazy';
        img.addEventListener('click', () => { item.casilla.checked = !item.casilla.checked; item.casilla.dispatchEvent(new Event('change')); });
        tarjeta.append(img);
      }
      const pie = document.createElement('div');
      pie.className = 'desc-item-pie';
      const etiqueta = document.createElement('span');
      etiqueta.textContent = item.nombre;
      pie.append(casilla(item), etiqueta, botonBajar(item));
      tarjeta.append(pie);
      rejilla.append(tarjeta);
    });
    sec.append(h, rejilla);
    lista.append(sec);
    return sec;
  }

  // fotos que subieron los invitados al álbum (Supabase)
  async function grupoAlbum() {
    if (!window.supabase) return;
    const db = window.supabase.createClient(cfg.album.supabaseUrl, cfg.album.supabaseKey);
    const { data, error } = await db.from('fotos').select('url, created_at').eq('album_id', cfg.album.albumId).order('created_at', { ascending: true });
    if (error) return;
    const g = { titulo: `Fotos del álbum de los invitados (${data.length})`, tipo: 'foto', items: data.map((f, i) => (
      { nombre: `Álbum ${i + 1}`, url: f.url, mini: f.url.replace(/\.jpg$/, '_t.jpg'), archivo: `Album-invitados-${String(i + 1).padStart(3, '0')}.jpg` }
    )) };
    if (!data.length) {
      const sec = document.createElement('section');
      sec.className = 'desc-grupo';
      sec.innerHTML = '<h3>Fotos del álbum de los invitados</h3><p class="org-sub">Aquí aparecerán las fotos que suban sus invitados el día de la boda.</p>';
      lista.append(sec);
      return;
    }
    pintarGrupo(g);
    marcar();
  }

  function marcar() {
    const n = elegidos.size;
    total.textContent = n ? `${n} ${n === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}` : 'Nada seleccionado';
    btnBajar.disabled = !n;
    todo.checked = n > 0 && n === todos.length;
    btnGuardar.hidden = true; // si cambia la selección hay que volver a preparar
    preparados = null;
  }
  todo.addEventListener('change', () => {
    todos.forEach((item) => { item.casilla.checked = todo.checked; todo.checked ? elegidos.add(item) : elegidos.delete(item); });
    marcar();
  });

  async function blobDe(item) {
    const r = await fetch(item.url);
    if (!r.ok) throw new Error(`No se pudo descargar ${item.nombre}`);
    return r.blob();
  }
  async function bajar(item) {
    try {
      const b = await blobDe(item);
      const u = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = u; a.download = item.archivo;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 60000);
    } catch (err) { estado.textContent = err.message; }
  }

  // Descargar seleccionados: uno tras otro. Donde se pueda compartir archivos (celular), además
  // se preparan para "Guardar en Fotos" (el segundo toque abre el menú del teléfono).
  let preparados = null;
  btnBajar.addEventListener('click', async () => {
    const sel = [...elegidos];
    btnBajar.disabled = true;
    const archivos = [];
    for (const [i, item] of sel.entries()) {
      estado.textContent = `Descargando ${i + 1} de ${sel.length}…`;
      try {
        const b = await blobDe(item);
        archivos.push(new File([b], item.archivo, { type: b.type || (item.archivo.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg') }));
        const u = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = u; a.download = item.archivo;
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(u), 60000);
        await new Promise((r) => setTimeout(r, 700)); // pausa: algunos navegadores frenan descargas seguidas
      } catch (err) { estado.textContent = err.message; }
    }
    btnBajar.disabled = false;
    estado.textContent = `Listo: ${archivos.length} ${archivos.length === 1 ? 'archivo descargado' : 'archivos descargados'}.`;
    if (archivos.length && navigator.canShare?.({ files: archivos })) {
      preparados = archivos;
      btnGuardar.hidden = false;
      estado.textContent += ' En iPhone, toca “Guardar en Fotos” para pasarlos a tu galería.';
    }
  });
  btnGuardar.addEventListener('click', async () => {
    if (!preparados) return;
    try { await navigator.share({ files: preparados }); } catch (err) { if (err.name !== 'AbortError') estado.textContent = 'No se pudo abrir el menú para guardar.'; }
  });

  // abrir / cerrar
  const envio = $('#org-envio');
  function abrir() {
    if (!pintado) { GRUPOS.forEach(pintarGrupo); grupoAlbum(); pintado = true; marcar(); }
    estado.textContent = '';
    envio.hidden = true;
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function volver() {
    panel.querySelectorAll('video').forEach((v) => v.pause());
    panel.hidden = true;
    window.organizador?.abrir(); // de regreso a "Enviar invitación"
  }
  $('#org-descargas-abrir').addEventListener('click', abrir);
  $('#desc-volver').addEventListener('click', volver);
  $('#desc-cerrar').addEventListener('click', volver);
})();
