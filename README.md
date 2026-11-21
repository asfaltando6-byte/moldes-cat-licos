# Fé em Cada Ponto — Moldes de Crochê Católico

Landing page completa em português, com imagens locais, fonte Montserrat, dois carrosséis automáticos, galeria ampliável, quatro bônus, FAQ e notificações de clientes.

## Hospedar na Vercel

Importe este repositório na Vercel. O arquivo `vercel.json` define o diretório de publicação como `dist` e não utiliza framework. Não há dependências para instalar ou etapa de compilação. Se solicitado, selecione **Other**, deixe o comando de build vazio e use **dist** como Output Directory.

## Estrutura

- `dist/index.html`: página e oferta.
- `dist/styles.css`: layout responsivo.
- `dist/app.js`: dois carrosséis independentes, galeria e janelas.
- `dist/meta-pixel.js`: inicialização do Pixel da Meta e PageView.
- `dist/clientes.js`: os 30 nomes fornecidos pelo proprietário.
- `dist/notifications.js`: notificações no canto inferior esquerdo.
- `dist/assets/`: todos os mockups e imagens usados no projeto.
- `vercel.json`: configuração de hospedagem.

As notificações começam após 9 segundos, ficam visíveis por 6,5 segundos e alternam os nomes a cada 22 segundos. Fechar o aviso desativa as notificações durante a sessão. Os nomes representam a lista informada pelo proprietário; não há datas, horários ou cidades de compra simulados.

## Oferta

Oferta única: **200 moldes em PDF + 4 bônus por R$ 19,90**. Bônus: guia e fichas de precificação, tags e cartões católicos, catálogo de crochê católico e controle de encomendas com calendário. Garantia proposta de 30 dias.

## Checkout e entrega

O botão da oferta abre diretamente o checkout da Cakto: https://pay.cakto.com.br/xrohfmr_1352455. O valor apresentado na página é R$ 19,90. Os PDFs são entregues pela configuração do produto na plataforma de pagamento; não estão incluídos neste repositório. As imagens de páginas e os mockups ilustram a proposta e não são moldes técnicos utilizáveis.

## Carregamento

- Montserrat variável em WOFF2 hospedada localmente, com licença OFL incluída.
- Mockup responsivo em 480, 768, 1200 e 1536 px; preload alinhado ao tamanho da tela.
- Imagem da oferta com carregamento adiado e decodificação assíncrona.
- Imagens de carrosséis, galeria e bônus carregadas perto da área visível.
- Animação dos carrosséis pausada fora da tela, sem medir largura em cada quadro.
- Scripts adiados; Pixel preservado com PageView.

## Rodar localmente

Na raiz, execute `python3 -m http.server 8080 --directory dist` e abra `http://localhost:8080`.

O Pixel da Meta **1000784222921167** está configurado com o evento **PageView**, uma vez por carregamento. Não há evento Purchase nos botões nem integração de pagamento configurada. A fonte Montserrat é hospedada localmente, com Arial como alternativa do sistema.

## Responsividade mobile

Layout adaptado a telas compactas: tipografia fluida, margens seguras, cartões de bônus com imagem e texto lado a lado, oferta sem cortes, controles de pelo menos 44 px e proteção da área do checkout contra sobreposição das notificações. Carrosséis mantêm rolagem por toque e retomam a animação após interação por toque; a pausa por foco permanece para navegação com teclado.
