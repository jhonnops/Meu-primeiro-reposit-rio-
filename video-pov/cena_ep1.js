// A CASA DA VÓ DALVA — Episódio 1 (plano-sequência em primeira pessoa, ~81 s)
const DUR = 81.5, PI = Math.PI;

// ============ tempos principais ============
const T_NOVE = 36.2;                       // relógio bate 9
const T_APAGA = { quarto: 38.8, cor1: 39.2, cor2: 39.7, escada: 40.2, hall1: 40.8, hall2: 41.5 };
const T_COZINHA = 42.4;                    // porta da cozinha abre
const T_FOGE = 44.6;
const T_CAMA = 53.4;                       // já deitado
const T_PORTA = 54.2;                      // ela abre a porta do quarto
const T_CONTA = [57.4, 58.6, 59.8, 61.0];
const T_CINCO = 65.5, T_SAI = 67.5, T_FECHA = 69.5, T_NINA = 70.9, T_DEDOS = 75.2, T_FIM = 77.0;

// ============ texturas ============
const tMadeira = tex(512, 512, (g, w, h) => {
  g.fillStyle = '#8a5a3a'; g.fillRect(0, 0, w, h); blotch(g, w, h, 4, 50, 0.07);
  g.strokeStyle = '#2a1c18'; g.lineWidth = 5;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * w / 4, 0); g.lineTo(i * w / 4, h); g.stroke(); }
  g.lineWidth = 4; [[0, 150], [1, 380], [2, 90], [3, 300]].forEach(([i, y]) => { g.beginPath(); g.moveTo(i * w / 4, y); g.lineTo((i + 1) * w / 4, y); g.stroke(); });
});
const tPapel = (fundo, listra, seed) => tex(256, 256, (g, w, h) => {
  g.fillStyle = fundo; g.fillRect(0, 0, w, h);
  g.fillStyle = listra; for (let i = 0; i < 4; i++) g.fillRect(i * 64 + 22, 0, 20, h);
  blotch(g, w, h, seed, 40, 0.06);
});
const tQuarto = tPapel('#b9c9a4', '#a9bb93', 3), tCorredor = tPapel('#9a5a5a', '#8c4d4f', 8), tHall = tPapel('#a8926a', '#9a845c', 12);
const tLambri = tex(256, 256, (g, w, h) => { g.fillStyle = '#5a3a28'; g.fillRect(0, 0, w, h); blotch(g, w, h, 6, 30, 0.07);
  g.strokeStyle = '#21140f'; g.lineWidth = 6; g.strokeRect(22, 30, w - 44, h - 60); g.beginPath(); g.moveTo(0, 4); g.lineTo(w, 4); g.stroke(); });
const tTeto = tex(256, 256, (g, w, h) => { g.fillStyle = '#d9d2c2'; g.fillRect(0, 0, w, h); blotch(g, w, h, 5, 40, 0.07); });
const M = (t, rx, ry) => mat('#ffffff', { map: rep(t, rx, ry) });

function tRelogio(hora, min) {
  return tex(256, 256, (g, w) => {
    const c = w / 2; g.fillStyle = '#f4ecd6'; g.beginPath(); g.arc(c, c, 116, 0, 7); g.fill();
    g.strokeStyle = '#17121c'; g.lineWidth = 14; g.stroke();
    g.fillStyle = '#17121c'; g.font = 'bold 34px DejaVu Sans'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i * PI / 6; g.fillText(String(i), c + Math.sin(a) * 86, c - Math.cos(a) * 86 + 2); }
    const pont = (ang, len, lw) => { g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.sin(ang) * len, c - Math.cos(ang) * len); g.stroke(); };
    pont((hora % 12 + min / 60) * PI / 6, 52, 13); pont(min * PI / 30, 80, 8);
    g.fillStyle = '#b3202a'; g.beginPath(); g.arc(c, c, 9, 0, 7); g.fill();
  });
}
function tRetrato(seed, riscado) {
  return tex(200, 250, (g, w, h) => {
    const r = rng(seed), peles = ['#e3b08a', '#b9774a', '#f0c9a8', '#8a5a3c'], cab = ['#3a2a20', '#17121c', '#a8672e', '#d9b35a'], roupas = ['#4a7fb5', '#c0492b', '#3f8f5a', '#e0a82c', '#8a5ab0'];
    g.fillStyle = '#6b4a2a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#17121c'; g.lineWidth = 10; g.strokeRect(0, 0, w, h);
    g.fillStyle = '#d8cdb2'; g.fillRect(22, 22, w - 44, h - 44); g.lineWidth = 6; g.strokeRect(22, 22, w - 44, h - 44);
    g.fillStyle = roupas[Math.floor(r() * 5)]; g.beginPath(); g.ellipse(w / 2, h - 30, 62, 62, 0, PI, 0); g.fill(); g.stroke();
    g.fillStyle = cab[Math.floor(r() * 4)]; g.beginPath(); g.arc(w / 2, 108, 60, 0, 7); g.fill(); g.stroke();
    g.fillStyle = peles[Math.floor(r() * 4)]; g.beginPath(); g.arc(w / 2, 120, 52, 0, 7); g.fill(); g.stroke();
    [-1, 1].forEach(s => { g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2 + s * 20, 114, 14, 0, 7); g.fill(); g.lineWidth = 4; g.stroke(); g.fillStyle = '#17121c'; g.beginPath(); g.arc(w / 2 + s * 20, 116, 6, 0, 7); g.fill(); });
    g.lineWidth = 4; g.beginPath(); g.arc(w / 2, 138, 16, 0.2, PI - 0.2); g.stroke();
    if (riscado) { g.strokeStyle = '#a3121c'; g.lineWidth = 11; g.lineCap = 'round';
      for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(30 + r() * 50, 40 + r() * 170); g.lineTo(120 + r() * 50, 40 + r() * 170); g.stroke(); }
      g.beginPath(); g.moveTo(34, 36); g.lineTo(w - 34, h - 36); g.moveTo(w - 34, 36); g.lineTo(34, h - 36); g.stroke(); }
  });
}
const tNoite = tex(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#141b3a'); gr.addColorStop(1, '#3a4a7a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#f2f0d8'; g.beginPath(); g.arc(170, 80, 34, 0, 7); g.fill(); g.strokeStyle = '#17121c'; g.lineWidth = 5; g.stroke();
  g.fillStyle = '#10142a'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, 190); g.lineTo(50, 150); g.lineTo(90, 200); g.lineTo(140, 160); g.lineTo(200, 210); g.lineTo(w, 170); g.lineTo(w, h); g.fill(); });

