/* ======================== MAP (locked) ======================== */
const map = L.map("map", {
  zoomControl: false,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  touchZoom: false,
}).setView([-37.8136, 144.9631], 12);

const lightTiles = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  { subdomains: "abcd", maxZoom: 20 }
);
const darkTiles = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  { subdomains: "abcd", maxZoom: 20 }
);

const melbBounds = L.latLngBounds(L.latLng(-38.4, 144.2), L.latLng(-37.4, 145.6));
map.setView([-37.8136, 144.9631], 12);

// optional guide
const guideLng = 145.0;
L.polyline(
  [[melbBounds.getSouth(), guideLng], [melbBounds.getNorth(), guideLng]],
  { className: "guide-line", interactive: false }
).addTo(map);

/* ==================== DAY / NIGHT MAP STYLE ==================== */
const DAY_START_HOUR   = 7;
const DAY_START_MINUTE = 0;
const NIGHT_START_HOUR   = 18;
const NIGHT_START_MINUTE = 0;

function getIsDay() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const minsNow = h * 60 + m;

  const dayStart   = DAY_START_HOUR * 60 + DAY_START_MINUTE;
  const nightStart = NIGHT_START_HOUR * 60 + NIGHT_START_MINUTE;

  if (dayStart < nightStart) {
    return minsNow >= dayStart && minsNow < nightStart;
  } else {
    return minsNow >= dayStart || minsNow < nightStart;
  }
}

function setMapStyle() {
  const title = document.getElementById("bigTitle");
  if (getIsDay()) {
    map.addLayer(lightTiles);
    map.removeLayer(darkTiles);
    if (title) { title.style.color = "#353535"; title.style.opacity = "0.4"; }
  } else {
    map.addLayer(darkTiles);
    map.removeLayer(lightTiles);
    if (title) { title.style.color = "#ffd84d"; title.style.opacity = "0.6"; }
  }
}
setMapStyle();
setInterval(setMapStyle, 60 * 1000);

