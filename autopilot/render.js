// Rendert ein Labor-Drehbuch (JSON) mit der echten Video-Engine aus ki-labor.html
// in headless Chromium zu einer MP4-Datei.  Aufruf: node render.js drehbuch.json ausgabe.mp4
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path"), cp = require("child_process");

const HERE = __dirname, NPM = path.join(HERE, "npm");
const LAB = process.env.LAB_HTML || path.join(HERE, "..", "lab", "ki-labor.html");
const [specFile, outFile] = process.argv.slice(2);
if (!specFile || !outFile) { console.error("usage: node render.js spec.json out.mp4"); process.exit(2); }
const spec = JSON.parse(fs.readFileSync(specFile, "utf8"));

const CDNJS = {
  "marked/12.0.2/marked.min.js": "marked@12.0.2/marked.min.js",
  "dompurify/3.1.6/purify.min.js": "dompurify@3.1.6/dist/purify.min.js",
  "three.js/r128/three.min.js": "three@0.128.0/build/three.min.js",
};
const MIME = { js: "text/javascript", mjs: "text/javascript", json: "application/json", wasm: "application/wasm", css: "text/css" };

// npm-Paket bei Bedarf holen (jsDelivr/HF sind im Container gesperrt, npm nicht)
function pkgDir(spec) {
  const dir = path.join(NPM, spec.replace("/", "__"));
  if (!fs.existsSync(dir)) {
    const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "pk-"));
    const name = cp.execSync("npm pack " + JSON.stringify(spec) + " --silent", { cwd: tmp }).toString().trim().split("\n").pop();
    fs.mkdirSync(dir, { recursive: true });
    cp.execSync("tar xzf " + JSON.stringify(path.join(tmp, name)) + " -C " + JSON.stringify(dir) + " --strip-components=1");
  }
  return dir;
}
function npmFile(rest) { // "<pkg>@<ver>/<file>" oder "@scope/pkg@ver/file"
  const m = rest.match(/^((?:@[^/]+\/)?[^/@]+@[^/]+)\/(.*)$/);
  if (!m) return null;
  let dir = path.join(NPM, m[1].replace("/", "__"));
  if (!fs.existsSync(dir) && fs.existsSync(path.join(NPM, m[1]))) dir = path.join(NPM, m[1]);
  if (!fs.existsSync(dir)) dir = pkgDir(m[1]);
  const f = path.join(dir, m[2]);
  return fs.existsSync(f) ? f : null;
}

// TikTok-Sicherheitszone (9:16): rechts liegen Like/Kommentar/Profil, unten Name + Caption.
// Text und Figuren werden deshalb nach links/oben in den freien Bereich geschoben.
function safeZone(html) {
  const R = [
    ["const capY = tall ? H * .27 : H * .24, actY = tall ? H * .62 : H * .64;", "const capY = tall ? H * .22 : H * .24, actY = tall ? H * .5 : H * .64;"],
    ["{ mitte: .5, links: .27, rechts: .73, oben: .5, unten: .5 }[a.wo] * W", "{ mitte: .45, links: .24, rechts: .64, oben: .45, unten: .45 }[a.wo] * W"],
    ["{ oben: -.12, unten: .14 }[a.wo]", "{ oben: -.11, unten: .1 }[a.wo]"],
    ["const maxW = W * (wide ? .7 : .86), fam", "const maxW = W * (wide ? .7 : .8), fam"],
    ["Math.min(W - 20 * U - w / 2, b.x", "Math.min(W - 160 * U - w / 2, b.x"],
    ["const cx = W / 2, cy = H * (tall ? .42 : .4), R0", "const cx = W * .46, cy = H * (tall ? .36 : .4), R0"],
  ];
  for (const [a, b] of R) { if (!html.includes(a)) throw new Error("safeZone: Stelle nicht gefunden: " + a.slice(0, 50)); html = html.replace(a, b); }
  return html;
}
const HF = "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/";