// ============ luz ============
const amb = new THREE.AmbientLight('#ffffff', 1); scene.add(amb);
const lua = new THREE.DirectionalLight('#9fb6ff', 0); lua.position.set(1, 0.8, -0.2); scene.add(lua);
const C_DIA = new THREE.Color('#ffe9cc'), C_NOITE = new THREE.Color('#6f86c8');
const lampadas = {};
function lampada(nome, x, y, z) {
  box(0.34, 0.05, 0.34, flat('#2a2530'), x, y - 0.025, z);
  const m = flat('#fff6d8'); ball(0.13, m, x, y - 0.14, z, scene, 1, 0.8, 1);
  const pl = new THREE.PointLight('#ffe2b0', 4.2, 11, 1.2); pl.position.set(x, y - 0.45, z); scene.add(pl);
  lampadas[nome] = { m, pl };
}
function acende(t) {
  let apagadas = 0;
  for (const nome in lampadas) {
    const L = lampadas[nome], d = t - T_APAGA[nome];
    const k = d < 0 ? 1 : d < 0.3 ? (Math.floor(d * 30) % 3 === 0 ? 0.9 : 0.25) : 0;
    L.pl.intensity = 4.2 * k; L.m.color.set(k > 0.5 ? '#fff6d8' : '#4a4652'); apagadas += 1 - k;
  }
  const n = clamp(apagadas / 6);
  amb.color.copy(C_DIA).lerp(C_NOITE, n); amb.intensity = lerp(1.45, 2.1, n); lua.intensity = 0.9 * n;
  return n;
}

// ============ QUARTO (x -3..3, z 0..5) ============
const ALT = 2.8;
laje(-3, 0, 3, 5, 0, M(tMadeira, 4, 3.3)); laje(-3, 0, 3, 5, ALT, M(tTeto, 3, 3));
parede(-3, 5, 3, 5, 0, ALT, M(tQuarto, 6, 1)); parede(-3, 0, -3, 5, 0, ALT, M(tQuarto, 5, 1)); parede(3, 0, 3, 5, 0, ALT, M(tQuarto, 5, 1));
parede(-3, 0, -0.5, 0, 0, ALT, M(tQuarto, 2.5, 1)); parede(0.5, 0, 3, 0, 0, ALT, M(tQuarto, 2.5, 1)); parede(-0.5, 0, 0.5, 0, 2.1, ALT, M(tQuarto, 1, 0.25));
[[-3 + 0.03, 2.5, 0.06, 5], [3 - 0.03, 2.5, 0.06, 5], [0, 5 - 0.03, 6, 0.06]].forEach(([x, z, w, d]) => box(w, 0.14, d, mat('#4a3020'), x, 0.07, z));
lampada('quarto', 0, ALT, 2.6);
// janela com grade (parede direita)
quadro(1.3, 1.2, tNoite, 2.985, 1.65, 2.6, -PI / 2);
{ const mq = flat('#2a1c18');
  box(0.08, 0.1, 1.5, mq, 2.96, 2.28, 2.6); box(0.08, 0.1, 1.5, mq, 2.96, 1.02, 2.6); box(0.08, 1.3, 0.1, mq, 2.96, 1.65, 1.9); box(0.08, 1.3, 0.1, mq, 2.96, 1.65, 3.3);
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), mat('#3a3a44')); b.position.set(2.93, 1.65, 2.1 + i * 0.25); scene.add(b); } }
// relógio de parede (8:58) ao lado da porta
const RELOGIO = V(1.3, 2.25, 0.03);
quadro(0.55, 0.55, tRelogio(8, 58), RELOGIO.x, RELOGIO.y, RELOGIO.z, 0);
// tapete e brinquedos
{ const tp = laje(-0.9, 0.9, 0.9, 2.5, 0.012, mat('#7a3f52')); laje(-0.75, 1.05, 0.75, 2.35, 0.018, mat('#a8596c'));
  box(0.14, 0.14, 0.14, mat('#e0a82c'), -1.6, 0.07, 1.6).rotation.y = 0.5; box(0.14, 0.14, 0.14, mat('#4a7fb5'), -1.45, 0.07, 1.82).rotation.y = 1.1; ball(0.13, mat('#c0492b'), 1.9, 0.13, 1.3); }
