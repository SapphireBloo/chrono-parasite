// =====================
// CONFIG
// =====================

// Viewport (canvas) size – will be updated to match window
let CANVAS_WIDTH = 960;
let CANVAS_HEIGHT = 540;

// World is bigger than the screen — this is the arena
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 3000;

const START_TIME = 60; // starting time
const BASE_DRAIN_PER_SEC = 1; // passive time loss

// Orbs (time pickups)
const ORB_COUNT = 120;
const ORB_VALUE = 5;
const ORB_RADIUS = 6;

// Bots
const BOT_COUNT = 6;

// Age thresholds (more time = "older")
const ADULT_THRESHOLD = 90;
const ELDER_THRESHOLD = 140;

// Size per age
const YOUNG_RADIUS = 16;
const ADULT_RADIUS = 22;
const ELDER_RADIUS = 28;

// Tentacle (Time Parasite ability) - primary
const TENTACLE_COST = 8;             // seconds spent to cast
const TENTACLE_MAX_DURATION = 3;     // seconds while latched (also used for tether duration)
const TENTACLE_MAX_RANGE = 400;      // max extension
const TENTACLE_BREAK_RANGE = 450;    // if farther than this while latched/tethered -> break
const TENTACLE_DRAIN_RATE = 6;       // victim loses this many "seconds per second"
const TENTACLE_EFFICIENCY = 0.7;     // how much of drained time you actually gain
const TENTACLE_EXTEND_SPEED = 1100;  // units per second for extend/retract

// Dash ability (Adult + Elder)
const DASH_COST = 12;                // base cost to attempt
const DASH_MISS_PENALTY = 15;        // extra cost if you don't hit anyone
const DASH_DURATION = 0.18;          // dash length in seconds
const DASH_SPEED = 1300;             // movement speed during dash
const DASH_HIT_DRAIN = 30;           // seconds stolen from the target
const DASH_EFFICIENCY = 0.8;         // fraction of stolen time given to dasher
const DASH_STUN_DURATION = 0.45;     // stun on dash hit

// Shield / Parry (Elder) – player and bots
const SHIELD_COST = 10;
const SHIELD_DURATION = 0.8;
const SHIELD_COOLDOWN = 3.0;
const SHIELD_STEAL = 20;             // time taken from attacker
const SHIELD_STEAL_EFFICIENCY = 0.9; // fraction of stolen time given to defender
const SHIELD_SLOW_DURATION = 0.6;
const SHIELD_SLOW_FACTOR = 0.4;      // attacker speed multiplier when slowed

// Cooldowns (for HUD & usage gating)
const TENTACLE_COOLDOWN = 1.5;
const DASH_COOLDOWN = 3.0;

// Leaderboard scoring – how much each kill is "worth" in seconds
const KILL_WEIGHT_FOR_LEADERBOARD = 60;

// ===== Barriers / Obstacles =====
const OBSTACLE_COUNT = 12;
const OBSTACLE_RADIUS_MIN = 28;
const OBSTACLE_RADIUS_MAX = 60;

// ===== Tentacle -> Barrier Tether =====
const TETHER_SPEED_MULT = 1.45;     // speed boost while tethered
const TETHER_BUMP_KNOCKBACK = 420;  // how hard you knock others away
const TETHER_BUMP_STUN = 0.12;      // small stagger
const TETHER_BUMP_COOLDOWN = 0.18;  // prevents multi-hits every frame

// ===== Background / Ambience =====
const STAR_COUNT = 260;
const STAR_SPEED_MIN = 6;
const STAR_SPEED_MAX = 18;

const RIPPLE_MIN_INTERVAL = 2.8;   // seconds
const RIPPLE_MAX_INTERVAL = 6.5;   // seconds

// Bot name pool
const BOT_NAMES = [
  "Chronophage",
  "Secondhand Reaper",
  "TickTock",
  "Lag Spike",
  "Sands of Steve",
  "Grandma Clock",
  "Borrowed Time",
  "Deadline",
  "Quantum Jerry",
  "Expired Milk",
  "Hourglass Hank",
  "Doomsday Donna",
  "Clocktopus",
  "Temporal Karen",
  "Déjà Vu",
  "Lost In Queue",
  "Latency Lord",
  "Anxious Alarm",
  "Rusty Stopwatch",
  "Time Taxman"
];

// =====================
// AGE & SIZE HELPERS
// =====================
function getAgeState(timeRemaining) {
  if (timeRemaining >= ELDER_THRESHOLD) return "Elder";
  if (timeRemaining >= ADULT_THRESHOLD) return "Adult";
  return "Young";
}

function getRadiusForAge(ageState) {
  switch (ageState) {
    case "Adult":
      return ADULT_RADIUS;
    case "Elder":
      return ELDER_RADIUS;
    case "Young":
    default:
      return YOUNG_RADIUS;
  }
}

// =====================
// HELPERS
// =====================
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.hypot(dx, dy);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Random full-RGB-ish color for bots (avoid too-dark)
function randomParasiteColor() {
  const r = Math.floor(randRange(60, 255));
  const g = Math.floor(randRange(60, 255));
  const b = Math.floor(randRange(60, 255));
  return `rgb(${r}, ${g}, ${b})`;
}

// Random bot name
function randomBotName() {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
}

// Color helpers for sliders -> hex
function componentToHex(c) {
  const hex = Number(c).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    componentToHex(r) +
    componentToHex(g) +
    componentToHex(b)
  );
}

// =====================
// GLOBAL STATE
// =====================
let canvas, ctx;
let currentScreen = "menu"; // "menu" | "single" | "multi"
let lastTimestamp = 0;

let player = null;
let bots = [];
let gameOver = false;

// Orbs scattered in the world
let orbs = [];

// Obstacles / barriers
let obstacles = [];

// Simple camera that follows the player
const camera = { x: 0, y: 0 };

// Dash is still global (one dash at a time total)
let activeDash = null;

// Mouse position in SCREEN space (relative to canvas)
let mouseScreenX = 0;
let mouseScreenY = 0;

// For parasite animation + FX timing
let gameTime = 0;

// Simple FX manager
let effects = [];

// Preview canvas for lifecycle color preview
let previewCanvas = null;
let previewCtx = null;

// DOM cache
const dom = {};

// Input
const keys = {};
window.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;

  // Space = Elder shield only
  if (e.code === "Space") {
    e.preventDefault();
    tryUseShield(); // player only
  }

  // Simple restart shortcut in single player
  if (currentScreen === "single" && gameOver && e.key.toLowerCase() === "r") {
    startSinglePlayer();
  }
});
window.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

// Player cooldown timers
let tentacleCooldown = 0;
let dashCooldown = 0;

// =====================
// BACKGROUND STATE
// =====================
let bgStars = [];
let bgRipples = [];
let nextRippleTimer = randRange(RIPPLE_MIN_INTERVAL, RIPPLE_MAX_INTERVAL);

function initBackground() {
  bgStars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    bgStars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      r: randRange(0.6, 1.8),
      tw: randRange(0, Math.PI * 2),
      sp: randRange(STAR_SPEED_MIN, STAR_SPEED_MAX),
      par: randRange(0.15, 0.55) // parallax strength
    });
  }
  bgRipples = [];
  nextRippleTimer = randRange(RIPPLE_MIN_INTERVAL, RIPPLE_MAX_INTERVAL);
}

