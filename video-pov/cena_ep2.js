// FICA NA LUZ — Episódio 1 (plano-sequência em primeira pessoa, ~85 s)
// Regra do mundo: apagão. Quem fica no escuro some; só sobram os sapatos.
const DUR = 85, PI = Math.PI;
scene.background = new THREE.Color('#060a16');

// ============ tempos ============
const T_LAMP = { l16: 3.2, l14: 5.0, l12: 6.4 };         // luzes do fundo do mercado apagando
const T_CARRINHO = 7.0, T_PEGA = 14.4, T_RUA = 16.4;
const T_ESTOURO = 26.3, T_CEL = 27.4, T_BATERIA = 47.6, T_CORRE = 62.0, T_MORRE = 66.0;
const T_TOQUE = 69.6, T_OUTRA = 76.0, T_OLHOS = 79.3, T_FIM = 80.3;

// ============ texturas ============
const tAsfalto = tex(512, 512, (g, w, h) => { g.fillStyle = '#4a4650'; g.fillRect(0, 0, w, h); blotch(g, w, h, 2, 60, 0.07);
  g.strokeStyle = '#2a2630'; g.lineWidth = 4; const r = rng(9);
  for (let i = 0; i < 7; i++) { let x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 3; k++) { x += (r() - .5) * 90; y += (r() - .5) * 90; g.lineTo(x, y); } g.stroke(); } });
const tCalcada = tex(256, 256, (g, w, h) => { g.fillStyle = '#8f8a86'; g.fillRect(0, 0, w, h); blotch(g, w, h, 7, 30, 0.07); g.strokeStyle = '#3a3640'; g.lineWidth = 5; g.strokeRect(0, 0, w, h); });
const tPisoLoja = tex(256, 256, (g, w, h) => { g.fillStyle = '#d8d2c2'; g.fillRect(0, 0, w, h); g.fillStyle = '#c3bca9'; g.fillRect(0, 0, w / 2, h / 2); g.fillRect(w / 2, h / 2, w / 2, h / 2); blotch(g, w, h, 4, 30, 0.06);
  g.strokeStyle = '#3a3640'; g.lineWidth = 4; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); });
const tParedeLoja = tex(256, 256, (g, w, h) => { g.fillStyle = '#e6dcc0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8553a'; g.fillRect(0, h * 0.62, w, h * 0.1); blotch(g, w, h, 5, 40, 0.06); });
const tTetoLoja = tex(256, 256, (g, w, h) => { g.fillStyle = '#cfcabd'; g.fillRect(0, 0, w, h); blotch(g, w, h, 6, 30, 0.06); g.strokeStyle = '#4a4650'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); });
const tPrateleira = tex(512, 256, (g, w, h) => { g.fillStyle = '#6a6470'; g.fillRect(0, 0, w, h); const r = rng(5), cs = ['#d5232f', '#f2c230', '#3f8f5a', '#4a7fb5', '#e8843a', '#f6f1ea', '#8a5ab0'];
  for (let l = 0; l < 4; l++) { const y = l * 64; g.fillStyle = '#2a2630'; g.fillRect(0, y + 56, w, 8);
    for (let x = 4; x < w - 20;) { const bw = 18 + r() * 26, bh = 26 + r() * 24; g.fillStyle = cs[Math.floor(r() * cs.length)]; g.fillRect(x, y + 56 - bh, bw, bh); g.strokeStyle = '#17121c'; g.lineWidth = 3; g.strokeRect(x, y + 56 - bh, bw, bh); x += bw + 3 + (r() < 0.12 ? 30 : 0); } } });
const tTV = tex(512, 288, (g, w, h) => { g.fillStyle = '#7a0d14'; g.fillRect(0, 0, w, h); g.fillStyle = '#d5232f'; g.fillRect(0, 0, w, 78); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 54px DejaVu Sans'; g.fillText('⚠ ALERTA ⚠', w / 2, 42); g.font = 'bold 40px DejaVu Sans'; g.fillText('PERMANEÇAM EM', w / 2, 130); g.fillText('LOCAIS', w / 2, 180); g.fillStyle = '#ffe14a'; g.fillText('ILUMINADOS', w / 2, 232);
  g.strokeStyle = '#17121c'; g.lineWidth = 14; g.strokeRect(0, 0, w, h); });
