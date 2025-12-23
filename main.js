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


// =====================
// SPAWN SPACING HELPERS
// =====================
function circlesOverlap(x1, y1, r1, x2, y2, r2, pad = 0) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const rr = r1 + r2 + pad;
  return (dx * dx + dy * dy) < (rr * rr);
}

function isCircleClear(x, y, r, existing, pad = 0) {
  for (const c of existing) {
    if (circlesOverlap(x, y, r, c.x, c.y, c.r, pad)) return false;
  }
  return true;
}
// ===== WORMHOLES (Neutral Teleport) =====
const WORMHOLE_COUNT = 6;

// Visual / collision size (bigger, more readable)
const WORMHOLE_RADIUS = 34;

// Teleport safety cooldown (prevents chain-teleports)
const WORMHOLE_TELEPORT_COOLDOWN = 1.0; // per-blob

// --- Wormhole screen FX + camera pull (player-only feedback) ---
const WORMHOLE_PULL_RADIUS = 260;     // how far the camera tug starts
const WORMHOLE_PULL_STRENGTH = 34;    // max camera offset (pixels)
const WORMHOLE_WARP_RADIUS = 420;     // warp overlay visibility radius
const WORMHOLE_WARP_DURATION = 0.28;  // seconds of extra warp after teleport

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

// =====================
// CHRONOVORE (TIME WORM) HAZARD
// =====================
const WORM_ENABLED = true;
const WORM_NAME = "Chronovore";

// motion / body
const WORM_SEGMENTS = 26;
const WORM_SEGMENT_SPACING = 22;
const WORM_SPEED = 320;
const WORM_TURN_RATE = 2.2; // radians/sec steering smoothness

// kill / collision
const WORM_RADIUS = 22;            // base radius used for closest-point collisions
const WORM_KILL_RADIUS = 34;       // "touch it and die"

// visuals (more threatening)
const WORM_HEAD_SCALE = 1.55;
const WORM_SPIKE_COUNT = 10;
const WORM_AURA_SCALE = 3.0;
const WORM_MAW_OPEN = 0.55;

// spawn burst behavior
const WORM_BURST_SCATTER = 120;    // how far time burst orbs scatter
const WORM_BURST_MIN_ORBS = 4;
const WORM_BURST_MAX_ORBS = 16;

// ===== Chronovore Targeting Behavior =====
const WORM_TARGET_REEVAL_MIN = 1.4;     // seconds
const WORM_TARGET_REEVAL_MAX = 3.2;

const WORM_ROAM_CHANCE = 0.22;         // % of the time he roams instead of chasing a player/bot
const WORM_ROAM_RADIUS = 520;          // roam point radius around current head

const WORM_PLAYER_BIAS = 0.45;         // player is NOT always chosen; this is a mild bias only
const WORM_LEADER_BIAS = 0.35;         // bias toward high score targets
const WORM_NEAR_BIAS = 0.25;           // bias toward nearby targets

const WORM_PERSIST_BONUS = 0.65;       // reduces constant switching (bonus for current target)


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
// MUSIC SYSTEM
// =====================
const MUSIC_STORAGE_KEY = "chrono_parasite_music_v1";

const MUSIC_TRACKS = [
  {
    title: "Quake (Aavirall)",
    artist: "Main Version",
    src: "assets/audio/quake-aavirall-main-version-33794-02-15.mp3"
  },
  {
    title: "Shadow Runner (Mountaineer)",
    artist: "Main Version",
    src: "assets/audio/shadow-runner-mountaineer-main-version-21965-02-22.mp3"
  }
];

const musicState = {
  audioEl: null,
  trackIndex: 0,
  volume: 0.55,
  muted: false,
  unlocked: false
};

function musicLoadSettings() {
  try {
    const raw = localStorage.getItem(MUSIC_STORAGE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (typeof s.trackIndex === "number") musicState.trackIndex = clamp(s.trackIndex, 0, MUSIC_TRACKS.length - 1);
    if (typeof s.volume === "number") musicState.volume = clamp(s.volume, 0, 1);
    if (typeof s.muted === "boolean") musicState.muted = s.muted;
  } catch {}
}

function musicSaveSettings() {
  try {
    localStorage.setItem(
      MUSIC_STORAGE_KEY,
      JSON.stringify({
        trackIndex: musicState.trackIndex,
        volume: musicState.volume,
        muted: musicState.muted
      })
    );
  } catch {}
}

function musicApply() {
  if (!musicState.audioEl) return;
  musicState.audioEl.volume = musicState.volume;
  musicState.audioEl.muted = musicState.muted;
}

function musicLabel() {
  const t = MUSIC_TRACKS[musicState.trackIndex];
  return `${t.title} — ${t.artist}`;
}

function musicUpdateUI() {
  const label = musicLabel();

  const menuNow = document.getElementById("music-nowplaying-menu");
  const hudNow = document.getElementById("music-nowplaying-hud");

  if (menuNow) menuNow.textContent = label;
  if (hudNow) hudNow.textContent = label;

  const menuMute = document.getElementById("music-mute-menu");
  const hudMute = document.getElementById("music-mute-hud");

  const muteText = musicState.muted ? "Unmute" : "Mute";
  if (menuMute) menuMute.textContent = muteText;
  if (hudMute) hudMute.textContent = muteText;

  const menuVol = document.getElementById("music-volume-menu");
  const hudVol = document.getElementById("music-volume-hud");
  if (menuVol) menuVol.value = String(musicState.volume);
  if (hudVol) hudVol.value = String(musicState.volume);

  if (menuMute) menuMute.classList.toggle("is-muted", musicState.muted);
  if (hudMute) hudMute.classList.toggle("is-muted", musicState.muted);
}

function musicSetTrack(index) {
  if (!musicState.audioEl) return;

  musicState.trackIndex = (index + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
  const track = MUSIC_TRACKS[musicState.trackIndex];

  musicState.audioEl.src = track.src;
  musicState.audioEl.load();

  musicApply();
  musicUpdateUI();
  musicSaveSettings();

  musicTryPlay();
}

function musicNext() {
  musicSetTrack(musicState.trackIndex + 1);
}

function musicToggleMute() {
  musicState.muted = !musicState.muted;
  musicApply();
  musicUpdateUI();
  musicSaveSettings();

  if (!musicState.muted) musicTryPlay();
}

function musicSetVolume(v) {
  musicState.volume = clamp(v, 0, 1);
  musicApply();
  musicUpdateUI();
  musicSaveSettings();

  if (!musicState.muted) musicTryPlay();
}

function musicUnlock() {
  if (musicState.unlocked) return;
  musicState.unlocked = true;
  musicTryPlay();
}

function musicTryPlay() {
  if (!musicState.audioEl) return;
  if (musicState.muted) return;

  const p = musicState.audioEl.play();
  if (p && typeof p.then === "function") {
    p.then(() => {}).catch(() => {});
  }
}

function initMusicSystem() {
  musicState.audioEl = document.getElementById("bg-music");
  if (!musicState.audioEl) return;

  musicLoadSettings();

  musicState.audioEl.addEventListener("ended", () => {
    musicNext();
  });

  musicSetTrack(musicState.trackIndex);
  musicApply();
  musicUpdateUI();

  const wire = (scope) => {
    const btnMute = document.getElementById(`music-mute-${scope}`);
    const btnNext = document.getElementById(`music-next-${scope}`);
    const vol = document.getElementById(`music-volume-${scope}`);

    if (btnMute) {
      btnMute.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        musicUnlock();
        musicToggleMute();
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        musicUnlock();
        musicNext();
      });
    }

    if (vol) {
      vol.addEventListener("input", (e) => {
        e.stopPropagation();
        musicUnlock();
        const v = parseFloat(e.target.value);
        if (!Number.isNaN(v)) musicSetVolume(v);
      });
    }
  };

  wire("menu");
  wire("hud");
}

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