// camas: cabeceira na parede do fundo
const CAMA_Y = 0.5, CAMAS = [-2.1, -0.7, 0.7, 2.1], CORES_MANTA = ['#4a7fb5', '#c9795a', '#8a5ab0', '#b08a3a'];
const mantas = [];
CAMAS.forEach((x, i) => {
  const md = mat('#4a3020');
  [[-0.42, 2.94], [0.42, 2.94], [-0.42, 4.86], [0.42, 4.86]].forEach(([dx, z]) => box(0.07, 0.3, 0.07, md, x + dx, 0.15, z));
  box(0.94, 0.06, 2.0, md, x, 0.27, 3.9); box(0.98, 0.85, 0.07, md, x, 0.6, 4.94); box(0.98, 0.35, 0.06, md, x, 0.42, 2.9);
  box(0.9, 0.2, 1.96, mat('#ece6d8'), x, 0.4, 3.9);
  box(0.6, 0.1, 0.34, mat('#f7f3ea'), x, 0.55, 4.64);
  const manta = box(0.96, 0.2, 1, mat(CORES_MANTA[i]), x, 0.6, 3.5); mantas.push(manta);
  if (i === 0 || i === 3) { setManta(manta, 4.36); ball(0.5, mat(CORES_MANTA[i]), x, 0.66, 3.75, scene, 0.72, 0.36, 1.25); ball(0.13, mat(i ? '#a8672e' : '#17121c'), x + 0.05, 0.66, 4.58); }
});
function setManta(m, zBorda) { const L = zBorda - 2.93; m.scale.z = L; m.position.z = 2.93 + L / 2; }
const dobra = box(0.96, 0.1, 0.12, mat(CORES_MANTA[2]), 0.7, 0.72, 4.1);     // borda da manta puxada até o nariz

// porta do quarto (dobradiça em x=-0.5, abre para o corredor)
const portaQ = new THREE.Group(); portaQ.position.set(-0.5, 0, 0); scene.add(portaQ);
box(1.0, 2.1, 0.06, mat('#6b4a32'), 0.5, 1.05, 0, portaQ); box(0.7, 0.75, 0.07, mat('#7a5638'), 0.5, 1.5, 0, portaQ); box(0.7, 0.75, 0.07, mat('#7a5638'), 0.5, 0.55, 0, portaQ);
ball(0.045, mat('#d9b35a'), 0.9, 1.0, 0.06, portaQ); ball(0.045, mat('#d9b35a'), 0.9, 1.0, -0.06, portaQ);

// ============ CORREDOR (x ±0.9, z 0..-9) + ESCADA (z -9..-13) ============
const CL = 0.9;
laje(-CL, -9, CL, 0, 0, M(tMadeira, 1.2, 6)); laje(-CL, -13, CL, 0, ALT, M(tTeto, 1, 6));
[-1, 1].forEach(s => {
  parede(s * CL, 0, s * CL, -13, 1.0, ALT, M(tCorredor, 13, 1)); parede(s * CL, 0, s * CL, -9, 0, 1.0, M(tLambri, 9, 1));
  parede(s * CL, -9, s * CL, -13, -2.8, 1.0, M(tLambri, 4, 3.8));
  box(0.04, 0.06, 13, flat('#21140f'), s * (CL - 0.02), 1.02, -6.5);
});
lampada('cor1', 0, ALT, -2.5); lampada('cor2', 0, ALT, -6.5); lampada('escada', 0, ALT, -11);
[[-1, -1.9, 11], [-1, -3.4, 12], [-1, -4.9, 13], [-1, -6.4, 14], [-1, -7.9, 15], [1, -1.5, 16], [1, -3.5, 17], [1, -5.5, 18, true], [1, -7.5, 19]]
  .forEach(([s, z, seed, risc]) => quadro(0.5, 0.62, tRetrato(seed, risc), s * (CL - 0.015), 1.68, z, -s * PI / 2));
const NDEG = 14, PASSO = 4 / NDEG;
for (let i = 0; i < NDEG; i++) { const topo = -0.2 * (i + 1); box(2 * CL, topo + 2.8, PASSO, mat(i % 2 ? '#7a4e32' : '#84563a'), 0, (topo - 2.8) / 2, -9 - (i + 0.5) * PASSO); }
const pisoY = z => z > -9 ? 0 : z < -13 ? -2.8 : lerp(0, -2.8, (-9 - z) / 4);

