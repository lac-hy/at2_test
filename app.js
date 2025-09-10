/* ---------- Map ---------- */
const map = L.map('map', {
  zoomControl: false,   // remove zoom buttons
  dragging: false,      // disable click-drag
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  touchZoom: false
}).setView([-37.8136, 144.9631], 12);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd", maxZoom: 20
}).addTo(map);

const melbBounds = L.latLngBounds(
  L.latLng(-38.40, 144.20),
  L.latLng(-37.40, 145.60)
);
map.setView([-37.8136, 144.9631], 12);  

// Optional vertical guide line
const guideLng = 145.0;
L.polyline(
  [[melbBounds.getSouth(), guideLng], [melbBounds.getNorth(), guideLng]],
  { className:"guide-line", interactive:false }
).addTo(map);

/* ---------- POIs ---------- */
/* category: "Central Melbourne" | "Coastal" | "Greater Melbourne" */
const POIS = [
  { name:"Melbourne CBD", lat:-37.8136, lng:144.9631, category:"Central Melbourne", video:"video/cbd.mp4", signature:"Tram bell & city bustle" },
  { name:"Fitzroy",       lat:-37.7994, lng:144.9830, category:"Central Melbourne", video:"video/fitzroy.mp4", signature:"Street art & café chatter" },
  { name:"Richmond",      lat:-37.8183, lng:144.9980, category:"Central Melbourne", video:"richmond.mp4", signature:"Footy crowds & pubs" },
  { name:"Carlton",       lat:-37.8009, lng:144.9669, category:"Central Melbourne", video:"carlton.mp4", signature:"Espresso machines & chatter" },
  { name:"Southbank",     lat:-37.8230, lng:144.9640, category:"Central Melbourne", video:"southbank.mp4", signature:"River ambience & buskers" },
  { name:"Brunswick",     lat:-37.7650, lng:144.9610, category:"Central Melbourne", video:"brunswick.mp4", signature:"Live music & buzzing bars" },
  { name:"Collingwood",   lat:-37.8045, lng:144.9860, category:"Central Melbourne", video:"collingwood.mp4", signature:"Studios & brewery hum" },
  { name:"St Kilda",      lat:-37.8676, lng:144.9809, category:"Coastal",           video:"video/stkilda.mp4",    signature:"Waves & gulls" },
  { name:"Brighton",      lat:-37.9056, lng:145.0160, category:"Coastal",           video:"video/brighton.mp4",   signature:"Beach breeze & footsteps" },
  { name:"Port Melbourne",lat:-37.8380, lng:144.9390, category:"Coastal",           video:"portmelb.mp4",   signature:"Ferries & harbor wind" },
  { name:"Williamstown",  lat:-37.8610, lng:144.8960, category:"Coastal",           video:"williamstown.mp4",signature:"Boats & seagulls" },
  { name:"Elwood",        lat:-37.8890, lng:144.9840, category:"Coastal",           video:"elwood.mp4",     signature:"Joggers by the bay" },
  { name:"Nunawading",    lat:-37.8183, lng:145.1737, category:"Greater Melbourne", video:"nunawading.mp4", signature:"Suburban calm & trains" },
  { name:"Chadstone",     lat:-37.8850, lng:145.0820, category:"Greater Melbourne", video:"chadstone.mp4",  signature:"Mall ambience" },
  { name:"Camberwell",    lat:-37.8350, lng:145.0710, category:"Greater Melbourne", video:"camberwell.mp4", signature:"Trams & suburban life" },
  { name:"Footscray",     lat:-37.7995, lng:144.9319, category:"Greater Melbourne", video:"footscray.mp4",  signature:"Markets & trains" },
  { name:"Greensborough", lat:-37.7000, lng:145.1000, category:"Greater Melbourne", video:"greens.mp4",     signature:"Birdsong & creek" },
  { name:"Burwood",       lat:-37.8485, lng:145.1082, category:"Greater Melbourne", video:"burwood.mp4",    signature:"Busy Streets & Diversity" },
  { name:"AAMI Park",     lat:-37.8251, lng:144.9837, category:"Landmarks",         video:"aamipark.mp4",   signature:"Roaring Crowds & Intense Sports" },
  { name:"MCG",           lat:-37.8199, lng:144.9832, category:"Landmarks",         video:"mcg.mp4",        signature:"Fans Cheering & Celebrity Performances" },
  { name:"Kew",           lat:-37.8021, lng:145.0318, category:"Greater Melbourne", video:"kew.mp4",        signature:"???"},
];

/* place dots */
function addGlowingDot(poi){
  const dotIcon = L.divIcon({ html:'<div class="glow-dot"></div>', className:'', iconSize:[16,16] });
  L.marker([poi.lat, poi.lng], { icon: dotIcon }).addTo(map).on('click', ()=>openGlass(poi));
}
POIS.forEach(addGlowingDot);

/* ---------- Glass Card Logic ---------- */
const overlay  = document.getElementById('overlay');
const glass    = document.getElementById('glass');
const videoEl  = document.getElementById('glassVideo');
const placeEl  = document.getElementById('placeName');
const groupEl  = document.getElementById('groupName');
const groupPill= document.getElementById('groupPill');
const soundEl  = document.getElementById('sigSound');
const closeBtn = document.getElementById('closeBtn');

function openGlass(poi){
  placeEl.textContent = poi.name;
  soundEl.textContent = poi.signature || "—";
  groupEl.textContent = poi.category;

  // reset and apply category class
  groupPill.className = 'group-pill';
  if(poi.category === 'Central Melbourne') groupPill.classList.add('group-central');
  if(poi.category === 'Coastal')           groupPill.classList.add('group-coastal');
  if(poi.category === 'Greater Melbourne') groupPill.classList.add('group-greater');
  if(poi.category === 'Landmarks')         groupPill.classList.add('group-landmark');

  // load video
  videoEl.src = poi.video;
  videoEl.play().catch(()=>{});

  overlay.classList.add('show');
  glass.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
}

