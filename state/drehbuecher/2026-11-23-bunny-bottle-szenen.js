// 3D-Szene "Why Your Bunny Secretly Hates Its Water Bottle" / "Warum dein Kaninchen seine Trinkflasche hasst" (23.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Hauskaninchen "Hoppel" (Figur aus den Kaninchen-Videos, poseBunny mit nod = Nase hoch/runter), Nippel-Trinkflasche am Holzpfosten (Wasser, Metallröhrchen, Kugel,
// optional vereist mit Eiszapfen), schwere Keramikschale mit Wasser, Riesenflasche, Mikrofon, Föhn, Schneeflecken + 2D-Schneeflocken, Eilmeldungs-Balken.
// Opener-Stil "nachrichten": Eilmeldung, Rudi als Reporter mit Mikro, Laufband "Kaninchen im Durststreik".
// Quellen: RWAF ("Bowls are better than bottles as lapping from a bowl is more natural to rabbits. The spout of bottles can easily get clogged, and will freeze in winter"),
// Tschudin et al. 2011, Uni Zürich (Kaninchen bevorzugten offene Schalen, auch wenn sie Nippeltränken gewohnt waren; aus der Flasche 3-4x so lange für dieselbe Menge, The Rabbit House),
// Chewy/Woods ("they don't naturally look upwards"), gov.scot ("most rabbits prefer bowls and will drink more if a bowl is provided").
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => [L("3–4× longer", "3–4× so lang"), L("Same time", "Gleich lang"), L("Twice as long", "Doppelt so lang")];
  let bun, bun2, rudi, bottle, bigBottle, bowl, bowl2, mic, dryer, snow, drop;

  // ---------- Hauskaninchen (wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  const FUR = 0xb98a5e;
  function makeBunny() {
    const fur = M(FUR, { roughness: .8 }), furD = M(new T.Color(FUR).multiplyScalar(.8).getHex(), { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
    const pink = M(0xffa3b1, { roughness: .6 }), eyeM = M(0x2a1610, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), tooth = M(0xfffaf0, { roughness: .3 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, -.08, .22, 0, .27, .23, .24));
    body.add(sph(fur, .1, .25, 0, .18, .19, .17));
    body.add(sph(cream, .15, .2, 0, .12, .14, .13));
    body.add(sph(cream, -.02, .09, 0, .24, .1, .17));
    body.add(sph(furD, -.12, .38, 0, .16, .07, .14));
    const tail = sph(white, -.34, .27, 0, .075, .075, .075); body.add(tail);
    const hind = []; for (const s of [-1, 1]) { const hl2 = new T.Group(); hl2.position.set(-.1, .16, s * .15); body.add(hl2);
      hl2.add(sph(fur, 0, 0, 0, .13, .13, .07)); hl2.add(sph(cream, .1, -.125, 0, .16, .042, .06)); hind.push(hl2); }
    const front = []; for (const s of [-1, 1]) { const f = limb(.035, .16, fur); f.position.set(.17, .17, s * .075); f.add(sph(cream, .025, -.165, 0, .05, .028, .04)); body.add(f); front.push(f); }
    const head = new T.Group(); head.position.set(.24, .43, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .15, .14, .135));
    for (const s of [-1, 1]) head.add(sph(cream, .1, -.045, s * .042, .06, .052, .055));
    const nose = sph(pink, .155, -.012, 0, .022, .018, .026); head.add(nose);
    // zwei Schneidezähne unter der Nase, wachsen nach unten (teeth = Länge)
    const teeth = new T.Group(); teeth.position.set(.142, -.075, 0); head.add(teeth);
    for (const s of [-1, 1]) teeth.add(mesh(BOX, tooth, 0, -.018, s * .011, .012, .036, .02));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.065, .035, s * .1); head.add(e);
      const ey = K3.eye(.05, { white: M(0x5a3420, { roughness: .2 }), pupil: eyeM }); ey.scale.set(.75, 1.1, .8); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, furD, .07, .1, s * .09, .05, .012, .02); head.add(b); brows.push(b); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .12, -.04 + i * .02, s * .1, .004, .16, .004); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.04, .1, s * .055); head.add(e);
      e.add(sph(fur, 0, .2, 0, .035, .22, .07)); e.add(sph(pink, .02, .2, 0, .02, .17, .05)); ears.push(e); }
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail, teeth };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, lid, look, tilt, nod, lean, sc, sad, angry, happy, chew, hop, teeth (Länge, 1 normal), cheek (Pfote an die Backe)}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0;
    B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    const ch = o.chew ? Math.sin(t * 14) * .04 : 0;
    B.head.position.set(.24, .43, 0);
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + Math.sin(t * 1.6) * .02 + ch);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); }
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .4 : (o.wide ? -.35 : (o.sad ? .35 : 0))); b.position.y = o.wide ? .115 : .1; });
    B.teeth.scale.set(1, o.teeth || 1, 1);
    const hop = o.hop || 0;
    B.hind.forEach((h) => { h.rotation.z = -hop * 1.1; });
    B.front.forEach((f, i) => { f.rotation.z = hop * .9 + (o.cheek && i === 1 ? 1.9 : 0); f.rotation.x = o.cheek && i === 1 ? -.5 : 0; });
    B.body.rotation.z = hop * .25 + (o.lean || 0);
    B.body.position.set(0, Math.sin(t * 2) * .004 + (o.happy ? Math.abs(Math.sin(t * 6)) * .05 : 0) + hop * .12, 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Requisiten ----------
  // Nippel-Trinkflasche am Holzpfosten. Röhrchen zeigt nach +x schräg nach unten, Spitze = tipLocal. frozen 0..1 vereist.
  function makeBottle() { const root = new T.Group();
    const wood = M(0xa8743f, { roughness: .85 }), woodD = M(0x7d5530, { roughness: .85 }), cap = M(0xe5484d, { roughness: .35 }), steel = M(0xcfd6de, { metalness: .8, roughness: .25 });
    root.add(mesh(BOX, wood, -.16, .62, 0, .09, 1.24, .09)); root.add(mesh(BOX, woodD, -.16, 1.26, 0, .13, .05, .13));
    root.add(mesh(BOX, steel, -.07, 1.0, 0, .12, .025, .03)); root.add(mesh(BOX, steel, -.07, .8, 0, .12, .025, .03));
    const glass = new T.Mesh(new T.CylinderGeometry(.09, .09, .42, 28), new T.MeshStandardMaterial({ color: 0xdff2ff, roughness: .05, metalness: .1, transparent: true, opacity: .35 })); glass.position.set(0, .93, 0); root.add(glass);
    const waterM = M(0x3fa9f5, { roughness: .15 }); waterM.transparent = true; waterM.opacity = .85;
    const water = mesh(new T.CylinderGeometry(.08, .08, .3, 24), waterM, 0, .88, 0); water.castShadow = false; root.add(water);
    root.add(mesh(new T.CylinderGeometry(.095, .095, .06, 24), cap, 0, 1.16, 0));
    root.add(mesh(new T.CylinderGeometry(.06, .08, .07, 20), cap, 0, .69, 0));
    const tube = mesh(new T.CylinderGeometry(.016, .016, .26, 12), steel, .07, .56, 0); tube.rotation.z = .65; root.add(tube);
    const tipLocal = V(.07 + Math.sin(.65) * .13, .56 - Math.cos(.65) * .13, 0); root.add(sph(steel, tipLocal.x, tipLocal.y, 0, .02));
    const ice = new T.Group(); root.add(ice); const iceM = M(0xe6f6ff, { roughness: .15, emissive: 0x9fd8ff, emissiveIntensity: .25 }); iceM.transparent = true; iceM.opacity = .9;
    ice.add(mesh(new T.CylinderGeometry(.1, .1, .36, 24), iceM, 0, .9, 0));
    for (let i = 0; i < 5; i++) { const c = mesh(new T.ConeGeometry(.018 + (i % 2) * .008, .12 + (i % 3) * .06, 10), iceM, -.06 + i * .03, .62 - (i % 3) * .03, (i % 2 - .5) * .04); c.rotation.x = PI; ice.add(c); }
    const ic = mesh(new T.ConeGeometry(.022, .16, 10), iceM, tipLocal.x, tipLocal.y - .09, 0); ic.rotation.x = PI; ice.add(ic);
    ice.add(sph(M(0xffffff, { roughness: .9 }), 0, 1.21, 0, .11, .035, .11)); ice.add(sph(M(0xffffff, { roughness: .9 }), -.16, 1.3, 0, .09, .03, .09));
    return { root, water, waterM, ice, tipLocal }; }
  function setFrozen(B, f) { B.ice.visible = f > .01; B.ice.scale.setScalar(Math.max(.01, f)); B.ice.position.set(0, (1 - f) * .9, 0); B.waterM.color.setHex(f > .5 ? 0xbfe6ff : 0x3fa9f5); }
  // schwere Keramikschale (Terrakotta außen, Creme innen, Wasser glänzt, kleine Wellen)
  function makeBowl() { const root = new T.Group(); const out = M(0xd9773f, { roughness: .45 }), inn = M(0xfff4e2, { roughness: .35 });
    root.add(mesh(new T.CylinderGeometry(.22, .17, .1, 36), out, 0, .05, 0)); root.add(mesh(new T.CylinderGeometry(.195, .195, .012, 36), inn, 0, .1, 0));
    root.add(mesh(new T.CylinderGeometry(.24, .23, .02, 36), out, 0, .1, 0));
    const wm = M(0x3fa9f5, { roughness: .08, metalness: .1 }); const water = mesh(new T.CylinderGeometry(.19, .19, .01, 36), wm, 0, .093, 0); water.castShadow = false; root.add(water);
    const rip = []; for (let i = 0; i < 2; i++) { const r = new T.Mesh(new T.TorusGeometry(.08, .006, 6, 36), M(0xbfe6ff, { roughness: .1 })); r.rotation.x = PI / 2; r.position.y = .1; root.add(r); rip.push(r); }
    return { root, rip }; }
  function ripple(Bw, t) { Bw.rip.forEach((r, i) => { const q = (t * .8 + i * .5) % 1; r.scale.setScalar(.3 + q * 2); r.material.opacity = 1 - q; r.material.transparent = true; }); }
  function makeMic() { const root = new T.Group(); root.add(mesh(new T.CylinderGeometry(.022, .018, .26, 14), M(0x23284f, { roughness: .4 }), 0, 0, 0)); root.add(sph(M(0x9aa3ad, { metalness: .6, roughness: .35 }), 0, .16, 0, .055));
    const tag = canvasTex(128, 96, (c, w, h) => { c.fillStyle = "#e5484d"; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.font = '900 46px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TV", w / 2, h / 2 + 3); });
    const b = new T.Mesh(new T.BoxGeometry(.09, .07, .09), new T.MeshStandardMaterial({ map: tag, roughness: .5 })); b.position.y = .07; root.add(b); return { root }; }
  function makeDryer() { const root = new T.Group(); const b = M(0x7a5cff, { roughness: .35 }), dk = M(0x2a2350, { roughness: .4 });
    const barrel = mesh(new T.CylinderGeometry(.12, .1, .5, 28), b, .15, 0, 0); barrel.rotation.z = -PI / 2; root.add(barrel);
    root.add(sph(b, -.12, 0, 0, .14, .14, .14)); const noz = mesh(new T.CylinderGeometry(.08, .1, .12, 24), dk, .45, 0, 0); noz.rotation.z = -PI / 2; root.add(noz);
    root.add(mesh(new T.CylinderGeometry(.055, .05, .35, 16), b, -.05, -.2, 0)); return { root }; }
  function makeSnow() { const root = new T.Group(); const m = M(0xffffff, { roughness: .95 });
    for (let i = 0; i < 34; i++) { const a = i * 2.399, r = .4 + Math.sqrt(i / 34) * 3.2; const s = sph(m, Math.cos(a) * r, 0, Math.sin(a) * r * .8 - .6, .25 + (i % 4) * .12, .04, .18 + (i % 3) * .1); s.castShadow = false; root.add(s); }
    return { root }; }
  function makeDrop() { const root = new T.Group(); const m = M(0x7cc8ff, { roughness: .05 }); root.add(sph(m, 0, 0, 0, .025, .034, .025)); const c = mesh(new T.ConeGeometry(.018, .04, 12), m, 0, .03, 0); root.add(c); return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Hoppel"); bun2 = actor(makeBunny(), "Hoppel 2");
    bottle = actor(makeBottle(), "Flasche"); bigBottle = actor(makeBottle(), "Riesenflasche"); bowl = actor(makeBowl(), "Schale"); bowl2 = actor(makeBowl(), "Schale 2");
    mic = actor(makeMic(), "Mikro"); dryer = actor(makeDryer(), "Foehn"); snow = actor(makeSnow(), "Schnee"); drop = actor(makeDrop(), "Tropfen");
    for (const a of [bowl, bowl2, mic, dryer, snow, drop]) a.noCheck = true; snow.noBlob = true; drop.noBlob = true; mic.noBlob = true; dryer.noBlob = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    for (const b of [bun, bun2]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; }
    for (const p of [bottle, bigBottle, bowl, bowl2, mic, dryer, drop]) { p.root.scale.setScalar(1); p.root.rotation.set(0, 0, 0); p.root.position.y = 0; }
    setFrozen(bottle, 0); setFrozen(bigBottle, 0); bottle.noCheck = false; bigBottle.noCheck = false; }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function holdAt(P, p, ry, sc) { P.root.visible = true; P.root.position.copy(p); P.root.rotation.set(0, ry || 0, 0); P.root.scale.setScalar(sc || 1); }
  function noseOf(B) { B.root.updateMatrixWorld(true); return B.head.localToWorld(V(.17, -.01, 0)); }
  // Flasche so hinstellen, dass die Röhrchen-Spitze an Hoppels Nase sitzt (Flasche steht in +x vor dem Kaninchen, schaut zum Kaninchen = gedreht um PI)
  function bottleAtNose(Bt, B, sc, gap) { const n = noseOf(B); const s = sc || 1, ry = B.root.rotation.y + PI;
    const tip = Bt.tipLocal.clone().multiplyScalar(s).applyAxisAngle(V(0, 1, 0), ry); Bt.root.visible = true; Bt.root.scale.setScalar(s); Bt.root.rotation.set(0, ry, 0);
    const dir = V(Math.cos(B.root.rotation.y), 0, -Math.sin(B.root.rotation.y)); Bt.root.position.set(n.x - tip.x + dir.x * (gap || 0), Math.max(0, n.y - tip.y), n.z - tip.z + dir.z * (gap || 0)); }
  function lick(B, t, o, Bt, sc, gap) { poseBunny(B, t, Object.assign({}, o, { chew: false })); bottleAtNose(Bt, B, sc, gap ?? .015); poseBunny(B, t, o); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  function flakes(t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff";
    for (let i = 0; i < 46; i++) { const sp = 90 + (i % 5) * 30, x = ((i * 211) % 1000) + 30 + Math.sin(t * 1.3 + i) * 30, y = ((i * 137 + t * sp) % 1500) + 120, r = 5 + (i % 4) * 3;
      g.globalAlpha = a * (.55 + (i % 3) * .15); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } g.restore(); }
  function newsBar(t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
    g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(60, 168, 470, 78, 14); g.fill(); g.fillStyle = "#fff"; g.font = '900 46px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "middle";
    g.fillText(L("BREAKING NEWS", "EILMELDUNG"), 92, 209); if (Math.sin(t * 8) > 0) { g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(500, 207, 10, 0, 7); g.fill(); }
    g.fillStyle = "rgba(14,18,56,.9)"; g.fillRect(0, 258, W, 70); g.fillStyle = "#ffd23f"; g.font = '900 38px "Montserrat"';
    const s = L("+++ LOCAL BUNNY ON THIRST STRIKE +++ BOTTLE UNDER SUSPICION ", "+++ KANINCHEN IM DURSTSTREIK +++ FLASCHE UNTER VERDACHT "); const sw = g.measureText(s).width;
    for (let x = -((t * 160) % sw); x < W; x += sw) g.fillText(s, x, 294); g.restore(); }
  function protest(x, y, p, t) { if (p <= 0) return; const k = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(Math.sin(t * 4) * .06); g.scale(k, k);
    g.fillStyle = "#8a5a2b"; g.fillRect(-10, 0, 20, 170); g.fillStyle = "#fff8e6"; g.beginPath(); g.roundRect(-170, -110, 340, 130, 14); g.fill(); g.strokeStyle = "#1d2250"; g.lineWidth = 6; g.stroke();
    g.fillStyle = "#e5484d"; g.font = '900 54px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(L("NO BOTTLE!", "KEINE FLASCHE!"), 0, -45, 320); g.restore(); }
  function bars(t, a, grow) { const x0 = W * .42 - 390; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(14,18,56,.85)"; g.beginPath(); g.roundRect(x0 - 20, H * .52, 820, 300, 30); g.fill(); g.restore();
    const row = (y, v, col, lab) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.15)"; g.beginPath(); g.roundRect(x0, y, 760, 56, 28); g.fill();
      g.fillStyle = col; g.beginPath(); g.roundRect(x0, y, Math.max(56, 760 * v), 56, 28); g.fill(); g.restore(); txt(lab, x0 + 10, y - 30, 36, "#ffffff", { a, align: "left" }); };
    row(H * .52 + 85, .24 * grow, "#36b37e", L("Bowl: 1×", "Schale: 1×")); row(H * .52 + 205, .9 * grow, "#e5484d", L("Bottle: 3–4×", "Flasche: 3–4×")); }

  // ---------- Shots ----------
  // Hook: Winter, Hoppel reckt sich zur vereisten Flasche, leckt am Eis-Röhrchen, Schnee fällt, Stempel DURST! sofort
  function hookFrame(t, ph, lt) {
    place(snow, 0, 0, 0); at(bun, -.25, 0, .1, -.45); lick(bun, t, { nod: .55, lean: .18, ears: .15, sad: true, lid: .1, sc: 1.3 }, bottle, 1); setFrozen(bottle, 1); bottle.noCheck = true;
    frameOn([bun, bottle], { az: lerp(.15, .25, ph), el: .16, fill: lerp(1.0, 1.08, ph), t }); draw(); flakes(t, 1); }
  KZ.shot("bHook", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, ph, lt);
    stamp(L("THIRSTY!", "DURST!"), W * .42, H * .6, (lt + .02) / .25, "#2f6fd0", -.07); });
  // 1 Eilmeldung: Rudi als Reporter mit Mikro, Hoppel mit Protestschild (2D) neben der Flasche, Laufband
  KZ.shot("bNews", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, .9, .1, PI + .75); poseRudi(rudi, t, { arms: [.2, 1.25], spread: .05, mouth: Math.sin(t * 11) > 0 ? "o" : "smile", nod: .04 });
    holdAt(mic, hand(1).add(V(-.02, .06, 0)), 0, 1.3); mic.root.rotation.z = .5;
    at(bun, -.5, 0, .2, .5); poseBunny(bun, t, { angry: true, ears: 0, sc: 1.25, hop: Math.max(0, Math.sin(t * 6)) * .25 });
    place(bottle, -1.05, -.35, 0);
    frameOn([rudi, bun, bottle], { az: lerp(.0, .1, k), el: .14, fill: lerp(.86, .92, k), t }); draw();
    newsBar(t, clamp(lt / .15, 0, 1));
    bun.root.updateMatrixWorld(true); const [sx, sy] = scr(bun.root.localToWorld(V(0, 1.0, 0))); protest(clamp(sx, 260, 700), clamp(sy, 470, 900), (lt - .25) / .35, t); });
  // 2 Rate-Frage: Hoppel leckt an der Flasche (normal), Rudi schaut auf die Uhr, Kacheln
  KZ.shot("bQuiz", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    at(bun, -.3, 0, .2, .2); lick(bun, t, { nod: .5, lean: .16, sc: 1.25, chew: true }, bottle, 1);
    frameOn([bun, bottle], { az: lerp(-.35, -.25, k), el: .14, fill: lerp(.9, .96, k), dy: -.55, t }); draw();
    txt(L("HOW MUCH LONGER?", "WIE VIEL LÄNGER?"), W * .42, H * .2, 56, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .56, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Riesenflasche: Rudi stolz neben XXL-Flasche; Schnitt: Hoppel leckt am Riesen-Röhrchen, ein einziger Tropfen fällt
  KZ.shot("bGiant", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .45;
    if (!half) { const k = ph / .45; place(bigBottle, -.1, -.2, 0); bigBottle.root.scale.setScalar(lerp(.8, 1.55, easeBack(clamp(k * 2.2, 0, 1))));
      place(rudi, .9, .35, PI + .9); poseRudi(rudi, t, { arms: [.2, 2.6 + Math.sin(t * 5) * .1], spread: .2, mouth: "smile", wide: true });
      frameOn([bigBottle, rudi], { az: lerp(.15, .22, k), el: .12, fill: lerp(.85, .9, k), t }); draw();
      stamp(L("XXL!", "XXL!"), W * .42, H * .17, (lt - .1) / .3, "#ff4f8b", -.06); }
    else { const k = (ph - .45) / .55; at(bun, -.25, 0, .1, .15); lick(bun, t, { nod: .6, lean: .2, sc: 1.3, chew: true, lid: lerp(.1, .4, k), sad: k > .5 }, bigBottle, 1.5, .02); bigBottle.noCheck = true;
      const dq = (k * 1.6) % 1; bigBottle.root.updateMatrixWorld(true); const tip = bigBottle.root.localToWorld(bigBottle.tipLocal.clone()); holdAt(drop, V(tip.x, tip.y - .05 - dq * .5, tip.z), 0, 1.4); drop.root.visible = dq < .95;
      frameOn([bun, FR(tip.x - .4, 0, tip.z - .3, tip.x + .3, tip.y + .5, tip.z + .3)], { az: lerp(-.55, -.45, k), el: .12, fill: lerp(.9, .96, k), t }); draw();
      stamp(L("1 DROP", "1 TROPFEN"), W * .42, H * .17, (k * d * .55 - .1) / .3, "#2f6fd0", .06); } });
  // 4 Frost: Schnee, Flasche gefriert (Eis wächst), Rudi föhnt, Hoppel guckt traurig
  KZ.shot("bFrost", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(snow, 0, 0, 0); at(bun, -.75, 0, .35, .35); poseBunny(bun, t, { sad: true, ears: .4, sc: 1.3, lookAt: V(0, .75, 0) });
    place(bottle, 0, 0, 0); bottle.root.rotation.y = PI; setFrozen(bottle, sm(clamp(ph / .35, 0, 1)));
    place(rudi, .95, .25, PI + .8); poseRudi(rudi, t, { arms: [.2, 1.45], spread: .05, mouth: "o", lean: .05 });
    const hp = hand(1); dryer.root.visible = ph > .35; dryer.root.position.set(hp.x, hp.y + .1, hp.z); dryer.root.rotation.set(0, PI + .8, -.15);
    frameOn([bun, bottle, rudi], { az: lerp(.1, .18, k), el: .15, fill: lerp(.86, .9, k), t }); draw(); flakes(t, 1);
    stamp(L("FROZEN!", "GEFROREN!"), W * .42, H * .17, (lt - .45) / .3, "#2f6fd0", -.06); });
  // 5 Studio: links Hoppel trinkt aus der Schale (Kopf unten, Haken), rechts Hoppel 2 reckt sich zur Flasche (Kreuz) + RWAF-Karte
  KZ.shot("bNeck", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bun, -.75, 0, .1, 0); poseBunny(bun, t, { nod: -.45, lean: -.08, sc: 1.15, chew: true, lid: .3 }); place(bowl, -.75 + .52, .1, 0);
    at(bun2, .45, 0, .1, 0); lick(bun2, t, { nod: .6, lean: .2, sc: 1.15, sad: true }, bottle, 1.15); bottle.noCheck = true;
    frameOn([bun, bun2, bottle], { az: lerp(.08, .02, k), el: .14, fill: lerp(.95, 1.0, k), dy: -.5, t }); draw();
    bun.root.updateMatrixWorld(true); const [ax, ay] = scr(bun.root.localToWorld(V(.1, 1.1, 0))); const [bx, by] = scr(bun2.root.localToWorld(V(.1, 1.25, 0)));
    stamp("✓", ax, ay, (lt - .15) / .3, "#36b37e", -.06); stamp("✗", Math.min(bx, 820), by, (lt - .45) / .3, "#e5484d", .06);
    infoCard(W * .42, H * .6, 900, 200, sm((ph - .45) * d / .35), "RWAF", "#36b37e",
      [L("“Bowls are better", "„Schalen sind besser"), L("than bottles.”", "als Flaschen.“")], 42); });
  // 6 Auflösung: Kacheln mit Haken, dann Zeitbalken Schale vs. Flasche
  KZ.shot("bTimer", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bun, -.15, 0, 0, .35); lick(bun, t, { nod: .55, lean: .18, sc: 1.3, chew: true, lid: .3 }, bottle, 1.3); bottle.noCheck = true;
    frameOn([bun, bottle], { az: lerp(.5, .4, k), el: .15, fill: lerp(.72, .78, k), dy: -.8, t }); draw();
    stamp(L("3–4× LONGER", "3–4× SO LANG"), W * .42, H * .17, (lt - .2) / .3, "#e5484d", -.06);
    if (ph < .42) quizTiles(W * .42, H * .56, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 0 });
    else bars(t, clamp((ph - .42) * d / .25, 0, 1), sm(clamp((ph - .45) * d / 1.2, 0, 1))); });
  // 7 Studie: Hoppel hat die Wahl zwischen Flasche und Schale, hoppelt zur Schale und trinkt + Uni-Zürich-Karte
  KZ.shot("bStudy", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph), go = sm(clamp((ph - .1) / .35, 0, 1));
    place(bottle, -1.05, -.35, 0); place(bowl, .75, .15, 0); bowl.root.scale.setScalar(1.2); ripple(bowl, t);
    const drink = go > .98; at(bun, lerp(-.45, .18, go), 0, lerp(-.1, .15, go), lerp(.9, 0, go)); poseBunny(bun, t, { hop: drink ? 0 : Math.abs(Math.sin(t * 9)) * .7 * (go > .02 ? 1 : 0), nod: drink ? -.45 : 0, lean: drink ? -.08 : 0, chew: drink, happy: !drink && go < .02, sc: 1.2 });
    frameOn([bottle, bun, FR(.45, 0, -.15, 1.05, .2, .45)], { az: lerp(.05, .12, k), el: .16, fill: lerp(.95, 1.0, k), dy: -.6, t }); draw();
    stamp(L("BOWL!", "SCHALE!"), W * .42, H * .17, (lt - d * .35) / .3, "#36b37e", -.06);
    infoCard(W * .42, H * .6, 900, 230, sm((ph - .4) * d / .35), L("UNIVERSITY OF ZURICH, 2011", "UNI ZÜRICH, 2011"), "#2f6fd0",
      [L("Rabbits favoured open dishes,", "Kaninchen bevorzugten Schalen,"), L("even if used to bottles.", "auch wenn sie Flaschen kannten.")], 38); });
  // 8 Tipp: Rudi stellt die schwere Keramikschale hin, Hoppel trinkt glücklich, Flasche hinten als Reserve
  KZ.shot("bTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph), down = sm(clamp(ph / .3, 0, 1));
    place(rudi, 1.0, -.4, PI + .6); poseRudi(rudi, t, { arms: [.2, lerp(1.3, .9, down)], spread: .05, mouth: "smile", nod: .06 });
    if (down < 1) { const hp = hand(1); holdAt(bowl, V(hp.x - .05, Math.max(0, hp.y - .12), hp.z), 0, 1.25); } else { place(bowl, .3, .05, 0); bowl.root.scale.setScalar(1.25); }
    ripple(bowl, t); at(bun, -.35, 0, .05, 0); poseBunny(bun, t, { nod: ph > .35 ? -.42 : 0, lean: ph > .35 ? -.06 : 0, chew: ph > .35, happy: ph <= .35, sc: 1.2 });
    place(bottle, -1.2, -.55, 0);
    frameOn([rudi, bun, bottle], { az: lerp(-.3, -.36, k), el: .15, fill: lerp(.88, .92, k), dy: -.7, t }); draw();
    stamp(L("CERAMIC!", "KERAMIK!"), W * .42, H * .17, (lt - .15) / .3, "#d9773f", -.06);
    infoCard(W * .42, H * .6, 900, 200, sm((ph - .4) * d / .35), L("TIP", "TIPP"), "#36b37e",
      [L("Heavy bowl, fresh daily", "Schwere Schale, täglich frisch"), L("Bottle = backup only", "Flasche nur als Reserve")], 40); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("bLoop", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, 1 - ph * .9, lt);
    if (ph > .3) stamp(L("THAT BOTTLE...", "DIESE FLASCHE..."), W * .42, H * .17, (ph - .3) * d / .3, "#2f6fd0", -.06); });

  window.__bunnyBottle = true;
})();
