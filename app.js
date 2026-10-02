
const KEY="radarPlatformsV10";
const OLD_KEYS=["radarPlatformsV9","radarPlatformsV8","radarPlatformsV7"];
const PEXELS_ENDPOINT="https://api.pexels.com/v1/search";

const DESIGNS=[
 {id:"impacto",name:"Hero Impacto",desc:"Imagem grande, marca forte e CTA",types:["restaurant","pizza","generic","shop"]},
 {id:"editorial",name:"Editorial",desc:"Tipografia grande e composição assimétrica",types:["restaurant","salon","shop","generic"]},
 {id:"bento",name:"Bento",desc:"Blocos visuais variados",types:["pet","shop","market","generic"]},
 {id:"catalogo",name:"Catálogo",desc:"Produtos e serviços em primeiro plano",types:["shop","market","pet","restaurant"]},
 {id:"premium",name:"Premium",desc:"Minimalista, elegante e sofisticado",types:["restaurant","barber","salon","hotel","generic"]},
 {id:"bold",name:"Bold",desc:"Contraste forte e títulos grandes",types:["barber","gym","shop","pizza"]},
 {id:"natural",name:"Natural",desc:"Orgânico, leve e acolhedor",types:["pet","market","restaurant","generic"]},
 {id:"servicos",name:"Serviços",desc:"Feito para negócios de atendimento",types:["barber","salon","gym","generic"]},
 {id:"menu",name:"Menu",desc:"Estrutura focada em cardápio",types:["restaurant","pizza","cafe"]},
 {id:"local",name:"Local Business",desc:"Contato, localização e conversão",types:["generic","barber","salon","pet","shop"]}
];

const TYPE_INFO={
 restaurant:{label:"Restaurante",queries:["restaurant food","restaurant interior","dish food"],colors:["warm","green"]},
 pizza:{label:"Pizzaria",queries:["pizza restaurant","pizza close up","pizza oven"],colors:["warm","red"]},
 barber:{label:"Barbearia",queries:["barbershop","barber haircut","mens haircut"],colors:["black","brown"]},
 salon:{label:"Salão de beleza",queries:["beauty salon","hair salon","beauty treatment"],colors:["pink","beige"]},
 shop:{label:"Loja",queries:["retail store","fashion boutique","store products"],colors:["neutral"]},
 market:{label:"Mercado",queries:["grocery store","fresh produce","market"],colors:["green","yellow"]},
 pet:{label:"Pet shop / Agro Pet",queries:["pet shop","dog cat pet","pet products"],colors:["green","beige"]},
 gym:{label:"Academia",queries:["modern gym","fitness training","gym interior"],colors:["black","blue"]},
 cafe:{label:"Café",queries:["coffee shop","coffee cup","cafe interior"],colors:["brown","beige"]},
 generic:{label:"Negócio local",queries:["local business","modern storefront","small business"],colors:["neutral"]}
};

const TYPE_FROM_TEXT=[
 [/pizz|pizza/i,"pizza"],[/barbear|barber/i,"barber"],[/sal[aã]o|beleza|cabeleire/i,"salon"],
 [/pet|agro/i,"pet"],[/academia|gym|fitness/i,"gym"],[/caf[eé]/i,"cafe"],[/mercado|supermercado/i,"market"],
 [/restaurante|lanch|hamburg|comida/i,"restaurant"],[/loja|boutique|moda/i,"shop"]
];

