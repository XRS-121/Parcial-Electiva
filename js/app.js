/* =====================================================================
   Planify / Explorix - app.js
   1. Configuración de Tailwind   2. Datos complementarios   3. Estado y localStorage
   4. APIs (REST Countries, Nominatim, Open-Meteo)   5. Utilidades   6. Vistas
   7. Formulario (modal)   8. Eventos   9. Router / arranque
   ===================================================================== */

/* ---------- 1. CONFIGURACIÓN DE TAILWIND (misma paleta del diseño original) ---------- */
const FONT = ['Plus Jakarta Sans'];
tailwind.config = {
  darkMode: 'class',
  theme: { extend: {
    colors: {"primary":"#a83128","surface-container":"#e7eeff","tertiary":"#825100","on-primary-container":"#fffbff","inverse-primary":"#ffb4aa","error":"#ba1a1a","error-container":"#ffdad6","on-error":"#ffffff","inverse-on-surface":"#ecf1ff","surface-bright":"#f9f9ff","tertiary-container":"#a36700","surface-container-lowest":"#ffffff","primary-fixed-dim":"#ffb4aa","surface-container-low":"#f0f3ff","on-secondary":"#ffffff","on-secondary-container":"#006f67","secondary-container":"#99efe5","on-error-container":"#93000a","tertiary-fixed":"#ffddb8","background":"#f9f9ff","inverse-surface":"#263143","surface-variant":"#d8e3fb","surface-container-high":"#dee8ff","secondary":"#006a63","secondary-fixed":"#9cf2e8","on-tertiary":"#ffffff","on-surface":"#111c2d","primary-container":"#c94a3d","primary-fixed":"#ffdad5","surface-container-highest":"#d8e3fb","outline":"#8c716d","on-primary":"#ffffff","surface":"#f9f9ff","on-primary-fixed":"#410001","on-tertiary-container":"#fffbff","outline-variant":"#e0bfbb","on-surface-variant":"#58413e","secondary-fixed-dim":"#80d5cb","on-tertiary-fixed":"#2a1700","surface-dim":"#cfdaf2"},
    borderRadius: {"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
    spacing: {"space-xl":"2.5rem","gutter-mobile":"0.75rem","space-md":"1rem","space-xs":"0.25rem","margin-mobile":"1rem","margin":"2rem","gutter":"1.25rem","space-lg":"1.5rem","space-sm":"0.5rem"},
    fontFamily: Object.fromEntries(["display-hero-mobile","label-sm","badge-caps","body-lg","body-sm","headline-sm","label-md","headline-md","display-hero","headline-lg","body-md"].map(n => [n, FONT])),
    fontSize: {"display-hero-mobile":["32px",{lineHeight:"40px",letterSpacing:"-0.01em",fontWeight:"800"}],"label-sm":["12px",{lineHeight:"16px",letterSpacing:"0.02em",fontWeight:"600"}],"badge-caps":["11px",{lineHeight:"14px",letterSpacing:"0.04em",fontWeight:"700"}],"body-lg":["16px",{lineHeight:"24px",fontWeight:"400"}],"body-sm":["12px",{lineHeight:"16px",fontWeight:"400"}],"headline-sm":["18px",{lineHeight:"26px",fontWeight:"600"}],"label-md":["14px",{lineHeight:"20px",fontWeight:"600"}],"headline-md":["22px",{lineHeight:"30px",fontWeight:"700"}],"display-hero":["48px",{lineHeight:"56px",letterSpacing:"-0.02em",fontWeight:"800"}],"headline-lg":["28px",{lineHeight:"36px",letterSpacing:"-0.015em",fontWeight:"700"}],"body-md":["14px",{lineHeight:"20px",fontWeight:"400"}]}
  } }
};

document.addEventListener('DOMContentLoaded', () => {
'use strict';

/* ---------- 2. DATOS COMPLEMENTARIOS (JSON local) ----------
   REST Countries no trae rating, precio ni fotos; se agregan aquí por código de país (cca2). */
const G = 'https://lh3.googleusercontent.com/aida-public/';
const foto = img => (img.startsWith('http') ? img : G + img);
const EX = {
  FR:{city:'París',rating:4.8,price:'€120',desc:'Historia, arte y gastronomía de clase mundial a orillas del Sena.',img:'AB6AXuAzgDoIn7uzf5_fMbODC62s6B5bezAH5R0F3SSF_WOJYtyrnB0zxpeQkDWXKcnQlU_S9bHVo5Bv-TPy50RZEKzd74jNPrKhD15SMX7a6ivFAYzz-Fni1PHtIKQRvPRfi19MMfYbcVw-1VGAWua5JtfZOCid7SiZMT7-DdOmu4h68dZfzwvtp2W60-9jqoxvmxSbfK-xwk24U7WzyStdsUahdt4Nw6Lm-Zf_khaw-TI9Mz1bbthGTbNl'},
  US:{city:'Nueva York',rating:4.7,price:'$180',desc:'La ciudad que nunca duerme: rascacielos, museos y teatro.',img:'AB6AXuDo5OD9_yJiJdUV7AEAW948R7S7jFcVrem-OOSkOhv6y1F57u3Y9Eou3Ge_sQ_u95uiGkO7bOB0H94prxi9nejRMeEVNrn4-dgk2X5wFwsgbg4fcY3--JgDbIMdqOwdkG3MWxSgOGlxh42ud0FaFDg9MoR6KOu_AC4vt_8UNMc2OzrznoMPRbEgDeGNxOhDe3dFUyrdwRZMSZGkZOXl7DE97fzhvC65G6HJc1T29T4adxQgkcwzmhsW'},
  JP:{city:'Tokio',rating:4.6,price:'¥16k',desc:'Armonía entre templos milenarios, tecnología y gastronomía.',img:'AB6AXuDrDikTUi9tKmZ3aHkc1VGgpnKDzrYTUUqd_YfZ9M9RgVmlURQd_uGP2urT4ykSyJouRyUekEyV4mIPVRetdKLhzj20SlYsSWt0JGgQSAq6-GD-W_ErRierr7t5Fx-_XVHV9Z5YWfvsvo7ZNldttNQUPMGHFsryVFKKF-MMx2dWmMSaB02_7rcEC104rdDGihlc_0F8amGAh7kxGgxGCsN7qDP2UPnxBs9afV1L3mwu_dcwvf8FnHhT'},
  IT:{city:'Roma',rating:4.9,price:'€110',desc:'Ruinas imperiales, fuentes y cocina italiana en cada esquina.',img:'AB6AXuC4ajAZ9zmS-TQAkuAFEQd78w3QeiQUic9_ZNUxfd3CHeNkRSPdHhEjADUHlSTACsGNuv-0A944TB6DEvKLc6jeSwgeumlyOtiSU4t63S3OX38Q4AgUVBS471avjN6OzhTYcY_k8qloHnz9pq9D8p6mAXuybEVeMuC3wwCRxuw2v3rx2fGQ51iMtISZIJq308hiFlRGDMgdpGYWwy0QBhN25ebXNZn9IUy1UQLiHTxgNObaPHLHc281'},
  MX:{city:'Cancún',rating:4.5,price:'$95',desc:'Aguas turquesa del Caribe, arena blanca y cultura maya.',img:'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1000&q=80'},
  CO:{city:'Bogotá',rating:4.4,price:'$65',desc:'Calles coloniales de La Candelaria y la vista de Monserrate.',img:'AB6AXuBSPBV9MNKz6HdoLfG_MNeUi9w0ScmOxdbNkEx3Mr1S4oSly0j08XDtNAAe7qWSUhJFKEHnRjMFMyer1q6_t1-20g1ftEhato7pzGfOlSCMBwwcyOwQsQw6bgX_5zX48frf5608-Uywj5tfauL82M_e97-mBaSVkw9_k2s-FxhtiGDrE-E_PtGEsRt1SlRGVwxvI09nkY9RGWVMk3IiL8Y-FJ8ZfIRufxMo3hqyaY5JIAIYyvVx0HlR'},
  ES:{city:'Madrid',rating:4.3,price:'€105',desc:'Museos de clase mundial, terrazas llenas de vida y elegancia monumental.',img:'AB6AXuDkAPVH108GEz4as1H_vTpEo9CAtRnODQmosGYH2ubJ0Znu30OqP4q-e_eHfUFH_C6TtDVWlxJjs6oLEoMXS4yGJulDkAZTaFM9-sWVsjHIx6BKpy78XlzvnqQgzRdorxxeTX0cVRDd_YiNQGpNtE2RpQt-fE1-MoKLw_wuH9uCmNAMvF1sWAP8Qcq8zVWV2kKfv26a4L4bi8Rn2fxN_Y5Vdz17Orn9S4X5jMVrNh1RxDBM7wQ9Ux5z'},
  GR:{city:'Santorini',rating:4.9,price:'€160',desc:'Atardeceres inolvidables y casas blancas sobre el mar Egeo.',img:'AB6AXuBKyg62gdWrIXFupnIMeuJ2IEOclVx0v7QMlG1OhyFIIIlmUA9QcJU7owcGkc2yvEH3qNS1ZV9_37ZgFRo0ZlAl_A8B0qWYCGo3uzCxe4bFSbOiSRkuGeN7TwNtiqcZB40e0wSNta9JokJ9elh6i57XUG8JczlRyEfj7lCc8D8vGj77LZC5_yp5y9xtKaAc2qZANLnFthSLIowciTmFbKNlJHXBFIjksiSs4MVEKRLe6by579R6g1GW'}
};
const REGION = {Americas:'América', Europe:'Europa', Asia:'Asia', Africa:'África', Oceania:'Oceanía', Antarctic:'Antártida'};

/* Respaldo local: se usa solo si REST Countries no responde, para que la app nunca quede vacía */
const mk = (cc, es, cap, reg, pop, lang, mon, sym, ll) => ({ cca2: cc, name: { common: es }, translations: { spa: { common: es } }, capital: [cap], region: reg,
  population: pop, languages: { x: lang }, currencies: { x: { name: mon, symbol: sym } }, flags: { png: `https://flagcdn.com/w80/${cc.toLowerCase()}.png` }, latlng: ll });
const FALLBACK = [
  mk('FR','Francia','París','Europe',68000000,'Francés','Euro','€',[46,2]), mk('US','Estados Unidos','Washington D. C.','Americas',331000000,'Inglés','Dólar estadounidense','$',[38,-97]),
  mk('JP','Japón','Tokio','Asia',125000000,'Japonés','Yen','¥',[36,138]), mk('IT','Italia','Roma','Europe',59000000,'Italiano','Euro','€',[42.8,12.8]),
  mk('MX','México','Ciudad de México','Americas',128000000,'Español','Peso mexicano','$',[23,-102]), mk('CO','Colombia','Bogotá','Americas',51000000,'Español','Peso colombiano','$',[4,-72]),
  mk('ES','España','Madrid','Europe',47000000,'Español','Euro','€',[40,-4]), mk('GR','Grecia','Atenas','Europe',10400000,'Griego','Euro','€',[39,22])
];

/* ---------- 3. ESTADO Y LOCALSTORAGE ---------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* modo privado o lleno */ } }
};
const S = {
  favs: LS.get('px_favs', []),     // ["ES","FR"]
  trips: LS.get('px_trips', []),   // viajes creados con el formulario
  paises: {},                      // cca2 -> objeto de REST Countries
  region: 'Todos', q: '', open: new Set()
};
const persist = () => { LS.set('px_favs', S.favs); LS.set('px_trips', S.trips); };