function lerp(a, b, t) {
  return a + (b - a) * t;
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

// Wormholes
let wormholes = [];

// Wormhole camera/warp feedback (player-only)
let wormholeWarp = {
  timer: 0,
  x: 0,
  y: 0
};

// Chronovore
let timeWorm = null;

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
  for (const s of bgStars) {
    s.x += (s.sp * 0.45) * dt;
    s.y += (s.sp * 0.85) * dt;

    if (s.x > CANVAS_WIDTH + 10) s.x = -10;
    if (s.y > CANVAS_HEIGHT + 10) s.y = -10;

    s.tw += dt * randRange(0.8, 1.6);
  }

  for (let i = bgRipples.length - 1; i >= 0; i--) {
    bgRipples[i].age += dt;
    if (bgRipples[i].age >= bgRipples[i].lifetime) {
      bgRipples.splice(i, 1);
    }
  }

  nextRippleTimer -= dt;
  if (nextRippleTimer <= 0) {
    spawnTimeRipple();
    nextRippleTimer = randRange(RIPPLE_MIN_INTERVAL, RIPPLE_MAX_INTERVAL);
  }
}

function drawBackgroundScreenSpace(ctx) {
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

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const s of bgStars) {
    const camX = (currentScreen === "single" && player) ? camera.x : WORLD_WIDTH / 2;
    const camY = (currentScreen === "single" && player) ? camera.y : WORLD_HEIGHT / 2;

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

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const r of bgRipples) {
    const t = r.age / r.lifetime;
    const rad = r.startR + r.growth * t;
    const a = (1 - t);

    ctx.strokeStyle = `rgba(120, 255, 230, ${0.12 * a})`;
    ctx.lineWidth = 3 * (1 - t * 0.6);
    ctx.beginPath();
    ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255,255,255, ${0.08 * a})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r.x, r.y, rad * 0.72, r.rot + t * 2.2, r.rot + t * 2.2 + Math.PI * 1.2);
    ctx.stroke();

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

  const PAD = 18;      // extra spacing between obstacles
  const MAX_TRIES = 220;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let t = 0; t < MAX_TRIES; t++) {
      const r = randRange(OBSTACLE_RADIUS_MIN, OBSTACLE_RADIUS_MAX);
      const x = randRange(r + 40, WORLD_WIDTH - r - 40);
      const y = randRange(r + 40, WORLD_HEIGHT - r - 40);

      if (isCircleClear(x, y, r, obstacles, PAD)) {
        obstacles.push({ x, y, r });
        placed = true;
        break;
      }
    }

    // fallback: if crowded, place anyway (rare)
    if (!placed) {
      const r = randRange(OBSTACLE_RADIUS_MIN, OBSTACLE_RADIUS_MAX);
      const x = randRange(r + 40, WORLD_WIDTH - r - 40);
      const y = randRange(r + 40, WORLD_HEIGHT - r - 40);
      obstacles.push({ x, y, r });
    }
  }
}


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

