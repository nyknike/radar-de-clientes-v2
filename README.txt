RADAR DE CLIENTES — V10
===========================

V10 muda o motor visual: agora existem 10 estruturas realmente diferentes,
em vez de apenas trocar cores/fontes de um template.

DESIGNS:
1 Hero Impacto
2 Editorial
3 Bento
4 Catálogo
5 Premium
6 Bold
7 Natural
8 Serviços
9 Menu
10 Local Business

O tipo de negócio influencia a escolha do design. "Gerar outra aparência"
troca a estrutura e a ordem/uso das imagens sem apagar os dados da plataforma.

IMAGENS:
- O V10 já tem fallback por categoria.
- A integração opcional com Pexels está preparada no app.js.
- Configure uma chave em localStorage com:
  localStorage.setItem("pexelsApiKey","SUA_CHAVE")
  (apenas para teste local; para produção, mova a chave para backend/Render).
- A busca usa termos específicos da categoria e orientação landscape.

CONTEÚDO:
- Produtos/serviços iniciais são sugestões e aparecem marcados no ADM.
- O usuário deve revisar antes de publicar.
- O site público não mostra a marca "Sugestão".

ADM:
- O ADM abre primeiro depois da criação.
- Link do site público fica no topo.
- "Gerar outra aparência" preserva os dados.
- "Buscar novas imagens" usa Pexels quando a chave estiver configurada.

OBS:
Esta V10 é uma evolução do motor visual e não depende de IA paga para funcionar.