/* ---------- 4. APIs ---------- */
const API = {
  // API 1: REST Countries (prueba endpoints directos y espejos públicos con CORS)
  async paises(codes) {
    const f = 'name,cca2,capital,region,population,languages,currencies,flags,latlng,translations';
    const urls = [
      `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=${f}`,
      `https://restcountries.com/v3.1/alpha?codes=${codes}`
    ];
    for (const u of urls) {
      try {
        const r = await fetch(u);
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data) && data.length) return data;
        }
      } catch { /* continúa al siguiente endpoint */ }
    }

    const mirrors = [
      'https://raw.githubusercontent.com/mledoze/countries/master/countries.json',
      'https://cdn.jsdelivr.net/npm/world-countries@5.0.0/countries.json'
    ];
    const wanted = new Set(codes.split(',').map(c => c.trim().toUpperCase()));
    const popMap = Object.fromEntries(FALLBACK.map(x => [x.cca2, x.population]));

    for (const mUrl of mirrors) {
      try {
        const rMirror = await fetch(mUrl);
        if (!rMirror.ok) continue;
        const all = await rMirror.json();
        if (!Array.isArray(all) || !all.length) continue;
        const mapped = all
          .filter(c => wanted.has(c.cca2))
          .map(c => ({
            cca2: c.cca2,
            name: c.name,
            translations: c.translations,
            capital: c.capital || ['—'],
            region: c.region,
            population: c.population || popMap[c.cca2] || 0,
            languages: c.languages || {},
            currencies: c.currencies || {},
            flags: { png: `https://flagcdn.com/w80/${c.cca2.toLowerCase()}.png` },
            latlng: c.latlng || [0, 0]
          }));
        if (mapped.length) return mapped;
      } catch { /* continúa al siguiente espejo */ }
    }

    throw new Error('API de países no disponible');
  },
  // API 3: Nominatim (ciudad -> coordenadas). Se guarda en localStorage para respetar su límite de 1 petición/s
  async coords(city, country) {
    const k = 'px_geo_' + city, c = LS.get(k, null);
    if (c) return c;
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city + ', ' + country)}`);
    const j = await r.json();
    if (!j[0]) throw new Error('Sin resultados');
    const v = [parseFloat(j[0].lat), parseFloat(j[0].lon)];
    LS.set(k, v);
    return v;
  },
  // API 2: Open-Meteo (clima actual + pronóstico de 5 días)
  async clima([la, lo]) {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}` +
      '&current=temperature_2m,wind_speed_10m,weather_code' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5';
    const r = await fetch(u);
    if (!r.ok) throw new Error('Open-Meteo ' + r.status);
    return r.json();
  }
};
const W = {}; // caché de promesas de clima por clave
const clima = (key, pos) => (W[key] ??= API.clima(pos).catch(e => { delete W[key]; throw e; }));

