// 3D-Animation "Zungen-Parasit" (three.js r128, läuft im Browser, Bild für Bild steuerbar)
import * as THREE from "/three/build/three.module.js";

const W = 1080, H = 1920;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
const sm = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .82;
renderer.physicallyCorrectLights = false;

// ---------- Texturen ----------
function canvasTex(w, h, draw) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t; }
const fishTex = canvasTex(1024, 512, (g, w, h) => {
  // u = Länge (0 Schwanz .. 1 Kopf), v = rundherum (0 oben .. 0.5 Bauch .. 1 oben)
  for (let y = 0; y < h; y++) { const v = y / h, belly = Math.pow(Math.sin(v * Math.PI), 3);
    const r = lerp(200, 248, belly), gg = lerp(48, 214, belly), b = lerp(62, 196, belly); g.fillStyle = `rgb(${r | 0},${gg | 0},${b | 0})`; g.fillRect(0, y, w, 1); }
  g.globalAlpha = .22; g.strokeStyle = "#5a0d18"; g.lineWidth = 2;
  for (let x = 0; x < w * .86; x += 22) for (let y = 0; y < h; y += 20) { g.beginPath(); g.arc(x + (y / 20 % 2) * 11, y, 13, Math.PI * .15, Math.PI * .85); g.stroke(); }
  g.globalAlpha = .35; g.fillStyle = "#ffd0c0"; g.fillRect(0, h * .42, w, h * .16);
  g.globalAlpha = 1; const lg = g.createLinearGradient(w * .84, 0, w, 0); lg.addColorStop(0, "rgba(255,170,150,0)"); lg.addColorStop(1, "rgba(255,170,150,.5)"); g.fillStyle = lg; g.fillRect(0, 0, w, h);
});
const fleshTex = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = "#b9404f"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 1400; i++) { g.globalAlpha = .08 + Math.random() * .12; g.fillStyle = Math.random() > .5 ? "#7a1626" : "#f08a98"; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 9, 0, 7); g.fill(); }
  g.globalAlpha = .25; g.strokeStyle = "#6b0f1d"; g.lineWidth = 2;
  for (let i = 0; i < 40; i++) { g.beginPath(); let x = Math.random() * w, y = Math.random() * h; g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (Math.random() - .5) * 60; y += (Math.random() - .5) * 60; g.lineTo(x, y); } g.stroke(); }
});
fleshTex.wrapS = fleshTex.wrapT = THREE.RepeatWrapping; fleshTex.repeat.set(3, 2);
const sandTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = "#c9b48a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { g.globalAlpha = .15; g.fillStyle = Math.random() > .5 ? "#8f7a52" : "#efe0bd"; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } });
sandTex.wrapS = sandTex.wrapT = THREE.RepeatWrapping; sandTex.repeat.set(30, 30);
const glowTex = canvasTex(128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });

// Umgebung für Glanzlichter
function envMap(top, bottom) {
  const s = new THREE.Scene(); const geo = new THREE.SphereGeometry(10, 32, 16);
  const cols = []; const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const t = (p.getY(i) / 10 + 1) / 2; const c = new THREE.Color(bottom).lerp(new THREE.Color(top), t); cols.push(c.r, c.g, c.b); }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  s.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const l = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); l.position.set(0, 8, 2); s.add(l);
  const pm = new THREE.PMREMGenerator(renderer); return pm.fromScene(s, .04).texture;
}

// ---------- Fisch ----------
const prof = (u) => { // Höhe des Fischkörpers entlang der Länge (0 Schwanz .. 1 Maul)
  if (u < .12) return lerp(.12, .2, u / .12);
  const k = (u - .12) / .88; return .2 + .72 * Math.pow(Math.sin(Math.PI * Math.min(1, k * .62 + .0)), 1.1) * (k < .8 ? 1 : 1 - (k - .8) / .2 * .62) ; };
