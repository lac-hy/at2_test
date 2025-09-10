/* ======================== MAP (locked) ======================== */
const map = L.map('map', {
  zoomControl: false,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  touchZoom: false
}).setView([-37.8136, 144.9631], 12);

const lightTiles = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  { subdomains: 'abcd', maxZoom: 20 }
);
const darkTiles  = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { subdomains: 'abcd', maxZoom: 20 }
);

const melbBounds = L.latLngBounds(
  L.latLng(-38.40, 144.20),
  L.latLng(-37.40, 145.60)
);
map.setView([-37.8136, 144.9631], 12);

// optional guide line
const guideLng = 145.0;
L.polyline(
  [[melbBounds.getSouth(), guideLng], [melbBounds.getNorth(), guideLng]],
  { className: 'guide-line', interactive: false }
).addTo(map);

/* ==================== DAY / NIGHT MAP STYLE ==================== */
function getIsDay(){
  const h = new Date().getHours();
  return h >= 7 && h < 19;
}
function setMapStyle(){
  if (getIsDay()) { map.addLayer(lightTiles); map.removeLayer(darkTiles); }
  else { map.addLayer(darkTiles); map.removeLayer(lightTiles); }
}
setMapStyle();
setInterval(setMapStyle, 5 * 60 * 1000); // refresh every 5 min

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
  { name:"Kew",           lat:-37.8021, lng:145.0318, category:"Greater Melbourne", video:"kew.mp4",              signature:"—" }
];

function addGlowingDot(poi){
  const dotIcon = L.divIcon({ html:'<div class="glow-dot"></div>', className:'', iconSize:[16,16] });
  L.marker([poi.lat, poi.lng], { icon: dotIcon })
    .addTo(map)
    .on('click', ()=>openGlass(poi));
}
POIS.forEach(addGlowingDot);

/* ===================== GLASS CARD LOGIC ======================= */
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
  soundEl.textContent = poi.signature || '—';
  groupEl.textContent = poi.category;

  groupPill.className = 'group-pill';
  if (poi.category === 'Central Melbourne') groupPill.classList.add('group-central');
  if (poi.category === 'Coastal')           groupPill.classList.add('group-coastal');
  if (poi.category === 'Greater Melbourne') groupPill.classList.add('group-greater');
  if (poi.category === 'Landmarks')         groupPill.classList.add('group-landmark');

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
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeGlass(); });

/* ================= REAL WEATHER (Open-Meteo) ================== */
const USE_GEOLOCATION = false;
const MELB = { lat: -37.8136, lon: 144.9631, label: 'Melbourne' };

