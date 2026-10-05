RADAR DE CLIENTES — V15

Base: V14.3.2. O Designer, Radar, Central de Projetos e funções anteriores foram preservados.

NOVO: FLUXO COMERCIAL
Encontrar empresa → Analisar oportunidade → Abordar → Criar demonstração → Cliente vê a prévia → Cliente aprova → Cliente paga → Projeto em produção → Site publicado → Domínio conectado → Manutenção → Renovação.

Cada cliente fica salvo no pipeline comercial local para acompanhar a etapa, valor, domínio, serviço e URL publicada.

BACKEND SEGURO
- server.js fornece a base para integrações que precisam de segredo.
- Credenciais nunca devem ficar no app.js.
- Mercado Pago: definir MP_ACCESS_TOKEN no servidor. O endpoint /api/payment/create cria um checkout e /api/payment/webhook recebe eventos.
- Cloudflare: definir CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID. O conector de publicação/domínio fica separado do navegador.
- Domínio: definir DOMAIN_PROVIDER quando o registrador/provedor homologado escolhido estiver definido.

IMPORTANTE
A interface V15 registra todo o fluxo mesmo sem credenciais. Isso permite testar o produto sem inventar uma integração funcionando. A cobrança e a publicação reais só mudam de modo manual para automático quando as credenciais e o provedor estiverem configurados no backend.
