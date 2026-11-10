// 3D-Renderer v4 (anim3d.js), sonst wie v3: MEDIA=ordner node autopilot/v2/render3.js spec.json out.mp4 (Fotos/Clips aus MEDIA)
// Nutzt Stimme (Kokoro) und Musik aus lab/ki-labor.html, zeichnet aber mit stage2.js.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path"), cp = require("child_process"), os = require("os");
const HERE = __dirname, NPM = path.join(HERE, "..", "npm"), LAB = path.join(HERE, "..", "..", "lab", "ki-labor.html");
const [specFile, outFile] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specFile, "utf8"));
const MEDIA = process.env.MEDIA || path.dirname(path.resolve(specFile));
const FONT = process.env.FONT_DIR || "/tmp/fx/package/files";
const CDNJS = { "marked/12.0.2/marked.min.js": "marked@12.0.2/marked.min.js", "dompurify/3.1.6/purify.min.js": "dompurify@3.1.6/dist/purify.min.js", "three.js/r128/three.min.js": "three@0.128.0/build/three.min.js" };
const MIME = { js: "text/javascript", mjs: "text/javascript", json: "application/json", wasm: "application/wasm", woff2: "font/woff2" };
function npmFile(rest) { const m = rest.match(/^((?:@[^/]+\/)?[^/@]+@[^/]+)\/(.*)$/); if (!m) return null; let d = path.join(NPM, m[1].replace("/", "__")); if (!fs.existsSync(d)) d = path.join(NPM, m[1]); const f = path.join(d, m[2]); return fs.existsSync(f) ? f : null; }
const HF = "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/";