function tLetreiro(txt, fundo, cor = '#fff') { return tex(512, 96, (g, w, h) => { g.fillStyle = fundo; g.fillRect(0, 0, w, h); g.strokeStyle = '#17121c'; g.lineWidth = 8; g.strokeRect(0, 0, w, h);
  g.fillStyle = cor; g.font = 'bold 50px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 3); }); }
function tTerreo(seed, nome, cor) { return tex(512, 256, (g, w, h) => { const r = rng(seed); g.fillStyle = '#5a5560'; g.fillRect(0, 0, w, h); blotch(g, w, h, seed, 30, 0.06);
  g.fillStyle = cor; g.fillRect(0, 0, w, 54); g.strokeStyle = '#17121c'; g.lineWidth = 6; g.strokeRect(0, 0, w, 54); g.fillStyle = '#fff'; g.font = 'bold 34px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(nome, w / 2, 29);
  [[20, 220], [270, 222]].forEach(([x, bw]) => { g.fillStyle = '#8a8690'; g.fillRect(x, 70, bw, h - 70); g.strokeRect(x, 70, bw, h - 70); g.lineWidth = 3; for (let y = 84; y < h; y += 14) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + bw, y); g.stroke(); } g.lineWidth = 6;
    if (r() < 0.6) { g.strokeStyle = ['#3fb56a', '#4a7fb5', '#d5232f'][Math.floor(r() * 3)]; g.lineWidth = 5; g.beginPath(); let px = x + 20, py = 200; g.moveTo(px, py); for (let k = 0; k < 5; k++) { px += 30; py += (r() - .5) * 70; g.lineTo(px, py); } g.stroke(); g.strokeStyle = '#17121c'; g.lineWidth = 6; } }); }); }
function tAndares(seed, parede) { return tex(512, 256, (g, w, h) => { const r = rng(seed); g.fillStyle = parede; g.fillRect(0, 0, w, h); blotch(g, w, h, seed, 30, 0.06); g.strokeStyle = '#17121c'; g.lineWidth = 6;
  g.beginPath(); g.moveTo(0, h - 3); g.lineTo(w, h - 3); g.stroke();
  for (let i = 0; i < 4; i++) { const x = 28 + i * 122; const vela = r() < 0.14; g.fillStyle = vela ? '#c98a3a' : (r() < 0.5 ? '#1a1c2a' : '#232638'); g.fillRect(x, 60, 88, 130); g.strokeRect(x, 60, 88, 130);
    g.lineWidth = 4; g.beginPath(); g.moveTo(x + 44, 60); g.lineTo(x + 44, 190); g.moveTo(x, 120); g.lineTo(x + 88, 120); g.stroke(); g.lineWidth = 6;
    if (r() < 0.3) { g.fillStyle = '#9a96a0'; g.fillRect(x + 20, 196, 48, 26); g.strokeRect(x + 20, 196, 48, 26); } } }); }
function tTela(pct, cor) { return tex(180, 360, (g, w, h) => { g.fillStyle = pct === null ? '#07070a' : '#22355a'; g.fillRect(0, 0, w, h); if (pct === null) return;
  g.fillStyle = '#cfd6e6'; g.font = 'bold 24px DejaVu Sans'; g.textAlign = 'center'; g.fillText('19:47', w / 2, 44);
  g.strokeStyle = '#cfd6e6'; g.lineWidth = 8; g.strokeRect(34, 110, 104, 56); g.fillStyle = '#cfd6e6'; g.fillRect(140, 126, 10, 24); g.fillStyle = cor; g.fillRect(42, 118, 10 + pct * 2, 40);
  g.font = 'bold 62px DejaVu Sans'; g.fillText(pct + '%', w / 2, 250); g.fillStyle = '#ffe14a'; g.font = 'bold 19px DejaVu Sans'; g.fillText('LANTERNA', w / 2, 310); g.fillText('LIGADA', w / 2, 334); }); }
const M = (t, rx, ry) => mat('#ffffff', { map: rep(t, rx, ry) });

// ============ luz ============
const amb = new THREE.AmbientLight('#ffffff', 1); scene.add(amb);
const lua = new THREE.DirectionalLight('#8fa6e8', 0); lua.position.set(-0.4, 1, 0.5); scene.add(lua);
const luzes = criaLuzes(6);
const C_LOJA = new THREE.Color('#fff0d8'), C_NOITE = new THREE.Color('#5f78c0');

// ============ MERCADINHO (x 8..17, z -3..7) ============
const LA = 3.2;
laje(8, -3, 17, 7, 0.02, M(tPisoLoja, 4.5, 5)); laje(8, -3, 17, 7, LA, M(tTetoLoja, 4.5, 5));
parede(17, -3, 17, 7, 0, LA, M(tParedeLoja, 5, 1)); parede(8, -3, 17, -3, 0, LA, M(tParedeLoja, 4.5, 1)); parede(8, 7, 17, 7, 0, LA, M(tParedeLoja, 4.5, 1));
const DZ0 = 1.4, DZ1 = 2.8;                                        // vão da porta (parede da frente, x=8)
parede(8.02, -3, 8.02, DZ0, 0, LA, M(tParedeLoja, 2.2, 1)); parede(8.02, DZ1, 8.02, 7, 0, LA, M(tParedeLoja, 2.1, 1)); parede(8.02, DZ0, 8.02, DZ1, 2.3, LA, M(tParedeLoja, 0.7, 0.3));
box(0.12, 2.3, 0.1, mat('#3a3640'), 8, 1.15, DZ0); box(0.12, 2.3, 0.1, mat('#3a3640'), 8, 1.15, DZ1); box(0.12, 0.1, 1.5, mat('#3a3640'), 8, 2.32, 2.1);
// balcão do caixa (à direita de quem olha para o fundo)
box(2.2, 0.95, 0.75, mat('#b3202a'), 10.5, 0.475, 3.75); box(2.3, 0.06, 0.85, mat('#e6dcc0'), 10.5, 0.98, 3.75);
box(0.4, 0.3, 0.4, mat('#3a3640'), 10.9, 1.16, 3.8); box(0.36, 0.22, 0.03, flat('#9fe3ff'), 10.9, 1.42, 3.62);
// prateleiras ao longo de x, corredores entre elas
[-1.4, 1.1, 3.7, 6.2].forEach(z => { box(4.4, 1.9, 0.5, mat('#5a5560'), 14.4, 0.95, z);
  [-1, 1].forEach(s => { const q = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.8), M(tPrateleira, 2, 1)); q.position.set(14.4, 0.98, z + s * 0.255); if (s < 0) q.rotation.y = PI; scene.add(q); }); });
box(0.1, 2.0, 9.6, mat('#9fb8c8'), 16.9, 1.0, 2);                         // geladeiras no fundo
// TV de alerta
const tv = new THREE.Group(); tv.position.set(12.3, 2.45, 3.3); tv.rotation.y = -PI / 2 - 0.5; scene.add(tv);
box(1.42, 0.86, 0.08, mat('#17121c'), 0, 0, -0.045, tv); quadro(1.3, 0.74, tTV, 0, 0, 0, 0, tv); box(0.06, 0.5, 0.06, mat('#3a3640'), 0, 0.62, -0.05, tv);
// lâmpadas do mercado (fila pelo corredor central)
const lampLoja = {};
[['l16', 16], ['l14', 14], ['l12', 12], ['l10', 10]].forEach(([n, x]) => { box(1.3, 0.06, 0.36, flat('#2a2530'), x, LA - 0.03, 2.4);
  const m = flat('#fffbe8'); box(1.2, 0.04, 0.26, m, x, LA - 0.07, 2.4); [-1.6, 5.9].forEach(z => { box(1.3, 0.06, 0.36, flat('#2a2530'), x, LA - 0.03, z); box(1.2, 0.04, 0.26, m, x, LA - 0.07, z); });
  lampLoja[n] = { m, f: luzes.add({ pos: V(x, LA - 0.5, 2.4), cor: '#fff2d0', int: 4.2, dist: 11 }) }; });
// carrinho com os sapatos
const carrinho = new THREE.Group(); scene.add(carrinho);
{ const a = mat('#9a9aa6'); box(0.7, 0.03, 0.46, a, 0, 0.52, 0, carrinho); box(0.7, 0.36, 0.03, a, 0, 0.7, 0.23, carrinho); box(0.7, 0.36, 0.03, a, 0, 0.7, -0.23, carrinho);
  box(0.03, 0.36, 0.46, a, 0.35, 0.7, 0, carrinho); box(0.03, 0.36, 0.46, a, -0.35, 0.7, 0, carrinho); box(0.04, 0.04, 0.5, mat('#d5232f'), -0.44, 0.96, 0, carrinho);
  box(0.03, 0.5, 0.03, a, -0.4, 0.74, 0.22, carrinho); box(0.03, 0.5, 0.03, a, -0.4, 0.74, -0.22, carrinho);
  [[0.3, 0.2], [0.3, -0.2], [-0.3, 0.2], [-0.3, -0.2]].forEach(([x, z]) => { box(0.03, 0.44, 0.03, a, x, 0.3, z, carrinho); ball(0.05, mat('#2a2630'), x, 0.05, z, carrinho, 1, 1, 0.5); });
  sapatos(0.02, 0.58, 0, 0.4, '#5a3a28', carrinho, 1.25); }

// par de sapatos (o que sobra de quem some)
function sapatos(x, y, z, rot, cor, parent = scene, k = 1) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rot; g.scale.setScalar(k); parent.add(g);
  const m = mat(cor); ball(0.07, m, -0.08, 0.035, 0, g, 0.8, 0.55, 1.5); ball(0.07, m, 0.09, 0.035, 0.05, g, 0.8, 0.55, 1.5).rotation.y = 0.4; return g; }

