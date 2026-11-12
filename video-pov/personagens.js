// Personagens do estilo: cabeça grande e redonda, olhos enormes, membros de tubo.
// E o "corpo POV": mãos e pés do protagonista presos à câmera.

const BOCAS = {            // formas de boca [largura, altura]
  fechada: [1.0, 0.16], meia: [0.85, 0.55], aberta: [0.8, 1.0], o: [0.55, 0.85], susto: [0.7, 1.35],
  sorrisinho: [1.5, 0.2], sorriso: [2.0, 0.42],
};
const QUADRIL = 0.78;

// o: { pele, nariz, roupa, calca, cabelo, tenis, presilha, escala,
//      penteado:'coques'|'coque', oculos, saia:'#cor', xale:'#cor' }
function criaPersonagem(o) {
  const g = new THREE.Group(); scene.add(g);
  const pele = mat(o.pele), roupa = mat(o.roupa), calca = mat(o.calca || '#333'), cabelo = mat(o.cabelo);
  const preto = flat('#17121c'), branco = flat('#f6f1ea');
  const P = { g, o };
  const sup = P.sup = new THREE.Group(); sup.position.y = QUADRIL; g.add(sup);   // tudo acima do quadril

  P.tronco = ball(0.17, roupa, 0, 0.2, 0, sup, 1, 1.35, 0.72);
  if (o.xale) ball(0.2, mat(o.xale), 0, 0.33, -0.01, sup, 1.12, 0.62, 0.86);
  P.legs = [limb(0.052, calca, g), limb(0.052, calca, g)];
  P.pes = [0, 1].map(() => ball(0.07, mat(o.tenis || '#f2efe8'), 0, 0, 0, g, 0.8, 0.55, 1.35));
  if (o.saia) { P.saia = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.27, 0.74, 20), mat(o.saia)); P.saia.position.y = 0.42; g.add(P.saia); }
  P.bracos = [limb(0.042, roupa, sup), limb(0.042, roupa, sup)];
  P.maos = [ball(0.05, pele, 0, 0, 0, sup), ball(0.05, pele, 0, 0, 0, sup)];

  const h = P.cabeca = new THREE.Group(); sup.add(h);
  ball(0.215, pele, 0, 0, 0, h, 1, 0.95, 0.97);
  const calota = new THREE.Mesh(new THREE.SphereGeometry(0.232, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), cabelo);
  calota.rotation.x = -0.42; calota.position.y = 0.012; h.add(calota);
  if (o.penteado === 'coque') ball(0.1, cabelo, 0, 0.23, -0.1, h);
  else { ball(0.085, cabelo, -0.17, 0.2, -0.04, h); ball(0.085, cabelo, 0.17, 0.2, -0.04, h);
    box(0.06, 0.022, 0.03, mat(o.presilha || '#f2c230'), 0.13, 0.13, 0.17, h).rotation.z = -0.5; }
  P.olhos = [-1, 1].map(s => {
    const e = new THREE.Group(); e.position.set(s * 0.082, 0.028, 0.176); h.add(e);
    ball(0.071, preto, 0, 0, 0, e, 1, 1, 0.1);
    ball(0.061, branco, 0, 0, 0.004, e, 1, 1, 0.3);
    const pu = ball(0.031, preto, 0, 0, 0.024, e, 1, 1, 0.3);
    return { e, pu };
  });
  if (o.oculos) {
    const aro = flat('#17121c');
    [-1, 1].forEach(s => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.083, 0.009, 8, 28), aro); t.position.set(s * 0.086, 0.028, 0.215); h.add(t); });
    box(0.03, 0.012, 0.012, aro, 0, 0.04, 0.222, h);
  }
  ball(0.03, mat(o.nariz || o.pele), 0, -0.04, 0.212, h);
  P.boca = ball(0.042, flat('#4a1522'), 0, -0.112, 0.186, h, 1, 0.16, 0.3);
  P.dentes = box(0.12, 0.022, 0.012, flat('#f3ecd8'), 0, -0.1, 0.199, h); P.dentes.visible = false;
  P.sobr = [-1, 1].map(s => { const b = box(0.085, 0.017, 0.012, o.sobrCor ? flat(o.sobrCor) : preto, s * 0.082, 0.128, 0.19, h); b.userData.s = s; return b; });

  const st = tex(128, 128, (c, w) => { const gr = c.createRadialGradient(w / 2, w / 2, 4, w / 2, w / 2, w / 2);
    gr.addColorStop(0, 'rgba(0,0,0,.38)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, w); });
  P.sombra = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: st, transparent: true, depthWrite: false }));
  P.sombra.rotation.x = -Math.PI / 2; P.sombra.position.y = 0.012; g.add(P.sombra);
  g.scale.setScalar(o.escala || 1);
  return P;
}