/* ---------- 5. UTILIDADES ---------- */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const ids = () => Object.keys(EX).filter(cc => S.paises[cc]);
const nombre = c => c.translations?.spa?.common || c.name.common;
const wmo = c => c === 0 ? ['sunny','Despejado'] : c < 3 ? ['partly_cloudy_day','Parcial'] : c === 3 ? ['cloud','Nublado'] :
  c < 50 ? ['foggy','Niebla'] : (c < 70 || (c >= 80 && c < 83)) ? ['rainy','Lluvia'] : c < 80 ? ['weather_snowy','Nieve'] : ['thunderstorm','Tormenta'];
const fmtFecha = (iso, o = {day:'numeric', month:'short', year:'numeric'}) => new Date(iso + 'T00:00').toLocaleDateString('es', o);
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), 2600); };
const empty = (icon, t, p) => `<div class="col-span-full flex flex-col items-center py-space-xl px-space-md bg-surface-container-lowest rounded-xl text-center shadow-sm"><span class="material-symbols-outlined text-primary text-[40px] mb-space-sm">${icon}</span><h3 class="font-headline-md text-headline-md">${t}</h3><p class="font-body-md text-body-md text-on-surface-variant max-w-md mt-1">${p}</p></div>`;

/* ---------- 6. VISTAS ---------- */
const card = c => {
  const x = EX[c.cca2], f = S.favs.includes(c.cca2);
  return `<article data-go="#/destino/${c.cca2}" class="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer">
  <div class="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
    <img alt="${esc(x.city)}" loading="lazy" onerror="this.style.display='none'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${foto(x.img)}"/>
    <div class="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md flex items-center gap-1 shadow-sm font-label-sm text-label-sm text-on-surface"><span class="material-symbols-outlined text-[14px] text-tertiary-container fill-1">star</span><span class="font-bold">${x.rating}</span></div>
    <button data-fav="${c.cca2}" type="button" aria-label="Guardar ${esc(x.city)} en favoritos" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-sm ${f ? 'text-primary' : 'text-on-surface-variant'}"><span class="material-symbols-outlined text-[20px] ${f ? 'fill-1' : ''}">favorite</span></button>
  </div>
  <div class="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
    <div><div class="flex items-center justify-between gap-2"><h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">${esc(x.city)}</h3>
      <span class="font-badge-caps text-badge-caps uppercase text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">${REGION[c.region] || c.region}</span></div>
      <p class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-1"><img src="${c.flags.png}" alt="" class="w-4 h-3 object-cover rounded-sm"/>${esc(nombre(c))} · ${esc((c.capital || ['—'])[0])}</p>
      <p class="font-body-sm text-body-sm text-on-surface-variant">Población: ${(c.population / 1e6).toFixed(1)} M</p></div>
    <div class="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-tertiary">thermostat</span><span data-temp="${c.cca2}">…</span></span>
      <span class="font-label-md text-label-md text-primary font-bold">${x.price} <span class="font-body-sm font-normal text-on-surface-variant">/día</span></span></div>
  </div></article>`;
};