(async () => {
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const page = await (await browser.newContext({ viewport: { width: 1200, height: 1400 } })).newPage();
  page.on("pageerror", (e) => console.error("[pageerror]", String(e).slice(0, 300)));
  page.on("console", (m) => { if (m.type() === "error") console.error("[page]", m.text().slice(0, 300)); });
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    try {
      if (url === "http://lab.local/") return route.fulfill({ contentType: "text/html; charset=utf-8", body: fs.readFileSync(LAB, "utf8").replace("const a = await t.generate(text, { voice, speed: 1.3 });", "const [vv, sp] = voice.split('|'); const a = await t.generate(text, { voice: vv, speed: +sp || 1.3 });").replace("(async () => {\n  const C = window.claude;", "Object.assign(window, { VOICE, makeMusic });\n(async () => {\n  const C = window.claude;") });
      if (url.startsWith("http://lab.local/three/")) return route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(path.join(NPM, "three@0.128.0", url.slice(23))) });
      if (url === "http://lab.local/anim2d.js") return route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(path.join(HERE, "anim2d.js")) });
      if (url === "http://lab.local/anim3d.js") return route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(path.join(HERE, "anim3d.js")) });
      if (url === "http://lab.local/stage3.js") return route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(path.join(HERE, "stage3.js")) });
      if (url.startsWith("http://lab.local/media/")) return route.fulfill({ contentType: "image/jpeg", body: fs.readFileSync(path.join(MEDIA, decodeURIComponent(url.slice(23)))) });
      if (url.startsWith("http://lab.local/font/")) return route.fulfill({ contentType: "font/woff2", body: fs.readFileSync(path.join(FONT, url.split("/").pop())) });
      if (url.startsWith("http://lab.local/")) return route.fulfill({ status: 404, body: "" });
      let file = null;
      if (url.startsWith("https://cdn.jsdelivr.net/npm/")) file = npmFile(url.slice(29).split("?")[0]);
      else if (url.startsWith("https://cdnjs.cloudflare.com/ajax/libs/")) { const k = CDNJS[url.slice(39)]; if (k) file = npmFile(k); }
      else if (url.startsWith(HF + "voices/")) file = npmFile("kokoro-js@1.2.1/voices/" + url.slice(HF.length + 7));
      if (file) return route.fulfill({ body: fs.readFileSync(file), contentType: MIME[file.split(".").pop()] || "application/octet-stream", headers: { "access-control-allow-origin": "*" } });
      if (url.startsWith("blob:") || url.startsWith("data:")) return route.continue();
      return route.abort();
    } catch (e) { console.error("route", url, e.message); return route.abort(); }
  });
  await page.goto("http://lab.local/", { waitUntil: "load", timeout: 120000 });
  await page.waitForFunction(() => window.VOICE && window.makeMusic, null, { timeout: 60000 });
  await page.addScriptTag({ url: "http://lab.local/anim2d.js" }); await page.waitForFunction(() => window.__animReady, null, { timeout: 120000 });
  // Clips in Einzelbilder (1080 hoch, 30 fps) zerlegen
  const clips = {};
  for (const b of spec.beats) { const c = b.scene.clip; if (!c || clips[c]) continue;
    const dir = path.join(MEDIA, "_f_" + c.replace(/\W/g, "_")); if (!fs.existsSync(dir)) { fs.mkdirSync(dir);
      cp.execFileSync("ffmpeg", ["-loglevel", "error", "-ss", String(b.scene.clipFrom || 0), "-t", "8", "-i", path.join(MEDIA, c), "-vf", "fps=30,scale=-2:1920", "-q:v", "3", path.join(dir, "%04d.jpg")]); }
    clips[c] = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg")).sort().map((f) => "http://lab.local/media/" + path.basename(dir) + "/" + f); }
  const FPS = 30;
  const info = await page.evaluate(async ([spec, clipList]) => {
    for (const w of ["800", "900"]) { const f = new FontFace("Montserrat", "url(http://lab.local/font/montserrat-latin-" + w + "-normal.woff2)", { weight: w }); await f.load(); document.fonts.add(f); }
    await document.fonts.load('800 80px "Montserrat"');
    for (const b of spec.beats) if (b.scene.img) await loadImg(b.scene.img = "http://lab.local/media/" + b.scene.img);
    const frames = {}; for (const c in clipList) frames[c] = await Promise.all(clipList[c].map(loadImg));
    // 1) Stimme pro Beat, Stille vorne/hinten weg, lückenlos aneinander
    const clips = [], beats = [], words = []; let at = 0, chunk = 0;
    for (const b of spec.beats) {
      const v = await VOICE.say(b.say.replace(/\*/g, ""), (b.voice || spec.voice) + "|" + (b.speed || spec.speed || 1.3));
      let s = v.samples, i0 = 0; while (i0 < s.length && Math.abs(s[i0]) < .01) i0++; i0 = Math.max(0, i0 - Math.round(v.rate * .02));
      s = s.slice(i0); const dur = s.length / v.rate;
      const t0 = at, gap = b.gap ?? .06, t1 = t0 + Math.max(dur + gap, b.min || 0);
      clips.push({ s, rate: v.rate, at: t0 }); beats.push({ t0, t1 });
      // Wortzeiten grob nach Silbenlänge verteilen
      const ws = b.say.split(/\s+/).filter(Boolean), wt = ws.map((w) => w.replace(/[^\w]/g, "").length + 2.5), sum = wt.reduce((a, c) => a + c, 0);
      let acc = 0, n = 0;
      ws.forEach((w, k) => { const a = t0 + dur * .96 * acc / sum; acc += wt[k]; const e = t0 + dur * .96 * acc / sum;
        if (n >= (b.chunk || 3) || (k > 0 && /[.,!?…]$/.test(ws[k - 1]))) { chunk++; n = 0; }
        words.push({ text: w.replace(/\*/g, "").replace(/[.,]$/, ""), key: /\*/.test(w), t0: a, t1: e, chunk }); n++; });
      chunk++; at = t1;
    }
    const total = at;
    // 2) Ton offline mischen: Stimme + leise Musik + Whoosh/Boom auf Schnitten
    const rate = 48000, len = Math.ceil((total + .05) * rate);
    const ac = new OfflineAudioContext(2, len, rate);
    const vo = ac.createGain(); vo.gain.value = 1.15; const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 4; vo.connect(comp); comp.connect(ac.destination);
    for (const c of clips) { const bf = ac.createBuffer(1, c.s.length, c.rate); bf.copyToChannel(c.s, 0); const src = ac.createBufferSource(); src.buffer = bf; src.connect(vo); src.start(c.at); }
    if (spec.music !== false) { // leise Doku-Musik: warme Flächen in a-Moll + sanfte Klavier-Töne, kein Rauschen
      const vol = spec.musicVol ?? .2, bus = ac.createGain(); bus.gain.setValueAtTime(0, 0); bus.gain.linearRampToValueAtTime(vol, .25); bus.gain.setValueAtTime(vol, Math.max(.3, total - .25)); bus.gain.linearRampToValueAtTime(0, total); bus.connect(ac.destination);
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800; lp.connect(bus);
      // Hall aus abklingendem Rauschen (nur im Hall, nicht hörbar als Rauschen)
      const rv = ac.createConvolver(), ir = ac.createBuffer(2, rate * 2.5, rate); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3.5); } rv.buffer = ir;
      const wet = ac.createGain(); wet.gain.value = .45; rv.connect(wet); wet.connect(bus);
      const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
      const chords = [[45, 57, 60, 64], [41, 53, 57, 60], [36, 48, 55, 64], [43, 55, 59, 62]]; // Am F C G
      const bar = 2.4; let k = 0;
      for (let t0 = 0; t0 < total; t0 += bar, k++) {
        const ch = chords[k % 4];
        for (const m of ch) { const o = ac.createOscillator(); o.type = "triangle"; o.frequency.value = hz(m); o.detune.value = (Math.random() - .5) * 8;
          const gg = ac.createGain(); const g0 = m < 50 ? .09 : .045; gg.gain.setValueAtTime(0, t0); gg.gain.linearRampToValueAtTime(g0, t0 + .8); gg.gain.setValueAtTime(g0, t0 + bar - .3); gg.gain.linearRampToValueAtTime(0, t0 + bar + .5);
          o.connect(gg); gg.connect(lp); gg.connect(rv); o.start(t0); o.stop(t0 + bar + .6); }
        // Klavier-artige Töne (Arpeggio, weich angeschlagen)
        const arp = [ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12];
        arp.forEach((m, j) => { const t = t0 + j * bar / 4; if (t > total - .2) return;
          for (const [mul, amp] of [[1, .06], [2, .018], [3, .008]]) { const o = ac.createOscillator(); o.frequency.value = hz(m) * mul; const gg = ac.createGain(); gg.gain.setValueAtTime(0, t); gg.gain.linearRampToValueAtTime(amp, t + .01); gg.gain.exponentialRampToValueAtTime(.0005, t + 1.6); o.connect(gg); gg.connect(lp); gg.connect(rv); o.start(t); o.stop(t + 1.7); } });
      }
    }
    const noise = ac.createBuffer(1, rate, rate); const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    spec.beats.forEach((b, i) => {
      const t = beats[i].t0, sfx = b.sfx || (i ? "soft" : "keiner");
      if (sfx === "whoosh" || sfx === "boom") { const src = ac.createBufferSource(); src.buffer = noise; const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.setValueAtTime(400, Math.max(0, t - .12)); bp.frequency.exponentialRampToValueAtTime(3500, t + .1);
        const gg = ac.createGain(); gg.gain.setValueAtTime(0, Math.max(0, t - .14)); gg.gain.linearRampToValueAtTime(.22, t); gg.gain.exponentialRampToValueAtTime(.001, t + .25); src.connect(bp); bp.connect(gg); gg.connect(ac.destination); src.start(Math.max(0, t - .14)); src.stop(t + .3); }
      if (sfx === "soft") { const src = ac.createBufferSource(); src.buffer = noise; const bp = ac.createBiquadFilter(); bp.type = "lowpass"; bp.frequency.setValueAtTime(300, Math.max(0, t - .2)); bp.frequency.exponentialRampToValueAtTime(1400, t);
        const gg = ac.createGain(); gg.gain.setValueAtTime(0, Math.max(0, t - .2)); gg.gain.linearRampToValueAtTime(.03, t); gg.gain.exponentialRampToValueAtTime(.001, t + .3); src.connect(bp); bp.connect(gg); gg.connect(ac.destination); src.start(Math.max(0, t - .2)); src.stop(t + .35); }
      if (sfx === "boom") { const o = ac.createOscillator(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(38, t + .5); const gg = ac.createGain(); gg.gain.setValueAtTime(.7, t); gg.gain.exponentialRampToValueAtTime(.001, t + .7); o.connect(gg); gg.connect(ac.destination); o.start(t); o.stop(t + .75); }
      if (sfx === "squish") { const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(70, t + .25); const lp = ac.createBiquadFilter(); lp.frequency.value = 900; const gg = ac.createGain(); gg.gain.setValueAtTime(.25, t); gg.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(lp); lp.connect(gg); gg.connect(ac.destination); o.start(t); o.stop(t + .32); }
    });
    const buf = await ac.startRendering(); const L = buf.getChannelData(0), R = buf.getChannelData(1);
    const pcm = new Int16Array(len * 2); for (let i = 0; i < len; i++) { pcm[2 * i] = Math.max(-1, Math.min(1, L[i])) * 32767; pcm[2 * i + 1] = Math.max(-1, Math.min(1, R[i])) * 32767; }
    const u8 = new Uint8Array(pcm.buffer); let bin = ""; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    window.__S = makeAnim(spec, words, beats);
    return { total, audio: btoa(bin), beats };
  }, [spec, clips]);
  if (process.env.PREVIEW) { const ts = process.env.PREVIEW.split(",").map(Number); for (const t of ts) { const b64 = await page.evaluate(async (t) => { __S.frame(t); const b = await new Promise((r) => __S.cv.toBlob(r, "image/jpeg", .85)); const u = new Uint8Array(await b.arrayBuffer()); let s = ""; for (let j = 0; j < u.length; j += 0x8000) s += String.fromCharCode.apply(null, u.subarray(j, j + 0x8000)); return btoa(s); }, t); fs.writeFileSync(outFile + "-" + t + ".jpg", Buffer.from(b64, "base64")); } console.log("beats", info.beats.map((b) => b.t0.toFixed(2)).join(" ")); await browser.close(); return; }
  console.log("Dauer", info.total.toFixed(1), "s, Beats", info.beats.map((b) => (b.t1 - b.t0).toFixed(1)).join(" "));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "r2-")), pcmFile = path.join(tmp, "a.pcm"); fs.writeFileSync(pcmFile, Buffer.from(info.audio, "base64"));
  const N = Math.round(info.total * FPS), master = path.join(tmp, "m.mp4");
  const ff = cp.spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-f", "s16le", "-ar", "48000", "-ac", "2", "-i", pcmFile,
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "fast", "-crf", "14", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", master], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => c === 0 ? res() : rej(new Error("ffmpeg " + c))));
  for (let i = 0; i < N; i += 15) {
    const fr = await page.evaluate(async ([i0, n, fps]) => { const out = []; for (let k = i0; k < i0 + n; k++) { __S.frame(Math.min(k / fps, __S.total - 1e-3)); const b = await new Promise((r) => __S.cv.toBlob(r, "image/jpeg", .93)); const u = new Uint8Array(await b.arrayBuffer()); let s = ""; for (let j = 0; j < u.length; j += 0x8000) s += String.fromCharCode.apply(null, u.subarray(j, j + 0x8000)); out.push(btoa(s)); } return out; }, [i, Math.min(15, N - i), FPS]);
    for (const f of fr) if (!ff.stdin.write(Buffer.from(f, "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end(); await done; await browser.close();
  const vk = Math.max(1500, Math.min(8000, Math.floor(10.4e6 * 8 / (info.total + .5) / 1000) - 170));
  const enc = ["-c:v", "libx264", "-preset", "slow", "-b:v", vk + "k", "-maxrate", Math.round(vk * 1.6) + "k", "-bufsize", 2 * vk + "k", "-pix_fmt", "yuv420p", "-passlogfile", path.join(tmp, "p")];
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", master, ...enc, "-pass", "1", "-an", "-f", "null", "-"]);
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", master, ...enc, "-pass", "2", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", outFile]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("OK", outFile, (fs.statSync(outFile).size / 1e6).toFixed(1) + " MB");
})().catch((e) => { console.error("FEHLER", e); process.exit(1); });
