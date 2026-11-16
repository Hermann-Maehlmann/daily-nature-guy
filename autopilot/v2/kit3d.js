// 3D-Baukasten "Daily Nature Guy" (seit 16.11.2026, Hermann: alle Videos in 3D).
// three.js r128 im Spielzeug-/Knet-Look. Eine eigene WebGL-Leinwand wird pro Bild gerendert und auf die 2D-Leinwand
// der Engine (anim2d.js) kopiert; Untertitel, Hook, Bloom, Vignette und Korn macht weiter render5.js.
// Szenendateien laden ihn mit der ersten Zeile aus autopilot/v2/szenen/3d/dog-tail-3d-szenen.js;  danach steht alles unter window.K3 (siehe STIL.md, Abschnitt 3D).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.THREE) { const x = new XMLHttpRequest(); x.open("GET", "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", false); x.send(); (0, eval)(x.responseText); }
  const T = window.THREE, PI = Math.PI;
  // ---------- 2D-Overlays (wie Comedy-Vorbild) ----------
  function txt(s, x, y, size, col, o) { o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = o.a ?? 1; g.font = `${o.w || 800} ${size}px "Montserrat"`; g.textAlign = o.align || "center"; g.textBaseline = "middle";
    if (o.stroke) { g.lineJoin = "round"; g.lineWidth = o.stroke; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
  function stamp(s, x, y, p, col, rot) { if (p <= 0) return; p = Math.min(p, 1); const k = easeBack(p); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot ?? -.08); g.scale(k * (1 + (1 - p) * .6), k * (1 + (1 - p) * .6)); g.globalAlpha = clamp(p * 3, 0, 1);
    g.font = '900 64px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(s).width + 70;
    g.fillStyle = "rgba(10,10,30,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -50 + 10, w, 100, 22); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 22); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2 + 10, -40, w - 20, 80, 16); g.stroke();
    g.fillStyle = "#fff"; g.fillText(s, 0, 4); g.restore(); }
  function card(x, y, w, h, p, head, col) { const k = easeBack(clamp(p, 0, 1)); if (k <= 0) return false; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 30); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 30); g.fill();
    if (head) { g.fillStyle = col || "#2f6fd0"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 100, [30, 30, 0, 0]); g.fill(); g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(head, 0, -h / 2 + 52); }
    g.restore(); return true; }

  // ---------- three.js Grundgerüst ----------
  const cv3 = document.createElement("canvas"); cv3.width = W; cv3.height = H;
  const R3 = new T.WebGLRenderer({ canvas: cv3, antialias: true, preserveDrawingBuffer: true });
  R3.setPixelRatio(1); R3.setSize(W, H, false);
  R3.outputEncoding = T.sRGBEncoding; R3.toneMapping = T.ACESFilmicToneMapping; R3.toneMappingExposure = .92;
  R3.shadowMap.enabled = true; R3.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, W / H, .1, 120);
  camera.setViewOffset(W, H, 70, H * .07, W, H); // Motiv etwas nach oben-links (TikTok-Buttons rechts, Untertitel unten)

  const hemi = new T.HemisphereLight(0xcfe8ff, 0xe9b98a, .75); scene.add(hemi);
  const key = new T.DirectionalLight(0xfff0d8, 1.7); key.position.set(4, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 30 }); key.shadow.radius = 4; key.shadow.bias = -.0006;
  scene.add(key); scene.add(key.target);
  const rimL = new T.DirectionalLight(0xa8d4ff, .9); rimL.position.set(-4, 4, -5); scene.add(rimL);
  const fill = new T.PointLight(0xffc89a, .35, 20); fill.position.set(2, 2, 6); scene.add(fill);

  function canvasTex(w, h, draw) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  const M = (col, o) => { const m = new T.MeshStandardMaterial(Object.assign({ color: col, roughness: .55, metalness: 0 }, o || {})); m.color.convertSRGBToLinear(); if (m.emissive) m.emissive.convertSRGBToLinear(); return m; };
  function mesh(geo, mat, x, y, z, sx, sy, sz) { const m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.scale.set(sx ?? 1, sy ?? sx ?? 1, sz ?? sx ?? 1); m.castShadow = true; m.receiveShadow = true; return m; }
  const SPH = new T.SphereGeometry(1, 48, 32), CYL = new T.CylinderGeometry(1, 1, 1, 32), BOX = new T.BoxGeometry(1, 1, 1);
  const sph = (mat, x, y, z, sx, sy, sz) => mesh(SPH, mat, x, y, z, sx, sy, sz);
  function limb(r, len, mat) { const gq = new T.CylinderGeometry(r, r * .9, len, 24); gq.translate(0, -len / 2, 0); const m = mesh(gq, mat); const cap = sph(mat, 0, -len, 0, r * .95); m.add(cap); return m; }

  // ---------- Welten: "yard" (Garten mit Hundehütte, Baum, Zaun) und "studio" (Infografik: Marineblau, Korallen-Sockel) ----------
  let built = false, yard, studio, skyTex, navyTex, rudi; const builders = [], actors = [];
  function build() {
    built = true;
    skyTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(.55, "#a9dcff"); gr.addColorStop(1, "#ffe6c4"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    navyTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#2b2f7a"); gr.addColorStop(1, "#0e1238"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    // Garten
    yard = new T.Group(); scene.add(yard);
    const grassTex = canvasTex(512, 512, (c, w, h) => { c.fillStyle = "#79c25a"; c.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { c.globalAlpha = .18; c.fillStyle = Math.random() > .5 ? "#5aa646" : "#9ad670"; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 6, 0, 7); c.fill(); } });
    grassTex.wrapS = grassTex.wrapT = T.RepeatWrapping; grassTex.repeat.set(10, 10);
    const ground = new T.Mesh(new T.CircleGeometry(40, 64), M(0xffffff, { map: grassTex, roughness: .9 })); ground.rotation.x = -PI / 2; ground.receiveShadow = true; yard.add(ground);
    // Weg
    const path = new T.Mesh(new T.CircleGeometry(1, 48), M(0xe9d3a6, { roughness: .95 })); path.rotation.x = -PI / 2; path.scale.set(1.6, 6, 1); path.position.set(.4, .005, 1); path.receiveShadow = true; yard.add(path);
    // Hundehütte
    const house = new T.Group(); house.position.set(-2.4, 0, -2.2); house.rotation.y = .5; yard.add(house);
    house.add(mesh(BOX, M(0xe0503c), 0, .55, 0, 1.3, 1.1, 1.2));
    for (const s of [-1, 1]) { const roof = mesh(BOX, M(0x3b4a8a), 0, 1.28, s * .36, 1.5, .12, .9); roof.rotation.x = s * .62; house.add(roof); }
    const door = mesh(new T.CircleGeometry(.32, 32), M(0x2a1a14, { roughness: 1 }), .651, .45, 0); door.rotation.y = PI / 2; house.add(door);
    house.add(mesh(BOX, M(0x2a1a14), .652, .3, 0, .001, .3, .64));
    // Baum, Büsche, Zaun, Blumen
    const tree = new T.Group(); tree.position.set(2.8, 0, -4.2); yard.add(tree);
    tree.add(mesh(CYL, M(0x8a5a3a), 0, 1.1, 0, .22, 2.2, .22));
    for (const [x, y, z, r] of [[0, 2.7, 0, 1.2], [-.8, 2.2, .3, .85], [.85, 2.3, .2, .9], [0, 3.4, -.2, .8]]) tree.add(sph(M(0x4fae4a), x, y, z, r));
    for (const [x, z, r] of [[-4.5, -3.5, .9], [-3.6, -4.4, .7], [4.6, -2, .8], [5.2, -3, .6], [-5.5, -1, .7]]) yard.add(sph(M(0x5cb84e), x, r * .6, z, r, r * .8, r));
    for (let i = -14; i <= 14; i++) { const x = i * .55; yard.add(mesh(BOX, M(0xfff8ee), x, .6, -6, .22, 1.2, .08)); }
    yard.add(mesh(BOX, M(0xfff8ee), 0, .85, -6.05, 16, .1, .05)); yard.add(mesh(BOX, M(0xfff8ee), 0, .4, -6.05, 16, .1, .05));
    const fc = [0xff6b8a, 0xffd23f, 0xffffff, 0xb08cff];
    for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 3 + (i % 5) * .7; const x = Math.cos(a) * r, z = Math.sin(a) * r - 2.5; if (z > 0 && Math.abs(x) < 2.5) continue; yard.add(sph(M(fc[i % 4]), x, .09, z, .09)); }
    // Studio (Infografiken)
    studio = new T.Group(); scene.add(studio);
    const pedestal = mesh(new T.CylinderGeometry(1.5, 1.6, .3, 64), M(0xff6f61, { roughness: .35 }), 0, -.15, 0); studio.add(pedestal);
    const floorS = new T.Mesh(new T.CircleGeometry(30, 64), M(0x1a1f55, { roughness: .6 })); floorS.rotation.x = -PI / 2; floorS.position.y = -.3; floorS.receiveShadow = true; studio.add(floorS);
    for (let i = 0; i < 40; i++) { const a = i * 1.7, r = 4 + (i % 7) * 1.3; studio.add(sph(M(0xffffff, { emissive: 0x8fa0ff, emissiveIntensity: .6 }), Math.cos(a) * r, 1 + (i % 5) * 1.1, Math.sin(a) * r - 4, .04 + (i % 3) * .02)); }
    rudi = actor(makeRudi());
    builders.forEach((f) => f());
  }

  // ---------- Rudi in 3D (gelbe Regenjacke, rote Mütze, Jeans) ----------
  function makeRudi() {
    const yel = M(0xffc928, { roughness: .4 }), jeans = M(0x3b6db3, { roughness: .8 }), skin = M(0xf3c39d), red = M(0xe23b3b, { roughness: .7 }), shoe = M(0x5a3a2a), eyeW = M(0xffffff, { roughness: .15 }), pupil = M(0x161018, { roughness: .1 });
    const metal = M(0xc5ced8, { metalness: .9, roughness: .28 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const legs = []; for (const s of [-1, 1]) { const l = limb(.1, .62, jeans); l.position.set(0, .7, s * .13); const sh = sph(shoe, .07, -.64, 0, .14, .08, .1); l.add(sh); body.add(l); legs.push(l); }
    const coatG = new T.CylinderGeometry(.27, .37, .78, 40); const coat = mesh(coatG, yel, 0, 1.02, 0); body.add(coat);
    const shoulders = sph(yel, 0, 1.38, 0, .29, .14, .31); body.add(shoulders);
    for (let i = 0; i < 3; i++) body.add(sph(M(0x2b62c9), .3 - i * .012, 1.25 - i * .18, 0, .03));
    const arms = []; for (const s of [-1, 1]) { const a = limb(.075, .56, yel); a.position.set(0, 1.36, s * .33); const hand = sph(skin, 0, -.62, 0, .085); a.add(hand); body.add(a); arms.push(a); }
    const head = new T.Group(); head.position.set(0, 1.74, 0); body.add(head);
    head.add(sph(skin, 0, 0, 0, .31));
    head.add(sph(skin, .29, -.02, 0, .06, .055, .06));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.25, .06, s * .11); head.add(e); e.add(sph(eyeW, 0, 0, 0, .085, .1, .085)); e.add(sph(pupil, .06, 0, 0, .048)); e.add(sph(M(0xffffff, { emissive: 0xffffff }), .1, .03, -.01 * s, .014)); eyes.push(e); }
    const smile = mesh(new T.TorusGeometry(.08, .016, 8, 24, PI), M(0x6a2a20), .27, -.13, 0); smile.rotation.set(0, PI / 2, PI); head.add(smile);
    const oMouth = sph(M(0x5a1a22), .28, -.14, 0, .03, .05, .045); head.add(oMouth);
    const hat = new T.Group(); head.add(hat);
    hat.add(mesh(new T.SphereGeometry(.325, 40, 20, 0, 2 * PI, 0, PI / 2), red, 0, .05, 0, 1, 1.05, 1));
    const band = mesh(new T.TorusGeometry(.32, .05, 12, 40), red, 0, .06, 0); band.rotation.x = PI / 2; hat.add(band);
    hat.add(sph(M(0xffffff, { roughness: .9 }), 0, .4, 0, .08));
    // Rüstung
    const armor = new T.Group(); body.add(armor);
    armor.add(mesh(new T.CylinderGeometry(.31, .4, .82, 40), metal, 0, 1.02, 0));
    armor.add(sph(metal, 0, 1.4, 0, .33, .16, .35));
    for (const s of [-1, 1]) { armor.add(sph(metal, 0, 1.4, s * .34, .14)); }
    const helmet = new T.Group(); head.add(helmet);
    helmet.add(sph(metal, 0, .02, 0, .36, .37, .36));
    helmet.add(mesh(BOX, M(0x111318, { roughness: .3 }), .33, .06, 0, .08, .05, .34));
    const plume = sph(M(0xe23b3b), -.05, .42, 0, .1, .2, .05); helmet.add(plume);
    const armM = [];
    return { root, body, legs, arms, head, eyes, smile, oMouth, hat, armor, helmet, coat, shoulders, yel, metal, jeans };
  }
  function poseRudi(R, t, o) {
    o = o || {};
    const arm = o.arms || [0, 0], spread = o.spread || 0;
    R.arms.forEach((a, i) => { const s = i ? 1 : -1; const wv = o.wave && i === 1 ? Math.sin(t * 10) * .35 : 0; a.rotation.set(-s * (spread + .08) + wv * s, 0, arm[i]); });
    const walk = o.walk || 0; R.legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 8 + i * PI) * .5 * walk; });
    R.body.position.y = Math.abs(Math.cos(t * 8)) * .05 * walk + Math.sin(t * 2) * .006;
    R.body.rotation.z = o.lean || 0;
    R.head.rotation.z = (o.nod || 0) + Math.sin(t * 1.7) * .03; R.head.rotation.x = o.tilt || 0;
    const blink = Math.sin(t * 1.9 + 2) > .985 ? .15 : 1; R.eyes.forEach((e) => e.scale.set(1, blink * (o.wide ? 1.2 : 1), 1));
    R.smile.visible = o.mouth !== "o"; R.oMouth.visible = o.mouth === "o";
    const arm0 = !!o.armor; R.armor.visible = arm0; R.helmet.visible = arm0; R.hat.visible = !arm0; R.coat.visible = !arm0; R.shoulders.visible = !arm0;
    R.arms.forEach((a) => a.material = arm0 ? R.metal : R.yel); R.legs.forEach((l) => l.material = arm0 ? R.metal : R.jeans);
  }


  // ---------- Kamera + Bild ----------
  function world(which) { const y = which === "yard"; yard.visible = y; studio.visible = !y; scene.background = y ? skyTex : navyTex; scene.fog = y ? new T.Fog(0xcfe9ff, 14, 40) : new T.Fog(0x141a4a, 10, 34); hemi.intensity = y ? .75 : .55; }
  function actor(o) { actors.push(o); scene.add(o.root); return o; }
  function hideAll() { actors.forEach((a) => a.root.visible = false); }
  let ZK = 1.9; // Hochformat ist schmal: alle Kamera-Abstände werden mit ZK gestreckt (1.9 = Figuren ganz im Bild)
  function view(px, py, pz, tx, ty, tz, fov, t) {
    const Z = ZK; px = tx + (px - tx) * Z; py = ty + (py - ty) * Z; pz = tz + (pz - tz) * Z;
    const f = .06; camera.position.set(px + Math.sin(t * .7) * f, py + Math.cos(t * .55) * f, pz); camera.fov = fov || 32; camera.updateProjectionMatrix(); camera.lookAt(tx, ty, tz);
  }
  function draw() { key.target.position.set(0, 0, 0); R3.render(scene, camera); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = "none"; g.drawImage(cv3, 0, 0); }
  function begin(which) { if (!built) build(); hideAll(); world(which); }
  const place = (o, x, z, ry) => { o.root.visible = true; o.root.position.set(x, 0, z); o.root.rotation.y = ry || 0; };

  window.K3 = { T, PI, scene, camera, R3, key, hemi, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, makeRudi, view, draw, begin, place, actor,
    onBuild(f) { builders.push(f); }, get rudi() { return rudi; }, get yard() { return yard; }, get studio() { return studio; },
    get zoom() { return ZK; }, set zoom(z) { ZK = z; } };
})();
