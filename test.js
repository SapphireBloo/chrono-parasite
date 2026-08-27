const { boot, pump } = require("./harness");

let pass = 0, fail = 0;
const failures = [];

function check(name, cond, detail) {
  if (cond) { pass++; console.log("  PASS  " + name); }
  else { fail++; failures.push(name + (detail ? "  -> " + detail : "")); console.log("  FAIL  " + name + (detail ? "  -> " + detail : "")); }
}

function section(t) { console.log("\n" + t); console.log("-".repeat(t.length)); }

const { window, rafQueue, errors } = boot();
const g = (name) => window.eval(name);
let clock = 0;

// ---------------------------------------------------------------- boot
section("Boot");
clock = pump(window, rafQueue, 5, 16.7, 0);
check("no uncaught errors during boot", errors.length === 0, errors.join(" | "));
check("starts on the menu screen", g("currentScreen") === "menu");
check("menu visible, hud hidden",
  !window.document.getElementById("main-menu").classList.contains("hidden") &&
  window.document.getElementById("hud").classList.contains("hidden"));

section("HiDPI backing store");
const cv = window.document.getElementById("gameCanvas");
check("backing store scaled by devicePixelRatio (1920x1080 @2x -> 3840x2160)",
  cv.width === 3840 && cv.height === 2160, `${cv.width}x${cv.height}`);
check("CSS size stays in layout pixels",
  cv.style.width === "1920px" && cv.style.height === "1080px",
  `${cv.style.width} x ${cv.style.height}`);
check("CANVAS_WIDTH stays in CSS pixels", g("CANVAS_WIDTH") === 1920);

section("Audio element deduplication");
check("exactly one #bg-music element",
  window.document.querySelectorAll("#bg-music").length === 1,
  String(window.document.querySelectorAll("#bg-music").length));
check("no eager preload of MP3s",
  window.document.getElementById("bg-music").getAttribute("preload") === "none");

section("Space key no longer hijacked by the name field");
const nameInput = window.document.getElementById("player-name");
let spacePrevented = false;
const evt = new window.KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true, cancelable: true });
Object.defineProperty(evt, "target", { value: nameInput });
nameInput.dispatchEvent(evt);
spacePrevented = evt.defaultPrevented;
check("Space in the name input is not preventDefault()ed", !spacePrevented);
nameInput.value = "Kai The Devourer";
check("multi-word name survives", nameInput.value === "Kai The Devourer");

// ---------------------------------------------------------------- start a run
section("Starting a run");
window.document.getElementById("btn-single").dispatchEvent(new window.Event("click"));
clock = pump(window, rafQueue, 3, 16.7, clock);
check("screen switched to single", g("currentScreen") === "single");
check("player exists with the typed name", g("player.name") === "Kai The Devourer");
check("6 bots spawned", g("bots.length") === 6);
check("obstacles spawned", g("obstacles.length") === 12);
check("wormholes spawned", g("wormholes.length") === 6);
check("orbs spawned", g("orbs.length") === 120);

section("Spawn placement (orbs no longer buried in rocks)");
const buried = g(`
  (function () {
    let n = 0;
    for (const o of orbs) if (pointInsideObstacle(o.x, o.y, 0)) n++;
    return n;
  })()
`);
check("zero orbs inside obstacles", buried === 0, `${buried} buried`);
const botsInRocks = g(`
  (function () {
    let n = 0;
    for (const b of bots) for (const o of obstacles)
      if (distance(b.x, b.y, o.x, o.y) < b.radius + o.r - 1) { n++; break; }
    return n;
  })()
`);
check("no bot spawned overlapping an obstacle", botsInRocks === 0, `${botsInRocks} overlapping`);

section("Delta-time clamp (the alt-tab bug)");
const beforeX = g("player.x"), beforeY = g("player.y");
const timeBefore = g("player.timeRemaining");
// Simulate returning from a 10-second tab-out: one RAF with a huge timestamp.
clock += 10000;
{
  const cbs = rafQueue.splice(0, rafQueue.length);
  for (const cb of cbs) cb(clock);
}
const timeAfter = g("player.timeRemaining");
const moved = Math.hypot(g("player.x") - beforeX, g("player.y") - beforeY);
check("a 10s frame gap drains <= MAX_DT worth of time",
  timeBefore - timeAfter <= 0.06, `drained ${(timeBefore - timeAfter).toFixed(3)}s`);
check("no entity teleport on the recovery frame", moved < 40, `moved ${moved.toFixed(1)}px`);
const wormJump = g(`
  (function () {
    let worst = 0;
    for (let i = 0; i < timeWorm.segments.length - 1; i++) {
      const a = timeWorm.segments[i], b = timeWorm.segments[i + 1];
      worst = Math.max(worst, distance(a.x, a.y, b.x, b.y));
    }
    return worst;
  })()
`);
check("worm body stays contiguous after the gap", wormJump < 60, `max gap ${wormJump.toFixed(1)}px`);