function spawnFloatingText(x, y, text) {
  spawnEffect({
    type: "floatText",
    x, y,
    text,
    age: 0,
    lifetime: 0.9
  });
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
    const t = e.age / e.lifetime;

    switch (e.type) {
      case "impactPulse":
        drawImpactPulse(ctx, e, t);
        break;
      case "orbPop":
        drawOrbPop(ctx, e, t);
        break;
      case "floatText":
        drawFloatText(ctx, e, t);
        break;
      case "wormDevour":
        drawWormDevour(ctx, e, t);
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

function drawFloatText(ctx, e, t) {
  const a = 1 - t;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.font = "18px system-ui";
  ctx.textAlign = "center";
  ctx.fillStyle = `rgba(255, 90, 90, ${0.9 * a})`;
  ctx.fillText(e.text, e.x, e.y - 30 * t);
  ctx.restore();
}

function drawWormDevour(ctx, e, t) {
  const a = 1 - t;
  const rad = e.r * (1 + 2.2 * t);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = `rgba(255, 90, 90, ${0.25 * a})`;
  ctx.lineWidth = 10 * (1 - t * 0.7);
  ctx.beginPath();
  ctx.arc(e.x, e.y, rad, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(120, 255, 230, ${0.18 * a})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(e.x, e.y, rad * 0.65, e.rot + t * 3.2, e.rot + t * 3.2 + Math.PI * 1.35);
  ctx.stroke();

  ctx.restore();
}

// =====================
// COLOR SELECTION (SLIDERS)
// =====================
function getSelectedColor() {
  if (!dom.colorR || !dom.colorG || !dom.colorB) {
    return "#32e0ff";
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

  dom.playerNameInput = document.getElementById("player-name");

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
  constructor(xOverride, yOverride) {
    this.radius = ORB_RADIUS;
    this.x = (typeof xOverride === "number") ? xOverride : randRange(this.radius, WORLD_WIDTH - this.radius);
    this.y = (typeof yOverride === "number") ? yOverride : randRange(this.radius, WORLD_HEIGHT - this.radius);
  }

  draw(ctx) {
    const t = gameTime;

    ctx.save();

    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3.2);
    g.addColorStop(0, "rgba(140, 255, 235, 0.55)");
    g.addColorStop(0.4, "rgba(120, 160, 255, 0.25)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3.2, 0, Math.PI * 2);
    ctx.fill();

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
    this.baseColor = baseColor || "#54f2ff";
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

    // Teleport safety cooldown (wormholes)
    this.teleportCooldown = 0;

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

  getColor() {
    return this.baseColor;
  }

  applyTimeAndStatus(dt) {
    this.timeRemaining -= BASE_DRAIN_PER_SEC * dt;
    if (this.timeRemaining < 0) this.timeRemaining = 0;

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

    // wormhole teleport cooldown
    if (this.teleportCooldown > 0) {
      this.teleportCooldown -= dt;
      if (this.teleportCooldown < 0) this.teleportCooldown = 0;
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

    this.ageState = getAgeState(this.timeRemaining);
    this.radius = getRadiusForAge(this.ageState);
  }

  clampToWorld() {
    this.x = clamp(this.x, this.radius, WORLD_WIDTH - this.radius);
    this.y = clamp(this.y, this.radius, WORLD_HEIGHT - this.radius);
  }

  draw(ctx) {
    drawParasiteBody(ctx, this);

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

  const pulse = 1 + 0.08 * Math.sin(t * 4);
  const r = blob.radius * pulse;

  const baseColor = blob.baseColor || "#32e0ff";
  const coreColor = "#0b1020";

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

  let tentacles;
  if (blob.ageState === "Young") tentacles = 6;
  else if (blob.ageState === "Adult") tentacles = 10;
  else tentacles = 14;

  const isShielding = (blob.shieldTimer && blob.shieldTimer > 0);

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

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(xt, yt, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = coreColor;
  const coreR = r * 0.35;
  const eyeOffsetX = Math.cos(t * 1.8) * r * 0.1;
  const eyeOffsetY = Math.sin(t * 1.5) * r * 0.1;
  ctx.beginPath();
  ctx.arc(blob.x + eyeOffsetX, blob.y + eyeOffsetY, coreR, 0, Math.PI * 2);
  ctx.fill();

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

    if (this.stunTimer > 0) {
      this.clampToWorld();
      resolveBlobObstacleCollisions(this);
      return;
    }

    if (activeDash && activeDash.source === this && activeDash.phase === "dashing") {
      this.clampToWorld();
      resolveBlobObstacleCollisions(this);
      return;
    }

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

// ---- Bot ----
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

      let targetOrb = null;
      let bestOrbDist = Infinity;
      for (const orb of orbs) {
        const d = distance(this.x, this.y, orb.x, orb.y);
        if (d < bestOrbDist) {
          bestOrbDist = d;
          targetOrb = orb;
        }
      }

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

    // Dash
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

    // Shield
    if (this.ageState === "Elder" && this.shieldCooldown <= 0 && this.shieldTimer <= 0) {
      const { enemy: closeEnemy } = findClosestEnemy(this, 350);
      if (closeEnemy && Math.random() < dt * 0.4) {
        castShield(this);
      }
    }
  }
}

// =====================
// WORMHOLES (NEUTRAL TELEPORT) SYSTEM
// =====================

function spawnWormholes(count) {
  wormholes = [];

  const styles = [
    { core: "#050508", glow: [80, 220, 255] },   // teal
    { core: "#060509", glow: [180, 120, 255] },  // violet
    { core: "#070505", glow: [255, 180, 90] }    // amber
  ];

  const PAD = 28;      // extra spacing from obstacles/other wormholes
  const MAX_TRIES = 260;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let t = 0; t < MAX_TRIES; t++) {
      const r = WORMHOLE_RADIUS;
      const x = randRange(r + 100, WORLD_WIDTH - r - 100);
      const y = randRange(r + 100, WORLD_HEIGHT - r - 100);

      // don't stack on obstacles or other wormholes
      if (!isCircleClear(x, y, r, obstacles, PAD)) continue;
      if (!isCircleClear(x, y, r, wormholes, PAD)) continue;

      const style = styles[Math.floor(Math.random() * styles.length)];

      wormholes.push({
        x, y, r,
        phase: randRange(0, Math.PI * 2),
        spin: randRange(0.6, 1.4),
        color: style
      });

      placed = true;
      break;
    }

    // fallback: place anyway (rare)
    if (!placed) {
      const r = WORMHOLE_RADIUS;
      const x = randRange(r + 100, WORLD_WIDTH - r - 100);
      const y = randRange(r + 100, WORLD_HEIGHT - r - 100);
      const style = styles[Math.floor(Math.random() * styles.length)];
      wormholes.push({
        x, y, r,
        phase: randRange(0, Math.PI * 2),
        spin: randRange(0.6, 1.4),
        color: style
      });
    }
  }
}


function pointInsideObstacle(x, y, pad = 0) {
  for (const o of obstacles) {
    if (distance(x, y, o.x, o.y) <= o.r + pad) return true;
  }
  return false;
}

function findSafeTeleportPoint(blob) {
  const pad = (blob?.radius || 18) + 18;

  for (let tries = 0; tries < 40; tries++) {
    const x = randRange(pad, WORLD_WIDTH - pad);
    const y = randRange(pad, WORLD_HEIGHT - pad);

    if (pointInsideObstacle(x, y, pad)) continue;

    // avoid dropping basically on top of wormholes
    let tooClose = false;
    for (const w of wormholes) {
      if (distance(x, y, w.x, w.y) < 120) { tooClose = true; break; }
    }
    if (tooClose) continue;

    // avoid spawning directly in immediate devour proximity
    if (WORM_ENABLED && timeWorm) {
      const info = getClosestWormPoint(x, y);
      if (info.dist < 160) continue;
    }

    return { x, y };
  }

  return { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 };
}

function handleWormholeTeleport(blob) {
  if (!blob || blob.timeRemaining <= 0) return;
  if (blob.teleportCooldown > 0) return;

  for (const w of wormholes) {
    const d = distance(blob.x, blob.y, w.x, w.y);
    if (d <= blob.radius + w.r) {
      // Player-only feedback: screen warp pulse when entering a wormhole
      if (blob === player && wormholeWarp) {
        wormholeWarp.timer = WORMHOLE_WARP_DURATION;
        wormholeWarp.x = w.x;
        wormholeWarp.y = w.y;
      }

      const dest = findSafeTeleportPoint(blob);

      spawnEffect({
        type: "impactPulse",
        x: blob.x,
        y: blob.y,
        startRadius: blob.radius * 0.5,
        growth: blob.radius * 2.6,
        age: 0,
        lifetime: 0.22
      });

      blob.x = dest.x;
      blob.y = dest.y;
      blob.clampToWorld();
      resolveBlobObstacleCollisions(blob);

      spawnEffect({
        type: "impactPulse",
        x: blob.x,
        y: blob.y,
        startRadius: blob.radius * 0.5,
        growth: blob.radius * 2.6,
        age: 0,
        lifetime: 0.22
      });

      blob.teleportCooldown = WORMHOLE_TELEPORT_COOLDOWN;
      return;
    }
  }
}

function drawWormholes(ctx) {
  const t = gameTime;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const w of wormholes) {
    const pulse = 0.6 + 0.4 * Math.sin(t * 2.4 + (w.phase || 0));
    const outer = w.r * (3.2 + 0.4 * pulse);
    const inner = w.r * (1.1 + 0.1 * pulse);

    const c = w.color || { core: "#050508", glow: [80, 220, 255] };
    const gr = c.glow[0], gg = c.glow[1], gb = c.glow[2];

    // Outer accretion glow
    const glowGrad = ctx.createRadialGradient(w.x, w.y, inner, w.x, w.y, outer);
    glowGrad.addColorStop(0.0, `rgba(${gr},${gg},${gb},0.0)`);
    glowGrad.addColorStop(0.35, `rgba(${gr},${gg},${gb},${0.12 + 0.08 * pulse})`);
    glowGrad.addColorStop(0.7, `rgba(${gr},${gg},${gb},${0.18 + 0.12 * pulse})`);
    glowGrad.addColorStop(1.0, "rgba(0,0,0,0)");

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(w.x, w.y, outer, 0, Math.PI * 2);
    ctx.fill();

    // Swirling energy arcs
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(${gr},${gg},${gb},${0.35 + 0.25 * pulse})`;

    for (let i = 0; i < 3; i++) {
      const spin = (w.spin || 1) * (0.6 + i * 0.25);
      const rot = t * spin;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r * (1.8 + i * 0.35), rot, rot + Math.PI * 1.4);
      ctx.stroke();
    }

    // Gravitational lens ring
    ctx.strokeStyle = `rgba(255,255,255,${0.18 + 0.12 * pulse})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w.x, w.y, w.r * 1.05, t * 0.8, t * 0.8 + Math.PI * 1.6);
    ctx.stroke();

    // Event horizon (black core)
    const coreGrad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
    coreGrad.addColorStop(0, "#000000");
    coreGrad.addColorStop(0.7, c.core || "#050508");
    coreGrad.addColorStop(1.0, "rgba(0,0,0,0.9)");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
  }

  ctx.restore();
}

function drawWormholeDistortionOverlay(ctx) {
  if (!player || player.timeRemaining <= 0) return;
  if (!wormholes || wormholes.length === 0) return;

  // Find closest wormhole
  let best = null;
  let bestD = Infinity;
  for (const w of wormholes) {
    const d = distance(player.x, player.y, w.x, w.y);
    if (d < bestD) {
      bestD = d;
      best = w;
    }
  }

  const hasWarpKick = wormholeWarp && wormholeWarp.timer > 0;
  const inRange = best && bestD < WORMHOLE_WARP_RADIUS;

  if (!hasWarpKick && !inRange) return;

  const wx = hasWarpKick ? wormholeWarp.x : best.x;
  const wy = hasWarpKick ? wormholeWarp.y : best.y;

  // World -> Screen
  const sx = (wx - camera.x) + CANVAS_WIDTH / 2;
  const sy = (wy - camera.y) + CANVAS_HEIGHT / 2;

  const nearT = inRange ? clamp(1 - bestD / WORMHOLE_WARP_RADIUS, 0, 1) : 0;
  const kickT = hasWarpKick ? clamp(wormholeWarp.timer / WORMHOLE_WARP_DURATION, 0, 1) : 0;

  const strength = clamp(nearT * 0.65 + kickT * 0.95, 0, 1);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // Subtle wash
  ctx.fillStyle = `rgba(120, 160, 255, ${0.05 * strength})`;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Lensing rings
  const baseR = 70 + 120 * strength;
  const rings = 6;

  for (let i = 0; i < rings; i++) {
    const p = i / (rings - 1);
    const rr = baseR + p * (220 + 140 * strength);
    const wob = Math.sin(gameTime * (2.6 + p * 1.5) + p * 9.0) * (6 + 14 * strength);

    ctx.strokeStyle = `rgba(255,255,255,${(0.04 + 0.05 * strength) * (1 - p)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, rr + wob, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(120, 255, 230, ${(0.035 + 0.06 * strength) * (1 - p)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx + 2 * strength, sy - 1 * strength, rr * 0.92 + wob * 0.75, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(180, 120, 255, ${(0.03 + 0.05 * strength) * (1 - p)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx - 2 * strength, sy + 1 * strength, rr * 1.02 + wob * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Swirl arcs
  ctx.lineWidth = 3;
  for (let k = 0; k < 3; k++) {
    const rot = gameTime * (1.2 + 0.35 * k) * (0.8 + strength);
    const rr = (120 + k * 45) * (1 + 0.35 * strength);

    ctx.strokeStyle = `rgba(255,255,255,${0.06 * strength})`;
    ctx.beginPath();
    ctx.arc(sx, sy, rr, rot, rot + Math.PI * 1.1);
    ctx.stroke();

    ctx.strokeStyle = `rgba(120,255,230,${0.06 * strength})`;
    ctx.beginPath();
    ctx.arc(sx, sy, rr * 0.82, -rot, -rot + Math.PI * 0.95);
    ctx.stroke();
  }

  ctx.restore();
}



// =====================
// TENTACLE AIM INDICATOR (Player)
// =====================
function drawTentacleAimIndicator(ctx, blob) {
  if (!blob || blob.timeRemaining <= 0) return;
  if (currentScreen !== "single") return;
  if (blob !== player) return; // player-only
  if (gameOver) return;
  if (blob.stunTimer > 0) return;
  if (activeDash && activeDash.source === blob && activeDash.phase === "dashing") return;

  // world mouse position
  const mx = mouseScreenX - CANVAS_WIDTH / 2 + camera.x;
  const my = mouseScreenY - CANVAS_HEIGHT / 2 + camera.y;

  let dx = mx - blob.x;
  let dy = my - blob.y;
  const mag = Math.hypot(dx, dy);
  if (mag < 0.001) return;
  dx /= mag; dy /= mag;

  const startX = blob.x + dx * blob.radius;
  const startY = blob.y + dy * blob.radius;

  const previewLen = Math.min(TENTACLE_MAX_RANGE, 220 + blob.radius * 2);
  const endX = blob.x + dx * previewLen;
  const endY = blob.y + dy * previewLen;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // dashed aim ray
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 7]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.setLineDash([]);

  // launch point dot
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(startX, startY, 3.6, 0, Math.PI * 2);
  ctx.fill();

  // soft endpoint bloom to show direction
  ctx.fillStyle = "rgba(120, 255, 230, 0.18)";
  ctx.beginPath();
  ctx.arc(endX, endY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =====================
// CHRONOVORE (TIME WORM) SYSTEM
// =====================
function spawnTimeWorm() {
  const startX = randRange(300, WORLD_WIDTH - 300);
  const startY = randRange(300, WORLD_HEIGHT - 300);
  const startAng = randRange(0, Math.PI * 2);

  const segments = [];
  for (let i = 0; i < WORM_SEGMENTS; i++) {
    segments.push({
      x: startX - Math.cos(startAng) * i * WORM_SEGMENT_SPACING,
      y: startY - Math.sin(startAng) * i * WORM_SEGMENT_SPACING
    });
  }

  timeWorm = {
    segments,
    ang: startAng,
    pulse: randRange(0, Math.PI * 2),

    // targeting state
    targetMode: "chase",  // "chase" | "roam"
    targetId: null,       // entity reference (player/bot) OR null
    roamPoint: { x: startX, y: startY },
    reevaluateTimer: randRange(WORM_TARGET_REEVAL_MIN, WORM_TARGET_REEVAL_MAX)
  };
}
function getAliveEntities() {
  const ents = [];
  if (player && player.timeRemaining > 0) ents.push(player);
  for (const b of bots) if (b.timeRemaining > 0) ents.push(b);
  return ents;
}

function wormPickRoamPoint() {
  const head = timeWorm.segments[0];
  const a = randRange(0, Math.PI * 2);
  const r = randRange(180, WORM_ROAM_RADIUS);
  const x = clamp(head.x + Math.cos(a) * r, 120, WORLD_WIDTH - 120);
  const y = clamp(head.y + Math.sin(a) * r, 120, WORLD_HEIGHT - 120);
  timeWorm.roamPoint.x = x;
  timeWorm.roamPoint.y = y;
}

function wormChooseTarget() {
  const head = timeWorm.segments[0];
  const ents = getAliveEntities();
  if (ents.length === 0) {
    timeWorm.targetMode = "roam";
    timeWorm.targetId = null;
    wormPickRoamPoint();
    return;
  }

  // Sometimes roam instead of chasing a player/bot
  if (Math.random() < WORM_ROAM_CHANCE) {
    timeWorm.targetMode = "roam";
    timeWorm.targetId = null;
    wormPickRoamPoint();
    return;
  }

  timeWorm.targetMode = "chase";

  // Determine "leader" score scale
  let bestScore = 0;
  for (const e of ents) bestScore = Math.max(bestScore, computeLeaderboardScore(e));
  bestScore = Math.max(1, bestScore);

  // Weighted random selection
  let total = 0;
  const weights = [];

  for (const e of ents) {
    const d = distance(head.x, head.y, e.x, e.y);

    // nearer => larger weight (soft)
    const nearW = 1 + WORM_NEAR_BIAS * (1 / (1 + d / 500));

    // higher score => larger weight
    const leaderW = 1 + WORM_LEADER_BIAS * (computeLeaderboardScore(e) / bestScore);

    // mild player bias (NOT dominant)
    const playerW = (e === player) ? (1 + WORM_PLAYER_BIAS) : 1;

    // persistence: prefer current target a bit
    const persistW = (timeWorm.targetId === e) ? (1 + WORM_PERSIST_BONUS) : 1;

    const w = nearW * leaderW * playerW * persistW;

    total += w;
    weights.push({ e, w });
  }

  let r = Math.random() * total;
  for (const item of weights) {
    r -= item.w;
    if (r <= 0) {
      timeWorm.targetId = item.e;
      return;
    }
  }

  // fallback
  timeWorm.targetId = weights[weights.length - 1].e;
}


function updateTimeWorm(dt) {
  if (!WORM_ENABLED) return;
  if (!timeWorm) spawnTimeWorm();
  if (!timeWorm) return;

  // periodically change behavior/targets
  timeWorm.reevaluateTimer -= dt;
  if (timeWorm.reevaluateTimer <= 0) {
    wormChooseTarget();
    timeWorm.reevaluateTimer = randRange(WORM_TARGET_REEVAL_MIN, WORM_TARGET_REEVAL_MAX);
  }

  // if chasing but target died, reroll immediately
  if (timeWorm.targetMode === "chase") {
    const t = timeWorm.targetId;
    if (!t || t.timeRemaining <= 0) {
      wormChooseTarget();
    }
  }

  // determine desired target point
  let tx, ty;
  if (timeWorm.targetMode === "roam") {
    tx = timeWorm.roamPoint.x;
    ty = timeWorm.roamPoint.y;

    // if reached roam point, pick another
    const head = timeWorm.segments[0];
    if (distance(head.x, head.y, tx, ty) < 120) {
      wormPickRoamPoint();
      tx = timeWorm.roamPoint.x;
      ty = timeWorm.roamPoint.y;
    }
  } else {
    const t = timeWorm.targetId;
    if (t && t.timeRemaining > 0) {
      tx = t.x;
      ty = t.y;
    } else {
      // fallback to roam
      timeWorm.targetMode = "roam";
      timeWorm.targetId = null;
      wormPickRoamPoint();
      tx = timeWorm.roamPoint.x;
      ty = timeWorm.roamPoint.y;
    }
  }

  
// steering + avoidance (respect obstacles + wormholes)
  const head = timeWorm.segments[0];

  // base seek vector toward target
  let vx = tx - head.x;
  let vy = ty - head.y;

  const vmag = Math.hypot(vx, vy) || 1;
  vx /= vmag;
  vy /= vmag;

  // avoidance vector from nearby circles
  let ax = 0;
  let ay = 0;

  const addAvoid = (cx, cy, cr) => {
    const dx = head.x - cx;
    const dy = head.y - cy;
    const d = Math.hypot(dx, dy) || 0.0001;

    // influence radius: circle radius + buffer
    const influence = cr + WORM_RADIUS * 2.2 + 60;
    if (d >= influence) return;

    const t = (influence - d) / influence; // 0..1
    const push = (t * t) * 1.35;           // stronger near surface

    ax += (dx / d) * push;
    ay += (dy / d) * push;
  };

  for (const o of obstacles) addAvoid(o.x, o.y, o.r);
  if (typeof wormholes !== "undefined") {
    for (const w of wormholes) addAvoid(w.x, w.y, w.r);
  }

  // combine seek + avoid
  const steerX = vx + ax * 1.25;
  const steerY = vy + ay * 1.25;

  const desired = Math.atan2(steerY, steerX);

  let da = desired - timeWorm.ang;
  while (da > Math.PI) da -= Math.PI * 2;
  while (da < -Math.PI) da += Math.PI * 2;

  const maxTurn = WORM_TURN_RATE * dt;
  da = clamp(da, -maxTurn, maxTurn);
  timeWorm.ang += da;

// move head
  head.x += Math.cos(timeWorm.ang) * WORM_SPEED * dt;
  head.y += Math.sin(timeWorm.ang) * WORM_SPEED * dt;

  head.x = clamp(head.x, 80, WORLD_WIDTH - 80);
  head.y = clamp(head.y, 80, WORLD_HEIGHT - 80);

  // follow segments
  for (let i = 1; i < timeWorm.segments.length; i++) {
    const prev = timeWorm.segments[i - 1];
    const seg = timeWorm.segments[i];

    const dx = seg.x - prev.x;
    const dy = seg.y - prev.y;
    const d = Math.hypot(dx, dy) || 0.0001;

    const desiredD = WORM_SEGMENT_SPACING;
    if (d > desiredD) {
      const nx = dx / d;
      const ny = dy / d;
      seg.x = prev.x + nx * desiredD;
      seg.y = prev.y + ny * desiredD;
    }
  }

  
  // collide worm body against obstacles + wormholes (prevents phasing)
  const resolveCircle = (seg, cx, cy, cr) => {
    const dx = seg.x - cx;
    const dy = seg.y - cy;
    const d = Math.hypot(dx, dy) || 0.0001;
    const minD = cr + WORM_RADIUS * 0.95;

    if (d < minD) {
      const nx = dx / d;
      const ny = dy / d;
      const push = (minD - d) + 0.5;
      seg.x += nx * push;
      seg.y += ny * push;
    }
  };

  for (const seg of timeWorm.segments) {
    for (const o of obstacles) resolveCircle(seg, o.x, o.y, o.r);
    if (typeof wormholes !== "undefined") {
      for (const w of wormholes) resolveCircle(seg, w.x, w.y, w.r);
    }
    seg.x = clamp(seg.x, 80, WORLD_WIDTH - 80);
    seg.y = clamp(seg.y, 80, WORLD_HEIGHT - 80);
  }

timeWorm.pulse += dt * 5.2;
}

function getClosestWormPoint(px, py) {
  if (!timeWorm || !timeWorm.segments || timeWorm.segments.length < 2) {
    return { dist: Infinity, x: 0, y: 0 };
  }

  let bestD = Infinity;
  let bestX = 0;
  let bestY = 0;

  // segment-to-point closest distance
  for (let i = 0; i < timeWorm.segments.length - 1; i++) {
    const a = timeWorm.segments[i];
    const b = timeWorm.segments[i + 1];

    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const wx = px - a.x;
    const wy = py - a.y;

    const vv = vx * vx + vy * vy;
    const t = vv > 0 ? (wx * vx + wy * vy) / vv : 0;
    const tt = clamp(t, 0, 1);

    const cx = a.x + vx * tt;
    const cy = a.y + vy * tt;

    const d = distance(px, py, cx, cy);
    if (d < bestD) {
      bestD = d;
      bestX = cx;
      bestY = cy;
    }
  }

  return { dist: bestD, x: bestX, y: bestY };
}

function wormCheckAndDevour(blob) {
  if (!WORM_ENABLED || !timeWorm || !blob || blob.timeRemaining <= 0) return;

  const info = getClosestWormPoint(blob.x, blob.y);
  const killR = WORM_KILL_RADIUS + blob.radius * 0.25;

  if (info.dist <= killR) {
    killByWorm(blob, info.x, info.y);
  }
}

function burstTimeFrom(blob, x, y) {
  const time = Math.max(0, blob.timeRemaining || 0);
  const rawCount = Math.floor(time / ORB_VALUE);
  const count = clamp(rawCount, WORM_BURST_MIN_ORBS, WORM_BURST_MAX_ORBS);

  for (let i = 0; i < count; i++) {
    const a = randRange(0, Math.PI * 2);
    const r = randRange(18, WORM_BURST_SCATTER);
    const ox = x + Math.cos(a) * r;
    const oy = y + Math.sin(a) * r;

    const px = clamp(ox, ORB_RADIUS, WORLD_WIDTH - ORB_RADIUS);
    const py = clamp(oy, ORB_RADIUS, WORLD_HEIGHT - ORB_RADIUS);

    orbs.push(new Orb(px, py));
  }
}

function killByWorm(blob, x, y) {
  // devour FX + text + burst orbs
  spawnEffect({
    type: "wormDevour",
    x: blob.x,
    y: blob.y,
    r: blob.radius * 1.2,
    rot: randRange(0, Math.PI * 2),
    age: 0,
    lifetime: 0.5
  });

  spawnFloatingText(blob.x, blob.y, `${WORM_NAME} DEVOURS`);

  burstTimeFrom(blob, x, y);

  // instant kill
  blob.timeRemaining = 0;
  blob.stunTimer = 0;
  blob.slowTimer = 0;
  blob.slowFactor = 1;

  // credit: nobody gets kills; it's a hazard
  blob.lastHitBy = null;
}

function drawTimeWorm(ctx) {
  if (!WORM_ENABLED || !timeWorm || !timeWorm.segments) return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const pulse = 0.55 + 0.45 * Math.sin(timeWorm.pulse);
  const time = gameTime;

  // ---- BODY ----
  for (let i = timeWorm.segments.length - 1; i >= 0; i--) {
    const s = timeWorm.segments[i];
    const t = i / (timeWorm.segments.length - 1);

    const thickness = (0.65 + 0.65 * (1 - t));
    const rr = WORM_RADIUS * thickness * (0.92 + 0.14 * pulse);

    const auraR = rr * WORM_AURA_SCALE * (0.85 + 0.15 * Math.sin(time * 4 + i * 0.35));
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, auraR);
    g.addColorStop(0, `rgba(255, 70, 70, ${0.06 + 0.04 * (1 - t)})`);
    g.addColorStop(0.2, `rgba(160, 120, 255, ${0.07})`);
    g.addColorStop(0.45, `rgba(120, 255, 230, ${0.06})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, auraR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(6, 8, 12, ${0.95})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(120, 255, 230, ${0.08 + 0.08 * (1 - t)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(
      s.x, s.y,
      rr * 0.92,
      time * 0.85 + t * 2.1,
      time * 0.85 + t * 2.1 + Math.PI * 1.25
    );
    ctx.stroke();

    const spikeCount = Math.floor(WORM_SPIKE_COUNT * (0.35 + 0.65 * (1 - t)));
    ctx.strokeStyle = `rgba(255, 90, 90, ${0.10 + 0.12 * (1 - t)})`;
    ctx.lineWidth = 2;
    for (let k = 0; k < spikeCount; k++) {
      const a = (k / spikeCount) * Math.PI * 2 + Math.sin(time * 0.7 + i * 0.2) * 0.08;
      const inner = rr * 0.85;
      const outer = rr * (1.25 + 0.2 * pulse);
      const x0 = s.x + Math.cos(a) * inner;
      const y0 = s.y + Math.sin(a) * inner;
      const x1 = s.x + Math.cos(a) * outer;
      const y1 = s.y + Math.sin(a) * outer;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }

  // ---- HEAD ----
  const h = timeWorm.segments[0];
  const n = timeWorm.segments[1] || timeWorm.segments[0];

  const dx = h.x - n.x;
  const dy = h.y - n.y;
  const ang = Math.atan2(dy, dx);

  const headR = WORM_RADIUS * WORM_HEAD_SCALE * (0.95 + 0.08 * pulse);

  const hg = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, headR * 3.1);
  hg.addColorStop(0, "rgba(255, 110, 110, 0.18)");
  hg.addColorStop(0.25, "rgba(120, 160, 255, 0.12)");
  hg.addColorStop(0.6, "rgba(120, 255, 230, 0.10)");
  hg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.arc(h.x, h.y, headR * 3.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(8, 10, 14, 0.98)";
  ctx.beginPath();
  ctx.arc(h.x, h.y, headR, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.rotate(ang);

  ctx.strokeStyle = "rgba(255, 80, 80, 0.7)";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  const mawLen = headR * 0.95;
  const open = headR * WORM_MAW_OPEN * (0.7 + 0.3 * pulse);
  ctx.moveTo(-mawLen * 0.2, -open);
  ctx.lineTo(mawLen, -open * 0.25);
  ctx.moveTo(-mawLen * 0.2, open);
  ctx.lineTo(mawLen, open * 0.25);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  const teeth = 9;
  for (let i = 0; i < teeth; i++) {
    const tt = i / (teeth - 1);
    const x = lerp(-mawLen * 0.05, mawLen * 0.85, tt);
    const y = lerp(-open * 0.85, -open * 0.15, tt);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + headR * 0.08, y + headR * 0.14);
    ctx.stroke();

    const y2 = lerp(open * 0.85, open * 0.15, tt);
    ctx.beginPath();
    ctx.moveTo(x, y2);
    ctx.lineTo(x + headR * 0.08, y2 - headR * 0.14);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "screen";
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, headR * 0.65);
  core.addColorStop(0, "rgba(255,255,255,0.95)");
  core.addColorStop(0.25, "rgba(255, 90, 90, 0.85)");
  core.addColorStop(0.55, "rgba(120, 160, 255, 0.35)");
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, headR * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.font = "12px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(WORM_NAME, 0, -headR * 1.1);

  ctx.restore();
  ctx.restore();
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
  spawnWormholes(WORMHOLE_COUNT);
  spawnBots(BOT_COUNT);
  spawnTimeWorm();

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

function handleOrbPickupFor(blob) {
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    const distToOrb = distance(blob.x, blob.y, orb.x, orb.y);
    if (distToOrb < blob.radius + orb.radius) {
      blob.timeRemaining += ORB_VALUE;

      spawnEffect({
        type: "orbPop",
        x: orb.x,
        y: orb.y,
        radius: orb.radius,
        age: 0,
        lifetime: 0.25
      });

      orbs[i] = new Orb();
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

    // barrier tether
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

    // latch enemy (LOS required)
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

function updateAllTentacles(dt) {
  if (player) updateTentacleFor(player, dt);
  for (const bot of bots) updateTentacleFor(bot, dt);
}

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

  ctx.beginPath();
  ctx.fillStyle =
    (t.phase === "latched" || t.phase === "tethered")
      ? "rgba(255,255,255,0.95)"
      : "rgba(255,255,255,0.8)";
  ctx.arc(endX, endY, 5, 0, Math.PI * 2);
  ctx.fill();

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

// ---- Dash ----
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

  initBackground();
}

// =====================
// CAMERA UPDATE
// =====================
function updateCamera() {
  if (!player) return;

  camera.x = player.x;
  camera.y = player.y;


  // --- Wormhole gravity pull (subtle camera-only tug) ---
  if (wormholes && wormholes.length > 0 && player && player.timeRemaining > 0) {
    let best = null;
    let bestD = Infinity;

    for (const w of wormholes) {
      const d = distance(player.x, player.y, w.x, w.y);
      if (d < bestD) {
        bestD = d;
        best = w;
      }
    }

    if (best && bestD < WORMHOLE_PULL_RADIUS) {
      const t = clamp(1 - bestD / WORMHOLE_PULL_RADIUS, 0, 1);
      const dx = best.x - player.x;
      const dy = best.y - player.y;
      const mag = Math.hypot(dx, dy) || 1;

      const pull = WORMHOLE_PULL_STRENGTH * (t * t);
      camera.x += (dx / mag) * pull;
      camera.y += (dy / mag) * pull;
    }
  }


  // subtle shake when Chronovore is VERY close
  if (WORM_ENABLED && timeWorm && player && player.timeRemaining > 0) {
    const info = getClosestWormPoint(player.x, player.y);
    const t = clamp(1 - info.dist / 220, 0, 1);
    if (t > 0) {
      camera.x += randRange(-6, 6) * t;
      camera.y += randRange(-6, 6) * t;
    }
  }

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

    ctx.fillStyle = "rgba(6, 8, 12, 0.95)";
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(80,255,220,0.20)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r + 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r * 0.72, 0, Math.PI * 2);
    ctx.stroke();

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
    handleWormholeTeleport(player);

    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      bot.update(dt, orbs);
      handleOrbPickupFor(bot);
      handleWormholeTeleport(bot);
    }

    updateAllTentacles(dt);
    updateDash(dt);
    handleTetherBoostBumps();

    // Chronovore updates + devour checks
    updateTimeWorm(dt);
    wormCheckAndDevour(player);
    for (const b of bots) wormCheckAndDevour(b);

    // bot deaths (combat + hazards)
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

    if (wormholeWarp && wormholeWarp.timer > 0) wormholeWarp.timer = Math.max(0, wormholeWarp.timer - dt);

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

  // Wormholes
  drawWormholes(ctx);

  // Orbs
  for (const orb of orbs) orb.draw(ctx);

  // Chronovore
  drawTimeWorm(ctx);

  // Bots
  for (const bot of bots) bot.draw(ctx);

  // Player
  if (player) player.draw(ctx);

  // Aim indicator (under tentacle)
  drawTentacleAimIndicator(ctx, player);

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

  // wormhole lensing / distortion overlay (screen-space)
  drawWormholeDistortionOverlay(ctx);

  // danger vignette when Chronovore is near player
  if (WORM_ENABLED && timeWorm && player && player.timeRemaining > 0) {
    const info = getClosestWormPoint(player.x, player.y);
    const t = clamp(1 - info.dist / 420, 0, 1);
    if (t > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 40, 40, ${0.18 * t})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.restore();
    }
  }

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

  updateBackground(dt);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackgroundScreenSpace(ctx);

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

  initMusicSystem();

  canvas.addEventListener("mousedown", () => {
    musicUnlock();
  });

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

  if (dom.btnSingle) dom.btnSingle.addEventListener("click", () => {
    musicUnlock();
    startSinglePlayer();
  });

  if (dom.btnMulti) dom.btnMulti.addEventListener("click", () => {
    musicUnlock();
    showMultiplayerComingSoon();
  });

  if (dom.btnExit) dom.btnExit.addEventListener("click", () => {
    musicUnlock();
    showMenu();
  });

  if (dom.btnBackFromMulti) dom.btnBackFromMulti.addEventListener("click", () => {
    musicUnlock();
    showMenu();
  });

  if (dom.btnHowToPlay && dom.howPanel && dom.mainMenu) {
    dom.btnHowToPlay.addEventListener("click", () => {
      musicUnlock();
      dom.mainMenu.classList.add("hidden");
      dom.howPanel.classList.remove("hidden");
    });
  }

  if (dom.btnHowBack && dom.mainMenu && dom.howPanel) {
    dom.btnHowBack.addEventListener("click", () => {
      musicUnlock();
      dom.howPanel.classList.add("hidden");
      dom.mainMenu.classList.remove("hidden");
    });
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  initBackground();

  renderPreview();

  showMenu();

  lastTimestamp = performance.now();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("load", init);
