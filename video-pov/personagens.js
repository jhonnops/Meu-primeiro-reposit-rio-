// Personagens do estilo: cabeça grande e redonda, olhos enormes, membros de tubo.
// E o "corpo POV": mãos e pés do protagonista presos à câmera.

const BOCAS = {            // formas de boca [largura, altura]
  fechada: [1.0, 0.16], meia: [0.85, 0.55], aberta: [0.8, 1.0], o: [0.55, 0.85], susto: [0.7, 1.35],
};

function criaPersonagem(o) {
  const g = new THREE.Group(); scene.add(g);
  const pele = mat(o.pele), roupa = mat(o.roupa), calca = mat(o.calca), cabelo = mat(o.cabelo);
  const preto = flat('#17121c'), branco = flat('#f6f1ea');
  const P = { g, o, t0: 0 };

  // corpo
  P.tronco = ball(0.17, roupa, 0, 0.98, 0, g, 1, 1.35, 0.72);
  P.legs = [limb(0.052, calca, g), limb(0.052, calca, g)];
  P.pes = [ball(0.07, mat(o.tenis || '#f2efe8'), 0, 0, 0, g, 0.8, 0.55, 1.35), ball(0.07, mat(o.tenis || '#f2efe8'), 0, 0, 0, g, 0.8, 0.55, 1.35)];
  P.bracos = [limb(0.042, roupa, g), limb(0.042, roupa, g)];
  P.maos = [ball(0.05, pele, 0, 0, 0, g), ball(0.05, pele, 0, 0, 0, g)];

  // cabeça
  const h = P.cabeca = new THREE.Group(); h.position.set(0, 1.4, 0); g.add(h);
  ball(0.215, pele, 0, 0, 0, h, 1, 0.95, 0.97);
  // cabelo: calota + coques
  const calota = new THREE.Mesh(new THREE.SphereGeometry(0.232, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), cabelo);
  calota.rotation.x = -0.42; calota.position.y = 0.012; h.add(calota);
  ball(0.085, cabelo, -0.17, 0.2, -0.04, h); ball(0.085, cabelo, 0.17, 0.2, -0.04, h);
  box(0.06, 0.022, 0.03, mat(o.presilha || '#f2c230'), 0.13, 0.13, 0.17, h).rotation.z = -0.5;
  // rosto
  P.olhos = [-1, 1].map(s => {
    const e = new THREE.Group(); e.position.set(s * 0.082, 0.028, 0.176); h.add(e);
    ball(0.071, preto, 0, 0, 0, e, 1, 1, 0.1);
    const br = ball(0.061, branco, 0, 0, 0.004, e, 1, 1, 0.3);
    const pu = ball(0.031, preto, 0, 0, 0.024, e, 1, 1, 0.3);
    return { e, br, pu };
  });
  ball(0.03, mat(o.nariz || o.pele), 0, -0.04, 0.212, h);
  P.boca = ball(0.042, flat('#4a1522'), 0, -0.112, 0.186, h, 1, 0.16, 0.3);
  P.sobr = [-1, 1].map(s => { const b = box(0.085, 0.017, 0.012, preto, s * 0.082, 0.128, 0.19, h); b.userData.s = s; return b; });

  // sombra no chão (degradê macio, sem contorno)
  const st = tex(128, 128, (c, w) => { const gr = c.createRadialGradient(w / 2, w / 2, 4, w / 2, w / 2, w / 2);
    gr.addColorStop(0, 'rgba(0,0,0,.38)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, w); });
  P.sombra = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: st, transparent: true, depthWrite: false }));
  P.sombra.rotation.x = -Math.PI / 2; P.sombra.position.y = 0.012; g.add(P.sombra);
  g.scale.setScalar(o.escala || 1);
  return P;
}

// p: { correr 0..1, fase, boca:'nome', olhar:[x,y], sobr: -1 preocupada .. +1 brava, piscar 0..1,
//      maoD/maoE: Vector3 opcional (posição local da mão), cabecaInc: inclinação }
function posaPersonagem(P, p) {
  const c = p.correr || 0, f = p.fase || 0, s = Math.sin(f), co = Math.cos(f);
  const sobe = Math.abs(co) * 0.045 * c + (p.respira || 0);
  P.tronco.position.y = 0.98 + sobe; P.tronco.rotation.x = 0.16 * c;
  P.cabeca.position.set(0, 1.4 + sobe, 0.03 * c);
  P.cabeca.rotation.set(p.cabecaX || 0, p.cabecaY || 0, p.cabecaInc || 0);
  [-1, 1].forEach((sd, i) => {
    const k = sd * s * c;
    const pe = V(sd * 0.075, 0.045 + Math.max(0, sd * co) * 0.13 * c, 0.3 * k);
    P.pes[i].position.copy(pe);
    setLimb(P.legs[i], V(sd * 0.075, 0.76 + sobe, 0), V(pe.x, pe.y + 0.04, pe.z - 0.02));
    const alvo = (sd < 0 ? p.maoE : p.maoD);
    const mao = alvo ? alvo.clone() : V(sd * (0.25 - 0.03 * c), 0.74 + sobe + 0.16 * c + 0.05 * Math.abs(k), -0.3 * k + 0.06 * c);
    P.maos[i].position.copy(mao);
    setLimb(P.bracos[i], V(sd * 0.15, 1.1 + sobe, 0), mao);
  });
  const b = BOCAS[p.boca || 'fechada']; P.boca.scale.set(b[0], b[1], 0.3);
  const ol = p.olhar || [0, 0], pk = p.piscar || 0, ab = (p.arregala || 0);
  P.olhos.forEach(({ e, pu }) => {
    e.scale.set(1 + 0.1 * ab, (1 + 0.1 * ab) * (1 - 0.9 * pk), 1);
    pu.position.x = ol[0] * 0.024; pu.position.y = ol[1] * 0.024; pu.scale.setScalar(1 - 0.28 * ab); pu.scale.z = 0.3;
  });
  const sb = p.sobr || 0;
  P.sobr.forEach(m => { m.rotation.z = m.userData.s * (-0.38 * sb); m.position.y = 0.128 + 0.02 * ab + (sb < 0 ? 0.012 : -0.006 * sb); });
}

