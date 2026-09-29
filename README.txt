# Radar de Clientes V2

## O que mudou
- Consulta ao vivo via Overpass/OpenStreetMap.
- Mostra o horário da base consultada e a última edição do objeto quando disponível.
- Categorias ampliadas, incluindo pizzarias.
- Campo/atalho de Instagram quando o dado estiver cadastrado no mapa.
- Telefone com "Ligar" e "Copiar telefone".
- Instagram com abrir e copiar.
- Site com abrir.
- Filtros para sem site, sem Instagram e sinais de oportunidade.
- A ferramenta não afirma automaticamente que um Instagram tem "design ruim": isso exige inspeção visual. Os sinais exibidos são apenas sinais de prospecção.

## Importante sobre atualização
"Encontrado agora" significa que o estabelecimento apareceu na consulta atual da base do OpenStreetMap. O OpenStreetMap pode conter cadastros desatualizados ou faltar algum negócio. A API Overpass informa um timestamp da base consultada, e cada objeto pode ter uma data de edição.

## Instagram
A V2 não faz scraping automático do Instagram. Quando existe um Instagram cadastrado no OpenStreetMap, o sistema fornece o link. Para uma análise automática real de qualidade visual, será necessário uma integração de terceiros/API ou uma etapa de análise de imagens, que não é garantidamente gratuita.