// Rellena la temperatura actual (Open-Meteo) de cada tarjeta usando la latitud/longitud del país
const fillTemps = () => $$('[data-temp]').forEach(async el => {
  const cc = el.dataset.temp;
  try { el.textContent = Math.round((await clima(cc, S.paises[cc].latlng)).current.temperature_2m) + '°C'; }
  catch { el.textContent = '—'; }
});

const rInicio = () => { $('#home-grid').innerHTML = ids().slice(0, 4).map(cc => card(S.paises[cc])).join(''); fillTemps(); };

const rExplorar = () => {
  const q = S.q.toLowerCase();
  const l = ids().filter(cc => { const c = S.paises[cc];
    return (S.region === 'Todos' || REGION[c.region] === S.region) && (!q || (EX[cc].city + ' ' + nombre(c)).toLowerCase().includes(q)); });
  $('#exp-grid').innerHTML = l.length ? l.map(cc => card(S.paises[cc])).join('') : empty('search_off', 'No se encontraron destinos', 'Prueba con otro nombre o cambia la región.');
  $('#exp-count').textContent = `Mostrando ${l.length} de ${ids().length} destinos`;
  $$('#exp-pills [data-reg]').forEach(b => { const on = b.dataset.reg === S.region;
    b.className = `whitespace-nowrap px-space-md py-1.5 rounded-full font-label-md text-label-md shadow-sm ${on ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'}`; });
  fillTemps();
};