/* =========================== POIs ============================== */
const POIS = [
  { name:"Melbourne CBD", lat:-37.8136, lng:144.9631, category:"Central Melbourne", video:"video/cbd.mp4",        signature:"Tram bell & city bustle" },
  { name:"Fitzroy",       lat:-37.7994, lng:144.9830, category:"Central Melbourne", video:"video/fitzroy.mp4",    signature:"Street art & café chatter" },
  { name:"Richmond",      lat:-37.8183, lng:144.9980, category:"Central Melbourne", video:"richmond.mp4",         signature:"Footy crowds & pubs" },
  { name:"Carlton",       lat:-37.8009, lng:144.9669, category:"Central Melbourne", video:"carlton.mp4",          signature:"Espresso machines & chatter" },
  { name:"Southbank",     lat:-37.8230, lng:144.9640, category:"Central Melbourne", video:"southbank.mp4",        signature:"River ambience & buskers" },
  { name:"Brunswick",     lat:-37.7650, lng:144.9610, category:"Central Melbourne", video:"brunswick.mp4",        signature:"Live music & buzzing bars" },
  { name:"Collingwood",   lat:-37.8045, lng:144.9860, category:"Central Melbourne", video:"collingwood.mp4",      signature:"Studios & brewery hum" },
  { name:"St Kilda",      lat:-37.8676, lng:144.9809, category:"Coastal",           video:"video/stkilda.mp4",    signature:"Waves & gulls" },
  { name:"Brighton",      lat:-37.9056, lng:145.0160, category:"Coastal",           video:"video/brighton.mp4",   signature:"Beach breeze & footsteps" },
  { name:"Port Melbourne",lat:-37.8380, lng:144.9390, category:"Coastal",           video:"portmelb.mp4",         signature:"Ferries & harbor wind" },
  { name:"Williamstown",  lat:-37.8610, lng:144.8960, category:"Coastal",           video:"williamstown.mp4",     signature:"Boats & seagulls" },
  { name:"Elwood",        lat:-37.8890, lng:144.9840, category:"Coastal",           video:"elwood.mp4",           signature:"Joggers by the bay" },
  { name:"Nunawading",    lat:-37.8183, lng:145.1737, category:"Greater Melbourne", video:"nunawading.mp4",       signature:"Suburban calm & trains" },
  { name:"Chadstone",     lat:-37.8850, lng:145.0820, category:"Greater Melbourne", video:"chadstone.mp4",        signature:"Mall ambience" },
  { name:"Camberwell",    lat:-37.8350, lng:145.0710, category:"Greater Melbourne", video:"camberwell.mp4",       signature:"Trams & suburban life" },
  { name:"Footscray",     lat:-37.7995, lng:144.9319, category:"Greater Melbourne", video:"footscray.mp4",        signature:"Markets & trains" },
  { name:"Greensborough", lat:-37.7000, lng:145.1000, category:"Greater Melbourne", video:"greens.mp4",           signature:"Birdsong & creek" },
  { name:"Burwood",       lat:-37.8485, lng:145.1082, category:"Greater Melbourne", video:"burwood.mp4",          signature:"Busy Streets & Diversity" },
  { name:"AAMI Park",     lat:-37.8251, lng:144.9837, category:"Landmarks",         video:"aamipark.mp4",         signature:"Roaring Crowds & Intense Sports" },
  { name:"MCG",           lat:-37.8199, lng:144.9832, category:"Landmarks",         video:"mcg.mp4",              signature:"Fans Cheering & Celebrity Performances" },
  { name:"Kew",           lat:-37.8021, lng:145.0318, category:"Greater Melbourne", video:"kew.mp4",              signature:"???" },
  { name:"South Yarra",   lat:-37.8380, lng:144.9911, category:"Central Melbourne", video:"yarra.mp4",            signature:"Turbo Whistles & Tram Bells"},
  { name:"Doncaster",     lat:-37.7830, lng:145.1224, category:"Greater Melbourne", video:"doncaster.mp4",        signature:"???"},
  { name:"Malvern",       lat:-37.8584, lng:145.0303, category:"Greater Melbourne", video:"malvern.mp4",          signature:"???"},
  { name:"Crown Casino",  lat:-37.8233, lng:144.9586, category:"Landmarks",         video:"crown.mp4",            signature:"Slot Machines Ding & Chips Falling"},
  { name:"Fed Square",    lat:-37.8177, lng:144.9693, category:"Landmarks",         video:"fedsquare.mp4",        signature:"Where City Sounds Converge & Never Sleep"},
  { name:"Vic Markets",   lat:-37.8145, lng:144.9604, category:"Landmarks",         video:"vicmarket.mp4",        signature:"Sounds of Bartering & Diverse Beats"},
  { name:"Melb Central",  lat:-37.8107, lng:144.9627, category:"Landmarks",         video:"markets.mp4",          signature:"Busy Crowds & Clock Chimes"},
];

/* hook glow dots: open glass + toggle sound (no visual changes) */
function addGlowingDot(poi) {
  const dotIcon = L.divIcon({ html: '<div class="glow-dot"></div>', className: '', iconSize: [16, 16] });
  L.marker([poi.lat, poi.lng], { icon: dotIcon })
    .addTo(map)
    .on("click", () => {
      openGlass(poi);
      AudioEngine.toggleForPoint(poi);
    });
}
POIS.forEach(addGlowingDot);

/* ===================== GLASS CARD LOGIC ======================= */
const overlay  = document.getElementById("overlay");
const glass    = document.getElementById("glass");
const videoEl  = document.getElementById("glassVideo");
const placeEl  = document.getElementById("placeName");
const groupEl  = document.getElementById("groupName");
const groupPill= document.getElementById("groupPill");
const soundEl  = document.getElementById("sigSound");
const closeBtn = document.getElementById("closeBtn");

