// Ruleta de retos fotográficos (debajo del álbum).
// 9 categorías × 20 retos = 180. La ruleta cae en una categoría y se elige un reto al azar
// de ella (sin repetir hasta agotarlos). "Tomar foto del reto" abre la cámara del álbum.
(() => {
  const RETOS = {
    Selfie: [
      'Selfie con alguien que acabas de conocer en la boda.',
      'Selfie con la persona más elegante de tu mesa.',
      'Selfie con los novios (¡si los alcanzas!).',
      'Selfie con las letras gigantes A & J de fondo.',
      'Selfie de toda tu mesa en una sola foto.',
      'Selfie con alguien que lleve algo azul.',
      'Selfie con la persona que vino desde más lejos.',
      'Selfie con el violinista de fondo.',
      'Selfie con tu pareja imitando a los novios.',
      'Selfie con alguien que conozca a los novios desde niños.',
      'Selfie con la persona más alta de la fiesta.',
      'Selfie en la sala lounge como si fueras celebridad.',
      'Selfie con el pastel de fondo (sin tocarlo).',
      'Selfie con alguien de la familia del novio.',
      'Selfie con alguien de la familia de la novia.',
      'Selfie con tu bebida de la barra de cóctel.',
      'Selfie con el cerro y el jardín de fondo.',
      'Selfie haciendo un corazón con las manos.',
      'Selfie con alguien que lleve lentes.',
      'Selfie con un vaso de esquites de la tornafiesta.',
    ],
    Gracioso: [
      'Foto de tu mesa como si fuera la portada de un disco.',
      'Foto de alguien haciendo de mesero por un momento.',
      'Foto "bizcos" de tu mesa completa.',
      'Foto de la reacción más exagerada a un chiste.',
      'Foto de alguien escondido detrás de un centro de mesa.',
      'Foto con la peor pose de modelo que se te ocurra.',
      'Foto de alguien comiendo barbacoa como si fuera lo más delicioso del mundo.',
      'Foto de dos personas con la misma pose sin ponerse de acuerdo.',
      'Foto imitando a alguien de tu mesa (con cariño).',
      'Foto de un "abrazo de oso" sorpresa.',
      'Foto de alguien "atrapando" el ramo antes de tiempo.',
      'Foto de tu mesa haciendo cara de sorpresa.',
      'Foto de alguien dormido... o fingiendo.',
      'Foto con un bigote hecho con una servilleta.',
      'Foto de la cara de alguien haciendo cuentas para la luna de miel.',
      'Foto haciendo "la caída de telenovela".',
      'Foto de tu mesa en cámara lenta (con la pose).',
      'Foto de alguien posando como estatua del jardín.',
      'Foto imitando la pose de los novios en su foto favorita.',
      'Foto de la cara más dramática de la fiesta.',
    ],
    Novios: [
      'Foto de los novios riendo a carcajadas.',
      'Foto de los novios sin que se den cuenta.',
      'Foto de la novia con su papá.',
      'Foto del novio con su mamá.',
      'Foto de los detalles del vestido de la novia.',
      'Foto de los anillos de los novios.',
      'Foto de los novios con todos sus amigos.',
      'Foto de los novios cortando el pastel.',
      'Foto de los novios en su entrada triunfal.',
      'Foto de los novios abrazando a alguien especial.',
      'Foto de los novios desde un ángulo creativo.',
      'Foto de los novios con la persona que viajó más lejos.',
      'Foto de los novios con sus abuelos.',
      'Foto de los novios con tu mesa completa.',
      'Foto de los zapatos de los novios.',
      'Foto de los novios durante el brindis.',
      'Foto de los novios con la pirotecnia de fondo.',
      'Foto de la reacción de los novios en su momento favorito.',
      'Foto haciéndoles a los novios un corazón con las manos.',
      'Foto de los novios mirándose a los ojos.',
    ],
    Mesa: [
      'Foto de tu mesa brindando con lo que tengan en la mano.',
      'Foto de tu mesa formando las letras A & J con los brazos.',
      'Foto de tu mesa en orden de estatura.',
      'Foto de tu mesa con los ojos cerrados (¡a la vez!).',
      'Foto de tu mesa saludando a la cámara.',
      'Foto de tu mesa con el centro de mesa como protagonista.',
      'Foto de tu mesa haciendo la ola.',
      'Foto de tu mesa con las servilletas como sombrero.',
      'Foto de tu mesa con todos señalando a una persona.',
      'Foto de tu mesa como foto de graduación.',
      'Foto de tu mesa en la dinámica de fotos por mesa.',
      'Foto de tu mesa dejando su aportación en la cajita de la luna de miel.',
      'Foto de tu mesa con la mejor sonrisa.',
      'Foto de tu mesa con todos de perfil.',
      'Foto de tu mesa mirando al cielo.',
      'Foto de tu mesa gritando "¡Vivan los novios!".',
      'Foto de tu mesa en la cabina de fotos.',
      'Foto de tu mesa con los platos vacíos (¡qué rico!).',
      'Foto de tu mesa abrazados.',
      'Foto de tu mesa con el jardín de fondo.',
    ],
    Familia: [
      'Foto de la familia de la novia completa.',
      'Foto de la familia del novio completa.',
      'Foto de las dos familias juntas.',
      'Foto de alguien contando una anécdota de los novios de pequeños.',
      'Foto de los papás de los novios juntos.',
      'Foto de los hermanos de los novios.',
      'Foto de tres generaciones juntas.',
      'Foto de los primos todos juntos.',
      'Foto de los padrinos o personas especiales con los novios.',
      'Foto de los abuelos de la fiesta.',
      'Foto de tu familia con los novios.',
      'Foto de la persona mayor de la fiesta.',
      'Foto de la persona más joven de la fiesta.',
      'Foto de tíos y tías brindando juntos.',
      'Foto de un abrazo familiar.',
      'Foto de alguien llorando de emoción.',
      'Foto de la familia en la mesa principal.',
      'Foto de los papás durante el brindis.',
      'Foto de una pareja que lleve muchos años casada.',
      'Foto de tu familia brindando por los novios.',
    ],
    Detalles: [
      'Foto del ramo de la novia.',
      'Foto del botonier del novio.',
      'Foto del centro de mesa.',
      'Foto de la copa azul y transparente.',
      'Foto de la servilleta doblada en corazón o en flor.',
      'Foto de las letras gigantes A & J.',
      'Foto del pastel completo.',
      'Foto de las velas de la ceremonia.',
      'Foto de la mesa principal.',
      'Foto de los sillones rey y reina.',
      'Foto de un detalle azul que te encante.',
      'Foto de la barra de esquites.',
      'Foto de las aguas frescas de la barra.',
      'Foto del jardín al atardecer.',
      'Foto de las luces de la noche.',
      'Foto de las manos de los novios.',
      'Foto de los zapatos de tu mesa.',
      'Foto del cerro al fondo de la ceremonia.',
      'Foto de algo que solo tú notaste.',
      'Foto del plato base vintage.',
    ],
    Pose: [
      'Foto con la pose que haría la novia.',
      'Foto con la pose que haría el novio.',
      'Foto como portada de revista de bodas.',
      'Foto de espaldas caminando como en película.',
      'Foto saltando todos al mismo tiempo.',
      'Foto con la pose de "acabamos de casarnos".',
      'Foto con la pose de superhéroe.',
      'Foto de pareja con un beso en la frente.',
      'Foto haciendo un corazón gigante entre dos personas.',
      'Foto con la pose de "pedida de mano".',
      'Foto de cuerpo completo con el jardín de fondo.',
      'Foto con la pose más elegante.',
      'Foto de perfil a contraluz.',
      'Foto en blanco y negro (edítala antes de subirla).',
      'Foto reflejada en algo.',
      'Foto desde abajo como gigante.',
      'Foto desde arriba como dron.',
      'Foto con la pose más romántica.',
      'Foto riendo de verdad.',
      'Foto de "luna de miel" con lentes de sol.',
    ],
    Momentos: [
      'Foto del momento exacto en que los novios entran.',
      'Foto de la bendición de los alimentos.',
      'Foto del violinista tocando.',
      'Foto del brindis y las palabras de agradecimiento.',
      'Foto del corte del pastel.',
      'Foto de la víbora de la mar con el ramo y el botonier.',
      'Foto de la pirotecnia en cascada.',
      'Foto de la cabina de fotos en acción.',
      'Foto de la barra de esquites en la tornafiesta.',
      'Foto de alguien abrazando a los novios.',
      'Foto de un aplauso para los novios.',
      'Foto de la ceremonia con el cerro de fondo.',
      'Foto de la dinámica de fotos por mesa.',
      'Foto de alguien grabando un video para los novios.',
      'Foto de los novios en la mesa principal.',
      'Foto de los novios saludando mesa por mesa.',
      'Foto del ponche servido con el pastel.',
      'Foto del cóctel de bienvenida.',
      'Foto de despedida con los novios.',
      'Foto del "¡fin del evento, gracias!".',
    ],
    Sorpresa: [
      'Foto de alguien que no esperaba la cámara.',
      'Foto escribiendo "A & J" con algo de la mesa.',
      'Foto con alguien que haya conocido a los novios desde bebés.',
      'Foto de la persona más feliz de la fiesta (a tu juicio).',
      'Foto de algo azul que no sea de la decoración.',
      'Foto de un brindis improvisado.',
      'Foto de dos desconocidos que ya son amigos.',
      'Foto de la mejor carcajada.',
      'Foto de alguien cantando a todo pulmón.',
      'Foto de la persona que más fotos ha tomado.',
      'Foto de un consejo para los novios escrito en una servilleta.',
      'Foto de la luna (si se ve).',
      'Foto de algo que te recuerde a los novios.',
      'Foto de tus pies en el pasto.',
      'Foto de alguien guardando un recuerdo.',
      'Foto de un momento tierno sin posar.',
      'Foto de un niño en la fiesta (con permiso).',
      'Foto de la vista desde tu silla.',
      'Foto de alguien diciendo "¡que vivan los novios!".',
      'Foto libre: sorprende a los novios con tu mejor idea.',
    ],
  };
  const CATEGORIAS = Object.keys(RETOS);
  const SEG = 360 / CATEGORIAS.length;
  const $ = (s) => document.querySelector(s);
  const svg = $('#ruleta-svg');
  if (!svg) return;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- dibujar la ruleta (SVG) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const R = 96;
  const punto = (ang, r) => {
    const a = (ang - 90) * Math.PI / 180; // 0° arriba, sentido horario
    return [r * Math.cos(a), r * Math.sin(a)];
  };
  const rueda = document.createElementNS(NS, 'g');
  rueda.setAttribute('class', 'ruleta-rueda');
  CATEGORIAS.forEach((cat, i) => {
    const [x1, y1] = punto(i * SEG, R), [x2, y2] = punto((i + 1) * SEG, R);
    const sector = document.createElementNS(NS, 'path');
    sector.setAttribute('d', `M0 0L${x1.toFixed(2)} ${y1.toFixed(2)}A${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`);
    sector.setAttribute('class', i % 2 ? 'sector-b' : 'sector-a');
    rueda.append(sector);
    const t = document.createElementNS(NS, 'text');
    const medio = i * SEG + SEG / 2;
    // texto a lo largo del radio, leyendo del centro hacia afuera
    t.setAttribute('transform', `rotate(${medio - 90}) translate(${R * 0.6} 0)`);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.textContent = cat;
    rueda.append(t);
  });
  const aro = document.createElementNS(NS, 'circle');
  aro.setAttribute('r', R); aro.setAttribute('class', 'ruleta-aro');
  rueda.append(aro);
  svg.append(rueda);

  // ---------- girar ----------
  const btnGirar = $('#ruleta-girar'), carta = $('#reto-carta');
  const usados = Object.fromEntries(CATEGORIAS.map((c) => [c, []]));
  let giro = 0, girando = false;
  window.retoActual = null;

  function elegirReto(cat) {
    const lista = RETOS[cat];
    if (usados[cat].length >= lista.length) usados[cat] = [];
    let i;
    do { i = Math.floor(Math.random() * lista.length); } while (usados[cat].includes(i));
    usados[cat].push(i);
    return lista[i];
  }

  function girar() {
    if (girando) return;
    girando = true;
    btnGirar.disabled = true;
    carta.hidden = true;
    const destino = Math.floor(Math.random() * CATEGORIAS.length);
    // gira varias vueltas y deja el centro del sector destino bajo la aguja (arriba), con algo de azar
    const dentro = (Math.random() - 0.5) * SEG * 0.7;
    const final = 360 - (destino * SEG + SEG / 2 + dentro);
    const actual = ((giro % 360) + 360) % 360;
    giro += (reducir ? 360 : 360 * 5) + ((final - actual + 360) % 360);
    rueda.style.transition = `transform ${reducir ? 0.4 : 4.6}s cubic-bezier(.12,.7,.1,1)`;
    rueda.style.transform = `rotate(${giro}deg)`;
    setTimeout(() => {
      const cat = CATEGORIAS[destino];
      const reto = elegirReto(cat);
      window.retoActual = { cat, reto };
      $('#reto-cat').textContent = cat;
      $('#reto-texto').textContent = reto;
      carta.hidden = false;
      girando = false;
      btnGirar.disabled = false;
      btnGirar.textContent = 'Otra vez';
    }, reducir ? 450 : 4700);
  }
  btnGirar.addEventListener('click', girar);
  $('#reto-otro').addEventListener('click', girar);
  // "Tomar foto del reto": misma cámara del álbum (album.js)
  $('#reto-foto').addEventListener('click', () => window.abrirCamara?.());
})();
