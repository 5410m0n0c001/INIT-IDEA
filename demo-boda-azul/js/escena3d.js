// Escena 3D que acompaña todo el scroll (basada en la rosa de la XV Azul).
//  - Portada: la rosa azul se abre pétalo por pétalo con el scroll (morph "Abierta").
//  - Después viaja entre secciones según su data-lado, y CAMBIA de objeto según su data-3d:
//      rosa, anillos, corazon, reloj, pin, campanas, copa, banquete, monio, regalo,
//      clima, camara, instagram, sobre (ver js/modelos3d.js).
//      Al cambiar de sección el objeto se encoge girando y aparece el siguiente.
//  - data-lado:
//      izq / der  → en escritorio se coloca de ese lado y el contenido ocupa el otro;
//                   en celular se asoma por esa orilla.
//      cierre     → la rosa se cierra y se posa en el hueco sobre la confirmación.
//      final      → pequeña y entreabierta en la despedida.
// Un solo canvas fijo detrás del contenido. Sin WebGL quedan las imágenes de respaldo.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MODELOS } from './modelos3d.js?v=20261015a';

const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gamaBaja = (navigator.hardwareConcurrency || 4) <= 4 && (navigator.deviceMemory || 4) <= 4;
const escritorio = matchMedia('(min-width: 900px)');
const capa = document.getElementById('escena-3d');
const portada = document.getElementById('portada');
const slotCierre = document.querySelector('[data-rosa-slot="cierre"]');
const slotFinal = document.querySelector('[data-rosa-slot="final"]');
const secciones = [...document.querySelectorAll('[data-lado]')];
const frentes = [...document.querySelectorAll('[data-frente]')];
const intro = document.getElementById('intro-video');
const ESCALA_OBJETO = 0.85; // los objetos miden más que la cabeza de la rosa

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const clamp01 = (v) => clamp(v, 0, 1);
const suave = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const rebote = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

// Pose por tipo de sección. x, y en fracción de media pantalla; s escala;
// a apertura de la rosa (0 capullo, 1 abierta); o opacidad de la capa; m objeto.
function pose(el) {
  const tipo = el.dataset.lado;
  const m = el.dataset['3d'] || 'rosa';
  const pc = escritorio.matches;
  switch (tipo) {
    case 'izq':
    case 'der': {
      const lado = tipo === 'izq' ? -1 : 1;
      // fotos: el objeto pasa POR DELANTE mientras la foto entra girando (se cruzan)
      if (el.hasAttribute('data-frente')) return pc ? { x: 0.3 * lado, y: 0.1, s: 0.62, a: 1, o: 1, m } : { x: 0.45 * lado, y: 0.18, s: 0.5, a: 1, o: 1, m };
      if (pc) return { x: 0.52 * lado, y: 0, s: 0.72, a: 1, o: 1, m };
      // celular: secciones de texto → el objeto se asoma por su lado y el texto se recorre al otro (CSS).
      // Secciones a todo lo ancho (fotos, fecha, galería, álbum) → solo se asoma por la orilla.
      return el.hasAttribute('data-ancho')
        ? { x: 0.78 * lado, y: 0.3, s: 0.52, a: 1, o: 1, m }
        : { x: 0.7 * lado, y: 0.04, s: 0.56, a: 1, o: 1, m };
    }
    case 'cierre': {
      const r = slotCierre.getBoundingClientRect();
      const y = clamp(1 - (r.top + r.height * 0.4) / (innerHeight / 2), -0.8, 0.8);
      return { x: 0, y, s: pc ? 0.42 : 0.5, a: 0.06, o: 1, m: 'rosa' };
    }
    case 'final': {
      // se posa abierta en su hueco, entre la foto y los textos de la despedida
      const r = slotFinal.getBoundingClientRect();
      const y = clamp(1 - (r.top + r.height * 0.36) / (innerHeight / 2), -0.85, 0.85); // la flor arriba, el tallo hacia los textos
      return { x: 0, y, s: pc ? 0.36 : 0.42, a: 0.85, o: 1, m: 'rosa' };
    }
    default: return { x: 0, y: 0.04, s: 1, a: 1, o: 1, m: 'rosa' }; // fin de la portada
  }
}