// ============ HALL (chão y=-2.8, x ±2.5, z -13..-18) ============
const HY = -2.8;
laje(-2.5, -18, 2.5, -13, HY, M(tMadeira, 3.3, 3.3)); laje(-2.5, -18, 2.5, -13, 0, M(tTeto, 3, 3));
parede(-2.5, -18, 2.5, -18, HY, 0, M(tHall, 5, 1)); parede(2.5, -13, 2.5, -18, HY, 0, M(tHall, 5, 1));
parede(-2.5, -13, -0.9, -13, HY, 0, M(tHall, 1.6, 1)); parede(0.9, -13, 2.5, -13, HY, 0, M(tHall, 1.6, 1)); parede(-0.9, -13, 0.9, -13, 0, ALT, M(tCorredor, 1.8, 1));
const KZ0 = -16.9, KZ1 = -15.9;                                            // vão da cozinha (parede esquerda)
parede(-2.5, -13, -2.5, KZ1, HY, 0, M(tHall, 2.9, 1)); parede(-2.5, KZ0, -2.5, -18, HY, 0, M(tHall, 1.1, 1)); parede(-2.5, KZ0, -2.5, KZ1, HY + 2.1, 0, M(tHall, 1, 0.25));
parede(-3.9, -18, -3.9, -14.5, HY, 0, flat('#0d0a12')); laje(-3.9, -18, -2.5, -14.5, HY, mat('#2a2028')); laje(-3.9, -18, -2.5, -14.5, 0, flat('#0d0a12'));
parede(-3.9, -18, -2.5, -18, HY, 0, flat('#0d0a12')); parede(-3.9, -14.5, -2.5, -14.5, HY, 0, flat('#0d0a12'));
lampada('hall1', 0, 0, -14.6); lampada('hall2', 0, 0, -16.9);
laje(-0.8, -17.7, 0.8, -15.2, HY + 0.012, mat('#5a2f3a')); laje(-0.65, -17.55, 0.65, -15.35, HY + 0.018, mat('#7a4050'));
// porta da cozinha
const portaK = new THREE.Group(); portaK.position.set(-2.5, HY, KZ0); scene.add(portaK);
box(0.06, 2.1, 1.0, mat('#5a4030'), 0, 1.05, 0.5, portaK); ball(0.045, mat('#d9b35a'), 0.06, 1.0, 0.88, portaK);
// porta da frente com cinco cadeados
{ const z = -18;
  box(1.5, 2.5, 0.1, mat('#3a2418'), 0, HY + 1.25, z + 0.03);
  box(1.24, 2.3, 0.08, mat('#2f5a48'), 0, HY + 1.15, z + 0.08);
  box(0.42, 0.8, 0.03, mat('#3a6a56'), -0.3, HY + 1.6, z + 0.125); box(0.42, 0.8, 0.03, mat('#3a6a56'), 0.3, HY + 1.6, z + 0.125);
  box(0.42, 0.7, 0.03, mat('#3a6a56'), -0.3, HY + 0.6, z + 0.125); box(0.42, 0.7, 0.03, mat('#3a6a56'), 0.3, HY + 0.6, z + 0.125);
  ball(0.06, mat('#d9b35a'), 0.48, HY + 1.05, z + 0.17);
  [0.45, 0.8, 1.3, 1.65, 2.0].forEach((y, i) => {
    box(0.3, 0.07, 0.03, mat('#8a8a94'), 0.55, HY + y, z + 0.13);
    box(0.11, 0.1, 0.05, mat(i % 2 ? '#d9b35a' : '#c8c8d2'), 0.5, HY + y - 0.09, z + 0.15);
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.011, 6, 14, PI), mat('#6a6a74')); t.position.set(0.5, HY + y - 0.04, z + 0.15); scene.add(t);
  });
  const cor = box(1.35, 0.05, 0.03, mat('#6a6a74'), 0, HY + 1.45, z + 0.15); cor.rotation.z = 0.5;
}
// relógio de pêndulo (9:00)
const PENDULO_POS = V(2.05, HY, -17.55);
{ const md = mat('#4a2c1c'); box(0.6, 2.2, 0.4, md, PENDULO_POS.x, HY + 1.1, PENDULO_POS.z); box(0.7, 0.12, 0.48, md, PENDULO_POS.x, HY + 2.26, PENDULO_POS.z);
  box(0.36, 0.9, 0.02, flat('#1a1014'), PENDULO_POS.x, HY + 0.85, PENDULO_POS.z + 0.205); }
const faceP = quadro(0.46, 0.46, tRelogio(8, 58), PENDULO_POS.x, HY + 1.78, PENDULO_POS.z + 0.21, 0);
const face9 = tRelogio(9, 0), face858 = faceP.material.map;
const pend = new THREE.Group(); pend.position.set(PENDULO_POS.x, HY + 1.28, PENDULO_POS.z + 0.23); scene.add(pend);
box(0.025, 0.6, 0.015, mat('#d9b35a'), 0, -0.3, 0, pend); ball(0.07, mat('#d9b35a'), 0, -0.62, 0, pend, 1, 1, 0.3);
// cabideiro e mesinha
{ const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), mat('#3a2418')); c.position.set(-2.1, HY + 0.9, -17.5); scene.add(c);
  ball(0.2, mat('#5a3a5a'), -2.05, HY + 1.45, -17.42, scene, 0.7, 1.4, 0.6);
  box(0.7, 0.06, 0.4, mat('#5a3a28'), 1.9, HY + 0.75, -14.2); box(0.06, 0.75, 0.06, mat('#5a3a28'), 1.6, HY + 0.37, -14.2); box(0.06, 0.75, 0.06, mat('#5a3a28'), 2.2, HY + 0.37, -14.2);
  quadro(0.5, 0.62, tRetrato(31), 2.485, HY + 1.65, -15.3, -PI / 2); }

// ============ elenco ============
const pov = criaPOV({ pele: '#c98a5a', manga: '#3f8f5a', calca: '#2b3350', tenis: '#f2efe8', bico: '#f0b429' });
pov.rig.rotation.order = 'YXZ';
const nina = criaPersonagem({ pele: '#b9774a', nariz: '#a86539', roupa: '#f2c230', calca: '#3a2f5c', cabelo: '#28343f', presilha: '#e8486a', escala: 0.93 });
nina.g.rotation.order = 'XYZ';
const vo = criaPersonagem({ pele: '#d9b79a', nariz: '#c79c80', roupa: '#6b4a7a', cabelo: '#d8d8de', penteado: 'coque', oculos: true, saia: '#3c2f45', xale: '#8a3d52', sobrCor: '#8d8d96', tenis: '#7a4050', escala: 0.9 });
const vela = new THREE.Group(); vo.sup.add(vela);
{ const p = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.02, 16), mat('#b08a3a')); vela.add(p);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.13, 10), mat('#f2ecd8')); c.position.y = 0.07; vela.add(c); }
const chama = ball(0.03, flat('#ffd24a'), 0, 0.17, 0, vela, 0.75, 1.5, 0.75);
const luzVela = new THREE.PointLight('#ffb45a', 0, 7, 1.0); luzVela.position.set(0, 0.3, 0.3); vela.add(luzVela);
// "o quinto": dedos pálidos que sobem pela beirada da cama
const quinto = new THREE.Group(); quinto.position.set(0.25, 0, 4.05); quinto.scale.set(1.7, 1, 1.7); scene.add(quinto);
const dedosQ = [0, 1, 2, 3].map(i => { const d = new THREE.Group(); d.position.z = (i - 1.5) * 0.04; quinto.add(d);
  const pele = mat('#a9b8c8'); const a = limb(0.016, pele, d), b = limb(0.016, pele, d);
  setLimb(a, V(-0.012, -0.11, 0), V(-0.012, 0.012, 0)); setLimb(b, V(-0.012, 0.012, 0), V(0.085, 0.012, 0)); return d; });

