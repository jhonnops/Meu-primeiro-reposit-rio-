// TESTE DE ESTILO (10 s): corrida em POV num corredor, giro de 180°, personagem falando.
const DUR = 10;

// ---------- luz ----------
const amb = new THREE.AmbientLight('#ffffff', 2.55); scene.add(amb);
const sol = new THREE.DirectionalLight('#fff2dc', 1.0); sol.position.set(0.5, 1, 0.35); scene.add(sol);

// ---------- corredor ----------
const Z0 = 26, Z1 = -44, LEN = Z0 - Z1, ZC = (Z0 + Z1) / 2, LARG = 3.4, ALT = 3.0, MOD = 4;
const tPiso = tex(512, 512, (g, w, h) => {
  g.fillStyle = '#d9cdb4'; g.fillRect(0, 0, w, h); blotch(g, w, h, 11, 50, 0.06);
  g.strokeStyle = '#2a2230'; g.lineWidth = 5; g.strokeRect(0, 0, w, h);
  g.fillStyle = 'rgba(70,110,120,.16)'; g.fillRect(w * 0.3, 0, w * 0.4, h);
}, LARG / 1.1, LEN / 1.1);
const piso = new THREE.Mesh(new THREE.PlaneGeometry(LARG, LEN), mat('#ffffff', { map: tPiso }));
piso.rotation.x = -Math.PI / 2; piso.position.set(0, 0, ZC); scene.add(piso);
const tTeto = tex(256, 256, (g, w, h) => { g.fillStyle = '#e9e2d6'; g.fillRect(0, 0, w, h); blotch(g, w, h, 5, 30, 0.05);
  g.strokeStyle = '#3a3140'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 2); g.lineTo(w, 2); g.stroke(); }, 1, LEN / 2);
const teto = new THREE.Mesh(new THREE.PlaneGeometry(LARG, LEN), mat('#ffffff', { map: tTeto }));
teto.rotation.x = Math.PI / 2; teto.position.set(0, ALT, ZC); scene.add(teto);
const tParede = (cor, seed) => tex(256, 256, (g, w, h) => { g.fillStyle = cor; g.fillRect(0, 0, w, h); blotch(g, w, h, seed, 36, 0.055); }, LEN / 3, 1);
// parede esquerda (janelas) e direita (armários): faixa de baixo colorida, de cima clara
[-1, 1].forEach(s => {
  const x = s * LARG / 2;
  const baixo = new THREE.Mesh(new THREE.PlaneGeometry(LEN, 1.05), mat('#ffffff', { map: tParede('#2f6f8f', 21 + s) }));
  baixo.rotation.y = -s * Math.PI / 2; baixo.position.set(x, 0.525, ZC); scene.add(baixo);
  const cima = new THREE.Mesh(new THREE.PlaneGeometry(LEN, ALT - 1.05), mat('#ffffff', { map: tParede('#f0dcb8', 31 + s) }));
  cima.rotation.y = -s * Math.PI / 2; cima.position.set(x, (ALT + 1.05) / 2, ZC); scene.add(cima);
  box(0.05, 0.07, LEN, flat('#1f2c3a'), x - s * 0.02, 1.07, ZC);       // friso
});
// fundos do corredor
const tSaida = tex(256, 96, (g, w, h) => { g.fillStyle = '#1f9d55'; g.fillRect(0, 0, w, h); g.strokeStyle = '#17121c'; g.lineWidth = 8; g.strokeRect(0, 0, w, h);
  g.fillStyle = '#fff'; g.font = 'bold 62px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SAÍDA', w / 2, h / 2 + 4); });