const SUGGESTIONS={
 restaurant:[["Prato do dia","Destaque da casa para experimentar.","R$ 00,00"],["Hambúrguer artesanal","Sugestão de item para o cardápio.","R$ 00,00"],["Sobremesa","Sugestão de sobremesa da casa.","R$ 00,00"]],
 pizza:[["Pizza Margherita","Sugestão de sabor para conferir.","R$ 00,00"],["Pizza da Casa","Sugestão de sabor especial.","R$ 00,00"],["Combo","Pizza + bebida como sugestão.","R$ 00,00"]],
 barber:[["Corte masculino","Sugestão de serviço para revisar.","R$ 00,00"],["Barba","Sugestão de serviço para revisar.","R$ 00,00"],["Corte + barba","Sugestão de combo.","R$ 00,00"]],
 salon:[["Corte","Sugestão de serviço para revisar.","R$ 00,00"],["Coloração","Sugestão de serviço para revisar.","R$ 00,00"],["Tratamento","Sugestão de serviço para revisar.","R$ 00,00"]],
 pet:[["Ração","Sugestão de produto para revisar.","R$ 00,00"],["Petiscos","Sugestão de produto para revisar.","R$ 00,00"],["Acessórios","Sugestão de categoria para revisar.","R$ 00,00"]],
 shop:[["Produto em destaque","Sugestão de produto para revisar.","R$ 00,00"],["Novidade","Sugestão de item para revisar.","R$ 00,00"],["Mais vendido","Sugestão de item para revisar.","R$ 00,00"]],
 market:[["Cesta básica","Sugestão de categoria para revisar.","R$ 00,00"],["Produtos frescos","Sugestão de categoria para revisar.","R$ 00,00"],["Ofertas","Sugestão de destaque para revisar.","R$ 00,00"]],
 gym:[["Musculação","Sugestão de modalidade para revisar.","R$ 00,00"],["Funcional","Sugestão de modalidade para revisar.","R$ 00,00"],["Personal","Sugestão de serviço para revisar.","R$ 00,00"]],
 cafe:[["Café especial","Sugestão de item para revisar.","R$ 00,00"],["Bolo da casa","Sugestão de item para revisar.","R$ 00,00"],["Combo café","Sugestão de combo para revisar.","R$ 00,00"]],
 generic:[["Serviço principal","Sugestão para revisar.","R$ 00,00"],["Produto em destaque","Sugestão para revisar.","R$ 00,00"],["Oferta","Sugestão para revisar.","R$ 00,00"]]
};