section("Per-blob dash (was one global dash for the whole world)");
g(`
  // Force three bots adult and standing next to a target, then have them all dash.
  bots[0].timeRemaining = 200; bots[1].timeRemaining = 200; bots[2].timeRemaining = 200;
  bots[0].applyTimeAndStatus(0); bots[1].applyTimeAndStatus(0); bots[2].applyTimeAndStatus(0);
  castDash(bots[0], 1, 0); castDash(bots[1], 0, 1); castDash(bots[2], -1, 0);
`);
const simultaneous = g("[bots[0].dash, bots[1].dash, bots[2].dash].filter(Boolean).length");
check("three bots can dash in the same frame", simultaneous === 3, `${simultaneous} of 3`);
check("each dash is independent state",
  g("bots[0].dash !== bots[1].dash && bots[1].dash !== bots[2].dash"));
check("dash puts the caster on cooldown", g("bots[0].dashCooldown") > 0);

section("Dash sub-stepping (tunnelling)");
const hitRegistered = g(`
  (function () {
    // Park a bot exactly one full dash-frame away and dash straight at it.
    const a = bots[3], b = bots[4];
    a.dash = null; b.dash = null;
    a.timeRemaining = 200; b.timeRemaining = 200;
    a.applyTimeAndStatus(0); b.applyTimeAndStatus(0);
    a.x = 1000; a.y = 1000;
    b.x = 1000 + DASH_SPEED * 0.05; b.y = 1000;   // a whole MAX_DT step away
    a.dashCooldown = 0;
    castDash(a, 1, 0);
    updateDashFor(a, 0.05);
    return b.timeRemaining < 200;                 // did the hit land?
  })()
`);
check("dash hits a target a full frame-step away", hitRegistered === true);

section("Bot AI: Chronovore avoidance");
const fleeing = g(`
  (function () {
    // Drop the worm head right on top of a bot and step once.
    const b = bots[5];
    b.dash = null; b.tentacle = null; b.stunTimer = 0;
    b.x = 1500; b.y = 1500;
    for (const s of timeWorm.segments) { s.x = 1500 + 100; s.y = 1500; }
    const before = distance(b.x, b.y, 1600, 1500);
    b.update(0.05, orbs);
    const after = distance(b.x, b.y, 1600, 1500);
    return after > before;
  })()
`);
check("bot moves away from the worm instead of into it", fleeing === true);

section("Leaderboard: no per-frame innerHTML, name is escaped");
const lb = window.document.getElementById("leaderboard");
const before = lb.innerHTML;
clock = pump(window, rafQueue, 30, 16.7, clock);
check("row elements are reused, not rebuilt",
  g("lbRows") && g("lbRows.length") === 4);
g(`player.name = '<img src=x onerror="window.__pwned=1">'; player.timeRemaining = 9999;`);
clock = pump(window, rafQueue, 3, 16.7, clock);
check("malicious name is inert text, not markup",
  window.__pwned === undefined && lb.querySelectorAll("img").length === 0);
check("name still renders as literal text",
  lb.textContent.includes("<img src=x"));
g(`player.name = "Kai The Devourer";`);

section("Pause");
const escDown = () => {
  const e = new window.KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true, cancelable: true });
  Object.defineProperty(e, "target", { value: window.document.body });
  window.dispatchEvent(e);
};
escDown();
clock = pump(window, rafQueue, 2, 16.7, clock);
check("Escape sets paused", g("paused") === true);
check("pause overlay shown",
  !window.document.getElementById("pause-panel").classList.contains("hidden"));
const pausedTime = g("player.timeRemaining");
const pausedX = g("player.x");
clock = pump(window, rafQueue, 60, 16.7, clock);
check("no time drains while paused", g("player.timeRemaining") === pausedTime);
check("nothing moves while paused", g("player.x") === pausedX);
escDown();
clock = pump(window, rafQueue, 5, 16.7, clock);
check("Escape resumes", g("paused") === false);
check("pause overlay hidden",
  window.document.getElementById("pause-panel").classList.contains("hidden"));

section("Stuck keys on blur");
g(`keys["w"] = true; keys["d"] = true;`);
window.dispatchEvent(new window.Event("blur"));
check("blur clears held movement keys", g(`!keys["w"] && !keys["d"]`));

section("Camera clamp on an ultrawide viewport");
g(`CANVAS_WIDTH = 3840; CANVAS_HEIGHT = 1080; player.x = 2400; player.y = 1500; updateCamera();`);
check("camera centres on the world when viewport > world width",
  Math.abs(g("camera.x") - 1500) < 1, `camera.x = ${g("camera.x")}`);
check("vertical axis still tracks the player",
  Math.abs(g("camera.y") - 1500) < 40, `camera.y = ${g("camera.y")}`);
g(`CANVAS_WIDTH = 1920; CANVAS_HEIGHT = 1080;`);

section("Soak test: 3000 frames of live play");
errors.length = 0;