// p: { correr 0..1, fase, respira, inclina (tronco pra frente), semPernas, boca, olhar:[x,y],
//      sobr: -1 preocupada .. +1 brava, piscar 0..1, arregala, maoD/maoE: Vector3 local (y a partir do chão),
//      cabecaX/Y/Inc }
function posaPersonagem(P, p) {
  const c = p.correr || 0, f = p.fase || 0, s = Math.sin(f), co = Math.cos(f);
  const sobe = Math.abs(co) * 0.045 * c + (p.respira || 0);
  P.sup.position.y = QUADRIL + sobe; P.sup.rotation.x = (p.inclina || 0) + 0.16 * c;
  P.cabeca.position.set(0, 0.62, 0.03 * c);
  P.cabeca.rotation.set(p.cabecaX || 0, p.cabecaY || 0, p.cabecaInc || 0);
  const pernas = !p.semPernas && !P.saia;
  P.sombra.visible = !p.semPernas;
  [-1, 1].forEach((sd, i) => {
    const k = sd * s * c;
    P.legs[i].visible = P.pes[i].visible = pernas;
    const pe = V(sd * 0.075, 0.045 + Math.max(0, sd * co) * 0.13 * c, 0.3 * k);
    P.pes[i].position.copy(pe);
    setLimb(P.legs[i], V(sd * 0.075, QUADRIL - 0.02 + sobe, 0), V(pe.x, pe.y + 0.04, pe.z - 0.02));
    const alvo = (sd < 0 ? p.maoE : p.maoD);
    const mao = alvo ? V(alvo.x, alvo.y - QUADRIL, alvo.z) : V(sd * (0.25 - 0.03 * c), -0.04 + 0.16 * c + 0.05 * Math.abs(k), -0.3 * k + 0.06 * c);
    P.maos[i].position.copy(mao);
    setLimb(P.bracos[i], V(sd * 0.15, 0.32, 0), mao);
  });
  const nome = p.boca || 'fechada', b = BOCAS[nome]; P.boca.scale.set(b[0], b[1], 0.3);
  P.dentes.visible = nome === 'sorriso';
  const ol = p.olhar || [0, 0], pk = p.piscar || 0, ab = (p.arregala || 0);
  P.olhos.forEach(({ e, pu }) => {
    e.scale.set(1 + 0.1 * ab, (1 + 0.1 * ab) * (1 - 0.9 * pk), 1);
    pu.position.x = ol[0] * 0.024; pu.position.y = ol[1] * 0.024; pu.scale.setScalar(1 - 0.28 * ab); pu.scale.z = 0.3;
  });
  const sb = p.sobr || 0;
  P.sobr.forEach(m => { m.rotation.z = m.userData.s * (-0.38 * sb); m.position.y = 0.128 + 0.02 * ab + (sb < 0 ? 0.012 : -0.006 * sb); });
}

// posição local da mão para apontar um ponto do mundo
function apontaPara(P, alvo, alcance = 0.5) {
  P.g.updateMatrixWorld(true);
  const l = P.g.worldToLocal(alvo.clone()); const om = V(0.15, QUADRIL + 0.32, 0);
  return om.clone().add(l.sub(om).normalize().multiplyScalar(alcance));
}

// boca "no dois": troca de forma a cada 2 quadros enquanto fala
function bocaFalando(t, seed = 1) {
  const q = Math.floor(t * 15), r = rng(q * 7919 + seed)();
  return r < 0.22 ? 'fechada' : r < 0.5 ? 'meia' : r < 0.8 ? 'aberta' : 'o';
}
const piscada = (t, cada = 2.7, off = 0) => { const u = ((t + off) % cada) / 0.13; return u < 1 ? Math.sin(u * Math.PI) : 0; };

