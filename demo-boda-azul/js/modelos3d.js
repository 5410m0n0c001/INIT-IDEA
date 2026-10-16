// Objetos 3D que acompañan el scroll (además de la rosa, que viene de models/rosa.glb).
// Todos se construyen con geometría de Three.js: no hay que descargar nada extra.
// Cada función devuelve un THREE.Group centrado en el origen y de ~1.3 unidades de ancho.
// `oscila: true` → en lugar de dar vueltas completas, se mece de frente (íconos con cara).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const M = {
  oro: new THREE.MeshPhysicalMaterial({ color: '#e6c27a', metalness: 1, roughness: 0.2, clearcoat: 0.5 }),
  plata: new THREE.MeshPhysicalMaterial({ color: '#e3e7ee', metalness: 1, roughness: 0.16 }),
  marino: new THREE.MeshPhysicalMaterial({ color: '#1d3473', roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25, sheen: 0.6, sheenColor: new THREE.Color('#6d8ee0') }),
  azul: new THREE.MeshPhysicalMaterial({ color: '#4a74c9', roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.88 }),
  blanco: new THREE.MeshPhysicalMaterial({ color: '#fbf9f4', roughness: 0.45, clearcoat: 0.3, sheen: 0.5, sheenColor: new THREE.Color('#ffffff') }),
  corazon: new THREE.MeshPhysicalMaterial({ color: '#2f5aa8', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.5, sheenColor: new THREE.Color('#9fbcff') }),
  porcelana: new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05 }),
  cera: new THREE.MeshPhysicalMaterial({ color: '#1d3a7c', roughness: 0.42, clearcoat: 0.6 }),
  vidrio: new THREE.MeshPhysicalMaterial({ color: '#eef4ff', roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
  diamante: new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0, clearcoat: 1, metalness: 0.15, envMapIntensity: 3, flatShading: true }),
  oscuro: new THREE.MeshPhysicalMaterial({ color: '#0d1733', roughness: 0.08, clearcoat: 1 }),
  verde: new THREE.MeshPhysicalMaterial({ color: '#7cb342', roughness: 0.35, clearcoat: 0.6 }),
  sol: new THREE.MeshPhysicalMaterial({ color: '#f7c948', roughness: 0.3, emissive: '#f2a900', emissiveIntensity: 0.35, clearcoat: 0.6 }),
};

const malla = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };
const grupo = (...hijos) => { const g = new THREE.Group(); g.add(...hijos); return g; };
const torno = (puntos, seg = 64) => new THREE.LatheGeometry(puntos.map(([x, y]) => new THREE.Vector2(x, y)), seg);

function anillos() {
  const oro = malla(new THREE.TorusGeometry(0.42, 0.075, 28, 110), M.oro, -0.22, -0.02, 0);
  oro.rotation.set(0.25, 0.55, 0);
  const aro = malla(new THREE.TorusGeometry(0.36, 0.055, 28, 110), M.plata);
  const engaste = malla(new THREE.CylinderGeometry(0.07, 0.045, 0.09, 16), M.plata, 0, 0.43, 0);
  const piedra = malla(new THREE.OctahedronGeometry(0.11, 0), M.diamante, 0, 0.53, 0);
  piedra.scale.set(1, 1.25, 1);
  const plata = grupo(aro, engaste, piedra);
  plata.position.set(0.24, -0.04, 0.05);
  plata.rotation.set(-0.2, -0.5, 0.12);
  return grupo(oro, plata);
}

function corazon() {
  const s = new THREE.Shape();
  s.moveTo(25, 25);
  s.bezierCurveTo(25, 25, 20, 0, 0, 0);
  s.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  s.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  s.bezierCurveTo(60, 77, 80, 55, 80, 35);
  s.bezierCurveTo(80, 35, 80, 0, 50, 0);
  s.bezierCurveTo(35, 0, 25, 25, 25, 25);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 14, bevelEnabled: true, bevelThickness: 9, bevelSize: 8, bevelSegments: 8, curveSegments: 40 });
  geo.center();
  geo.rotateZ(Math.PI); // la forma viene con el eje Y hacia abajo; girar (no reflejar) conserva las caras
  geo.scale(0.0125, 0.0125, 0.0125);
  return grupo(malla(geo, M.corazon));
}