function openGlass(poi) {
  placeEl.textContent = poi.name;
  soundEl.textContent = poi.signature || "—";
  groupEl.textContent = poi.category;

  groupPill.className = "group-pill";
  if (poi.category === "Central Melbourne") groupPill.classList.add("group-central");
  if (poi.category === "Coastal")           groupPill.classList.add("group-coastal");
  if (poi.category === "Greater Melbourne") groupPill.classList.add("group-greater");
  if (poi.category === "Landmarks")         groupPill.classList.add("group-landmark");

  videoEl.src = poi.video;
  videoEl.play().catch(() => {});

  overlay.classList.add("show");
  glass.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}
function closeGlass() {
  glass.classList.remove("show");
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  videoEl.pause(); videoEl.currentTime = 0; videoEl.removeAttribute("src"); videoEl.load();
}
overlay.addEventListener("click", closeGlass);
closeBtn.addEventListener("click", closeGlass);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeGlass(); });

/* ================= REAL WEATHER (Open-Meteo) ================== */
const USE_GEOLOCATION = false;
const MELB = { lat: -37.8136, lon: 144.9631, label: "Melbourne" };

const WX_CODE = {
  0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
  45:["Fog","🌫️"],48:["Rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Heavy drizzle","🌦️"],
  56:["Freezing drizzle","🌧️"],57:["Freezing drizzle","🌧️"],61:["Light rain","🌧️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],
  66:["Freezing rain","🌧️"],67:["Freezing rain","🌧️"],71:["Light snow","❄️"],73:["Snow","❄️"],75:["Heavy snow","❄️"],
  77:["Snow grains","❄️"],80:["Light showers","🌦️"],81:["Showers","🌦️"],82:["Heavy showers","🌧️"],
  85:["Snow showers","❄️"],86:["Snow showers","❄️"],95:["Thunderstorm","⛈️"],96:["Thunderstorm","⛈️"],99:["Thunderstorm","⛈️"]
};
function dayShortName(iso) { return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { weekday: "short" }); }
function renderWeather(data) {
  const [label, emoji] = WX_CODE[data.now.code] || ["", "⛅"];
  document.getElementById("wx-city").textContent = data.city || MELB.label;
  document.getElementById("wx-condition").textContent = label;
  document.querySelector(".wx-now .wx-icon").textContent = emoji;
  document.getElementById("wx-temp").textContent = Math.round(data.now.temp);

  const box = document.querySelector(".wx-forecast");
  box.innerHTML = "";
  data.days.slice(0, 5).forEach((d) => {
    const [, icon] = WX_CODE[d.code] || ["", "⛅"];
    const row = document.createElement("div");
    row.className = "wx-row";
    row.innerHTML = `
      <div class="day">${dayShortName(d.date)}</div>
      <div class="mini-icon" aria-hidden="true">${icon}</div>
      <div class="min">${Math.round(d.min)}</div>
      <div class="max">${Math.round(d.max)}</div>
    `;
    box.appendChild(row);
  });
}
async function fetchWeather(lat, lon, labelOverride) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: lat, longitude: lon,
    current_weather: "true",
    daily: "weathercode,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  }).toString();

  const res = await fetch(url);
  const j = await res.json();
  const out = {
    city: labelOverride || MELB.label,
    now: { temp: j.current_weather?.temperature ?? 0, code: j.current_weather?.weathercode ?? 0 },
    days: [],
  };
  const times = j.daily?.time || [];
  const codes = j.daily?.weathercode || [];
  const mins  = j.daily?.temperature_2m_min || [];
  const maxs  = j.daily?.temperature_2m_max || [];
  for (let i = 0; i < times.length; i++) {
    out.days.push({ date: times[i], code: codes[i], min: mins[i], max: maxs[i] });
  }
  return out;
}
async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`);
    const j = await r.json();
    return j?.results?.[0]?.name || null;
  } catch { return null; }
}
(async function initWeather() {
  async function load(lat, lon, label) { renderWeather(await fetchWeather(lat, lon, label)); }
  if (USE_GEOLOCATION && "geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const lat = p.coords.latitude, lon = p.coords.longitude;
        load(lat, lon, (await reverseGeocode(lat, lon)) || MELB.label);
      },
      () => load(MELB.lat, MELB.lon, MELB.label),
      { timeout: 5000, maximumAge: 300000 }
    );
  } else {
    load(MELB.lat, MELB.lon, MELB.label);
  }
})();

/* ===== Widgets aligned (player above weather, same width) ===== */
(function syncWidgetSizes() {
  const wx = document.getElementById("weather-widget");
  if (!wx) return;
  const apply = () => {
    const r = wx.getBoundingClientRect();
    document.documentElement.style.setProperty("--widget-width", `${Math.round(r.width)}px`);
    document.documentElement.style.setProperty("--weather-height", `${Math.round(r.height)}px`);
  };
  apply();
  window.addEventListener("load", apply);
  window.addEventListener("resize", apply);
  new ResizeObserver(apply).observe(wx);
})();

/* ========== SLICED-SUN VISUALISER (flowy colour + robust blur) ========= */
(function slicedSun() {
  const canvas = document.getElementById("sunCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  const buffer = document.createElement("canvas");  const bctx = buffer.getContext("2d");
  const stage  = document.createElement("canvas");  const sctx = stage.getContext("2d");

  const grain = document.createElement("canvas");
  grain.width = grain.height = 128;
  const gctx = grain.getContext("2d");
  (function makeGrain() {
    const img = gctx.createImageData(grain.width, grain.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 118 + ((Math.random() * 2 - 1) * 20) | 0;
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    gctx.putImageData(img, 0, 0);
  })();
  let grainPattern = null;

  const STRIPES   = 23;
  const GAP_CSS   = 3;
  const SPEED_CSS = 36;

  const cssDefault = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sun-blur"));
  let BLUR_PX = Number.isFinite(cssDefault) ? Math.max(0, cssDefault) : 20;

  window.setSunBlur = (px) => {
    BLUR_PX = Math.max(0, Number(px) || 0);
    document.documentElement.style.setProperty("--sun-blur", String(BLUR_PX));
    canvas.style.filter = BLUR_PX > 0 ? `blur(${BLUR_PX}px)` : "none";
  };

  const supportsCanvasFilter = typeof ctx.filter === "string";

  function fit() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const r = canvas.getBoundingClientRect();

    canvas.width = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buffer.width = stage.width = canvas.width;
    buffer.height = stage.height = canvas.height;
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.setTransform(1, 0, 0, 1, 0, 0);

    grainPattern = ctx.createPattern(grain, "repeat");

    if (!supportsCanvasFilter) {
      canvas.style.filter = BLUR_PX > 0 ? `blur(${BLUR_PX}px)` : "none";
    }
  }
  window.addEventListener("resize", fit, { passive: true });
  fit();

  function paintStaticBackdrop() {
    const W = buffer.width, H = buffer.height;
    bctx.fillStyle = "#0b0c0d"; bctx.fillRect(0, 0, W, H);

    const topG = bctx.createLinearGradient(0, 0, 0, H * 0.4);
    topG.addColorStop(0, "rgba(153, 23, 214, 0.5)");
    topG.addColorStop(1, "rgba(255,120,70,0.00)");
    bctx.fillStyle = topG; bctx.fillRect(0, 0, W, H * 0.4);

    const botG = bctx.createLinearGradient(0, H * 0.6, 0, H);
    botG.addColorStop(0, "rgba(255,120,70,0.00)");
    botG.addColorStop(1, "rgba(100, 34, 175, 0.55)");
    bctx.fillStyle = botG; bctx.fillRect(0, H * 0.4, W, H * 0.6);
  }

  function fNoise(t, a = 1, b = 0) { return 0.5 + 0.5 * Math.sin(t * a + b); }

  function paintDynamicCore(t) {
    paintStaticBackdrop();

    const W = buffer.width, H = buffer.height;
    const cx = W * 0.5 + (fNoise(t, 0.8) - 0.5) * W * 0.06 + (fNoise(t, 1.7, 1.2) - 0.5) * W * 0.03;
    const cy = H * 0.58 + (fNoise(t, 1.1, 0.7) - 0.5) * H * 0.05;
    const R0 = Math.min(W, H);
    const R = R0 * (0.40 + 0.03 * Math.sin(t * 0.9));

    const g = bctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    const breath = 0.75 + 0.2 * Math.sin(t * 1.3);
    g.addColorStop(0.00, `rgba(170,120,255,${0.95 * breath})`);
    g.addColorStop(0.55, `rgba(150,110,255,${0.85 * breath})`);
    g.addColorStop(0.78, `rgba(255,145,95, ${0.48 * breath})`);
    g.addColorStop(1.00, "rgba(255,120,70,0.00)");
    bctx.fillStyle = g; bctx.beginPath(); bctx.arc(cx, cy, R, 0, Math.PI * 2); bctx.fill();

    const Rb = R * 1.30;
    const g2 = bctx.createRadialGradient(cx, cy, R * 0.65, cx, cy, Rb);
    g2.addColorStop(0.00, "rgba(255,108,64,0.00)");
    g2.addColorStop(0.55, "rgba(255,108,64,0.28)");
    g2.addColorStop(1.00, "rgba(255,108,64,0.00)");
    bctx.fillStyle = g2; bctx.beginPath(); bctx.arc(cx, cy, Rb, 0, Math.PI * 2); bctx.fill();

    bctx.save();
    bctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const ang  = (-8 + 16 * fNoise(t, 0.25 + i * 0.11, i)) * Math.PI / 180;
      const sway = 0.15 * (i + 1);

      bctx.translate(W * 0.5, H * (0.35 + 0.02 * Math.sin(t * (0.6 + i * 0.2))));
      bctx.rotate(ang);

      const lg = bctx.createLinearGradient(-W, 0, W, 0);
      lg.addColorStop(0, "rgba(0,0,0,0)");
      lg.addColorStop(0.5, `rgba(255,130,85,${0.06 + 0.06 * Math.sin(t * (0.8 + i * 0.4) + i)})`);
      lg.addColorStop(1, "rgba(0,0,0,0)");
      bctx.fillStyle = lg;
      bctx.fillRect(-W, -R * sway, 2 * W, R * sway * 2);

      bctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    bctx.restore();

    bctx.save();
    bctx.strokeStyle = "rgba(255,150,100,0.15)";
    bctx.lineWidth   = Math.max(1, R * 0.015);
    bctx.shadowColor = "rgba(255,150,100,0.25)";
    bctx.shadowBlur  = 12;
    for (let k = 0; k < 4; k++) {
      const ph = t * 0.9 + k * 0.9;
      const rr = R * (0.55 + 0.10 * Math.sin(ph));
      bctx.beginPath(); bctx.arc(cx, cy, rr, 0, Math.PI * 2); bctx.stroke();
    }
    bctx.restore();
  }

  let scroll = 0; let lastT = performance.now();
  function draw() {
    const now = performance.now();
    const dt  = (now - lastT) * 0.001; lastT = now;
    const t   = now * 0.001;

    paintDynamicCore(t);

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const W = stage.width, H = stage.height;
    const w = W / dpr,     h = H / dpr;
    const GAP   = GAP_CSS * dpr;
    const SPEED = SPEED_CSS * dpr;

    sctx.fillStyle = "#0b0c0d"; sctx.fillRect(0, 0, W, H);

    const bandH = (H - (STRIPES - 1) * GAP) / STRIPES;
    const srcH  = buffer.height;
    scroll = (scroll + SPEED * dt) % srcH;

    for (let i = 0; i < STRIPES; i++) {
      const dy = Math.round(i * (bandH + GAP));
      const sh = Math.ceil(bandH);

      let sy = Math.floor((srcH - (scroll + i * bandH)) % srcH);
      if (sy < 0) sy += srcH;

      sctx.save();
      sctx.beginPath();
      sctx.rect(0, dy, W + 1, sh);
      sctx.clip();

      const take = Math.min(sh, srcH - sy);
      sctx.drawImage(buffer, 0, sy, buffer.width, take, 0, dy, W, take);
      const remain = sh - take;
      if (remain > 0) {
        sctx.drawImage(buffer, 0, 0, buffer.width, remain, 0, dy + take, W, remain);
      }
      sctx.restore();
    }

    const topV = sctx.createLinearGradient(0, 0, 0, H * 0.33);
    topV.addColorStop(0, "rgba(255,110,70,0.40)");
    topV.addColorStop(1, "rgba(255,110,70,0.00)");
    sctx.fillStyle = topV; sctx.fillRect(0, 0, W, H * 0.33);

    const botV = sctx.createLinearGradient(0, H * 0.67, 0, H);
    botV.addColorStop(0, "rgba(255,110,70,0.00)");
    botV.addColorStop(1, "rgba(255,110,70,0.40)");
    sctx.fillStyle = botV; sctx.fillRect(0, H * 0.67, W, H * 0.33);

    ctx.clearRect(0, 0, w, h);
    if (typeof ctx.filter === "string") {
      ctx.filter = BLUR_PX > 0 ? `blur(${BLUR_PX}px)` : "none";
      ctx.drawImage(stage, 0, 0, w, h);
      ctx.filter = "none";
    } else {
      canvas.style.filter = BLUR_PX > 0 ? `blur(${BLUR_PX}px)` : "none";
      ctx.drawImage(stage, 0, 0, w, h);
    }

    if (grainPattern) {
      ctx.globalCompositeOperation = "soft-light";
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ===================== CLOCK ===================== */
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; hours = hours ? hours : 12;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("ampm").textContent = ampm;
}
setInterval(updateClock, 1000);
updateClock();

/* -------------------------------------------------
   WebAudio-based generative melody system (looping)
   ------------------------------------------------- */
const AudioEngine = (() => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.75;
  master.connect(ctx.destination);

  const listeners = { start: [], stop: [] };
  const emit = (evt, payload) => (listeners[evt] || []).forEach(cb => cb(payload));
  const on   = (evt, cb) => { if (listeners[evt]) listeners[evt].push(cb); };

  const active = new Map(); // id -> { voice, timer, point }

  const SCHEDULE_AHEAD = 0.15, TICK_MS = 50;
  const scales = {
    major:  [0,2,4,5,7,9,11,12],
    dorian: [0,2,3,5,7,9,10,12],
    pent:   [0,3,5,7,10,12],
  };

  const seededRand = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
  const noteFreq   = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  function makeVoice(seed){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    const delay = ctx.createDelay(0.6);
    const fb = ctx.createGain();

    osc.type = ['sine','triangle','sawtooth'][Math.floor(seededRand(seed)*3)];
    gain.gain.value = 0;
    filt.type = 'lowpass';
    filt.frequency.value = 1000 + 1000 * seededRand(seed + 2);
    delay.delayTime.value = 0.18 + 0.12 * seededRand(seed + 3);
    fb.gain.value = 0.22 + 0.22 * seededRand(seed + 4);

    osc.connect(gain); gain.connect(filt);
    filt.connect(delay); delay.connect(fb).connect(delay);
    filt.connect(master); delay.connect(master);
    osc.start();

    function trigger(freq, t){
      const a=0.01,d=0.10,s=0.16,r=0.20, g=gain.gain;
      osc.frequency.setValueAtTime(freq, t);
      g.cancelScheduledValues(t);
      g.setValueAtTime(0, t);
      g.linearRampToValueAtTime(0.85, t + a);
      g.linearRampToValueAtTime(0.55, t + a + d);
      g.linearRampToValueAtTime(0.55, t + a + d + s);
      g.linearRampToValueAtTime(0.0, t + a + d + s + r);
    }
    function stop(when = ctx.currentTime){
      gain.gain.linearRampToValueAtTime(0, when + 0.1);
      setTimeout(() => { try{ osc.stop(); } catch(e){} }, 400);
    }
    return { trigger, stop };
  }

  function startLoop(point){
    const baseSeed = Math.abs(Math.floor(point.lat*1000)+Math.floor(point.lng*1000));
    const seed = baseSeed + (Date.now() % 997);

    const scaleName = ['major','dorian','pent'][Math.floor(seededRand(baseSeed)*3)];
    const scale = scales[scaleName];
    const baseMidi = 58 + Math.floor(seededRand(baseSeed+7)*12);
    const tempo = 150 + Math.floor(seededRand(seed+9)*60);
    const step = 60/tempo;   // 8th
    const barBeats = 8;      // 4/4 in 8ths
    const voice = makeVoice(seed);

    let nextNoteIdx = 0;
    let nextTime = ctx.currentTime + 0.05;

    function schedule(){
      while (nextTime < ctx.currentTime + SCHEDULE_AHEAD){
        const idx  = Math.floor(seededRand(seed + nextNoteIdx) * scale.length);
        const hop  = Math.random() < 0.2 ? 12 : 0;
        const midi = baseMidi + scale[idx] + hop;
        voice.trigger(noteFreq(midi), nextTime);
        nextTime += step;
        nextNoteIdx = (nextNoteIdx + 1) % barBeats;
      }
    }
    const id = point.id || `${point.lat.toFixed(3)}_${point.lng.toFixed(3)}`;
    point.id = id;

    const timer = setInterval(schedule, TICK_MS);
    active.set(id, { voice, timer, point, meta:{scaleName, tempo} });

    // send full payload incl. signature for the list
    emit('start', {
      id,
      name: point.name || 'Untitled',
      signature: point.signature || `${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}`,
      point
    });
  }

  function stopLoop(id){
    const entry = active.get(id);
    if (!entry) return;
    clearInterval(entry.timer);
    entry.voice.stop();
    active.delete(id);
    emit('stop', { id });
  }

  function stopAll(){ Array.from(active.keys()).forEach(stopLoop); }

  function toggleForPoint(point){
    if (ctx.state === 'suspended') ctx.resume(); // autoplay gate
    const id = point.id || `${point.lat.toFixed(3)}_${point.lng.toFixed(3)}`;
    point.id = id;
    if (active.has(id)) stopLoop(id);
    else startLoop(point);
  }

  return { toggleForPoint, stopAll, on };
})();

/* ================== Now Playing UI binder ================== */
(() => {
  const list = document.getElementById('npList');
  const clearBtn = document.getElementById('npClear');
  if (!list || !clearBtn) return;

  const items = new Map(); // id -> <li>

  function makeItem({ id, name, signature, point }) {
    const li = document.createElement('li');
    li.className = 'np-item';
    li.dataset.id = id;

    const left = document.createElement('div');

    const title = document.createElement('div');
    title.className = 'np-name';
    title.textContent = name || 'Untitled';

    const meta = document.createElement('div');
    meta.className = 'np-meta';
    meta.textContent = signature || `${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}`;

    left.appendChild(title);
    left.appendChild(meta);

    const stop = document.createElement('button');
    stop.className = 'np-stop';
    stop.textContent = 'Stop';
    stop.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.toggleForPoint(point);
    });

    li.appendChild(left);
    li.appendChild(stop);
    li.addEventListener('click', () => AudioEngine.toggleForPoint(point));
    return li;
  }

  AudioEngine.on('start', payload => {
    const li = makeItem(payload);
    items.set(payload.id, li);
    list.appendChild(li);
  });

  AudioEngine.on('stop', ({ id }) => {
    const li = items.get(id);
    if (li) { li.remove(); items.delete(id); }
  });

  clearBtn.addEventListener('click', () => AudioEngine.stopAll());
})();