const WX_CODE = {
  0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
  45:["Fog","🌫️"],48:["Rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Heavy drizzle","🌦️"],
  56:["Freezing drizzle","🌧️"],57:["Freezing drizzle","🌧️"],61:["Light rain","🌧️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],
  66:["Freezing rain","🌧️"],67:["Freezing rain","🌧️"],71:["Light snow","❄️"],73:["Snow","❄️"],75:["Heavy snow","❄️"],
  77:["Snow grains","❄️"],80:["Light showers","🌦️"],81:["Showers","🌦️"],82:["Heavy showers","🌧️"],
  85:["Snow showers","❄️"],86:["Snow showers","❄️"],95:["Thunderstorm","⛈️"],96:["Thunderstorm","⛈️"],99:["Thunderstorm","⛈️"]
};
function dayShortName(iso){ return new Date(iso+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'}); }

function renderWeather(data){
  const [label, emoji] = WX_CODE[data.now.code] || ['','⛅'];
  document.getElementById('wx-city').textContent = data.city || MELB.label;
  document.getElementById('wx-condition').textContent = label;
  document.querySelector('.wx-now .wx-icon').textContent = emoji;
  document.getElementById('wx-temp').textContent = Math.round(data.now.temp);

  const box = document.querySelector('.wx-forecast');
  box.innerHTML = '';
  data.days.slice(0,5).forEach(d=>{
    const [, icon] = WX_CODE[d.code] || ['','⛅'];
    const row = document.createElement('div');
    row.className = 'wx-row';
    row.innerHTML = `
      <div class="day">${dayShortName(d.date)}</div>
      <div class="mini-icon" aria-hidden="true">${icon}</div>
      <div class="min">${Math.round(d.min)}</div>
      <div class="max">${Math.round(d.max)}</div>
    `;
    box.appendChild(row);
  });
}
async function fetchWeather(lat, lon, labelOverride){
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: lat, longitude: lon,
    current_weather: 'true',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    timezone: 'auto'
  }).toString();
  const res = await fetch(url);
  const j = await res.json();
  const out = {
    city: labelOverride || MELB.label,
    now: { temp: j.current_weather?.temperature ?? 0, code: j.current_weather?.weathercode ?? 0 },
    days: []
  };
  const times = j.daily?.time || [];
  const codes = j.daily?.weathercode || [];
  const mins  = j.daily?.temperature_2m_min || [];
  const maxs  = j.daily?.temperature_2m_max || [];
  for (let i=0;i<times.length;i++){
    out.days.push({ date: times[i], code: codes[i], min: mins[i], max: maxs[i] });
  }
  return out;
}
async function reverseGeocode(lat, lon){
  try{
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`);
    const j = await r.json();
    return j?.results?.[0]?.name || null;
  }catch{ return null; }
}
(async function initWeather(){
  async function load(lat, lon, label){ renderWeather(await fetchWeather(lat, lon, label)); }
  if (USE_GEOLOCATION && 'geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(async p=>{
      const lat=p.coords.latitude, lon=p.coords.longitude;
      load(lat, lon, (await reverseGeocode(lat,lon)) || MELB.label);
    }, ()=>load(MELB.lat, MELB.lon, MELB.label), { timeout:5000, maximumAge:300000 });
  } else {
    load(MELB.lat, MELB.lon, MELB.label);
  }
})();

/* ===== Keep widgets aligned (player above weather, same width) ===== */
(function syncWidgetSizes(){
  const wx = document.getElementById('weather-widget');
  if (!wx) return;
  const apply = ()=>{
    const r = wx.getBoundingClientRect();
    document.documentElement.style.setProperty('--widget-width',  `${Math.round(r.width)}px`);
    document.documentElement.style.setProperty('--weather-height', `${Math.round(r.height)}px`);
  };
  apply();
  addEventListener('load', apply);
  addEventListener('resize', apply);
  new ResizeObserver(apply).observe(wx);
})();

/* ===================== SIMPLE PLAYER (demo) ==================== */
const PLAYLIST = [
  { title:'New Audio',    handle:'@soundscape', avatar:'https://picsum.photos/seed/artist/40',  art:'https://picsum.photos/seed/cover1/800/800', src:'assets/sample1.mp3' },
  { title:'Another Clip', handle:'@soundscape', avatar:'https://picsum.photos/seed/artist2/40', art:'https://picsum.photos/seed/cover2/800/800', src:'assets/sample2.mp3' }
];
const el = {
  audio:document.getElementById('plAudio'), play:document.getElementById('plPlay'),
  prev:document.getElementById('plPrev'), next:document.getElementById('plNext'),
  progress:document.getElementById('plProgress'), cur:document.getElementById('plCurrent'),
  dur:document.getElementById('plDuration'), name:document.getElementById('plName'),
  handle:document.getElementById('plHandle'), avatar:document.getElementById('plAvatar'),
  art:document.getElementById('plArt')
};
let idx=0, isPlaying=false;
function load(i){
  idx = (i + PLAYLIST.length) % PLAYLIST.length;
  const t = PLAYLIST[idx];
  el.audio.src = t.src; el.name.textContent = t.title; el.handle.textContent = t.handle;
  el.avatar.src = t.avatar; el.art.src = t.art;
  el.progress.value = 0; el.cur.textContent = '0:00'; el.dur.textContent = '-0:00';
}
function fmt(s){ s=Math.max(0,Math.floor(s)); return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`; }
function play(){ el.audio.play().then(()=>{ isPlaying=true; el.play.textContent='⏸'; el.play.classList.add('is-playing'); }).catch(console.warn); }
function pause(){ el.audio.pause(); isPlaying=false; el.play.textContent='▶︎'; el.play.classList.remove('is-playing'); }
el.play.addEventListener('click', ()=> isPlaying ? pause() : play());
el.prev.addEventListener('click', ()=>{ load(idx-1); play(); });
el.next.addEventListener('click', ()=>{ load(idx+1); play(); });
el.audio.addEventListener('loadedmetadata', ()=>{ el.progress.max = Math.floor(el.audio.duration||0); el.dur.textContent = `-${fmt((el.audio.duration||0)-(el.audio.currentTime||0))}`; });
el.audio.addEventListener('timeupdate', ()=>{ el.progress.value = Math.floor(el.audio.currentTime||0); el.cur.textContent = fmt(el.audio.currentTime); const rem=(el.audio.duration||0)-(el.audio.currentTime||0); el.dur.textContent = `-${fmt(rem)}`; });
el.progress.addEventListener('input', ()=>{ el.audio.currentTime = Number(el.progress.value||0); });
el.audio.addEventListener('ended', ()=>{ load(idx+1); play(); });
load(0);

/* === Sliced sun visual (static stripes, flowing colour, grain, tunable blur; DPR-safe) === */
(function slicedSunStaticBlur(){
  const canvas = document.getElementById('sunCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha:false }); // on-screen (CSS px via transform)
  const buffer = document.createElement('canvas');      // source glow (device px)
  const bctx = buffer.getContext('2d');
  const stage = document.createElement('canvas');       // stage frame (device px)
  const sctx = stage.getContext('2d');

  // Grain (sharp, tiled on top)
  const grain = document.createElement('canvas');
  grain.width = grain.height = 128;
  const gctx = grain.getContext('2d');
  (function makeGrain(){
    const img = gctx.createImageData(grain.width, grain.height);
    const d = img.data;
    for (let i=0;i<d.length;i+=4){
      const v = 118 + ((Math.random()*2-1)*20)|0;
      d[i]=d[i+1]=d[i+2]=v; d[i+3]=255;
    }
    gctx.putImageData(img,0,0);
  })();
  let grainPattern = null;

  // Tunables
  const STRIPES = 23;
  const GAP_CSS = 3;     // gap in CSS px; will scale by DPR for device px
  const SPEED_CSS = 36;  // px/sec in CSS space
  let BLUR_PX = 6;       // set via setSunBlur(px)
  window.setSunBlur = (px)=>{ BLUR_PX = Math.max(0, +px||0); };

  function fit(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    const r = canvas.getBoundingClientRect();

    canvas.width  = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); // draw to ctx in CSS px

    buffer.width  = canvas.width;  buffer.height = canvas.height;  bctx.setTransform(1,0,0,1,0,0);
    stage.width   = canvas.width;  stage.height  = canvas.height;  sctx.setTransform(1,0,0,1,0,0);

    grainPattern = ctx.createPattern(grain, 'repeat');
    paintBase(); // redraw source
  }
  addEventListener('resize', fit, { passive:true });
  fit();

  function paintBase(){
    const W = buffer.width, H = buffer.height;
    bctx.clearRect(0,0,W,H);
    bctx.fillStyle = '#0b0c0d'; bctx.fillRect(0,0,W,H);

    // top/bottom glows
    const topG = bctx.createLinearGradient(0,0,0,H*0.40);
    topG.addColorStop(0.00,'rgba(255,120,70,0.55)');
    topG.addColorStop(1.00,'rgba(255,120,70,0.00)');
    bctx.fillStyle = topG; bctx.fillRect(0,0,W,H*0.40);

    const botG = bctx.createLinearGradient(0,H*0.60,0,H);
    botG.addColorStop(0.00,'rgba(255,120,70,0.00)');
    botG.addColorStop(1.00,'rgba(255,120,70,0.55)');
    bctx.fillStyle = botG; bctx.fillRect(0,H*0.40,W,H*0.60);

    // big sun
    const cx=W*0.5, cy=H*0.58, R=Math.min(W,H)*0.44;
    const g1 = bctx.createRadialGradient(cx,cy,R*0.6, cx,cy,R*1.35);
    g1.addColorStop(0.00,'rgba(255,108,64,0.00)');
    g1.addColorStop(0.55,'rgba(255,108,64,0.30)');
    g1.addColorStop(1.00,'rgba(255,108,64,0.00)');
    bctx.fillStyle=g1; bctx.beginPath(); bctx.arc(cx,cy,R*1.35,0,Math.PI*2); bctx.fill();

    const g2 = bctx.createRadialGradient(cx,cy,0, cx,cy,R);
    g2.addColorStop(0.00,'rgba(170,120,255,0.98)');
    g2.addColorStop(0.55,'rgba(155,110,255,0.90)');
    g2.addColorStop(0.80,'rgba(255,140,90,0.62)');
    g2.addColorStop(1.00,'rgba(255,120,70,0.00)');
    bctx.fillStyle=g2; bctx.beginPath(); bctx.arc(cx,cy,R,0,Math.PI*2); bctx.fill();

    bctx.strokeStyle='rgba(255,135,85,0.38)'; bctx.lineWidth=Math.max(2,R*0.06);
    bctx.shadowColor='rgba(255,135,85,0.38)'; bctx.shadowBlur=18;
    bctx.beginPath(); bctx.arc(cx,cy,R*0.98,0,Math.PI*2); bctx.stroke(); bctx.shadowBlur=0;
  }

  let scroll = 0, lastT = performance.now();

  function draw(){
    const now = performance.now();
    const dt  = (now - lastT) * 0.001; lastT = now;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    const W = stage.width, H = stage.height;          // device px
    const w = W / dpr,     h = H / dpr;               // CSS px for ctx
    const GAP = GAP_CSS * dpr;
    const SPEED = SPEED_CSS * dpr;

    // stage background
    sctx.fillStyle = '#0b0c0d';
    sctx.fillRect(0,0,W,H);

    const bandH = (H - (STRIPES - 1)*GAP) / STRIPES;
    const srcH = buffer.height;

    scroll = (scroll + SPEED * dt) % srcH;

    for (let i=0;i<STRIPES;i++){
      const dy = Math.round(i * (bandH + GAP));
      const sh = Math.ceil(bandH);

      let sy = Math.floor((srcH - (scroll + i*bandH)) % srcH);
      if (sy < 0) sy += srcH;

      sctx.save();
      sctx.beginPath();
      sctx.rect(0, dy, W+1, sh); // +1 avoids seam from rounding
      sctx.clip();

      let take = Math.min(sh, srcH - sy);
      sctx.drawImage(buffer, 0, sy, buffer.width, take, 0, dy, W, take);
      const remain = sh - take;
      if (remain > 0){
        sctx.drawImage(buffer, 0, 0, buffer.width, remain, 0, dy+take, W, remain);
      }
      sctx.restore();
    }

    // overlays on stage
    const topV = sctx.createLinearGradient(0,0,0,H*0.33);
    topV.addColorStop(0,'rgba(255,110,70,0.40)'); topV.addColorStop(1,'rgba(255,110,70,0.00)');
    sctx.fillStyle = topV; sctx.fillRect(0,0,W,H*0.33);
    const botV = sctx.createLinearGradient(0,H*0.67,0,H);
    botV.addColorStop(0,'rgba(255,110,70,0.00)'); botV.addColorStop(1,'rgba(255,110,70,0.40)');
    sctx.fillStyle = botV; sctx.fillRect(0,H*0.67,W,H*0.33);

    // blit to on-screen with blur (ctx uses CSS px)
    ctx.clearRect(0,0,w,h);
    ctx.filter = BLUR_PX ? `blur(${BLUR_PX}px)` : 'none';
    ctx.drawImage(stage, 0, 0, w, h);
    ctx.filter = 'none';

    // grain on top (sharp)
    if (grainPattern){
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0,0,w,h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // optional: CSS var --sun-blur
  const cssBlur = getComputedStyle(document.documentElement).getPropertyValue('--sun-blur').trim();
  if (cssBlur){ const n = parseFloat(cssBlur); if (!isNaN(n)) BLUR_PX = Math.max(0,n); }
})();