[[Z1, 1], [Z0, -1]].forEach(([z, s]) => {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(LARG, ALT), mat('#e8d2ae')); p.position.set(0, ALT / 2, z); if (s < 0) p.rotation.y = Math.PI; scene.add(p);
  box(1.5, 2.25, 0.08, mat('#c0492b'), 0, 1.125, z + s * 0.05);                                  // porta dupla
  box(0.03, 2.25, 0.1, flat('#17121c'), 0, 1.125, z + s * 0.055);
  box(0.5, 0.05, 0.06, mat('#d8d8d8'), -0.38, 1.05, z + s * 0.12); box(0.5, 0.05, 0.06, mat('#d8d8d8'), 0.38, 1.05, z + s * 0.12);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.34), flat('#ffffff', { map: tSaida })); pl.position.set(0, 2.55, z + s * 0.06); if (s < 0) pl.rotation.y = Math.PI; scene.add(pl);
});

// vista da janela: céu esverdeado doentio, prédios escuros, lua
const tFora = tex(512, 320, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#12383a'); gr.addColorStop(0.65, '#3f9a6c'); gr.addColorStop(1, '#b9d86a');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#eef7b0'; g.beginPath(); g.arc(380, 80, 34, 0, 7); g.fill(); g.strokeStyle = '#17121c'; g.lineWidth = 5; g.stroke();
  const r = rng(77); g.lineWidth = 5;
  for (let i = 0, x = -10; x < w; i++) { const bw = 50 + r() * 60, bh = 70 + r() * 130; g.fillStyle = i % 2 ? '#1d2b3a' : '#24364a';
    g.fillRect(x, h - bh, bw, bh); g.strokeRect(x, h - bh, bw, bh);
    g.fillStyle = '#e8c95a'; for (let k = 0; k < 4; k++) if (r() < 0.5) g.fillRect(x + 10 + (k % 2) * 22, h - bh + 14 + Math.floor(k / 2) * 30, 10, 14);
    x += bw; }
});
const tArmario = tex(256, 512, (g, w, h) => {
  g.fillStyle = '#e08a2c'; g.fillRect(0, 0, w, h); blotch(g, w, h, 3, 20, 0.06);
  g.strokeStyle = '#17121c'; g.lineWidth = 7; g.strokeRect(0, 0, w, h);
  g.lineWidth = 5; for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo(i * w / 3, 0); g.lineTo(i * w / 3, h); g.stroke(); }
  for (let i = 0; i < 3; i++) { const x = i * w / 3 + w / 6; g.lineWidth = 4; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 22, 50 + k * 14); g.lineTo(x + 22, 50 + k * 14); g.stroke(); }
    g.fillStyle = '#17121c'; g.fillRect(x + 14, 250, 9, 34); }
});
const tPorta = tex(256, 512, (g, w, h) => {
  g.fillStyle = '#7a4a2a'; g.fillRect(0, 0, w, h); blotch(g, w, h, 9, 20, 0.07);
  g.strokeStyle = '#17121c'; g.lineWidth = 10; g.strokeRect(0, 0, w, h);
  g.fillStyle = '#bfe0e6'; g.fillRect(70, 60, 116, 150); g.lineWidth = 6; g.strokeRect(70, 60, 116, 150);
  g.fillStyle = '#d9d9d9'; g.beginPath(); g.arc(210, 290, 13, 0, 7); g.fill(); g.stroke();
});
const tCartaz = tex(128, 160, (g, w, h) => { g.fillStyle = '#f7f1e1'; g.fillRect(0, 0, w, h); g.strokeStyle = '#17121c'; g.lineWidth = 7; g.strokeRect(0, 0, w, h);
  g.fillStyle = '#d5232f'; g.fillRect(16, 18, w - 32, 34); g.fillStyle = '#17121c'; for (let i = 0; i < 5; i++) g.fillRect(16, 70 + i * 16, (w - 32) * (i % 2 ? 0.7 : 1), 6); });