const rFavoritos = () => {
  const q = ($('#fav-q').value || '').toLowerCase();
  const l = S.favs.filter(cc => S.paises[cc] && (EX[cc].city + ' ' + nombre(S.paises[cc])).toLowerCase().includes(q));
  $('#fav-count').textContent = `${S.favs.length} ${S.favs.length === 1 ? 'destino guardado' : 'destinos guardados'}`;
  $('#fav-grid').innerHTML = l.length ? l.map(cc => card(S.paises[cc])).join('')
    : empty('heart_broken', S.favs.length ? 'Sin coincidencias' : 'Aún no tienes favoritos', S.favs.length ? 'Ningún favorito coincide con tu búsqueda.' : 'Toca el corazón en cualquier destino para guardarlo aquí.');
  fillTemps();
};

const rDestino = async cc => {
  const c = S.paises[cc], box = $('#det');
  if (!c) { location.hash = '#/explorar'; return; }
  const x = EX[cc], f = S.favs.includes(cc);
  const lang = Object.values(c.languages || {}).join(', ') || '—';
  const mon = Object.values(c.currencies || {}).map(m => `${m.name} (${m.symbol || ''})`).join(', ') || '—';
  const fact = (ic, l, v) => `<div class="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low"><span class="material-symbols-outlined text-secondary text-[20px]">${ic}</span><span class="font-label-sm text-label-sm text-on-surface-variant">${l}</span><span class="font-label-md text-label-md font-bold">${esc(v)}</span></div>`;
  box.innerHTML = `
  <a href="#/explorar" class="inline-flex items-center gap-space-xs mb-space-md px-space-md py-space-sm bg-surface-container-lowest rounded-full font-label-md text-label-md shadow-sm"><span class="material-symbols-outlined text-[20px]">arrow_back</span>Volver a explorar</a>
  <div class="relative rounded-xl overflow-hidden h-72 md:h-96 bg-surface-container">
    <img alt="${esc(x.city)}" onerror="this.style.display='none'" class="w-full h-full object-cover" src="${foto(x.img)}"/>
    <div class="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent flex items-end p-space-lg">
      <div><h1 class="font-display-hero text-display-hero text-white">${esc(x.city)}, ${esc(nombre(c))}</h1>
      <p class="text-white/90 font-body-lg text-body-lg flex items-center gap-2"><img src="${c.flags.png}" alt="Bandera" class="w-6 h-4 object-cover rounded-sm"/>${REGION[c.region] || c.region} · ★ ${x.rating}</p></div></div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-space-lg">
    <div class="lg:col-span-8 flex flex-col gap-space-lg">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-space-sm bg-surface-container-lowest p-space-lg rounded-xl shadow-md">
        ${fact('location_city','Capital',(c.capital || ['—'])[0])}${fact('groups','Población',c.population.toLocaleString('es'))}${fact('translate','Idiomas',lang)}${fact('payments','Moneda',mon)}</div>
      <article class="bg-surface-container-lowest p-space-lg rounded-xl shadow-md"><h2 class="font-headline-md text-headline-md">Acerca de ${esc(x.city)}</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">${esc(x.desc)}</p>
        <p class="font-body-md text-body-md text-on-surface-variant mt-space-sm">Presupuesto de referencia: <b class="text-primary">${x.price} por día</b>.</p></article>
    </div>
    <aside class="lg:col-span-4 flex flex-col gap-space-md">
      <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-lg flex flex-col gap-space-sm">
        <h3 class="font-headline-md text-headline-md">¿Listo para ${esc(x.city)}?</h3>
        <button data-trip="${cc}" type="button" class="w-full py-space-md bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-full shadow-md flex items-center justify-center gap-space-xs"><span class="material-symbols-outlined text-[20px]">add_circle</span>Agregar a mi itinerario</button>
        <button data-fav="${cc}" type="button" class="w-full py-space-sm bg-surface-container-low hover:bg-surface-container font-label-md text-label-md rounded-full flex items-center justify-center gap-space-xs ${f ? 'text-primary' : ''}"><span class="material-symbols-outlined text-[18px] ${f ? 'fill-1' : ''}">favorite</span>${f ? 'Quitar de favoritos' : 'Guardar en favoritos'}</button>
      </div>
      <div id="det-w" class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs"><p class="font-body-md text-body-md text-on-surface-variant">Cargando clima…</p></div>
    </aside>
  </div>`;
  // Flujo del enunciado: ciudad -> Nominatim (coordenadas) -> Open-Meteo (clima)
  const w = $('#det-w');
  try {
    let pos, fuente = 'Nominatim';
    try { pos = await API.coords(x.city, nombre(c)); } catch { pos = c.latlng; fuente = 'centro del país'; }
    const d = await clima('det' + cc + pos.join(), pos);
    if (location.hash !== '#/destino/' + cc) return;
    const [ic, tx] = wmo(d.current.weather_code);
    w.innerHTML = `<div class="flex items-center justify-between"><span class="font-label-md text-label-md font-bold flex items-center gap-1"><span class="material-symbols-outlined text-tertiary text-[20px]">cloud_sync</span>Clima en ${esc(x.city)}</span><span class="font-body-sm text-body-sm text-on-surface-variant">Coordenadas: ${fuente}</span></div>
      <div class="flex items-center gap-space-md bg-surface-container-lowest rounded-lg p-space-md"><span class="material-symbols-outlined text-tertiary text-[40px]">${ic}</span>
        <div><p class="font-headline-lg text-headline-lg">${Math.round(d.current.temperature_2m)}°C</p><p class="font-body-sm text-body-sm text-on-surface-variant">${tx} · Viento ${Math.round(d.current.wind_speed_10m)} km/h · Lluvia ${d.daily.precipitation_probability_max[0] ?? 0}%</p></div></div>
      ${d.daily.time.map((t, i) => { const [i2, t2] = wmo(d.daily.weather_code[i]);
        return `<div class="flex items-center justify-between py-1 bg-surface-container-lowest px-space-sm rounded-lg"><span class="font-label-sm text-label-sm w-16 capitalize">${i ? fmtFecha(t, {weekday:'short'}) : 'Hoy'}</span><span class="flex items-center gap-1 text-tertiary"><span class="material-symbols-outlined text-[18px]">${i2}</span><span class="font-body-sm text-body-sm text-on-surface-variant">${t2}</span></span><span class="font-label-sm text-label-sm font-bold">${Math.round(d.daily.temperature_2m_max[i])}° / ${Math.round(d.daily.temperature_2m_min[i])}°</span></div>`; }).join('')}`;
  } catch { w.innerHTML = '<p class="font-body-md text-body-md text-error">No se pudo cargar el clima. Inténtalo más tarde.</p>'; }
};

