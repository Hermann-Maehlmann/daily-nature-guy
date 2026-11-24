// 3D-Szene "Why Your Bunny Secretly Hates The Leash" / "Warum dein Kaninchen die Leine hasst" (24.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Hauskaninchen "Hoppel" (Figur aus den Kaninchen-Videos), pinkes Brustgeschirr mit Rückenring, Leine als gebogene Röhre (leashBetween), Fernglas-Maske 2D,
// Bell-Blase am Hundehaus, Versteck-Karton, Holzpflock, rundes Gehege mit Zaun und Haken fürs Geschirr.
// Opener-Stil "tierdoku": Naturfilm-Flüstern durchs Fernglas ("Hier beobachten wir den wilden Rudi ...").
// Quellen: RWAF Policy "Exercising using a harness and lead" ("does not recommend the use of harnesses", danger from disease and predators, escape or injury,
// "most active at dawn and dusk", "run in short, rapid bursts", permanent access to a large enclosure), RSPCA Rabbit behaviour ("when frightened, rabbits will
// instinctively run and hide – being attached to a lead prevents this behaviour, leading to unnecessary stress"; injure themselves "hitting the end of the lead").
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => [L("At noon", "Mittags"), L("Dawn & dusk", "In der Dämmerung"), L("At midnight", "Nachts")];
  let bun, rudi, leash, box, stake, pen, hook2, dogHouse;

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
  const PINK = 0xff4f8b;
  // Brustgeschirr: zwei Gurte ums Kaninchen (Brust + Bauch), Rückensteg, D-Ring oben (Leinen-Punkt body-lokal RING)
  const RING = V(-.0, .5, 0);
  function addHarness(B) { const m = M(PINK, { roughness: .55 }), steel = M(0xcfd6de, { metalness: .8, roughness: .25 }); const h = new T.Group(); B.body.add(h);
    for (const [x, y, ry, rz] of [[.14, .25, .2, .19], [-.06, .23, .25, .255]]) { const s = new T.Group(); s.position.set(x, y, 0); s.scale.set(.28, ry, rz); s.rotation.y = 0; h.add(s);
      const tor = new T.Mesh(new T.TorusGeometry(1, .09, 10, 36), m); tor.rotation.y = PI / 2; tor.castShadow = true; s.add(tor); }
    h.add(mesh(BOX, m, .04, .465, 0, .24, .03, .07));
    const ring = new T.Mesh(new T.TorusGeometry(.03, .009, 8, 20), steel); ring.position.set(RING.x, RING.y, 0); h.add(ring);
    B.harness = h; return h; }
  function ringOf(B) { B.root.updateMatrixWorld(true); return B.body.localToWorld(RING.clone()); }
  // Leine: gebogene Röhre zwischen zwei Punkten, sag = Durchhang (0 = straff)
  function makeLeash() { const root = new T.Group(); const m = M(0xc2185b, { roughness: .5 }); const tube = new T.Mesh(new T.BufferGeometry(), m); tube.castShadow = true; root.add(tube); return { root, tube }; }
  function leashBetween(Ls, a, b, sag) { const mid = a.clone().add(b).multiplyScalar(.5); mid.y -= sag || 0; const c = new T.QuadraticBezierCurve3(a, mid, b);
    Ls.tube.geometry.dispose(); Ls.tube.geometry = new T.TubeGeometry(c, 24, .014, 6, false); Ls.root.visible = true; }
  // Karton-Versteck mit dunklem Eingangsloch (Loch zeigt nach -x)
  function makeBox() { const root = new T.Group(); const c = M(0xc9955a, { roughness: .9 }), d = M(0x3a2414, { roughness: .9 });
    root.add(mesh(BOX, c, 0, .26, 0, .62, .52, .55)); root.add(mesh(BOX, M(0xb4834b, { roughness: .9 }), 0, .53, 0, .66, .04, .58));
    const hole = sph(d, -.31, .2, 0, .02, .16, .15); root.add(hole); return { root }; }
  function makeStake() { const root = new T.Group(); const w = M(0x8a5a2b, { roughness: .85 }); root.add(mesh(CYL, w, 0, .25, 0, .04, .5, .04)); root.add(sph(w, 0, .5, 0, .05)); return { root }; }
  // rundes Gehege: Pfosten + zwei Rundlatten, Haken an einem Pfosten (hook2) für das abgelegte Geschirr
  function makePen() { const root = new T.Group(); const w = M(0xd9a066, { roughness: .85 }), r = 1.45;
    for (let i = 0; i < 20; i++) { const a = i / 20 * 2 * PI; root.add(mesh(BOX, w, Math.cos(a) * r, .26, Math.sin(a) * r, .06, .52, .06)); }
    for (const y of [.2, .45]) { const t = new T.Mesh(new T.TorusGeometry(r, .025, 8, 64), w); t.rotation.x = PI / 2; t.position.y = y; root.add(t); }
    return { root }; }
  function makeHung() { const root = new T.Group(); const m = M(PINK, { roughness: .55 }); const t = new T.Mesh(new T.TorusGeometry(.12, .02, 8, 24), m); root.add(t);
    const t2 = new T.Mesh(new T.TorusGeometry(.15, .02, 8, 24), m); t2.position.set(0, -.12, 0); root.add(t2); return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Hoppel"); addHarness(bun);
    leash = actor(makeLeash(), "Leine"); box = actor(makeBox(), "Karton"); stake = actor(makeStake(), "Pflock"); pen = actor(makePen(), "Gehege"); hook2 = actor(makeHung(), "Geschirr");
    for (const a of [leash, stake, pen, hook2]) { a.noCheck = true; a.noBlob = true; }
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) dogHouse = m; });
  });
  function reset() { if (dogHouse) dogHouse.position.set(-2.4, 0, -2.2); rudi.noCheck = false; rudi.body.position.set(0, 0, 0); rudi.root.rotation.set(0, 0, 0);
    bun.root.rotation.set(0, 0, 0); bun.root.position.set(0, 0, 0); bun.noCheck = false; bun.harness.visible = true; leash.root.visible = false; }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.64, 0)); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  // Fernglas-Maske (2D): alles schwarz außer zwei überlappenden Kreisen, dazu ● REC
  let maskCv = null;
  function binoculars(t, a) { if (!maskCv) { maskCv = document.createElement("canvas"); maskCv.width = W; maskCv.height = H; const m = maskCv.getContext("2d");
      m.fillStyle = "#05060c"; m.fillRect(0, 0, W, H); m.globalCompositeOperation = "destination-out"; const cy = H * .44, r = 330;
      for (const dx of [-150, 150]) { m.beginPath(); m.arc(W * .42 + dx, cy, r, 0, 2 * PI); m.fill(); } }
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.drawImage(maskCv, 0, 0); if (Math.sin(t * 6) > -.3) { g.fillStyle = "#e5484d"; g.beginPath(); g.arc(110, 210, 16, 0, 7); g.fill(); }
    g.fillStyle = "#ffffff"; g.font = '900 40px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("REC", 140, 212);
    g.font = '800 34px "Montserrat"'; g.fillStyle = "#ffd23f"; g.fillText(L("WILDLIFE FILM · DAY 1", "TIERDOKU · TAG 1"), 96, 270); g.restore(); }
  // Sprechblase (2D) mit Spitze nach unten
  function bubble(x, y, s, p, col) { if (p <= 0) return; const k = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k); g.rotate(-.06);
    g.font = '900 60px "Montserrat"'; const w = g.measureText(s).width + 60; g.fillStyle = "#ffffff"; g.strokeStyle = "#1d2250"; g.lineWidth = 6;
    g.beginPath(); g.roundRect(-w / 2, -55, w, 100, 30); g.moveTo(-20, 44); g.lineTo(-40, 90); g.lineTo(10, 44); g.fill(); g.stroke();
    g.fillStyle = col || "#e5484d"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, -4); g.restore(); }

  // ---------- Shots ----------
  // Hook: Hoppel hockt platt und stur auf dem Rasen, Leine straff nach rechts aus dem Bild, böser Blick in die Kamera, Stempel NÖ!
  function hookFrame(t, ph) {
    at(bun, 0, 0, 0, -2.0); poseBunny(bun, t, { angry: true, ears: .55, lean: -.12, sc: 1.35, lid: .15, lookAt: V(-3, .7, 2.5) });
    const r = ringOf(bun); leashBetween(leash, r, V(3.2, 1.2, -.4), .02);
    frameOn([bun], { az: lerp(.12, .2, ph), el: .14, fill: lerp(.82, .9, ph), t }); draw(); }
  KZ.shot("lHook", (lt, d, t) => { inYard(); hookFrame(t, lt / d);
    stamp(L("NOPE!", "NÖ!"), W * .66, H * .5, (lt + .02) / .25, "#e5484d", -.07); });
  // 1 Tierdoku: Rudi schreitet stolz mit Leine durch den Garten, Hoppel hoppelt widerwillig hinterher; Fernglas-Maske
  KZ.shot("lDoku", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    const rx = lerp(-.1, .45, ph); place(rudi, rx, .1, -.35); poseRudi(rudi, t, { arms: [.15, -.35], spread: .05, walk: .8, mouth: "smile", nod: .06 });
    const hopP = Math.max(0, Math.sin(t * 5)); at(bun, rx - 1.05, 0, .45, -.3); poseBunny(bun, t, { hop: hopP * .5, ears: .5, sad: true, sc: 1.35 });
    leashBetween(leash, ringOf(bun), hand(1), .12);
    frameOn([rudi, bun], { az: lerp(.75, .65, k), el: .14, fill: lerp(.84, .9, k), dy: -.1, t }); draw();
    binoculars(t, 1); });
  // 2 Rate-Frage: Rudi steht mit Leine, Hoppel knabbert Gras (sitzt), Kacheln
  KZ.shot("lQuiz", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    rudi.root.visible = false;
    at(bun, 0, 0, 0, -.8); poseBunny(bun, t, { nod: -.35, lean: -.06, chew: true, sc: 1.35, lid: .2, lookAt: V(2, .3, 1) });
    leashBetween(leash, ringOf(bun), V(2.6, 1.3, .6), .3);
    frameOn([bun], { az: lerp(-.25, -.15, k), el: .16, fill: lerp(.5, .55, k), dy: -.5, t }); draw();
    txt(L("WHEN DO THEY RUN?", "WANN RENNEN SIE?"), W * .42, H * .2, 56, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .56, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Bellen: WUFF aus der Hundehütte, Hoppel flitzt los, Leine straff -> Ruck, Rudi kippt nach vorn, Stempel STRESS!
  KZ.shot("lBark", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    const run = sm(clamp((ph - .2) / .3, 0, 1)), stop = ph > .5, jerk = stop ? Math.exp(-(ph - .5) * 14) * Math.sin((ph - .5) * 60) * .06 : 0;
    place(rudi, -.8 + (stop ? .12 * sm(clamp((ph - .5) * 6, 0, 1)) : 0), -.35, -.25); poseRudi(rudi, t, { arms: [.2, stop ? .9 : .45], spread: .05, mouth: stop ? "o" : "smile", wide: stop, lean: stop ? -.25 : 0 });
    at(bun, lerp(.35, 1.15, run) - jerk, 0, .3, -.15); poseBunny(bun, t, { hop: run > 0 && run < 1 ? Math.abs(Math.sin(t * 12)) * .9 : 0, ears: .9, wide: ph > .15, sc: 1.35, lean: stop ? -.15 : 0, lookAt: V(-1.75, .5, -1.2) });
    leashBetween(leash, ringOf(bun), hand(1), stop ? 0 : lerp(.3, .02, run));
    dogHouse.position.set(-1.75, 0, -1.2);
    frameOn([rudi, bun, FR(-2.15, 0, -1.6, -1.35, .9, -.8)], { az: lerp(.3, .38, k), el: .15, fill: lerp(.92, .98, k), dy: -.1, t }); draw();
    const [hx, hy] = scr(V(-1.75, 1.2, -1.2)); bubble(clamp(hx, 230, 700), clamp(hy - 120, 330, 900), L("WOOF!", "WUFF!"), (lt - .05) / .25);
    stamp("STRESS!", W * .42, H * .17, (ph - .52) * d / .25, "#e5484d", .06); });
  // 4 Joggen: Rudi joggt, Hoppel sprintet kurz vorneweg und legt sich dann hin; Rudi läuft weiter -> Leine straff, Stempel PARKT.
  KZ.shot("lJog", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    const rx = lerp(-1.3, 1.5, sm(clamp(ph / .72, 0, 1))), stopped = ph > .72;
    place(rudi, rx, -.45, -.15); poseRudi(rudi, t, { arms: [.7 * Math.sin(t * 8), stopped ? -.6 : -.3], spread: .05, walk: stopped ? 0 : 1.4, mouth: stopped ? "o" : "smile", lean: stopped ? -.2 : .08 });
    const sp = sm(clamp(ph / .32, 0, 1)), parked = ph > .32; at(bun, lerp(-.6, .65, sp), 0, .4, -.2);
    poseBunny(bun, t, parked ? { lid: .55, ears: 1, sc: 1.2, lean: -.05, nod: -.1 } : { hop: Math.abs(Math.sin(t * 12)) * .9, ears: .7, sc: 1.2 });
    if (parked) bun.body.position.y = -.05;
    leashBetween(leash, ringOf(bun), hand(1), stopped ? 0 : clamp(.35 - Math.max(0, rx - .7) * .5, 0, .35));
    frameOn([rudi, bun], { az: lerp(.4, .5, k), el: .15, fill: lerp(.84, .88, k), dy: -.15, t }); draw();
    stamp(L("PARKED.", "PARKT."), W * .42, H * .17, (ph - .62) * d / .25, "#2f6fd0", -.06); });
  // 5 Auflösung: Kacheln mit Haken, dann RWAF-Karte; Hoppel macht Freudensprünge im Studio (ohne Geschirr)
  KZ.shot("lReveal", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    bun.harness.visible = false; const bk = Math.max(0, Math.sin(t * 5)); at(bun, 0, bk * .25, 0, -.5); poseBunny(bun, t, { hop: bk * .8, happy: true, ears: .2, sc: 1.4, lookAt: V(2.5, .6, 1.2) }); bun.body.rotation.x = Math.sin(t * 5) * .25;
    frameOn([bun, FR(-.4, 0, -.3, .4, .9, .3)], { az: lerp(.3, .2, k), el: .15, fill: lerp(.55, .6, k), dy: -.45, t }); draw();
    stamp(L("DAWN & DUSK!", "DÄMMERUNG!"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph < .45) quizTiles(W * .42, H * .56, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 1 });
    else infoCard(W * .42, H * .58, 900, 230, sm((ph - .45) * d / .35), "RWAF", "#36b37e", [L("“They run in short,", "„Sie rennen in kurzen,"), L("rapid bursts.”", "schnellen Sprints.“")], 42); });
  // 6 Verstecken: Hoppel will in den Karton, Leine am Pflock hält ihn zurück (wippt hin und her), RSPCA-Karte
  KZ.shot("lHide", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(stake, -1.25, 0, 0); place(box, 1.0, 0, 0); box.root.rotation.y = 0;
    const tug = Math.max(0, Math.sin(t * 4.5)); at(bun, -.05 + tug * .08, 0, 0, -.4); poseBunny(bun, t, { hop: tug * .6, ears: .9, wide: true, sc: 1.2, lean: -tug * .1, lookAt: V(1, .3, 0) });
    leashBetween(leash, ringOf(bun), V(-1.25, .45, 0), tug > .5 ? 0 : .08);
    frameOn([stake, bun, box], { az: lerp(.15, .25, k), el: .16, fill: lerp(.84, .88, k), dy: -.75, t }); draw();
    bun.root.updateMatrixWorld(true); const [bx, by] = scr(V(1.0, .9, 0));
    stamp("✗", clamp(bx, 200, 820), by, (lt - .4) / .3, "#e5484d", .06);
    infoCard(W * .42, H * .58, 900, 230, sm((ph - .3) * d / .35), "RSPCA", "#e5484d",
      [L("Scared rabbits run and hide.", "Mit Angst flüchten sie ins Versteck."), L("A lead stops that = stress.", "Die Leine verhindert das = Stress.")], 38); });
  // 7 Tipp: großes rundes Gehege, Hoppel ohne Geschirr flitzt im Kreis mit Freudensprüngen, Karton drin, Geschirr hängt am Zaun, Rudi lehnt draußen
  KZ.shot("lTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(pen, 0, 0, 0); place(box, -.85, -.7, .6); box.root.scale.setScalar(.8);
    hook2.root.visible = true; hook2.root.position.set(1.45 * Math.cos(-.5), .55, 1.45 * Math.sin(-.5) * -1); hook2.root.rotation.set(0, -.5, 0);
    bun.harness.visible = false; const a = t * 1.6, bk = Math.abs(Math.sin(t * 7)); at(bun, Math.cos(a) * .4 + .35, bk * .12, Math.sin(a) * .4 + .35, -a - PI / 2);
    poseBunny(bun, t, { hop: bk * .9, happy: true, ears: .3, sc: 1.45 });
    rudi.root.visible = false;
    frameOn([pen], { az: lerp(.3, .38, k), el: lerp(.42, .38, k), fill: lerp(1.12, 1.2, k), dy: -.25, t }); draw();
    stamp(L("FREE!", "FREI!"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    infoCard(W * .42, H * .6, 900, 220, sm((ph - .4) * d / .35), L("TIP", "TIPP"), "#36b37e",
      [L("Big safe run, open 24/7", "Großes Gehege, rund um die Uhr offen"), L("RWAF: no harness walks", "RWAF: keine Gassi-Runden")], 40);
    box.root.scale.setScalar(1); });
  // 8 Loop: zurück zur Hook-Einstellung
  KZ.shot("lLoop", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, 1 - ph * .9);
    if (ph > .3) stamp(L("THAT LEASH...", "DIESE LEINE..."), W * .42, H * .12, (ph - .3) * d / .3, "#e5484d", -.06); });

  window.__bunnyLeash = true;
})();
