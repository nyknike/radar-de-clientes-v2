import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 10000;
const ROOT = process.cwd();
app.use(express.json({limit:"2mb"}));
app.use(express.static(ROOT));

const cfg = {
  payment: process.env.MP_ACCESS_TOKEN ? "mercadopago" : "manual",
  hosting: process.env.CLOUDFLARE_API_TOKEN ? "cloudflare" : "manual",
  domain: process.env.DOMAIN_PROVIDER ? process.env.DOMAIN_PROVIDER : "manual"
};

app.get("/api/health", (_req,res)=>res.json({ok:true,version:"V15",integrations:cfg}));

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

app.listen(PORT,()=>console.log(`Radar backend V15 em http://localhost:${PORT}`));
