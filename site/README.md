# Aplicação Bloco 31

Vinext/React executa a apresentação, o painel e as APIs no mesmo projeto. Cloudflare D1 guarda encontros, contatos, interesses, pré-inscrições e as legendas dos três CEOs.

## Executar localmente

Requer Node.js 22.13 ou superior. Na pasta `site/`, instale com `npm ci`. Gere o build com `npm run build`.

Antes da primeira execução das APIs, aplique a migração local:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_harsh_freak.sql
```

Use `npm run dev` para abrir o servidor de desenvolvimento. O banco local fica em `.wrangler/`, fora do Git. Não reaplique uma migração já executada.

## Acesso administrativo

`/admin` exige autenticação e um email presente na variável de ambiente `ADMIN_EMAILS`, uma lista separada por vírgulas. A autorização é verificada no servidor em cada operação. Sem a lista configurada, o acesso é negado.

No desenvolvimento portátil, o starter simula o login com `seedy@sites.test`. A variável `ADMIN_EMAILS` do processo é repassada somente ao servidor de desenvolvimento para testar o painel. Em produção, use a configuração de ambiente do Sites e o login real. Não versionar arquivos de ambiente ou credenciais.

## Conteúdo e dados

- A gerência cria encontros como rascunho. A publicação exige título, data, horário e local.
- As inscrições podem ser abertas ou fechadas por encontro.
- Os formulários exigem nome, contato e consentimento; os dados pessoais são acessíveis apenas pelas rotas administrativas.
- O envio confirma uma pré-inscrição recebida. A gerência acompanha os estados recebida, contatada, confirmada ou cancelada.
- As legendas e os arrobas dos perfis são editáveis no painel. As artes originais dos cards continuam como arquivos estáticos.

A deduplicação usa o contato normalizado. Pessoas que compartilham o mesmo contato serão tratadas como um contato na primeira versão.

## Interface

`landing-source/` contém a apresentação em HTML/CSS/JavaScript. `npm run sync:landing` atualiza o markup e os arquivos públicos que a aplicação serve; o build também executa essa sincronização. Os assets estão em `public/images/`.

A abertura usa animações CSS com o cordão original e o céu. Three.js acrescenta uma resposta de perspectiva ao cordão do hero em navegadores com WebGL; a imagem original aparece como alternativa imediata. A preferência por movimento reduzido desativa o aprimoramento.

## Verificação

`npx tsc --noEmit` verifica os tipos e `npm run build` gera o Worker. A documentação visual e a procedência dos arquivos ficam em `../docs/` e `../assets/`.

## Hospedagem

`.openai/hosting.json` guarda a identidade do Site e o binding `DB`, sem tokens. O Site foi registrado com acesso privado. Registrar o projeto e gerar um build local não confirmam uma publicação concluída.