function texturaMapa() {
  // plano de calles: manzanas, avenidas, un parque y un río (lo que hace leer "ubicación" y no "globo")
  const c = document.createElement('canvas');
  c.width = 768; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#f3efe4'; x.fillRect(0, 0, 768, 512);
  x.fillStyle = '#e2dccb';
  for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) x.fillRect(i * 88 + 14, j * 88 + 12, 66, 66); // manzanas
  x.fillStyle = '#bfe0b0'; x.fillRect(278, 188, 154, 154); // parque (el jardín)
  x.strokeStyle = '#9fc3ef'; x.lineWidth = 26; x.beginPath(); x.moveTo(0, 470); x.bezierCurveTo(250, 380, 450, 520, 768, 400); x.stroke(); // río
  x.strokeStyle = '#ffffff'; x.lineWidth = 16;
  x.beginPath(); x.moveTo(0, 96); x.lineTo(768, 150); x.moveTo(520, 0); x.lineTo(470, 512); x.stroke(); // avenidas
  x.strokeStyle = '#f2c46d'; x.lineWidth = 6;
  x.beginPath(); x.moveTo(0, 96); x.lineTo(768, 150); x.moveTo(520, 0); x.lineTo(470, 512); x.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function pin() {
  // alfiler azul marino clavado en un mapa doblado en acordeón (3 paneles)
  const cabeza = malla(new THREE.SphereGeometry(0.3, 48, 32), M.marino, 0, 0.62, 0);
  const punta = malla(new THREE.ConeGeometry(0.265, 0.56, 48, 1, true), M.marino, 0, 0.23, 0);
  punta.rotation.x = Math.PI;
  const punto = malla(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 40), M.blanco, 0, 0.64, 0.28);
  punto.rotation.x = Math.PI / 2;
  const sombra = malla(new THREE.CircleGeometry(0.12, 32), new THREE.MeshBasicMaterial({ color: '#0c1b40', transparent: true, opacity: 0.25, depthWrite: false }), 0, -0.035, 0.02);
  sombra.rotation.x = -Math.PI / 2;

  const tex = texturaMapa();
  const papel = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, side: THREE.DoubleSide });
  const mapa = new THREE.Group();
  const ancho = 0.5, fondo = 1.0, doblez = 0.32;
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.PlaneGeometry(ancho, fondo);
    const uv = geo.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / 3); // cada panel muestra su tercio del plano
    const panel = malla(geo, papel);
    const giro = i === 1 ? -doblez : doblez; // zigzag
    const pivote = new THREE.Group();
    pivote.position.set((i - 1) * ancho * Math.cos(doblez), i === 1 ? 0.08 : 0, 0);
    panel.rotation.set(-Math.PI / 2, giro, 0);
    pivote.add(panel);
    mapa.add(pivote);
  }
  mapa.position.y = -0.06;
  mapa.rotation.x = 0.35; // inclinado hacia la cámara para que se lean las calles
  const alfiler = grupo(cabeza, punta, punto, sombra);
  alfiler.position.set(0.02, 0.02, 0.05);
  const g = grupo(mapa, alfiler);
  g.position.y = -0.15;
  const todo = grupo(g);
  todo.userData.oscila = true;
  return todo;
}

function reloj() {
  const caja = malla(new THREE.CylinderGeometry(0.62, 0.62, 0.16, 72), M.oro);
  caja.rotation.x = Math.PI / 2;
  const cara = malla(new THREE.CylinderGeometry(0.54, 0.54, 0.02, 72), M.blanco, 0, 0, 0.082);
  cara.rotation.x = Math.PI / 2;
  const bisel = malla(new THREE.TorusGeometry(0.575, 0.04, 16, 80), M.oro, 0, 0, 0.085);
  const g = grupo(caja, cara, bisel);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const marca = malla(new THREE.BoxGeometry(0.03, i % 3 ? 0.06 : 0.11, 0.02), M.marino, Math.sin(a) * 0.45, Math.cos(a) * 0.45, 0.1);
    marca.rotation.z = -a;
    g.add(marca);
  }
  // manecillas a las 4:00, la hora de la ceremonia
  const aguja = (largo, ancho, ang) => {
    const m = malla(new THREE.BoxGeometry(ancho, largo, 0.02), M.marino, Math.sin(ang) * largo / 2, Math.cos(ang) * largo / 2, 0.115);
    m.rotation.z = -ang;
    return m;
  };
  g.add(aguja(0.3, 0.045, (4 / 12) * Math.PI * 2), aguja(0.42, 0.03, 0), malla(new THREE.SphereGeometry(0.04, 16, 12), M.oro, 0, 0, 0.12));
  const corona = malla(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 24), M.oro, 0, 0.68, 0);
  const argolla = malla(new THREE.TorusGeometry(0.13, 0.03, 12, 40), M.oro, 0, 0.86, 0);
  g.add(corona, argolla);
  g.userData.oscila = true;
  return g;
}