const lampadas = [];
const mLuz = flat('#fffbe8');
for (let z = Z0 - MOD / 2, i = 0; z > Z1; z -= MOD, i++) {
  // esquerda: janela
  const xe = -LARG / 2;
  const v = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.5), flat('#ffffff', { map: tFora })); v.rotation.y = Math.PI / 2; v.position.set(xe + 0.012, 1.95, z); scene.add(v);
  const mq = flat('#1f2c3a');
  box(0.09, 0.09, 3.0, mq, xe + 0.04, 2.72, z); box(0.09, 0.09, 3.0, mq, xe + 0.04, 1.18, z);
  box(0.09, 1.6, 0.09, mq, xe + 0.04, 1.95, z - 1.47); box(0.09, 1.6, 0.09, mq, xe + 0.04, 1.95, z + 1.47); box(0.06, 1.5, 0.06, mq, xe + 0.035, 1.95, z);
  // direita: armários ou porta, alternados
  const xd = LARG / 2;
  if (i % 3 === 1) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.15), mat('#ffffff', { map: tPorta })); p.rotation.y = -Math.PI / 2; p.position.set(xd - 0.03, 1.075, z); scene.add(p);
    box(0.08, 2.25, 1.16, mat('#4d2c18'), xd - 0.01, 1.125, z);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), flat('#ffffff', { map: tCartaz })); c.rotation.y = -Math.PI / 2; c.position.set(xd - 0.012, 1.75, z + 1.25); scene.add(c);
  } else {
    const a = box(0.42, 1.95, 3.3, mat('#e08a2c'), xd - 0.21, 0.975, z);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.95), mat('#ffffff', { map: tArmario })); f.material.map = tArmario.clone(); f.material.map.repeat.set(3, 1);
    f.rotation.y = -Math.PI / 2; f.position.set(xd - 0.425, 0.975, z); scene.add(f);
  }
  // luminária
  box(0.5, 0.06, 1.5, flat('#2a2530'), 0, ALT - 0.03, z);
  lampadas.push(box(0.36, 0.03, 1.36, mLuz, 0, ALT - 0.065, z));
  ball(0.06, mat('#c8222c'), xd - 0.02, 2.5, z - 1.9, scene, 0.4, 1, 1);     // sirene de incêndio
}

// bagunça no chão: papéis, mochila, cone
{
  const r = rng(2024), cores = ['#f7f3ea', '#f2b8c6', '#f4c74f', '#bcd7f0', '#f7f3ea'];
  for (let i = 0; i < 70; i++) {
    const p = box(0.21, 0.006, 0.3, mat(cores[i % cores.length]), (r() - 0.5) * 2.2, 0.006, lerp(Z0 - 2, Z1 + 2, r()));
    p.rotation.y = r() * 6.28;
  }
  const moch = new THREE.Group(); moch.position.set(-0.85, 0, -9.5); moch.rotation.y = 0.6; scene.add(moch);
  ball(0.2, mat('#7a3fa0'), 0, 0.17, 0, moch, 1, 0.85, 0.7); ball(0.11, mat('#5d2d80'), 0, 0.12, 0.13, moch, 1, 0.8, 0.5);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 18), mat('#f26a1b')); cone.position.set(0.7, 0.07, -14.5); cone.rotation.z = 1.45; scene.add(cone);
}

// ---------- elenco ----------
const pov = criaPOV({ pele: '#c98a5a', manga: '#3f8f5a', calca: '#2b3350', tenis: '#f2efe8', bico: '#f0b429' });
const nina = criaPersonagem({ pele: '#b9774a', nariz: '#a86539', roupa: '#f2c230', calca: '#3a2f5c', cabelo: '#28343f', presilha: '#e8486a', escala: 0.93 });
nina.g.rotation.y = Math.PI;

// ---------- roteiro do teste ----------
const ROSA = '#ffb3d1', BRANCO = '#ffffff';
const SUBS = [
  { a: 2.3, b: 4.5, txt: 'Ei! Espera! Não abre essa porta!', cor: ROSA },
  { a: 5.5, b: 8.3, txt: 'Ainda tem alguém lá fora. Eu vi pela janela.', cor: ROSA },
  { a: 8.5, b: 9.5, txt: 'Quem?', cor: BRANCO },
];
const TAGS = [{ a: 0, b: 2.6, txt: 'TESTE DE ESTILO' }];
const FALAS_NINA = [[5.5, 6.75], [6.95, 8.2]];