const FALLBACK_IMAGES={
 restaurant:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4","https://images.unsplash.com/photo-1504674900247-0877df9cc836"],
 pizza:["https://images.unsplash.com/photo-1574071318508-1cdbab80d002"],
 barber:["https://images.unsplash.com/photo-1503951914875-452162b0f3f1"],
 salon:["https://images.unsplash.com/photo-1560066984-138dadb4c035"],
 shop:["https://images.unsplash.com/photo-1441986300917-64674bd600d8"],
 market:["https://images.unsplash.com/photo-1542838132-92c53300491e"],
 pet:["https://images.unsplash.com/photo-1552053831-71594a27632d","https://images.unsplash.com/photo-1517849845537-4d257902454a"],
 gym:["https://images.unsplash.com/photo-1534438327276-14e5300c3a48"],
 cafe:["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"],
 generic:["https://images.unsplash.com/photo-1497366811353-6870744d04b2"]
};

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function uid(){return "p_"+Math.random().toString(36).slice(2,10)}
function load(){
 let raw=localStorage.getItem(KEY);
 if(raw) return JSON.parse(raw);
 for(const k of OLD_KEYS){raw=localStorage.getItem(k);if(raw){let arr=JSON.parse(raw);localStorage.setItem(KEY,JSON.stringify(arr));return arr}}
 return [];
}
function save(arr){localStorage.setItem(KEY,JSON.stringify(arr))}
function inferType(p){
 const text=[p.title,p.name,p.description,p.category].filter(Boolean).join(" ");
 for(const [rx,t] of TYPE_FROM_TEXT) if(rx.test(text)) return t;
 return "generic";
}
function pickDesign(type){
 const candidates=DESIGNS.filter(d=>d.types.includes(type));
 const pool=candidates.length?candidates:DESIGNS;
 return pool[Math.floor(Math.random()*pool.length)].id;
}
function wordmark(name){
 const parts=String(name||"Seu Negócio").trim().split(/\s+/);
 if(parts.length>1) return `<b>${esc(parts.slice(0,-1).join(" "))}</b><span>${esc(parts.at(-1))}</span>`;
 return `<b>${esc(parts[0])}</b><span></span>`;
}
function suggestedItems(type){
 return (SUGGESTIONS[type]||SUGGESTIONS.generic).map((x,i)=>({id:"i"+i,name:x[0],desc:x[1],price:x[2],suggested:true,image:""}));
}
function createPlatform(data={}){
 const p={
  id:uid(),name:data.name||data.title||"Novo negócio",title:data.title||data.name||"Novo negócio",
  description:data.description||"Uma presença digital profissional para o seu negócio.",
  category:data.category||"",address:data.address||"",phone:data.phone||"",whatsapp:data.whatsapp||"",instagram:data.instagram||"",
  type:data.type||inferType(data),design:pickDesign(data.type||inferType(data)),color:data.color||"",images:[],items:[],
  published:false,level:data.level||"professional",createdAt:Date.now()
 };
 p.items=suggestedItems(p.type); p.images=FALLBACK_IMAGES[p.type]||FALLBACK_IMAGES.generic; return p;
}
function current(){return window.__platforms=load()}
function renderApp(){
 const params=new URLSearchParams(location.search);
 if(params.has("site")) return renderPublic(params.get("site"));
 const arr=current();
 if(params.has("adm")){const p=arr.find(x=>x.id===params.get("adm")); if(p)return renderADM(p)}
 renderDashboard(arr);
}
function dashboardHeader(){
 return `<div class="top"><div class="brand"><img src="logo.png"><div>Radar de Clientes<small>Gerador de sites V10</small></div></div><button class="btn" onclick="newPlatform()">+ Criar plataforma</button></div>`;
}
function renderDashboard(arr){
 document.getElementById("app").innerHTML=dashboardHeader()+`<main class="wrap">
 <div class="card"><h1>Minhas plataformas</h1><p class="muted">Agora cada plataforma pode usar uma estrutura visual diferente.</p></div>
 <div class="grid" style="margin-top:14px">${arr.length?arr.map(platformCard).join(""):`<div class="card"><h3>Nenhuma plataforma ainda</h3><p class="muted">Crie a primeira e abra o ADM para começar.</p></div>`}</div>
 </main>`;
}
function platformCard(p){
 const d=DESIGNS.find(x=>x.id===p.design)||DESIGNS[0];
 return `<div class="card platform-card"><div class="row between"><span class="pill">${esc(TYPE_INFO[p.type]?.label||"Negócio")}</span><span class="pill">${esc(d.name)}</span></div><h3>${esc(p.name)}</h3><p class="muted">${esc(p.description)}</p>
 <div class="platform-actions"><button class="btn" onclick="openADM('${p.id}')">🔐 ADM</button><button class="btn alt" onclick="openPublic('${p.id}')">🌐 Site</button><button class="btn alt" onclick="editPlatform('${p.id}')">✏️ Editar</button><button class="btn alt" onclick="newAppearance('${p.id}')">🔄 Outra aparência</button><button class="btn danger" onclick="delPlatform('${p.id}')">Excluir</button></div></div>`;
}
function newPlatform(){editPlatform(null)}
function editPlatform(id){
 const p=id?current().find(x=>x.id===id):createPlatform({});
 const name=prompt("Nome do negócio:",p.name); if(name===null)return;
 p.name=p.title=name.trim()||p.name;
 const cat=prompt("Categoria/tipo do negócio (ex.: pizzaria, barbearia, pet shop):",p.category||TYPE_INFO[p.type]?.label||"");
 if(cat!==null){p.category=cat;p.type=inferType({...p,category:cat})}
 const desc=prompt("Descrição curta:",p.description||"");
 if(desc!==null)p.description=desc;
 let arr=current(); if(!id)arr.push(p); save(arr); location.href="?adm="+encodeURIComponent(p.id);
}
function openADM(id){location.href="?adm="+encodeURIComponent(id)}
function openPublic(id){location.href="?site="+encodeURIComponent(id)}
function sharePublic(p){const url=location.origin+location.pathname+"?site="+encodeURIComponent(p.id);navigator.clipboard?.writeText(url);return url}
function renderADM(p){
 document.getElementById("app").innerHTML=dashboardHeader()+`<main class="wrap">
 <div class="card">
  <div class="row between"><div><span class="pill">🔐 ADM</span><h1 style="margin:8px 0">${esc(p.name)}</h1><p class="muted">Edite o conteúdo e teste novas aparências sem perder os dados.</p></div>
  <div class="row"><button class="btn" onclick="openPublic('${p.id}')">🌐 Abrir site público</button><button class="btn alt" onclick="copyPublic('${p.id}')">📋 Copiar link</button></div></div>
  <div class="notice">💡 Produtos e serviços marcados como sugestões devem ser conferidos antes de publicar.</div>
 </div>
 <div class="grid" style="margin-top:14px">
  <div class="card"><h3>🎨 Aparência</h3><p><b>${esc((DESIGNS.find(x=>x.id===p.design)||DESIGNS[0]).name)}</b></p><p class="muted">${esc((DESIGNS.find(x=>x.id===p.design)||DESIGNS[0]).desc)}</p><button class="btn" onclick="newAppearance('${p.id}')">🔄 Gerar outra aparência</button></div>
  <div class="card"><h3>🖼️ Imagens</h3><p class="muted">Busca preparada para Pexels. Sem chave, usa imagens de fallback.</p><button class="btn alt" onclick="searchImages('${p.id}')">🔎 Buscar novas imagens</button></div>
  <div class="card"><h3>📝 Dados</h3><button class="btn alt" onclick="editPlatform('${p.id}')">Editar dados principais</button></div>
 </div>
 <div class="card" style="margin-top:14px"><h2>Produtos / serviços</h2><div class="grid">${p.items.map((it,i)=>`<div class="card"><span class="pill">${it.suggested?"💡 Sugestão":"Confirmado"}</span><label>Nome</label><input id="n${i}" value="${esc(it.name)}"><label>Descrição</label><textarea id="d${i}">${esc(it.desc)}</textarea><label>Preço</label><input id="pr${i}" value="${esc(it.price)}"><button class="btn" style="margin-top:8px" onclick="saveItem('${p.id}',${i})">Salvar item</button></div>`).join("")}</div></div>
 <div class="preview" style="margin-top:14px"><iframe src="?site=${encodeURIComponent(p.id)}"></iframe></div>
 </main>`;
}
function copyPublic(id){const p=current().find(x=>x.id===id);const u=sharePublic(p);alert("Link copiado:\\n"+u)}
function saveItem(id,i){
 const arr=current(),p=arr.find(x=>x.id===id);p.items[i].name=document.getElementById("n"+i).value;p.items[i].desc=document.getElementById("d"+i).value;p.items[i].price=document.getElementById("pr"+i).value;p.items[i].suggested=false;save(arr);renderADM(p)
}
function newAppearance(id){
 const arr=current(),p=arr.find(x=>x.id===id);const old=p.design;
 let next=pickDesign(p.type); if(DESIGNS.length>1)while(next===old)next=DESIGNS[Math.floor(Math.random()*DESIGNS.length)].id;
 p.design=next;
 // rotate fallback images as a cheap visual variation; Pexels can replace these later.
 const imgs=FALLBACK_IMAGES[p.type]||FALLBACK_IMAGES.generic;p.images=[...imgs].sort(()=>Math.random()-.5);
 save(arr);renderADM(p);
}
async function searchImages(id){
 const arr=current(),p=arr.find(x=>x.id===id);
 const key=localStorage.getItem("pexelsApiKey")||"";
 if(!key){alert("A busca Pexels está preparada, mas ainda falta configurar a chave da API. O site continua funcionando com imagens de fallback.");return}
 const info=TYPE_INFO[p.type]||TYPE_INFO.generic;
 const q=info.queries[Math.floor(Math.random()*info.queries.length)];
 try{
  const r=await fetch(PEXELS_ENDPOINT+"?query="+encodeURIComponent(q)+"&per_page=8&orientation=landscape",{headers:{Authorization:key}});
  if(!r.ok)throw new Error("Pexels: "+r.status);
  const data=await r.json(); const urls=(data.photos||[]).map(x=>x.src?.large2x||x.src?.large).filter(Boolean);
  if(urls.length){p.images=urls.slice(0,6);save(arr);renderADM(p);alert("Novas imagens encontradas para "+info.label+"!")}
  else alert("Não encontramos imagens adequadas nesta busca.");
 }catch(e){alert("Não foi possível buscar imagens agora. O site continua com as imagens atuais.")}
}
function brandColor(p){
 const map={pizza:"#b42318",restaurant:"#9a3412",barber:"#111827",salon:"#be185d",pet:"#2f6f4e",market:"#3f6212",gym:"#1d4ed8",cafe:"#7c2d12",shop:"#111827",generic:"#111827"};
 return p.color||map[p.type]||"#111827";
}
function img(p,i=0){return esc((p.images&&p.images[i%p.images.length])||FALLBACK_IMAGES[p.type]?.[i%((FALLBACK_IMAGES[p.type]||[]).length)]||FALLBACK_IMAGES.generic[0])}
function itemCards(p,cls="site-grid"){
 return `<div class="${cls}">${p.items.map((it,i)=>`<article class="site-card"><img src="${img(p,i)}" alt=""><div class="pad"><h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p><strong>${esc(it.price)}</strong></div></article>`).join("")}</div>`;
}
function baseNav(p){return `<nav class="site-nav"><div class="wordmark">${wordmark(p.name)}</div><a class="site-btn" style="background:${brandColor(p)};color:#fff" href="#contato">Contato</a></nav>`}
function publicHTML(p){
 const c=brandColor(p),d=p.design||"impacto",hero=img(p,0),info=TYPE_INFO[p.type]||TYPE_INFO.generic;
 let body="";
 if(d==="impacto") body=`${baseNav(p)}<main class="site-main"><section class="site-section"><div class="split"><div><div class="pill">${esc(info.label)}</div><h1 class="hero-title">${esc(p.name)}</h1><p class="site-section lead">${esc(p.description)}</p><a class="site-btn" style="background:${c};color:#fff" href="#produtos">Conhecer</a></div><img class="site-hero-img" src="${hero}" alt=""></div></section><section id="produtos" class="site-section"><h2>Destaques</h2>${itemCards(p)}</section></main>`;
 else if(d==="editorial") body=`${baseNav(p)}<main class="site-main editorial"><section class="site-section"><div class="pill">${esc(info.label)}</div><h1 class="hero-title">${esc(p.name)}</h1><p class="lead">${esc(p.description)}</p><img class="site-hero-img" src="${hero}" alt=""></section><section class="site-section"><h2>O que oferecemos</h2>${itemCards(p)}</section></main>`;
 else if(d==="bento") body=`${baseNav(p)}<main class="site-main"><section class="site-section"><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p><div class="bento"><div class="big"><img src="${hero}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:22px"></div><div class="card"><h3>${esc(info.label)}</h3><p>Uma apresentação pensada para este negócio.</p></div><div class="card"><h3>Contato</h3><p>${esc(p.phone||p.whatsapp||"Fale conosco")}</p></div></div></section><section class="site-section"><h2>Destaques</h2>${itemCards(p)}</section></main>`;
 else if(d==="catalogo") body=`${baseNav(p)}<main class="site-main"><section class="site-section"><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p></section><section class="site-section"><h2>Catálogo</h2>${itemCards(p,"catalog")}</section></main>`;
 else if(d==="premium") body=`<div class="dark">${baseNav(p)}<main class="site-main"><section class="site-section"><div class="split"><div><div class="pill">${esc(info.label)}</div><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p><a class="site-btn" style="background:${c};color:#fff" href="#produtos">Descobrir</a></div><img class="site-hero-img" src="${hero}" alt=""></div></section><section id="produtos" class="site-section"><h2>Seleção</h2>${itemCards(p)}</section></main></div>`;
 else if(d==="bold") body=`<div class="dark">${baseNav(p)}<main class="site-main"><section class="site-section"><h1 class="hero-title">${esc(p.name)}</h1><img class="site-hero-img" src="${hero}" alt=""><p style="font-size:28px">${esc(p.description)}</p></section><section class="site-section"><h2>Destaques</h2>${itemCards(p)}</section></main></div>`;
 else if(d==="natural") body=`${baseNav(p)}<main class="site-main"><section class="site-section"><div class="split"><img class="site-hero-img" src="${hero}" alt=""><div><div class="pill">Feito para você</div><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p></div></div></section><section class="site-section"><h2>Produtos e serviços</h2>${itemCards(p)}</section></main>`;
 else if(d==="servicos") body=`${baseNav(p)}<main class="site-main"><section class="site-section"><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p><img class="site-hero-img" src="${hero}" alt=""></section><section class="site-section"><h2>Serviços</h2>${itemCards(p)}</section></main>`;
 else if(d==="menu") body=`${baseNav(p)}<main class="site-main"><section class="site-section"><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p><img class="site-hero-img" src="${hero}" alt=""></section><section class="site-section"><h2>Cardápio</h2>${itemCards(p)}</section></main>`;
 else body=`${baseNav(p)}<main class="site-main"><section class="site-section"><div class="split"><div><h1 class="hero-title">${esc(p.name)}</h1><p>${esc(p.description)}</p><a class="site-btn" style="background:${c};color:#fff" href="#contato">Falar agora</a></div><img class="site-hero-img" src="${hero}" alt=""></div></section><section class="site-section"><h2>Destaques</h2>${itemCards(p)}</section></main>`;
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)}</title><meta name="description" content="${esc(p.description)}"><link rel="stylesheet" href="${location.pathname}style.css"></head><body><div class="site-shell">${body}<section id="contato" class="site-section"><h2>Contato</h2><p>${esc(p.address||"Atendimento local")}</p><p>${esc(p.phone||p.whatsapp||"Entre em contato")}</p>${p.instagram?`<p>${esc(p.instagram)}</p>`:""}</section><footer class="footer">${esc(p.name)}</footer></div></body></html>`;
}
function renderPublic(id){
 const p=current().find(x=>x.id===id);
 if(!p){document.getElementById("app").innerHTML="<main class='wrap'><div class='card'><h2>Site não encontrado</h2></div></main>";return}
 document.open();document.write(publicHTML(p));document.close();
}
window.newPlatform=newPlatform;window.editPlatform=editPlatform;window.openADM=openADM;window.openPublic=openPublic;window.copyPublic=copyPublic;window.saveItem=saveItem;window.newAppearance=newAppearance;window.searchImages=searchImages;window.delPlatform=function(id){if(confirm("Excluir esta plataforma?")){save(current().filter(p=>p.id!==id));renderDashboard(current())}};
renderApp();