(async () => {
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1200, height: 1400 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("[pageerror]", String(e).slice(0, 300)));
  page.on("console", (m) => { if (m.type() === "error") console.error("[page]", m.text().slice(0, 300)); });
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    try {
      if (url.startsWith("http://lab.local/")) {
        if (url === "http://lab.local/" ) return route.fulfill({ body: safeZone(fs.readFileSync(LAB, "utf8")).replace("(async () => {\n  const C = window.claude;", "window.__videoBox = videoBox; window.__normSpec = normSpec; Object.assign(window, { voiceOver, bitmapsOf, makeRenderer, makeMusic, makeSfx, playVoice });\n(async () => {\n  const C = window.claude;"), contentType: "text/html; charset=utf-8" });
        return route.fulfill({ status: 404, body: "" });
      }
      let file = null;
      if (url.startsWith("https://cdn.jsdelivr.net/npm/")) file = npmFile(url.slice(29).split("?")[0]);
      else if (url.startsWith("https://cdnjs.cloudflare.com/ajax/libs/")) { const k = CDNJS[url.slice(39)]; if (k) file = npmFile(k); }
      else if (url.startsWith(HF + "voices/")) file = npmFile("kokoro-js@1.2.1/voices/" + url.slice(HF.length + 7));
      if (file) return route.fulfill({ body: fs.readFileSync(file), contentType: MIME[file.split(".").pop()] || "application/octet-stream", headers: { "access-control-allow-origin": "*" } });
      if (/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//.test(url)) {
        const body = cp.execFileSync("curl", ["-sS", "--max-time", "20", "-A", "Mozilla/5.0 Chrome/130", url]);
        return route.fulfill({ body, contentType: url.includes("googleapis") ? "text/css" : "font/woff2", headers: { "access-control-allow-origin": "*" } });
      }
      if (url.startsWith("blob:") || url.startsWith("data:")) return route.continue();
      return route.abort();
    } catch (e) { console.error("route", url, e.message); return route.abort(); }
  });
  await page.goto("http://lab.local/", { waitUntil: "load", timeout: 120000 });
  await page.waitForFunction(() => typeof window.__videoBox === "function", null, { timeout: 60000 });
  // Bild für Bild rendern (nicht in Echtzeit aufnehmen): jedes der 30 Bilder pro Sekunde wird einzeln gezeichnet,
  // egal wie langsam der Server ist. Ton wird offline (OfflineAudioContext) berechnet.
  const FPS = 30;
  const info = await page.evaluate(async (raw) => {
    try { await Promise.race([document.fonts.load('400 80px "Bangers"'), new Promise((r) => setTimeout(r, 4000))]); } catch (_) {}
    try { await document.fonts.ready; } catch (_) {}
    const spec = window.__normSpec(raw);
    const r = await voiceOver(spec, (t) => console.log("…", t));
    const S = r.spec, VO = r.vo;
    const cv = document.createElement("canvas"); document.body.prepend(cv);
    const bm = await bitmapsOf([]);
    const R = makeRenderer(S, cv, bm);
    window.__R = R; window.__cv = cv;
    // Ton
    const rate = 48000, len = Math.ceil((R.total + 0.3) * rate);
    const ac = new OfflineAudioContext(2, len, rate), dest = ac.destination;
    const voOn = VO.some(Boolean) || !!VO.outro;
    if (S.musik) { makeMusic(ac, dest, R.total, S.stimmung, voOn ? .2 : .5); makeSfx(ac, dest, S, voOn ? .5 : .8); }
    if (voOn) playVoice(ac, dest, S, VO);
    const buf = await ac.startRendering();
    const L = buf.getChannelData(0), Rr = buf.getChannelData(1);
    const pcm = new Int16Array(len * 2);
    for (let i = 0; i < len; i++) { pcm[2 * i] = Math.max(-1, Math.min(1, L[i])) * 32767; pcm[2 * i + 1] = Math.max(-1, Math.min(1, Rr[i])) * 32767; }
    const u8 = new Uint8Array(pcm.buffer); let bin = ""; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { total: R.total, w: cv.width, h: cv.height, audio: btoa(bin) };
  }, spec);
  const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "rd-"));
  const pcmFile = path.join(tmp, "a.pcm"); fs.writeFileSync(pcmFile, Buffer.from(info.audio, "base64"));
  const N = Math.round(info.total * FPS);
  const ff = cp.spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-f", "s16le", "-ar", "48000", "-ac", "2", "-i", pcmFile, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "fast", "-crf", "14",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", path.join(tmp, "master.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
  const ffDone = new Promise((res, rej) => ff.on("close", (c) => c === 0 ? res() : rej(new Error("ffmpeg " + c))));
  const B = 15;
  for (let i = 0; i < N; i += B) {
    const frames = await page.evaluate(async ([i0, n, fps]) => {
      const out = [];
      for (let k = i0; k < i0 + n; k++) {
        window.__R.frame(Math.min(k / fps, window.__R.total - 1e-3));
        const blob = await new Promise((r) => window.__cv.toBlob(r, "image/jpeg", 0.93));
        const u8 = new Uint8Array(await blob.arrayBuffer()); let bin = ""; for (let j = 0; j < u8.length; j += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(j, j + 0x8000));
        out.push(btoa(bin));
      }
      return out;
    }, [i, Math.min(B, N - i), FPS]);
    for (const f of frames) { if (!ff.stdin.write(Buffer.from(f, "base64"))) await new Promise((r) => ff.stdin.once("drain", r)); }
    if ((i / B) % 20 === 0) console.log("… Bild " + i + " von " + N);
  }
  ff.stdin.end(); await ffDone; await browser.close();
  // 2-Pass auf Zielgröße < 11 MB (Metricool nimmt höchstens 12 MB)
  const dur = info.total, vk = Math.max(1500, Math.min(8000, Math.floor(10.4e6 * 8 / (dur + 0.5) / 1000) - 170));
  const enc = ["-c:v", "libx264", "-preset", "slow", "-b:v", vk + "k", "-maxrate", Math.round(vk * 1.6) + "k", "-bufsize", 2 * vk + "k", "-pix_fmt", "yuv420p", "-passlogfile", path.join(tmp, "p")];
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(tmp, "master.mp4"), ...enc, "-pass", "1", "-an", "-f", "null", "-"]);
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(tmp, "master.mp4"), ...enc, "-pass", "2", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", outFile]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("OK", outFile, (fs.statSync(outFile).size / 1e6).toFixed(1) + " MB", dur.toFixed(1) + " s");
})().catch((e) => { console.error("FEHLER", e); process.exit(1); });