const tripHtml = t => {
  const c = S.paises[t.dest], n = t.days;
  const dias = Array.from({length: n}, (_, i) => {
    const d = new Date(t.start + 'T00:00'); d.setDate(d.getDate() + i);
    const acts = t.acts[i + 1] || [], key = t.id + '|' + (i + 1);
    return `<details ${S.open.has(key) ? 'open' : ''} class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <summary class="p-space-md flex items-center justify-between gap-space-sm hover:bg-surface-container-low/50">
        <span class="flex items-center gap-space-md"><span class="px-space-md py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md">Día ${i + 1}</span><span class="font-label-md text-label-md capitalize">${d.toLocaleDateString('es', {weekday:'long', day:'numeric', month:'long'})}</span></span>
        <span class="flex items-center gap-space-sm"><span class="font-badge-caps text-badge-caps px-2 py-0.5 rounded-full bg-surface-container">${acts.length} ${acts.length === 1 ? 'actividad' : 'actividades'}</span><span class="material-symbols-outlined chev transition-transform">expand_more</span></span></summary>
      <div class="px-space-md pb-space-md flex flex-col gap-space-sm">
        ${acts.map((a, j) => `<div class="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low"><span class="font-body-md text-body-md">${esc(a)}</span><button data-del-act="${key}|${j}" aria-label="Eliminar actividad" class="text-on-surface-variant hover:text-error"><span class="material-symbols-outlined text-[18px]">close</span></button></div>`).join('')}
        <div class="flex gap-space-sm"><input data-act-in="${key}" maxlength="80" placeholder="Ej. Visitar el centro histórico" class="flex-1 bg-surface-container-low rounded-full px-4 py-2 font-body-md text-body-md focus:outline-none"/>
          <button data-add-act="${key}" type="button" aria-label="Agregar actividad" class="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><span class="material-symbols-outlined">add</span></button></div>
      </div></details>`; }).join('');
  return `<div class="flex flex-col gap-space-md">
    <div class="bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div class="flex items-center gap-space-md">${c ? `<img src="${c.flags.png}" alt="" class="w-12 h-8 object-cover rounded"/>` : ''}
        <div><h2 class="font-headline-md text-headline-md">${esc(t.name)}</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">${esc(c ? EX[t.dest].city + ', ' + nombre(c) : t.dest)} · ${fmtFecha(t.start)} – ${fmtFecha(t.end)}</p></div></div>
      <div class="flex flex-wrap items-center gap-space-sm"><span class="px-3 py-1 rounded-full bg-surface-container-low font-label-sm text-label-sm">${n} días</span><span class="px-3 py-1 rounded-full bg-surface-container-low font-label-sm text-label-sm">${t.trav} ${t.trav === 1 ? 'viajero' : 'viajeros'}</span><span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">$${Number(t.bud).toLocaleString('es')} USD</span>
        <button data-del-trip="${t.id}" aria-label="Eliminar viaje" class="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">delete</span></button></div>
      ${t.com ? `<p class="w-full font-body-md text-body-md text-on-surface-variant">${esc(t.com)}</p>` : ''}</div>
    <div class="flex flex-col gap-space-sm">${dias}</div></div>`;
};
const rItinerario = () => { $('#trips').innerHTML = S.trips.length ? S.trips.map(tripHtml).join('') : empty('luggage', 'Aún no tienes viajes', 'Pulsa “Crear nuevo viaje” para planificar tu primer itinerario.'); };