function makeFish() {
  const grp = new THREE.Group();
  const L = 1.7;
  const geo = new THREE.SphereGeometry(1, 96, 64); geo.rotateZ(Math.PI / 2); // Pole an der Längsachse
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const u = (x + 1) / 2; // 0 Schwanz, 1 Kopf
    const hgt = prof(u), wid = hgt * .44 * (1 - .22 * y * y);
    y *= hgt; z *= wid;
    if (y > 0) y *= 1.1; // Rücken etwas höher
    p.setXYZ(i, x * L, y, z);
    uv.setXY(i, u, uv.getY(i));
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({ map: fishTex, roughness: .32, metalness: .05, clearcoat: .8, clearcoatRoughness: .25 });
  const body = new THREE.Mesh(geo, mat); grp.add(body);
  body.userData.base = Float32Array.from(p.array);
  // Maul (offen, dunkel) + Lippen
  const mouth = new THREE.Group(); mouth.position.set(L * .99, -.06, 0); grp.add(mouth);
  const hole = new THREE.Mesh(new THREE.SphereGeometry(.2, 32, 16), new THREE.MeshStandardMaterial({ color: 0x1a0306, roughness: 1 }));
  hole.scale.set(.35, .75, .7); mouth.add(hole);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(.15, .032, 16, 48), new THREE.MeshPhysicalMaterial({ color: 0xc8505a, roughness: .35, clearcoat: .6 }));
  lip.rotation.y = Math.PI / 2; lip.scale.set(1, 1, .75); mouth.add(lip);
  // Augen
  for (const s of [1, -1]) {
    const eye = new THREE.Group(); { const u = .87, h = prof(u); eye.position.set(L * (2 * u - 1), .12, s * h * .44 * .93); } grp.add(eye);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.085, 32, 16), new THREE.MeshPhysicalMaterial({ color: 0xe8b84a, roughness: .2, clearcoat: 1 })); ball.scale.z = .5; eye.add(ball);
    const pup = new THREE.Mesh(new THREE.SphereGeometry(.052, 32, 16), new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: .05, clearcoat: 1 })); pup.position.z = s * .03; pup.scale.z = .5; eye.add(pup);
  }
  // Kiemendeckel (Bogen hinter dem Auge)
  for (const s of [1, -1]) {
    const pts = []; for (let k = 0; k <= 20; k++) { const a = -1.1 + k / 20 * 2.1; const x = L * .5 + Math.cos(a) * .22, y = Math.sin(a) * .5 - .03, u = (x / L + 1) / 2, h = prof(u), yy = y / h; pts.push(V(x, y, s * h * .44 * Math.sqrt(Math.max(.05, 1 - yy * yy)) * 1.02)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const gill = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, .018, 8), new THREE.MeshStandardMaterial({ color: 0x6d0f1c, roughness: .6 }));
    gill.userData.side = s; grp.add(gill); grp.userData["gill" + s] = gill;
  }
  // Flossen
  const finMat = new THREE.MeshPhysicalMaterial({ color: 0xe2585f, roughness: .4, transparent: true, opacity: .82, side: THREE.DoubleSide, clearcoat: .4 });
  const tailS = new THREE.Shape(); tailS.moveTo(0, 0); tailS.quadraticCurveTo(-.35, .45, -.75, .72); tailS.quadraticCurveTo(-.5, .2, -.5, 0); tailS.quadraticCurveTo(-.5, -.2, -.75, -.72); tailS.quadraticCurveTo(-.35, -.45, 0, 0);
  const tail = new THREE.Mesh(new THREE.ShapeGeometry(tailS, 24), finMat); tail.position.set(-L * .97, .02, 0); grp.add(tail); grp.userData.tail = tail;
  const dorS = new THREE.Shape(); dorS.moveTo(-1.1, 0); for (let k = 0; k <= 10; k++) { const x = -1.1 + k * .17; dorS.lineTo(x, .32 + (k % 2 ? .06 : -.02) - Math.pow((k - 5) / 6, 2) * .2); } dorS.lineTo(.6, 0);
  const dor = new THREE.Mesh(new THREE.ShapeGeometry(dorS), finMat); dor.position.set(0, .93, 0); grp.add(dor);
  const anS = new THREE.Shape(); anS.moveTo(-.7, 0); anS.lineTo(-.95, -.34); anS.lineTo(-.4, -.28); anS.lineTo(-.2, 0);
  const an = new THREE.Mesh(new THREE.ShapeGeometry(anS), finMat); an.position.set(0, -.72, 0); grp.add(an);
  for (const s of [1, -1]) { const pS = new THREE.Shape(); pS.moveTo(0, 0); pS.quadraticCurveTo(-.3, .12, -.55, -.05); pS.quadraticCurveTo(-.3, -.2, 0, -.06);
    const pec = new THREE.Mesh(new THREE.ShapeGeometry(pS), finMat); pec.position.set(L * .42, -.2, s * .32); pec.rotation.y = s * .4; grp.add(pec); grp.userData["pec" + s] = pec; }
  grp.userData.body = body; grp.userData.L = L;
  return grp;
}
function swimFish(f, t, amp = 1) {
  const body = f.userData.body, base = body.userData.base, p = body.geometry.attributes.position, L = f.userData.L;
  for (let i = 0; i < p.count; i++) { const x = base[3 * i]; const k = Math.pow((L - x) / (2 * L), 2); p.setZ(i, base[3 * i + 2] + Math.sin(x * 2.2 - t * 7) * .16 * k * amp); }
  p.needsUpdate = true; body.geometry.computeVertexNormals();
  f.userData.tail.rotation.y = Math.sin(-L * 2.2 - t * 7) * .55 * amp;
  f.userData.pec1.rotation.y = .4 + Math.sin(t * 5) * .3; f.userData["pec-1"].rotation.y = -.4 - Math.sin(t * 5) * .3;
}

