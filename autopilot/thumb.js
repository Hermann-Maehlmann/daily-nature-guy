// Baut ein TikTok-Thumbnail (1080x1920 JPG) aus dem Hook-Bild des Videos plus großem Cover-Text.
// Aufruf: node autopilot/thumb.js out/<slug>.mp4 out/<slug>.json out/<slug>.jpg
// Cover-Text: Feld "thumbnail" im Drehbuch (max. 4 Wörter, ein Wort in *Sternchen* = Akzentfarbe), sonst "titel".
const { chromium } = require("playwright");
const fs = require("fs"), cp = require("child_process"), path = require("path"), os = require("os");
const [mp4, specFile, out] = process.argv.slice(2);
if (!mp4 || !specFile || !out) { console.error("usage: node thumb.js video.mp4 spec.json out.jpg"); process.exit(2); }
const spec = JSON.parse(fs.readFileSync(specFile, "utf8"));
const acc = (spec.farben && spec.farben[2]) || "#ffd400";
const raw = (spec.thumbnail || spec.titel || "").toUpperCase();
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const html = esc(raw).replace(/\*([^*]+)\*/g, '<span class="a">$1</span>');
const frame = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "th-")), "f.jpg");
const at = Math.min(1.2, (spec.szenen && spec.szenen[0] && spec.szenen[0].dauer) || 1.2);
cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(at), "-i", mp4, "-frames:v", "1", "-q:v", "2", frame]);
const bg = "data:image/jpeg;base64," + fs.readFileSync(frame).toString("base64");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(`<html><body style="margin:0;width:1080px;height:1920px;overflow:hidden;font-family:'Inter Display','Inter',sans-serif">
  <div style="position:absolute;inset:0;background:url(${bg}) center/cover;transform:scale(1.12);transform-origin:50% 45%"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(transparent 50%,rgba(0,0,0,.75) 85%)"></div>
  <div style="position:absolute;left:0;right:120px;bottom:560px;text-align:center">
   <div style="display:inline-block;max-width:900px;background:#fff;border:10px solid #000;border-radius:36px;padding:26px 44px;box-shadow:0 18px 0 #000;
    transform:rotate(-4deg);font-weight:900;font-size:112px;line-height:1.0;color:#111;letter-spacing:-2px">${html}</div></div>
  <style>.a{color:${acc};-webkit-text-stroke:6px #000;paint-order:stroke fill}</style></body></html>`);
  await p.screenshot({ path: out, type: "jpeg", quality: 90 }); await b.close();
  console.log("OK " + out + " " + (fs.statSync(out).size / 1024).toFixed(0) + " KB");
})();
