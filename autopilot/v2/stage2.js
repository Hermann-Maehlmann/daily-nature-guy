// Video-Engine v2 (läuft im Browser). Unterschiede zu v1:
//  - Bild 1 ist schon in Bewegung, Hook steht groß im Bild (Ton aus / Ton an)
//  - Wort-für-Wort-Untertitel synchron zur Stimme, Schlüsselwort farbig
//  - durchgehende Erzählung ohne Pausen, Schnitt alle ~2 s, Kamera zoomt ständig
//  - Punch-Ins, Wackeln, Blitz und Whoosh auf den Schnitten
//  - kein Outro: Video endet hart, damit es loopt
(function () {
  const W = 1080, H = 1920;
  const ease = { lin: (t) => t, out: (t) => 1 - Math.pow(1 - t, 3), inout: (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, back: (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  function rnd(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  // Emoji einmal groß vorrendern (scharf und schnell)
  const emo = new Map();
  function emoji(ch) {
    if (emo.has(ch)) return emo.get(ch);
    const c = document.createElement("canvas"); c.width = c.height = 640;
    const g = c.getContext("2d"); g.font = '520px "Noto Color Emoji"'; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(ch, 320, 350); emo.set(ch, c); return c;
  }

  // ---------- Kulissen ----------
  const BG = {
    ocean(g, t, k) {
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0a5f8a"); gr.addColorStop(.55, "#063a5c"); gr.addColorStop(1, "#021626");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.save(); g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 6; i++) { // Lichtstrahlen
        const x = (i * 230 + Math.sin(t * .4 + i) * 60) % (W + 200) - 100;
        const lg = g.createLinearGradient(0, 0, 0, H * .9); lg.addColorStop(0, "rgba(140,220,255,.16)"); lg.addColorStop(1, "rgba(140,220,255,0)");
        g.fillStyle = lg; g.beginPath(); g.moveTo(x, -10); g.lineTo(x + 90, -10); g.lineTo(x + 340, H * .9); g.lineTo(x + 160, H * .9); g.fill();
      }
      g.restore(); particles(g, t, k, "rgba(200,240,255,.5)", 60, -40);
      // Sand + Korallen-Silhouetten
      g.fillStyle = "#03111c"; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 60) g.lineTo(x, H * .86 + Math.sin(x * .013 + 1) * 40); g.lineTo(W, H); g.fill();
    },
    mouth(g, t, k) {
      const gr = g.createRadialGradient(W * .5, H * .45, 40, W * .5, H * .45, H * .75); gr.addColorStop(0, "#3a0710"); gr.addColorStop(.45, "#8e1d2c"); gr.addColorStop(1, "#2a0208");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // feuchter Glanz
      g.save(); g.globalAlpha = .18 + .06 * Math.sin(t * 3); g.fillStyle = "#ffb3c0";
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + t * .2; g.beginPath(); g.ellipse(W * .5 + Math.cos(a) * 420, H * .45 + Math.sin(a) * 700, 60, 18, a, 0, 7); g.fill(); }
      g.restore();
      // Zähne oben/unten
      g.fillStyle = "#f4ead2";
      for (let i = 0; i < 9; i++) { const x = 40 + i * 125; tooth(g, x, 0, 1); tooth(g, x + 60, H, -1); }
      particles(g, t, k, "rgba(255,220,230,.35)", 25, -20);
    },
    dark(g, t, k) {
      const gr = g.createRadialGradient(W * .45, H * .42, 50, W * .5, H * .5, H * .7); gr.addColorStop(0, "#1b2a3a"); gr.addColorStop(1, "#05080c");
      g.fillStyle = gr; g.fillRect(0, 0, W, H); particles(g, t, k, "rgba(180,210,255,.35)", 40, -15);
    },
    alarm(g, t, k) {
      const gr = g.createRadialGradient(W * .45, H * .42, 50, W * .5, H * .5, H * .7); gr.addColorStop(0, "#5c0b12"); gr.addColorStop(1, "#120204");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.save(); g.globalAlpha = .12; g.strokeStyle = "#ff4d5e"; g.lineWidth = 26;
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * .5; g.beginPath(); g.moveTo(W * .45, H * .42); g.lineTo(W * .45 + Math.cos(a) * 2000, H * .42 + Math.sin(a) * 2000); g.stroke(); }
      g.restore();
    },
  };
  function tooth(g, x, y, d) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 70, y); g.lineTo(x + 35, y + d * 120); g.closePath(); g.fill(); }
  function particles(g, t, k, col, n, vy) {
    const r = rnd(7 + k * 13); g.fillStyle = col;
    for (let i = 0; i < n; i++) { const x = r() * W, y0 = r() * H, s = 2 + r() * 7, sp = .5 + r();
      const y = ((y0 + vy * sp * t * 3) % H + H) % H; g.globalAlpha = .3 + .7 * r(); g.beginPath(); g.arc(x + Math.sin(t + i) * 12, y, s, 0, 7); g.fill(); }
    g.globalAlpha = 1;
  }

  // ---------- Figuren ----------
  // Ebene: {e, x, y, s, r, flip, from:{...}, inDur, ease, anim, glow, alpha}
  function drawLayer(g, L, lt, beatDur) {
    const p = clamp(lt / (L.inDur || .35), 0, 1), e = ease[L.ease || "back"](p);
    const f = L.from || {};
    let x = lerp(f.x ?? L.x, L.x, e), y = lerp(f.y ?? L.y, L.y, e), s = lerp(f.s ?? L.s, L.s, e), r = lerp(f.r ?? (L.r || 0), L.r || 0, e), a = lerp(f.a ?? 1, L.alpha ?? 1, clamp(p * 1.5, 0, 1));
    if (L.to) { const q = ease.inout(clamp((lt - (L.toAt || 0)) / (L.toDur || beatDur), 0, 1)); x = lerp(x, L.to.x ?? x, q); y = lerp(y, L.to.y ?? y, q); s = lerp(s, L.to.s ?? s, q); r = lerp(r, L.to.r ?? r, q); a = lerp(a, L.to.a ?? a, q); }
    let sx = 1, sy = 1, dx = 0, dy = 0;
    switch (L.anim) {
      case "bob": dy = Math.sin(lt * 3.2) * 18; r += Math.sin(lt * 2.1) * 3; break;
      case "breathe": sx = 1 + Math.sin(lt * 4) * .04; sy = 1 - Math.sin(lt * 4) * .04; break;
      case "shake": dx = Math.sin(lt * 70) * 10; dy = Math.cos(lt * 53) * 8; break;
      case "pulse": sx = sy = 1 + Math.max(0, Math.sin(lt * 9)) * .12; break;
      case "wiggle": r += Math.sin(lt * 14) * 9; break;
      case "chomp": sy = 1 - Math.abs(Math.sin(lt * 10)) * .18; sx = 1 + Math.abs(Math.sin(lt * 10)) * .08; break;
      case "wither": { const q = clamp(lt / beatDur, 0, 1); sx = 1 - q * .25; sy = 1 - q * .55; r += q * 18; a *= 1 - q * .25; break; }
    }
    g.save(); g.globalAlpha = clamp(a, 0, 1);
    g.translate(x * W + dx, y * H + dy); g.rotate(r * Math.PI / 180); g.scale((L.flip ? -1 : 1) * sx, sy);
    const px = s * W;
    if (L.glow) { g.shadowColor = L.glow; g.shadowBlur = 60; }
    else { g.shadowColor = "rgba(0,0,0,.55)"; g.shadowBlur = 40; g.shadowOffsetY = 18; }
    g.drawImage(emoji(L.e), -px / 2, -px / 2, px, px);
    g.restore();
  }

  // ---------- Untertitel ----------
  function caption(g, words, t, style) {
    // Wörter in Häppchen à max. 3 Wörter, aktuelles Wort springt und leuchtet
    let cur = -1; for (let i = 0; i < words.length; i++) if (t >= words[i].t0) cur = i;
    if (cur < 0) return;
    const chunk = words[cur].chunk, list = words.filter((w) => w.chunk === chunk);
    const last = list[list.length - 1]; if (t > last.t1 + .5 && cur === words.length - 1) return;
    const fs = 100; g.textAlign = "left"; g.font = '900 ' + fs + 'px "Montserrat"'; g.textBaseline = "middle"; g.lineJoin = "round";
    const parts = list.map((w) => ({ w, txt: w.text.toUpperCase(), wd: g.measureText(w.text.toUpperCase()).width }));
    const gap = 40, maxW = W - 120 - 170; // rechts Platz für TikTok-Buttons
    // Zeilen umbrechen
    const lines = [[]]; let lw = 0;
    for (const p of parts) { if (lw + p.wd > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(p); lw += p.wd + gap; }
    const cy = H * style.y, lh = fs * 1.12;
    lines.forEach((ln, li) => {
      const tw = ln.reduce((s, p) => s + p.wd, 0) + gap * (ln.length - 1);
      let x = 60 + (maxW - tw) / 2 + 60; const y = cy + (li - (lines.length - 1) / 2) * lh;
      for (const p of ln) {
        const on = p.w === words[cur], age = t - p.w.t0, pop = on ? 1 + .1 * Math.max(0, 1 - age / .12) : 1;
        g.save(); g.translate(x + p.wd / 2, y); g.scale(pop, pop); g.rotate(on ? -.025 : 0);
        if (on) { g.fillStyle = style.box || "#ffe14d"; g.strokeStyle = "#000"; g.lineWidth = 8; g.beginPath(); g.roundRect(-p.wd / 2 - 16, -fs * .58, p.wd + 32, fs * 1.12, 18); g.fill(); g.stroke(); }
        g.lineWidth = 20; g.strokeStyle = "#000"; if (!on) g.strokeText(p.txt, -p.wd / 2, 0);
        if (on) { g.fillStyle = "#000"; } else g.fillStyle = p.w.key ? style.key : "#ffffff";
        if (on) g.lineWidth = 0; else g.fillText(p.txt, -p.wd / 2, 0);
        if (on) g.fillText(p.txt, -p.wd / 2, 0); g.restore();
        x += p.wd + gap;
      }
    });
  }
  function hookTitle(g, txt, t, col) { // großer Titel oben, ab Bild 1 sichtbar
    const lines = txt.split("\n"), maxW = W - 170 - 60; let fs = 132;
    g.textBaseline = "middle"; g.lineJoin = "round"; g.textAlign = "left";
    const width = (l) => l.split("*").reduce((s, p) => s + g.measureText(p).width, 0);
    for (;;) { g.font = '900 ' + fs + 'px "Montserrat"'; if (Math.max(...lines.map(width)) <= maxW || fs < 60) break; fs -= 4; }
    const y0 = H * .19;
    lines.forEach((l, i) => {
      const parts = l.split("*"); let x = 60 + (maxW - width(l)) / 2; const y = y0 + i * fs * 1.08; const wob = Math.sin(t * 6 + i) * 3;
      parts.forEach((p, k) => { g.save(); g.translate(0, wob); g.lineWidth = 24; g.strokeStyle = "#000"; g.strokeText(p, x, y); g.fillStyle = k % 2 ? col : "#fff"; g.fillText(p, x, y); g.restore(); x += g.measureText(p).width; });
    });
  }

  // ---------- Renderer ----------
  window.makeStage2 = function (spec, words, beats) {
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; document.body.prepend(cv);
    const g = cv.getContext("2d");
    const total = beats[beats.length - 1].t1;
    function frame(t) {
      let bi = beats.findIndex((b) => t < b.t1); if (bi < 0) bi = beats.length - 1;
      const b = beats[bi], sc = spec.beats[bi].scene, lt = t - b.t0, d = b.t1 - b.t0;
      // Kamera: ständiger langsamer Zoom + Punch-In am Schnitt
      const cam = sc.cam || {}; const z0 = cam.z0 ?? 1, z1 = cam.z1 ?? 1.08;
      let z = lerp(z0, z1, ease.inout(clamp(lt / d, 0, 1)));
      if (sc.punch !== false && bi > 0) z *= 1 + .16 * Math.pow(Math.max(0, 1 - lt / .22), 2);
      let sx = 0, sy = 0; if (sc.fx && sc.fx.includes("shake")) { const k = Math.max(0, 1 - lt / .6); sx = Math.sin(t * 90) * 26 * k; sy = Math.cos(t * 71) * 22 * k; }
      if (sc.fx && sc.fx.includes("rumble")) { sx += Math.sin(t * 60) * 7; sy += Math.cos(t * 47) * 6; }
      const fx = (cam.x ?? .5) * W, fy = (cam.y ?? .45) * H;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
      g.save(); g.translate(fx + sx, fy + sy); g.scale(z, z); g.translate(-fx, -fy);
      (BG[sc.bg] || BG.dark)(g, t, bi);
      for (const L of sc.layers || []) { const lt2 = lt - (L.at || 0); if (lt2 >= 0 || bi === 0) drawLayer(g, L, bi === 0 && !L.at ? 99 : lt2, d); }
      g.restore();
      // Vignette
      const vg = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      if (sc.fx && sc.fx.includes("red")) { g.fillStyle = "rgba(255,0,30," + (.18 + .12 * Math.sin(t * 8)) + ")"; g.fillRect(0, 0, W, H); }
      if (sc.fx && sc.fx.includes("flash") && lt < .18) { g.fillStyle = "rgba(255,255,255," + (1 - lt / .18) * .85 + ")"; g.fillRect(0, 0, W, H); }
      if (sc.label) stamp(g, sc.label, lt);
      if (bi === 0 && spec.hook) hookTitle(g, spec.hook, t, spec.key || "#ffe14d");
      caption(g, words, t, { y: spec.capY || .64, key: spec.key || "#ffe14d" });
    }
    function stamp(g, txt, lt) { // Comic-Stempel wie "7 PAIRS OF HOOKS"
      const p = clamp(lt / .25, 0, 1), s = lerp(2.2, 1, ease.out(p));
      g.save(); g.translate(W * .44, H * .2); g.rotate(-.07); g.scale(s, s); g.globalAlpha = p;
      g.font = '900 86px "Montserrat"'; const w = g.measureText(txt).width + 60;
      g.fillStyle = spec.key || "#ffe14d"; g.strokeStyle = "#000"; g.lineWidth = 10;
      g.beginPath(); g.roundRect(-w / 2, -66, w, 132, 22); g.fill(); g.stroke();
      g.fillStyle = "#000"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 4); g.restore(); g.textAlign = "start";
    }
    return { frame, total, cv };
  };
})();