// ============ RUA (corre ao longo de -z) ============
const ZA = 22, ZB = -125, RL = ZA - ZB, RC = (ZA + ZB) / 2;
laje(-5, ZB, 5, ZA, 0, M(tAsfalto, 3, RL / 3.3));
for (let z = ZA - 2; z > ZB; z -= 5) box(0.16, 0.012, 1.9, mat('#d8d2c2'), 0, 0.008, z);
[-1, 1].forEach(s => { box(3, 0.16, RL, M(tCalcada, 2, RL / 1.5), s * 6.5, 0.08, RC); box(0.14, 0.17, RL, mat('#6a6670'), s * 5.02, 0.085, RC); });
// prédios
const terreos = [tTerreo(1, 'FARMÁCIA DO POVO', '#2f8f6a'), tTerreo(2, 'PADARIA SOL', '#c9792c'), tTerreo(3, 'CELULARES & CIA', '#7a4ab0'), tTerreo(4, 'AÇOUGUE DOIS IRMÃOS', '#b3202a'), tTerreo(5, 'LOTÉRICA', '#2f6f9f')];
const andares = [tAndares(11, '#8a6a5a'), tAndares(12, '#6f7a8a'), tAndares(13, '#9a8a6a'), tAndares(14, '#7a6a8a')];
{ const r = rng(404); let k = 0;
  [-1, 1].forEach(s => { for (let z = ZA; z > ZB; z -= 10, k++) {
    const h = 9.5 + Math.floor(r() * 4) * 3.2, zc = z - 5, loja = s > 0 && zc > -4 && zc < 8;
    if (loja) box(8, h - 3.3, 9.9, mat('#3a3640'), s * 12.05, 3.3 + (h - 3.3) / 2, zc); else box(8, h, 9.9, mat('#3a3640'), s * 12.05, h / 2, zc);
    if (!loja) { const t = new THREE.Mesh(new THREE.PlaneGeometry(9.9, 3.3), M(terreos[k % 5], 1, 1)); t.position.set(s * 8, 1.65, zc); t.rotation.y = -s * PI / 2; scene.add(t); }
    const a = new THREE.Mesh(new THREE.PlaneGeometry(9.9, h - 3.3), M(andares[k % 4], 1, (h - 3.3) / 3.2)); a.position.set(s * 8, 3.3 + (h - 3.3) / 2, zc); a.rotation.y = -s * PI / 2; scene.add(a);
  } }); }
// fachada do mercadinho (lado de fora)
parede(7.98, -3, 7.98, DZ0, 0, 3.3, mat('#c8553a')); parede(7.98, DZ1, 7.98, 7, 0, 3.3, mat('#c8553a')); parede(7.98, DZ0, 7.98, DZ1, 2.3, 3.3, mat('#c8553a'));
quadro(6, 0.8, tLetreiro('MERCADINHO BOA VISTA', '#f2c230', '#7a0d14'), 7.93, 2.85, 2.2, -PI / 2);
const luzPorta = brilho(6.6, 0.18, 2.1, 2.6, '#ffdca0');
// postes apagados e fios
for (let z = 12; z > ZB; z -= 18) [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 6.2, 8), mat('#3a3640')); p.position.set(s * 5.3, 3.1, z + s * 4); scene.add(p); box(0.9, 0.08, 0.12, mat('#3a3640'), s * 4.9, 6.1, z + s * 4); });
[-5.3, 5.3].forEach(x => box(0.025, 0.025, RL, flat('#17121c'), x, 5.9, RC));

// carros
function carro(x, z, rot, cor, o = {}) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g);
  const m = mat(cor); box(1.75, 0.62, 4.1, m, 0, 0.62, 0, g); box(1.55, 0.6, 2.1, mat(o.queimado ? '#2a2428' : '#2a3040'), 0, 1.2, 0.25, g); box(1.6, 0.06, 2.15, m, 0, 1.52, 0.25, g);
  [[0.88, 1.3], [-0.88, 1.3], [0.88, -1.3], [-0.88, -1.3]].forEach(([wx, wz]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 14), mat('#17121c')); w.rotation.z = PI / 2; w.position.set(wx, 0.34, wz); g.add(w); });
  const fm = flat(o.farol ? '#fff6c8' : '#5a5a66'); [-0.6, 0.6].forEach(fx => ball(0.13, fm, fx, 0.7, -2.05, g, 1, 0.8, 0.4)); [-0.6, 0.6].forEach(fx => box(0.3, 0.14, 0.05, mat('#7a1a20'), fx, 0.72, 2.06, g));
  if (o.porta) box(0.06, 0.9, 1.0, m, -1.35, 0.85, -0.2, g).rotation.y = -0.9;
  if (o.farol) { const p = g.localToWorld(V(0, 0.06, -5)); g.updateMatrixWorld(true); const pw = V(0, 0.06, -5).applyMatrix4(g.matrixWorld);
    brilho(pw.x, 0.03, pw.z, 3.6, '#fff0b0'); const hw = V(0, 0.7, -2.2).applyMatrix4(g.matrixWorld); brilho(hw.x, hw.y, hw.z, 0.9, '#fff6c8', false).rotation.y = rot;
    luzes.add({ pos: V(0, 0.9, -4).applyMatrix4(g.matrixWorld), cor: '#fff0c0', int: 3.2, dist: 11 }); }
  return g; }
carro(-2.2, -7.5, 0.55, '#e6e2d8', { farol: true }); carro(-3.5, -11.2, -0.95, '#b3202a');
carro(3.3, -17.5, 0.05, '#3f6fa5', { farol: true }); carro(-3.2, -38, 0.18, '#d8c24a', { farol: true, porta: true });
carro(2.9, -47, -1.25, '#5a8a6a'); const carroFogo = carro(-1.6, -68, 0.3, '#3a3238', { queimado: true }); carro(3.9, -65.2, -0.1, '#8a8a96');
carro(-3.1, -80, 0.4, '#4a4a56'); carro(2.7, -89, -0.25, '#5a4a4a');
// entulho e sapatos pela rua
{ const r = rng(77), cs = ['#5a3a28', '#17121c', '#d5232f', '#f2efe8', '#3f6fa5', '#e8843a'];
  for (let i = 0; i < 26; i++) sapatos((r() - .5) * 8, 0.01, -76 - r() * 18, r() * 6.28, cs[i % 6]);
  for (let i = 0; i < 9; i++) sapatos((r() - .5) * 8, 0.01, -30 - r() * 30, r() * 6.28, cs[i % 6]);
  for (let i = 0; i < 40; i++) { const p = box(0.21, 0.006, 0.3, mat(['#f7f3ea', '#f4c74f', '#bcd7f0'][i % 3]), (r() - .5) * 9, 0.008, 8 - r() * 100); p.rotation.y = r() * 6.28; }
  ball(0.22, mat('#7a3fa0'), -1.2, 0.18, -29, scene, 1, 0.8, 0.7); box(0.5, 0.35, 0.35, mat('#b08a5a'), 2.2, 0.18, -41).rotation.y = 0.5; }

// poste solar (o único aceso) em (4.7, -28)
const POSTE = V(4.7, 0, -28);
{ const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.4, 8), mat('#5a5a66')); p.position.set(POSTE.x, 2.2, POSTE.z); scene.add(p); box(0.9, 0.05, 0.6, mat('#2a3a6a'), POSTE.x, 4.5, POSTE.z).rotation.x = 0.4; box(0.7, 0.07, 0.1, mat('#5a5a66'), POSTE.x - 0.35, 4.2, POSTE.z); }
const lampPoste = ball(0.16, flat('#fff6c8'), POSTE.x - 0.7, 4.1, POSTE.z, scene, 1, 0.7, 1);
const pocaPoste = brilho(POSTE.x - 0.7, 0.03, POSTE.z, 2.6, '#ffe9a8'), haloPoste = brilho(POSTE.x - 0.7, 4.1, POSTE.z, 1.1, '#fff0b0', false);
const fPoste = luzes.add({ pos: V(POSTE.x - 0.7, 3.4, POSTE.z), cor: '#ffe9b0', int: 5, dist: 9 });

