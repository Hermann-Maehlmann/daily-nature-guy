// Figuren-Bibliothek: fertige Grundfiguren im festen Stil (flach, Lichtsaum, harter Schatten, große Augen).
// Wird nach anim2d.js geladen und hängt sich an window.KZ.fig. Alle Figuren: Seitenansicht, Kopf nach +x, Länge ~400, Boden/Bauch bei y≈0.
// Aufruf in einer Szenendatei: KZ.fig.insect(g, { t, walk: 1, pal: { body: "#3a7d44" }, wings: true })
// Gemeinsame Optionen: t (Zeit), pal (Farben überschreiben), look (Pupille -1..1), mood ("happy" | "angry" | "scared"), s (Größe).
// Neue gelungene Figuren hier ergänzen (Hermann 10.11.2026: jedes Tier soll ausgefeilt aussehen).
(function () {
  const K = window.KZ, { kshape, sm, lerp, clamp } = K;
  const P = (o, def) => Object.assign({}, def, o.pal || {});
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  function shade(c, path, col, o) { kshape(c, path, col, Object.assign({ rim: "rgba(255,255,255,.32)", shadow: "rgba(20,0,50,.25)", rw: 6, sw: 14 }, o)); }
  // Auge mit Glanzpunkt und Blinzeln, mood biegt das Lid
  function eye(c, x, y, r, o) {
    const t = o.t || 0, ph = (o.seed || 0) * 1.7;
    const bl = Math.sin(t * 1.9 + 2.2 + ph) > .985 ? .12 : 1, look = o.look || 0;
    c.save(); c.translate(x, y); c.scale(1, bl);
    c.fillStyle = "#fff"; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
    c.fillStyle = "#12142b"; c.beginPath(); c.arc(r * .2 + look * r * .25, r * .05, r * .58, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(r * .02 + look * r * .2, -r * .2, r * .2, 0, 7); c.fill(); c.beginPath(); c.arc(r * .42, r * .3, r * .09, 0, 7); c.fill();
    if (o.mood === "angry" || o.mood === "scared") { c.fillStyle = o.lid || "#000"; c.beginPath(); const a = o.mood === "angry" ? 1 : -1;
      c.moveTo(-r * 1.2, -r * (1.2 - .5 * a)); c.lineTo(r * 1.2, -r * (1.2 + .5 * a)); c.lineTo(r * 1.2, -r * 1.6); c.lineTo(-r * 1.2, -r * 1.6); c.fill(); }
    c.restore();
  }
  // Gliederbein (Insekt/Spinne): Knie nach oben-außen, Fuß auf dem Boden (y=0). ph = Laufphase, dir = +1 nach vorn / -1 nach hinten
  function legA(c, x, y, reach, ph, col, w, dir) {
    const sw = Math.sin(ph) * 22, lift = Math.max(0, Math.cos(ph)) * 16;
    const kx = x + dir * reach * .75 + sw * .4, ky = -reach * .65 - lift * .5, fx = x + dir * reach * 1.15 + sw, fy = -lift;
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(x, y); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
  }
  // Säugetier-Bein: dick, Pfote unten (y=0)
  function legM(c, x, y, ph, col, w, paw) {
    const sw = Math.sin(ph) * .32, lift = Math.max(0, Math.cos(ph)) * 14, l = -y;
    const kx = x + Math.sin(sw) * l * .5, ky = y + l * .5 - lift * .5, fx = x + Math.sin(sw) * l * .9, fy = -lift;
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(kx, ky, fx, fy); c.stroke();
    c.fillStyle = paw || col; c.beginPath(); c.ellipse(fx + 8, fy - 2, w * .7, w * .42, 0, 0, 7); c.fill();
  }
  const leg = legA;

  const fig = {};

  // ---------- Fisch ----------
  fig.fish = function (c, o) {
    const p = P(o, { body: "#2fa7d6", belly: "#bfefff", fin: "#ffb13b", dark: "#1a6f9e", stripe: null }), t = o.t || 0, fl = Math.sin(t * 6.5);
    const L = o.len || 1, Hh = o.tall || 1;
    c.save(); c.scale(L, Hh);
    const body = (c) => { c.beginPath(); c.moveTo(-200, 0); c.bezierCurveTo(-120, -110, 120, -140, 190, -40); c.quadraticCurveTo(212, 0, 190, 30); c.bezierCurveTo(120, 120, -120, 100, -200, 0); c.closePath(); };
    // Schwanz
    c.save(); c.translate(-195, 0); c.scale(.75 + .25 * fl, 1); c.fillStyle = p.fin; c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(-60, -70, -110, -100); c.quadraticCurveTo(-80, 0, -110, 100); c.quadraticCurveTo(-60, 70, 0, 14); c.fill(); c.restore();
    // Rücken-/Bauchflosse
    c.fillStyle = p.fin; c.beginPath(); c.moveTo(-90, -78); c.quadraticCurveTo(-10, -170 - fl * 6, 70, -100); c.fill();
    c.beginPath(); c.moveTo(-60, 70); c.quadraticCurveTo(-30, 130, 20, 76); c.fill();
    shade(c, body, p.body, { rim: "rgba(255,255,255,.4)", sw: 22 });
    c.save(); body(c); c.clip();
    c.fillStyle = p.belly; c.beginPath(); c.moveTo(-220, 30); c.bezierCurveTo(-60, 50, 100, 40, 230, 0); c.lineTo(230, 200); c.lineTo(-220, 200); c.fill();
    if (p.stripe) { c.fillStyle = p.stripe; for (const x of [-110, -20, 70]) { c.beginPath(); c.ellipse(x, -10, 18, 130, .1, 0, 7); c.fill(); } }
    c.strokeStyle = "rgba(0,0,0,.18)"; c.lineWidth = 6; c.beginPath(); c.moveTo(110, -80); c.quadraticCurveTo(90, 0, 115, 70); c.stroke();
    c.restore();
    // Brustflosse
    c.save(); c.translate(80, 20); c.rotate(-.3 + Math.sin(t * 4) * .2); c.fillStyle = p.fin; c.globalAlpha = .9; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-50, -30, -80, 10); c.quadraticCurveTo(-40, 30, 0, 10); c.fill(); c.restore();
    eye(c, 140, -40, 26, o);
    c.fillStyle = p.dark; c.beginPath(); c.ellipse(198, 8, 7, 4 + (o.mouth || .3) * 14, 0, 0, 7); c.fill();
    c.restore();
  };

  // ---------- Insekt (Käfer, Ameise, Wespe, Heuschrecke …) ----------
  fig.insect = function (c, o) {
    const p = P(o, { body: "#3a7d44", head: null, legs: "#1f3b26", wing: "rgba(200,235,255,.22)", accent: "#a7e36b" }), t = o.t || 0;
    const wk = (o.walk ?? 0) * t * 10, ant = o.ant ? 1 : 0; // ant: schmale Taille
    const abd = ell(-120, -70, ant ? 95 : 130, ant ? 62 : 85, -.08), tho = ell(15, -80, ant ? 45 : 70, ant ? 38 : 60), hd = ell(110, -88, 52, 46, .1);
    // Beine (3 Paare, hinteres Set dunkler)
    const LD = [[-40, -1, 130], [10, 1, 90], [50, 1, 125]]; // hinten, Mitte, vorn
    LD.forEach(([x, d, r], i) => legA(c, x + 12, -140, r * .9, wk + i * 2.1 + Math.PI, "rgba(0,0,0,.3)", 10, d));
    LD.forEach(([x, d, r], i) => legA(c, x, -135, r, wk + i * 2.1, p.legs, 12, d));
    c.save(); c.translate(0, -85);
    shade(c, abd, p.body, { sw: 20 });
    c.save(); abd(c); c.clip(); c.strokeStyle = "rgba(0,0,0,.18)"; c.lineWidth = 7; for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(-120 - k * 30, -70, 20, 100, 0, -1.4, 1.4); c.stroke(); } c.restore();
    if (o.stripes) { c.save(); abd(c); c.clip(); c.fillStyle = p.accent; for (let k = 0; k < 3; k++) c.fillRect(-200 + k * 55, -170, 24, 200); c.restore(); }
    shade(c, tho, p.body, { sw: 16 });
    shade(c, hd, p.head || p.body, { sw: 14 });
    // Fühler
    c.strokeStyle = p.legs; c.lineWidth = 6; c.lineCap = "round";
    for (const k of [0, 1]) { const w = Math.sin(t * 3 + k) * 8; c.beginPath(); c.moveTo(130, -125); c.quadraticCurveTo(170 + k * 10, -200 + w, 215 + k * 18, -210 - k * 18 + w); c.stroke(); }
    // Mundwerkzeuge
    if (o.jaws !== false) { const j = (o.bite || 0) * .4 + Math.sin(t * 5) * .05; c.fillStyle = p.legs; for (const s of [-1, 1]) { c.save(); c.translate(155, -70); c.rotate(s * (.35 - j)); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(30, s * 4, 38, s * 16); c.lineTo(10, s * 10); c.fill(); c.restore(); } }
    eye(c, 128, -98, 18, o);
    // Flügel (offen + Schwirren)
    if (o.wings) { const f = o.fly ? Math.sin(t * 60) : 0; c.save(); c.globalCompositeOperation = "lighter"; c.fillStyle = p.wing;
      for (const k of [0, 1]) { c.save(); c.translate(-10, -130); c.rotate(-.5 - k * .3 + f * .5); c.beginPath(); c.ellipse(-110, 0, 130, 40, 0, 0, 7); c.fill(); c.restore(); } c.restore(); }
    c.restore();
  };

  // ---------- Vogel ----------
  fig.bird = function (c, o) {
    const p = P(o, { body: "#f0a33a", belly: "#ffe3a8", wing: "#c9702a", beak: "#ffcf3d", legs: "#e07b39" }), t = o.t || 0;
    const fl = o.fly ? Math.sin(t * 14) : Math.sin(t * 2) * .08, bob = o.fly ? 0 : Math.sin(t * 3) * 3;
    c.save(); c.translate(0, bob);
    if (!o.fly) for (const s of [0, 1]) { c.strokeStyle = p.legs; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); c.moveTo(-10 + s * 34, -40); c.lineTo(-14 + s * 34, 0); c.lineTo(10 + s * 34, 4); c.stroke(); }
    c.fillStyle = p.wing; c.beginPath(); c.moveTo(-120, -120); c.lineTo(-230, -150); c.lineTo(-215, -100); c.fill(); // Schwanz
    const body = ell(-20, -130, 135, 95, -.12), head = ell(110, -215, 68, 64);
    shade(c, body, p.body, { sw: 22 });
    c.save(); body(c); c.clip(); c.fillStyle = p.belly; c.beginPath(); c.ellipse(20, -70, 110, 70, -.2, 0, 7); c.fill(); c.restore();
    shade(c, head, p.body, { sw: 16 });
    // Schnabel
    const op = (o.beakOpen || 0) * .35; c.fillStyle = p.beak;
    c.save(); c.translate(168, -210); c.rotate(-op); c.beginPath(); c.moveTo(0, -16); c.quadraticCurveTo(50, -6, 72, 6); c.lineTo(0, 6); c.fill(); c.restore();
    c.save(); c.translate(168, -206); c.rotate(op); c.beginPath(); c.moveTo(0, 2); c.lineTo(58, 8); c.lineTo(0, 18); c.fill(); c.restore();
    eye(c, 125, -228, 20, o);
    // Flügel
    c.save(); c.translate(-30, -150); c.rotate(-.15 - fl * .9);
    shade(c, (c) => { c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(-60, -40, -150, 10); c.quadraticCurveTo(-60, 50, 20, 30); c.closePath(); }, p.wing, { sw: 12 });
    c.restore(); c.restore();
  };

  // ---------- Säugetier (Vierbeiner: Fuchs, Maus, Katze, Bär …) ----------
  fig.mammal = function (c, o) {
    const p = P(o, { body: "#e8823a", belly: "#fff1dc", legs: "#a8521f", nose: "#2a1a1a", ear: "#ffb48a" }), t = o.t || 0;
    const wk = (o.walk ?? 0) * t * 9, ears = o.ears || "pointy", tail = o.tail ?? 1;
    // Schwanz
    if (tail) { c.save(); c.translate(-170, -150); c.rotate(-.5 + Math.sin(t * 3) * .15); shade(c, ell(-80, 0, 95 * tail, 34 * Math.max(.6, tail), -.2), p.body, { sw: 10 }); c.fillStyle = p.belly; c.beginPath(); c.ellipse(-160 * tail, -6, 26, 20, 0, 0, 7); c.fill(); c.restore(); }
    // hintere Beine
    for (const [x, ph] of [[-110, Math.PI], [95, 0]]) legM(c, x, -150, wk + ph + .7, p.legsBack || "#7d3c15", 34);
    const body = ell(-20, -160, 175, 78, -.04), head = ell(170, -220, 72, 62, .1), snout = ell(232, -196, 46, 30, .15);
    shade(c, body, p.body, { sw: 22 });
    c.save(); body(c); c.clip(); c.fillStyle = p.belly; c.beginPath(); c.ellipse(0, -90, 160, 40, 0, 0, 7); c.fill(); c.restore();
    for (const [x, ph] of [[-130, 0], [75, Math.PI]]) legM(c, x, -150, wk + ph, p.legs, 36);
    // Ohren
    c.fillStyle = p.body;
    if (ears === "round") for (const dx of [-30, 20]) { shade(c, ell(150 + dx, -282, 34, 32), p.body, { sw: 8 }); c.fillStyle = p.ear; c.beginPath(); c.arc(150 + dx, -282, 18, 0, 7); c.fill(); }
    else for (const dx of [-28, 16]) { shade(c, (c) => { c.beginPath(); c.moveTo(138 + dx, -262); c.lineTo(156 + dx, -335); c.lineTo(185 + dx, -258); c.closePath(); }, p.body, { sw: 8 }); c.fillStyle = p.ear; c.beginPath(); c.moveTo(150 + dx, -265); c.lineTo(160 + dx, -312); c.lineTo(175 + dx, -262); c.fill(); }
    shade(c, head, p.body, { sw: 16 });
    shade(c, snout, p.belly, { sw: 8, shadow: "rgba(60,20,0,.18)" });
    c.fillStyle = p.nose; c.beginPath(); c.ellipse(276, -205, 14, 11, 0, 0, 7); c.fill();
    if (o.mouth) { c.fillStyle = "#5a1020"; c.beginPath(); c.ellipse(240, -178, 22, 12 * o.mouth, 0, 0, Math.PI); c.fill(); }
    eye(c, 188, -238, 19, o);
  };

  // ---------- Krebs / Garnele ----------
  fig.crustacean = function (c, o) {
    const p = P(o, { body: "#f2683a", legs: "#c2412f", rim: "rgba(255,215,175,.85)" }), t = o.t || 0, br = Math.sin(t * 3) * 3;
    c.strokeStyle = p.legs; c.lineWidth = 8; c.lineCap = "round";
    for (let i = 0; i < 5; i++) { const x = -60 + i * 34, w = Math.sin(t * 8 * (o.walk ?? .3) + i) * 7; c.beginPath(); c.moveTo(x, -30); c.lineTo(x + 10 + w, 0); c.stroke(); }
    c.fillStyle = p.legs; c.beginPath(); c.moveTo(-170, -70); c.lineTo(-245, -110 + br); c.lineTo(-255, -30); c.lineTo(-170, -45); c.fill();
    for (let i = 0; i < 5; i++) shade(c, ell(-150 + i * 34, -70 - Math.sin(i * .7) * 8, 34, 38 - i), p.body, { rim: p.rim, rw: 5, sw: 12 });
    shade(c, ell(50, -82, 85, 52, -.08), p.body, { rim: p.rim, sw: 18 });
    c.strokeStyle = p.rim; c.lineWidth = 4; for (const k of [0, 1]) { c.beginPath(); c.moveTo(125, -100); c.quadraticCurveTo(220, -180 - k * 30 + br * 2, 310, -150 - k * 60); c.stroke(); }
    eye(c, 112, -116, 18, o);
    if (o.claw !== false) { const cl = sm(o.snap || 0), ang = lerp(-.8, 0, cl); c.save(); c.translate(110, -50);
      shade(c, ell(60, 0, 80 * (o.clawSize || 1), 40 * (o.clawSize || 1), .05), p.body, { rim: p.rim, sw: 16 });
      c.save(); c.translate(125, -12); c.rotate(ang); c.fillStyle = p.body; c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(60, -28, 84, 6); c.lineTo(0, 12); c.fill(); c.restore();
      c.fillStyle = p.legs; c.beginPath(); c.moveTo(125, 8); c.lineTo(205, 20); c.lineTo(132, 34); c.fill(); c.restore(); }
  };

  // ---------- Krake / Tintenfisch ----------
  fig.octopus = function (c, o) {
    const p = P(o, { body: "#e0558f", spots: "#f7a6c6", arm: "#c43f77" }), t = o.t || 0;
    for (let i = 0; i < 8; i++) { const bx = -110 + i * 32, ph = t * 2.4 + i * .8;
      c.strokeStyle = i % 2 ? p.arm : p.body; c.lineWidth = 30 - i % 2 * 4; c.lineCap = "round";
      c.beginPath(); c.moveTo(bx, -60); c.bezierCurveTo(bx + Math.sin(ph) * 40, 20, bx + Math.sin(ph + 1) * 70 - 20, 90, bx + Math.sin(ph + 2) * 60 - 40, 150); c.stroke(); }
    const mantle = (c) => { c.beginPath(); c.ellipse(10, -170, 150, 145 + Math.sin(t * 2) * 6, 0, 0, 7); };
    shade(c, mantle, p.body, { sw: 26 });
    c.save(); mantle(c); c.clip(); c.fillStyle = p.spots; for (const [x, y, r] of [[-60, -230, 18], [40, -270, 12], [-10, -200, 9], [70, -210, 14]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } c.restore();
    eye(c, -40, -110, 26, o); eye(c, 60, -110, 26, Object.assign({}, o, { seed: 1 }));
  };

  // ---------- Schlange / Wurm ----------
  fig.snake = function (c, o) {
    const p = P(o, { body: "#5fb34a", belly: "#d9f2a0", spots: "#2f7a33", tongue: "#e8344e" }), t = o.t || 0, n = 22, len = o.len || 520;
    const pts = []; for (let i = 0; i < n; i++) { const u = i / (n - 1), x = -len / 2 + u * len, y = Math.sin(u * 7 - t * 3) * 40 * (1 - u * .5) - 30; pts.push([x, y]); }
    for (let i = 0; i < n; i++) { const [x, y] = pts[i], r = 18 + Math.sin(i / (n - 1) * Math.PI) * 22; shade(c, ell(x, y, r * 1.1, r), i % 3 ? p.body : p.spots, { sw: 8, rw: 4 }); }
    const [hx, hy] = pts[n - 1]; shade(c, ell(hx + 30, hy - 6, 50, 34, .1), p.body, { sw: 12 });
    if (o.tongue !== false && Math.sin(t * 4) > .3) { c.strokeStyle = p.tongue; c.lineWidth = 5; c.beginPath(); c.moveTo(hx + 78, hy); c.lineTo(hx + 110, hy + 2); c.lineTo(hx + 122, hy - 8); c.moveTo(hx + 110, hy + 2); c.lineTo(hx + 122, hy + 10); c.stroke(); }
    eye(c, hx + 40, hy - 20, 14, o);
  };

  fig.eye = eye; fig.legA = legA; fig.legM = legM; fig.shade = shade; fig.ell = ell;
  K.fig = fig;
  window.__figReady = true;
})();
