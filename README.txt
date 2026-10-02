RADAR DE CLIENTES — V10 FINAL
=============================

Base: V9 preservada. O painel Radar, busca, resultados, níveis, ADM,
salvamento, publicação, prévia e links continuam com o conceito original.

CORREÇÃO PRINCIPAL DA V10
- O mesmo endereço/imagem não é reutilizado automaticamente em todas as seções.
- O gerador monta um conjunto de imagens diferentes por negócio.
- Hero, galeria e itens recebem imagens distintas quando há opções suficientes.
- Se não houver imagens suficientes, o sistema prefere deixar o espaço sem foto
  a repetir a mesma imagem várias vezes.
- O botão “🖼️ Variar imagens” permite reorganizar as imagens.
- “🔄 Gerar outra versão” muda a composição e também pode mudar o conjunto de imagens.

RELEVÂNCIA
- Foram ampliados os bancos por categoria.
- Pet Shop / Agro Pet ganhou categoria própria, conteúdo e imagens específicas.
- Nomes como “Agro Pet” ajudam a inferir a categoria pet mesmo quando o mapa
  devolve “Loja”.
- As sugestões de produtos/serviços continuam marcadas no ADM e precisam ser conferidas.

VARIEDADE VISUAL
- A estrutura visual da V9 foi preservada.
- As variantes de composição, tipografia, ritmo, tema e botões continuam.
- A V10 não substitui o Radar por um painel novo/genérico.

IMAGENS EXTERNAS
- O V9 já tinha preparação para geração de imagem por URL e imagens de estoque.
- A V10 melhora a distribuição das imagens antes de adicionar novas dependências.
- O recurso de IA existente continua opcional.

MIGRAÇÃO
- V10 lê plataformas salvas na chave V9 e migra para a chave V10.
- Na migração, imagens repetidas são reparadas quando há alternativas no banco.

OBSERVAÇÃO
Imagens externas dependem da disponibilidade dos respectivos provedores/URLs.
Para produção, uma API de imagens (por exemplo Pexels) pode substituir ou complementar
os bancos de fallback sem mudar o restante do gerador.