function spawnTimeRipple() {
  bgRipples.push({
    x: randRange(0.15 * CANVAS_WIDTH, 0.85 * CANVAS_WIDTH),
    y: randRange(0.15 * CANVAS_HEIGHT, 0.85 * CANVAS_HEIGHT),
    age: 0,
    lifetime: randRange(1.2, 2.2),
    startR: randRange(12, 26),
    growth: randRange(320, 540),
    rot: randRange(0, Math.PI * 2)
  });
}

function updateBackground(dt) {
  // Star drift + wrap
  for (const s of bgStars) {
    // Gentle drift downward/right
    s.x += (s.sp * 0.45) * dt;
    s.y += (s.sp * 0.85) * dt;

    // Wrap
    if (s.x > CANVAS_WIDTH + 10) s.x = -10;
    if (s.y > CANVAS_HEIGHT + 10) s.y = -10;

    s.tw += dt * randRange(0.8, 1.6);
  }

  // Ripples
  for (let i = bgRipples.length - 1; i >= 0; i--) {
    bgRipples[i].age += dt;
    if (bgRipples[i].age >= bgRipples[i].lifetime) {
      bgRipples.splice(i, 1);
    }
  }

  // Random ripple events
  nextRippleTimer -= dt;
  if (nextRippleTimer <= 0) {
    spawnTimeRipple();
    nextRippleTimer = randRange(RIPPLE_MIN_INTERVAL, RIPPLE_MAX_INTERVAL);
  }
}

function drawBackgroundScreenSpace(ctx) {
  // Base vignette / nebula
  ctx.save();
  const g = ctx.createRadialGradient(
    CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.45, 20,
    CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.55, Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.75
  );
  g.addColorStop(0, "rgba(14, 22, 38, 0.9)");
  g.addColorStop(0.55, "rgba(6, 10, 18, 0.95)");
  g.addColorStop(1, "rgba(4, 6, 10, 1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();

  // Stars
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const s of bgStars) {
    // Parallax responds to camera (during game) — menu uses camera at 0
    const camX = (currentScreen === "single" && player) ? camera.x : WORLD_WIDTH / 2;
    const camY = (currentScreen === "single" && player) ? camera.y : WORLD_HEIGHT / 2;

    // Map camera motion into small screen offsets
    const ox = ((camX / WORLD_WIDTH) - 0.5) * CANVAS_WIDTH * s.par;
    const oy = ((camY / WORLD_HEIGHT) - 0.5) * CANVAS_HEIGHT * s.par;

    const x = s.x - ox;
    const y = s.y - oy;

    const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.tw));
    ctx.fillStyle = `rgba(220, 245, 255, ${0.12 + twinkle * 0.22})`;
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Time fracture ripples (screen-space)
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const r of bgRipples) {
    const t = r.age / r.lifetime; // 0..1
    const rad = r.startR + r.growth * t;
    const a = (1 - t);

    // main ring
    ctx.strokeStyle = `rgba(120, 255, 230, ${0.12 * a})`;
    ctx.lineWidth = 3 * (1 - t * 0.6);
    ctx.beginPath();
    ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
    ctx.stroke();

    // secondary arc "fracture"
    ctx.strokeStyle = `rgba(255,255,255, ${0.08 * a})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r.x, r.y, rad * 0.72, r.rot + t * 2.2, r.rot + t * 2.2 + Math.PI * 1.2);
    ctx.stroke();

    // subtle chroma edge
    ctx.strokeStyle = `rgba(120, 160, 255, ${0.07 * a})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r.x, r.y, rad * 1.05, r.rot - t * 1.1, r.rot - t * 1.1 + Math.PI * 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

// =====================
// ENEMY / FFA HELPERS
// =====================

// Return all other living blobs that are not `self`
function getEnemiesFor(self) {
  const enemies = [];

  if (player && player !== self && player.timeRemaining > 0) {
    enemies.push(player);
  }

  for (const bot of bots) {
    if (bot !== self && bot.timeRemaining > 0) {
      enemies.push(bot);
    }
  }

  return enemies;
}

// Find closest enemy to `self` within an optional max distance
function findClosestEnemy(self, maxDistance = Infinity) {
  const enemies = getEnemiesFor(self);
  let best = null;
  let bestDist = maxDistance;

  for (const enemy of enemies) {
    const d = distance(self.x, self.y, enemy.x, enemy.y);
    if (d < bestDist) {
      bestDist = d;
      best = enemy;
    }
  }

  return { enemy: best, dist: bestDist };
}

// =====================
// OBSTACLES: SPAWN + COLLISION + LOS
// =====================
function spawnObstacles(count) {
  obstacles = [];

  for (let i = 0; i < count; i++) {
    const r = randRange(OBSTACLE_RADIUS_MIN, OBSTACLE_RADIUS_MAX);
    const x = randRange(r + 40, WORLD_WIDTH - r - 40);
    const y = randRange(r + 40, WORLD_HEIGHT - r - 40);

    obstacles.push({ x, y, r });
  }
}

// Push a blob out of overlapping obstacles
function resolveBlobObstacleCollisions(blob) {
  for (const o of obstacles) {
    const dx = blob.x - o.x;
    const dy = blob.y - o.y;
    const d = Math.hypot(dx, dy) || 0.0001;
    const minD = blob.radius + o.r;

    if (d < minD) {
      const nx = dx / d;
      const ny = dy / d;

      const push = (minD - d) + 0.5;
      blob.x += nx * push;
      blob.y += ny * push;

      blob.clampToWorld();
    }
  }
}

// Does a segment from A->B intersect any obstacle circle?
function hasLineOfSight(a, b) {
  const ax = a.x, ay = a.y;
  const bx = b.x, by = b.y;

  const vx = bx - ax;
  const vy = by - ay;
  const vv = vx * vx + vy * vy;

  for (const o of obstacles) {
    const t = vv > 0 ? ((o.x - ax) * vx + (o.y - ay) * vy) / vv : 0;
    const tt = clamp(t, 0, 1);
    const px = ax + vx * tt;
    const py = ay + vy * tt;
    const d = distance(px, py, o.x, o.y);

    if (d <= o.r + 2) return false;
  }
  return true;
}

// =====================
// EFFECTS SYSTEM
// =====================
function spawnEffect(effect) {
  effects.push(effect);
}

function updateEffects(dt) {
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    e.age += dt;
    if (e.age >= e.lifetime) {
      effects.splice(i, 1);
    }
  }
}

function drawEffects(ctx) {
  for (const e of effects) {
    const t = e.age / e.lifetime; // 0 → 1

    switch (e.type) {
      case "impactPulse":
        drawImpactPulse(ctx, e, t);
        break;
      case "orbPop":
        drawOrbPop(ctx, e, t);
        break;
    }
  }
}