// mão com dedos (usada no POV e em "coisas" que aparecem)
function criaMao(pele, s, parent) {
  const m = new THREE.Group(); parent.add(m);
  ball(0.052, pele, 0, 0.03, 0, m, 1, 1.05, 0.5);
  const dedos = [];
  for (let i = 0; i < 4; i++) {
    const d = new THREE.Group(); d.position.set((i - 1.5) * 0.026, 0.075, 0); m.add(d);
    const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.0125, 0.05, 4, 10), pele); c.position.y = 0.03; d.add(c);
    d.rotation.z = -(i - 1.5) * 0.13; dedos.push(d);
  }
  const pol = new THREE.Group(); pol.position.set(-s * 0.05, 0.03, 0.005); pol.rotation.z = s * 0.9; m.add(pol);
  const pc = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.04, 4, 10), pele); pc.position.y = 0.03; pol.add(pc);
  m.userData = { dedos, s };
  return m;
}

// ---------- corpo em primeira pessoa ----------
function criaPOV(o) {
  const rig = new THREE.Group(); scene.add(rig); rig.add(camera);
  const pele = mat(o.pele), manga = mat(o.manga), calca = mat(o.calca);
  const R = { rig, maos: [], bracos: [], pes: [], pernas: [] };
  [-1, 1].forEach(s => {
    R.bracos.push(limb(0.05, manga, rig));
    const m = criaMao(pele, s, rig); m.scale.setScalar(1.45); R.maos.push(m);
    R.pernas.push(limb(0.07, calca, rig));
    const pe = new THREE.Group(); rig.add(pe);
    ball(0.075, mat(o.tenis), 0, 0, 0, pe, 0.85, 0.6, 1.5);
    ball(0.06, mat(o.bico), 0, 0.005, -0.075, pe, 0.9, 0.62, 0.8);
    R.pes.push(pe);
  });
  return R;
}

// p: { correr 0..1, fase, pitch, roll, altura, deitado (esconde pernas e mãos soltas),
//      tremor, maos: [{pos,cotovelo,fecha,k}] (esq, dir) }
function posaPOV(R, p) {
  const c = p.correr || 0, f = p.fase || 0, tr = p.tremor || 0;
  camera.position.set(0.015 * Math.sin(f) * c + tr * Math.sin(f * 7.3) * 0.012, (p.altura || 1.55) + 0.05 * Math.sin(2 * f + 0.6) * c, 0);
  camera.rotation.set((p.pitch || 0) + tr * 0.012 * Math.sin(f * 9.1), 0.012 * Math.sin(f) * c, (p.roll || 0) + 0.022 * Math.sin(f) * c);
  [-1, 1].forEach((s, i) => {
    const ps = Math.sin(f + (s > 0 ? 0 : Math.PI));
    let mao = V(s * lerp(0.3, 0.25, c), lerp(0.74, 0.93 + 0.14 * ps, c), lerp(-0.2, -0.38 - 0.16 * ps, c));
    let cot = V(s * 0.31, lerp(1.05, 0.9 - 0.05 * ps, c), lerp(0.02, 0.05, c));
    let fecha = lerp(0.25, 0.75, c);
    const ov = p.maos && p.maos[i];
    if (ov) { mao.lerp(ov.pos, ov.k); if (ov.cotovelo) cot.lerp(ov.cotovelo, ov.k); fecha = lerp(fecha, ov.fecha ?? 0.1, ov.k); }
    const visivel = !p.deitado || (ov && ov.k > 0.02);
    R.bracos[i].visible = R.maos[i].visible = !!visivel;
    setLimb(R.bracos[i], cot, mao);
    const m = R.maos[i]; m.position.copy(mao);
    const dir = V(0, 0, 0).subVectors(mao, cot).normalize();
    m.quaternion.setFromUnitVectors(UP, dir);
    m.rotateY(s * 0.5);
    m.userData.dedos.forEach(d => { d.rotation.x = -fecha * 1.5; });
    const pf = Math.sin(f + (s > 0 ? Math.PI : 0));
    const pe = V(s * 0.115, 0.05 + Math.max(0, Math.cos(f + (s > 0 ? Math.PI : 0))) * 0.14 * c, lerp(-0.12, -0.28 - 0.4 * pf, c));
    R.pes[i].visible = R.pernas[i].visible = !p.deitado;
    R.pes[i].position.copy(pe); R.pes[i].rotation.x = 0.35 * pf * c;
    setLimb(R.pernas[i], V(s * 0.11, 0.86, 0.05), V(pe.x, pe.y + 0.07, pe.z + 0.07));
  });
}