// Instrument the sim so the soak reports what actually happened rather than
// just "it didn't crash". Player time is topped up so the run doesn't end early.
g(`
  window.__stats = { devoured: 0, botDeaths: 0, teleports: 0, dashes: 0, latches: 0, parries: 0 };
  const _kill = killByWorm;
  killByWorm = function (b, x, y) { window.__stats.devoured++; return _kill(b, x, y); };
  const _cast = castDash;
  castDash = function (c, dx, dy) { const had = c.dash; const r = _cast(c, dx, dy); if (!had && c.dash) window.__stats.dashes++; return r; };
  const _tp = handleWormholeTeleportInner;
  handleWormholeTeleportInner = function (b) { const bx = b && b.x, by = b && b.y; const r = _tp(b); if (b && (b.x !== bx || b.y !== by)) window.__stats.teleports++; return r; };
  const _parry = applyShieldParry;
  applyShieldParry = function (d, a) { window.__stats.parries++; return _parry(d, a); };
`);

const t0 = Date.now();
for (let batch = 0; batch < 30; batch++) {
  clock = pump(window, rafQueue, 100, 16.7, clock);
  // Keep the arena busy: top the player up, and restart if the worm got them.
  g(`if (gameOver) { startSinglePlayer(); }
     else if (player) player.timeRemaining = Math.max(player.timeRemaining, 150);`);
}
const elapsed = Date.now() - t0;
const stats = g("window.__stats");
// An idle player standing still WILL eventually get eaten — the Chronovore
// ignores how much time you have banked. That's correct behaviour, so the
// soak just restarts the run when it happens and keeps the sim hot.
check("no runtime errors over 3000 frames", errors.length === 0, errors.slice(0, 3).join(" | "));
const finite = g(`
  (function () {
    const all = [player, ...bots];
    for (const b of all) {
      if (!Number.isFinite(b.x) || !Number.isFinite(b.y) || !Number.isFinite(b.timeRemaining)) return false;
    }
    for (const o of orbs) if (!Number.isFinite(o.x) || !Number.isFinite(o.y)) return false;
    for (const s of timeWorm.segments) if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) return false;
    return true;
  })()
`);
check("no NaN leaked into positions or timers", finite === true);
const inBounds = g(`
  [player, ...bots].every(b =>
    b.x >= -1 && b.x <= WORLD_WIDTH + 1 && b.y >= -1 && b.y <= WORLD_HEIGHT + 1)
`);
check("every blob stayed inside the world", inBounds === true);
const orbCount = g("orbs.length");
check("orb pool stayed sane", orbCount >= 120 && orbCount < 400, String(orbCount));
console.log(`  (3000 frames / ~50s of game time in ${elapsed}ms)`);
console.log(`  events: ${stats.devoured} devoured by worm, ${stats.dashes} dashes, ` +
            `${stats.teleports} wormhole trips, ${stats.parries} shield parries`);
check("Chronovore actually caught things", stats.devoured > 0, `${stats.devoured} devours`);
check("bots used dash", stats.dashes > 0, `${stats.dashes} dashes`);
check("wormholes were used", stats.teleports > 0, `${stats.teleports} trips`);

section("Run results / personal best");
window.localStorage.removeItem("chrono_parasite_best_v1");
window.document.getElementById("btn-single").dispatchEvent(new window.Event("click"));
clock = pump(window, rafQueue, 2, 16.7, clock);
g(`player.name = "Kai The Devourer"; player.timeRemaining = 0; player.deathCause = null;
   player.lastHitBy = bots[0]; runElapsed = 97.5; player.kills = 3; player.orbsCollected = 41;`);
clock = pump(window, rafQueue, 3, 16.7, clock);
check("game over triggered", g("gameOver") === true);
const rp = window.document.getElementById("results-panel");
check("results panel shown", !rp.classList.contains("hidden"));
check("survival time formatted", rp.textContent.includes("1:37"), rp.textContent.replace(/\s+/g, " ").slice(0, 200));
check("kills reported", /Kills/.test(rp.textContent));
check("orbs reported", rp.textContent.includes("41"));
check("cause of death names the killer",
  window.document.getElementById("results-cause").textContent.includes(g("bots[0].name")),
  window.document.getElementById("results-cause").textContent);
check("personal best written to localStorage",
  JSON.parse(window.localStorage.getItem("chrono_parasite_best_v1")).survived > 97,
  window.localStorage.getItem("chrono_parasite_best_v1"));

section("Restart from the results screen");
window.document.getElementById("btn-play-again").dispatchEvent(new window.Event("click"));
clock = pump(window, rafQueue, 5, 16.7, clock);
check("new run started", g("gameOver") === false && g("player.timeRemaining") > 0);
check("results panel hidden again", rp.classList.contains("hidden"));
check("run timer reset", g("runElapsed") < 1);

section("Second run soak (checks nothing leaks between runs)");
errors.length = 0;
clock = pump(window, rafQueue, 1500, 16.7, clock);
check("no errors in run 2", errors.length === 0, errors.slice(0, 3).join(" | "));
check("bots respawn on death (pool stays at 6)", g("bots.length") === 6);

// ---------------------------------------------------------------- summary
console.log("\n" + "=".repeat(52));
console.log(`  ${pass} passed, ${fail} failed`);
if (fail) {
  console.log("\n  Failures:");
  for (const f of failures) console.log("   - " + f);
}
console.log("=".repeat(52));
process.exit(fail ? 1 : 0);