function campanas() {
  // campana clásica de porcelana con filos dorados; el perfil gira alrededor del eje Y
  const perfil = torno([
    [0, 0.42], [0.07, 0.42], [0.12, 0.38], [0.15, 0.3], [0.17, 0.16], [0.19, 0.02], [0.23, -0.1],
    [0.3, -0.2], [0.38, -0.27], [0.43, -0.31], [0.42, -0.33], [0.36, -0.3], [0.27, -0.22],
    [0.2, -0.1], [0.16, 0.05], [0.14, 0.2], [0.11, 0.33], [0.06, 0.38], [0, 0.38],
  ], 72);
  const campana = (x, giro) => {
    const labio = malla(new THREE.TorusGeometry(0.425, 0.022, 12, 80), M.oro, 0, -0.32, 0);
    labio.rotation.x = Math.PI / 2;
    const banda = malla(new THREE.TorusGeometry(0.178, 0.014, 10, 64), M.oro, 0, 0.12, 0);
    banda.rotation.x = Math.PI / 2;
    const c = grupo(
      malla(perfil, M.porcelana), labio, banda,
      malla(new THREE.SphereGeometry(0.05, 20, 14), M.oro, 0, 0.44, 0),
      malla(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), M.oro, 0, -0.2, 0),
      malla(new THREE.SphereGeometry(0.065, 20, 14), M.oro, 0, -0.36, 0), // badajo
    );
    c.position.set(x, -0.12, 0);
    c.rotation.z = giro;
    return c;
  };
  // moño azul marino que une las dos campanas
  const lazo = (lado) => {
    const l = malla(new THREE.TorusGeometry(0.13, 0.045, 14, 40), M.marino, lado * 0.15, 0.42, 0.04);
    l.scale.set(1.15, 0.62, 0.55);
    l.rotation.z = lado * 0.25;
    return l;
  };
  const cola = (lado) => {
    const t = malla(new RoundedBoxGeometry(0.07, 0.34, 0.025, 2, 0.01), M.marino, lado * 0.09, 0.24, 0.07);
    t.rotation.z = lado * 0.45;
    return t;
  };
  const nudo = malla(new THREE.SphereGeometry(0.065, 20, 14), M.marino, 0, 0.42, 0.06);
  nudo.scale.set(1, 0.85, 0.8);
  const g = grupo(campana(-0.3, 0.3), campana(0.3, -0.3), lazo(-1), lazo(1), cola(-1), cola(1), nudo);
  g.userData.oscila = true;
  return g;
}

function copa() {
  const pie = malla(torno([[0, -0.78], [0.3, -0.78], [0.31, -0.75], [0.05, -0.7], [0.035, -0.62], [0.035, -0.12], [0.06, -0.06], [0, -0.06]]), M.azul);
  const caliz = malla(torno([[0.06, -0.06], [0.3, 0.06], [0.5, 0.24], [0.56, 0.36], [0.54, 0.37]]), M.vidrio);
  const bebida = malla(torno([[0, -0.03], [0.28, 0.08], [0.46, 0.24], [0, 0.24]]), new THREE.MeshPhysicalMaterial({ color: '#ffb36b', roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.85 }));
  const borde = malla(new THREE.TorusGeometry(0.55, 0.012, 8, 80), M.azul, 0, 0.365, 0);
  borde.rotation.x = Math.PI / 2;
  const limon = malla(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32), M.verde, 0.5, 0.42, 0);
  limon.rotation.set(Math.PI / 2, 0, 0.5);
  const g = grupo(pie, caliz, bebida, borde, limon);
  g.position.y = 0.15;
  return grupo(g);
}