function closeGlass(){
  glass.classList.remove('show');
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden','true');
  videoEl.pause(); videoEl.currentTime = 0; videoEl.removeAttribute('src'); videoEl.load();
}

overlay.addEventListener('click', closeGlass);
closeBtn.addEventListener('click', closeGlass);
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeGlass(); });

/* ===== Real weather (Open-Meteo) for Melbourne + 5-day forecast ===== */

// Toggle this to try using the user's location. If blocked, it will fall back to Melbourne.
const USE_GEOLOCATION = false;

// Default to Melbourne CBD
const MELB = { lat: -37.8136, lon: 144.9631, label: "Melbourne" };

// Open-Meteo weathercode → label + emoji
const WX_CODE = {
  0:  ["Clear sky", "☀️"],
  1:  ["Mainly clear", "🌤️"],
  2:  ["Partly cloudy", "⛅"],
  3:  ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌦️"],
  56: ["Freezing drizzle", "🌧️"],
  57: ["Freezing drizzle", "🌧️"],
  61: ["Light rain", "🌧️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  66: ["Freezing rain", "🌧️"],
  67: ["Freezing rain", "🌧️"],
  71: ["Light snow", "❄️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "❄️"],
  80: ["Light showers", "🌦️"],
  81: ["Showers", "🌦️"],
  82: ["Heavy showers", "🌧️"],
  85: ["Snow showers", "❄️"],
  86: ["Snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm", "⛈️"],
  99: ["Thunderstorm", "⛈️"]
};

// Utility: day short name for a yyyy-mm-dd string (in local tz)
function dayShortName(isoDate) {
  const d = new Date(isoDate + "T12:00:00"); // midday avoids DST edge cases
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

// Render the widget using real data
function renderWeather(data){
  // Now panel
  const [label, emoji] = WX_CODE[data.now.code] || ["", "⛅"];
  document.getElementById("wx-city").textContent = data.city || MELB.label;
  document.getElementById("wx-condition").textContent = label;
  document.querySelector(".wx-now .wx-icon").textContent = emoji;
  document.getElementById("wx-temp").textContent = Math.round(data.now.temp);

  // Forecast list (5 days)
  const box = document.querySelector(".wx-forecast");
  box.innerHTML = "";
  data.days.slice(0, 5).forEach(d => {
    const [, iconEmoji] = WX_CODE[d.code] || ["", "⛅"];
    const row = document.createElement("div");
    row.className = "wx-row";
    row.innerHTML = `
      <div class="day">${dayShortName(d.date)}</div>
      <div class="mini-icon" aria-hidden="true">${iconEmoji}</div>
      <div class="min">${Math.round(d.min)}</div>
      <div class="max">${Math.round(d.max)}</div>
    `;
    box.appendChild(row);
  });
}

// Fetch from Open-Meteo
async function fetchWeather(lat, lon, labelOverride){
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude:  lat,
    longitude: lon,
    current_weather: "true",
    daily: "weathercode,temperature_2m_max,temperature_2m_min",
    timezone: "auto"      // use user's timezone automatically
  }).toString();

  const res = await fetch(url);
  const j = await res.json();

  // Build the model the renderer expects
  const out = {
    city: labelOverride || MELB.label,
    now: {
      temp: j.current_weather?.temperature ?? 0,
      code: j.current_weather?.weathercode ?? 0
    },
    days: []
  };

  const times = j.daily?.time || [];
  const codes = j.daily?.weathercode || [];
  const mins  = j.daily?.temperature_2m_min || [];
  const maxs  = j.daily?.temperature_2m_max || [];

  // If you prefer forecast starting *tomorrow*, start i=1
  for (let i = 0; i < times.length; i++){
    out.days.push({
      date: times[i],
      code: codes[i],
      min:  mins[i],
      max:  maxs[i]
    });
  }

  return out;
}

// OPTIONAL: reverse geocode the name if you use geolocation
async function reverseGeocode(lat, lon){
  try{
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;
    const r = await fetch(url);
    const j = await r.json();
    const hit = j?.results?.[0];
    if (hit?.name) {
      // e.g., "Melbourne" or a suburb; include state if you like: `${hit.name}, ${hit.admin1}`
      return hit.name;
    }
  }catch(e){}
  return null;
}

// Boot it up (geo if allowed, else Melbourne)
(async function initWeather(){
  async function load(lat, lon, label){
    const data = await fetchWeather(lat, lon, label);
    renderWeather(data);
  }

  if (USE_GEOLOCATION && "geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const name = await reverseGeocode(lat, lon);
      load(lat, lon, name || MELB.label);
    }, () => {
      // permission denied or error → fallback to Melbourne
      load(MELB.lat, MELB.lon, MELB.label);
    }, { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 });
  } else {
    load(MELB.lat, MELB.lon, MELB.label);
  }
})();



/* ================== Time of Day & Map Style ================== */

// Light and dark tile layers
const lightTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd", maxZoom: 20
});
const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd", maxZoom: 20
});

// Decide if it's day or night (7am–7pm = day, else night)
function getIsDay() {
  const h = new Date().getHours();
  return h >= 7 && h < 19;
}

// Apply map style
function setMapStyle() {
  if (getIsDay()) {
    map.addLayer(lightTiles);
    map.removeLayer(darkTiles);
  } else {
    map.addLayer(darkTiles);
    map.removeLayer(lightTiles);
  }
}
setMapStyle();

// Update every 5 minutes in case user leaves it open
setInterval(setMapStyle, 5 * 60 * 1000);