// carro em chamas
const chamas = []; { const r = rng(31), cs = ['#ff7a1a', '#ffb02a', '#ffe14a'];
  for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.34 + r() * 0.3, 1.1 + r() * 1.1, 9), flat(cs[i % 3])); c.userData = { x: (r() - .5) * 1.5, z: (r() - .5) * 3.2, h: c.geometry.parameters.height, f: 5 + r() * 6, p: r() * 6 }; carroFogo.add(c); chamas.push(c); } }
const fumaca = []; for (let i = 0; i < 7; i++) fumaca.push(ball(0.7 + i * 0.16, mat('#2a2630'), 0, 0, 0));
const FOGO = V(-1.6, 0, -68);
const pocaFogo = brilho(FOGO.x, 0.03, FOGO.z, 7.5, '#ff9a3a'), haloFogo = brilho(FOGO.x, 1.8, FOGO.z + 0.3, 3.2, '#ff8a2a', false);
const fFogo = luzes.add({ pos: V(FOGO.x + 0.6, 1.9, FOGO.z + 1.2), cor: '#ff9a45', int: 7, dist: 17 });

// ônibus atravessado no fim da rua, lado da porta virado para nós
const BZ = -98.5;
{ box(11.4, 2.75, 2.6, mat('#e6e0cc'), 0, 1.78, BZ); box(11.42, 0.5, 2.62, mat('#2f6f9f'), 0, 1.0, BZ); box(11.3, 0.08, 2.5, mat('#bfb8a4'), 0, 3.19, BZ);
  const lj = flat('#ffe9a8'); [-4.5, -3.1, -1.7, 2.4, 3.8].forEach(x => box(1.15, 0.85, 0.04, lj, x, 2.25, BZ + 1.31)); box(1.0, 2.0, 0.04, flat('#fff4c8'), 0.6, 1.45, BZ + 1.31);
  box(0.1, 2.1, 0.06, mat('#3a3640'), 0.05, 1.45, BZ + 1.33); box(0.1, 2.1, 0.06, mat('#3a3640'), 1.15, 1.45, BZ + 1.33); box(1.1, 0.22, 0.5, mat('#5a5560'), 0.6, 0.33, BZ + 1.5);
  [-3.8, 3.6].forEach(x => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.3, 16), mat('#17121c')); w.rotation.x = PI / 2; w.position.set(x, 0.52, BZ + 1.2); scene.add(w); });
  quadro(2.4, 0.42, tLetreiro('GARAGEM', '#17121c', '#ffb02a'), 4.3, 2.92, BZ + 1.32, 0); [1.9, 0.9].forEach(y => ball(0.14, flat('#fff6c8'), 5.72, y, BZ + 0.9, scene, 0.4, 1, 1));
  brilho(0.6, 0.03, BZ + 4.2, 5.5, '#ffe9a8'); brilho(0.6, 1.9, BZ + 1.4, 3.0, '#ffe9a8', false); }
luzes.add({ pos: V(0.6, 2.1, BZ + 3.2), cor: '#ffe9b0', int: 6, dist: 15 });

// ============ elenco ============
const luzTenis = luzes.add({ pos: V(0, 0, 0), cor: '#ff3a3a', int: 0, dist: 6 });
const luzFinal = luzes.add({ pos: V(0, 0, 0), cor: '#cfd8ff', int: 0, dist: 4.5 });
const luzCel = luzes.add({ pos: V(0, 0, 0), cor: '#dfe8ff', int: 0, dist: 10 });
const pov = criaPOV({ pele: '#b9774a', manga: '#2f5fa5', calca: '#3a3640', tenis: '#f2efe8', bico: '#d5232f' });
const celular = new THREE.Group(); pov.rig.add(celular); box(0.085, 0.17, 0.012, mat('#17121c'), 0, 0, 0, celular);
const tela = quadro(0.075, 0.155, tTela(4, '#f2c230'), 0, 0, 0.008, 0, celular); const TELAS = { 4: tela.material.map, 2: tTela(2, '#d5232f'), 1: tTela(1, '#d5232f'), 0: tTela(null) };
const maoOmbro = criaMao(mat('#aab7c4'), 1, pov.rig); maoOmbro.scale.setScalar(1.5);
const F = { fosco: true };
const davi = criaPersonagem({ ...F, pele: '#b9774a', nariz: '#a86539', roupa: '#d5232f', calca: '#2b3350', cabelo: '#17121c', penteado: 'curto', tenis: '#f2efe8', tenisLuz: true, escala: 0.66 });
const gente = (pele, roupa, calca, cabelo, o = {}) => criaPersonagem({ ...F, pele, roupa, calca, cabelo, penteado: 'curto', escala: 0.95, ...o });
const mocoFundo = gente('#e3b08a', '#5a8a6a', '#3a3640', '#3a2a20');
const caixa = gente('#8a5a3c', '#f2c230', '#3a3640', '#17121c', { penteado: 'coque', escala: 0.92 });
const lanterneiro = gente('#e3b08a', '#8a8a96', '#2b3350', '#a8672e');
const grupoPoste = [['#b9774a', '#c9795a', '#8a5ab0'], ['#e3b08a', '#4a7fb5', '#3a3640'], ['#8a5a3c', '#5a9a78', '#2b3350'], ['#f0c9a8', '#b08a3a', '#5a3a28'], ['#b9774a', '#e6e2d8', '#3a3640'], ['#e3b08a', '#7a4050', '#17121c']]
  .map(([p, r, c], i) => gente(p, r, c, ['#17121c', '#3a2a20', '#a8672e'][i % 3], { penteado: i === 0 ? 'coque' : 'curto', escala: 0.88 + (i % 3) * 0.05 }));
const sapatosPoste = grupoPoste.map((_, i) => sapatos(0, 0.01, 0, i * 1.3, ['#5a3a28', '#17121c', '#d5232f', '#f2efe8', '#3f6fa5', '#e8843a'][i]));
const grupoFogo = [['#8a5a3c', '#5a5560', '#2b3350'], ['#e3b08a', '#7a4ab0', '#3a3640'], ['#b9774a', '#3f8f5a', '#5a3a28'], ['#f0c9a8', '#c9795a', '#2b3350']].map(([p, r, c], i) => gente(p, r, c, ['#d8d8de', '#17121c', '#a8672e', '#3a2a20'][i], { escala: 0.92 + (i % 2) * 0.06 }));
const isqueiro = gente('#e3b08a', '#e8843a', '#2b3350', '#17121c'); const faisca = ball(0.035, flat('#ffe14a'), 0, 0, 0);
const corredores = [gente('#b9774a', '#e6e2d8', '#2b3350', '#17121c'), gente('#e3b08a', '#7a4050', '#3a3640', '#a8672e', { penteado: 'coque' }), gente('#8a5a3c', '#5a9a78', '#3a3640', '#17121c')];
const fCorr = [luzes.add({ pos: V(0, 0, 0), cor: '#fff6d8', int: 0, dist: 7 }), luzes.add({ pos: V(0, 0, 0), cor: '#fff6d8', int: 0, dist: 7 })];
const fLant = luzes.add({ pos: V(0, 0, 0), cor: '#fff6d8', int: 0, dist: 7 });
const jorge = gente('#8a5a3c', '#9fc3e6', '#2b3350', '#d8d8de', { escala: 1.0 });
// "o Escuro": só um braço pálido e, no fim, dois olhos
const escuro = new THREE.Group(); scene.add(escuro);
const bracoE = limb(0.03, mat('#8f9cab'), escuro), maoE = criaMao(mat('#aab7c4'), 1, escuro); maoE.scale.setScalar(1.25);
const corpoE = limb(0.15, mat('#05060a'), escuro); const olhosE = [-1, 1].map(s => ball(0.04, flat('#f2f6ff'), s * 0.085, 0, 0, escuro, 1, 1, 0.5));