// ============ roteiro ============
const ROSA = '#ffb3d1', BRANCO = '#ffffff', VERDE = '#cdf58a';
const SUBS = [
  { a: 2.6, b: 5.6, txt: 'Não levanta. Ela ainda tá acordada.', cor: ROSA, q: 'nina' },
  { a: 6.9, b: 9.2, txt: 'Onde eu tô? Cadê a minha mãe?', cor: BRANCO },
  { a: 11.5, b: 14.2, txt: 'Todo mundo pergunta isso no primeiro dia.', cor: ROSA, q: 'nina' },
  { a: 15.2, b: 17.6, txt: 'Volta! Faltam dois minutos!', cor: ROSA, q: 'nina' },
  { a: 31.0, b: 34.6, txt: 'Abre... abre!', cor: BRANCO },
  { a: 40.2, b: 44.0, txt: 'Hora de contar os meus netinhos...', cor: VERDE, q: 'vo' },
  { a: T_CONTA[0], b: T_CONTA[0] + 1.0, txt: 'Um...', cor: VERDE, q: 'vo' },
  { a: T_CONTA[1], b: T_CONTA[1] + 1.0, txt: 'dois...', cor: VERDE, q: 'vo' },
  { a: T_CONTA[2], b: T_CONTA[2] + 1.0, txt: 'três...', cor: VERDE, q: 'vo' },
  { a: T_CONTA[3], b: T_CONTA[3] + 1.2, txt: 'quatro.', cor: VERDE, q: 'vo' },
  { a: T_CINCO, b: T_CINCO + 1.8, txt: 'Cinco.', cor: VERDE, q: 'vo' },
  { a: 72.0, b: 75.0, txt: 'Não olha pra baixo.', cor: ROSA, q: 'nina' },
];
const TAGS = [{ a: 0.4, b: 3.2, txt: 'PARTE 1' }, { a: T_NOVE + 0.2, b: T_NOVE + 2.6, txt: '21:00' }];
// tempos reais das falas gravadas (falas_ep1.js) e boca guiada pelo volume da voz
if (typeof FALAS !== 'undefined') SUBS.forEach((s, i) => { s.fa = FALAS[i].a; s.fb = FALAS[i].b; s.a = FALAS[i].a - 0.05; s.b = Math.max(FALAS[i].b + 0.4, FALAS[i].a + 1.0); });
const fala = (q, t) => SUBS.some(s => s.q === q && t >= (s.fa ?? s.a) && t < (s.fb ?? s.b));
function bocaVoz(t, baixa) {
  if (typeof BOCA_NIVEL === 'undefined') return bocaFalando(t);
  const f = Math.round(t * FPS), n = +(BOCA_NIVEL[f] || 0) / 9;
  if (n < 0.12) return 'fechada'; if (n < 0.42 || baixa) return 'meia'; if (n < 0.78) return 'aberta';
  return (f >> 1) % 2 ? 'o' : 'aberta';
}
document.getElementById('opA').textContent = 'A) OLHAR DEBAIXO DA CAMA';
document.getElementById('opB').textContent = 'B) FINGIR QUE DORMIU';

