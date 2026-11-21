# Fé em Cada Ponto — Moldes de Crochê Católico

Landing page completa em português, com imagens locais, fonte Montserrat, carrossel automático, galeria ampliável, quatro bônus, FAQ e notificações de clientes.

## Hospedar na Vercel

Importe este repositório na Vercel. O arquivo `vercel.json` define o diretório de publicação como `dist` e não utiliza framework. Não há dependências para instalar ou etapa de compilação. Se solicitado, selecione **Other**, deixe o comando de build vazio e use **dist** como Output Directory.

## Estrutura

- `dist/index.html`: página e oferta.
- `dist/styles.css`: layout responsivo.
- `dist/app.js`: carrossel, galeria e janelas.
- `dist/clientes.js`: os 30 nomes fornecidos pelo proprietário.
- `dist/notifications.js`: notificações no canto inferior esquerdo.
- `dist/assets/`: todos os mockups e imagens usados no projeto.
- `vercel.json`: configuração de hospedagem.

As notificações começam após 9 segundos, ficam visíveis por 6,5 segundos e alternam os nomes a cada 22 segundos. Fechar o aviso desativa as notificações durante a sessão. Os nomes representam a lista informada pelo proprietário; não há datas, horários ou cidades de compra simulados.

## Oferta

Oferta única: **200 moldes em PDF + 4 bônus por R$ 19,90**. Bônus: guia e fichas de precificação, tags e cartões católicos, catálogo de crochê católico e controle de encomendas com calendário. Garantia proposta de 30 dias.

## Antes de começar a vender

Os botões da oferta abrem um aviso de preparação da coleção. O checkout não foi fornecido nesta conversa: substitua essa ação pelo link correto antes de enviar tráfego. Os PDFs do produto não foram fornecidos nem produzidos neste projeto. As imagens de páginas e os mockups ilustram a proposta e não são moldes técnicos utilizáveis.

## Rodar localmente

Na raiz, execute `python3 -m http.server 8080 --directory dist` e abra `http://localhost:8080`.

Não há rastreadores ou integrações de pagamento configurados. Google Fonts é usado com alternativa Montserrat/Arial do sistema.
