// Headless runner for Chrono Parasite.
// Loads the real index.html + main.js under jsdom with a stubbed 2D context,
// then drives requestAnimationFrame manually so the actual game loop executes.

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

function makeCtxStub() {
  const noop = () => {};
  const gradient = { addColorStop: noop };
  const ctx = {
    canvas: null,
    save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    setTransform: noop, resetTransform: noop, transform: noop,
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop,
    arc: noop, arcTo: noop, ellipse: noop, rect: noop, roundRect: noop,
    quadraticCurveTo: noop, bezierCurveTo: noop,
    fill: noop, stroke: noop, clip: noop,
    fillRect: noop, strokeRect: noop, clearRect: noop,
    fillText: noop, strokeText: noop,
    drawImage: noop, putImageData: noop,
    setLineDash: noop, getLineDash: () => [],
    measureText: () => ({ width: 10 }),
    createRadialGradient: () => gradient,
    createLinearGradient: () => gradient,
    createPattern: () => null,
    createImageData: () => ({ data: [] }),
    getImageData: () => ({ data: [] }),
  };
  return ctx;
}

function boot() {
  let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

  // Strip the real <script src> — jsdom can't fetch it, and we need our canvas
  // stub installed before main.js runs. It's re-injected as an inline script
  // below so that top-level let/const land in the page's global scope
  // (window.eval of the same source would scope them to the eval instead).
  html = html.replace(/<script src="main\.js"><\/script>/, "");

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: false,
    url: "http://localhost/",
  });

  const { window } = dom;

  // Canvas: jsdom has no 2D backend, so hand back a stub.
  window.HTMLCanvasElement.prototype.getContext = function () {
    const c = makeCtxStub();
    c.canvas = this;
    return c;
  };

  // Audio: never actually play.
  window.HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
  window.HTMLMediaElement.prototype.pause = function () {};
  window.HTMLMediaElement.prototype.load = function () {};

  // WebAudio is absent in jsdom. Leaving it undefined exercises the
  // "no AudioContext available" branch of the SFX engine.
  window.AudioContext = undefined;
  window.webkitAudioContext = undefined;

  window.innerWidth = 1920;
  window.innerHeight = 1080;
  window.devicePixelRatio = 2;

  // Manual RAF pump.
  const rafQueue = [];
  window.requestAnimationFrame = (cb) => { rafQueue.push(cb); return rafQueue.length; };
  window.cancelAnimationFrame = () => {};

  const errors = [];
  window.addEventListener("error", (e) => errors.push(String(e.error || e.message)));
  window.onerror = (msg) => errors.push(String(msg));

  const code = fs.readFileSync(path.join(__dirname, "main.js"), "utf8");
  const tag = window.document.createElement("script");
  tag.textContent = code;
  window.document.body.appendChild(tag);

  window.dispatchEvent(new window.Event("load"));

  return { dom, window, rafQueue, errors };
}

// Advance the loop by `frames` steps of `stepMs` each.
function pump(window, rafQueue, frames, stepMs, t0) {
  let t = t0;
  for (let i = 0; i < frames; i++) {
    const cbs = rafQueue.splice(0, rafQueue.length);
    if (cbs.length === 0) throw new Error("RAF queue drained — game loop stopped");
    t += stepMs;
    for (const cb of cbs) cb(t);
  }
  return t;
}

module.exports = { boot, pump };