// câmera: x,z = posição; yaw = corpo; cab = giro só da cabeça; alt = altura dos olhos acima do piso
const CAMX = 0.7;
const KC = [
  { t: 0, x: CAMX, z: 4.3, yaw: 0, cab: 0, pitch: 1.0, alt: 0.72 },
  { t: 2.0, x: CAMX, z: 4.3, yaw: 0, cab: 0, pitch: 0.9, alt: 0.72 },
  { t: 4.0, x: CAMX, z: 4.0, yaw: 0, cab: 0, pitch: -0.18, alt: 1.05 },
  { t: 5.9, x: CAMX, z: 4.0, yaw: 0, cab: 0.5, pitch: -0.15, alt: 1.05 },
  { t: 6.6, x: CAMX, z: 4.0, yaw: 0, cab: 1.45, pitch: -0.1, alt: 1.05 },
  { t: 9.4, x: CAMX, z: 4.0, yaw: 0, cab: 1.45, pitch: -0.1, alt: 1.05 },
  { t: 10.1, x: CAMX, z: 4.0, yaw: 0, cab: -0.14, pitch: 0.3, alt: 1.05 },
  { t: 11.1, x: CAMX, z: 4.0, yaw: 0, cab: -0.14, pitch: 0.3, alt: 1.05 },
  { t: 11.7, x: CAMX, z: 4.0, yaw: 0, cab: 1.45, pitch: -0.1, alt: 1.05 },
  { t: 14.2, x: CAMX, z: 4.0, yaw: 0, cab: 1.45, pitch: -0.1, alt: 1.05 },
  { t: 15.0, x: 0.0, z: 3.7, yaw: 0.2, cab: 0, pitch: -0.25, alt: 1.5 },
  { t: 17.1, x: 0.0, z: 0.72, yaw: 0, cab: 0, pitch: -0.12, alt: 1.55 },
  { t: 17.9, x: 0.05, z: 0.5, yaw: 0, cab: 0, pitch: -0.1, alt: 1.55 },
  { t: 18.7, x: 0.15, z: -1.1, yaw: 0, cab: 0, pitch: -0.15, alt: 1.55 },
  { t: 21.0, x: 0.1, z: -4.3, yaw: 0, cab: 0, pitch: -0.12, alt: 1.55 },
  { t: 21.6, x: 0.05, z: -4.8, yaw: 0, cab: -0.95, pitch: 0.02, alt: 1.55 },
  { t: 22.7, x: 0.05, z: -5.35, yaw: 0, cab: -1.3, pitch: 0.04, alt: 1.55 },
  { t: 23.3, x: 0.05, z: -6.3, yaw: 0, cab: 0, pitch: -0.15, alt: 1.55 },
  { t: 24.2, x: 0, z: -8.9, yaw: 0, cab: 0, pitch: -0.42, alt: 1.55 },
  { t: 27.4, x: 0, z: -13.2, yaw: 0, cab: 0, pitch: -0.3, alt: 1.55 },
  { t: 30.0, x: 0.3, z: -16.95, yaw: 0, cab: 0, pitch: -0.08, alt: 1.55 },
  { t: 36.3, x: 0.3, z: -16.95, yaw: 0, cab: 0, pitch: -0.08, alt: 1.55 },
  { t: 36.8, x: 0.3, z: -16.95, yaw: 0, cab: -1.2, pitch: 0.08, alt: 1.55 },
  { t: 38.4, x: 0.3, z: -16.95, yaw: 0, cab: -1.2, pitch: 0.08, alt: 1.55 },
  { t: 39.1, x: 0.1, z: -17.3, yaw: -PI, cab: 0, pitch: 0.12, alt: 1.55 },
  { t: 42.2, x: 0.1, z: -17.35, yaw: -PI, cab: 0, pitch: 0.1, alt: 1.55 },
  { t: 42.8, x: 0.1, z: -17.35, yaw: -PI, cab: -1.15, pitch: -0.05, alt: 1.5 },
  { t: T_FOGE, x: 0.15, z: -17.4, yaw: -PI, cab: -1.15, pitch: -0.05, alt: 1.5 },
  { t: 45.1, x: 0.2, z: -16.6, yaw: -PI, cab: 0, pitch: 0.05, alt: 1.55 },
  { t: 46.6, x: 0, z: -13.0, yaw: -PI, cab: 0, pitch: 0.3, alt: 1.55 },
  { t: 49.4, x: 0, z: -9.0, yaw: -PI, cab: 0, pitch: 0.12, alt: 1.55 },
  { t: 51.5, x: 0.12, z: 0.2, yaw: -PI, cab: 0, pitch: -0.1, alt: 1.55 },
  { t: 52.4, x: 0.05, z: 3.5, yaw: -PI - 0.5, cab: 0, pitch: -0.45, alt: 1.45 },
  { t: T_CAMA, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0, pitch: 0.0, alt: 0.9 },
  { t: 55.6, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0, pitch: 0.02, alt: 0.9 },
  { t: 57.3, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0.22, pitch: 0.16, alt: 0.9 },
  { t: 62.4, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0.3, pitch: 0.2, alt: 0.9 },
  { t: 65.0, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0.72, pitch: 0.46, alt: 0.9 },
  { t: T_SAI, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0.72, pitch: 0.46, alt: 0.9 },
  { t: 69.3, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0.03, pitch: 0.03, alt: 0.9 },
  { t: T_NINA, x: CAMX, z: 4.3, yaw: -2 * PI, cab: 0.03, pitch: 0.03, alt: 0.9 },
  { t: 71.7, x: CAMX, z: 4.15, yaw: -2 * PI, cab: 1.4, pitch: -0.08, alt: 1.0 },
  { t: T_DEDOS, x: CAMX, z: 4.15, yaw: -2 * PI, cab: 1.4, pitch: -0.08, alt: 1.0 },
  { t: 75.9, x: CAMX, z: 4.15, yaw: -2 * PI, cab: 1.32, pitch: -0.72, alt: 0.98 },
  { t: 99, x: CAMX, z: 4.15, yaw: -2 * PI, cab: 1.32, pitch: -0.72, alt: 0.98 },
];
// fase da corrida = distância acumulada
const TOTAL = Math.round(DUR * FPS), DIST = new Float32Array(TOTAL + 2), VEL = new Float32Array(TOTAL + 2);
{ let a = chave(KC, 0); for (let i = 1; i <= TOTAL + 1; i++) { const b = chave(KC, i / FPS); const d = Math.hypot(b.x - a.x, b.z - a.z); DIST[i] = DIST[i - 1] + d; VEL[i] = d * FPS; a = b; } }

// Vó Dalva: posição/rotação por chaves
const KV = [
  { t: 0, x: -3.1, y: HY, z: -16.4, rot: PI / 2, inc: 0.3 },
  { t: T_COZINHA + 0.2, x: -3.1, y: HY, z: -16.4, rot: PI / 2, inc: 0.3 },
  { t: 43.7, x: -2.0, y: HY, z: -16.45, rot: PI / 2 - 0.35, inc: 0.34 },
  { t: 46.0, x: -2.1, y: HY, z: -16.45, rot: PI / 2 - 0.35, inc: 0.34 },
  { t: 46.01, x: 0, y: 0, z: -0.55, rot: 0, inc: 0.3 },
  { t: 55.6, x: 0, y: 0, z: -0.55, rot: 0, inc: 0.3 },
  { t: 57.3, x: 0, y: 0, z: 2.15, rot: 0, inc: 0.3 },
  { t: 60.8, x: 0, y: 0, z: 2.15, rot: 0, inc: 0.3 },
  { t: 61.3, x: 0.05, y: 0, z: 2.2, rot: 0.32, inc: 0.42 },
  { t: 62.6, x: 0.05, y: 0, z: 2.2, rot: 0.32, inc: 0.42 },
  { t: 65.0, x: 0.03, y: 0, z: 3.5, rot: 0.72, inc: 0.62 },
  { t: T_SAI, x: 0.03, y: 0, z: 3.5, rot: 0.72, inc: 0.62 },
  { t: 68.1, x: 0, y: 0, z: 3.2, rot: PI, inc: 0.3 },
  { t: T_FECHA + 0.2, x: 0, y: 0, z: -0.6, rot: PI, inc: 0.3 },
  { t: 99, x: 0, y: 0, z: -0.6, rot: PI, inc: 0.3 },
];
const ALVOS = [V(-2.1, 0.7, 3.9), V(-0.7, 0.7, 3.9), V(2.1, 0.7, 3.9), V(CAMX, 0.75, 4.2)];

