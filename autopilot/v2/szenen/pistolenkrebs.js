// Beispiel-Szenendatei für den Autopiloten: Pistolenkrebs. Zeigt, wie man mit window.KZ eigene Figuren und Shots baut.
// Regeln: flache Formen mit 2-3 Tönen (hell oben, dunkel unten), dicke weiche Kanten, große Augen mit Glanzpunkt,
// leuchtende Effekte mit globalCompositeOperation "lighter", Kamera immer in Bewegung (cam), Figuren atmen/wippen.
(function () {
  const { g, W, H, sm, lerp, clamp, reef, cam, glow, label, kshape } = window.KZ;

  // Krebs in Seitenansicht, schaut nach rechts, Länge ~300, Bauch bei y=0. o: {t, snap (0..1 Schere schließt), cock (Schere offen)}
  function shrimp(c, o) {
    const t = o.t, br = Math.sin(t * 3) * 3;
    // Beine
    c.strokeStyle = "#c2412f"; c.lineWidth = 7; c.lineCap = "round";
    for (let i = 0; i < 5; i++) { const x = -40 + i * 34, w = Math.sin(t * 8 + i) * 6; c.beginPath(); c.moveTo(x, -10); c.lineTo(x + 8 + w, 34); c.stroke(); }
    // Schwanzfächer
    c.fillStyle = "#e0553c"; c.beginPath(); c.moveTo(-150, -30); c.lineTo(-215, -70 + br); c.lineTo(-225, 0); c.lineTo(-150, -8); c.fill();
    // Körper-Segmente (Verlauf hell oben -> dunkel unten)
    // jede Form mit kshape: Grundfarbe + harter Schatten unten links + Lichtsaum oben rechts
    for (let i = 0; i < 5; i++) kshape(c, (c) => { c.beginPath(); c.ellipse(-130 + i * 34, -40 - Math.sin(i * .7) * 8, 34, 38 - i, 0, 0, 7); }, ["#e2492f", "#e8532f", "#ee5d31", "#f26834", "#f57338"][i], { rim: "rgba(255,210,170,.8)", rw: 5, sw: 12 });
    kshape(c, (c) => { c.beginPath(); c.ellipse(70, -52, 80, 50, -.08, 0, 7); }, "#f47a3d", { rim: "rgba(255,215,175,.85)", rw: 6, sw: 18 });
    c.fillStyle = "rgba(255,220,190,.35)"; c.beginPath(); c.ellipse(60, -78, 55, 14, -.1, 0, 7); c.fill();
    // Fühler
    c.strokeStyle = "#ff9d73"; c.lineWidth = 4; for (const k of [0, 1]) { c.beginPath(); c.moveTo(140, -70); c.quadraticCurveTo(230, -150 - k * 30 + br * 2, 320, -120 - k * 60); c.stroke(); }
    // Auge
    c.fillStyle = "#fff"; c.beginPath(); c.arc(132, -84, 17, 0, 7); c.fill(); c.fillStyle = "#14213d"; c.beginPath(); c.arc(137, -84, 10, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(141, -88, 3.5, 0, 7); c.fill();
    // Riesenschere: Arm + Unterteil + beweglicher Finger
    const open = o.cock ?? .8, close = sm(o.snap || 0), ang = lerp(-.9 * open, 0, close);
    c.save(); c.translate(120, -20);
    kshape(c, (c) => { c.beginPath(); c.ellipse(70, 0, 90, 46, .05, 0, 7); }, "#f0683a", { rim: "rgba(255,215,175,.85)", rw: 6, sw: 18 });
    c.fillStyle = "#b52e25"; c.beginPath(); c.moveTo(140, 10); c.lineTo(230, 24); c.lineTo(150, 40); c.fill();
    c.save(); c.translate(140, -14); c.rotate(ang); c.fillStyle = "#e9573a"; c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(70, -30, 96, 6); c.lineTo(0, 14); c.fill(); c.restore();
    c.restore();
  }
  // Leuchtende Kavitationsblase + Lichtblitz (Wert p 0..1 ab dem Knall)
  function pop(x, y, p) {
    g.save(); g.globalCompositeOperation = "lighter";
    const r = lerp(10, 140, sm(p / .25)) * (1 - sm((p - .3) / .4));
    glow(x, y, r * 2.5, `rgba(255,240,180,${.9 * (1 - p)})`);
    g.strokeStyle = `rgba(220,250,255,${1 - p})`; g.lineWidth = 6; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28, d = 30 + p * 260; g.fillStyle = `rgba(200,245,255,${.8 * (1 - p)})`; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 6 * (1 - p), 0, 7); g.fill(); }
    g.restore();
  }
  function at(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, s); shrimp(g, o); g.restore(); }

  KZ.shot("krebsHook", (lt, d, t) => { reef(t, t * 20, 0, 1); const k = sm(lt / d); cam(lerp(120, 260, k), -20, lerp(2.2, 3.2, k)); at(0, Math.sin(t * 1.5) * 4, 1, { t, cock: 1 }); });
  KZ.shot("krebsSnap", (lt, d, t) => { reef(t, 0, 0, 1); const s = clamp((lt - d * .45) / .06, 0, 1), p = clamp((lt - d * .45) / (d * .5), 0, 1);
    const shake = lt > d * .45 && lt < d * .6 ? Math.sin(lt * 90) * 6 : 0; cam(330 + shake, -10, lerp(3.4, 4, sm(lt / d)));
    at(0, 0, 1, { t, cock: 1, snap: s }); if (s > 0) pop(390, -10, p); if (lt > d * .5) label("BANG!", W * .5, H * .24, sm((lt - d * .5) / .2)); });
  KZ.shot("krebsHeat", (lt, d, t) => { reef(t, 0, 0, 1); cam(390, -10, lerp(5, 7, sm(lt / d))); at(0, 0, 1, { t, snap: 1 }); pop(390, -10, .08 + .04 * Math.sin(t * 20));
    label("4,700 °C", W * .5, H * .24, sm(lt / .3)); });
})();