// ============ roteiro ============
const BRANCO = '#ffffff', AMARELO = '#ffe08a', AZUL = '#9fe3ff', ROSA = '#ffb3d1', LARANJA = '#ffb060', VERDE = '#b9f08a';
const SUBS = [
  { a: 3.6, b: 5.8, txt: 'O moço do fundo sumiu.', cor: AMARELO, q: 'davi' },
  { a: 11.9, b: 13.8, txt: 'Sai da loja. Agora!', cor: AZUL, q: 'caixa' },
  { a: 22.8, b: 25.8, txt: 'Não tem mais lugar! Procura outro!', cor: ROSA, q: 'mulher' },
  { a: 30.0, b: 31.6, txt: 'Cadê eles?', cor: AMARELO, q: 'davi' },
  { a: 32.0, b: 34.0, txt: 'Não olha. Corre.', cor: BRANCO },
  { a: 43.2, b: 47.2, txt: 'Fogo acaba, garoto. Tudo acaba.', cor: LARANJA, q: 'fogo' },
  { a: 53.0, b: 57.0, txt: 'Eu saio em dez segundos! Com ou sem vocês!', cor: VERDE, q: 'jorge' },
  { a: 72.6, b: 75.8, txt: 'Tem alguém segurando a minha outra mão.', cor: AMARELO, q: 'davi' },
  { a: 77.0, b: 79.8, txt: 'Ele falou que conhece a mamãe.', cor: AMARELO, q: 'davi' },
];
const TAGS = [{ a: 0.4, b: 3.0, txt: 'PARTE 1' }];
if (typeof FALAS !== 'undefined') SUBS.forEach((s, i) => { s.fa = FALAS[i].a; s.fb = FALAS[i].b; s.a = FALAS[i].a - 0.05; s.b = Math.max(FALAS[i].b + 0.4, FALAS[i].a + 1.0); });
const fala = (q, t) => SUBS.some(s => s.q === q && t >= (s.fa ?? s.a) && t < (s.fb ?? s.b));
function bocaVoz(t, seed) { if (typeof BOCA_NIVEL === 'undefined') return bocaFalando(t, seed);
  const f = Math.round(t * FPS), n = +(BOCA_NIVEL[f] || 0) / 9; return n < 0.12 ? 'fechada' : n < 0.42 ? 'meia' : n < 0.78 ? 'aberta' : ((f >> 1) % 2 ? 'o' : 'aberta'); }
document.getElementById('opA').textContent = 'A) PUXAR O DAVI E CORRER';
document.getElementById('opB').textContent = 'B) PERGUNTAR QUEM É';

// câmera: x,z posição; yaw corpo; cab cabeça; pitch; alt
const HP = PI / 2, A = 1.55;
const KC = [
  { t: 0, x: 10.2, z: 2.4, yaw: -HP, cab: -0.62, pitch: 0.36, alt: A },
  { t: 2.6, x: 10.2, z: 2.4, yaw: -HP, cab: -0.62, pitch: 0.36, alt: A },
  { t: 3.3, x: 10.2, z: 2.4, yaw: -HP, cab: 0.9, pitch: -0.7, alt: A },
  { t: 4.3, x: 10.2, z: 2.4, yaw: -HP, cab: 0.9, pitch: -0.7, alt: A },
  { t: 5.0, x: 10.2, z: 2.4, yaw: -HP, cab: 0.05, pitch: -0.03, alt: A },
  { t: 10.4, x: 10.2, z: 2.4, yaw: -HP, cab: 0, pitch: -0.14, alt: A },
  { t: 11.3, x: 10.2, z: 2.4, yaw: -HP, cab: 0, pitch: -0.82, alt: A },
  { t: 11.9, x: 10.2, z: 2.4, yaw: -HP, cab: 0, pitch: -0.82, alt: A },
  { t: 12.4, x: 10.2, z: 2.4, yaw: -HP, cab: -1.35, pitch: -0.02, alt: A },
  { t: 14.0, x: 10.2, z: 2.4, yaw: -HP, cab: -1.35, pitch: -0.02, alt: A },
  { t: 15.2, x: 9.9, z: 2.3, yaw: HP, cab: 0, pitch: -0.2, alt: A },
  { t: 16.2, x: 8.2, z: 2.1, yaw: HP, cab: 0, pitch: -0.15, alt: A },
  { t: 17.0, x: 6.3, z: 1.2, yaw: 0.9, cab: 0, pitch: -0.1, alt: A },
  { t: 18.3, x: 1.8, z: -3.8, yaw: 0, cab: 0, pitch: -0.12, alt: A },
  { t: 22.0, x: 1.2, z: -19, yaw: 0, cab: 0, pitch: -0.1, alt: A },
  { t: 23.6, x: 1.4, z: -23.3, yaw: 0, cab: -0.62, pitch: 0.02, alt: A },
  { t: 27.0, x: 1.4, z: -23.3, yaw: 0, cab: -0.62, pitch: 0.05, alt: A },
  { t: 29.3, x: 2.0, z: -24.9, yaw: 0, cab: -0.6, pitch: -0.5, alt: A },
  { t: 29.9, x: 2.0, z: -24.9, yaw: 0, cab: 0.9, pitch: -0.7, alt: A },
  { t: 31.6, x: 2.0, z: -24.9, yaw: 0, cab: 0.9, pitch: -0.7, alt: A },
  { t: 32.3, x: 2.0, z: -24.9, yaw: 0, cab: 0, pitch: -0.1, alt: A },
  { t: 33.2, x: 2.0, z: -25.2, yaw: 0, cab: 0, pitch: -0.1, alt: A },
  { t: 40.0, x: 1.6, z: -58, yaw: 0, cab: 0, pitch: -0.1, alt: A },
  { t: 43.0, x: 1.3, z: -63.6, yaw: 0, cab: 0.55, pitch: -0.04, alt: A },
  { t: 47.3, x: 1.3, z: -63.6, yaw: 0, cab: 0.55, pitch: -0.04, alt: A },
  { t: 47.9, x: 1.3, z: -63.6, yaw: 0, cab: -0.1, pitch: -0.3, alt: A },
  { t: 49.8, x: 1.3, z: -63.6, yaw: 0, cab: -0.1, pitch: -0.3, alt: A },
  { t: 52.4, x: 1.2, z: -73.5, yaw: 0, cab: 0, pitch: 0.02, alt: A },
  { t: 57.2, x: 1.2, z: -73.5, yaw: 0, cab: 0, pitch: 0.02, alt: A },
  { t: 57.9, x: 1.2, z: -73.5, yaw: 0, cab: 0.9, pitch: -0.75, alt: A },
  { t: 61.4, x: 1.2, z: -73.5, yaw: 0, cab: 0.9, pitch: -0.75, alt: A },
  { t: T_CORRE, x: 1.2, z: -73.6, yaw: 0, cab: 0, pitch: -0.12, alt: A },
  { t: T_MORRE, x: 1.0, z: -85.5, yaw: 0, cab: 0, pitch: -0.12, alt: A },
  { t: 67.5, x: 1.0, z: -86.2, yaw: 0, cab: 0, pitch: -0.2, alt: A },
  { t: T_TOQUE, x: 1.0, z: -88.3, yaw: 0, cab: 0, pitch: -0.15, alt: A },
  { t: 70.5, x: 1.0, z: -88.8, yaw: 0, cab: 0, pitch: -0.15, alt: A },
  { t: 70.8, x: 1.0, z: -88.8, yaw: 0, cab: -1.5, pitch: 0, alt: A },
  { t: 71.6, x: 1.0, z: -88.8, yaw: 0, cab: -1.5, pitch: 0, alt: A },
  { t: 72.3, x: 1.0, z: -89.2, yaw: 0, cab: 0.9, pitch: -0.72, alt: A },
  { t: T_OUTRA, x: 1.0, z: -89.2, yaw: 0, cab: 0.9, pitch: -0.72, alt: A },
  { t: 76.7, x: 1.0, z: -89.2, yaw: 0, cab: 1.12, pitch: -0.55, alt: A },
  { t: T_OLHOS - 0.2, x: 1.0, z: -89.2, yaw: 0, cab: 1.12, pitch: -0.55, alt: A },
  { t: T_OLHOS + 0.5, x: 1.0, z: -89.2, yaw: 0, cab: 1.2, pitch: 0.34, alt: A },
  { t: 99, x: 1.0, z: -89.2, yaw: 0, cab: 1.2, pitch: 0.34, alt: A },
];
const TOTAL = Math.round(DUR * FPS), DIST = new Float32Array(TOTAL + 2), VEL = new Float32Array(TOTAL + 2);
{ let a = chave(KC, 0); for (let i = 1; i <= TOTAL + 1; i++) { const b = chave(KC, i / FPS); const d = Math.hypot(b.x - a.x, b.z - a.z); DIST[i] = DIST[i - 1] + d; VEL[i] = d * FPS; a = b; } }