// boca "no dois": troca de forma a cada 2 quadros enquanto fala
function bocaFalando(t, seed = 1) {
  const q = Math.floor(t * 15), r = rng(q * 7919 + seed)();
  return r < 0.22 ? 'fechada' : r < 0.5 ? 'meia' : r < 0.8 ? 'aberta' : 'o';
}
const piscada = (t, cada = 2.7, off = 0) => { const u = ((t + off) % cada) / 0.13; return u < 1 ? Math.sin(u * Math.PI) : 0; };

// ---------- corpo em primeira pessoa ----------
function criaPOV(o) {
  const rig = new THREE.Group(); scene.add(rig); rig.add(camera);
  const pele = mat(o.pele), manga = mat(o.manga), calca = mat(o.calca);
  const R = { rig, maos: [], bracos: [], pes: [], pernas: [] };
  [-1, 1].forEach(s => {
    R.bracos.push(limb(0.05, manga, rig));
    const m = new THREE.Group(); m.scale.setScalar(1.45); rig.add(m);
    ball(0.052, pele, 0, 0.03, 0, m, 1, 1.05, 0.5);                       // palma
    const dedos = [];
    for (let i = 0; i < 4; i++) {
      const d = new THREE.Group(); d.position.set((i - 1.5) * 0.026, 0.075, 0); m.add(d);
      const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.0125, 0.05, 4, 10), pele); c.position.y = 0.03; d.add(c);
      d.rotation.z = -(i - 1.5) * 0.13; dedos.push(d);
    }
    const pol = new THREE.Group(); pol.position.set(-s * 0.05, 0.03, 0.005); pol.rotation.z = s * 0.9; m.add(pol);
    const pc = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.04, 4, 10), pele); pc.position.y = 0.03; pol.add(pc);
    m.userData = { dedos, s }; R.maos.push(m);
    R.pernas.push(limb(0.07, calca, rig));
    const pe = new THREE.Group(); rig.add(pe);
    ball(0.075, mat(o.tenis), 0, 0, 0, pe, 0.85, 0.6, 1.5);
    ball(0.06, mat(o.bico), 0, 0.005, -0.075, pe, 0.9, 0.62, 0.8);
    R.pes.push(pe);
  });
  return R;
}

// p: { correr 0..1, fase, pitch, yaw, roll, altura, maos: [{pos,cotovelo,fecha}] opcional }
function posaPOV(R, p) {
  const c = p.correr || 0, f = p.fase || 0;
  camera.position.set(0.015 * Math.sin(f) * c, (p.altura || 1.55) + 0.05 * Math.sin(2 * f + 0.6) * c, 0);
  camera.rotation.set(p.pitch || 0, 0.012 * Math.sin(f) * c, (p.roll || 0) + 0.022 * Math.sin(f) * c);
  [-1, 1].forEach((s, i) => {
    const ps = Math.sin(f + (s > 0 ? 0 : Math.PI));
    // correndo: mãos sobem e descem alternadas; parado: caídas ao lado do corpo
    let mao = V(s * lerp(0.3, 0.25, c), lerp(0.74, 0.93 + 0.14 * ps, c), lerp(-0.2, -0.38 - 0.16 * ps, c));
    let cot = V(s * 0.31, lerp(1.05, 0.9 - 0.05 * ps, c), lerp(0.02, 0.05, c));
    let fecha = lerp(0.25, 0.75, c);
    const ov = p.maos && p.maos[i];
    if (ov) { mao.lerp(ov.pos, ov.k); if (ov.cotovelo) cot.lerp(ov.cotovelo, ov.k); fecha = lerp(fecha, ov.fecha ?? 0.1, ov.k); }
    setLimb(R.bracos[i], cot, mao);
    const m = R.maos[i]; m.position.copy(mao);
    const dir = V(0, 0, 0).subVectors(mao, cot).normalize();
    m.quaternion.setFromUnitVectors(UP, dir);
    m.rotateY(s * 0.5);                                   // dorso da mão virado para a câmera
    m.userData.dedos.forEach(d => { d.rotation.x = -fecha * 1.5; });
    const pf = Math.sin(f + (s > 0 ? Math.PI : 0));       // pé oposto ao braço
    const pe = V(s * 0.115, 0.05 + Math.max(0, Math.cos(f + (s > 0 ? Math.PI : 0))) * 0.14 * c, lerp(-0.12, -0.28 - 0.4 * pf, c));
    R.pes[i].position.copy(pe); R.pes[i].rotation.x = 0.35 * pf * c;
    setLimb(R.pernas[i], V(s * 0.11, 0.86, 0.05), V(pe.x, pe.y + 0.07, pe.z + 0.07));
  });
}