function hayWebGL() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

async function iniciar() {
  if (!hayWebGL()) return;

  const renderer = new THREE.WebGLRenderer({ antialias: devicePixelRatio < 2, alpha: true, powerPreference: 'high-performance' });
  // en celular basta 1.5x: se ve nítida y usa ~45 % menos memoria gráfica que 2x
  let pr = Math.min(devicePixelRatio, gamaBaja ? 1 : (innerWidth < 900 ? 1.25 : 2)); // en celular 1.25x: nítida y ligera
  renderer.setPixelRatio(pr);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;

  const key = new THREE.DirectionalLight(0xfff1e0, 2.2); key.position.set(2.5, 3, 3);
  const rim = new THREE.DirectionalLight(0x8fb0ff, 2.4); rim.position.set(-3, 1.5, -2.5);
  const fill = new THREE.DirectionalLight(0xffffff, 0.7); fill.position.set(0, -2, 3);
  scene.add(key, rim, fill);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);

  // ----- rosa azul (modelo glTF con morph "Abierta")
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(new URL('../models/rosa.glb', import.meta.url).href);
  const rosa = new THREE.Group();
  rosa.add(gltf.scene);

  const matPetalo = new THREE.MeshPhysicalMaterial({
    vertexColors: true, color: '#2f5aa8', roughness: 0.4, metalness: 0,
    clearcoat: 0.5, clearcoatRoughness: 0.3,
    sheen: 0.8, sheenColor: new THREE.Color('#8fb0ff'), sheenRoughness: 0.45,
    side: THREE.DoubleSide,
  });
  const matTallo = new THREE.MeshStandardMaterial({ color: '#1f4a2c', metalness: 0.1, roughness: 0.5, side: THREE.DoubleSide });
  let petalos = null;
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    if (o.morphTargetInfluences) {
      petalos = o; o.material = matPetalo;
      // los colores del modelo vienen en azul: se dejan solo como sombreado (luminancia)
      const col = o.geometry.getAttribute('color');
      if (col) {
        for (let i = 0; i < col.count; i++) {
          const l = Math.pow(0.2126 * col.getX(i) + 0.7152 * col.getY(i) + 0.0722 * col.getZ(i), 0.6);
          col.setXYZ(i, l, l, l);
        }
        col.needsUpdate = true;
      }
    } else o.material = matTallo;
  });
  if (!petalos) throw new Error('rosa.glb sin morph target');

  // ----- objetos que se alternan con la rosa (se construyen la primera vez que se necesitan)
  const objetos = { rosa };
  const objeto = (m) => {
    if (!objetos[m]) {
      const crear = MODELOS[m];
      if (!crear) return rosa;
      const g = crear();
      g.scale.multiplyScalar(ESCALA_OBJETO);
      objetos[m] = g;
    }
    return objetos[m];
  };

  // ----- destellos dorados alrededor del objeto (viajan con él)
  const N = gamaBaja ? 45 : 90;
  const pos = new Float32Array(N * 3), fase = new Float32Array(N), tamanos = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 0.9 + Math.random() * 1.5, th = Math.random() * Math.PI * 2, y = (Math.random() - 0.35) * 2.2;
    pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
    fase[i] = Math.random() * 6.28; tamanos[i] = 0.5 + Math.random() * 1.3;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aFase', new THREE.BufferAttribute(fase, 1));
  geo.setAttribute('aTam', new THREE.BufferAttribute(tamanos, 1));
  const matDestello = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, // brillan sobre el cielo nocturno
    uniforms: { uT: { value: 0 }, uPR: { value: pr }, uBrillo: { value: 0.3 } },
    vertexShader: /* glsl */`
      attribute float aFase; attribute float aTam;
      uniform float uT; uniform float uPR; uniform float uBrillo;
      varying float vA;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = 0.5 + 0.5 * sin(uT * 1.7 + aFase);
        vA = uBrillo * tw * tw;
        gl_PointSize = aTam * uPR * (22.0 / -mv.z) * (0.6 + 0.4 * tw);
      }`,
    fragmentShader: /* glsl */`
      varying float vA;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float nucleo = smoothstep(0.5, 0.0, d);
        float cruz = max(smoothstep(0.06, 0.0, abs(c.x)), smoothstep(0.06, 0.0, abs(c.y))) * smoothstep(0.5, 0.1, d);
        float a = clamp((nucleo * nucleo + cruz * 0.6) * vA, 0.0, 1.0);
        gl_FragColor = vec4(0.86, 0.68, 0.32, a);
      }`,
  });
  const destellos = new THREE.Points(geo, matDestello);
  const pieza = new THREE.Group(); // el objeto visible (rosa u otro); gira y aparece/desaparece
  pieza.add(rosa);
  const ancla = new THREE.Group(); // mueve pieza + destellos juntos por la pantalla
  ancla.add(pieza, destellos);
  scene.add(ancla);
  let modeloActual = 'rosa';
  function cambiarA(m) {
    pieza.remove(objeto(modeloActual));
    modeloActual = m;
    pieza.add(objeto(m));
  }

  // ----- encuadre: esfera (centro, radio) vista desde una dirección
  const dir = new THREE.Vector3(), objetivo = new THREE.Vector3();
  const derecha = new THREE.Vector3(), arriba = new THREE.Vector3();
  let mediaAlto = 1, mediaAncho = 1; // media pantalla en unidades del mundo, en el plano del objetivo
  function encuadrar(cx, cy, radio, dy) {
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const dist = radio / Math.sin(Math.min(vfov, hfov) / 2);
    dir.set(0, dy, 1).normalize();
    objetivo.set(cx, cy, 0);
    camera.position.copy(objetivo).addScaledVector(dir, dist);
    camera.lookAt(objetivo);
    camera.updateMatrixWorld();
    mediaAlto = dist * Math.tan(vfov / 2);
    mediaAncho = mediaAlto * camera.aspect;
    derecha.setFromMatrixColumn(camera.matrixWorld, 0);
    arriba.setFromMatrixColumn(camera.matrixWorld, 1);
  }
  const holgura = () => (camera.aspect > 0.8 ? 1.22 : 1); // en pantallas anchas manda la altura
  function encuadrePortada(p) {
    const e = suave(0, 0.85, p);
    encuadrar(0, lerp(-0.62, 0.12, e), lerp(1.3 * holgura(), 1.0, e), lerp(0.22, 1.05, e));
  }

  // ----- estado
  const actual = { x: 0, y: 0, s: 1, a: 0, o: 1, f: 1 };
  let inclX = 0, inclY = 0, inclXObj = 0, inclYObj = 0;
  const reloj = new THREE.Clock();
  let t = 0, ultimoScroll = 0, cuadro = 0;
  addEventListener('scroll', () => { ultimoScroll = performance.now(); }, { passive: true });

  function tam() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }

  function progresoPortada() {
    const r = portada.getBoundingClientRect();
    const recorrido = r.height - innerHeight;
    return recorrido > 0 ? clamp01(-r.top / recorrido) : 1;
  }

  // pose objetivo según qué sección está al centro de la pantalla
  function poseScroll() {
    const rp = portada.getBoundingClientRect();
    if (rp.bottom >= innerHeight) return null; // seguimos en la portada
    const centro = innerHeight / 2;
    let prevC = rp.bottom - innerHeight, prevP = pose(portada);
    for (const sec of secciones) {
      const r = sec.getBoundingClientRect();
      const c = r.top + r.height / 2 - centro;
      const p = pose(sec);
      if (c > 0) {
        let k = clamp01((0 - prevC) / (c - prevC));
        k = reducir ? (k < 0.5 ? 0 : 1) : suave(0.18, 0.82, k); // descansa y luego viaja
        const mezcla = mezclar(prevP, p, k);
        // a la mitad del viaje se cambia de objeto: el anterior se encoge y el nuevo crece
        if (prevP.m !== p.m) { mezcla.m = k < 0.5 ? prevP.m : p.m; mezcla.f = Math.abs(1 - 2 * k); }
        else { mezcla.m = p.m; mezcla.f = 1; }
        return mezcla;
      }
      prevC = c; prevP = p;
    }
    return { ...prevP, f: 1 };
  }
  const mezclar = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), a: lerp(a.a, b.a, k), o: lerp(a.o, b.o, k) });

  let ultimaOpacidad = '', capaOculta = false, capaAlFrente = false;
  function dibujar(dt) {
    t += dt;
    const suavizado = dt === 0 ? 1 : 1 - Math.exp(-dt * 6);
    let giro, destino;

    const pPortada = reducir ? 1 : progresoPortada();
    const enScroll = poseScroll();
    encuadrePortada(enScroll ? 1 : pPortada);
    if (!enScroll) {
      destino = { x: 0, y: 0.04, s: 1, a: suave(0.04, 0.72, pPortada), o: 1, m: 'rosa', f: 1 };
      giro = pPortada * 1.9;
    } else {
      destino = enScroll;
      giro = 1.9 + (scrollY - (portada.offsetHeight - innerHeight)) * 0.0014;
    }
    if (!reducir) giro += t * 0.12;

    // mientras se ve el video de la historia, la escena 3D no aparece
    if (intro && intro.getBoundingClientRect().bottom > innerHeight * 0.4) destino.o = 0;

    // si el objeto destino es otro, primero se encoge el actual (aunque el scroll vaya rápido)
    if (destino.m !== modeloActual) {
      destino.f = 0;
      if (actual.f < 0.04 || dt === 0) cambiarA(destino.m);
    }

    for (const k of ['x', 'y', 's', 'a', 'o', 'f']) actual[k] += (destino[k] - actual[k]) * suavizado;
    if (reducir) Object.assign(actual, destino, { f: 1 });

    inclX += (inclXObj - inclX) * (1 - Math.exp(-dt * 4));
    inclY += (inclYObj - inclY) * (1 - Math.exp(-dt * 4));
    const a = reducir ? actual.a : actual.a * (0.97 + 0.03 * Math.sin(t * 1.3)); // respira
    petalos.morphTargetInfluences[0] = a;
    const f = clamp01(actual.f);
    const vuelta = (1 - f) * 2.6; // giro extra mientras cambia de objeto
    const obj = objeto(modeloActual);
    const oscila = obj.userData.oscila;
    pieza.rotation.set(inclX, (oscila ? Math.sin(giro * 0.9) * 0.55 : giro) + inclY + vuelta, 0);
    if (oscila) pieza.position.y = Math.sin(t * 1.1) * 0.04; else pieza.position.y = 0;
    pieza.scale.setScalar(Math.max(0.0001, reducir ? 1 : rebote(f)));
    ancla.position.set(0, 0, 0)
      .addScaledVector(derecha, actual.x * mediaAncho)
      .addScaledVector(arriba, actual.y * mediaAlto);
    ancla.scale.setScalar(actual.s);
    destellos.rotation.y = -t * 0.05;
    matDestello.uniforms.uBrillo.value = lerp(0.35, 0.9, modeloActual === 'rosa' ? a : 1) * clamp01(actual.o * 1.4);
    matDestello.uniforms.uT.value = t;
    // (lecturas del DOM antes de escribir estilos: evita recalcular el diseño dos veces por cuadro)
    // la capa 3D sube por encima del contenido mientras una foto cruza el centro de la pantalla
    let alFrente = false;
    for (const f of frentes) { const r = f.getBoundingClientRect(); if (r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.25) { alFrente = true; break; } }
    // solo se escribe en el DOM cuando el valor cambia (cada escritura obliga a recalcular estilos)
    const op = actual.o.toFixed(2);
    if (op !== ultimaOpacidad) { capa.style.opacity = op; ultimaOpacidad = op; }
    const oculta = actual.o < 0.02;
    if (oculta !== capaOculta && !pausada) { capa.style.visibility = oculta ? 'hidden' : ''; capaOculta = oculta; }
    if (oculta) return; // invisible (p. ej. durante el video): no se dibuja
    if (alFrente !== capaAlFrente) { capa.classList.toggle('al-frente', alFrente); capaAlFrente = alFrente; }
    renderer.render(scene, camera);
  }

  // calidad adaptativa: si va lento, baja la resolución una vez
  let muestras = 0, acumulado = 0, bajado = false;
  function medir(dt) {
    if (bajado || dt <= 0 || dt > 0.25) return;
    acumulado += dt; muestras++;
    if (muestras === 90) {
      if (acumulado / muestras > 1 / 40) {
        pr = 1; renderer.setPixelRatio(pr); matDestello.uniforms.uPR.value = pr; tam(); bajado = true;
      }
      muestras = 0; acumulado = 0;
    }
  }

  let pausada = false;
  function bucle() {
    requestAnimationFrame(bucle);
    const dt = Math.min(reloj.getDelta(), 0.1);
    if (document.hidden || pausada) return;
    if (reducir) { if (performance.now() - ultimoScroll < 200) dibujar(0); return; }
    // sin scroll reciente basta con 30 fps (ahorra batería)
    cuadro++;
    const quieto = performance.now() - ultimoScroll > 800;
    if (quieto && cuadro % 2) return;
    dibujar(quieto ? dt * 2 : dt);
    medir(quieto ? dt * 2 : dt);
  }

  capa.appendChild(renderer.domElement);
  tam();
  addEventListener('resize', () => { tam(); dibujar(0); });
  if (!reducir) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      inclYObj = (e.clientX / innerWidth - 0.5) * 0.5;
      inclXObj = (e.clientY / innerHeight - 0.5) * 0.25;
    }, { passive: true });
  }
  // Antes de abrir la cámara se libera la memoria gráfica (evita que el celular cierre la pestaña)
  window.__escena3d = {
    pausar() {
      if (pausada) return;
      pausada = true;
      capa.style.visibility = 'hidden';
      renderer.setSize(1, 1, false); // suelta el framebuffer grande
    },
    reanudar() {
      if (!pausada) return;
      pausada = false;
      capa.style.visibility = ''; capaOculta = false;
      tam();
      dibujar(0);
    },
  };
  if (location.search.includes('debug')) {
    window.__estado3d = () => ({ modeloActual, actual: { ...actual }, pose: poseScroll() });
    window.__avanzar3d = (seg = 2) => { for (let i = 0; i < seg * 30; i++) dibujar(1 / 30); return modeloActual; }; // pruebas con la pestaña oculta
  }
  document.body.classList.add('escena-3d-lista');
  dibujar(0);
  bucle();
}

iniciar().catch((err) => console.warn('Escena 3D no disponible, se usan imágenes de respaldo:', err));
// Siempre empezar desde el principio al abrir o recargar (no restaurar la posición anterior)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);
// solo mientras el sobre sigue cerrado: si ya entraron (p. ej. al álbum desde el QR), no los regresa
addEventListener('load', () => { if (document.getElementById('sobre')) scrollTo(0, 0); });
// ¿El celular cerró la pestaña mientras la cámara estaba abierta? (marca de menos de 10 min)
window.__volvioDeCamara = (() => {
  try {
    const t = +sessionStorage.getItem('camara-pendiente');
    sessionStorage.removeItem('camara-pendiente');
    return t > 0 && Date.now() - t < 10 * 60 * 1000;
  } catch { return false; }
})();
addEventListener('pageshow', (e) => { if (e.persisted) location.reload(); }); // volver con "atrás" también reinicia
