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
        if (url === "http://lab.local/" ) return route.fulfill({ body: fs.readFileSync(LAB, "utf8").replace("(async () => {\n  const C = window.claude;", "window.__videoBox = videoBox; window.__normSpec = normSpec;\n(async () => {\n  const C = window.claude;"), contentType: "text/html; charset=utf-8" });
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
  const dl = page.waitForEvent("download", { timeout: 15 * 60000 });
  await page.evaluate((s) => {
    s = window.__normSpec(s); const box = window.__videoBox(s, () => [], { edit: false });
    box.id = "autopilot-box"; document.body.prepend(box);
    window.__note = () => box.querySelector(".vnote").textContent;
    box.querySelector(".vsave").click();
  }, spec);
  const timer = setInterval(async () => { try { console.log("…", await page.evaluate(() => window.__note())); } catch (_) {} }, 10000);
  const d = await dl; clearInterval(timer);
  const raw = outFile + ".raw";
  await d.saveAs(raw);
  await browser.close();
  // gleichmäßige 30 fps, H.264 + AAC, < 11 MB (Metricool-Limit 12 MB)
  const dur = parseFloat(cp.execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", raw]).toString()) || 30;
  const vk = Math.max(1200, Math.min(6000, Math.floor(10.0e6 * 8 / dur / 1000) - 160));
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-r", "30", "-c:v", "libx264", "-preset", "medium", "-b:v", vk + "k", "-maxrate", vk + "k", "-bufsize", 2 * vk + "k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", outFile]);
  fs.unlinkSync(raw);
  console.log("OK", outFile, (fs.statSync(outFile).size / 1e6).toFixed(1) + " MB", dur.toFixed(1) + " s");
})().catch((e) => { console.error("FEHLER", e); process.exit(1); });
