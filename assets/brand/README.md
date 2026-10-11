# Kit visual Bloco 31 — referências originais e reconstruções de estudo

Referências observadas no [Instagram do Bloco 31](https://www.instagram.com/bloco.31/) em 8 de outubro de 2026: perfil, destaque **GERÊNCIA**, [post de apresentação](https://www.instagram.com/p/DeASxtcFmn2/) e [post dos BlockCards](https://www.instagram.com/p/DeKfiH6lphH/). Os SVGs deste diretório são **vetores autorais reconstruídos**. Os JPEGs e PNGs listados abaixo preservam imagens fornecidas pelo usuário ou arquivos publicados no Instagram, mas não são arquivos fonte de design.

## Materiais originais preservados

- `source-instagram-intro.jpg`: publicação de apresentação do Instagram, 1290×1611 px, capturada da imagem exibida pelo próprio perfil.
- `source-instagram-blockcards.jpg`: primeira imagem do post BlockCards, 1290×1290 px, capturada da imagem exibida pelo próprio perfil.
- `source-gerencia-strip.png`: recorte de 334×181 px anexado pelo usuário com os retratos de Xande, Davi e Querubim. O arquivo foi copiado sem edição.
- `source-gerencia-story-480.jpg`: imagem completa do destaque GERÊNCIA observada no Instagram, 480×853 px. É a melhor fonte fiel disponível para esses três retratos.
- `source-gerencia-strip-480.png`: recorte de 480×270 px retirado da imagem completa, sem ampliar ou redesenhar os pixels. É a fonte recomendada para os cards do carrossel nesta etapa.
- `original-pendant-crop-intro.png`: recorte opaco de 560×450 px da publicação de apresentação. O pingente é maior, mas fica sobre letras pretas no fundo.
- `original-pendant-crop-clean-sky.png`: recorte opaco de 350×380 px do post BlockCards. O pingente e a corrente são pixels originais sobre céu azul, sem letras pretas por trás do emblema. **É a melhor base para uma máscara de transparência fiel**.

Os dois recortes PNG são apenas cortes retangulares dos JPEGs; não são PNGs transparentes. Para usar o cordão original sobre outro fundo, criar uma máscara alfa sobre `original-pendant-crop-clean-sky.png`, preservando os canais RGB do metal/lettering. A máscara precisa ser refinada manualmente nas aberturas do graffiti e nos elos. Uma ferramenta generativa pode redesenhar as letras e perder fidelidade. A corrente entra e sai pelo limite superior da publicação; esses trechos não existem nos pixels disponíveis. O pingente no recorte mais limpo mede cerca de 300 px de largura, suficiente para um loader mobile próximo do tamanho nativo, mas não para grandes ampliações nítidas em telas de alta densidade.

- `original-pendant-masked-raster.svg`: **contêiner SVG com PNG original embutido**, máscara vetorial manual e filtro que reduz a opacidade do céu azul. O desenho do graffiti continua sendo raster original, não um SVG vetorizado. A máscara é aproximada.
- `original-pendant-masked-preview.png`: renderização transparente do contêiner para uso experimental no loader.
- `original-pendant-masked-contrast-preview.png`: prova sobre fundo roxo para tornar halos e áreas remanescentes visíveis.
- `original-pendant-loader-mobile-preview.png`: montagem de 390×844 px sobre o céu fotográfico gerado para o projeto.
- `original-pendant-cutout-chain-mirrored.png`: versão transparente para o loader. O pingente e a argola inferior mantêm os pixels extraídos; somente a corrente direita acima do suporte central foi recomposta por espelhamento de elos da corrente esquerda original.
- `original-pendant-chain-mirrored-mobile-preview.png`: estudo de abertura em 390×844 px com a corrente recomposta e o céu novo.
- `original-pendant-chain-mirrored-contrast-preview.png`: prova da mesma extração em fundo contrastante.

Limitação concreta da máscara: o canto superior direito da corrente cruza um brilho solar branco na publicação original. Nessa área os elos ficam quase indistinguíveis do fundo e aparecem como uma faixa prata clara na extração simples. A versão `original-pendant-cutout-chain-mirrored.png` corrige a leitura visual com elos do próprio cordão, espelhados nesse trecho; portanto ela é uma **composição fiel ao material disponível**, mas não uma extração integral e intocada da corrente. A arte do pingente em si fica preservada e legível.

## Arquivos

- `bloco31-mark.svg`: interpretação em vetor do pingente / adesivo de lettering cromado. **Não reproduz o traço original de graffiti e não deve substituir o pingente original no loader final.** Serve apenas como marcador provisório de estudo.
- `bloco31-chain.svg`: corrente vetorial para compor com a marca no loader; a argola central indica onde pendurar o emblema.
- `manager-card-frame.svg`: moldura transparente para retrato, com borda prata, azul de acento, arranhões e etiqueta oval sem nome. Inserir a fotografia por baixo; nomes e textos devem ser HTML acessível.
- `manager-card-xerox.svg`: variante mais próxima do destaque GERÊNCIA, com papel rasgado, preto xerox, manchas de azul, riscos e janela central transparente. O nome deve entrar por cima como texto/arte específica e pode manter a inclinação vista na prévia.
- `sky-clouds.svg`: céu estilizado em vetor. O céu das publicações é fotográfico; este SVG é uma interpretação, não uma vetorização daquela foto.
- `halftone.svg`: retícula decorativa preta com fade, para aplicar pontualmente.
- `pendant-preview.png` (900×900): composição **conceitual** com corrente e marca reconstruídas sobre o céu fotográfico novo `../visual/ceu-editorial.webp`.
- `pendant-mobile-preview.png` (390×844): teste **conceitual** em proporção de celular com a marca reconstruída a 260 px de largura. Não representa o cordão original solicitado posteriormente.
- `manager-card-xerox-mounted-preview.png` (720×1060): prévia da variante xerox. A silhueta é apenas marcador provisório da área de foto, sem representar Xande.
- `manager-card-mobile-preview.png` (300×442): teste de redução da prévia da moldura xerox.
- `gerencia-restauro-ia-para-revisao.png` (1672×941): estudo ampliado com a ferramenta integrada de geração/edição de imagens. **É uma reconstrução assistida por IA, não uma fotografia original em alta resolução.** Conserva a composição e os nomes, mas alguns detalhes de rostos, roupas, textura e lettering foram inferidos; revisar com os três retratados antes de usar publicamente. A primeira tentativa foi descartada por introduzir um gorro que Davi não usa na referência.

## Revisão de qualidade feita em 9 de outubro de 2026

A imagem do destaque em 480×853 px melhora a base do usuário sem alterar identidades ou tipografia. A prévia do carrossel usa o recorte fiel de 480×270 px. O cordão continua usando o recorte transparente dos pixels originais; uma tentativa de ampliação por IA foi rejeitada porque redesenhou os traços internos do emblema. O pingente deve permanecer perto do tamanho nativo no celular até existir um original maior.

Ferramenta usada no estudo ampliado dos cards: gerador/ editor de imagens integrado. Prompt final: “Use case: identity-preserve. Asset type: enlargement/restoration of one existing 480×270 Instagram strip containing three real people, for a website carousel. The attached strip is the exact EDIT TARGET. Keep the same aspect ratio and all content at the same locations. Increase resolution and reduce JPEG compression artifacts only. Xande at left: same curly hair, glasses, hand touching glasses, dark NY varsity jacket with white sleeves. Davi in center: same uncovered short dark hair (NO BEANIE, NO HAT), same glasses, dark jacket, headphones around neck, hand holding phone. Querubim at right: same short dark hair, white T-shirt, seated looking down, same pose and outdoor backdrop. Keep the original three distressed vertical frames, translucent tape strips, small blue crown doodles, white gestural handwritten names exactly 'XANDE', 'DAVI', 'QUERUBIM', blue underline strokes, tiny blue 'CEO' labels, black scratched background, and their positions. This is a conservative archival enhancement: preserve each real person's recognizable facial features and proportions; do not create new clothing, jewelry, background objects, lettering, or decorative elements. Do not make faces smoother or more attractive. No rearrangement, no re-composition, no typography redesign.”

## Evidências visuais e aplicação

O perfil combina azul saturado de céu, nuvens brancas, lettering cromado sobre corrente e tipografia de manchete preta, pesada e condensada. As publicações também trazem retícula, pequenos asteriscos e textos curtos em caixa alta com muito espaçamento entre letras. O destaque **GERÊNCIA** muda para preto e azul profundo desgastados, três retratos em faixas verticais, nomes em escrita manual branca e sublinhado azul. Os BlockCards têm foto monocromática, borda metálica escura e dados de jogo em duas colunas.

Paleta aproximada para implementação: azul `#0870C9`, azul escuro `#004A9D`, preto `#05080C`, branco `#F6FBFF`, prata `#A6AFB4`, azul de acento `#1584E7`. São amostras visuais aproximadas, não códigos oficiais.

A fonte exata **não pode ser identificada com segurança** em imagens raster. Para títulos de interface, vale testar uma grotesca muito pesada e condensada (por exemplo, Impact como referência de peso e largura), ajustando manualmente entrelinha e kerning. A escrita manual dos nomes deve ser tratada como elemento gráfico específico, sem presumir uma fonte digital original. Para texto corrido, usar uma sans-serif legível sem imitar a textura do poster.

No mobile, priorizar carregamento progressivo: o SVG de céu pode ser usado no loader, mas no site final uma fotografia autorizada e otimizada pode reproduzir melhor a linguagem do Instagram. Não embutir fotos de terceiros nem nomes descritivos fictícios nos cards.

Tamanhos mínimos recomendados: pingente com pelo menos 220 px de largura para `31` continuar legível; card entre 280 e 320 px no celular, com @, estatísticas e legenda em HTML com tamanho mínimo de 14–16 px. A textura xerox deve ter opacidade reduzida sobre o rosto para não prejudicar a identificação da pessoa.
