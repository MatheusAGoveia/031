# Bloco 31 — direção visual e arquitetura

Atualizado em 11 de outubro de 2026. A primeira implementação funcional está em `site/`; este documento preserva a concepção visual e os requisitos do produto.

## Leitura da marca

O [Instagram do Bloco 31](https://www.instagram.com/bloco.31/) apresenta um coletivo criativo de Belo Horizonte, centrado em moda, fotografia, encontros e comunidade. O [post de apresentação](https://www.instagram.com/bloco.31/p/DeASxtcFmn2/) fala de um espaço para pessoas que queiram somar. O [post dos BlockCards](https://www.instagram.com/bloco.31/p/DeKfiH6lphH/) apresenta uma progressão visual, mas informa que a temporada ainda não começou.

A identidade observada usa céu azul com nuvens, títulos pretos densos, textos pequenos espaçados, retícula, escrita manual, corrente e emblema cromado com aparência de grafite. O [destaque GERÊNCIA](https://www.instagram.com/stories/highlights/18012899522953113/) apresenta Xande, Davi e Querubim como CEOs. A imagem enviada pela equipe mostra os três cards juntos: retratos verticais em molduras irregulares claras, pequenos pedaços de fita no topo, fundo preto texturizado, coroa azul rabiscada, nomes brancos em escrita gestual sobre a borda inferior e traços azuis sob os nomes. Não há biografias individuais no destaque. A tipografia exata e os arquivos de edição da marca ainda não estão disponíveis.

## Produto

O produto terá duas superfícies ligadas pelo mesmo conjunto de dados:

1. **Site público, pensado primeiro para celular.** Apresenta a proposta, os administradores, a linguagem dos BlockCards e os encontros anunciados. Recebe interesse geral enquanto não há datas e pré-inscrições específicas quando um encontro é publicado.
2. **Painel restrito para administradores.** Permite editar os perfis públicos da gerência, criar e publicar encontros, abrir ou fechar pré-inscrições e acompanhar as respostas.

Os membros não precisam de perfil público. Um aplicativo para gerenciar inscritos e membros pode usar a mesma estrutura de dados e autenticação em uma etapa futura.

## Narrativa da página pública

### Abertura / carregamento

Tela inteira de céu azul. Nuvens se afastam para os lados; o cordão original da publicação, com sua corrente e o emblema de grafite cromado, entra pelo centro e balança como objeto suspenso. A abertura se dissolve no primeiro quadro da página. Uma versão estática do céu e do pingente aparece imediatamente; Three.js acrescenta volume e balanço ao conjunto sem redesenhar a face do pingente. A abertura termina quando o hero estiver utilizável, sem porcentagem fictícia e sem esperar imagens abaixo da primeira tela. Há opção de pular e uma versão estática para movimento reduzido ou falha de WebGL.

Ritmo proposto: descida do cordão por aproximadamente meio segundo; oscilação inicial em torno de sete graus; nuvens abrindo em cerca de seis décimos de segundo; título e chamada entrando em sequência curta. O balanço desacelera e a cena deixa de renderizar continuamente quando estabiliza. O desenho segue a documentação atual de [Three.js responsivo](https://threejs.org/manual/pages/responsive.html) e [renderização sob demanda](https://threejs.org/manual/pages/rendering-on-demand.html), além da preferência por [movimento reduzido](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

### Página carregada

1. **Hero:** frase de manifesto, retrato editorial, emblema e convite para conhecer o coletivo.
2. **Manifesto:** “Tudo começou com uma ideia”, uma mensagem curta sobre criação e cultura de BH, com uma polaroid em preto e branco da cidade.
3. **Gerência:** carrossel inspirado em seleção de personagens de jogos. Um card original fica em foco e os vizinhos aparecem parcialmente; ao selecionar, aparecem abaixo do card nome, função, arroba e texto curto fornecido pela equipe. A moldura, fita, coroa rabiscada, retrato, assinatura e riscos azuis da referência são mantidos como uma peça visual única, sem sobrepor a legenda explicativa à arte.
4. **Encontros:** estado atual sem datas inventadas. Quando os administradores publicarem um encontro, aparecem data, horário, local, descrição e acesso à pré-inscrição.
5. **BlockCards:** seção de apresentação visual e explicação breve; a temporada permanece marcada como em preparação.
6. **Convite final:** lista de interesse geral antes do primeiro encontro e links oficiais do coletivo.

## Direção visual

- **Cores:** azul céu e preto como base; branco para respirar; prata/cromo em detalhes de identidade. As cores dos BlockCards entram como acentos locais.
- **Tipo:** o Instagram não expõe a família original nas imagens. Para aproximar o sistema sem afirmar uma identificação falsa: [Anton](https://fonts.google.com/specimen/Anton) nos títulos condensados; [Archivo Black](https://fonts.google.com/specimen/Archivo+Black) nos títulos largos de BlockCards; [DM Sans](https://fonts.google.com/specimen/DM+Sans) na leitura e interface; nomes da gerência em lettering manual reconstruído, com [Permanent Marker](https://fonts.google.com/specimen/Permanent+Marker) apenas como ponto de partida. Microlegendas recebem caixa alta e espaçamento amplo. As famílias do Google Fonts são disponibilizadas para uso comercial segundo a [documentação do catálogo](https://developers.google.com/fonts).
- **Composição:** quadros amplos, respiro generoso, retratos em recortes editoriais, camadas de papel/retícula usadas com intenção. A gerência é a quebra escura entre seções claras. Mobile preserva a força da capa e torna o carrossel operável por toque.
- **Assets:** o material original disponível inclui a imagem do cordão enviada pela equipe, a composição dos três cards enviada pela equipe e versões das publicações capturadas no perfil em `assets/brand/`. A base proposta para a abertura é `assets/brand/original-pendant-cutout-chain-mirrored.png`: conserva o desenho do pingente extraído da publicação; a corrente direita superior usa elos originais espelhados porque a fotografia os mistura com o brilho do sol. A reconstrução vetorial na mesma pasta é apenas estudo auxiliar e não substitui o emblema original. Para a gerência, a fonte fiel mais nítida encontrada é `assets/brand/source-gerencia-strip-480.png`, recortada do destaque em 480×853 px. Um restauro por IA em 1672×941 px existe apenas para comparação, pois pode inferir detalhes de pessoas e lettering que não estavam visíveis. O céu fotográfico novo está em `assets/visual/ceu-editorial.png`, com versão otimizada `assets/visual/ceu-editorial.webp` (1600 × 900 px, cerca de 140 KB). Ele se inspira no perfil, sem copiar os pixels do Instagram. O céu fotográfico permanece raster para preservar o aspecto das nuvens e reduzir o peso no celular.

O carrossel mostra um card central e partes dos vizinhos. No celular, a legenda permanece logo abaixo; no desktop, ocupa uma coluna ao lado. Gesto, botões e teclado escolhem o administrador, sem rotação automática. A arte do card é tratada como imagem e seu conteúdo essencial recebe equivalente textual acessível. A [orientação do W3C sobre carrosséis](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) informa os controles e o anúncio do item selecionado. O carrossel permanece em HTML para manter retratos e texto legíveis; Three.js fica concentrado no pingente da abertura.

### Escala e ritmo propostos

- Mobile de referência: 360–430 px, margens de 20–24 px, capa ocupando a altura visível e card de gerente com aproximadamente 280–320 px de largura.
- Desktop: conteúdo em grade ampla, com respiro lateral de cerca de 5–7% da tela; gerência em seção escura de largura total.
- Títulos editoriais: aproximadamente 54–72 px no celular e 96–140 px no desktop, com entrelinha fechada. Texto corrido: 16–18 px; etiquetas: 11–12 px, sempre legíveis.
- O carrossel deixa 15–20% dos cards vizinhos visíveis para sugerir a navegação. O card escolhido avança em cerca de 0,4 s; a legenda muda quando ele encaixa.
- Textura de xerox, retícula, rabiscos e cromo aparecem como pontos de ritmo. Formulários, avisos e textos longos ficam em áreas limpas.

## Fluxo dos encontros

Um administrador cria o encontro como rascunho, define data, horário, local, descrição e limite de vagas se houver, depois publica. A página pública mostra apenas encontros publicados. Visitantes enviam nome e contato em um formulário ligado ao encontro. O envio confirma o recebimento da pré-inscrição; o painel permite acompanhar a etapa de contato e confirmação. Quando não houver encontro publicado, a página oferece uma lista de interesse geral.

## Estrutura de dados proposta

- **Administradores:** identidade de acesso e permissões.
- **Perfis públicos dos administradores:** nome, função, bio curta, retrato, ordem e visibilidade.
- **Encontros:** conteúdo, data/hora, local, limite de vagas, estado de publicação e estado das inscrições.
- **Pessoas/contatos:** nome, meio de contato, registro de interesse, data de envio e estado de contato. Não são contas de login.
- **Pré-inscrições:** relação entre uma pessoa e um encontro, com data de envio e estado operacional. A mesma pessoa pode se inscrever em diferentes encontros sem duplicar seu cadastro de contato.
- **Mídia:** fotos e elementos visuais guardados fora das tabelas principais, com referências nos registros.

Essa separação deixa um caminho para acrescentar gerenciamento de membros no futuro, ligado aos contatos, sem expor perfis de membros no site público. As regras de inscrição, confirmação e autorização ficam em uma camada de servidor/API que também poderá ser usada por um aplicativo de telefone.

Para uma equipe pequena, uma aplicação web única com rotas públicas e administrativas reduz a operação. Uma opção concreta é **Next.js + Supabase**: o primeiro reúne páginas e operações de servidor; o segundo reúne Postgres, autenticação e armazenamento de mídia. As operações administrativas exigem verificação de autorização em cada ação; os contatos e pré-inscrições ficam visíveis apenas para a gerência. Essa separação segue as orientações de [autenticação do Next.js](https://nextjs.org/docs/app/guides/authentication) e [segurança por linha do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security). O [armazenamento de arquivos](https://supabase.com/docs/guides/storage/quickstart) fica separado dos dados relacionais.

## Requisitos de qualidade

- Prioridade para telas de 320–430 px e toque, com margens na faixa de 20–24 px; desktop adapta a composição com mais espaço e movimento.
- A página essencial funciona mesmo quando WebGL, vídeo ou animações falham.
- Imagens comprimidas e carregamento progressivo; fotos não são convertidas em SVG apenas por estarem em um contêiner SVG.
- Tipografia legível, contraste, foco visível, navegação por teclado no carrossel e alternativa para movimento reduzido.
- Formulários com confirmação clara, proteção contra envios repetidos, acesso restrito aos dados pessoais e possibilidade de excluir registros quando necessário.
- Encontros publicados e inscrições persistem após atualizações e novas versões do site.
- O painel administrativo deve ser confortável no celular; a estrutura de dados permite um aplicativo de telefone depois.

## Informações ainda necessárias

- Textos individuais aprovados para as legendas. O destaque encontrado oferece retratos um pouco maiores que o anexo, mas ainda não sustenta ampliação em tela cheia sem perda de detalhe; fotos individuais em resolução maior resolveriam esse limite se aparecerem.
- Regras dos encontros: público, capacidade, local divulgado e forma de confirmar presença.
- Momento em que o coletivo começará a captar contatos na lista de interesse.
- Acesso aos arquivos originais da marca, caso apareçam; enquanto isso, os vetores serão reconstruções identificadas como tal.
