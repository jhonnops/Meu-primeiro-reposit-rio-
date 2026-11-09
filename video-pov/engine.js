// Motor do estilo "POV desenho 3D": cena three.js -> lente olho-de-peixe + contorno de tinta.
// Tudo é determinístico: o quadro depende só do tempo t (segundos).
THREE.ColorManagement.enabled = false;

const W = 1080, H = 1920, FPS = 30;
const SRC_W = 2304, SRC_H = 4096;          // imagem "plana" antes da lente
const THETA_MAX = 62 * Math.PI / 180;      // ângulo no topo/base do quadro (olho-de-peixe)
const SRC_VFOV = 138;                      // campo de visão da imagem plana (cobre os cantos)

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#1a1420');
const camera = new THREE.PerspectiveCamera(SRC_VFOV, W / H, 0.04, 140);
camera.rotation.order = 'YXZ';

const rtColor = new THREE.WebGLRenderTarget(SRC_W, SRC_H, {
  minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
const rtNormal = new THREE.WebGLRenderTarget(SRC_W, SRC_H, {
  minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
rtNormal.depthTexture = new THREE.DepthTexture(SRC_W, SRC_H);
rtNormal.depthTexture.type = THREE.UnsignedIntType;
const normalMat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

const post = new THREE.ShaderMaterial({
  uniforms: {
    tColor: { value: rtColor.texture }, tNormal: { value: rtNormal.texture },
    tDepth: { value: rtNormal.depthTexture },
    aspect: { value: W / H }, thetaMax: { value: THETA_MAX },
    tanHalf: { value: Math.tan(SRC_VFOV * Math.PI / 360) },
    near: { value: camera.near }, far: { value: camera.far },
    px: { value: new THREE.Vector2(1 / W, 1 / H) },
    dark: { value: 0 }, flash: { value: 0 }, line: { value: 2.3 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tColor, tNormal, tDepth;
    uniform float aspect, thetaMax, tanHalf, near, far, dark, flash, line;
    uniform vec2 px;
    vec2 lens(vec2 o){                       // pixel de saída -> ponto na imagem plana
      vec2 p=(o-.5)*2.; p.x*=aspect;
      float r=length(p), th=r*thetaMax;
      float k = r<1e-4 ? thetaMax : tan(th)/r;
      vec2 q=p*k;
      return vec2(q.x/(tanHalf*aspect), q.y/tanHalf)*.5+.5;
    }
    float invz(vec2 s){ float d=texture2D(tDepth,s).x; return 1./near - d*(1./near-1./far); }
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
    void main(){
      vec2 o=line*px;
      vec2 sC=lens(vUv), sL=lens(vUv-vec2(o.x,0.)), sR=lens(vUv+vec2(o.x,0.)),
           sD=lens(vUv-vec2(0.,o.y)), sU=lens(vUv+vec2(0.,o.y));
      vec3 c=texture2D(tColor,sC).rgb;
      vec3 cL=texture2D(tColor,sL).rgb, cR=texture2D(tColor,sR).rgb,
           cD=texture2D(tColor,sD).rgb, cU=texture2D(tColor,sU).rgb;
      vec3 n=texture2D(tNormal,sC).rgb*2.-1.;
      float nd=0.;
      nd=max(nd,1.-dot(n,texture2D(tNormal,sL).rgb*2.-1.));
      nd=max(nd,1.-dot(n,texture2D(tNormal,sR).rgb*2.-1.));
      nd=max(nd,1.-dot(n,texture2D(tNormal,sD).rgb*2.-1.));
      nd=max(nd,1.-dot(n,texture2D(tNormal,sU).rgb*2.-1.));
      float wC=invz(sC), wL=invz(sL), wR=invz(sR), wD=invz(sD), wU=invz(sU);
      float lap=max(abs(wL+wR-2.*wC), abs(wD+wU-2.*wC))/wC;
      float cd=max(max(length(c-cL),length(c-cR)),max(length(c-cD),length(c-cU)));
      float e=max(max(smoothstep(.22,.45,nd), smoothstep(.035,.07,lap)), smoothstep(.20,.34,cd));
      // manchas de aquarela + vinheta
      float blot=vnoise(vUv*vec2(5.,9.))*.6+vnoise(vUv*vec2(13.,23.)+7.)*.4;
      c*= .93+.12*blot;
      c=mix(c, vec3(.075,.055,.09), e*.93);
      vec2 v=(vUv-.5)*vec2(1.25,1.); float vig=smoothstep(.45,1.05,length(v)*1.35);
      c*=1.-.3*vig;
      c*=1.-dark;
      c=mix(c,vec3(1.,.97,.9),flash);
      gl_FragColor=vec4(c,1.);
    }`,
  depthTest: false, depthWrite: false,
});
const postScene = new THREE.Scene();
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

function drawFrame() {
  scene.overrideMaterial = null;
  renderer.setRenderTarget(rtColor); renderer.render(scene, camera);
  scene.overrideMaterial = normalMat;
  renderer.setRenderTarget(rtNormal); renderer.render(scene, camera);
  scene.overrideMaterial = null;
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
}

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ease = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const easeOut = u => { u = clamp(u); return 1 - (1 - u) * (1 - u); };
const seg = (t, a, b) => clamp((t - a) / (b - a));
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const mat = (color, o = {}) => new THREE.MeshLambertMaterial({ color, ...o });
const flat = (color, o = {}) => new THREE.MeshBasicMaterial({ color, ...o });

function box(w, h, d, m, x = 0, y = 0, z = 0, parent = scene) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); parent.add(o); return o;
}
function ball(r, m, x = 0, y = 0, z = 0, parent = scene, sx = 1, sy = 1, sz = 1) {
  const o = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), m);
  o.position.set(x, y, z); o.scale.set(sx, sy, sz); parent.add(o); return o;
}
// "membro": cápsula entre dois pontos, reposicionável a cada quadro
const UP = new THREE.Vector3(0, 1, 0);
function limb(r, m, parent) {
  const o = new THREE.Mesh(new THREE.CapsuleGeometry(r, 1, 6, 14), m); parent.add(o); return o;
}
function setLimb(o, a, b) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  o.position.copy(a).addScaledVector(d, 0.5);
  o.quaternion.setFromUnitVectors(UP, d.normalize());
  o.scale.set(1, len, 1);
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// textura desenhada num canvas 2D (traço preto já vem pintado)
function tex(w, h, draw, repeatX = 1, repeatY = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeatX, repeatY);
  return t;
}
// manchas suaves para dar cara de pintura
function blotch(g, w, h, seed, n = 40, alpha = 0.05) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, s = (0.08 + r() * 0.22) * Math.max(w, h);
    const gr = g.createRadialGradient(x, y, 0, x, y, s);
    const dark = r() < 0.5;
    gr.addColorStop(0, dark ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
}

// ---------- legendas / etiqueta (HTML por cima do canvas) ----------
const elSub = document.getElementById('sub'), elTag = document.getElementById('tag');
function hud(t, subs, tags) {
  const s = subs.find(s => t >= s.a && t < s.b);
  elSub.textContent = s ? s.txt : ''; if (s) elSub.style.color = s.cor;
  const g = tags.find(g => t >= g.a && t < g.b);
  elTag.style.display = g ? 'block' : 'none'; if (g) { elTag.textContent = g.txt; elTag.style.opacity = clamp((g.b - t) * 4); }
}

// ---------- construção de cenário ----------
// repete uma textura com outro "repeat" (mesma imagem)
function rep(t, rx, ry) { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rx, ry); return c; }
// parede vertical entre (x1,z1) e (x2,z2), de y0 a y1
function parede(x1, z1, x2, z2, y0, y1, material) {
  const len = Math.hypot(x2 - x1, z2 - z1);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, y1 - y0), material);
  m.material.side = THREE.DoubleSide;
  m.position.set((x1 + x2) / 2, (y0 + y1) / 2, (z1 + z2) / 2);
  m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
  scene.add(m); return m;
}
// piso ou teto horizontal
function laje(x1, z1, x2, z2, y, material) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(x2 - x1), Math.abs(z2 - z1)), material);
  m.material.side = THREE.DoubleSide; m.rotation.x = -Math.PI / 2;
  m.position.set((x1 + x2) / 2, y, (z1 + z2) / 2); scene.add(m); return m;
}
// quadro plano com textura (placas, retratos, relógios)
function quadro(w, h, t, x, y, z, rotY = 0, parent = scene) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), flat('#ffffff', { map: t, side: THREE.DoubleSide }));
  m.position.set(x, y, z); m.rotation.y = rotY; parent.add(m); return m;
}
// interpola uma lista de chaves [{t, ...numeros}] com suavização
function chave(keys, t) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const u = ease((t - a.t) / (b.t - a.t)), o = {};
      for (const k in b) if (k !== 't') o[k] = lerp(a[k] ?? b[k], b[k], u); return o; }
  }
  return keys[keys.length - 1];
}
// enquete final
const elPoll = document.getElementById('poll');
function enquete(k) { if (elPoll) { elPoll.style.display = k > 0 ? 'block' : 'none'; elPoll.style.opacity = k; } }
