import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
app.use(express.json({limit:"25mb"}));
app.use((req,res,next)=>{ if(req.path==="/"||req.path==="/index.html"||(req.path.startsWith("/demo/")||req.path.startsWith("/site/"))||req.path.endsWith(".js")||req.path.endsWith(".css")){res.setHeader("Cache-Control","no-store, no-cache, must-revalidate, proxy-revalidate");res.setHeader("Pragma","no-cache");res.setHeader("Expires","0");} next(); });

// V15.2.7: estado comercial persistente no servidor. Em hospedagens efêmeras,
// configure um disco persistente e DATA_DIR para manter os dados entre deploys.
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const STATE_FILE = path.join(DATA_DIR, "radar-state.json");
let state = { sales: [], platforms: [], events: [], publishedSites: [] };
function loadState(){
  try { fs.mkdirSync(DATA_DIR,{recursive:true}); if(fs.existsSync(STATE_FILE)){ const x=JSON.parse(fs.readFileSync(STATE_FILE,"utf8")); state={sales:Array.isArray(x.sales)?x.sales:[],platforms:Array.isArray(x.platforms)?x.platforms:[],events:Array.isArray(x.events)?x.events:[],publishedSites:Array.isArray(x.publishedSites)?x.publishedSites:[]}; } }
  catch(err){ console.error("Não foi possível carregar o estado persistente:",err.message); }
}
async function loadRemoteState(){
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return;
  try{
    const r=await fetch(`${url.replace(/\/$/,"")}/rest/v1/radar_state?id=eq.1&select=state`,{headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:"application/json"}});
    if(!r.ok)throw new Error(`Supabase HTTP ${r.status}`);
    const rows=await r.json(); if(rows[0]?.state){const x=rows[0].state;state={sales:Array.isArray(x.sales)?x.sales:[],platforms:Array.isArray(x.platforms)?x.platforms:[],events:Array.isArray(x.events)?x.events:[],publishedSites:Array.isArray(x.publishedSites)?x.publishedSites:[]};}
  }catch(err){console.error("Falha ao carregar Supabase; usando arquivo local:",err.message)}
}
async function persistState(){
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(url&&key){
    try{const r=await fetch(`${url.replace(/\/$/,"")}/rest/v1/radar_state`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({id:1,state,updated_at:new Date().toISOString()})});if(!r.ok)throw new Error(`Supabase HTTP ${r.status}`);return true;}
    catch(err){console.error("Falha ao salvar Supabase:",err.message);return false;}
  }
  try { fs.mkdirSync(DATA_DIR,{recursive:true}); const tmp=STATE_FILE+".tmp"; fs.writeFileSync(tmp,JSON.stringify(state,null,2)); fs.renameSync(tmp,STATE_FILE); return true; }
  catch(err){ console.error("Não foi possível salvar o estado persistente:",err.message); return false; }
}
loadState();
const stateReady=loadRemoteState();

const cfg = {
  payment: process.env.MP_ACCESS_TOKEN ? "mercadopago" : "manual",
  hosting: process.env.CLOUDFLARE_API_TOKEN ? "cloudflare" : "manual",
  domain: process.env.DOMAIN_PROVIDER ? process.env.DOMAIN_PROVIDER : "manual"
};

app.get("/api/health", (_req,res)=>res.json({ok:true,version:"V15.3.4",persistentStorage:!!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY),integrations:cfg}));

