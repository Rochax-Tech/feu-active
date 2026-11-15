# FEU Active (React + Tailwind v4 + shadcn)

- Dev: `npm run dev` · Build: `npm run build` (saída em `dist/`) · Netlify: build `npm run build`, publish `dist`.
- Estrutura shadcn: `src/components/ui/*`, alias `@/`, `components.json`, `src/lib/utils.ts`.
- Rotas por hash: `#/` site, `#/painel` painel (dashboard de demonstração com dados fictícios).
- Dados dos produtos: `src/data/products.ts` (preço `null` = "Consulte o valor").

## Publicar (GitHub + Netlify)
1. Subir esta pasta para um repositório no GitHub (node_modules e dist já ficam de fora pelo .gitignore).
2. Netlify: Add new site > Import from Git > escolher o repositório. O `netlify.toml` já define build `npm run build`, pasta `dist` e Node 22.