function drawImpactPulse(ctx, e, t) {
  const radius = e.startRadius + e.growth * t;
  const alpha = 1 - t;

  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 4 * (1 - t);
  ctx.beginPath();
  ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawOrbPop(ctx, e, t) {
  const r = e.radius * (1 + 0.8 * t);
  const alpha = 1 - t;

  ctx.save();
  ctx.fillStyle = `rgba(255, 224, 102, ${alpha})`;
  ctx.beginPath();
  ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// =====================
// COLOR SELECTION (SLIDERS)
// =====================
function getSelectedColor() {
  if (!dom.colorR || !dom.colorG || !dom.colorB) {
    return "#32e0ff"; // fallback
  }
  const r = parseInt(dom.colorR.value, 10) || 0;
  const g = parseInt(dom.colorG.value, 10) || 0;
  const b = parseInt(dom.colorB.value, 10) || 0;
  return rgbToHex(r, g, b);
}

// =====================
// DOM ELEMENTS
// =====================
function cacheDom() {
  dom.mainMenu = document.getElementById("main-menu");
  dom.hud = document.getElementById("hud");
  dom.multiComing = document.getElementById("multi-coming");

  dom.btnSingle = document.getElementById("btn-single");
  dom.btnMulti = document.getElementById("btn-multi");
  dom.btnExit = document.getElementById("btn-exit");
  dom.btnBackFromMulti = document.getElementById("btn-back-from-multi");

  dom.btnHowToPlay = document.getElementById("btn-how-to-play");
  dom.howPanel = document.getElementById("how-to-play-panel");
  dom.btnHowBack = document.getElementById("btn-how-back");

  dom.hudTime = document.getElementById("hud-time");
  dom.hudAge = document.getElementById("hud-age");

  dom.leaderboard = document.getElementById("leaderboard");

  // Ability HUD elements
  dom.abilityTentacle = document.getElementById("ability-tentacle");
  dom.abilityDash = document.getElementById("ability-dash");
  dom.abilityShield = document.getElementById("ability-shield");

  dom.coolTentacle = dom.abilityTentacle
    ? dom.abilityTentacle.querySelector(".cooldown-overlay")
    : null;
  dom.coolDash = dom.abilityDash
    ? dom.abilityDash.querySelector(".cooldown-overlay")
    : null;
  dom.coolShield = dom.abilityShield
    ? dom.abilityShield.querySelector(".cooldown-overlay")
    : null;

  // Player name input
  dom.playerNameInput = document.getElementById("player-name");

  // Slider-based color controls
  dom.colorR = document.getElementById("color-r");
  dom.colorG = document.getElementById("color-g");
  dom.colorB = document.getElementById("color-b");
  dom.colorRVal = document.getElementById("color-r-val");
  dom.colorGVal = document.getElementById("color-g-val");
  dom.colorBVal = document.getElementById("color-b-val");
  dom.colorSwatch = document.getElementById("color-swatch");

  dom.previewCanvas = document.getElementById("preview-canvas");
  if (dom.previewCanvas) {
    previewCanvas = dom.previewCanvas;
    previewCtx = previewCanvas.getContext("2d");
  }

  // Update preview + swatch when sliders move
  if (dom.colorR && dom.colorG && dom.colorB) {
    const updateColorUI = () => {
      if (dom.colorRVal) dom.colorRVal.textContent = dom.colorR.value;
      if (dom.colorGVal) dom.colorGVal.textContent = dom.colorG.value;
      if (dom.colorBVal) dom.colorBVal.textContent = dom.colorB.value;

      const color = getSelectedColor();
      if (dom.colorSwatch) {
        dom.colorSwatch.style.backgroundColor = color;
      }
      renderPreview();
    };

    dom.colorR.addEventListener("input", updateColorUI);
    dom.colorG.addEventListener("input", updateColorUI);
    dom.colorB.addEventListener("input", updateColorUI);
  }
}

// =====================
// ENTITIES
// =====================

// ---- Orb (time pickup) ----
class Orb {
  constructor() {
    this.radius = ORB_RADIUS;
    this.x = randRange(this.radius, WORLD_WIDTH - this.radius);
    this.y = randRange(this.radius, WORLD_HEIGHT - this.radius);
  }

  draw(ctx) {
    // Time-themed "chronosphere" orb
    const t = gameTime;

    ctx.save();

    // Outer glow
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3.2);
    g.addColorStop(0, "rgba(140, 255, 235, 0.55)");
    g.addColorStop(0.4, "rgba(120, 160, 255, 0.25)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Core
    const core = ctx.createRadialGradient(
      this.x - this.radius * 0.25,
      this.y - this.radius * 0.25,
      this.radius * 0.2,
      this.x,
      this.y,
      this.radius * 1.4
    );
    core.addColorStop(0, "rgba(255,255,255,0.95)");
    core.addColorStop(0.35, "rgba(120, 255, 230, 0.9)");
    core.addColorStop(1, "rgba(10, 12, 20, 0.85)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (1 + 0.18 * Math.sin(t * 5)), 0, Math.PI * 2);
    ctx.fill();

    // Tiny rotating ring
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.9, t * 0.8, t * 0.8 + Math.PI * 1.4);
    ctx.stroke();

    ctx.restore();
  }
}

// ---- Base Blob (shared Player/Bot logic) ----
class BlobBase {
  constructor(x, y, baseColor, displayName) {
    this.x = x;
    this.y = y;
    this.baseColor = baseColor || "#54f2ff"; // stays constant for life
    this.name = displayName || "Parasite";
    this.timeRemaining = START_TIME;
    this.ageState = "Young";
    this.radius = getRadiusForAge(this.ageState);

    this.speedYoung = 220;
    this.speedAdult = 180;
    this.speedElder = 140;

    // Status
    this.stunTimer = 0;
    this.slowTimer = 0;
    this.slowFactor = 1;

    // Shield
    this.shieldTimer = 0;
    this.shieldCooldown = 0;

    // Tentacle (per-blob)
    this.tentacle = null;

    // Combat / scoring
    this.kills = 0;
    this.lastHitBy = null;

    // Tether bump gating
    this.tetherBumpCooldown = 0;

    // Visual wobble so they don't all pulse together
    this.wobblePhase = Math.random() * Math.PI * 2;
  }

  getBaseSpeed() {
    switch (this.ageState) {
      case "Young":
        return this.speedYoung;
      case "Adult":
        return this.speedAdult;
      case "Elder":
      default:
        return this.speedElder;
    }
  }

  getSpeed() {
    const tetherBoost =
      (this.tentacle && this.tentacle.phase === "tethered") ? TETHER_SPEED_MULT : 1;
    return this.getBaseSpeed() * this.slowFactor * tetherBoost;
  }

  // Parasite's personal color (no longer age-based)
  getColor() {
    return this.baseColor;
  }

  applyTimeAndStatus(dt) {
    // Passive time drain
    this.timeRemaining -= BASE_DRAIN_PER_SEC * dt;
    if (this.timeRemaining < 0) this.timeRemaining = 0;

    // Status timers
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      if (this.stunTimer < 0) this.stunTimer = 0;
    }
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowTimer = 0;
        this.slowFactor = 1;
      }
    }
    if (this.shieldTimer > 0) {
      this.shieldTimer -= dt;
      if (this.shieldTimer < 0) this.shieldTimer = 0;
    }
    if (this.shieldCooldown > 0) {
      this.shieldCooldown -= dt;
      if (this.shieldCooldown < 0) this.shieldCooldown = 0;
    }
    if (this.tetherBumpCooldown > 0) {
      this.tetherBumpCooldown -= dt;
      if (this.tetherBumpCooldown < 0) this.tetherBumpCooldown = 0;
    }

    // Update age & size
    this.ageState = getAgeState(this.timeRemaining);
    this.radius = getRadiusForAge(this.ageState);
  }

  clampToWorld() {
    this.x = clamp(this.x, this.radius, WORLD_WIDTH - this.radius);
    this.y = clamp(this.y, this.radius, WORLD_HEIGHT - this.radius);
  }

  draw(ctx) {
    // Parasite-style body
    drawParasiteBody(ctx, this);

    // Time text above
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      Math.ceil(this.timeRemaining),
      this.x,
      this.y - this.radius - 10
    );
    ctx.restore();
  }
}