// ---------- Assel (Cymothoa) ----------
function makeIsopod() {
  const grp = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xcdb999, roughness: .42, clearcoat: .6, clearcoatRoughness: .35 }); const mat2 = new THREE.MeshPhysicalMaterial({ color: 0xa8916b, roughness: .5, clearcoat: .4 });
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x8c7048, roughness: .45, clearcoat: .5 });
  const segs = [];
  // Kopf vorne (+x)
  const head = new THREE.Mesh(new THREE.SphereGeometry(.5, 48, 24), mat); head.scale.set(.32, .2, .46); head.position.set(.95, .02, 0); grp.add(head);
  for (const s of [1, -1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 8), new THREE.MeshPhysicalMaterial({ color: 0x080808, roughness: .05, clearcoat: 1 })); e.position.set(1.05, .1, s * .12); grp.add(e); grp.userData["eye" + s] = e; }
  for (const s of [1, -1]) { const a = new THREE.Mesh(new THREE.CylinderGeometry(.012, .02, .32, 8), dark); a.position.set(1.22, .04, s * .08); a.rotation.z = -1.25; a.rotation.x = s * .35; grp.add(a); }
  // 7 Brustsegmente
  const widths = [.62, .7, .76, .8, .8, .76, .68];
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 48, 24), i % 2 ? mat : mat2);
    m.scale.set(.25, .2, widths[i]); m.position.set(.72 - i * .2, .03 + Math.sin(i / 6 * Math.PI) * .03, 0); grp.add(m); segs.push(m);
  }
  // Hinterleib + Schwanzfächer
  for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 16), mat); m.scale.set(.12, .17, .52 - i * .07); m.position.set(-.66 - i * .1, .02, 0); grp.add(m); }
  const telS = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 16), mat); telS.scale.set(.34, .1, .42); telS.position.set(-1.12, 0, 0); grp.add(telS);
  // 7 Beinpaare mit Haken
  const legs = [];
  for (let i = 0; i < 7; i++) for (const s of [1, -1]) {
    const hip = new THREE.Group(); hip.position.set(.72 - i * .2, -.06, s * widths[i] * .42); grp.add(hip);
    const fem = new THREE.Mesh(new THREE.CylinderGeometry(.018, .026, .3, 8), dark); fem.position.set(0, -.12, s * .1); fem.rotation.x = s * .9; hip.add(fem);
    const knee = new THREE.Group(); knee.position.set(0, -.2, s * .22); hip.add(knee);
    const tib = new THREE.Mesh(new THREE.CylinderGeometry(.013, .02, .26, 8), dark); tib.position.set(0, -.12, s * .02); knee.add(tib);
    const hook = new THREE.Mesh(new THREE.ConeGeometry(.02, .12, 8), new THREE.MeshPhysicalMaterial({ color: 0x8a6b3e, roughness: .3, clearcoat: .8 })); hook.position.set(.04, -.27, 0); hook.rotation.z = 2.4; knee.add(hook);
    hip.userData = { i, s }; legs.push(hip);
  }
  grp.userData.legs = legs; grp.userData.segs = segs; grp.userData.mat = mat;
  return grp;
}
function walkIsopod(iso, t, speed = 1, grip = 0) {
  for (const h of iso.userData.legs) { const { i, s } = h.userData; const ph = t * 9 * speed + i * .8 + (s > 0 ? 0 : Math.PI);
    h.rotation.y = Math.sin(ph) * .35 * (1 - grip); h.rotation.x = s * (Math.max(0, Math.cos(ph)) * .3 * (1 - grip) - grip * .35); }
  iso.userData.segs.forEach((m, k) => { m.position.y = .03 + Math.sin(k / 6 * Math.PI) * .03 + Math.sin(t * 6 - k) * .008; });
}

