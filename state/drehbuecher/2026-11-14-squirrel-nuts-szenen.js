// Szenendatei "Squirrels Don't Forget Their Nuts" (Grauhörnchen, Mix-Stil). Quellen: Scientific American 2023 (bis 3.000 Nüsse/Saison, Lisa Leaver Univ. Exeter Zitat),
// Macdonald 1997 Animal Behaviour (innerhalb 5 cm nach 20 Tagen), Delgado & Jacobs 2017 R. Soc. Open Sci. (Chunking nach Nussart), Smithsonian (Schein-Verstecke), Britannica (eher aufgegeben als vergessen), RSPCA (ungesalzene Nüsse).
// Helfer txt/stamp/navy/rudi/at aus clothes-moth übernommen (Rudi bleibt gleich). Hörnchen, Nüsse, Park neu gezeichnet.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86" };
  function txt(s, x, y, size, col, o) { o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = o.a ?? 1; g.font = `${o.w || 800} ${size}px "Montserrat"`; g.textAlign = o.align || "center"; g.textBaseline = "middle";
    if (o.stroke) { g.lineJoin = "round"; g.lineWidth = o.stroke; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
  function stamp(s, x, y, p, col, rot) { if (p <= 0) return; p = Math.min(p, 1); const k = easeBack(p); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot ?? -.08); g.scale(k * (1 + (1 - p) * .6), k * (1 + (1 - p) * .6)); g.globalAlpha = clamp(p * 3, 0, 1);
    g.font = '900 64px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(s).width + 70;
    g.fillStyle = "rgba(10,10,30,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -50 + 10, w, 100, 22); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 22); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2 + 10, -40, w - 20, 80, 16); g.stroke();
    g.fillStyle = "#fff"; g.fillText(s, 0, 4); g.restore(); }
  function navy(t, tint) {
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, tint ? "#1b4a4a" : "#232a6b"); bg.addColorStop(1, tint ? "#0b2228" : "#0d1236"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.07)"; for (let y = 40; y < H; y += 60) for (let x = 30; x < W; x += 60) { g.beginPath(); g.arc(x + Math.sin(t * .5) * 6, y, 3, 0, 7); g.fill(); }
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .4, 700, tint ? "rgba(80,220,180,.18)" : "rgba(120,140,255,.2)"); g.restore();
  }
  function zoomScreen(z) { g.setTransform(z, 0, 0, z, W / 2 * (1 - z), H * .42 * (1 - z)); }
  function sparkle(x, y, r, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }
  function cross(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
  function check(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#7ef0b0"; g.lineWidth = 22; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-50, 0); g.lineTo(-14, 36); g.lineTo(54, -40); g.stroke(); g.restore(); }
  function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col || "#ff4d6d"; c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-18, -6, -8, -20, 0, -10); c.bezierCurveTo(8, -20, 18, -6, 0, 8); c.fill(); c.restore(); }
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save(); if (!o.armOnly) {
    const step = o.walk ? Math.sin(t * (o.slow ? 4 : 8)) * 18 : 0;
    if (o.sit) { c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; c.lineJoin = "round"; for (const x of [-20, 20]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 140, -122); c.lineTo(x + 146, -122 + o.sit - 16); c.stroke(); }
      c.fillStyle = "#2a2233"; for (const x of [-20, 20]) { c.beginPath(); c.ellipse(x + 162, -8 - 122 + o.sit, 30, 13, 0, 0, 7); c.fill(); } } else {
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4 + step * s, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.ellipse(x + 16 + step * s, -8, 30, 13, 0, 0, 7); c.fill(); } }
    const back = o.arm2 != null ? o.arm2 : null; // zweiter Arm (fuchteln)
    c.strokeStyle = C.coatD; c.lineWidth = 28; c.beginPath(); c.moveTo(-40, -330 + br);
    if (back != null) { const a = lerp(1.6, -2.4, back); c.lineTo(-40 + Math.cos(a) * 150, -330 + br + Math.sin(a) * 150); } else c.quadraticCurveTo(-74, -250, -54, -190); c.stroke();
    kshape(c, (c) => { c.beginPath(); c.moveTo(-82, -120); c.bezierCurveTo(-96, -260, -78, -350 + br, 0, -352 + br); c.bezierCurveTo(78, -350 + br, 96, -260, 82, -120); c.quadraticCurveTo(0, -100, -82, -120); c.closePath(); }, C.coat, { rim: "rgba(255,245,200,.7)", shadow: "rgba(90,40,10,.25)", rw: 7, sw: 22 });
    c.fillStyle = "#e09a22"; c.fillRect(-4, -340 + br, 8, 220); c.fillStyle = "#fff6"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(16, -300 + i * 60 + br, 6, 0, 7); c.fill(); }
    c.save(); c.translate(0, br);
    kshape(c, ell(6, -430, 80, 78, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 18 });
    c.fillStyle = "rgba(240,120,110,.35)"; c.beginPath(); c.ellipse(60, -400, 16, 10, 0, 0, 7); c.fill();
    kshape(c, (c) => { c.beginPath(); c.moveTo(-76, -440); c.bezierCurveTo(-80, -530, 90, -530, 86, -440); c.closePath(); }, C.hat, { rim: "rgba(255,200,200,.6)", rw: 5, sw: 12 });
    c.fillStyle = "#c23238"; c.beginPath(); c.roundRect(-80, -456, 168, 26, 13); c.fill();
    kshape(c, ell(4, -522, 20, 20, 0), "#fff1e8", { rw: 3, sw: 6 });
    fig.eye(c, 28, -418, 15, { t, seed: 3, look: o.look ?? .5, mood: o.mood }); fig.eye(c, 66, -418, 15, { t, seed: 3, look: o.look ?? .5, mood: o.mood });
    c.strokeStyle = "#7a2a2a"; c.lineWidth = 6; c.lineCap = "round"; c.fillStyle = "#7a2a2a";
    if (o.mouth === "o") { c.beginPath(); c.ellipse(52, -378, 10, 13, 0, 0, 7); c.fill(); }
    else if (o.mouth === "grin") { c.beginPath(); c.moveTo(30, -384); c.quadraticCurveTo(52, -350, 76, -386); c.closePath(); c.fill(); c.fillStyle = "#fff"; c.fillRect(36, -384, 34, 7); }
    else if (o.mouth === "hmm") { c.beginPath(); c.moveTo(36, -378); c.lineTo(70, -384); c.stroke(); }
    else if (o.mouth === "scream") { c.beginPath(); c.ellipse(52, -374, 16, 22, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(52, -392, 20, .3, 2.8); c.stroke(); }
    c.restore();
    }
    const sx = 30, sy = -330 + br; let hx, hy;
    if (arm >= 1.5) { const k = arm - 1.5; hx = lerp(80, -70, clamp(k * 2, 0, 1)); hy = lerp(-200, -470, clamp(k * 2, 0, 1)) + Math.sin(t * 14) * 6 * clamp(k * 2, 0, 1); }
    else { const a = lerp(1.35, -1.3, clamp(arm, 0, 1)); hx = sx + Math.cos(a) * 150; hy = sy + Math.sin(a) * 150; }
    if (o.hand) { hx = o.hand[0]; hy = o.hand[1]; }
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }

  function qmark(x, y, s, a) { if (a <= 0) return; txt("?", x, y, 110 * s, "#fff", { a, stroke: 14, w: 900 }); }
  function bubble(s, x, y, a, r) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(r || 0); g.scale(easeBack(Math.min(a, 1)), easeBack(Math.min(a, 1)));
    g.font = '800 50px "Montserrat"'; const w = g.measureText(s).width + 64; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 50); g.fill(); g.beginPath(); g.moveTo(-24, 42); g.lineTo(-44, 84); g.lineTo(8, 46); g.fill();
    g.fillStyle = "#1b1d3a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 2); g.restore(); }



  // ================= Farben =================
  const Q = { fur: "#8e89a6", furD: "#6c6788", warm: "#c0845a", belly: "#f4ead6", tail: "#8a84a3", fringe: "#ece6f6", nose: "#ff8fa3", claw: "#4a3a3a" };
  const N = { acorn: "#c98a3c", acornD: "#9a6526", cap: "#7a5230", walnut: "#d9b27a", walnutD: "#b08550", hazel: "#a8662e", hazelB: "#e6c38e", almond: "#c7864e" };
  const P = { grass: "#4f9a45", grassD: "#2f6a35", soil: "#6b3f2a", soilD: "#4a2a1c", trunk: "#6b3f2a", leafO: "#f08a2e", leafR: "#e0503a", leafY: "#f2c040" };

  // ================= Nüsse (Mitte 0,0, Größe ~60) =================
  function nut(c, type, x, y, s, rot) { c.save(); c.translate(x, y); c.rotate(rot || 0); c.scale(s, s);
    if (type === "acorn") { kshape(c, (c) => { c.beginPath(); c.moveTo(-26, -6); c.bezierCurveTo(-30, 30, -8, 46, 0, 50); c.bezierCurveTo(8, 46, 30, 30, 26, -6); c.closePath(); }, N.acorn, { rim: "rgba(255,230,180,.8)", shadow: "rgba(90,40,0,.3)", rw: 3, sw: 7 });
      kshape(c, (c) => { c.beginPath(); c.ellipse(0, -10, 32, 18, 0, 0, 7); }, N.cap, { rim: "rgba(220,180,140,.6)", rw: 3, sw: 5 });
      c.strokeStyle = "rgba(60,30,10,.45)"; c.lineWidth = 2.5; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 11 - 6, -22); c.lineTo(i * 11 + 6, 0); c.stroke(); }
      c.strokeStyle = N.cap; c.lineWidth = 6; c.lineCap = "round"; c.beginPath(); c.moveTo(0, -26); c.lineTo(4, -38); c.stroke(); }
    else if (type === "walnut") { kshape(c, ell(0, 0, 34, 30, 0), N.walnut, { rim: "rgba(255,240,210,.8)", shadow: "rgba(90,50,10,.3)", rw: 3, sw: 7 });
      c.strokeStyle = N.walnutD; c.lineWidth = 3.5; c.lineCap = "round"; c.beginPath(); c.moveTo(0, -30); c.lineTo(0, 30); c.stroke();
      for (const [a, b, d] of [[-20, -12, 8], [-24, 6, -6], [-12, 18, 6], [16, -14, -7], [22, 4, 7], [10, 18, -5]]) { c.beginPath(); c.moveTo(a - 6, b); c.quadraticCurveTo(a, b + d, a + 6, b); c.stroke(); } }
    else if (type === "hazel") { kshape(c, ell(0, 4, 30, 28, 0), N.hazel, { rim: "rgba(255,210,170,.8)", shadow: "rgba(70,30,0,.3)", rw: 3, sw: 7 });
      c.fillStyle = N.hazelB; c.beginPath(); c.ellipse(0, 26, 22, 9, 0, 0, 7); c.fill(); c.fillStyle = "rgba(255,230,200,.5)"; c.beginPath(); c.moveTo(0, -24); c.lineTo(-5, -32); c.lineTo(5, -32); c.fill();
      c.strokeStyle = "rgba(90,40,10,.35)"; c.lineWidth = 2.5; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 10, -20); c.quadraticCurveTo(i * 16, 0, i * 12, 18); c.stroke(); } }
    else if (type === "almond") { kshape(c, (c) => { c.beginPath(); c.moveTo(0, -34); c.bezierCurveTo(26, -20, 24, 26, 0, 32); c.bezierCurveTo(-24, 26, -26, -20, 0, -34); c.closePath(); }, N.almond, { rim: "rgba(255,225,190,.8)", shadow: "rgba(80,40,10,.3)", rw: 3, sw: 6 });
      c.fillStyle = "rgba(90,40,10,.3)"; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(-10 + (i * 7) % 20, -16 + i * 6, 2.2, 0, 7); c.fill(); } }
    else if (type === "peanut") { kshape(c, (c) => { c.beginPath(); c.moveTo(-16 + 18, -20); c.arc(-16, -14, 20, -.3, 6); c.moveTo(16 + 18, 14); c.arc(16, 14, 20, -.3, 6); c.moveTo(16, -4); c.lineTo(-4, 16); c.lineTo(-16, 6); c.lineTo(6, -14); c.closePath(); }, "#e7c08a", { rim: "rgba(255,240,210,.8)", rw: 3, sw: 6 });
      if (c.salt !== false) { c.fillStyle = "#fff"; for (let i = 0; i < 12; i++) { c.fillRect(-30 + (i * 23) % 56, -30 + (i * 37) % 56, 5, 5); } } }
    else if (type === "bread") { kshape(c, (c) => { c.beginPath(); c.moveTo(-34, 36); c.lineTo(-34, -6); c.bezierCurveTo(-50, -44, 50, -44, 34, -6); c.lineTo(34, 36); c.closePath(); }, "#c9853e", { rw: 3, sw: 6 });
      c.fillStyle = "#f7e2b0"; c.beginPath(); c.moveTo(-26, 30); c.lineTo(-26, -4); c.bezierCurveTo(-38, -34, 38, -34, 26, -4); c.lineTo(26, 30); c.closePath(); c.fill(); }
    c.restore(); }

  // ================= Grauhörnchen (seitlich, Kopf rechts, Boden y=0, Höhe ~360) =================
  // o: t, lean 0 (sitzt aufrecht) .. 1 (gräbt, Kopf unten), dig (Scharren), hold (Nussart in den Pfoten), mouth, look, mood, seed, dark (Dieb)
  function squirrel(c, o) { const t = o.t || 0, seed = o.seed || 0, L = clamp(o.lean || 0, 0, 1), br = Math.sin(t * 3 + seed) * 3;
    const fur = o.dark ? "#6f6886" : Q.fur, furD = o.dark ? "#4f4968" : Q.furD, tl = o.dark ? "#77708f" : Q.tail;
    const P2 = (a, b) => [lerp(a[0], b[0], L), lerp(a[1], b[1], L)];
    c.save(); c.lineCap = "round"; c.lineJoin = "round";
    // Schwanz: buschiges S hinter dem Körper
    const tw = Math.sin(t * 2.1 + seed) * 14;
    const T0 = P2([-60, -60], [-70, -90]), T1 = P2([-230, -90], [-230, -150]), T2 = P2([-250 + tw, -330], [-200 + tw, -330]), T3 = P2([-110 + tw, -390], [-60 + tw, -330]);
    const bz = (u) => { const v = 1 - u; return [v * v * v * T0[0] + 3 * v * v * u * T1[0] + 3 * v * u * u * T2[0] + u * u * u * T3[0], v * v * v * T0[1] + 3 * v * v * u * T1[1] + 3 * v * u * u * T2[1] + u * u * u * T3[1]]; };
    const rad = (u) => 30 + Math.sin(u * 3.0) * 44 - u * 6;
    const tailPath = (grow) => (c) => { const L1 = [], R1 = []; for (let i = 0; i <= 30; i++) { const u = i / 30, [x, y] = bz(u), [x2, y2] = bz(Math.min(1, u + .01)), [x0, y0] = bz(Math.max(0, u - .01));
        let nx = -(y2 - y0), ny = x2 - x0; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; const r = rad(u) + grow + Math.sin(u * 40) * 4; L1.push([x + nx * r, y + ny * r]); R1.push([x - nx * r, y - ny * r]); }
      c.beginPath(); c.moveTo(L1[0][0], L1[0][1]); L1.forEach(([x, y]) => c.lineTo(x, y)); const [ex, ey] = bz(1); c.arc(ex, ey, rad(1) + grow, Math.atan2(L1[30][1] - ey, L1[30][0] - ex), Math.atan2(R1[30][1] - ey, R1[30][0] - ex), false); for (let i = 30; i >= 0; i--) c.lineTo(R1[i][0], R1[i][1]); c.closePath(); };
    c.save(); c.fillStyle = Q.fringe; c.globalAlpha = .5; tailPath(12)(c); c.fill(); c.restore();
    kshape(c, tailPath(0), tl, { rim: "rgba(255,250,255,.6)", shadow: "rgba(40,30,70,.3)", rw: 6, sw: 18 });
    c.strokeStyle = "rgba(60,50,90,.35)"; c.lineWidth = 5; c.beginPath(); for (let i = 0; i <= 16; i++) { const [x, y] = bz(i / 16); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    // Hinterbein/Keule + langer Fuß
    kshape(c, ell(40, -10, 62, 15, 0), furD, { rw: 2, sw: 4 });
    kshape(c, ell(-14, -66, 82, 66, -.2), fur, { rim: "rgba(240,235,255,.7)", shadow: "rgba(40,30,70,.3)", rw: 5, sw: 14 });
    c.fillStyle = "rgba(192,132,90,.45)"; c.beginPath(); c.ellipse(0, -40, 50, 26, -.2, 0, 7); c.fill();
    // Rumpf
    const B = P2([22, -160], [30, -100]), rx = lerp(60, 98, L), ry = lerp(96, 60, L), rr = lerp(-.25, .35, L);
    kshape(c, ell(B[0], B[1] + br, rx, ry, rr), fur, { rim: "rgba(240,235,255,.75)", shadow: "rgba(40,30,70,.3)", rw: 6, sw: 16 });
    c.fillStyle = Q.belly; c.beginPath(); c.ellipse(B[0] + lerp(30, 6, L), B[1] + br + lerp(8, 36, L), rx * .5, ry * .72, rr, 0, 7); c.fill();
    // Vorderbeine + Pfoten
    const S0 = P2([62, -200], [92, -100]); let Pw = P2([112, -176], [160, -6]);
    if (o.dig) Pw = [Pw[0] + Math.sin(t * 22) * 22, Pw[1] - Math.max(0, Math.cos(t * 22)) * 22];
    c.strokeStyle = Q.warm; c.lineWidth = 22; c.beginPath(); c.moveTo(S0[0], S0[1] + br); c.quadraticCurveTo((S0[0] + Pw[0]) / 2 + 10, (S0[1] + Pw[1]) / 2 + 24, Pw[0], Pw[1] + (L < .5 ? br : 0)); c.stroke();
    c.fillStyle = Q.warm; c.beginPath(); c.ellipse(Pw[0] + 6, Pw[1] + (L < .5 ? br : 0), 15, 11, 0, 0, 7); c.fill();
    c.strokeStyle = Q.claw; c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(Pw[0] + 16, Pw[1] - 6 + i * 6 + (L < .5 ? br : 0)); c.lineTo(Pw[0] + 24, Pw[1] - 4 + i * 7 + (L < .5 ? br : 0)); c.stroke(); }
    if (o.hold) nut(c, o.hold, Pw[0] + 4, Pw[1] - 30 + (L < .5 ? br : 0), .75, .2);
    // Kopf
    const Hh = P2([72, -262], [140, -126]); c.save(); c.translate(Hh[0], Hh[1] + br); c.rotate(lerp(0, .55, L) + (o.tilt || 0));
    kshape(c, (c) => { c.beginPath(); c.moveTo(-34, -24); c.quadraticCurveTo(-36, -86, -6, -76); c.quadraticCurveTo(6, -50, 0, -34); c.closePath(); }, fur, { rim: "rgba(240,235,255,.8)", rw: 4, sw: 6 });
    c.fillStyle = "#e9a6b4"; c.beginPath(); c.moveTo(-26, -34); c.quadraticCurveTo(-28, -70, -12, -66); c.quadraticCurveTo(-6, -48, -10, -36); c.fill();
    kshape(c, ell(0, 0, 58, 50, 0), fur, { rim: "rgba(240,235,255,.85)", shadow: "rgba(40,30,70,.3)", rw: 6, sw: 12 });
    c.fillStyle = "rgba(192,132,90,.5)"; c.beginPath(); c.ellipse(-6, -30, 40, 16, -.1, 0, 7); c.fill();
    kshape(c, ell(46, 12, 38, 29, .1), fur, { rim: "rgba(240,235,255,.85)", rw: 4, sw: 8 });
    c.fillStyle = Q.belly; c.beginPath(); c.ellipse(34, 30, 34, 15, .1, 0, 7); c.fill();
    c.fillStyle = Q.belly; c.beginPath(); c.ellipse(16, -8, 23, 21, 0, 0, 7); c.fill();
    fig.eye(c, 18, -9, 16, { t, seed: seed + 4, look: o.look ?? .5, mood: o.mood });
    c.fillStyle = Q.nose; c.beginPath(); c.ellipse(82, 6, 11, 9, 0, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.6)"; c.beginPath(); c.arc(84, 2, 3, 0, 7); c.fill();
    c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 2.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(70, 16); c.lineTo(122, 4 + i * 14 + Math.sin(t * 6 + i) * 3); c.stroke(); }
    c.strokeStyle = "#3a2a3a"; c.fillStyle = "#3a2a3a"; c.lineWidth = 4;
    if (o.mouth === "o") { c.beginPath(); c.ellipse(64, 30, 7, 9, 0, 0, 7); c.fill(); }
    else if (o.mouth === "nut") { nut(c, "acorn", 74, 34, .55, -.4); }
    else if (o.mouth === "chew") { const ch = Math.sin(t * 18) * 3; c.beginPath(); c.moveTo(58, 26 + ch); c.quadraticCurveTo(68, 34, 76, 24); c.stroke(); }
    else { c.beginPath(); c.moveTo(56, 24); c.quadraticCurveTo(66, 34, 78, 22); c.stroke(); }
    c.restore();
    c.restore(); }
  function sqAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); squirrel(g, o); g.restore(); }

  // ================= Park (Boden y=0) =================
  function tree(x, s, t, col, col2) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-40, 0); c.quadraticCurveTo(-26, -200, -30, -420); c.lineTo(30, -420); c.quadraticCurveTo(26, -200, 40, 0); c.closePath(); }, P.trunk, { rim: "rgba(255,200,160,.5)", rw: 4, sw: 10 });
    g.strokeStyle = P.trunk; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(0, -300); g.lineTo(-110, -430); g.moveTo(0, -340); g.lineTo(100, -470); g.stroke();
    const sw = Math.sin(t * 1.1 + x) * 6; [[-130, -480, 150], [120, -520, 160], [0, -620, 190], [-60, -420, 120], [90, -410, 120]].forEach(([cx, cy, r], i) => kshape(g, ell(cx + sw, cy, r, r * .85, 0), i % 2 ? col2 : col, { rim: "rgba(255,230,170,.6)", shadow: "rgba(90,20,10,.25)", rw: 6, sw: 16 }));
    g.restore(); }
  function bush(x, s, col) { g.save(); g.translate(x, 0); g.scale(s, s); [[-70, -60, 80], [60, -60, 80], [0, -110, 100]].forEach(([cx, cy, r]) => kshape(g, ell(cx, cy, r, r * .8, 0), col || "#2f8a5a", { rim: "rgba(200,255,200,.5)", rw: 5, sw: 12 })); g.restore(); }
  function leaves(t, x0, x1, y0) { for (let i = 0; i < 26; i++) { const x = x0 + ((i * 197) % 1000) / 1000 * (x1 - x0), y = y0 + (i * 53) % 60; g.save(); g.translate(x, y); g.rotate(i * 1.3); g.fillStyle = [P.leafO, P.leafR, P.leafY][i % 3]; g.beginPath(); g.ellipse(0, 0, 16, 8, 0, 0, 7); g.fill(); g.restore(); } }
  function park(t, cx, cy, z, o) { o = o || {}; g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#27407e"); bg.addColorStop(.5, "#5a5aa8"); bg.addColorStop(1, "#f29a5a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .75, H * .3, 300, "rgba(255,200,140,.35)"); g.restore();
    cam(cx, cy, z);
    // ferne Hügel
    g.fillStyle = "#3d5f8f"; g.beginPath(); g.moveTo(-3000, 0); for (let x = -3000; x <= 3000; x += 200) g.lineTo(x, -260 - Math.sin(x * .003) * 120 - Math.sin(x * .011) * 40); g.lineTo(3000, 0); g.fill();
    g.fillStyle = "#33705a"; g.beginPath(); g.moveTo(-3000, 0); for (let x = -3000; x <= 3000; x += 150) g.lineTo(x, -140 - Math.sin(x * .004 + 1) * 70); g.lineTo(3000, 0); g.fill();
    if (o.trees !== false) { tree(-760, 1, t, P.leafO, P.leafR); tree(820, 1.1, t, P.leafY, P.leafO); bush(420, 1, "#2f8a5a"); }
    if (o.extra) o.extra();
    // Boden
    const gr = g.createLinearGradient(0, 0, 0, 500); gr.addColorStop(0, P.grass); gr.addColorStop(1, P.grassD); g.fillStyle = gr; g.fillRect(-3000, 0, 6000, o.cut ? 34 : 3000);
    g.strokeStyle = "#6cc05a"; g.lineWidth = 5; g.lineCap = "round"; for (let x = -1500; x < 1500; x += 38) { g.beginPath(); g.moveTo(x, 4); g.lineTo(x + 6 + Math.sin(t * 2 + x) * 3, -18 - (x * 7 % 13)); g.stroke(); }
    if (o.cut) { const sg = g.createLinearGradient(0, 30, 0, 900); sg.addColorStop(0, P.soil); sg.addColorStop(1, P.soilD); g.fillStyle = sg; g.fillRect(-3000, 34, 6000, 3000);
      g.fillStyle = "rgba(0,0,0,.18)"; for (let i = 0; i < 60; i++) { g.beginPath(); g.ellipse(-1400 + (i * 211) % 2800, 80 + (i * 97) % 700, 14 + i % 3 * 6, 8 + i % 2 * 4, 0, 0, 7); g.fill(); }
      g.strokeStyle = "rgba(240,190,140,.25)"; g.lineWidth = 4; for (let i = 0; i < 14; i++) { const x = -1300 + i * 197; g.beginPath(); g.moveTo(x, 40); g.quadraticCurveTo(x + 30, 120, x - 20, 200 + (i % 3) * 60); g.stroke(); } }
    else leaves(t, -1400, 1400, 30); }
  function buried(type, x, y, s, a, t) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.globalCompositeOperation = "lighter"; glow(x, y, 110 * s, "rgba(255,210,120,.5)"); g.restore(); g.save(); g.globalAlpha = a; nut(g, type, x, y, s, .2); g.restore(); }
  function pin(x, y, s, a, col) { if (a <= 0) return; const k = easeBack(Math.min(a, 1)); g.save(); g.translate(x, y); g.scale(k * s, k * s);
    g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(0, 4, 18, 6, 0, 0, 7); g.fill();
    g.fillStyle = col || "#ff4d5a"; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-34, -40, -34, -86, 0, -86); g.bezierCurveTo(34, -86, 34, -40, 0, 0); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, -58, 13, 0, 7); g.fill(); g.restore(); }
  function dirt(x, y, t, a) { if (a <= 0) return; g.fillStyle = `rgba(110,70,40,${a})`; for (let i = 0; i < 8; i++) { const q = (t * 2.2 + i / 8) % 1; g.beginPath(); g.arc(x - 20 - q * 160 - i * 6, y - Math.sin(q * 3.14) * 120 - 10, 8 + i % 3 * 3, 0, 7); g.fill(); } }

  // ================= Shots =================
  function hookShot(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    park(t, lerp(40, 60, k), -40, loop ? 1.55 : lerp(1.55, 1.75, k), { cut: true });
    sqAt(-40, 0, .85, { t, lean: .65, look: .9, mouth: "smile", seed: 1 });
    const gp = loop ? 1 : sm((lt - .3) / .6);
    g.save(); g.setLineDash([14, 14]); g.strokeStyle = `rgba(255,240,180,${.8 * gp})`; g.lineWidth = 6; g.beginPath(); g.moveTo(120, -40); g.lineTo(160, 170); g.stroke(); g.restore();
    buried("acorn", 160, 220, 1.4, gp, t); pin(160, 160, 1, gp);
    if (!loop) check(W * .78, H * .5, .7, sm((lt - d * .7) / .3)); }
  KZ.shot("sHook", (lt, d, t) => hookShot(lt, d, t, false));

  function mythScene(lt, d, t, o) { const k = sm(lt / d); park(t, lerp(-40, 0, k), -420, lerp(1.2, 1.3, k));
    at(rudi, -300, 0, 1, { t, arm: .95, mouth: o.mouth || "grin", look: .7 });
    sqAt(260, 0, .9, { t, lean: o.lean ?? 0, dig: o.dig, look: -.3, tilt: o.dig ? 0 : -.15 + Math.sin(t * 2) * .05, mouth: o.dig ? "smile" : "o", seed: 2 }); }
  KZ.shot("sMyth", (lt, d, t) => { mythScene(lt, d, t, {});
    for (let i = 0; i < 2; i++) qmark(W * (.6 + i * .12), H * (.32 - i * .04) + Math.sin(t * 3 + i) * 8, .9, sm((lt - .3 - i * .2) / .3));
    if (lt > d * .45) stamp("FORGETFUL?", W * .45, H * .16, (lt - d * .45) / .3, "#7b5cff", -.06); });

  KZ.shot("sCount", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("NUTS BURIED", W * .44, H * .085, 64, "#fff", { w: 900, a: sm(lt / .3) }); txt("IN ONE AUTUMN", W * .44, H * .125, 46, "#ffd84d", { w: 800, a: sm((lt - .1) / .3) });
    const n = Math.round(3000 * sm((lt - .2) / (d * .7))), cols = 10, shown = Math.ceil(n / 25);
    for (let i = 0; i < Math.min(shown, 120); i++) { const cx = W * .1 + (i % cols) * 76, cy = H * .17 + Math.floor(i / cols) * 58; nut(g, ["acorn", "walnut", "hazel"][i % 3], cx, cy, .62, (i % 5) * .2 - .4); }
    txt(n.toLocaleString("en-US"), W * .44, H * .6, 130, "#fff", { w: 900, stroke: 16 });
    label("1 ICON = 25 NUTS", W * .44, H * .665, sm((lt - .6) / .3)); });

  KZ.shot("sBury", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(80, 120, k), -150, lerp(1.9, 2.05, k), { cut: true });
    const dg = lt < d * .65; sqAt(-40, 0, .8, { t, lean: dg ? 1 : .4, dig: dg, look: .9, hold: dg ? null : null, seed: 3 });
    dirt(60, 0, t, dg ? .9 : 0);
    buried("hazel", 150, 70, .9, sm((lt - .3) / .4), t);
    const pp = sm((lt - d * .5) / .3); pin(150, 40, .8, pp);
    if (lt > d * .55) stamp("NOT RANDOM", W * .44, H * .17, (lt - d * .55) / .3, "#2b9c8f", .05); });

  KZ.shot("sMap", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("MENTAL MAP", W * .44, H * .09, 68, "#fff", { w: 900, a: sm(lt / .3) });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#3f8a4a"; g.beginPath(); g.roundRect(W * .07, H * .14, W * .74, H * .48, 40); g.fill(); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 6; g.stroke(); g.restore();
    const TR = [[W * .2, H * .22, "OAK"], [W * .64, H * .27, "BUSH"], [W * .3, H * .5, "TREE"]];
    TR.forEach(([x, y, s], i) => { const a = sm((lt - .1 - i * .2) / .3); if (a <= 0) return; g.save(); g.globalAlpha = a; kshape(g, ell(x, y, 66, 60, 0), i === 1 ? "#2f8a5a" : P.leafO, { rim: "rgba(255,240,200,.6)", rw: 5, sw: 10 }); g.restore(); txt(s, x, y + 96, 38, "#fff", { a, stroke: 8 }); });
    const PN = [[W * .45, H * .36], [W * .62, H * .48], [W * .17, H * .36], [W * .5, H * .57]];
    PN.forEach(([x, y], i) => { const a = sm((lt - .7 - i * .25) / .3); if (a <= 0) return;
      g.save(); g.setLineDash([12, 12]); g.strokeStyle = `rgba(255,255,255,${.7 * a})`; g.lineWidth = 5; const tr = TR[i % 3]; g.beginPath(); g.moveTo(tr[0], tr[1]); g.lineTo(x, y); g.stroke(); g.restore();
      nut(g, ["acorn", "walnut", "hazel", "acorn"][i], x, y + 6, .7, 0); pin(x, y - 20, .7, a, "#ffd84d"); });
    g.save(); g.translate(W * .7, H * .6); g.scale(.5, .5); squirrel(g, { t, look: -.6, mouth: "smile", seed: 4 }); g.restore(); });

  KZ.shot("sTest", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.12, sm(lt / d)));
    // Kalender links
    const days = Math.max(1, Math.round(20 * sm((lt - .1) / (d * .45))));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .26, H * .25 + Math.sin(t * 2.4) * 10); g.rotate(Math.sin(t * 1.7) * .04);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-150, -130, 310, 290, 26); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-160, -140, 310, 290, 26); g.fill();
    g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(-160, -140, 310, 80, [26, 26, 0, 0]); g.fill(); g.fillStyle = "#fff"; g.font = '900 42px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("DAY", -5, -100);
    g.fillStyle = "#1b1d3a"; g.font = '900 130px "Montserrat"'; g.fillText(String(days), -5, 40); g.restore();
    txt("20 DAYS LATER", W * .26, H * .36, 46, "#ffd84d", { a: sm((lt - d * .4) / .3), stroke: 8 });
    // Querschnitt rechts: Pfote gräbt, Lineal 5 cm
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.roundRect(W * .5, H * .15, W * .36, H * .46, 30); g.clip();
    g.fillStyle = P.grass; g.fillRect(W * .5, H * .15, W * .4, H * .14); g.fillStyle = P.soil; g.fillRect(W * .5, H * .29, W * .4, H * .4);
    g.fillStyle = "rgba(0,0,0,.2)"; for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(W * .52 + (i * 67) % 360, H * .32 + (i * 53) % 300, 10, 0, 7); g.fill(); }
    const nx = W * .64 + Math.sin(t * 2) * 8, ny = H * .43 + Math.cos(t * 2.6) * 6; nut(g, "acorn", nx, ny, 1.6, .2);
    const dp = sm((lt - d * .45) / .4), hx = nx + 82, hy = lerp(H * .3, ny - 6, dp);
    g.fillStyle = "#3a2318"; g.beginPath(); g.ellipse(hx, (H * .29 + hy) / 2, 30, Math.max(4, (hy - H * .29) / 2 + 20), 0, 0, 7); g.fill();
    g.fillStyle = Q.warm; g.beginPath(); g.ellipse(hx, hy - 10, 22, 18, 0, 0, 7); g.fill(); g.strokeStyle = Q.claw; g.lineWidth = 4; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(hx + i * 10, hy + 2); g.lineTo(hx + i * 12, hy + 16); g.stroke(); }
    g.restore();
    const ra = sm((lt - d * .7) / .3); if (ra > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = ra; g.strokeStyle = "#ffd84d"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(nx + 10, ny + 70); g.lineTo(nx + 82, ny + 70); g.moveTo(nx + 10, ny + 56); g.lineTo(nx + 10, ny + 84); g.moveTo(nx + 82, ny + 56); g.lineTo(nx + 82, ny + 84); g.stroke(); g.restore(); }
    label("WITHIN 5 CM", W * .68, H * .66, ra); });

  KZ.shot("sSort", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-20, 10, k), -250, lerp(1.12, 1.18, k), { trees: false, cut: true });
    const Z = [[-280, "walnut", "#ffd84d", "WALNUTS"], [-10, "almond", "#7ef0b0", "ALMONDS"], [255, "hazel", "#ff8fa3", "HAZELNUTS"]];
    Z.forEach(([x, ty, col, s], i) => { const a = sm((lt - .1 - i * .25) / .3); if (a <= 0) return;
      g.save(); g.globalAlpha = a; g.setLineDash([16, 12]); g.strokeStyle = col; g.lineWidth = 7; g.beginPath(); g.ellipse(x, 150, 118, 90, 0, 0, 7); g.stroke(); g.restore();
      for (let j = 0; j < 4; j++) { g.save(); g.globalAlpha = a; nut(g, ty, x - 50 + (j % 2) * 90 + (j > 1 ? 24 : 0), 120 + (j > 1 ? 60 : 0), .85, j * .4); g.restore(); }
      const p = g.getTransform(); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const sx = p.a * x + p.e, sy = p.d * 300 + p.f; g.restore(); label(s, sx, Math.min(sy, H * .64), a); });
    const run = sm((lt - .4) / (d * .55)); sqAt(lerp(-420, -60, run), -6 - Math.abs(Math.sin(t * 9)) * 26 * (run > 0 && run < 1 ? 1 : 0), .6, { t, lean: .45, hold: "almond", look: .6, seed: 5 });
    if (lt > d * .55) stamp("SORTED!", W * .44, H * .16, (lt - d * .55) / .3, "#f08a1e", -.05); });

  KZ.shot("sFake", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-20, 10, k), -230, lerp(1.32, 1.4, k), { cut: true, trees: false });
    // Dieb hinter dem Busch
    sqAt(-360, 0, .62, { t, dark: true, lean: .2, look: 1, mood: "angry", mouth: "o", seed: 9 }); bush(-300, .7, "#2f8a5a");
    const dg = lt < d * .6; sqAt(-30, 0, .75, { t, lean: dg ? 1 : .2, dig: dg, mouth: "nut", look: .7, seed: 6 });
    dirt(70, 0, t, dg ? .8 : 0);
    g.fillStyle = "#3a2318"; g.beginPath(); g.ellipse(170, 70, 54, 38, 0, 0, 7); g.fill();
    label("EMPTY HOLE", W * .46, H * .63, sm((lt - .5) / .3));
    // Blick-Linie des Diebs
    g.save(); g.setLineDash([10, 14]); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 5; g.beginPath(); g.moveTo(-250, -170); g.lineTo(150, 40); g.stroke(); g.restore();
    if (lt > d * .5) stamp("FAKE!", W * .44, H * .16, (lt - d * .5) / .3, "#e5484d", .06); });

  KZ.shot("sQuote", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -320, 780, 640, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -330, 780, 640, 34); g.fill();
    g.fillStyle = "#2b5fae"; g.beginPath(); g.roundRect(-390, -330, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 40px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("UNIVERSITY OF EXETER", 0, -292); g.font = '700 32px "Montserrat"'; g.fillText("Dr. Lisa Leaver, squirrel researcher", 0, -244);
    g.fillStyle = "#e5a52a"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -160);
    const lines = ["They're not just", "burying a bunch of", "stuff and hoping ...", "They're strategizing", "quite a lot.”"]; g.font = '900 52px "Montserrat"';
    lines.forEach((l, i) => { const a = sm((lt - .35 - i * .22) / .3); g.globalAlpha = a; g.fillStyle = i >= 3 ? "#c9561e" : "#1b1d3a"; g.fillText(l, 0, -140 + i * 72); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 30px "Montserrat"'; g.fillText("Scientific American, 2023", 0, 256);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
    const pe = sm((lt - .8) / .5); g.save(); g.translate(W * .66, H * .67 - pe * 30); g.scale(.45, .45); squirrel(g, { t, hold: "walnut", look: -.4, mouth: "smile", seed: 7 }); g.restore(); });

  KZ.shot("sLeft", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(0, 40, k), -150, lerp(1.35, 1.45, k), { cut: true, trees: false });
    const NS = [[-380, 140, "acorn"], [-200, 230, "walnut"], [-20, 130, "hazel"], [170, 250, "acorn"], [330, 150, "walnut"]];
    NS.forEach(([x, y, ty], i) => { const gone = i % 2 === 0 ? sm((lt - .3 - i * .15) / .3) : 0; buried(ty, x, y - gone * 200, .9, 1 - gone, t);
      if (i % 2) { const a = sm((lt - d * .5) / .3); g.save(); g.globalAlpha = a; g.strokeStyle = "#ffd84d"; g.lineWidth = 6; g.setLineDash([10, 10]); g.beginPath(); g.arc(x, y, 70, 0, 7); g.stroke(); g.restore(); } });
    sqAt(lerp(-120, 420, sm((lt - d * .3) / (d * .6))), 0, .62, { t, lean: .5, look: .8, mouth: "chew", seed: 8 });
    label("ABANDONED", W * .44, H * .63, sm((lt - d * .5) / .3)); });

  function oak(x, grow, t) { // Eichel keimt -> junger Baum
    const r = clamp(grow * 2, 0, 1), s = clamp(grow * 1.4 - .3, 0, 1);
    g.strokeStyle = "#f1e2c4"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(x, 110); g.quadraticCurveTo(x - 20, 110 + 90 * r, x + 10, 110 + 200 * r); g.stroke();
    if (r > .4) { g.lineWidth = 4; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x - 6, 160 + i * 34 * r); g.lineTo(x - 50 + i * 26, 190 + i * 40 * r); g.stroke(); } }
    nut(g, "acorn", x, 100, 1, .3);
    if (s > 0) { const h = 40 + 560 * s; g.strokeStyle = "#7a5230"; g.lineWidth = 8 + 26 * s; g.beginPath(); g.moveTo(x, 80); g.lineTo(x, -h + 40); g.stroke();
      g.lineWidth = 6 + 12 * s; g.beginPath(); g.moveTo(x, -h * .6); g.lineTo(x - 80 * s, -h * .82); g.moveTo(x, -h * .7); g.lineTo(x + 90 * s, -h * .9); g.stroke();
      const Rr = 40 + 170 * s; [[-.6, .15], [.6, .1], [0, .05], [-.35, -.3], [.35, -.32], [0, -.55]].forEach(([dx, dy], i) => kshape(g, ell(x + dx * Rr + Math.sin(t * 1.4 + i) * 4, -h + 40 + dy * Rr, Rr * .62, Rr * .52, 0), i % 2 ? "#4fae4a" : "#5cc35a", { rim: "rgba(230,255,200,.6)", shadow: "rgba(20,60,20,.25)", rw: 5, sw: 10 })); } }
  KZ.shot("sTree", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(60, 80, k), lerp(-40, -280, k), lerp(1.7, 1.25, k), { cut: true, trees: false });
    oak(80, sm((lt - .1) / (d * .8)), t);
    sqAt(-260, 0, .62, { t, look: .9, mouth: "o", seed: 9 });
    label(Math.round(lerp(0, 5, sm((lt - .1) / (d * .8)))) + " YEARS", W * .44, H * .63, sm(lt / .3));
    if (lt > d * .55) stamp("FREE TREE", W * .44, H * .16, (lt - d * .55) / .3, "#2b9c8f", -.05); });

  KZ.shot("sAsk", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-140, -110, k), -400, lerp(1.25, 1.35, k));
    at(rudi, -300, 0, 1, { t, arm: 1.5 + sm(lt / .4) * .5, mouth: "hmm", look: .8 });
    sqAt(40, 0, .8, { t, look: -.8, tilt: -.25, mouth: "o", seed: 10 }, true);
    for (let i = 0; i < 2; i++) qmark(W * (.58 + i * .14), H * (.2 - i * .03) + Math.sin(t * 3 + i) * 8, 1, sm((lt - .2 - i * .2) / .3)); });

  KZ.shot("sFood", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.1, sm(lt / d)));
    txt("IF YOU FEED THEM:", W * .44, H * .085, 60, "#fff", { w: 900, a: sm(lt / .3) });
    label("UNSALTED & PLAIN", W * .44, H * .14, sm((lt - .15) / .3));
    [["HAZELNUTS (SHELL)", 1, "hazel"], ["WALNUTS", 1, "walnut"], ["ALMONDS", 1, "almond"], ["SALTED PEANUTS", 0, "peanut"], ["BREAD", 0, "bread"]].forEach(([s, ok, ty], i) => {
      const a = sm((lt - .3 - i * .3) / .28); if (a <= 0) return; const y = H * .22 + i * 112, x0 = W * .08;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; nut(g, ty, x0 + 40, y + Math.sin(t * 3 + i) * 6, .95, Math.sin(t * 2.5 + i) * .25); g.restore();
      txt(s, x0 + 110, y, 48, "#fff", { align: "left", a, stroke: 10 }); (ok ? check : cross)(W * .8, y, .5, a); }); });

  KZ.shot("sFeed", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-20, 10, k), -360, lerp(1.3, 1.38, k));
    // Baumstumpf
    kshape(g, (c) => { c.beginPath(); c.moveTo(-40, 0); c.lineTo(-30, -150); c.lineTo(150, -150); c.lineTo(160, 0); c.closePath(); }, P.trunk, { rim: "rgba(255,200,160,.5)", rw: 5, sw: 12 });
    kshape(g, ell(60, -150, 92, 22, 0), "#d9a46a", { rw: 3, sw: 5 }); g.strokeStyle = "rgba(120,70,30,.5)"; g.lineWidth = 3; for (let r = 20; r < 80; r += 20) { g.beginPath(); g.ellipse(60, -150, r, r * .24, 0, 0, 7); g.stroke(); }
    const taken = lt > d * .6; [[20, 0], [70, 1], [110, 2]].forEach(([x, i]) => { if (i === 1 && taken) return; nut(g, "hazel", x, -176, .8, i * .5); });
    at(rudi, -300, 0, 1, { t, arm: lerp(.2, .75, sm(lt / .6)), mouth: "smile", look: .6 });
    const run = sm((lt - d * .62) / (d * .35)); sqAt(lerp(250, 560, run), -Math.abs(Math.sin(t * 9)) * 30 * (run > 0 && run < 1 ? 1 : 0), .7, { t, lean: taken ? .5 : .1, hold: taken ? "hazel" : null, look: taken ? .8 : -.6, mouth: "smile", seed: 11 }, !taken);
    label("A LITTLE, EVERY FEW DAYS", W * .44, H * .14, sm((lt - .3) / .3)); });

  KZ.shot("sLoop", (lt, d, t) => { if (lt < d * .6) mythScene(lt, d, t, { lean: 1, dig: true, mouth: "smile" }); else hookShot(0, d, t, true); });
})();