/* ---------- 7. FORMULARIO (MODAL) CON VALIDACIÓN ---------- */
const campos = ['name','dest','start','end','trav','bud'];
const openModal = async (cc = '') => {
  await ensure();
  $('#f-dest').innerHTML = '<option value="">Selecciona un destino</option>' + ids().map(k => `<option value="${k}">${esc(EX[k].city)}, ${esc(nombre(S.paises[k]))}</option>`).join('');
  $('#trip-form').reset(); $('#f-dest').value = cc; $('#f-trav').value = 1;
  if (cc) $('#f-name').value = 'Viaje a ' + nombre(S.paises[cc]);
  $('#f-start').min = new Date().toISOString().slice(0, 10);
  $$('[data-err]').forEach(p => p.textContent = ''); campos.forEach(k => $('#f-' + k).classList.remove('field-error'));
  $('#modal').classList.replace('hidden', 'flex'); $('#f-name').focus();
};
const closeModal = () => $('#modal').classList.replace('flex', 'hidden');
const validar = () => {
  const g = k => $('#f-' + k).value.trim(), hoy = new Date().toISOString().slice(0, 10), e = {};
  if (g('name').length < 3) e.name = 'Escribe al menos 3 caracteres.';
  if (!g('dest')) e.dest = 'Selecciona un destino.';
  if (!g('start')) e.start = 'Indica la fecha de inicio.'; else if (g('start') < hoy) e.start = 'No puede ser anterior a hoy.';
  if (!g('end')) e.end = 'Indica la fecha de finalización.'; else if (g('end') < g('start')) e.end = 'Debe ser igual o posterior al inicio.';
  else if ((new Date(g('end')) - new Date(g('start'))) / 864e5 > 59) e.end = 'El viaje no puede superar 60 días.';
  const n = Number(g('trav')); if (!Number.isInteger(n) || n < 1 || n > 20) e.trav = 'Debe estar entre 1 y 20.';
  if (g('bud') === '' || Number(g('bud')) < 0) e.bud = 'Ingresa un presupuesto de 0 o más.';
  return e;
};

/* ---------- 8. EVENTOS (delegación) ---------- */
const toggleFav = cc => {
  const i = S.favs.indexOf(cc); i < 0 ? S.favs.push(cc) : S.favs.splice(i, 1); persist();
  toast(i < 0 ? 'Agregado a favoritos' : 'Eliminado de favoritos');
  if (location.hash === '#/favoritos') rFavoritos(); else if (location.hash.startsWith('#/destino')) rDestino(cc);
  else $$(`[data-fav="${cc}"]`).forEach(b => { const on = i < 0; b.classList.toggle('text-primary', on); b.classList.toggle('text-on-surface-variant', !on); b.querySelector('span').classList.toggle('fill-1', on); });
};
const actKey = s => { const [id, d, j] = s.split('|'); return { t: S.trips.find(t => t.id === id), d: Number(d), j: Number(j) }; };
const addAct = key => {
  const inp = $(`[data-act-in="${key}"]`), v = inp.value.trim(); if (!v) { inp.focus(); return; }
  const { t, d } = actKey(key); (t.acts[d] ||= []).push(v); S.open.add(key); persist(); rItinerario();
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-fav],[data-go],[data-trip],[data-del-trip],[data-add-act],[data-del-act],[data-reg],[data-close],#new-trip,#home-search,#api-retry');
  if (!el) return;
  const d = el.dataset;
  if (d.fav) toggleFav(d.fav);
  else if (d.go) location.hash = d.go;
  else if (d.trip) { location.hash = '#/itinerario'; openModal(d.trip); }
  else if (d.delTrip) { if (confirm('¿Eliminar este viaje?')) { S.trips = S.trips.filter(t => t.id !== d.delTrip); persist(); rItinerario(); } }
  else if (d.addAct) addAct(d.addAct);
  else if (d.delAct) { const { t, d: dia, j } = actKey(d.delAct); t.acts[dia].splice(j, 1); S.open.add(d.delAct.split('|').slice(0, 2).join('|')); persist(); rItinerario(); }
  else if (d.reg) { S.region = d.reg; rExplorar(); }
  else if (el.hasAttribute('data-close')) closeModal();
  else if (el.id === 'new-trip') openModal();
  else if (el.id === 'home-search') { S.q = $('#home-q').value.trim(); $('#exp-q').value = S.q; location.hash = '#/explorar'; }
  else if (el.id === 'api-retry') { S.paises = {}; route(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset.actIn) { e.preventDefault(); addAct(e.target.dataset.actIn); }
  if (e.key === 'Enter' && e.target.id === 'home-q') $('#home-search').click();
  if (e.key === 'Escape') closeModal();
});
$('#exp-q').addEventListener('input', e => { S.q = e.target.value.trim(); rExplorar(); });
$('#fav-q').addEventListener('input', rFavoritos);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