// ---------- Szenen ----------
const sea = new THREE.Scene();
const seaCol = new THREE.Color(0x0a4a6e).convertSRGBToLinear(); sea.background = seaCol; sea.fog = new THREE.FogExp2(seaCol, .07);
sea.environment = envMap(0x7fd0ff, 0x02121f);
sea.add(new THREE.HemisphereLight(0x9adfff, 0x0a2a3a, .45));
const sun = new THREE.DirectionalLight(0xfff4dd, 1.25); sun.position.set(3, 10, 4); sea.add(sun);
const rim = new THREE.DirectionalLight(0x6fd3ff, .9); rim.position.set(-6, 2, -5); sea.add(rim);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 120, 120), new THREE.MeshStandardMaterial({ map: sandTex, roughness: .95 }));
{ const p = floor.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * .4) * .3 + Math.cos(p.getY(i) * .3) * .3 + Math.sin(p.getX(i) * 1.3 + p.getY(i)) * .08); floor.geometry.computeVertexNormals(); }
floor.rotation.x = -Math.PI / 2; floor.position.y = -3.2; sea.add(floor);
// Felsen/Korallen
const rockMat = new THREE.MeshStandardMaterial({ color: 0x51606a, roughness: .9 });
for (let i = 0; i < 26; i++) { const r = new THREE.Mesh(new THREE.IcosahedronGeometry(.6 + Math.random() * 1.4, 1), rockMat); r.position.set((Math.random() - .5) * 40, -3.1, -4 - Math.random() * 25); r.scale.y = .6; r.rotation.set(Math.random(), Math.random(), 0); sea.add(r); }
const coralCols = [0xff7a6b, 0xffb347, 0xc56cf0, 0xff5e8a];
for (let i = 0; i < 40; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.04, .09, 1 + Math.random(), 6), new THREE.MeshStandardMaterial({ color: coralCols[i % 4], roughness: .7 })); c.position.set((Math.random() - .5) * 30, -2.6, -3 - Math.random() * 20); c.rotation.z = (Math.random() - .5) * .8; sea.add(c); }
// Lichtstrahlen
const rays = [];
for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 30), new THREE.MeshBasicMaterial({ map: canvasTex(64, 256, (g) => { const l = g.createLinearGradient(0, 0, 0, 256); l.addColorStop(0, "rgba(200,240,255,.35)"); l.addColorStop(1, "rgba(200,240,255,0)"); g.fillStyle = l; g.fillRect(0, 0, 64, 256); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  m.position.set(-12 + i * 3, 6, -8 - (i % 3) * 3); m.rotation.z = .35; sea.add(m); rays.push(m); }
// Schwebeteilchen
const snowGeo = new THREE.BufferGeometry(), snowN = 900, sp = new Float32Array(snowN * 3); for (let i = 0; i < snowN; i++) { sp[3 * i] = (Math.random() - .5) * 30; sp[3 * i + 1] = (Math.random() - .5) * 12; sp[3 * i + 2] = (Math.random() - .5) * 24; }
snowGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ size: .05, map: glowTex, transparent: true, depthWrite: false, color: 0xcfefff, opacity: .7 })); sea.add(snow);