// do referencial do corpo (x direita, z para trás) para o mundo
function doRig(k, x, y, z) { const c = Math.cos(k.yaw), s = Math.sin(k.yaw); return V(k.x + x * c + z * s, y, k.z - x * s + z * c); }
const olharPara = (de, para) => Math.atan2(para.x - de.x, para.z - de.z);
const pulso = (t, t0, d = 0.14) => { const u = (t - t0) / d; return u > 0 && u < 1 ? Math.sin(u * PI) : 0; };
// posições do grupo do poste e do fogo
const POS_POSTE = grupoPoste.map((_, i) => { const a = -2.4 + i * 0.72, r = i % 2 ? 1.25 : 0.75; return V(POSTE.x - 0.7 + Math.sin(a) * r, 0, POSTE.z + Math.cos(a) * r); });
POS_POSTE[0] = V(POSTE.x - 1.5, 0, POSTE.z + 1.5);                       // a mulher que fala fica na frente
sapatosPoste.forEach((s, i) => { s.position.x = POS_POSTE[i].x; s.position.z = POS_POSTE[i].z; });
const POS_FOGO = [V(0.75, 0, -66.0), V(-0.6, 0, -64.6), V(-3.9, 0, -66.6), V(-4.1, 0, -69.4)];

function renderFrame(i) {
  const t = i / FPS, k = chave(KC, t);
  const olho = V(k.x, k.alt, k.z);

  // ---------- luz ambiente ----------
  const naLoja = 1 - ease(seg(t, 16.0, 17.2));
  let apag = 0; for (const n in T_LAMP) { const L = lampLoja[n], d = t - T_LAMP[n];
    const on = d < 0 ? 1 : d < 0.35 ? (Math.floor(d * 30) % 3 === 0 ? 0.9 : 0.2) : 0; L.f.int = 4.2 * on; L.m.color.set(on > 0.5 ? '#fffbe8' : '#3a3640'); apag += 1 - on; }
  const pisca10 = (t > 12.6 && t < 13.4 && Math.floor(t * 30) % 4 === 0) ? 0.3 : 1; lampLoja.l10.f.int = 4.2 * pisca10;
  const breu = ease(seg(-k.z, 72, 80)), morto = t >= T_MORRE ? 1 : 0;
  amb.color.copy(C_LOJA).lerp(C_NOITE, 1 - naLoja);
  amb.intensity = lerp(lerp(1.3, 0.42, breu) - 0.1 * morto, 1.2 - 0.12 * apag, naLoja); lua.intensity = (1 - naLoja) * lerp(0.6, 0.15, breu);
  luzPorta.material.opacity = 0.7 * pisca10;

  // ---------- protagonista ----------
  const correr = clamp(VEL[i] / 2.8), fase = DIST[i] * 2 * PI / 3.2;
  pov.rig.position.set(k.x, 0, k.z); pov.rig.rotation.set(0, k.yaw, 0);
  const segura = ease(seg(t, T_PEGA, T_PEGA + 0.5));
  const cel = ease(seg(t, T_CEL, T_CEL + 0.6)), olhaCel = ease(seg(t, T_BATERIA, T_BATERIA + 0.5)) * (1 - ease(seg(t, 49.6, 50.2)));
  const bob = 0.03 * Math.sin(fase * 2) * correr;
  const posCel = V(lerp(0.24, 0.06, olhaCel), lerp(1.04, 1.2, olhaCel) + bob, lerp(-0.46, -0.42, olhaCel));
  const maos = [
    { k: segura, fecha: 0.8, pos: V(-0.3, 0.74 + bob, -0.34), cotovelo: V(-0.33, 1.02, 0.02) },
    { k: cel, fecha: 0.55, pos: V(posCel.x + 0.03, posCel.y - 0.17, posCel.z + 0.05), cotovelo: V(0.36, 0.86, 0.0) },
  ];
  const susto = pulso(t, T_ESTOURO, 0.5) + pulso(t, T_TOQUE + 0.95, 0.4);
  posaPOV(pov, { correr, fase, pitch: k.pitch + 0.012 * Math.sin(t * 1.9) * (1 - correr) + 0.05 * susto, altura: k.alt - 0.05 * susto, roll: 0.02 * susto, maos,
    tremor: t > T_MORRE ? 0.25 : 0 });
  camera.rotation.y += k.cab;
  // celular
  celular.visible = cel > 0.05; celular.position.copy(posCel); celular.scale.setScalar(lerp(1.5, 1.9, olhaCel)); celular.rotation.set(-0.5 - 0.15 * olhaCel, -0.3 * (1 - olhaCel), 0.1);
  tela.material.map = t >= T_MORRE ? TELAS[0] : t >= T_MORRE - 1.2 ? TELAS[1] : t >= T_BATERIA - 0.4 ? TELAS[2] : TELAS[4];
  luzCel.pos.copy(doRig(k, 0.2, 1.25, -1.0)); luzCel.int = t < T_MORRE ? 3.4 * cel * (t > T_MORRE - 0.5 ? (Math.floor(t * 30) % 3 ? 1 : 0.2) : 1) : 0;
  // mão no ombro
  const toque = ease(seg(t, T_TOQUE, T_TOQUE + 0.5)) * (1 - seg(t, T_TOQUE + 1.0, T_TOQUE + 1.2));
  maoOmbro.visible = toque > 0.02; maoOmbro.position.set(0.3, lerp(0.9, 1.2, toque), lerp(-0.2, -0.52, toque)); maoOmbro.rotation.set(-1.75, 0.25, 0);
  maoOmbro.userData.dedos.forEach((d, j) => d.rotation.x = -0.5 - 0.25 * Math.sin(t * 7 + j));

  // ---------- Davi ----------
  const daviPos = doRig(k, -0.5, 0, -0.45);
  const noMercado = t < T_PEGA + 0.3, parado = correr < 0.15;
  const final = t >= T_OUTRA - 1.2;
  davi.g.position.copy(daviPos);
  const olhaMim = olharPara(daviPos, olho);
  const aponta1 = ease(seg(t, 3.5, 3.9)) * (1 - ease(seg(t, 5.6, 6.1)));
  const viraMim = noMercado ? lerp(1, 0.25, aponta1) : (parado ? ease(seg(t, 29.4, 29.9)) * (1 - ease(seg(t, 32.2, 32.8))) + ease(seg(t, 57.4, 57.9)) * (1 - ease(seg(t, 61.5, 62))) + ease(seg(t, 72.0, 72.5)) : 0);
  const frente = k.yaw + PI;
  let d = olhaMim - frente; d = Math.atan2(Math.sin(d), Math.cos(d));
  davi.g.rotation.y = frente + d * clamp(viraMim) * 0.85;
  davi.g.updateMatrixWorld(true);
  const maoMinha = pov.rig.localToWorld(V(-0.3, 0.76, -0.34));
  const sorri = ease(seg(t, T_OUTRA + 0.3, T_OUTRA + 1.0));
  const dFala = fala('davi', t);
  const esticado = ease(seg(t, T_OUTRA - 3.6, T_OUTRA - 2.6));
  posaPersonagem(davi, { correr, fase: fase * 1.5,
    maoE: segura > 0.5 ? davi.g.worldToLocal(maoMinha.clone()) : (noMercado ? davi.g.worldToLocal(pov.rig.localToWorld(V(-0.3, 0.9, -0.25))) : null),
    maoD: aponta1 > 0 ? V(0.25, 0.74, 0).lerp(apontaPara(davi, V(16.3, 1.2, 2.4), 0.48), aponta1) : esticado > 0 ? V(0.25, 0.74, 0).lerp(V(0.52, 1.02, -0.05), esticado) : null,
    boca: dFala ? bocaVoz(t, 3) : sorri > 0.5 ? 'sorrisinho' : 'fechada',
    sobr: sorri > 0.5 ? 0.1 : -0.75, arregala: sorri > 0.5 ? 0 : 0.5 * (t > T_ESTOURO ? 1 : aponta1),
    olhar: viraMim > 0.4 ? [0, 0.75] : [0, 0.1], piscar: piscada(t, 2.6, 0.7),
    cabecaX: viraMim > 0.4 ? -0.45 : 0, cabecaInc: sorri * 0.18, respira: 0.008 * Math.sin(t * 3.3) });
  // tênis que pisca: a cada passada; parado, a cada meio segundo
  const ciclo = parado ? t / 0.55 : fase * 1.5 / PI;
  const fr = ciclo - Math.floor(ciclo), pe = Math.floor(ciclo) % 2, br = fr < 0.3 ? Math.sin(fr / 0.3 * PI) : 0;
  const corT = pe ? '#ff3a3a' : '#3aff7a';
  davi.pes.forEach((p, j) => p.material.color.set(j === pe && br > 0.2 ? corT : '#8a8a90'));
  luzTenis.pos.set(daviPos.x, 0.25, daviPos.z); luzTenis.cor = corT; luzTenis.int = 2.6 * br * (t > T_RUA ? 1 : 0.3);

  // ---------- mercado ----------
  mocoFundo.g.visible = t < T_LAMP.l16 + 0.1; mocoFundo.g.position.set(16.1, 0, 2.35); mocoFundo.g.rotation.y = 0.2;
  posaPersonagem(mocoFundo, { maoD: V(0.3, 1.25, 0.3), cabecaY: 0.3 });
  const cx = lerp(16.4, 11.2, easeOut(seg(t, T_CARRINHO, T_CARRINHO + 3.6)));
  carrinho.visible = t > T_CARRINHO - 0.1 && t < 17; carrinho.position.set(cx, 0, 2.35 + 0.05 * Math.sin(cx * 3)); carrinho.rotation.y = 0.12 * Math.sin(cx * 2.2);
  caixa.g.visible = t < 17.5; caixa.g.position.set(10.5, 0, 4.6); caixa.g.rotation.y = PI + 0.1;
  const cFala = fala('caixa', t), cAp = ease(seg(t, 11.7, 12.1));
  posaPersonagem(caixa, { boca: cFala ? bocaVoz(t, 7) : 'fechada', sobr: -0.8 * cAp, arregala: 0.6 * cAp, piscar: piscada(t, 3.1, 0.2),
    maoD: cAp > 0 ? V(0.25, 0.74, 0).lerp(apontaPara(caixa, V(8, 1.2, 2.1), 0.5), cAp) : null, cabecaY: lerp(0.5, 0, cAp), olhar: [0, 0], inclina: 0.15 * cAp });

  // ---------- rua: figurantes ----------
  const perto = (z, r = 45) => Math.abs(k.z - z) < r && t > 15.5;
  lanterneiro.g.visible = perto(-13); lanterneiro.g.position.set(4.0, 0, -13); lanterneiro.g.rotation.y = t * 4.2;
  posaPersonagem(lanterneiro, { maoD: V(0.2, 1.05, 0.42), arregala: 1, sobr: -1, boca: 'o', inclina: 0.1 });
  fLant.pos.set(4.0 + Math.sin(t * 4.2) * 1.3, 1.0, -13 + Math.cos(t * 4.2) * 1.3); fLant.int = lanterneiro.g.visible ? 2.4 : 0;
  const rotas = [   // [início, fim, de, para]
    [16.5, 25.5, V(-6.3, 0, -42), V(-6.3, 0, 12)], [18.2, 21.2, V(6.2, 0, -14), V(-6.4, 0, -17.5)], [33.0, 41.5, V(-2.2, 0, -31), V(-2.6, 0, -63.5)]];
  corredores.forEach((c, j) => { const [a, b, de, para] = rotas[j], u = seg(t, a, b); c.g.visible = t > a - 0.2 && t < b + (j === 2 ? 99 : 0.1) && perto(lerp(de.z, para.z, u), 50);
    c.g.position.lerpVectors(de, para, u); c.g.rotation.y = olharPara(de, para); const cr = u < 1 ? 1 : 0;
    posaPersonagem(c, { correr: cr, fase: t * 2 * PI / 0.62 + j * 2, arregala: 0.8, sobr: -0.8, boca: 'o', maoD: j !== 1 ? V(0.22, 1.0, 0.4) : null, inclina: cr ? 0 : 0.2 });
    if (j !== 1) { const f = fCorr[j ? 1 : 0]; f.pos.set(c.g.position.x + Math.sin(c.g.rotation.y) * 1.6, 0.9, c.g.position.z + Math.cos(c.g.rotation.y) * 1.6); f.int = c.g.visible && cr ? 2.3 : 0; } });

  // ---------- poste solar ----------
  const aceso = t < T_ESTOURO, tremeP = t > T_ESTOURO - 1.3 && Math.floor(t * 30) % 5 < 2 ? 0.35 : 1;
  fPoste.int = aceso ? 5 * tremeP : 0; lampPoste.material.color.set(aceso && tremeP > 0.5 ? '#fff6c8' : '#3a3640');
  pocaPoste.material.opacity = aceso ? 0.85 * tremeP : 0; haloPoste.material.opacity = aceso ? 0.9 * tremeP : 0;
  const mFala = fala('mulher', t);
  grupoPoste.forEach((p, j) => { p.g.visible = aceso && perto(POSTE.z); p.g.position.copy(POS_POSTE[j]);
    const fora = olharPara(V(POSTE.x - 0.7, 0, POSTE.z), POS_POSTE[j]);
    p.g.rotation.y = j === 0 ? olharPara(POS_POSTE[0], olho) : fora;
    posaPersonagem(p, j === 0
      ? { boca: mFala ? bocaVoz(t, 9) : 'meia', sobr: 0.7, arregala: 0.5, maoD: V(0.2, 1.15, 0.45), maoE: V(-0.2, 1.15, 0.45), inclina: 0.12, cabecaInc: 0.04 * Math.sin(t * 9) }
      : { arregala: 0.9, sobr: -1, boca: j % 2 ? 'o' : 'meia', olhar: [Math.sin(t * 3 + j), 0.2], cabecaY: 0.4 * Math.sin(t * 2.1 + j * 2), maoD: V(0.12, 1.1, 0.2), maoE: V(-0.12, 1.1, 0.2), respira: 0.01 * Math.sin(t * 8 + j) }); });
  sapatosPoste.forEach(s => s.visible = !aceso);

  // ---------- fogo ----------
  const tf = t * 1.0; let fl = 0.82 + 0.18 * Math.sin(t * 17) * Math.sin(t * 6.3);
  chamas.forEach(c => { const u = c.userData, s = 0.75 + 0.35 * Math.abs(Math.sin(t * u.f + u.p)); c.scale.set(1, s, 1); c.position.set(u.x + 0.06 * Math.sin(t * 9 + u.p), 1.3 + u.h * s / 2, u.z); c.rotation.z = 0.12 * Math.sin(t * 5 + u.p); });
  fumaca.forEach((f, j) => { const u = ((tf * 0.22 + j / 7) % 1); f.position.set(FOGO.x + 0.6 * Math.sin(j * 2.1 + u * 3) + u * 2.2, 3 + u * 13, FOGO.z + 0.4 * Math.cos(j * 1.7)); f.scale.setScalar(0.55 + u * 1.5); f.visible = perto(FOGO.z, 70); });
  fFogo.int = 7 * fl; pocaFogo.material.opacity = 0.75 * fl; haloFogo.material.opacity = 0.9 * fl;
  const hFala = fala('fogo', t);
  grupoFogo.forEach((p, j) => { p.g.visible = perto(FOGO.z); p.g.position.copy(POS_FOGO[j]);
    const proFogo = olharPara(POS_FOGO[j], V(FOGO.x, 0, FOGO.z));
    const pra = j === 0 ? ease(seg(t, 42.4, 43.1)) * (1 - ease(seg(t, 47.4, 48.2))) : 0;
    p.g.rotation.y = proFogo;
    let dd = olharPara(POS_FOGO[j], olho) - proFogo; dd = Math.atan2(Math.sin(dd), Math.cos(dd));
    posaPersonagem(p, { maoD: V(0.14, 1.0, 0.42), maoE: V(-0.14, 1.0, 0.42), inclina: 0.22, cabecaX: -0.15, cabecaY: clamp(dd, -1.3, 1.3) * pra,
      boca: j === 0 && hFala ? bocaVoz(t, 11) : 'fechada', sobr: j === 0 ? 0.2 : -0.5, piscar: piscada(t, 3 + j * 0.4, j), olhar: [0, -0.2], respira: 0.006 * Math.sin(t * 2 + j) }); });
  isqueiro.g.visible = perto(-65.2); isqueiro.g.position.set(4.0, -0.3, -62.9); isqueiro.g.rotation.y = PI - 0.1;
  posaPersonagem(isqueiro, { inclina: 0.75, semPernas: true, maoD: V(0.1, 0.95, 0.5), maoE: V(-0.1, 0.95, 0.5), cabecaX: -0.3, sobr: 0.6, boca: 'meia' });
  faisca.visible = isqueiro.g.visible && Math.floor(t * 30) % 9 < 2; faisca.position.set(4.0, 0.62, -63.5);

  // ---------- ônibus ----------
  jorge.g.visible = perto(BZ, 60); jorge.g.position.set(0.6, 0.45, BZ + 1.5); jorge.g.rotation.y = 0.1;
  const jFala = fala('jorge', t), acena = Math.sin(t * 7);
  posaPersonagem(jorge, { boca: jFala ? bocaVoz(t, 13) : 'fechada', sobr: 0.6, maoD: jFala || t > T_CORRE ? V(0.3 + 0.12 * acena, 1.55, 0.1) : null, inclina: 0.1 });

  // ---------- o Escuro ----------
  escuro.visible = t > T_OUTRA - 3.6;
  if (escuro.visible) { davi.g.updateMatrixWorld(true);
    const m = davi.maos[1].getWorldPosition(V(0, 0, 0)); const base = doRig(k, -2.2, 0, -0.75);
    maoE.position.copy(m).add(V(-0.05, 0.02, 0)); maoE.rotation.set(0, 0, -1.4);
    setLimb(bracoE, V(base.x, 1.9, base.z), V(m.x - 0.08, m.y + 0.03, m.z)); setLimb(corpoE, V(base.x, 0.2, base.z), V(base.x, 2.3, base.z));
    const ab = easeOut(seg(t, T_OLHOS, T_OLHOS + 0.35)); olhosE.forEach((o, j) => { o.position.set(base.x + (j ? 0.09 : -0.09) + 0.1, 2.42, base.z + 0.21); o.scale.set(1, ab, 0.5); o.visible = ab > 0.02; }); }

  luzFinal.pos.copy(doRig(k, -0.1, 1.25, -0.75)); luzFinal.int = 1.5 * ease(seg(t, 71.6, 72.6));
  // ---------- luzes, pós, HUD ----------
  luzes.aplica(olho);
  const flash = pulso(t, T_ESTOURO, 0.22);
  const fim = ease(seg(t, T_FIM, T_FIM + 0.4));
  post.uniforms.flash.value = 0.8 * flash;
  post.uniforms.dark.value = clamp(Math.max(1 - seg(t, 0, 0.5), fim * 0.72, seg(t, DUR - 0.25, DUR)));
  enquete(ease(seg(t, T_FIM + 0.3, T_FIM + 0.8)));
  hud(t, SUBS, TAGS);
  drawFrame();
}
window.renderFrame = renderFrame; window.TOTAL = TOTAL; window.pronto = true;