function renderFrame(i) {
  const t = i / FPS, k = chave(KC, t);
  const noite = acende(t);

  // ---------- protagonista ----------
  const naCama = k.alt < 1.3 && k.z > 2.5;
  const correr = naCama ? 0 : clamp(VEL[i] / 2.6);
  const fase = DIST[i] * 2 * PI / 3.2;
  pov.rig.position.set(k.x, pisoY(k.z), k.z);
  pov.rig.rotation.set(0, k.yaw, 0);
  const acorda = seg(t, 0, 2.2);
  const puxa = ease(seg(t, 2.0, 2.5)) * (1 - ease(seg(t, 14.2, 14.8)));          // empurra a manta e senta
  const empurra = ease(seg(t, 17.0, 17.3)) * (1 - ease(seg(t, 18.1, 18.5)));     // porta do quarto
  const tranca = ease(seg(t, 30.0, 30.4)) * (1 - ease(seg(t, 38.5, 39.0)));      // porta da frente
  const agarra = ease(seg(t, 52.9, 53.5)) * (1 - ease(seg(t, T_NINA, T_NINA + 0.5)));   // manta até o nariz
  const sac = (t > 31 && t < 35.5) ? 1 : 0;
  const maos = [-1, 1].map(s => {
    if (puxa > 0) { const u = ease(seg(t, 2.2, 4.0)); return { k: puxa, fecha: 0.85, pos: V(s * 0.2, lerp(0.74, 0.69, u), lerp(-0.22, -0.42, u)), cotovelo: V(s * 0.33, 0.55, 0.05) }; }
    if (empurra > 0) return { k: empurra, fecha: 0, pos: V(s * 0.17, 1.22, -0.5 - 0.12 * seg(t, 17.3, 18.0)), cotovelo: V(s * 0.3, 1.0, -0.05) };
    if (tranca > 0) return s > 0
      ? { k: tranca, fecha: 0.9, pos: V(0.18 + sac * 0.02 * Math.sin(t * 41), 1.06 + sac * 0.025 * Math.sin(t * 37), -0.8), cotovelo: V(0.33, 0.98, -0.12) }
      : { k: tranca, fecha: sac ? 0.9 : 0.05, pos: V(-0.2, 1.38 + sac * 0.03 * Math.sin(t * 23), -0.84 + sac * 0.09 * Math.abs(Math.sin(t * 11.5))), cotovelo: V(-0.33, 1.05, -0.12) };
    if (agarra > 0) return { k: agarra, fecha: 0.95, pos: V(s * 0.16, 0.75, -0.36), cotovelo: V(s * 0.31, 0.55, 0.0) };
    return null;
  });
  const pulo = Math.sin(seg(t, 52.4, T_CAMA) * PI);
  posaPOV(pov, { correr, fase, pitch: k.pitch + 0.012 * Math.sin(t * 1.9) * (1 - correr), altura: k.alt, deitado: naCama,
    roll: 0.22 * pulo + 0.03 * Math.sin(seg(t, 14.2, 15.0) * PI), tremor: sac * 0.9 + (noite > 0.9 && naCama ? 0.12 : 0), maos });
  if (sac) camera.position.x += 0.008 * Math.sin(t * 43);
  camera.rotation.y += k.cab;

  // manta do protagonista
  const zManta = t < 52.7 ? lerp(4.12, 3.6, ease(seg(t, 2.2, 4.0))) : lerp(lerp(3.6, 3.93, ease(seg(t, 52.8, 53.5))), 3.85, ease(seg(t, T_NINA, T_NINA + 0.7)));
  setManta(mantas[2], zManta);
  dobra.visible = false; dobra.position.z = zManta - 0.04;

  // ---------- portas ----------
  portaQ.rotation.y = t < 50 ? 1.45 * easeOut(seg(t, 17.3, 18.0))
    : t < T_PORTA ? lerp(1.45, 0.1, ease(seg(t, 51.8, 52.8)))
    : lerp(lerp(0.1, 1.35, ease(seg(t, T_PORTA, T_PORTA + 1.5))), 0, ease(seg(t, T_FECHA, T_FECHA + 1.3)));
  portaK.rotation.y = 1.25 * ease(seg(t, T_COZINHA, T_COZINHA + 1.7));

  // ---------- relógio de pêndulo ----------
  faceP.material.map = t >= T_NOVE ? face9 : face858;
  pend.rotation.z = 0.22 * Math.sin(t * PI);

  // ---------- Nina ----------
  const deitada = t > 38 && t < T_NINA - 0.2;
  setManta(mantas[1], deitada ? 4.3 : 4.1);
  if (deitada) {
    nina.g.position.set(-0.7, 0.63, 3.32); nina.g.rotation.set(1.42, PI, 0);
    posaPersonagem(nina, { semPernas: true, piscar: 1, boca: 'fechada', sobr: -0.6, respira: 0.006 * Math.sin(t * 2.2) });
  } else {
    const fim = t >= T_NINA - 0.2;
    const olhaMim = fim ? 0.15 : (t < 14.6 ? 0.25 : -0.9 * ease(seg(t, 14.6, 15.2)));
    nina.g.position.set(-0.7, CAMA_Y - 0.71 * 0.93, 4.2); nina.g.rotation.set(0, PI / 2 + olhaMim, 0);
    const shh = ease(seg(t, 2.4, 2.8)) * (1 - ease(seg(t, 5.6, 6.0)));
    const relog = ease(seg(t, 9.3, 9.8)) * (1 - ease(seg(t, 11.2, 11.7)));
    const volta = ease(seg(t, 14.9, 15.3));
    let maoD = null, maoE = null;
    if (shh > 0) maoD = V(0.25, 0.74, 0).lerp(V(0.03, 1.27, 0.24), shh);
    if (relog > 0) maoD = V(0.25, 0.74, 0).lerp(apontaPara(nina, RELOGIO, 0.48), relog);
    if (volta > 0 && !fim) maoD = V(0.25, 0.74, 0).lerp(apontaPara(nina, V(0, 1.3, 0), 0.5), volta);
    if (fim) { maoD = V(0.1, 1.08, 0.2); maoE = V(-0.1, 1.08, 0.2); }
    const falando = fala('nina', t);
    posaPersonagem(nina, { semPernas: true, maoD, maoE,
      respira: 0.008 * Math.sin(t * 3.1),
      boca: falando ? bocaVoz(t, t < 6) : (fim ? 'meia' : 'fechada'),
      sobr: fim ? -1 : volta > 0 ? -1 : -0.45, arregala: fim ? 1 : volta * 0.7,
      olhar: fim ? [0.35, -0.85] : relog > 0.5 ? [0.3, 0.4] : [0, 0.15],
      piscar: fim ? 0 : piscada(t, 2.9, 0.4),
      cabecaY: relog * -0.7, cabecaX: fim ? 0.2 : 0, cabecaInc: 0.05 * Math.sin(t * 1.3) });
  }

  // ---------- Vó Dalva ----------
  const kv = chave(KV, t);
  vo.g.visible = (t > T_COZINHA && t < 46) || t > 52.6;
  vo.g.position.set(kv.x, kv.y, kv.z); vo.g.rotation.y = kv.rot;
  const andando = clamp(Math.hypot(chave(KV, t + 0.05).x - kv.x, chave(KV, t + 0.05).z - kv.z) * 30);
  let idx = -1; T_CONTA.forEach((tc, j) => { if (t >= tc - 0.35) idx = j; });
  const contando = t >= T_CONTA[0] - 0.35 && t < T_CONTA[3] + 1.5;
  const cinco = t >= T_CINCO - 2.2 && t < T_SAI;
  let maoD = null;
  if (contando) { const u = ease(seg(t, T_CONTA[idx] - 0.35, T_CONTA[idx]));
    const de = idx > 0 ? apontaPara(vo, ALVOS[idx - 1], 0.46) : V(0.25, 0.74, 0);
    maoD = de.lerp(apontaPara(vo, ALVOS[idx], 0.46), u); }
  const maoE = V(-0.2, 1.02, 0.24);
  const sorri = ease(seg(t, T_CINCO - 1.6, T_CINCO - 0.6));
  const olhaBaixo = ease(seg(t, T_CINCO + 0.2, T_CINCO + 0.9));
  posaPersonagem(vo, { inclina: kv.inc, maoD, maoE,
    respira: 0.012 * Math.abs(Math.sin(t * 5.5)) * andando,
    boca: fala('vo', t) ? (cinco ? (bocaVoz(t) === 'fechada' ? 'sorrisinho' : 'sorriso') : bocaVoz(t)) : (cinco ? (sorri > 0.5 ? 'sorriso' : 'sorrisinho') : t > T_SAI ? 'sorrisinho' : 'fechada'),
    sobr: cinco ? 0.85 * sorri : 0.1, arregala: cinco ? 0.3 * sorri : 0,
    olhar: cinco ? [0, lerp(0.1, -0.9, olhaBaixo)] : contando && idx < 3 ? [0.3 * (idx === 2 ? 1 : -1), -0.2] : [0, -0.1],
    piscar: cinco ? 0 : piscada(t, 3.4, 1.1),
    cabecaX: -kv.inc * 0.85, cabecaY: contando && idx < 3 ? [0.55, 0.3, -0.55][idx] * ease(seg(t, T_CONTA[idx] - 0.35, T_CONTA[idx])) : 0,
    cabecaInc: cinco ? 0.16 * sorri : 0.05 * Math.sin(t * 6) * andando });
  vela.position.set(maoE.x, maoE.y - QUADRIL + 0.05, maoE.z); vela.rotation.x = -kv.inc;
  const tremula = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7.3);
  luzVela.intensity = vo.g.visible ? 1.7 * tremula : 0; chama.scale.set(0.75, 1.5 * tremula, 0.75);

  // ---------- o quinto ----------
  dedosQ.forEach((d, j) => { const u = easeOut(seg(t, T_DEDOS + 0.35 + j * 0.16, T_DEDOS + 0.75 + j * 0.16));
    d.position.y = lerp(0.34, CAMA_Y + 0.006, u) + (u >= 1 ? 0.006 * Math.max(0, Math.sin(t * 9 + j * 1.7)) : 0); });

  // ---------- pós ----------
  const abre = t < 2.2 ? Math.max(1 - acorda * 1.25, 0.75 * Math.pow(Math.sin(acorda * PI * 2.5), 8)) : 0;   // olhos abrindo
  const fim = ease(seg(t, T_FIM, T_FIM + 0.4));
  post.uniforms.dark.value = clamp(Math.max(abre, fim * 0.72, seg(t, DUR - 0.25, DUR)));
  enquete(ease(seg(t, T_FIM + 0.3, T_FIM + 0.8)));
  hud(t, SUBS, TAGS);
  drawFrame();
}
window.renderFrame = renderFrame; window.TOTAL = TOTAL; window.pronto = true;