const fish = makeFish(); sea.add(fish);
const fish2 = makeFish(); fish2.scale.setScalar(.8); fish2.position.set(-6, 1.5, -9); sea.add(fish2);
const larva = makeIsopod(); larva.scale.setScalar(.09); sea.add(larva);
const isoOut = makeIsopod(); isoOut.scale.setScalar(.13); fish.add(isoOut); // schaut aus dem Maul

// Maul von innen
const mouthS = new THREE.Scene(); const mCol = new THREE.Color(0x14030a).convertSRGBToLinear(); mouthS.background = mCol; mouthS.fog = new THREE.Fog(mCol, 3.5, 9);
mouthS.environment = envMap(0xffd6d6, 0x200308);
mouthS.add(new THREE.HemisphereLight(0xffc2c8, 0x2a0610, .25));
const lamp = new THREE.PointLight(0xfff1e6, 1.6, 14, 1.6); lamp.position.set(0, 1.2, 3.2); mouthS.add(lamp);
const lamp2 = new THREE.PointLight(0x9fd9ff, .9, 12, 2); lamp2.position.set(0, .4, 5.5); mouthS.add(lamp2);
const cavGeo = new THREE.SphereGeometry(3, 96, 64); { const p = cavGeo.attributes.position; for (let i = 0; i < p.count; i++) { const v = V(p.getX(i), p.getY(i), p.getZ(i)); const n = Math.sin(v.x * 2.1) * Math.cos(v.z * 1.7) * .12 + Math.sin(v.y * 3 + v.x) * .06; v.multiplyScalar(1 + n); p.setXYZ(i, v.x * 1.25, v.y * .62, v.z * 1.8); } cavGeo.computeVertexNormals(); }
const cav = new THREE.Mesh(cavGeo, new THREE.MeshPhysicalMaterial({ map: fleshTex, roughness: .28, clearcoat: 1, clearcoatRoughness: .15, side: THREE.BackSide })); mouthS.add(cav);
// Zähne am Eingang
const toothMat = new THREE.MeshPhysicalMaterial({ color: 0xf6f0de, roughness: .2, clearcoat: 1 });
for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; const tooth = new THREE.Mesh(new THREE.ConeGeometry(.07, .3, 10), toothMat); const x = Math.cos(a) * 2.2, y = Math.sin(a) * 1.15; tooth.position.set(x, y, 4.3); tooth.lookAt(0, 0, 4.3); tooth.rotateX(Math.PI / 2); mouthS.add(tooth); }
// Kiemenbögen hinten
for (let i = 0; i < 4; i++) { const arch = new THREE.Mesh(new THREE.TorusGeometry(1.3 - i * .1, .09, 12, 48, Math.PI), new THREE.MeshPhysicalMaterial({ color: 0xc2283c, roughness: .3, clearcoat: .8 })); arch.position.set(0, -.6, -3 - i * .45); mouthS.add(arch); }
// Zunge
const tongueGeo = new THREE.SphereGeometry(1, 64, 32); { const p = tongueGeo.attributes.position; for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const u = (z + 1) / 2; p.setXYZ(i, x * (.55 + .25 * Math.sin(u * Math.PI)), y * .22 * (y > 0 ? 1 : .5), z * 1.25); } tongueGeo.computeVertexNormals(); }
const tongueMat = new THREE.MeshPhysicalMaterial({ color: 0xe07484, roughness: .3, clearcoat: .9, clearcoatRoughness: .2 });
const tongue = new THREE.Mesh(tongueGeo, tongueMat); tongue.position.set(0, -1.32, 1.2); mouthS.add(tongue);
const stump = new THREE.Mesh(new THREE.SphereGeometry(.4, 32, 16), new THREE.MeshPhysicalMaterial({ color: 0x9b3a48, roughness: .5 })); stump.scale.set(1, .35, 1); stump.position.set(0, -1.5, -.1); mouthS.add(stump);
const iso = makeIsopod(); iso.scale.setScalar(.95); mouthS.add(iso);
// Blutströpfchen
const drops = []; for (let i = 0; i < 26; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), new THREE.MeshPhysicalMaterial({ color: 0xb3001b, roughness: .1, clearcoat: 1, emissive: 0x330000 })); d.visible = false; mouthS.add(d); drops.push(d); }
// Futterstück
const food = new THREE.Mesh(new THREE.IcosahedronGeometry(.22, 2), new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: .6 })); food.visible = false; mouthS.add(food);

