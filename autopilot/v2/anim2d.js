// 2D-Erklärfilm "Zungen-Parasit" im Stil gezeichneter Wissenschaftsvideos (Canvas 2D, Bild für Bild)
(function () {
  const W = 1080, H = 1920;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const sm = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const out = document.createElement("canvas"); out.width = W; out.height = H; document.body.prepend(out);
  const g = out.getContext("2d");
  function R(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  // ---------------- Hintergrund Riff ----------------
  const rr = R(42);
  const rocks = [0, 1, 2].map((layer) => Array.from({ length: 9 }, (_, i) => ({ x: i * 520 - 1600 + rr() * 200, w: 300 + rr() * 380, h: 120 + rr() * 260 + layer * 60, c: rr() })));
  const weeds = Array.from({ length: 30 }, () => ({ x: rr() * 5000 - 2500, h: 120 + rr() * 260, ph: rr() * 6, layer: (rr() * 3) | 0 }));
  const snow = Array.from({ length: 160 }, () => ({ x: rr() * W, y: rr() * H, r: 1 + rr() * 3.5, s: .3 + rr(), d: rr() }));
  const corals = Array.from({ length: 26 }, () => ({ x: rr() * 4200 - 2100, s: .6 + rr() * .9, c: (rr() * 4) | 0, k: (rr() * 3) | 0, layer: (rr() * 3) | 0, ph: rr() * 6 }));
  const CC = [["#ff5d8f", "#ff9bb8"], ["#ffb13b", "#ffd47a"], ["#a35cff", "#cf9dff"], ["#34d1bf", "#8ff0e2"]];
  function coral(x, y, s, cc, kind, t, ph) {
    g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = cc[0];
    if (kind === 0) { for (let i = -2; i <= 2; i++) { g.save(); g.rotate(i * .32 + Math.sin(t + ph + i) * .03); g.fillStyle = cc[0]; g.beginPath(); g.roundRect(-11, -150 + Math.abs(i) * 20, 22, 160 - Math.abs(i) * 20, 11); g.fill(); g.fillStyle = cc[1]; g.beginPath(); g.arc(0, -150 + Math.abs(i) * 20, 13, 0, 7); g.fill(); g.restore(); } }
    else if (kind === 1) { g.beginPath(); g.ellipse(0, -10, 90, 64, 0, Math.PI, 0); g.fill(); g.fillStyle = cc[1]; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-70 + i * 17.5, -10 - Math.sin(i / 8 * Math.PI) * 52, 9, 0, 7); g.fill(); } }
    else { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .38 + Math.sin(t * 1.2 + ph + i) * .06; g.beginPath(); g.moveTo(-8, 0); g.quadraticCurveTo(Math.cos(a) * 60 - 10, Math.sin(a) * 60, Math.cos(a) * 130, Math.sin(a) * 130); g.lineTo(Math.cos(a) * 130 + 14, Math.sin(a) * 130 + 4); g.quadraticCurveTo(Math.cos(a) * 60 + 10, Math.sin(a) * 60, 8, 0); g.fill(); } }
    g.restore();
  }
  function reef(t, camx, camy, z, pal) {
    pal = pal || {}; const sky = pal.sky || ["#1d9ccc", "#1263a8", "#0b3172", "#071a47"];
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, sky[0]); bg.addColorStop(.35, sky[1]); bg.addColorStop(.75, sky[2]); bg.addColorStop(1, sky[3]);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const sg = g.createRadialGradient(W * .6, -200, 50, W * .6, -200, H * .8); sg.addColorStop(0, "rgba(190,250,255,.55)"); sg.addColorStop(1, "rgba(190,250,255,0)"); g.fillStyle = sg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < (pal.rays === false ? 0 : 7); i++) { const x = ((i * 190 - camx * .05 + Math.sin(t * .5 + i) * 40) % (W + 400) + W + 400) % (W + 400) - 200;
      const lg = g.createLinearGradient(0, 0, 0, H * .85); lg.addColorStop(0, "rgba(170,240,255,.075)"); lg.addColorStop(1, "rgba(170,240,255,0)"); g.fillStyle = lg;
      g.beginPath(); g.moveTo(x, -20); g.lineTo(x + 70 + i % 3 * 30, -20); g.lineTo(x + 380, H * .85); g.lineTo(x + 220, H * .85); g.fill(); }
    g.restore();
    const cols = pal.hills || [["#1f5ea6", "#2a72bd"], ["#173f86", "#215099"], ["#102a63", "#18397a"]];
    rocks.forEach((L, li) => { const par = [.25, .45, .7][li], base = H * (.72 + li * .09) - camy * par * .3;
      g.save(); if (li === 0) g.filter = "blur(6px)";
      for (const r of L) { const x = W / 2 + (r.x - camx * par) * (1 + (z - 1) * par * .3);
        g.fillStyle = cols[li][0]; g.beginPath(); g.moveTo(x - r.w / 2, H + 50); g.bezierCurveTo(x - r.w / 2, base - r.h, x + r.w / 2, base - r.h * (.7 + r.c * .5), x + r.w / 2, H + 50); g.fill();
        g.fillStyle = cols[li][1]; g.beginPath(); g.moveTo(x - r.w * .42, base - r.h * .35); g.bezierCurveTo(x - r.w * .4, base - r.h * .78, x + r.w * .1, base - r.h * .78, x + r.w * .05, base - r.h * .62); g.bezierCurveTo(x - r.w * .2, base - r.h * .6, x - r.w * .3, base - r.h * .5, x - r.w * .42, base - r.h * .35); g.fill(); }
      g.fillStyle = cols[li][0]; g.fillRect(0, base + 40, W, H);
      if (pal.corals !== false) for (const c of corals) if (c.layer === li) { const x = W / 2 + (c.x - camx * par); if (x > -200 && x < W + 200) { g.globalAlpha = [.55, .8, 1][li]; coral(x, base + 70, c.s * [.6, .8, 1][li], CC[c.c], c.k, t, c.ph); g.globalAlpha = 1; } }
      g.restore();
    });
    g.save(); g.globalCompositeOperation = "lighter";
    for (const p of snow) { const x = ((p.x - camx * p.d * .3 + Math.sin(t * p.s + p.x) * 10) % W + W) % W, y = ((p.y - t * 12 * p.s - camy * p.d * .2) % H + H) % H;
      const r = p.r * 2.2, gr = g.createRadialGradient(x, y, 0, x, y, r * 2); gr.addColorStop(0, `rgba(${pal.dust || "200,250,255"},${.35 + p.d * .45})`); gr.addColorStop(1, "rgba(200,250,255,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 2, 0, 7); g.fill(); }
    g.restore();
  }
  function foreground(t, camx) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.filter = "blur(14px)";
    for (let i = 0; i < 4; i++) { const x = ((i * 700 - camx * 1.4) % 2800 + 2800) % 2800 - 400; coral(x, H + 60, 2.6, [["#0b1a45", "#13285c"], ["#0d2050", "#152d66"]][i % 2], i % 3, t, i); }
    g.restore();
  }
  function bloom() {
    if (!bloom.c) { bloom.c = document.createElement("canvas"); bloom.c.width = W / 4; bloom.c.height = H / 4; bloom.x = bloom.c.getContext("2d"); }
    const x = bloom.x; x.filter = "none"; x.clearRect(0, 0, W / 4, H / 4); x.filter = "brightness(1.4) contrast(1.6) blur(6px)"; x.drawImage(out, 0, 0, W / 4, H / 4);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = .2; g.imageSmoothingQuality = "high"; g.drawImage(bloom.c, 0, 0, W, H); g.restore();
  }

  // ---------------- Licht-Technik wie in gezeichneten Erklärfilmen ----------------
  // Licht kommt von oben rechts. rim(): heller Saum an der Lichtkante, shadowCut(): harter, flacher Schatten unten links.
  // path(c) zeichnet nur den Pfad (beginPath...); beides muss im aktuellen Koordinatensystem der Figur aufgerufen werden.
  function rim(c, path, col, w) { c.save(); path(c); c.clip(); c.translate(-w * .7, w); path(c); c.translate(w * .7, -w); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = col; c.fill("evenodd"); c.restore(); }
  function shadowCut(c, path, col, w) { c.save(); path(c); c.clip(); c.translate(w * .7, -w); path(c); c.translate(-w * .7, w); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = col; c.fill("evenodd"); c.restore(); }
  // Form komplett: Grundfarbe + Schatten + Lichtsaum
  function kshape(c, path, base, o) { o = o || {}; c.save(); path(c); c.fillStyle = base; c.fill(); c.restore(); shadowCut(c, path, o.shadow || "rgba(20,0,60,.25)", o.sw ?? 14); rim(c, path, o.rim || "rgba(255,255,255,.35)", o.rw ?? 6); }
  // feines Filmkorn
  function grain() { if (!grain.c) { grain.c = document.createElement("canvas"); grain.c.width = 512; grain.c.height = 512; const x = grain.c.getContext("2d"), d = x.createImageData(512, 512); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); grain.p = g.createPattern(grain.c, "repeat"); }
    g.setTransform(1, 0, 0, 1, (Math.random() * 512) | 0, (Math.random() * 512) | 0); g.save(); g.globalAlpha = .045; g.globalCompositeOperation = "overlay"; g.fillStyle = grain.p; g.fillRect(-512, -512, W + 1024, H + 1024); g.restore(); g.setTransform(1, 0, 0, 1, 0, 0); }
  const easeBack = (t) => { t = clamp(t, 0, 1); const k = 1.70158; return 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); };

  // ---------------- Fisch (Seitenansicht, schaut nach rechts) ----------------
  function bodyPath(c) {
    c.beginPath(); c.moveTo(-220, -30);
    c.bezierCurveTo(-120, -92, 20, -160, 150, -132);
    c.bezierCurveTo(238, -112, 292, -60, 306, -16);
    c.quadraticCurveTo(316, 4, 304, 26);
    c.bezierCurveTo(286, 70, 240, 104, 150, 122);
    c.bezierCurveTo(40, 142, -120, 82, -220, 30);
    c.closePath();
  }
  function fin(c, pts, col, rays) {
    c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fill();
    if (rays) { c.strokeStyle = "rgba(120,10,25,.45)"; c.lineWidth = 2.2; for (const [a, b] of rays) { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); } }
    c.restore();
  }
  function drawFish(c, o) {
    const t = o.t || 0, flap = Math.sin(t * 6.5);
    c.save(); c.scale(1 - Math.sin(t * 6.5 + 1) * .012, 1 + Math.sin(t * 6.5 + 1) * .018);
    // Schatten
    c.save(); c.globalAlpha = .3; c.fillStyle = "#06103a"; c.filter = "blur(22px)"; c.translate(10, 40); c.scale(1, .5); bodyPath(c); c.fill(); c.restore();
    // Schwanzflosse
    c.save(); c.translate(-215, 0); c.scale(.72 + .28 * flap, 1); c.rotate(flap * .05);
    const tg = "#ff7a6e";
    c.fillStyle = tg; c.beginPath(); c.moveTo(0, -28); c.quadraticCurveTo(-60, -60, -125, -128); c.quadraticCurveTo(-95, -55, -70, 0); c.quadraticCurveTo(-95, 55, -125, 128); c.quadraticCurveTo(-60, 60, 0, 28); c.closePath(); c.fill();
    c.restore();
    // Rückenflosse mit Stacheln
    const dp = [[-150, -62]]; for (let k = 0; k <= 10; k++) { const x = -150 + k * 28, yb = -62 - Math.sin((k + 1) / 12 * Math.PI) * 78; dp.push([x, yb - 52 + (k % 2) * 10 - Math.max(0, 5 - Math.abs(k - 4)) * 6]); dp.push([x + 14, yb - 22]); }
    dp.push([170, -128]);
    fin(c, dp, "#ff7a6e");
    // Afterflosse + Bauchflosse
    fin(c, [[-60, 104], [-110, 150], [-170, 120], [-150, 68]], "#ff7a6e");
    fin(c, [[110, 128], [70, 190], [40, 180], [70, 128]], "#ff8f7f");
    // Körper
    c.fillStyle = "#ef3e55"; bodyPath(c); c.fill();
    c.save(); bodyPath(c); c.clip();
    c.fillStyle = "#ffb3a1"; c.beginPath(); c.moveTo(-240, 30); c.bezierCurveTo(-100, 40, 60, 30, 330, -10); c.lineTo(330, 200); c.lineTo(-240, 200); c.fill();
    c.fillStyle = "#ffd6c4"; c.beginPath(); c.moveTo(-240, 60); c.bezierCurveTo(-60, 80, 120, 70, 330, 20); c.lineTo(330, 200); c.lineTo(-240, 200); c.fill();
    c.fillStyle = "#c92f4a"; c.beginPath(); c.moveTo(-240, -40); c.bezierCurveTo(-100, -70, 40, -100, 330, -80); c.lineTo(330, -220); c.lineTo(-240, -220); c.fill();
    c.save(); c.beginPath(); c.rect(-240, -220, 600, 120); c.clip(); c.translate(0, 7); c.strokeStyle = "rgba(255,170,170,.7)"; c.lineWidth = 8; bodyPath(c); c.stroke(); c.restore();
    rim(c, bodyPath, "rgba(255,200,190,.9)", 10); shadowCut(c, bodyPath, "rgba(120,10,50,.28)", 16);
    const hl = c.createRadialGradient(150, -70, 10, 150, -70, 200); hl.addColorStop(0, "rgba(255,235,225,.35)"); hl.addColorStop(1, "rgba(255,235,225,0)"); c.fillStyle = hl; c.fillRect(-300, -200, 650, 400);
    // Röntgen / Schnitt
    if (o.cut) cutaway(c, o);
    c.restore();
    // Kiemendeckel
    c.save(); c.strokeStyle = "rgba(170,20,50,.55)"; c.lineWidth = 7; c.lineCap = "round";
    const go = o.gill || 0; c.beginPath(); c.moveTo(182, -98); c.bezierCurveTo(150 - go * 18, -40, 152 - go * 18, 50, 192, 104); c.stroke();
    if (go > 0) { c.fillStyle = "rgba(60,0,12," + go * .8 + ")"; c.beginPath(); c.moveTo(182, -98); c.bezierCurveTo(150 - go * 18, -40, 152 - go * 18, 50, 192, 104); c.bezierCurveTo(165, 50, 165, -40, 182, -98); c.fill(); }
    c.restore();
    // Brustflosse
    c.save(); c.translate(150, 34); c.rotate(-.25 + Math.sin(t * 4) * .18); fin(c, [[0, -8], [-80, -34], [-104, 4], [-70, 30], [0, 10]], "rgba(255,160,150,.9)"); c.restore();
    // Auge
    c.save(); c.translate(232, -52);
    const blink = Math.sin(t * 1.9 + 2.2) > .985 ? .12 : 1; c.scale(1, blink);
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(0, 0, 34, 0, 7); c.fill();
    c.fillStyle = "#12142b"; c.beginPath(); c.arc(6, 2, 20, 0, 7); c.fill();
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(0, -6, 7, 0, 7); c.fill(); c.beginPath(); c.arc(13, 9, 3, 0, 7); c.fill();
    c.restore();
    // Maul
    const mo = o.mouth ?? .4;
    c.save(); c.translate(306, 6);
    c.fillStyle = "#3a0a24"; c.beginPath(); c.ellipse(0, 2, 13 + mo * 6, 6 + mo * 20, 0, 0, 7); c.fill();
    if (o.peek) { // Assel schaut aus dem Maul
      c.save(); c.beginPath(); c.ellipse(0, 2, 13 + mo * 6, 6 + mo * 20, 0, 0, 7); c.clip();
      c.fillStyle = "#d9c7a4"; c.beginPath(); c.ellipse(-6, 6, 16, 14 * mo + 4, 0, 0, 7); c.fill();
      const bl = Math.sin(t * 2.7) > .96 ? .15 : 1;
      c.fillStyle = "#050505"; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(-2, 2 + s * 7, 3.4, 3.4 * bl, 0, 0, 7); c.fill(); }
      c.restore();
    }
    c.strokeStyle = "#ff8f8f"; c.lineWidth = 7; c.beginPath(); c.ellipse(0, 2, 14 + mo * 6, 7 + mo * 20, 0, -1.9, 1.9); c.stroke();
    c.restore();
    c.restore();
  }

  // ---------------- Schnittbild durch den Kopf ----------------
  // Mundhöhle von Maul (306,6) bis zu den Kiemen (~165)
  function cavityPath(c, mo) {
    c.beginPath(); c.moveTo(304, -4 - mo * 12); c.bezierCurveTo(272, -18, 214, -20, 168, -16); c.bezierCurveTo(146, -8, 144, 46, 172, 66);
    c.bezierCurveTo(218, 76, 270, 60, 304, 22 + mo * 12); c.closePath();
  }
  function cutaway(c, o) {
    const mo = o.mouth ?? .4, k = o.cut;
    c.save(); c.globalAlpha = k;
    // Schnittkante (Fleisch)
    c.save(); c.translate(0, 0); c.scale(1.08, 1.12); c.translate(-18, 0); cavityPath(c, mo); c.fillStyle = "#ffc2b8"; c.fill(); c.restore();
    cavityPath(c, mo); const cg = c.createLinearGradient(170, -40, 300, 50); cg.addColorStop(0, "#3a0a2e"); cg.addColorStop(.6, "#6d1340"); cg.addColorStop(1, "#8f1d4a"); c.fillStyle = cg; c.fill();
    c.save(); cavityPath(c, mo); c.clip();
    // Kiemenbögen
    for (let i = 0; i < 4; i++) { const x = 174 + i * 9; c.strokeStyle = i % 2 ? "#ff5b7a" : "#e23a64"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(x, -14); c.quadraticCurveTo(x - 16, 24, x + 4, 62); c.stroke();
      }
    // Zunge
    const tg = o.tongue ?? 1, wi = o.wither || 0, fall = o.fall || 0, pulse = o.pulse || 0;
    if (tg > 0 && fall < 1) {
      c.save(); c.translate(lerp(250, 340, sm(fall)) , lerp(50, 80, fall)); c.rotate(fall * .9);
      const s = 1 - wi * .45; c.scale(s, s * (1 - wi * .3));
      const col = mix([229, 120, 135], [120, 92, 84], wi); const pc = mix(col, [255, 40, 60], pulse);
      const tg2 = c.createLinearGradient(0, -16, 0, 14); tg2.addColorStop(0, `rgb(${pc})`); tg2.addColorStop(1, `rgb(${mix(pc, [90, 10, 30], .5)})`);
      c.fillStyle = tg2; c.beginPath(); c.moveTo(-50, 10); c.bezierCurveTo(-40, -16, 30, -20, 46, -4); c.quadraticCurveTo(54, 4, 40, 12); c.closePath(); c.fill();
      c.fillStyle = "rgba(255,255,255,.25)"; c.beginPath(); c.ellipse(4, -8, 22, 4, -.1, 0, 7); c.fill();
      c.restore();
    }
    if (o.stump) { c.fillStyle = "#9c3a48"; c.beginPath(); c.ellipse(222, 58, 18, 8, 0, Math.PI, 0); c.fill(); }
    c.restore();
    c.restore();
  }
  const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], t)));

  // ---------------- Assel ----------------
  const PW = [70, 80, 86, 90, 90, 86, 78];
  function isoTop(c, o) { // Draufsicht, Kopf nach +x, Länge ~260
    const t = o.t || 0, walk = o.walk ?? 0, grip = o.grip || 0;
    c.save();
    c.save(); c.globalAlpha = .3; c.fillStyle = "#000"; c.filter = "blur(10px)"; c.beginPath(); c.ellipse(-10, 14, 160, 54, 0, 0, 7); c.fill(); c.restore();
    // Beine
    c.lineCap = "round"; c.lineJoin = "round";
    for (let i = 0; i < 7; i++) for (const s of [-1, 1]) {
      const x0 = 60 - i * 24, y0 = s * PW[i] / 2 * .92, ph = t * 10 * walk + i * .9 + (s > 0 ? 0 : Math.PI), sw = Math.sin(ph) * .35 * walk;
      const a1 = s * (1.35 - grip * .25) + sw * s * 0 + sw, l1 = 34, l2 = 30;
      const kx = x0 + Math.cos(a1 * s > 0 ? a1 : a1) * 0 + Math.sin(sw) * l1 * .6, ky = y0 + s * l1;
      const fx = kx + 16 + Math.sin(sw) * 8, fy = ky + s * (l2 - grip * 8);
      c.strokeStyle = "#e0b978"; c.lineWidth = 7; c.beginPath(); c.moveTo(x0, y0); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
      c.strokeStyle = "#4a3418"; c.lineWidth = 4; c.beginPath(); c.moveTo(fx, fy); c.quadraticCurveTo(fx + 12, fy + s * 2, fx + 10, fy - s * 9); c.stroke();
    }
    // Hinterleib + Schwanzfächer
    const plate = (x, w, th, light) => { const gg = c.createRadialGradient(x + 4, -w * .18, 4, x, 0, w * .62); gg.addColorStop(0, light ? "#fff4dc" : "#fbe9c8"); gg.addColorStop(.75, light ? "#f6dfb4" : "#efd3a2"); gg.addColorStop(1, "#e2bd84");
      c.fillStyle = gg; c.beginPath(); c.ellipse(x, 0, th, w / 2, 0, 0, 7); c.fill(); };
    c.fillStyle = "#cdb48a"; c.beginPath(); c.ellipse(-150, 0, 34, 34, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(110,80,40,.7)"; c.lineWidth = 2.5; c.stroke();
    for (let i = 3; i >= 0; i--) plate(-104 - i * 11, 62 - i * 6, 13, false);
    for (let i = 6; i >= 0; i--) plate(60 - i * 24, PW[i], 21, i % 2 === 0);
    // Kopf
    const hg = c.createRadialGradient(92, -8, 2, 90, 0, 34); hg.addColorStop(0, "#f6ecd6"); hg.addColorStop(1, "#bfa477"); c.fillStyle = hg; c.beginPath(); c.ellipse(88, 0, 24, 28, 0, 0, 7); c.fill();
    c.strokeStyle = "#8a6b40"; c.lineWidth = 3; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(106, s * 8); c.quadraticCurveTo(124, s * 14, 132, s * 6); c.stroke(); }
    const bl = Math.sin(t * 2.3 + 1) > .97 ? .2 : 1;
    for (const s of [-1, 1]) { c.fillStyle = "#070707"; c.beginPath(); c.ellipse(92, s * 14, 7, 7 * bl, 0, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.85)"; c.beginPath(); c.arc(90, s * 14 - 3, 2.2, 0, 7); c.fill(); }
    c.restore();
  }
  function isoSide(c, o) { // Seitenansicht, Kopf nach +x, Länge ~260, Bauch bei y=0
    const t = o.t || 0, walk = o.walk ?? 0, grip = o.grip || 0;
    c.save(); c.lineCap = "round";
    for (let i = 0; i < 7; i++) { const x = 60 - i * 24, ph = t * 10 * walk + i * .9, lift = Math.max(0, Math.sin(ph)) * 10 * walk, sw = Math.cos(ph) * 10 * walk;
      c.strokeStyle = "#e0b978"; c.lineWidth = 7; c.beginPath(); c.moveTo(x, -6); c.lineTo(x + 6 + sw, 14 - lift); c.lineTo(x + 16 + sw, 24 - lift - grip * 2); c.stroke();
      c.strokeStyle = "#4a3418"; c.lineWidth = 4; c.beginPath(); c.moveTo(x + 16 + sw, 24 - lift); c.quadraticCurveTo(x + 26 + sw, 28 - lift, x + 26 + sw, 16 - lift); c.stroke(); }
    const tn = o.tint || 0, bg = c.createLinearGradient(0, -60, 0, 0); bg.addColorStop(0, `rgb(${mix([255, 242, 214], [255, 130, 140], tn)})`); bg.addColorStop(1, `rgb(${mix([232, 196, 140], [220, 60, 80], tn)})`);
    c.fillStyle = bg; c.beginPath(); c.moveTo(-170, -2); c.bezierCurveTo(-160, -30, -120, -48, -40, -56); c.bezierCurveTo(40, -60, 90, -48, 112, -22); c.quadraticCurveTo(120, -4, 108, 0); c.closePath(); c.fill();
    c.strokeStyle = "rgba(200,150,90,.55)"; c.lineWidth = 4; for (let i = 0; i < 11; i++) { const x = 80 - i * 23; c.beginPath(); c.moveTo(x, -2); c.quadraticCurveTo(x - 8, -30, x - 2, -54 + Math.abs(i - 4) * 2.5); c.stroke(); }
    c.fillStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.ellipse(-20, -44, 90, 6, -.04, 0, 7); c.fill();
    const bl = Math.sin(t * 2.3 + 1) > .97 ? .2 : 1; c.fillStyle = "#12142b"; c.beginPath(); c.ellipse(94, -28, 10, 10 * bl, 0, 0, 7); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(91, -32, 3.4, 0, 7); c.fill();
    c.strokeStyle = "#8a6b40"; c.lineWidth = 3; c.beginPath(); c.moveTo(110, -16); c.quadraticCurveTo(130, -24, 138, -12); c.stroke();
    c.restore();
  }

  // ---------------- Kamera ----------------
  let TT = 0; function cam(cx, cy, z) { cx += Math.sin(TT * .7) * 18 / z; cy += Math.cos(TT * .55) * 15 / z; g.setTransform(z, 0, 0, z, W / 2 - cx * z, H * .42 - cy * z); }
  function fishAt(x, y, s, o, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s); drawFish(g, o); g.restore(); }
  function glow(x, y, r, col) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  function label(txt, x, y, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.font = '800 46px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(txt).width + 50;
    g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(x - w / 2, y - 38, w, 76, 38); g.fill(); g.fillStyle = "#0b2a40"; g.fillText(txt, x, y + 2); g.restore(); }

  // Szenen-Helfer: Fisch im Riff, Position in Weltkoordinaten
  const SHOTS = {
    hook(lt, d, t) { reef(t, t * 20, 0, 1); const k = sm(lt / d); cam(lerp(200, 285, k), lerp(-10, 4, k), lerp(3, 5.2, k)); fishAt(0, Math.sin(t * 1.4) * 4, 1, { t, mouth: .8, peek: true }); },
    notTongue(lt, d, t) { reef(t, t * 20, 0, 1); const k = sm(lt / d); cam(304, 8, lerp(9, 11, k)); fishAt(0, Math.sin(t * 1.4) * 4, 1, { t, mouth: .9, peek: true }); },
    parasite(lt, d, t) { reef(t, t * 20, 0, 1); const k = sm(lt / d); cam(lerp(230, 238, k), 20, lerp(3.4, 4.2, k)); const cut = sm(lt / .5);
      fishAt(0, 0, 1, { t, mouth: .45, cut, tongue: 1 - sm((lt - d * .45) / (d * .35)), stump: lt > d * .6 });
      g.save(); g.translate(250, 30); g.scale(.3, .3); g.globalAlpha = sm((lt - d * .5) / (d * .3)); isoSide(g, { t, walk: 0, grip: 1 }); g.restore();
      if (lt > d * .55) label("PARASITE", W * .45, H * .26, sm((lt - d * .55) / .25)); },
    larva(lt, d, t) { reef(t, t * 40, 0, 1); const k = sm(lt / d); cam(lerp(0, 120, k), lerp(0, -10, k), lerp(1.25, 2.4, k));
      const go = sm((lt - d * .6) / (d * .25)) * (1 - sm((lt - d * .9) / (d * .1)));
      fishAt(0, Math.sin(t * 1.4) * 4, 1, { t, mouth: .4, gill: go });
      const p = sm(lt / (d * .82)), lx = lerp(420, 168, p), ly = lerp(-260, 40, p) + Math.sin(t * 9) * 4;
      if (lt < d * .9) { glow(lx, ly, 70, "rgba(255,250,210,.45)"); g.save(); g.translate(lx, ly); g.rotate(Math.atan2(40 + 260, 168 - 420) + Math.PI); g.scale(.17, .17); isoTop(g, { t, walk: 1.5 }); g.restore(); }
      if (lt < d * .7) label("LARVA", W * .55, H * .24, sm(lt / .3) * (1 - sm((lt - d * .55) / .2))); },
    clamp(lt, d, t) { reef(t, 0, 0, 1); const k = sm(lt / d); cam(lerp(218, 240, k), lerp(28, 36, k), lerp(5.4, 7.6, k)); fishAt(0, 0, 1, { t, mouth: .45, cut: 1, tongue: 1 });
      const p = sm(lt / (d * .6)); g.save(); g.translate(lerp(182, 252, p), lerp(52, 34, p)); g.rotate(lerp(-.15, -.06, p)); g.scale(.3, .3); isoSide(g, { t, walk: 1 - sm((lt - d * .5) / (d * .2)), grip: sm((lt - d * .6) / (d * .3)) }); g.restore();
      if (lt > d * .55) label("14 HOOKED LEGS", W * .45, H * .24, sm((lt - d * .55) / .25)); },
    blood(lt, d, t) { reef(t, 0, 0, 1); const k = sm(lt / d); cam(248, 36, lerp(7.6, 8.6, k)); const pulse = .5 + .5 * Math.sin(t * 9);
      fishAt(0, 0, 1, { t, mouth: .45, cut: 1, tongue: 1, pulse: pulse * .8 });
      g.save(); g.translate(252, 34); g.rotate(-.06); g.scale(.3, .3); isoSide(g, { t, walk: 0, grip: 1, tint: sm(lt / d) * .35 }); g.restore();
      for (let i = 0; i < 14; i++) { const ph = (lt * .9 + i / 14) % 1; const x = lerp(232 + (i % 4) * 9, 252, ph), y = lerp(52, 28, ph); g.fillStyle = `rgba(210,10,30,${1 - ph * .6})`; g.beginPath(); g.arc(x, y, 1.6 * (1 - ph * .5), 0, 7); g.fill(); } },
    wither(lt, d, t) { reef(t, 0, 0, 1); const k = sm(lt / d); cam(lerp(250, 270, k), lerp(36, 44, k), lerp(7, 5, k)); const w = sm(lt / (d * .55)), f = sm((lt - d * .55) / (d * .45));
      fishAt(0, 0, 1, { t, mouth: lerp(.45, .9, f), cut: 1, tongue: 1, wither: w, fall: f, stump: f > 0 });
      g.save(); g.translate(lerp(252, 238, w), lerp(34, 30, w)); g.rotate(-.08); g.scale(.3, .3); isoSide(g, { t, walk: 0, grip: 1, tint: .3 }); g.restore(); },
    stump(lt, d, t) { reef(t, 0, 0, 1); const k = sm(lt / d); cam(lerp(235, 248, k), 40, lerp(6.5, 7.8, k)); fishAt(0, 0, 1, { t, mouth: .45, cut: 1, tongue: 0, stump: true });
      const p = sm(lt / (d * .7)); g.save(); g.translate(lerp(222, 248, p), lerp(32, 46, p)); g.rotate(lerp(-.1, 0, p)); g.scale(.3, .3); isoSide(g, { t, walk: 1 - p, grip: sm((lt - d * .7) / (d * .3)), tint: .2 }); g.restore(); },
    newTongue(lt, d, t) { reef(t, 0, 0, 1); const k = sm(lt / d); cam(lerp(270, 255, k), 34, lerp(5, 6.2, k)); fishAt(0, 0, 1, { t, mouth: lerp(.9, .4, sm((lt - d * .5) / .3)), cut: 1, tongue: 0, stump: true });
      g.save(); g.translate(248, 46); g.scale(.3, .3); isoSide(g, { t, walk: 0, grip: 1, tint: .15 }); g.restore();
      const p = sm(lt / (d * .6)); const fx = lerp(360, 250, p), fy = lerp(-4, 28, p); g.save(); g.translate(fx, fy); g.rotate(t * 2); g.fillStyle = "#e8a25a"; g.beginPath(); g.ellipse(0, 0, 9, 6, 0, 0, 7); g.fill(); g.fillStyle = "#c97a35"; g.beginPath(); g.ellipse(-3, 0, 4, 5, 0, 0, 7); g.fill(); g.restore();
      if (lt > d * .4) { g.save(); g.globalAlpha = .5 * sm((lt - d * .4) / .3); glow(248, 36, 50, "rgba(255,230,120,.6)"); g.restore(); label("NEW TONGUE", W * .45, H * .24, sm((lt - d * .4) / .25)); } },
    pullBack(lt, d, t) { reef(t, t * 30, 0, 1); const k = sm(lt / d); cam(lerp(200, 60, k), lerp(0, -60, k), lerp(3.2, .9, k));
      fishAt(0, Math.sin(t * 1.4) * 6, 1, { t, mouth: .4, peek: true });
      fishAt(-900 + lt * 60, -380, .55, { t: t + 2, mouth: .3 }); fishAt(-1300 + lt * 50, 240, .45, { t: t + 1, mouth: .3 }); },
    outro(lt, d, t) { reef(t, t * 20, 0, 1); const k = sm(lt / d); cam(lerp(80, 200, k), lerp(-30, -10, k), lerp(1.3, 3, k)); fishAt(0, Math.sin(t * 1.4) * 4, 1, { t, mouth: .8, peek: true }); },
  };

  // ---------------- Untertitel ----------------
  function caption(words, t, st) {
    let cur = -1; for (let i = 0; i < words.length; i++) if (t >= words[i].t0) cur = i;
    if (cur < 0) return;
    const chunk = words[cur].chunk, list = words.filter((w) => w.chunk === chunk);
    g.setTransform(1, 0, 0, 1, 0, 0);
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
  function hookLine(txt) { g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.font = '800 88px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle";
    const lines = txt.split("\n"); const bw = Math.max(...lines.map((l) => g.measureText(l).width)) + 80, bh = lines.length * 104 + 44, cx = (W - 150) / 2 + 40, y0 = H * .17;
    g.fillStyle = "rgba(0,0,0,.45)"; g.beginPath(); g.roundRect(cx - bw / 2, y0 - bh / 2, bw, bh, 26); g.fill();
    lines.forEach((l, i) => { g.fillStyle = "#fff"; g.fillText(l, cx, y0 + (i - (lines.length - 1) / 2) * 104); }); g.restore(); }

  // Baukasten für Szenen-Dateien des Autopiloten (eigene Figuren pro Thema): window.KZ.shot("name", (lt, d, t) => {...})
  window.KZ = { g, W, H, clamp, lerp, sm, easeBack, R, rim, shadowCut, kshape, reef, cam, foreground, bloom, glow, label, coral, drawFish, fishAt, isoTop, isoSide, SHOTS,
    shot(name, fn) { SHOTS[name] = fn; }, get t() { return TT; } };
  window.makeAnim = function (spec, words, beats) {
    const total = beats[beats.length - 1].t1;
    function frame(t) {
      let bi = beats.findIndex((b) => t < b.t1); if (bi < 0) bi = beats.length - 1; TT = t;
      const b = beats[bi]; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = "none";
      const fn = SHOTS[spec.beats[bi].scene.shot]; if (!fn) throw new Error("Shot fehlt: " + spec.beats[bi].scene.shot); fn(t - b.t0, b.t1 - b.t0, t);
      if (!spec.beats[bi].scene.noFg && spec.fg !== false) foreground(t, t * 30);
      bloom(); grain();
      g.setTransform(1, 0, 0, 1, 0, 0);
      const vg = g.createRadialGradient(W / 2, H * .45, H * .3, W / 2, H * .5, H * .8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(5,10,40,.45)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      if (bi === 0 && spec.hook) hookLine(spec.hook);
      caption(words, t, { y: spec.capY || .75, key: spec.key || "#ffd84d" });
    }
    return { frame, total, cv: out };
  };
  window.__animReady = true;
})();