function banquete() {
  const plato = malla(torno([[0, -0.42], [0.82, -0.42], [0.86, -0.36], [0.7, -0.38], [0, -0.38]], 72), M.blanco);
  const filo = malla(new THREE.TorusGeometry(0.84, 0.018, 8, 90), M.oro, 0, -0.37, 0);
  filo.rotation.x = Math.PI / 2;
  const domo = malla(new THREE.SphereGeometry(0.64, 56, 24, 0, Math.PI * 2, 0, Math.PI / 2), M.plata, 0, -0.38, 0);
  domo.scale.y = 0.9;
  const perilla = malla(new THREE.SphereGeometry(0.085, 20, 14), M.oro, 0, 0.27, 0);
  const cuello = malla(new THREE.CylinderGeometry(0.035, 0.05, 0.08, 16), M.oro, 0, 0.2, 0);
  return grupo(plato, filo, domo, perilla, cuello);
}

function monio() {
  const marinoDoble = M.marino.clone();
  marinoDoble.side = THREE.DoubleSide; // el ala reflejada queda bien iluminada por ambos lados
  const ala = (lado) => {
    const s = new THREE.Shape();
    // la forma se dibuja ya reflejada (escalar en negativo voltearía las caras)
    s.moveTo(0, 0.1);
    s.lineTo(0.55 * lado, 0.32);
    s.quadraticCurveTo(0.72 * lado, 0, 0.55 * lado, -0.32);
    s.lineTo(0, -0.1);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 5, curveSegments: 24 });
    geo.translate(0, 0, -0.06);
    return malla(geo, marinoDoble);
  };
  const nudo = malla(new RoundedBoxGeometry(0.24, 0.3, 0.22, 4, 0.07), M.marino);
  const g = grupo(ala(1), ala(-1), nudo);
  g.userData.oscila = true;
  return g;
}

function regalo() {
  const caja = malla(new RoundedBoxGeometry(0.9, 0.72, 0.9, 4, 0.04), M.marino, 0, -0.2, 0);
  const tapa = malla(new RoundedBoxGeometry(0.98, 0.18, 0.98, 4, 0.04), M.marino, 0, 0.22, 0);
  const g = grupo(caja, tapa);
  for (const [w, d] of [[0.15, 1.0], [1.0, 0.15]]) {
    g.add(malla(new THREE.BoxGeometry(w, 0.74, d * 0.92), M.oro, 0, -0.2, 0));
    g.add(malla(new THREE.BoxGeometry(w * 1.02, 0.2, d), M.oro, 0, 0.22, 0));
  }
  for (const lado of [-1, 1]) {
    const lazo = malla(new THREE.TorusGeometry(0.15, 0.05, 14, 36), M.oro, lado * 0.15, 0.4, 0);
    lazo.rotation.set(0, 0, lado * 0.5);
    lazo.scale.set(1, 0.7, 0.6);
    g.add(lazo);
  }
  g.add(malla(new THREE.SphereGeometry(0.07, 16, 12), M.oro, 0, 0.36, 0));
  return g;
}

function camara() {
  const cuerpo = malla(new RoundedBoxGeometry(1.25, 0.78, 0.42, 5, 0.1), M.marino);
  const visor = malla(new RoundedBoxGeometry(0.36, 0.2, 0.3, 3, 0.05), M.marino, -0.25, 0.44, 0);
  const lente = malla(new THREE.CylinderGeometry(0.31, 0.33, 0.24, 48), M.plata, 0, -0.02, 0.28);
  lente.rotation.x = Math.PI / 2;
  const cristal = malla(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 48), M.oscuro, 0, -0.02, 0.4);
  cristal.rotation.x = Math.PI / 2;
  const brillo = malla(new THREE.SphereGeometry(0.05, 12, 8), M.blanco, -0.07, 0.06, 0.42);
  const flash = malla(new RoundedBoxGeometry(0.2, 0.1, 0.05, 2, 0.02), M.blanco, 0.38, 0.24, 0.21);
  const boton = malla(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 24), M.azul, 0.38, 0.42, 0);
  const g = grupo(cuerpo, visor, lente, cristal, brillo, flash, boton);
  g.userData.oscila = true;
  return g;
}