// ---- Parasite visual helper ----
function drawParasiteBody(ctx, blob) {
  const t = gameTime + (blob.wobblePhase || 0);

  // Pulsing radius
  const pulse = 1 + 0.08 * Math.sin(t * 4);
  const r = blob.radius * pulse;

  const baseColor = blob.baseColor || "#32e0ff";
  const coreColor = "#0b1020";

  // Body gradient
  const bodyGrad = ctx.createRadialGradient(
    blob.x - r * 0.3,
    blob.y - r * 0.3,
    r * 0.2,
    blob.x,
    blob.y,
    r
  );
  bodyGrad.addColorStop(0, "#ffffff");
  bodyGrad.addColorStop(0.25, baseColor);
  bodyGrad.addColorStop(1, "#050608");

  // Tentacle count based on age
  let tentacles;
  if (blob.ageState === "Young") tentacles = 6;
  else if (blob.ageState === "Adult") tentacles = 10;
  else tentacles = 14;

  // Shield visual: Elder spikes during shieldTimer
  const isShielding = (blob.shieldTimer && blob.shieldTimer > 0);

  // Tentacles
  ctx.save();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  for (let i = 0; i < tentacles; i++) {
    const angle =
      (i / tentacles) * Math.PI * 2 +
      0.4 * Math.sin(t * 2 + i);

    const lenBase =
      blob.ageState === "Young"
        ? r * 0.9
        : blob.ageState === "Adult"
        ? r * 1.2
        : r * 1.5;

    const len = lenBase * (1 + 0.12 * Math.sin(t * 3 + i * 1.3));

    const x0 = blob.x;
    const y0 = blob.y;

    // Spikes when shielding
    if (isShielding) {
      const spikeLen = len * 0.85;
      const xt = x0 + Math.cos(angle) * spikeLen;
      const yt = y0 + Math.sin(angle) * spikeLen;

      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(xt, yt);
      ctx.stroke();

      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(xt, yt, 3.8, 0, Math.PI * 2);
      ctx.fill();

      continue;
    }

    const midLen = len * 0.6;
    const tipLen = len;

    const xm = x0 + Math.cos(angle) * midLen;
    const ym = y0 + Math.sin(angle) * midLen;
    const xt = x0 + Math.cos(angle) * tipLen;
    const yt = y0 + Math.sin(angle) * tipLen;

    ctx.strokeStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(xm, ym, xt, yt);
    ctx.stroke();

    // Tip bulb
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(xt, yt, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Main body
  ctx.save();
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Core / "eye"
  ctx.save();
  ctx.fillStyle = coreColor;
  const coreR = r * 0.35;
  const eyeOffsetX = Math.cos(t * 1.8) * r * 0.1;
  const eyeOffsetY = Math.sin(t * 1.5) * r * 0.1;
  ctx.beginPath();
  ctx.arc(blob.x + eyeOffsetX, blob.y + eyeOffsetY, coreR, 0, Math.PI * 2);
  ctx.fill();

  // Small highlight
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.arc(
    blob.x + eyeOffsetX - coreR * 0.3,
    blob.y + eyeOffsetY - coreR * 0.3,
    coreR * 0.35,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Extra shield aura
  if (isShielding) {
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(120,255,230,0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, r * 1.15, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// ---- Player ----
class Player extends BlobBase {
  constructor(colorHex, displayName) {
    super(
      WORLD_WIDTH / 2,
      WORLD_HEIGHT / 2,
      colorHex,
      displayName || "You"
    );
  }

  update(dt) {
    if (this.timeRemaining <= 0) return;

    this.applyTimeAndStatus(dt);

    // Stunned can't move
    if (this.stunTimer > 0) {
      this.clampToWorld();
      resolveBlobObstacleCollisions(this);
      return;
    }

    // If currently dashing, movement is handled by dash system
    if (activeDash && activeDash.source === this && activeDash.phase === "dashing") {
      this.clampToWorld();
      resolveBlobObstacleCollisions(this);
      return;
    }

    // Movement (WASD / arrow keys)
    let inputX = 0;
    let inputY = 0;

    if (keys["w"] || keys["arrowup"]) inputY -= 1;
    if (keys["s"] || keys["arrowdown"]) inputY += 1;
    if (keys["a"] || keys["arrowleft"]) inputX -= 1;
    if (keys["d"] || keys["arrowright"]) inputX += 1;

    const length = Math.hypot(inputX, inputY);

    if (length > 0) {
      const speed = this.getSpeed();
      const nx = inputX / length;
      const ny = inputY / length;

      this.x += nx * speed * dt;
      this.y += ny * speed * dt;
    }

    this.clampToWorld();
    resolveBlobObstacleCollisions(this);
  }
}

// ---- Bot (AI-controlled blob) ----
class Bot extends BlobBase {
  constructor() {
    const x = randRange(100, WORLD_WIDTH - 100);
    const y = randRange(100, WORLD_HEIGHT - 100);
    const color = randomParasiteColor();
    const name = randomBotName();
    super(x, y, color, name);
    this.changeDirCooldown = 0;
    this.dirX = 0;
    this.dirY = 0;
  }

  update(dt, orbs) {
    if (this.timeRemaining <= 0) return;

    this.applyTimeAndStatus(dt);

    // If stunned, do not move
    if (this.stunTimer > 0) {
      this.clampToWorld();
      resolveBlobObstacleCollisions(this);
      return;
    }

    const speed = this.getSpeed();
    this.changeDirCooldown -= dt;

    const LOW_TIME_THRESHOLD = 40;

    if (this.changeDirCooldown <= 0) {
      this.changeDirCooldown = randRange(0.7, 2.0);

      // Find closest orb
      let targetOrb = null;
      let bestOrbDist = Infinity;
      for (const orb of orbs) {
        const d = distance(this.x, this.y, orb.x, orb.y);
        if (d < bestOrbDist) {
          bestOrbDist = d;
          targetOrb = orb;
        }
      }

      // Find closest enemy
      const { enemy: closestEnemy, dist: enemyDist } = findClosestEnemy(this);

      let angle;

      if (this.timeRemaining < LOW_TIME_THRESHOLD && targetOrb) {
        const dx = targetOrb.x - this.x;
        const dy = targetOrb.y - this.y;
        angle = Math.atan2(dy, dx) + randRange(-0.3, 0.3);
      } else if (closestEnemy && enemyDist < 900) {
        const dx = closestEnemy.x - this.x;
        const dy = closestEnemy.y - this.y;
        angle = Math.atan2(dy, dx) + randRange(-0.25, 0.25);
      } else if (targetOrb && bestOrbDist < 800) {
        const dx = targetOrb.x - this.x;
        const dy = targetOrb.y - this.y;
        angle = Math.atan2(dy, dx) + randRange(-0.4, 0.4);
      } else {
        angle = randRange(0, Math.PI * 2);
      }

      this.dirX = Math.cos(angle);
      this.dirY = Math.sin(angle);
    }

    const len = Math.hypot(this.dirX, this.dirY) || 1;

    this.x += (this.dirX / len) * speed * dt;
    this.y += (this.dirY / len) * speed * dt;

    this.clampToWorld();
    resolveBlobObstacleCollisions(this);

    // AI abilities – free-for-all logic
    const enemies = getEnemiesFor(this);

    // Tentacle
    if (!this.tentacle && enemies.length > 0 && Math.random() < dt * 0.4 && this.timeRemaining > TENTACLE_COST) {
      const { enemy: tentacleTarget } = findClosestEnemy(this, TENTACLE_MAX_RANGE * 1.1);
      if (tentacleTarget) {
        if (hasLineOfSight(this, tentacleTarget)) {
          const dx = tentacleTarget.x - this.x;
          const dy = tentacleTarget.y - this.y;
          castTentacle(this, dx, dy);
        }
      }
    }

    // Dash: Adult or Elder
    if (!activeDash && (this.ageState === "Adult" || this.ageState === "Elder") && enemies.length > 0) {
      if (Math.random() < dt * 0.25 && this.timeRemaining > DASH_COST) {
        const { enemy: dashTarget } = findClosestEnemy(this, 600);
        if (dashTarget) {
          const dx = dashTarget.x - this.x;
          const dy = dashTarget.y - this.y;
          castDash(this, dx, dy);
        }
      }
    }

    // Shield: Elder-only
    if (this.ageState === "Elder" && this.shieldCooldown <= 0 && this.shieldTimer <= 0) {
      const { enemy: closeEnemy } = findClosestEnemy(this, 350);
      if (closeEnemy && Math.random() < dt * 0.4) {
        castShield(this);
      }
    }
  }
}

// =====================
// SCREEN / MODE HANDLERS
// =====================
function showMenu() {
  currentScreen = "menu";
  gameOver = false;
  activeDash = null;
  effects = [];
  tentacleCooldown = 0;
  dashCooldown = 0;

  dom.mainMenu.classList.remove("hidden");
  dom.hud.classList.add("hidden");
  dom.multiComing.classList.add("hidden");
  if (dom.howPanel) dom.howPanel.classList.add("hidden");
}

function startSinglePlayer() {
  currentScreen = "single";
  gameOver = false;
  activeDash = null;
  effects = [];
  tentacleCooldown = 0;
  dashCooldown = 0;

  const chosenColor = getSelectedColor();
  let chosenName =
    dom.playerNameInput && dom.playerNameInput.value.trim()
      ? dom.playerNameInput.value.trim()
      : "You";

  player = new Player(chosenColor, chosenName);

  camera.x = player.x;
  camera.y = player.y;

  spawnOrbs(ORB_COUNT);
  spawnObstacles(OBSTACLE_COUNT);
  spawnBots(BOT_COUNT);

  dom.mainMenu.classList.add("hidden");
  dom.hud.classList.remove("hidden");
  dom.multiComing.classList.add("hidden");
  if (dom.howPanel) dom.howPanel.classList.add("hidden");
}

function showMultiplayerComingSoon() {
  currentScreen = "multi";
  activeDash = null;
  effects = [];
  tentacleCooldown = 0;
  dashCooldown = 0;

  dom.mainMenu.classList.add("hidden");
  dom.hud.classList.add("hidden");
  dom.multiComing.classList.remove("hidden");
  if (dom.howPanel) dom.howPanel.classList.add("hidden");
}

// =====================
// WORLD SETUP / ORBS / BOTS
// =====================
function spawnOrbs(count) {
  orbs = [];
  for (let i = 0; i < count; i++) {
    orbs.push(new Orb());
  }
}

function spawnBots(count) {
  bots = [];
  for (let i = 0; i < count; i++) {
    bots.push(new Bot());
  }
}

// Generic orb pickup for any blob (player or bot)
function handleOrbPickupFor(blob) {
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    const distToOrb = distance(blob.x, blob.y, orb.x, orb.y);
    if (distToOrb < blob.radius + orb.radius) {
      blob.timeRemaining += ORB_VALUE;

      // Orb pickup FX
      spawnEffect({
        type: "orbPop",
        x: orb.x,
        y: orb.y,
        radius: orb.radius,
        age: 0,
        lifetime: 0.25
      });

      orbs[i] = new Orb(); // respawn orb
    }
  }
}

// =====================
// SHIELD / PARRY
// =====================
function castShield(caster) {
  if (caster.shieldCooldown > 0 || caster.shieldTimer > 0) return;
  if (caster.timeRemaining <= SHIELD_COST) return;

  caster.timeRemaining -= SHIELD_COST;
  if (caster.timeRemaining < 0) caster.timeRemaining = 0;

  caster.shieldTimer = SHIELD_DURATION;
  caster.shieldCooldown = SHIELD_COOLDOWN;
}

function tryUseShield() {
  if (currentScreen !== "single" || !player || gameOver) return;
  if (player.ageState !== "Elder") return;
  castShield(player);
}

function applyShieldParry(defender, attacker) {
  if (!attacker) return;

  attacker.slowTimer = SHIELD_SLOW_DURATION;
  attacker.slowFactor = SHIELD_SLOW_FACTOR;

  const steal = SHIELD_STEAL;
  attacker.timeRemaining -= steal;
  if (attacker.timeRemaining < 0) attacker.timeRemaining = 0;

  defender.timeRemaining += steal * SHIELD_STEAL_EFFICIENCY;
  defender.lastHitBy = attacker;
}

// =====================
// ABILITIES (Tentacle / Dash)
// =====================

// ---- Tentacle (primary, LMB) ----
function tryUseTentacle() {
  if (currentScreen !== "single" || !player || gameOver) return;

  if (player.tentacle) {
    if (player.tentacle.phase === "retracting") {
      player.tentacle = null;
    } else {
      return;
    }
  }

  if (tentacleCooldown > 0) return;
  castTentacle(player);
}

function castTentacle(caster, dirXOverride, dirYOverride) {
  if (caster.timeRemaining <= TENTACLE_COST) return;

  let dirX, dirY;

  if (typeof dirXOverride === "number" && typeof dirYOverride === "number") {
    dirX = dirXOverride;
    dirY = dirYOverride;
    const mag = Math.hypot(dirX, dirY);
    if (mag === 0) return;
    dirX /= mag;
    dirY /= mag;
  } else {
    if (caster !== player) return;

    const mouseWorldX = mouseScreenX - CANVAS_WIDTH / 2 + camera.x;
    const mouseWorldY = mouseScreenY - CANVAS_HEIGHT / 2 + camera.y;

    dirX = mouseWorldX - caster.x;
    dirY = mouseWorldY - caster.y;
    const mag = Math.hypot(dirX, dirY);
    if (mag === 0) return;
    dirX /= mag;
    dirY /= mag;
  }

  caster.timeRemaining -= TENTACLE_COST;
  if (caster.timeRemaining < 0) caster.timeRemaining = 0;

  caster.tentacle = {
    source: caster,
    target: null,
    targetObstacle: null,
    dirX,
    dirY,
    length: 0,
    phase: "extending",
    remaining: 0
  };

  if (caster === player) {
    tentacleCooldown = TENTACLE_COOLDOWN;
  }
}

// Update tentacle for a single blob
function updateTentacleFor(blob, dt) {
  const t = blob.tentacle;
  if (!t) return;

  const source = t.source || blob;

  if (!source || source.timeRemaining <= 0) {
    blob.tentacle = null;
    return;
  }

  let potentialTargets = getEnemiesFor(source);

  if (t.phase === "extending") {
    t.length += TENTACLE_EXTEND_SPEED * dt;
    if (t.length > TENTACLE_MAX_RANGE) {
      t.length = TENTACLE_MAX_RANGE;
      t.phase = "retracting";
    }

    const tipX = source.x + t.dirX * t.length;
    const tipY = source.y + t.dirY * t.length;

    // 1) barrier tether
    for (const o of obstacles) {
      const dObs = distance(tipX, tipY, o.x, o.y);
      if (dObs <= o.r) {
        t.target = null;
        t.targetObstacle = o;
        t.phase = "tethered";
        t.remaining = TENTACLE_MAX_DURATION;
        return;
      }
    }

    // 2) latch enemy (LOS required)
    for (const target of potentialTargets) {
      if (target.timeRemaining <= 0) continue;
      if (!hasLineOfSight(source, target)) continue;

      const d = distance(tipX, tipY, target.x, target.y);
      if (d < target.radius) {
        if (target.shieldTimer > 0) {
          applyShieldParry(target, source);
          t.phase = "retracting";
          t.target = null;
          t.targetObstacle = null;
        } else {
          t.target = target;
          t.targetObstacle = null;
          t.phase = "latched";
          t.remaining = TENTACLE_MAX_DURATION;
        }
        break;
      }
    }
  } else if (t.phase === "latched") {
    const target = t.target;

    if (!target || target.timeRemaining <= 0) {
      t.phase = "retracting";
      t.target = null;
    } else {
      const distST = distance(source.x, source.y, target.x, target.y);
      if (distST > TENTACLE_BREAK_RANGE) {
        t.phase = "retracting";
        t.target = null;
      } else {
        const drain = TENTACLE_DRAIN_RATE * dt;
        target.timeRemaining -= drain;
        if (target.timeRemaining < 0) target.timeRemaining = 0;

        target.lastHitBy = source;
        source.timeRemaining += drain * TENTACLE_EFFICIENCY;

        t.remaining -= dt;
        if (t.remaining <= 0) {
          t.phase = "retracting";
          t.target = null;
        }
      }
    }
  } else if (t.phase === "tethered") {
    const o = t.targetObstacle;

    if (!o) {
      t.phase = "retracting";
      return;
    }

    const distSO = distance(source.x, source.y, o.x, o.y);
    if (distSO > TENTACLE_BREAK_RANGE) {
      t.phase = "retracting";
      t.targetObstacle = null;
      return;
    }

    t.length = Math.min(TENTACLE_MAX_RANGE, distSO);

    t.remaining -= dt;
    if (t.remaining <= 0) {
      t.phase = "retracting";
      t.targetObstacle = null;
    }
  } else if (t.phase === "retracting") {
    t.length -= TENTACLE_EXTEND_SPEED * dt;
    if (t.length <= 0) {
      blob.tentacle = null;
      return;
    }
  }
}

// Update tentacles for all blobs
function updateAllTentacles(dt) {
  if (player) updateTentacleFor(player, dt);
  for (const bot of bots) updateTentacleFor(bot, dt);
}

// ---- Tentacle render ----
function drawAttackTentacle(ctx, t) {
  const source = t.source;
  if (!source) return;

  let endX, endY;

  if (t.phase === "latched" && t.target) {
    endX = t.target.x;
    endY = t.target.y;
  } else if (t.phase === "tethered" && t.targetObstacle) {
    endX = t.targetObstacle.x;
    endY = t.targetObstacle.y;
  } else {
    endX = source.x + t.dirX * t.length;
    endY = source.y + t.dirY * t.length;
  }

  const dx = endX - source.x;
  const dy = endY - source.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const px = -uy;
  const py = ux;

  const segments = 18;
  const time = gameTime;

  const phaseMul = (t.phase === "latched" || t.phase === "tethered") ? 1.6 : 1.0;
  const ampBase = (t.phase === "latched" || t.phase === "tethered") ? 10 : 7;

  const bodyColor = source.getColor ? source.getColor() : "#9b5de5";

  ctx.save();

  // Outer
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const s = i / segments;
    const baseX = source.x + ux * dist * s;
    const baseY = source.y + uy * dist * s;

    const amp = ampBase * (1 - s * 0.6);
    const wave = Math.sin(time * 10 * phaseMul + s * 12.0) * amp;

    const x = baseX + px * wave;
    const y = baseY + py * wave;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.stroke();

  // Inner
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const s = i / segments;
    const baseX = source.x + ux * dist * s;
    const baseY = source.y + uy * dist * s;

    const amp = (ampBase * 0.4) * (1 - s);
    const wave = Math.sin(time * 14 * phaseMul + s * 18.0 + Math.PI / 3) * amp;

    const x = baseX + px * wave;
    const y = baseY + py * wave;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Tip
  ctx.beginPath();
  ctx.fillStyle =
    (t.phase === "latched" || t.phase === "tethered")
      ? "rgba(255,255,255,0.95)"
      : "rgba(255,255,255,0.8)";
  ctx.arc(endX, endY, 5, 0, Math.PI * 2);
  ctx.fill();

  // LIFE-DRAIN ORBS only when latched to an enemy
  if (t.phase === "latched" && t.target) {
    const lifeCount = 8;
    const lifeSpeed = 1.8;

    for (let i = 0; i < lifeCount; i++) {
      let progress = (gameTime * lifeSpeed + i / lifeCount) % 1;

      const lifeX = endX - ux * dist * progress;
      const lifeY = endY - uy * dist * progress;

      const baseR = 4;
      const rr = baseR * (0.8 + 0.4 * Math.sin(gameTime * 10 + i));
      const alpha = 0.3 + 0.7 * (1 - progress);

      ctx.beginPath();
      ctx.fillStyle = `rgba(180, 255, 210, ${alpha})`;
      ctx.arc(lifeX, lifeY, rr, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(80, 255, 200, ${alpha * 0.8})`;
      ctx.arc(lifeX, lifeY, rr * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// ---- Dash (secondary, RMB) ----
function tryUseDash() {
  if (currentScreen !== "single" || !player || gameOver) return;
  if (activeDash) return;
  if (player.ageState === "Young") return;
  if (dashCooldown > 0) return;
  castDash(player);
}

function castDash(caster, dirXOverride, dirYOverride) {
  if (caster.timeRemaining <= DASH_COST) return;

  let dirX, dirY;

  if (typeof dirXOverride === "number" && typeof dirYOverride === "number") {
    dirX = dirXOverride;
    dirY = dirYOverride;
    const mag = Math.hypot(dirX, dirY);
    if (mag === 0) return;
    dirX /= mag;
    dirY /= mag;
  } else {
    if (caster !== player) return;

    const mouseWorldX = mouseScreenX - CANVAS_WIDTH / 2 + camera.x;
    const mouseWorldY = mouseScreenY - CANVAS_HEIGHT / 2 + camera.y;

    dirX = mouseWorldX - caster.x;
    dirY = mouseWorldY - caster.y;
    const mag = Math.hypot(dirX, dirY);
    if (mag === 0) return;
    dirX /= mag;
    dirY /= mag;
  }

  caster.timeRemaining -= DASH_COST;
  if (caster.timeRemaining < 0) caster.timeRemaining = 0;

  activeDash = {
    source: caster,
    dirX,
    dirY,
    elapsed: 0,
    phase: "dashing",
    hit: false
  };

  if (caster === player) {
    dashCooldown = DASH_COOLDOWN;
  }
}

function updateDash(dt) {
  if (!activeDash) return;

  const d = activeDash;
  const source = d.source;
  if (!source || source.timeRemaining <= 0) {
    activeDash = null;
    return;
  }

  if (d.phase === "dashing") {
    d.elapsed += dt;

    const moveDist = DASH_SPEED * dt;
    source.x += d.dirX * moveDist;
    source.y += d.dirY * moveDist;
    source.clampToWorld();
    resolveBlobObstacleCollisions(source);

    const potentialTargets = getEnemiesFor(source);

    for (const target of potentialTargets) {
      if (target.timeRemaining <= 0) continue;
      const distToTarget = distance(source.x, source.y, target.x, target.y);
      if (distToTarget < source.radius + target.radius) {
        d.phase = "ending";

        if (target.shieldTimer > 0) {
          applyShieldParry(target, source);
          d.hit = true;
        } else {
          d.hit = true;

          target.timeRemaining -= DASH_HIT_DRAIN;
          if (target.timeRemaining < 0) target.timeRemaining = 0;

          target.lastHitBy = source;
          source.timeRemaining += DASH_HIT_DRAIN * DASH_EFFICIENCY;

          target.stunTimer = DASH_STUN_DURATION;

          spawnEffect({
            type: "impactPulse",
            x: target.x,
            y: target.y,
            startRadius: target.radius * 0.7,
            growth: target.radius * 1.8,
            age: 0,
            lifetime: 0.25
          });
        }
        break;
      }
    }

    if (d.elapsed >= DASH_DURATION && d.phase === "dashing") {
      d.phase = "ending";
    }
  }

  if (d.phase === "ending") {
    if (!d.hit) {
      source.timeRemaining -= DASH_MISS_PENALTY;
      if (source.timeRemaining < 0) source.timeRemaining = 0;
    }
    activeDash = null;
  }
}

// =====================
// TETHER BOOST BUMPS
// =====================
function handleTetherBoostBumps() {
  const bumpers = [];

  if (player && player.timeRemaining > 0 && player.tentacle && player.tentacle.phase === "tethered") {
    bumpers.push(player);
  }
  for (const b of bots) {
    if (b.timeRemaining > 0 && b.tentacle && b.tentacle.phase === "tethered") {
      bumpers.push(b);
    }
  }

  for (const attacker of bumpers) {
    if (attacker.tetherBumpCooldown > 0) continue;

    const enemies = getEnemiesFor(attacker);
    for (const target of enemies) {
      if (target.timeRemaining <= 0) continue;

      const d = distance(attacker.x, attacker.y, target.x, target.y);
      if (d < attacker.radius + target.radius) {
        const nx = (target.x - attacker.x) / (d || 1);
        const ny = (target.y - attacker.y) / (d || 1);

        target.x += nx * TETHER_BUMP_KNOCKBACK;
        target.y += ny * TETHER_BUMP_KNOCKBACK;
        target.clampToWorld();
        resolveBlobObstacleCollisions(target);

        target.stunTimer = Math.max(target.stunTimer || 0, TETHER_BUMP_STUN);
        attacker.tetherBumpCooldown = TETHER_BUMP_COOLDOWN;

        spawnEffect({
          type: "impactPulse",
          x: target.x,
          y: target.y,
          startRadius: target.radius * 0.6,
          growth: target.radius * 1.4,
          age: 0,
          lifetime: 0.18
        });

        break;
      }
    }
  }
}

// =====================
// HUD UPDATE + LEADERBOARD
// =====================
function computeLeaderboardScore(e) {
  const time = Math.max(0, e.timeRemaining || 0);
  const kills = e.kills || 0;
  return time + kills * KILL_WEIGHT_FOR_LEADERBOARD;
}

function renderLeaderboardHUD() {
  if (!dom.leaderboard) return;

  const entries = [];
  if (player) entries.push(player);
  for (const b of bots) entries.push(b);

  if (entries.length === 0) {
    dom.leaderboard.innerHTML = "";
    return;
  }

  entries.sort((a, b) => computeLeaderboardScore(b) - computeLeaderboardScore(a));
  const topN = entries.slice(0, 4);

  let html = '<div class="lb-title">Time Leaderboard</div>';

  for (let i = 0; i < topN.length; i++) {
    const e = topN[i];
    const isPlayer = e === player;
    const rank = i + 1;
    const name = e.name || (isPlayer ? "You" : "Bot");
    const time = Math.max(0, Math.floor(e.timeRemaining));
    const kills = e.kills || 0;

    html += `
      <div class="lb-row ${isPlayer ? "lb-row-player" : ""} ${i === 0 ? "lb-row-top" : ""}">
        <span class="lb-rank">${rank}.</span>
        <span class="lb-name">${name}</span>
        <span class="lb-time">${time}s</span>
        <span class="lb-kills">K:${kills}</span>
      </div>
    `;
  }

  dom.leaderboard.innerHTML = html;
}

function updateHUD() {
  if (!player) return;

  dom.hudTime.textContent = `Time: ${Math.ceil(player.timeRemaining)}`;
  dom.hudAge.textContent = `Age: ${player.ageState}`;

  const alive = player.timeRemaining > 0;

  // Tentacle
  if (dom.abilityTentacle && dom.coolTentacle) {
    const cdMax = TENTACLE_COOLDOWN;
    const cd = tentacleCooldown;
    const onCooldown = cd > 0;
    const ratio = cdMax > 0 ? cd / cdMax : 0;

    dom.abilityTentacle.classList.toggle("ability-locked", !alive);
    dom.abilityTentacle.classList.toggle("ability-ready", alive && !onCooldown);

    dom.coolTentacle.style.height = onCooldown ? `${Math.min(1, ratio) * 100}%` : "0%";
  }

  // Dash
  if (dom.abilityDash && dom.coolDash) {
    const hasAge = player.ageState === "Adult" || player.ageState === "Elder";
    const usable = alive && hasAge;

    const cdMax = DASH_COOLDOWN;
    const cd = dashCooldown;
    const onCooldown = cd > 0;
    const ratio = cdMax > 0 ? cd / cdMax : 0;

    dom.abilityDash.classList.toggle("ability-locked", !usable);
    dom.abilityDash.classList.toggle("ability-ready", usable && !onCooldown);

    dom.coolDash.style.height = onCooldown ? `${Math.min(1, ratio) * 100}%` : "0%";
  }

  // Shield
  if (dom.abilityShield && dom.coolShield) {
    const hasAge = player.ageState === "Elder";
    const usable = alive && hasAge;

    const cdMax = SHIELD_COOLDOWN;
    const cd = player.shieldCooldown || 0;
    const onCooldown = cd > 0 || !usable;
    const ratio = cdMax > 0 ? cd / cdMax : 0;

    dom.abilityShield.classList.toggle("ability-locked", !usable);
    dom.abilityShield.classList.toggle("ability-ready", usable && !onCooldown);

    dom.coolShield.style.height = onCooldown ? `${Math.min(1, ratio) * 100}%` : "0%";
  }

  renderLeaderboardHUD();
}

// =====================
// RESPONSIVE SCALING
// =====================
function resizeCanvas() {
  const canvasEl = document.getElementById("gameCanvas");
  const wrapper = document.getElementById("game-wrapper");

  CANVAS_WIDTH = window.innerWidth;
  CANVAS_HEIGHT = window.innerHeight;

  canvasEl.width = CANVAS_WIDTH;
  canvasEl.height = CANVAS_HEIGHT;

  wrapper.style.width = `${CANVAS_WIDTH}px`;
  wrapper.style.height = `${CANVAS_HEIGHT}px`;

  // refresh background buffers to new size
  initBackground();
}

// =====================
// CAMERA UPDATE
// =====================
function updateCamera() {
  if (!player) return;

  camera.x = player.x;
  camera.y = player.y;

  const halfW = CANVAS_WIDTH / 2;
  const halfH = CANVAS_HEIGHT / 2;

  camera.x = clamp(camera.x, halfW, WORLD_WIDTH - halfW);
  camera.y = clamp(camera.y, halfH, WORLD_HEIGHT - halfH);
}

// =====================
// LIFECYCLE PREVIEW RENDER
// =====================
function renderPreview() {
  if (!previewCtx || !previewCanvas) return;

  const w = previewCanvas.width;
  const h = previewCanvas.height;

  previewCtx.clearRect(0, 0, w, h);
  previewCtx.fillStyle = "#050a12";
  previewCtx.fillRect(0, 0, w, h);

  const color = getSelectedColor();

  const midY = h / 2;
  const spacing = w / 4;

  const stages = [
    { label: "Young", x: spacing, ageState: "Young" },
    { label: "Adult", x: 2 * spacing, ageState: "Adult" },
    { label: "Elder", x: 3 * spacing, ageState: "Elder" }
  ];

  stages.forEach(stage => {
    const tempBlob = {
      x: stage.x,
      y: midY,
      radius: getRadiusForAge(stage.ageState),
      ageState: stage.ageState,
      baseColor: color,
      wobblePhase: 0,
      timeRemaining: 100,
      shieldTimer: 0
    };
    drawParasiteBody(previewCtx, tempBlob);

    previewCtx.save();
    previewCtx.fillStyle = "#ffffff";
    previewCtx.font = "10px system-ui";
    previewCtx.textAlign = "center";
    previewCtx.fillText(stage.label, stage.x, h - 6);
    previewCtx.restore();
  });
}

// =====================
// OBSTACLE RENDER (time-themed)
// =====================
function drawObstacles(ctx) {
  for (const o of obstacles) {
    const t = gameTime;

    ctx.save();

    // Base disk
    ctx.fillStyle = "rgba(6, 8, 12, 0.95)";
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();

    // Outer chrono ring
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(80,255,220,0.20)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r + 2, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r * 0.72, 0, Math.PI * 2);
    ctx.stroke();

    // Clock ticks
    const ticks = 12;
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    for (let i = 0; i < ticks; i++) {
      const a = (i / ticks) * Math.PI * 2 + Math.sin(t * 0.25) * 0.05;
      const x0 = o.x + Math.cos(a) * (o.r * 0.78);
      const y0 = o.y + Math.sin(a) * (o.r * 0.78);
      const x1 = o.x + Math.cos(a) * (o.r * 0.96);
      const y1 = o.y + Math.sin(a) * (o.r * 0.96);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    // Rotating hand accent
    const handA = t * 0.8;
    ctx.strokeStyle = "rgba(80,255,220,0.22)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(
      o.x + Math.cos(handA) * (o.r * 0.9),
      o.y + Math.sin(handA) * (o.r * 0.9)
    );
    ctx.stroke();

    // Hourglass silhouette
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(120,160,255,0.08)";
    ctx.beginPath();
    const hgW = o.r * 0.55;
    const hgH = o.r * 0.85;
    ctx.moveTo(o.x - hgW * 0.6, o.y - hgH);
    ctx.quadraticCurveTo(o.x, o.y - hgH * 0.35, o.x - hgW * 0.18, o.y);
    ctx.quadraticCurveTo(o.x, o.y + hgH * 0.35, o.x - hgW * 0.6, o.y + hgH);
    ctx.lineTo(o.x + hgW * 0.6, o.y + hgH);
    ctx.quadraticCurveTo(o.x, o.y + hgH * 0.35, o.x + hgW * 0.18, o.y);
    ctx.quadraticCurveTo(o.x, o.y - hgH * 0.35, o.x + hgW * 0.6, o.y - hgH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Center glow
    ctx.globalCompositeOperation = "screen";
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 0.65);
    g.addColorStop(0, "rgba(80,255,220,0.10)");
    g.addColorStop(0.55, "rgba(120,160,255,0.05)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// =====================
// SINGLE-PLAYER UPDATE & RENDER
// =====================
function updateSingle(dt) {
  if (!player) return;

  if (!gameOver) {
    player.update(dt);
    handleOrbPickupFor(player);

    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      bot.update(dt, orbs);
      handleOrbPickupFor(bot);
    }

    updateAllTentacles(dt);
    updateDash(dt);
    handleTetherBoostBumps();

    // bot deaths
    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      if (bot.timeRemaining <= 0) {
        if (bot.lastHitBy && bot.lastHitBy !== bot) {
          bot.lastHitBy.kills = (bot.lastHitBy.kills || 0) + 1;
        }
        bots[i] = new Bot();
      }
    }

    updateEffects(dt);
    updateCamera();

    if (tentacleCooldown > 0) tentacleCooldown = Math.max(0, tentacleCooldown - dt);
    if (dashCooldown > 0) dashCooldown = Math.max(0, dashCooldown - dt);

    if (player.timeRemaining <= 0 && !gameOver) {
      if (player.lastHitBy && player.lastHitBy !== player) {
        player.lastHitBy.kills = (player.lastHitBy.kills || 0) + 1;
      }
      gameOver = true;
      activeDash = null;
    }
  }
}

function renderSingle() {
  // World-space draw
  ctx.save();
  ctx.translate(
    CANVAS_WIDTH / 2 - camera.x,
    CANVAS_HEIGHT / 2 - camera.y
  );

  // World border
  ctx.save();
  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  ctx.restore();

  // Obstacles
  drawObstacles(ctx);

  // Orbs
  for (const orb of orbs) orb.draw(ctx);

  // Bots
  for (const bot of bots) bot.draw(ctx);

  // Player
  if (player) player.draw(ctx);

  // Tentacles
  if (player && player.tentacle) drawAttackTentacle(ctx, player.tentacle);
  for (const bot of bots) if (bot.tentacle) drawAttackTentacle(ctx, bot.tentacle);

  // Dash ring
  if (activeDash && activeDash.phase === "dashing" && activeDash.source) {
    const s = activeDash.source;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // World-space FX
  drawEffects(ctx);

  ctx.restore();

  if (gameOver) drawGameOver();
  updateHUD();
}

// =====================
// MAIN GAME LOOP
// =====================
function gameLoop(timestamp) {
  const dt = (timestamp - lastTimestamp) / 1000 || 0;
  lastTimestamp = timestamp;

  gameTime = timestamp / 1000;

  // Background always animates (menu + game)
  updateBackground(dt);

  // 1) Draw animated background in screen-space
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackgroundScreenSpace(ctx);

  // 2) Gameplay / Menu overlay
  if (currentScreen === "single") {
    updateSingle(dt);
    renderSingle();
  } else if (currentScreen === "menu") {
    renderPreview();
  }

  requestAnimationFrame(gameLoop);
}

function drawGameOver() {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.font = "32px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Time's Up!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

  ctx.font = "18px system-ui";
  ctx.fillText(
    "Press R to restart or click 'Exit to Menu'",
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2 + 24
  );
  ctx.restore();
}

// =====================
// INIT
// =====================
function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  cacheDom();

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseScreenX = e.clientX - rect.left;
    mouseScreenY = e.clientY - rect.top;
  });

  canvas.addEventListener("mousedown", e => {
    if (e.button === 0) {
      tryUseTentacle();
    } else if (e.button === 2) {
      tryUseDash();
    }
  });

  canvas.addEventListener("contextmenu", e => e.preventDefault());

  dom.btnSingle.addEventListener("click", startSinglePlayer);
  dom.btnMulti.addEventListener("click", showMultiplayerComingSoon);
  dom.btnExit.addEventListener("click", showMenu);
  dom.btnBackFromMulti.addEventListener("click", showMenu);

  // How-to Play panel wiring
  if (dom.btnHowToPlay && dom.howPanel && dom.mainMenu) {
    dom.btnHowToPlay.addEventListener("click", () => {
      dom.mainMenu.classList.add("hidden");
      dom.howPanel.classList.remove("hidden");
    });
  }

  if (dom.btnHowBack && dom.mainMenu && dom.howPanel) {
    dom.btnHowBack.addEventListener("click", () => {
      dom.howPanel.classList.add("hidden");
      dom.mainMenu.classList.remove("hidden");
    });
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  initBackground();

  // initialize swatch + preview from default slider values
  renderPreview();

  showMenu();

  lastTimestamp = performance.now();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("load", init);