const cam = new THREE.PerspectiveCamera(38, W / H, .01, 200);

// ---------- Shots ----------
function resetSea(t) {
  swimFish(fish, t); swimFish(fish2, t + 1, .8); fish2.position.x = -6 + t * .4;
  rays.forEach((r, i) => { r.material.opacity = .5 + .5 * Math.sin(t * .7 + i); });
  snow.rotation.y = t * .01; snow.position.y = Math.sin(t * .2) * .2;
  larva.visible = false; isoOut.visible = false;
  fish.rotation.set(0, 0, 0); fish.position.set(0, 0, 0);
}
function look(from, to, fov) { cam.position.copy(from); cam.lookAt(to); if (fov) { cam.fov = fov; cam.updateProjectionMatrix(); } }
function peek(t) { // Assel schaut aus dem Maul
  isoOut.visible = true; isoOut.position.set(fish.userData.L * .9, -.04, 0); isoOut.rotation.set(0, 0, -.05); walkIsopod(isoOut, t, .3);
  const blink = (Math.sin(t * 3) > .97) ? .2 : 1; isoOut.userData.eye1.scale.y = blink; isoOut.userData["eye-1"].scale.y = blink;
}
function mouthReset(t) {
  tongue.visible = true; tongue.scale.set(1, 1, 1); tongue.position.set(0, -1.32, 1.2); tongue.rotation.set(0, 0, 0); tongueMat.color.set(0xe07484); tongueMat.roughness = .3;
  stump.visible = false; drops.forEach((d) => d.visible = false); food.visible = false;
  iso.position.set(0, -1.05, -.2); iso.rotation.set(0, Math.PI / 2, 0); walkIsopod(iso, t, 0, 1);
  lamp.intensity = 1.6 + Math.sin(t * 2) * .12;
}
const SHOTS = {
  hook(lt, d, t) { resetSea(t); fish.rotation.y = -1.25; peek(t); const k = sm(lt / d); look(V(lerp(2.6, 2.2, k), .05, lerp(2.1, 1.25, k)).applyAxisAngle(V(0, 1, 0), 0), V(.55, -.02, 1.5), 34); scene = sea; },
  notTongue(lt, d, t) { resetSea(t); fish.rotation.y = -1.25; peek(t); const k = sm(lt / d); const tgt = V(fish.userData.L * .9, -.04, 0).applyAxisAngle(V(0, 1, 0), -1.25); look(V(tgt.x + lerp(.45, .32, k), tgt.y + .03, tgt.z + lerp(1.0, .72, k)), tgt, 30); scene = sea; },
  parasite(lt, d, t) { mouthReset(t); const k = sm(lt / d); const a = lerp(-.5, .5, k); look(V(Math.sin(a) * 2.2, .5, 2.6 + Math.cos(a) * .5), V(0, -1.1, -.2), 42); iso.userData.eye1.scale.y = iso.userData["eye-1"].scale.y = Math.sin(t * 3) > .96 ? .2 : 1; scene = mouthS; },
  larva(lt, d, t) { resetSea(t); const k = sm(lt / d); fish.rotation.y = .25; larva.visible = true;
    const gill = V(fish.userData.L * .5 + .3, -.05, .5).applyAxisAngle(V(0, 1, 0), .25);
    const start = V(2.6, .8, 2.6); larva.position.lerpVectors(start, gill, sm(lt / (d * .85))); larva.lookAt(gill); larva.rotateY(-Math.PI / 2); walkIsopod(larva, t, 2);
    if (lt > d * .85) larva.scale.setScalar(.09 * (1 - sm((lt - d * .85) / (d * .15)))); else larva.scale.setScalar(.09);
    look(V(lerp(2.4, 1.6, k), .35, lerp(3.4, 2.4, k)), V(lerp(1.6, 1.0, k), 0, lerp(1.4, .7, k)), 36); scene = sea; },
  clamp(lt, d, t) { mouthReset(t); const k = sm(lt / d); iso.position.set(0, lerp(-.2, -1.05, sm(lt / (d * .6))), lerp(-1.8, -.2, sm(lt / (d * .6)))); walkIsopod(iso, t, 1.4 * (1 - k), sm((lt - d * .55) / (d * .3)));
    look(V(lerp(2.2, 1.6, k), lerp(-.2, -.45, k), lerp(2.2, 1.5, k)), V(0, -1.15, -.3), 38); scene = mouthS; },
  blood(lt, d, t) { mouthReset(t); const k = sm(lt / d); tongueMat.color.set(0xe07484).lerp(new THREE.Color(0xff2a3c), .5 + .5 * Math.sin(t * 10));
    drops.forEach((dr, i) => { const ph = ((lt * 1.2 + i / drops.length) % 1); dr.visible = true; const s = V((i % 5 - 2) * .14, -1.28, 1.6 - (i % 3) * .3), e = V(0, -1.05, .15); dr.position.lerpVectors(s, e, ph); dr.scale.setScalar(1 - ph * .6); });
    look(V(lerp(-1.1, -.7, k), -.4, lerp(2.3, 1.6, k)), V(0, -1.2, .4), 36); scene = mouthS; },
  wither(lt, d, t) { mouthReset(t); const k = sm(lt / d); const w = sm(lt / (d * .6)), f = sm((lt - d * .6) / (d * .4));
    tongueMat.color.set(0xe07484).lerp(new THREE.Color(0x6e5a52), w); tongueMat.roughness = lerp(.3, .85, w); tongue.scale.set(lerp(1, .55, w), lerp(1, .5, w), lerp(1, .7, w));
    tongue.position.set(0, -1.32 - f * .2, 1.2 + f * 2.4); tongue.rotation.x = f * 1.4; stump.visible = f > 0; stump.position.set(0, -1.45, .45);
    look(V(lerp(2.2, 1.8, k), lerp(-.1, 0, k), lerp(3.4, 3.8, k)), V(0, -1.3, lerp(.8, 1.6, f)), 42); scene = mouthS; },
  stump(lt, d, t) { mouthReset(t); tongue.visible = false; stump.visible = true; stump.position.set(0, -1.45, .45); const k = sm(lt / d);
    iso.position.set(0, -1.05, lerp(-.2, .8, k)); walkIsopod(iso, t, 1.2 * (1 - k), sm((lt - d * .7) / (d * .3)));
    look(V(-1.8, -.1, 3.2), V(0, -1.15, lerp(.1, .6, k)), 40); scene = mouthS; },
  newTongue(lt, d, t) { mouthReset(t); tongue.visible = false; stump.visible = true; stump.position.set(0, -1.45, .45); iso.position.set(0, -1.05, .8); walkIsopod(iso, t, 0, 1);
    const k = sm(lt / d); food.visible = true; food.position.set(0, lerp(.2, -.75, sm(lt / (d * .6))), lerp(4, 1.2, sm(lt / (d * .6)))); food.rotation.set(t, t * .7, 0);
    iso.position.y = -1.05 + Math.max(0, Math.sin((lt - d * .55) * 9)) * .07 * (lt > d * .55);
    look(V(0, lerp(.5, .1, k), lerp(4.2, 3.4, k)), V(0, -.9, .6), 42); scene = mouthS; },
  pullBack(lt, d, t) { resetSea(t); const k = sm(lt / d); fish.rotation.y = lerp(-.6, -.2, k); fish.position.x = lerp(0, -.6, k); peek(t);
    look(V(lerp(1.8, 3.6, k), lerp(.1, .8, k), lerp(2.2, 7.5, k)), V(lerp(.5, 0, k), lerp(0, -.2, k), 0), 38); scene = sea; },
  outro(lt, d, t) { resetSea(t); fish.rotation.y = -1.25; peek(t); const k = sm(lt / d); look(V(lerp(3.4, 2.6, k), lerp(.4, .05, k), lerp(3.4, 2.1, k)), V(.55, -.02, 1.5), 34); scene = sea; },
};
let scene = sea;

