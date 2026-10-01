RADAR DE CLIENTES V9
=====================

V9 mantém a base funcional da V8 e adiciona:

1. ADM como primeira tela após criar uma plataforma.
2. Link do site público sempre visível no topo do ADM, com abrir/copiar.
3. Site público continua separado: ?site= não mostra controles administrativos.
4. Motor de variedade visual com 6 composições/identidades e botão “Gerar outra versão”.
5. Nome real do negócio usado como wordmark/identidade tipográfica.
6. Conteúdo sugerido por tipo de negócio, marcado como SUGESTÃO e editável no ADM.
7. Imagens iniciais escolhidas por categoria/uso, substituindo o banco genérico único da V8.
8. Preparador de URL para geração de imagem por IA (Pollinations). A API pode exigir autenticação conforme o plano; o app não embute chave secreta.
9. Designer simplificado: automático por padrão e personalização avançada escondida.
10. Migração V8 -> V9 e preservação de plataformas salvas.

IMPORTANTE SOBRE CONTEÚDO AUTOMÁTICO
-------------------------------------
Itens, preços, descrições e imagens sugeridos pelo sistema NÃO são fatos confirmados do estabelecimento.
Revise tudo no ADM antes de publicar.

IMPORTANTE SOBRE IMAGENS IA
----------------------------
O V9 deixa o sistema preparado para uma API de geração de imagens. O Nano Banana/Gemini possui API oficial para geração de imagens, mas uma integração direta em um site estático exigiria uma camada segura de servidor e uma credencial própria. Por segurança, esta versão não grava chaves secretas no código.

PUBLICAÇÃO
----------
O site publicado continua sendo um HTML gerado a partir dos dados da plataforma e compartilhado por ?site=.
Imagens enviadas como data URL podem ser removidas do link compartilhado por tamanho; “Baixar HTML” preserva as imagens locais.

EXECUÇÃO
--------
Abra index.html ou publique os arquivos em um host estático.
