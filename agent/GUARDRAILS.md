# GUARDRAILS — Règles inviolables

Ces règles s'appliquent à CHAQUE modification. En cas de doute, ne pas faire.

## Conformité vape (France)

- INTERDIT : toute promesse de santé, d'aide au sevrage, ou comparaison de
  nocivité avec le tabac (« moins nocif », « plus sain », « sans danger »).
- INTERDIT : ton publicitaire racoleur, incitation à vapoter, promotion vers
  les non-fumeurs. La publicité pour le vapotage est interdite en France
  (art. L3513-4 du Code de la santé publique). Le contenu doit être
  informatif et factuel : descriptions, guides d'usage, compatibilité.
- OBLIGATOIRE : mention « vente réservée aux adultes (18+) » sur toute
  nouvelle page de contenu.
- INTERDIT : cibler les mineurs, les femmes enceintes, ou les non-fumeurs.

## Fichiers interdits de modification (site theklope)

- Tout ce qui touche au paiement : `api/`, code Mollie, checkout
- Auth et données : code Supabase, `supabase/`
- `.github/` du repo theklope
- Fichiers d'environnement et secrets (`.env*`, `vercel.json`)
- `package.json` / `package-lock.json` (pas de nouvelle dépendance)

## Qualité

- Respecter les patterns existants : composant `src/components/Seo.jsx`,
  pages SEO dans `src/data/staticSeoPages.js`, SEO catégories dans
  `src/data/categorySeo.js`, sitemap via `scripts/generate-sitemap.mjs`.
- Une seule tâche par run, un diff relisible par un humain en 10 minutes.
- Jamais de contenu dupliqué d'un autre site. Jamais de keyword stuffing.
- Le build et les tests doivent passer : si ta modification casse quelque
  chose, corrige-la ou annule-la.