// ---------- Untertitel (2D-Ebene) ----------
const out = document.createElement("canvas"); out.width = W; out.height = H; document.body.prepend(out);
const g2 = out.getContext("2d");
function caption(g, words, t, st) {
  let cur = -1; for (let i = 0; i < words.length; i++) if (t >= words[i].t0) cur = i;
  if (cur < 0) return;
  const chunk = words[cur].chunk, list = words.filter((w) => w.chunk === chunk);
  const fs = 88; g.font = '800 ' + fs + 'px "Montserrat"'; g.textBaseline = "middle"; g.textAlign = "left"; g.lineJoin = "round";
  const parts = list.map((w) => ({ w, txt: w.text.toUpperCase(), wd: g.measureText(w.text.toUpperCase()).width }));
  const gap = 24, maxW = W - 80 - 190; const lines = [[]]; let lw = 0;
  for (const p of parts) { if (lw + p.wd > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(p); lw += p.wd + gap; }
  const cy = H * st.y, lh = fs * 1.15;
  lines.forEach((ln, li) => { const tw = ln.reduce((s, p) => s + p.wd, 0) + gap * (ln.length - 1); let x = 80 + (maxW - tw) / 2; const y = cy + (li - (lines.length - 1) / 2) * lh;
    for (const p of ln) { const on = p.w === words[cur], spoken = t >= p.w.t0, a = clamp((t - p.w.t0) / .08, 0, 1);
      g.save(); g.translate(x, y + (spoken ? (1 - a) * 10 : 0)); g.shadowColor = "rgba(0,0,0,.85)"; g.shadowBlur = 18; g.shadowOffsetY = 4;
      g.lineWidth = 12; g.strokeStyle = "rgba(0,0,0,.9)"; g.strokeText(p.txt, 0, 0); g.shadowBlur = 0;
      g.fillStyle = on || p.w.key ? st.key : "#fff"; g.globalAlpha = spoken ? 1 : .55; g.fillText(p.txt, 0, 0); g.restore(); x += p.wd + gap; } });
}
function hookLine(g, txt) { g.save(); g.font = '800 88px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle";
  const lines = txt.split("\n"); const bw = Math.max(...lines.map((l) => g.measureText(l).width)) + 80, bh = lines.length * 104 + 44, cx = (W - 150) / 2 + 40, y0 = H * .17;
  g.fillStyle = "rgba(0,0,0,.5)"; g.beginPath(); g.roundRect(cx - bw / 2, y0 - bh / 2, bw, bh, 26); g.fill();
  lines.forEach((l, i) => { g.fillStyle = "#fff"; g.fillText(l, cx, y0 + (i - (lines.length - 1) / 2) * 104); }); g.restore(); }

window.makeAnim = function (spec, words, beats) {
  const total = beats[beats.length - 1].t1;
  function frame(t) {
    let bi = beats.findIndex((b) => t < b.t1); if (bi < 0) bi = beats.length - 1;
    const b = beats[bi]; SHOTS[spec.beats[bi].scene.shot](t - b.t0, b.t1 - b.t0, t);
    renderer.render(scene, cam);
    g2.drawImage(renderer.domElement, 0, 0);
    const vg = g2.createRadialGradient(W / 2, H * .45, H * .3, W / 2, H * .5, H * .8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.45)"); g2.fillStyle = vg; g2.fillRect(0, 0, W, H);
    if (bi === 0 && spec.hook) hookLine(g2, spec.hook);
    caption(g2, words, t, { y: spec.capY || .75, key: spec.key || "#ffd84d" });
  }
  return { frame, total, cv: out };
};
window.__animReady = true;
