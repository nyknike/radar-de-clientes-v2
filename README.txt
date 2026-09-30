# Radar de Clientes V6 (evolução da V5)
Abra index.html (de preferência via https ou localhost, necessário para "Usar minha localização").

Fluxo: Radar > estabelecimento > análise > Criar plataforma > preenchimento automático > Designer > ADM > Prévia > Publicação > Link

Novidades
- Radar: 5 servidores Overpass em fallback escalonado (o primeiro que responder vence, limite de 32s); geocodificação Nominatim + Photon; aceita cidade, bairro, endereço ou "lat, lon"; localização com 2 tentativas.
- Filtro: exige nome, telefone, WhatsApp ou Instagram e dados com até 5 anos (data de edição/verificação do OpenStreetMap). Mostra selo de atualização.
- Análise de design em cada card (nível de oportunidade + sugestões). O radar NÃO lê imagens do Instagram/site: o julgamento visual é feito abrindo os links.
- "Criar plataforma" abre o editor já preenchido (nome, tipo, telefone, WhatsApp, Instagram, endereço, descrição, título). Tudo editável.
- Conteúdo por tipo: restaurante, pizzaria, barbearia, salão, loja, mercado e genérico. Os itens/preços de "Preencher automaticamente" são EXEMPLOS: edite antes de publicar.
- Designer: modelos por tipo, cores, fonte, botões, banner, galeria, ordem das seções, avaliações, prévia celular/computador.
- ADM por plataforma (botão ADM ou "Link do ADM"), sem voltar ao Radar.
- Minhas plataformas: ADM, Editar, Prévia, Publicar/Copiar link, Baixar HTML.
- Logo: marca d'água de 20px no canto, discreta.

Limites
- Sem servidor: os dados ficam no navegador (localStorage) e o link publicado leva os dados dentro da URL. Imagens enviadas do computador não cabem no link (use URLs de imagem) - mas entram no "Baixar HTML", que gera uma página completa para hospedar em qualquer lugar.
- Dados migram automaticamente da V5 (chave radarPlatformsV5).
