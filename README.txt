RADAR DE CLIENTES — V15.2

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


V15.2 — ASSISTENTE GUIADO E CADASTRO COMERCIAL
- A interface do fluxo comercial foi substituída por uma etapa atual de cada vez.
- O Radar pode selecionar a empresa com melhor pontuação entre os resultados atuais.
- Demonstrações podem ser enviadas por link; a página registra visita e permite aprovação explícita.
- Clientes, projetos e estados são sincronizados com /api/state e gravados em data/radar-state.json no servidor.
- Para manter dados entre reinicializações/deploys no Render, configure um disco persistente e defina DATA_DIR para o caminho do disco. Sem disco persistente, arquivos no sistema de arquivos do serviço podem ser apagados em novo deploy.
- A aprovação é registrada pela página pública; isso não substitui um contrato nem confirma pagamento.
- Pagamento automático, respostas automáticas de WhatsApp, publicação Cloudflare e domínio continuam fora do escopo desta versão.
- Se o backend não estiver disponível, o navegador mantém cópia local e avisa que não está sincronizado.

CONFIGURAÇÃO OPCIONAL DO SUPABASE PARA DADOS DURÁVEIS
1. Crie um projeto Supabase.
2. No SQL Editor, execute:

create table if not exists public.radar_state (
  id integer primary key,
  state jsonb not null default '{"sales":[],"platforms":[],"events":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

3. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY como variáveis secretas do serviço backend no Render. Nunca coloque a service role key no app.js.
4. O backend tenta carregar/salvar no Supabase quando as duas variáveis existem; caso contrário usa arquivo local, que pode ser perdido em redeploy/reinicialização do serviço gratuito.


CORREÇÃO V15.2 — LINK DE DEMONSTRAÇÃO
- O botão “Enviar demonstração” agora gera um link limpo /demo/ID que abre o site criado, sem mostrar a interface do Radar.
- Quando existe telefone/WhatsApp no cadastro, o sistema abre a conversa com uma mensagem e o link da demonstração preenchidos. Você ainda precisa tocar em Enviar no WhatsApp.
- A página pública registra visualização e permite aprovação explícita.
- O link /demo/ID exige que a demonstração e o projeto estejam sincronizados com o backend.