// O servidor é a fonte compartilhada dos dados entre dispositivos.
app.get("/api/state", async (_req,res)=>{await stateReady;res.json({ok:true,state});});
app.put("/api/state", async (req,res)=>{
  await stateReady;
  const body=req.body||{};
  if(body.sales!==undefined){ if(!Array.isArray(body.sales)) return res.status(400).json({ok:false,error:"sales precisa ser uma lista."}); state.sales=body.sales; }
  if(body.platforms!==undefined){ if(!Array.isArray(body.platforms)) return res.status(400).json({ok:false,error:"platforms precisa ser uma lista."}); state.platforms=body.platforms; }
  if(!await persistState()) return res.status(500).json({ok:false,error:"Não foi possível persistir os dados no servidor. Confira a configuração do banco ou disco."});
  res.json({ok:true,savedAt:new Date().toISOString()});
});
app.get("/api/demo/:id", async (req,res)=>{
  await stateReady;
  const code=String(req.params.id);
  const sale=state.sales.find(x=>String(x.id)===code||String(x.id).replace(/-/g,"").startsWith(code));
  if(!sale) return res.status(404).json({ok:false,error:"Demonstração não encontrada."});
  const platform=state.platforms.find(x=>String(x.id)===String(sale.platformId||sale.businessId))||state.platforms.find(x=>String(x.name)===String(sale.name));
  res.json({ok:true,sale,platform:platform||null,events:state.events.filter(x=>String(x.saleId)===String(sale.id))});
});

app.get("/api/site/:id", async (req,res)=>{
  await stateReady;
  res.setHeader("Cache-Control","no-store, no-cache, must-revalidate");
  const id=String(req.params.id||"").trim();
  if(!id) return res.status(400).json({ok:false,error:"ID do site obrigatório."});
  const published=state.publishedSites.find(x=>String(x.id)===id);
  if(published?.platform) return res.json({ok:true,kind:"published",platform:published.platform,sale:null});
  const sale=state.sales.find(x=>String(x.id)===id);
  if(sale){
    const platform=state.platforms.find(x=>String(x.id)===String(sale.platformId||sale.businessId));
    if(!platform) return res.status(404).json({ok:false,error:"A demonstração existe, mas o projeto do site não foi encontrado no servidor."});
    return res.json({ok:true,kind:"demo",platform,sale});
  }
  const platform=state.platforms.find(x=>String(x.id)===id);
  if(!platform) return res.status(404).json({ok:false,error:"Site não encontrado no armazenamento público do servidor."});
  res.json({ok:true,kind:"published",platform,sale:null});
});

app.put("/api/public-sites/:id", async (req,res)=>{
  await stateReady;
  const id=String(req.params.id||"").trim(), platform=req.body?.platform;
  if(!id||!platform||String(platform.id)!==id) return res.status(400).json({ok:false,error:"Dados do site público inválidos."});
  const item={id,platform,updatedAt:new Date().toISOString()};
  const i=state.publishedSites.findIndex(x=>String(x.id)===id);
  if(i<0) state.publishedSites.push(item); else state.publishedSites[i]=item;
  const pi=state.platforms.findIndex(x=>String(x.id)===id);
  if(pi<0) state.platforms.push(platform); else state.platforms[pi]=platform;
  if(!await persistState()) return res.status(500).json({ok:false,error:"Não foi possível salvar o site público no servidor."});
  res.json({ok:true,id,updatedAt:item.updatedAt});
});

app.get("/api/public-status", async (_req,res)=>{
  await stateReady;
  res.json({ok:true,version:"V15.3.4",persistentStorage:!!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY),sales:state.sales.length,platforms:state.platforms.length,publishedSites:state.publishedSites.length});
});

app.post("/api/demo/:id/event", async (req,res)=>{
  await stateReady;
  const code=String(req.params.id);
  const sale=state.sales.find(x=>String(x.id)===code||String(x.id).replace(/-/g,"").startsWith(code));
  if(!sale) return res.status(404).json({ok:false,error:"Demonstração não encontrada."});
  const event=String(req.body?.event||"");
  if(!["viewed","approved"].includes(event)) return res.status(400).json({ok:false,error:"Evento inválido."});
  state.events.push({id:crypto.randomUUID(),saleId:sale.id,event,at:new Date().toISOString()});
  if(event==="viewed") { sale.demoViewedAt=sale.demoViewedAt||new Date().toISOString(); if(["demo","preview"].includes(sale.stage)) sale.stage="preview"; }
  if(event==="approved") { sale.approvedAt=new Date().toISOString(); sale.stage="approved"; sale.approvalSource="public-demo"; }
  sale.updatedAt=new Date().toISOString();
  if(!await persistState()) return res.status(500).json({ok:false,error:"Não foi possível registrar o evento no armazenamento persistente."});
  res.json({ok:true,event,sale});
});