// distância percorrida: 4,3 m/s e freia entre 3,5 s e 4,4 s
function distancia(t) { const v = 4.3, a = 3.5, b = 4.4;
  if (t < a) return v * t; const u = clamp((t - a) / (b - a)); return v * a + v * (b - a) * (u - u * u / 2); }
const Z_INI = 3, Z_FIM = Z_INI - distancia(99);

function renderFrame(i) {
  const t = i / FPS;
  // --- protagonista (câmera) ---
  const correr = 1 - ease(seg(t, 3.5, 4.3));
  const fase = distancia(t) / 4.3 * (2 * Math.PI / 0.8);
  const giro = ease(seg(t, 4.0, 4.55));
  pov.rig.position.set(0.05 * Math.sin(t * 1.3) * correr, 0, Z_INI - distancia(t));
  pov.rig.rotation.y = Math.PI * giro;
  const olhaNina = ease(seg(t, 4.5, 5.4));
  const susto = ease(seg(t, 9.15, 9.3));
  const maoQuem = ease(seg(t, 8.35, 8.7)) * (1 - ease(seg(t, 9.2, 9.6)));
  posaPOV(pov, {
    correr, fase,
    pitch: lerp(-0.2, -0.07, olhaNina) + 0.015 * Math.sin(t * 2.1) * (1 - correr),
    roll: 0.5 * Math.sin(giro * Math.PI) * 0.16,
    altura: 1.55 - 0.05 * Math.sin(giro * Math.PI),
    maos: [null, { pos: V(0.2, 1.0, -0.42), cotovelo: V(0.32, 0.9, -0.02), fecha: 0.0, k: maoQuem }],
  });

  // --- Nina ---
  const chegada = seg(t, 2.2, 5.5);                       // vem correndo atrás e freia
  const dist = lerp(12, 1.35, easeOut(chegada));
  const nCorrer = 1 - ease(seg(t, 5.0, 5.5));
  nina.g.position.set(0.12, 0, pov.rig.position.z + dist);
  const falando = FALAS_NINA.some(([a, b]) => t >= a && t < b);
  const gritando = t >= 2.3 && t < 4.3;
  const aponta = ease(seg(t, 6.9, 7.2)) * (1 - ease(seg(t, 8.2, 8.6)));
  posaPersonagem(nina, {
    correr: nCorrer, fase: t * 2 * Math.PI / 0.62,
    respira: 0.012 * Math.sin(t * 5.2) * (1 - nCorrer),
    boca: susto > 0.5 ? 'susto' : (falando || gritando) ? bocaFalando(t) : (t > 5.0 && t < 5.5 ? 'meia' : 'fechada'),
    sobr: lerp(-0.9, -0.3, susto), arregala: susto,
    olhar: [lerp(0, 0.25, aponta) * (1 - susto), lerp(0.35, 1.0, susto)],
    piscar: susto > 0 ? 0 : piscada(t, 2.3, 0.9),
    cabecaX: -0.14 - 0.1 * susto, cabecaInc: 0.07 * Math.sin(t * 1.7) * (1 - nCorrer) * (1 - susto),
    cabecaY: 0.25 * aponta,
    // braço esquerdo dela (lado das janelas) aponta para fora
    maoD: aponta > 0.01 ? V(lerp(0.25, 0.52, aponta), lerp(0.74, 1.2, aponta), lerp(0, 0.12, aponta)) : null,
  });

  // --- luzes piscam no fim ---
  const pisca = t > 9.15 ? ((Math.floor(t * 30) % 5 < 2 && t < 9.6) ? 0.55 : (t < 9.6 ? 0.1 : 0.62)) : 0;
  amb.intensity = 2.55 * (1 - pisca * 0.5);
  mLuz.color.set(pisca > 0.3 ? '#4a4652' : '#fffbe8');
  post.uniforms.dark.value = Math.max(pisca * 0.75, ease(seg(t, 9.8, 10)) * 1);

  hud(t, SUBS, TAGS);
  drawFrame();
}
window.renderFrame = renderFrame; window.TOTAL = DUR * FPS; window.pronto = true;
