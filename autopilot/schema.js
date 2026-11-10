// Gibt das Drehbuch-Format und das Vorbild aus der Labor-Datei aus: node autopilot/schema.js
const fs = require("fs"), path = require("path");
const h = fs.readFileSync(path.join(__dirname, "..", "lab", "ki-labor.html"), "utf8");
function grab(n) { // verkettete String-Literale ("a" + "b" ...) bis zum Semikolon einsammeln
  let i = h.indexOf("const " + n + " = ") + n.length + 9, out = "";
  for (;;) {
    while (/[\s+]/.test(h[i])) i++;
    if (h[i] !== '"') break;
    let j = i + 1; while (h[j] !== '"') j += h[j] === "\\" ? 2 : 1;
    out += JSON.parse(h.slice(i, j + 1)); i = j + 1;
  }
  return out;
}
console.log(grab("VIDEO_SCHEMA") + "\n\nVORBILD (nicht kopieren):\n" + grab("VIDEO_EXAMPLE"));