app.post("/api/payment/create", async (req,res)=>{
  try{
    const {title="Site profissional",amount,externalReference,notificationUrl}=req.body||{};
    const value=Number(amount);
    if(!Number.isFinite(value)||value<=0) return res.status(400).json({ok:false,error:"Valor inválido."});
    if(!process.env.MP_ACCESS_TOKEN){
      return res.status(503).json({ok:false,configured:false,error:"Mercado Pago ainda não configurado no servidor."});
    }
    const base=process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const response=await fetch("https://api.mercadopago.com/checkout/preferences",{
      method:"POST",
      headers:{"Authorization":`Bearer ${process.env.MP_ACCESS_TOKEN}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        items:[{id:externalReference||crypto.randomUUID(),title,quantity:1,currency_id:"BRL",unit_price:value}],
        external_reference:externalReference||crypto.randomUUID(),
        notification_url:notificationUrl||`${base}/api/payment/webhook`,
        back_urls:{success:`${base}/?payment=success`,failure:`${base}/?payment=failure`,pending:`${base}/?payment=pending`},
        auto_return:"approved"
      })
    });
    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({ok:false,error:data?.message||"Erro ao criar cobrança.",details:data});
    res.json({ok:true,id:data.id,checkoutUrl:data.init_point||data.sandbox_init_point});
  }catch(err){res.status(500).json({ok:false,error:"Falha ao criar cobrança."});}
});

app.post("/api/payment/webhook",(req,res)=>{
  // A produção deve validar a assinatura enviada pelo provedor antes de alterar o pedido.
  // O endpoint existe para receber os eventos e será conectado ao armazenamento do CRM.
  console.log("Pagamento webhook recebido",req.body?.type||req.body?.action||"evento");
  res.sendStatus(200);
});

app.post("/api/publish/cloudflare", async (req,res)=>{
  if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ACCOUNT_ID){
    return res.status(503).json({ok:false,configured:false,error:"Cloudflare ainda não configurado no servidor."});
  }
  return res.status(501).json({ok:false,error:"Conector de deployment reservado para a etapa de publicação segura. Nenhuma chave é enviada ao navegador."});
});

app.post("/api/domain/connect", async (req,res)=>{
  const {domain}=req.body||{};
  if(!domain)return res.status(400).json({ok:false,error:"Domínio obrigatório."});
  if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ACCOUNT_ID){
    return res.status(503).json({ok:false,configured:false,error:"Conector de domínio ainda não configurado no servidor."});
  }
  return res.status(501).json({ok:false,error:"O provedor de registro do domínio ainda precisa ser configurado. A conexão do Pages será feita pelo servidor."});
});

// URL pública limpa: mostra o site da demonstração, não o painel do Radar.
// V15.3.4: links curtos /site/XXXXXXXXXX não carregam dados do site na URL.
// O servidor busca a demonstração pelo código curto e o navegador renderiza o site.
app.get("/site/p/:id", (_req,res)=>{
  res.setHeader("Cache-Control","no-store, no-cache, must-revalidate");
  res.sendFile(path.join(ROOT,"index.html"));
});

app.get("/site/:id", (_req,res)=>{
  res.setHeader("Cache-Control","no-store, no-cache, must-revalidate");
  res.sendFile(path.join(ROOT,"index.html"));
});

app.get("/demo/:id", async (req,res)=>{
  await stateReady;
  res.setHeader("Cache-Control","no-store");
  res.redirect(302, `/site/${encodeURIComponent(String(req.params.id))}`);
});
app.get("/demo", (_req,res)=>res.status(400).send("Link de demonstração incompleto. Use o link enviado pelo Radar."));

// IMPORTANTE: as rotas públicas vêm antes dos arquivos estáticos.
// Assim /site/ID sempre entrega o shell do Radar, que então consulta /api/site/ID.
app.use(express.static(ROOT));
app.listen(PORT,()=>console.log(`Radar backend V15.3.4 em http://localhost:${PORT}`));