function degradadoInstagram() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const d = x.createLinearGradient(0, 256, 256, 0);
  [['#feda75', 0], ['#fa7e1e', 0.28], ['#d62976', 0.55], ['#962fbf', 0.78], ['#4f5bd5', 1]].forEach(([col, p]) => d.addColorStop(p, col));
  x.fillStyle = d;
  x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function instagram() {
  const base = malla(new RoundedBoxGeometry(1.2, 1.2, 0.24, 6, 0.3), (() => { const t = degradadoInstagram(); return new THREE.MeshPhysicalMaterial({ map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: 0.55, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }); })() /* brillo propio: colores vivos aunque la luz sea suave */);
  const rect = (s, w, r) => {
    s.moveTo(-w + r, -w); s.lineTo(w - r, -w); s.quadraticCurveTo(w, -w, w, -w + r);
    s.lineTo(w, w - r); s.quadraticCurveTo(w, w, w - r, w); s.lineTo(-w + r, w);
    s.quadraticCurveTo(-w, w, -w, w - r); s.lineTo(-w, -w + r); s.quadraticCurveTo(-w, -w, -w + r, -w);
    return s;
  };
  const marco = rect(new THREE.Shape(), 0.4, 0.13);
  marco.holes.push(rect(new THREE.Path(), 0.33, 0.08));
  const geo = new THREE.ExtrudeGeometry(marco, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 3, curveSegments: 12 });
  const g = grupo(base, malla(geo, M.blanco, 0, 0, 0.12), malla(new THREE.TorusGeometry(0.15, 0.04, 16, 48), M.blanco, 0, 0, 0.15), malla(new THREE.SphereGeometry(0.045, 16, 12), M.blanco, 0.21, 0.21, 0.15));
  g.userData.oscila = true;
  return g;
}

function sobre() {
  const cuerpo = malla(new RoundedBoxGeometry(1.3, 0.86, 0.06, 2, 0.02), new THREE.MeshPhysicalMaterial({ color: '#e4ecf9', roughness: 0.5, sheen: 0.4 }));
  const s = new THREE.Shape();
  s.moveTo(-0.64, 0.42); s.lineTo(0.64, 0.42); s.lineTo(0, -0.08); s.closePath();
  const solapa = malla(new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false }), new THREE.MeshPhysicalMaterial({ color: '#c9d7f0', roughness: 0.5 }), 0, 0, 0.032);
  const sello = malla(new THREE.CylinderGeometry(0.16, 0.17, 0.05, 40), M.cera, 0, -0.06, 0.06);
  sello.rotation.x = Math.PI / 2;
  const relieve = malla(new THREE.TorusGeometry(0.1, 0.015, 8, 32), M.cera, 0, -0.06, 0.09);
  const g = grupo(cuerpo, solapa, sello, relieve);
  g.userData.oscila = true;
  return g;
}

function clima() {
  const sol = grupo(malla(new THREE.SphereGeometry(0.32, 40, 24), M.sol));
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const rayo = malla(new THREE.ConeGeometry(0.06, 0.18, 12), M.sol, Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0);
    rayo.rotation.z = a - Math.PI / 2;
    sol.add(rayo);
  }
  sol.position.set(-0.18, 0.22, -0.1);
  const nube = grupo(
    malla(new THREE.SphereGeometry(0.26, 32, 20), M.blanco, -0.2, 0, 0),
    malla(new THREE.SphereGeometry(0.34, 32, 20), M.blanco, 0.08, 0.1, 0),
    malla(new THREE.SphereGeometry(0.24, 32, 20), M.blanco, 0.38, -0.02, 0),
    malla(new RoundedBoxGeometry(0.9, 0.26, 0.42, 4, 0.12), M.blanco, 0.09, -0.1, 0),
  );
  nube.position.set(0.12, -0.25, 0.25);
  const g = grupo(sol, nube);
  g.userData.oscila = true;
  return g;
}

export const MODELOS = { anillos, corazon, pin, reloj, campanas, copa, banquete, monio, regalo, camara, instagram, sobre, clima };
