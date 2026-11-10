// Übersicht aller Grundfiguren: PREVIEW=1.3 node autopilot/v2/render5.js autopilot/v2/szenen/bibliothek.json out/bib
(function () {
  const { g, W, H, reef, cam, fig } = window.KZ;
  const at = (f, x, y, s, o) => { g.save(); g.translate(x, y); g.scale(s, s); f(g, o); g.restore(); };
  KZ.shot("lineup", (lt, d, t) => { reef(t, 0, 0, 1, { sky: ["#1b2a5e","#203a70","#162a4f","#0c1630"], hills: [["#1d4a46","#256058"],["#173b3a","#1e4c49"],["#0f2a2a","#163837"]], corals: false, rays: false, dust: "255,240,180" });
    g.setTransform(1, 0, 0, 1, 0, 0);
    at(fig.fish, 300, 330, .9, { t }); at(fig.insect, 760, 420, .9, { t, walk: 1, wings: true });
    at(fig.bird, 280, 860, .9, { t }); at(fig.mammal, 700, 900, .85, { t, walk: 1 });
    at(fig.crustacean, 300, 1300, .9, { t, walk: 1 }); at(fig.octopus, 780, 1380, .75, { t, mood: "scared" });
    at(fig.snake, 520, 1700, .8, { t }); });
})();
