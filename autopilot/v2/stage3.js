// Video-Engine v3 "Doku": echte Fotos/Clips (Wikimedia Commons) mit Kamerafahrt,
// Farblook, Filmkorn, Wort-für-Wort-Untertitel. Keine Emojis, keine Comic-Effekte.
(function () {
  const W = 1080, H = 1920;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const inout = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const imgs = new Map();
  window.loadImg = (src) => new Promise((res, rej) => { if (imgs.has(src)) return res(imgs.get(src)); const im = new Image(); im.onload = () => { imgs.set(src, im); res(im); }; im.onerror = () => rej(new Error("Bild fehlt: " + src)); im.src = src; });

  // Bild formatfüllend (cover) mit Fokuspunkt und Zoom zeichnen
  function cover(g, im, fx, fy, z) {
    const s = Math.max(W / im.width, H / im.height) * z, w = im.width * s, h = im.height * s;
    let x = W / 2 - fx * w, y = H * .45 - fy * h; // Fokuspunkt etwas über der Mitte (Platz für Untertitel)
    x = clamp(x, W - w, 0); y = clamp(y, H - h, 0);
    g.drawImage(im, x, y, w, h);
  }
  function grain(g, t) {
    const n = 2200, r = (k) => { const v = Math.sin(k * 12.9898 + Math.floor(t * 30) * 78.233) * 43758.5453; return v - Math.floor(v); };
    g.save(); g.globalAlpha = .07;
    for (let i = 0; i < n; i++) { g.fillStyle = r(i) > .5 ? "#fff" : "#000"; g.fillRect(r(i + 1e4) * W, r(i + 2e4) * H, 2, 2); }
    g.restore();
  }
  function caption(g, words, t, st) {
    let cur = -1; for (let i = 0; i < words.length; i++) if (t >= words[i].t0) cur = i;
    if (cur < 0) return;
    const chunk = words[cur].chunk, list = words.filter((w) => w.chunk === chunk);
    const fs = 86; g.font = '800 ' + fs + 'px "Montserrat"'; g.textBaseline = "middle"; g.textAlign = "left"; g.lineJoin = "round";
    const parts = list.map((w) => ({ w, txt: w.text.toUpperCase(), wd: g.measureText(w.text.toUpperCase()).width }));
    const gap = 24, maxW = W - 80 - 190;
    const lines = [[]]; let lw = 0;
    for (const p of parts) { if (lw + p.wd > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(p); lw += p.wd + gap; }
    const cy = H * st.y, lh = fs * 1.15;
    lines.forEach((ln, li) => {
      const tw = ln.reduce((s, p) => s + p.wd, 0) + gap * (ln.length - 1);
      let x = 80 + (maxW - tw) / 2; const y = cy + (li - (lines.length - 1) / 2) * lh;
      for (const p of ln) {
        const on = p.w === words[cur], spoken = t >= p.w.t0, age = t - p.w.t0;
        const a = clamp(age / .08, 0, 1);
        g.save(); g.translate(x, y + (spoken ? (1 - a) * 10 : 0));
        g.shadowColor = "rgba(0,0,0,.85)"; g.shadowBlur = 18; g.shadowOffsetY = 4;
        g.lineWidth = 12; g.strokeStyle = "rgba(0,0,0,.9)"; g.strokeText(p.txt, 0, 0); g.shadowBlur = 0;
        g.fillStyle = on || p.w.key ? st.key : "#fff"; g.globalAlpha = spoken ? 1 : .55;
        g.fillText(p.txt, 0, 0); g.restore();
        x += p.wd + gap;
      }
    });
  }
  function hookLine(g, txt, t) { // ruhige Titelzeile oben im ersten Shot
    g.save();
    g.font = '800 88px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle";
    const lines = txt.split("\n"); const bw = Math.max(...lines.map((l) => g.measureText(l).width)) + 80, bh = lines.length * 104 + 44;
    const cx = (W - 150) / 2 + 40, y0 = H * .17;
    g.fillStyle = "rgba(0,0,0,.55)"; g.beginPath(); g.roundRect(cx - bw / 2, y0 - bh / 2, bw, bh, 26); g.fill();
    lines.forEach((l, i) => { g.fillStyle = "#fff"; g.fillText(l, cx, y0 + (i - (lines.length - 1) / 2) * 104); });
    g.restore(); g.textAlign = "left";
  }
  function credit(g, txt) { g.save(); g.font = '600 22px "Montserrat"'; g.fillStyle = "rgba(255,255,255,.55)"; g.textAlign = "left"; g.fillText(txt, 40, 150); g.restore(); }

  window.makeStage3 = function (spec, words, beats, frames) {
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; document.body.prepend(cv);
    const g = cv.getContext("2d");
    const total = beats[beats.length - 1].t1;
    function shot(bi, t) {
      const sc = spec.beats[bi].scene, b = beats[bi], d = b.t1 - b.t0, p = inout(clamp((t - b.t0) / d, 0, 1));
      const z = lerp(sc.z0 ?? 1.05, sc.z1 ?? 1.18, p);
      const fx = lerp(sc.f0?.[0] ?? sc.focus?.[0] ?? .5, sc.f1?.[0] ?? sc.focus?.[0] ?? .5, p), fy = lerp(sc.f0?.[1] ?? sc.focus?.[1] ?? .5, sc.f1?.[1] ?? sc.focus?.[1] ?? .5, p);
      let im = null;
      if (sc.clip) { const fr = frames[sc.clip]; im = fr[Math.min(fr.length - 1, Math.floor((t - b.t0 + (sc.clipAt || 0)) * 30))]; }
      else im = imgs.get(sc.img);
      g.save();
      g.filter = sc.grade || spec.grade || "contrast(1.12) saturate(1.08) brightness(.92)";
      cover(g, im, fx, fy, z); g.restore();
    }
    function frame(t) {
      let bi = beats.findIndex((b) => t < b.t1); if (bi < 0) bi = beats.length - 1;
      const b = beats[bi], lt = t - b.t0;
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
      shot(bi, t);
      // weiche Überblendung 0,12 s am Schnitt (statt hartem Sprung), nicht im ersten Bild
      if (bi > 0 && lt < .12 && !spec.beats[bi].scene.hard) { g.save(); g.globalAlpha = 1 - lt / .12; shot(bi - 1, t); g.restore(); }
      // Look: Vignette, Kino-Verlauf unten für Lesbarkeit, Korn
      const vg = g.createRadialGradient(W / 2, H * .45, H * .25, W / 2, H * .5, H * .8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.6)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      const lg = g.createLinearGradient(0, H * .5, 0, H); lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(1, "rgba(0,0,0,.55)"); g.fillStyle = lg; g.fillRect(0, H * .5, W, H * .5);
      grain(g, t);
      if (bi === 0 && spec.hook) hookLine(g, spec.hook, t);
      if (spec.beats[bi].scene.title) hookLine(g, spec.beats[bi].scene.title, t);
      if (spec.beats[bi].scene.credit) credit(g, spec.beats[bi].scene.credit);
      caption(g, words, t, { y: spec.capY || .66, key: spec.key || "#ffd84d" });
    }
    return { frame, total, cv };
  };
})();
