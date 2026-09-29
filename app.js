const $=id=>document.getElementById(id);
let allResults=[];
let currentFilter='all';

const cat = {
  shop:'shop',
  restaurant:'amenity=restaurant',
  fast_food:'amenity=fast_food',
  cafe:'amenity=cafe',
  hairdresser:'shop=hairdresser',
  gym:'leisure=fitness_centre',
  clinic:'amenity=clinic',
  hotel:'tourism=hotel',
  car_repair:'shop=car_repair',
  bakery:'shop=bakery',
  pizza:'cuisine=pizza'
};

function status(msg,error=false){
  const e=$('status'); e.className='status'; e.textContent=msg;
  e.style.borderColor=error?'#714044':'#303c52';
}
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function coords(e){return {lat:Number(e.lat??e.center?.lat),lon:Number(e.lon??e.center?.lon)}}
function dist(a,b){
  const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLon=(b.lon-a.lon)*Math.PI/180;
  const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
async function geocode(place){
  const u=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`;
  const r=await fetch(u,{headers:{Accept:'application/json'}}); if(!r.ok)throw Error('Falha ao localizar a região.');
  const d=await r.json(); if(!d.length)throw Error('Local não encontrado.');
  return {lat:+d[0].lat,lon:+d[0].lon,name:d[0].display_name};
}
function query(lat,lon,r,c){
  const a=`(around:${r},${lat},${lon})`;
  if(c==='all')return `[out:json][timeout:40];(nwr${a}[name][shop];nwr${a}[name][amenity~"restaurant|fast_food|cafe|clinic"];nwr${a}[name][tourism=hotel];nwr${a}[name][leisure=fitness_centre];);out center tags meta;`;
  if(c==='pizza')return `[out:json][timeout:40];nwr${a}[name][cuisine~"pizza",i];out center tags meta;`;
  const [k,v]=cat[c].split('=');
  return v?`[out:json][timeout:40];nwr${a}[name][${k}=${v}];out center tags meta;`:`[out:json][timeout:40];nwr${a}[name][${k}];out center tags meta;`;
}
async function overpass(q){
  for(const ep of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']){
    try{const r=await fetch(ep,{method:'POST',body:q});if(r.ok)return await r.json()}catch(e){}
  } throw Error('Os servidores de mapa estão ocupados. Tente novamente.');
}
function normalizeInstagram(v=''){
  if(!v)return '';
  if(v.startsWith('http'))return v;
  const u=v.replace(/^@/,'');
  return `https://www.instagram.com/${u}/`;
}
function opportunity(x){
  // Conservative: no automatic claim that a visual design is "bad".
  // These are lead signals, not proof.
  const signals=[];
  if(!x.website)signals.push('sem site cadastrado');
  if(!x.instagram)signals.push('sem Instagram cadastrado');
  if(x.name.length<4)signals.push('cadastro incompleto');
  return signals;
}
function render(){
  const arr=allResults.filter(x=>{
    if(currentFilter==='website')return !x.website;
    if(currentFilter==='instagram')return !x.instagram;
    if(currentFilter==='design')return x.designSignals.length>0;
    return true;
  });
  $('results').innerHTML=arr.length?arr.map(x=>card(x)).join(''):'<div class="empty">Nenhum resultado nesse filtro.</div>';
  $('total').textContent=allResults.length;
  $('noSite').textContent=allResults.filter(x=>!x.website).length;
  $('design').textContent=allResults.filter(x=>x.designSignals.length).length;
}
function card(x){
  const tags=[];
  tags.push(`<span class="tag good">✓ encontrado agora</span>`);
  if(x.website)tags.push('<span class="tag">site cadastrado</span>');else tags.push('<span class="tag bad">sem site</span>');
  if(x.instagram)tags.push('<span class="tag">Instagram</span>');else tags.push('<span class="tag warn">Instagram não cadastrado</span>');
  const ig=x.instagram?`<a href="${esc(x.instagram)}" target="_blank" rel="noopener">📷 Instagram</a>`:'';
  const web=x.website?`<a href="${esc(x.website)}" target="_blank" rel="noopener">🌐 Site</a>`:'';
  const phone=x.phone?`<a href="tel:${esc(x.phone)}">📞 Ligar</a><button class="copy" data-copy="${esc(x.phone)}">📋 Copiar telefone</button>`:'';
  const igcopy=x.instagram?`<button class="copy" data-copy="${esc(x.instagram)}">📋 Copiar Instagram</button>`:'';
  const maps=`<a href="https://www.openstreetmap.org/?mlat=${x.lat}&mlon=${x.lon}#map=18/${x.lat}/${x.lon}" target="_blank" rel="noopener">🗺️ Mapa</a>`;
  return `<article class="card"><h3>${esc(x.name)}</h3><div class="tags">${tags.join('')}</div><div class="meta">📍 ${x.distance.toFixed(1)} km<br>${x.phone?'📞 '+esc(x.phone)+'<br>':''}${x.address?'🏠 '+esc(x.address)+'<br>':''}</div><div class="links">${phone}${ig}${igcopy}${web}${maps}</div>${x.designSignals.length?`<div class="design-note">🎨 Possível oportunidade de design: ${esc(x.designSignals.join(', '))}. Isso é um sinal de prospecção, não uma avaliação automática de qualidade visual.</div>`:''}<div class="fresh">Dados do mapa: ${esc(x.updated||'horário da base não informado')} • última edição do objeto: ${esc(x.edited||'não informada')}</div></article>`;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-copy]');
  if(b)navigator.clipboard?.writeText(b.dataset.copy).then(()=>{const old=b.textContent;b.textContent='✓ Copiado';setTimeout(()=>b.textContent=old,1200)});
  const f=e.target.closest('.filter');
  if(f){document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');currentFilter=f.dataset.filter;render()}
});
async function search(){
  const place=$('location').value.trim(), c=$('category').value, r=+$('radius').value;
  if(!place)return status('Digite uma cidade/região ou use sua localização.',true);
  $('searchBtn').disabled=true;$('searchBtn').textContent='⏳ Pesquisando...';$('results').innerHTML='';
  try{
    status('Consultando dados atuais do OpenStreetMap/Overpass...');
    const center=await geocode(place), data=await overpass(query(center.lat,center.lon,r,c));
    const baseTime=data.osm3s?.timestamp||'base sem horário informado';
    allResults=data.elements.map(e=>{
      const t=e.tags||{}, p=coords(e);
      const website=t.website||t['contact:website']||'';
      const instagram=normalizeInstagram(t.instagram||t['contact:instagram']||t['contact:instagram:url']||'');
      const x={name:t.name||'Sem nome',website,instagram,phone:t.phone||t['contact:phone']||'',address:[t['addr:street'],t['addr:housenumber'],t['addr:suburb']].filter(Boolean).join(', '),distance:dist(center,p),lat:p.lat,lon:p.lon,updated:baseTime,edited:e.timestamp||'',designSignals:[]};
      x.designSignals=opportunity(x);
      return x;
    }).filter(x=>x.name!=='Sem nome').sort((a,b)=>a.distance-b.distance);
    $('summary').classList.remove('hidden');$('filters').classList.remove('hidden');currentFilter='all';
    document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter==='all'));
    render();
    status(`Busca concluída. ${allResults.length} estabelecimentos foram retornados pela base consultada. A base do Overpass informa ${baseTime}.`);
  }catch(e){status(e.message||'Erro na pesquisa.',true)}
  finally{$('searchBtn').disabled=false;$('searchBtn').textContent='🔍 Encontrar oportunidades'}
}
$('searchBtn').onclick=search;
$('locateBtn').onclick=()=>{
  if(!navigator.geolocation)return status('Geolocalização não disponível.',true);
  status('Solicitando sua localização...');
  navigator.geolocation.getCurrentPosition(async p=>{
    try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${p.coords.latitude}&lon=${p.coords.longitude}`);const d=await r.json();$('location').value=d.display_name||`${p.coords.latitude}, ${p.coords.longitude}`;status('Localização preenchida. Agora pesquise.')}catch(e){status('Localização obtida, mas não consegui converter para endereço.',true)}
  },()=>status('Permissão de localização negada. Digite a cidade manualmente.',true));
};