$('#trip-form').addEventListener('submit', e => {
  e.preventDefault();
  const er = validar();
  campos.forEach(k => $('#f-' + k).classList.toggle('field-error', !!er[k]));
  $$('[data-err]').forEach(p => p.textContent = er[p.dataset.err] || '');
  if (Object.keys(er).length) { $('#f-' + Object.keys(er)[0]).focus(); return; }
  const g = k => $('#f-' + k).value.trim();
  S.trips.unshift({ id: 't' + Date.now(), name: g('name'), dest: g('dest'), start: g('start'), end: g('end'),
    days: (new Date(g('end')) - new Date(g('start'))) / 864e5 + 1, trav: Number(g('trav')), bud: Number(g('bud')), com: g('com'), acts: {} });
  persist(); closeModal(); location.hash = '#/itinerario'; rItinerario(); toast('Viaje guardado');
});


/* ---------- Navegación móvil ---------- */
const mobileMenuButton = $('#mobile-menu-toggle');
const mobileMenu = $('#mobile-nav');
const mobileMenuIcon = $('#mobile-menu-icon');

const closeMobileMenu = () => {
  if (!mobileMenuButton || !mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenuButton.setAttribute('aria-label', 'Abrir menú de navegación');
  if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
};

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenuButton.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
    if (mobileMenuIcon) mobileMenuIcon.textContent = isOpen ? 'close' : 'menu';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Cierra el desplegable con Escape, sin interferir con el router SPA.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
      mobileMenuButton.focus();
    }
  });

  // Cierra el menú al pulsar fuera de la cabecera.
  document.addEventListener('click', event => {
    if (!mobileMenu.classList.contains('is-open')) return;
    if (!event.target.closest('header')) closeMobileMenu();
  });
}

/* ---------- 9. ROUTER Y ARRANQUE ---------- */
let cargando = null;
const ensure = () => {
  if (ids().length) return Promise.resolve();
  const msg = $('#api-error-msg');
  return (cargando ??= API.paises(Object.keys(EX).join(',')).then(l => { l.forEach(c => S.paises[c.cca2] = c); $('#api-error').classList.add('hidden'); })
    .catch(err => { console.error('[Planify] Error cargando países:', err);
      FALLBACK.forEach(c => S.paises[c.cca2] = c);
      msg.textContent = 'La API de países no responde. Mostramos datos de respaldo; pulsa Reintentar para volver a intentarlo.';
      $('#api-error').classList.remove('hidden'); }).finally(() => { cargando = null; }));
};
const VISTAS = ['inicio','explorar','destino','favoritos','itinerario','acerca'];
const route = async () => {
  closeMobileMenu();
  const [v0, p] = location.hash.replace(/^#\/?/, '').split('/');
  const v = VISTAS.includes(v0) ? v0 : 'inicio';
  $$('.view').forEach(s => s.classList.toggle('active', s.id === 'v-' + v));
  $$('[data-nav]').forEach(a => { const on = a.dataset.nav === (v === 'destino' ? 'explorar' : v);
    a.className = `px-space-md py-space-sm rounded-full font-label-md text-label-md transition-all ${on ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`; });
  window.scrollTo(0, 0);
  if (v === 'acerca') return;
  if (v === 'itinerario') { rItinerario(); ensure(); return; }
  await ensure();
  if (!ids().length) return;
  ({ inicio: rInicio, explorar: rExplorar, favoritos: rFavoritos, destino: () => rDestino(p) })[v]();
};
window.addEventListener('hashchange', route);
route();
});