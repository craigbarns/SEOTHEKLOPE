# Agent SEO quotidien THEKLOPE — Design

**Date** : 2026-07-21
**Statut** : validé par Gregory
**Repos** : `craigbarns/SEOTHEKLOPE` (agent) → `craigbarns/theklope` (site cible)

## Objectif

Un agent autonome qui améliore chaque jour le SEO du site e-commerce theklope.com
(vente de cigarettes électroniques, React + Vite + Mollie + Supabase, déployé sur Vercel).

Trois types d'actions, une seule tâche par jour :
1. **Créer du contenu SEO** — nouvelles pages (guides vape, pages locales, FAQ)
2. **Optimiser l'existant** — titres, meta descriptions, JSON-LD, maillage interne
3. **Audit technique** — sitemap, liens cassés, indexation ; corriger les problèmes

## Décisions actées

| Question | Décision |
|---|---|
| Mode de livraison | Merge automatique sur `main` de theklope (déploiement Vercel direct) |
| Exécution | GitHub Actions, cron quotidien à 6h heure de Paris |
| Données | Google Search Console (déjà configurée par Gregory) via compte de service |
| Architecture | Approche A : agent centralisé dans SEOTHEKLOPE, site propre |
| Volume | Une tâche par jour, bien faite (coûts API maîtrisés, diffs relisibles) |
| Démarrage | 3 premiers jours en mode PR-seulement, puis bascule en auto-merge |

## Architecture

```
SEOTHEKLOPE/
├── .github/workflows/seo-agent.yml   # cron quotidien + déclenchement manuel
├── agent/
│   ├── MISSION.md      # stratégie SEO : cibles, mots-clés, priorités
│   ├── GUARDRAILS.md   # règles inviolables (conformité vape France)
│   ├── JOURNAL.md      # mémoire : runs passés, plans futurs
│   └── BACKLOG.md      # file d'idées (pages à créer, améliorations repérées)
├── scripts/
│   └── fetch-gsc.mjs   # récupère les données Search Console avant chaque run
└── docs/superpowers/specs/           # ce document
```

## Déroulement d'un run quotidien

1. Le workflow (cron `0 4 * * *` UTC ≈ 6h Paris) clone SEOTHEKLOPE et theklope
2. `fetch-gsc.mjs` écrit les données Search Console (top requêtes, pages, positions,
   CTR) dans un fichier temporaire ; si le secret GSC est absent, fichier vide et
   l'agent travaille en mode dégradé (bonnes pratiques + analyse du code)
3. Claude (Agent SDK / claude-code action) reçoit un prompt qui référence
   MISSION.md, GUARDRAILS.md, JOURNAL.md, BACKLOG.md et les données GSC
4. Il choisit UNE tâche du jour et l'implémente dans le clone de theklope
5. **Garde-fou qualité** : `npm ci && npm run build` + tests doivent passer
6. Livraison :
   - build vert **et** mode auto-merge actif → push direct sur `main` de theklope
   - build rouge **ou** mode PR-seulement → branche + pull request, signalée dans
     le résumé du workflow
7. L'agent met à jour JOURNAL.md (ce qu'il a fait, pourquoi) et BACKLOG.md
   (idées repérées) puis committe dans SEOTHEKLOPE

Le mode de livraison est contrôlé par une variable d'environnement du workflow
(`DELIVERY_MODE: pr | push`), modifiable en un commit. Déclenchement manuel
possible via `workflow_dispatch` avec choix du mode.

## Conformité vape (GUARDRAILS.md, injecté dans chaque run)

- Jamais de promesse de santé, jamais de « moins nocif que le tabac »
- Ton informatif et factuel, jamais promotionnel racoleur — la publicité pour le
  vapotage est interdite en France (art. L3513-4 du Code de la santé publique)
- Mention « vente réservée aux adultes 18+ » sur tout nouveau contenu
- Fichiers interdits de modification : paiement Mollie, auth Supabase, checkout,
  workflows GitHub de theklope, secrets et fichiers d'environnement
- Respect des patterns existants du site : composant `Seo.jsx`,
  `staticSeoPages.js`, `categorySeo.js`, scripts sitemap

## Secrets GitHub (repo SEOTHEKLOPE)

| Secret | Rôle | Obligatoire |
|---|---|---|
| `ANTHROPIC_API_KEY` | fait tourner Claude dans Actions (facturation à l'usage) | oui |
| `THEKLOPE_TOKEN` | PAT GitHub avec accès en écriture sur craigbarns/theklope | oui |
| `GSC_CREDENTIALS` | JSON du compte de service Google (accès Search Console) | non (mode dégradé) |

## Gestion d'erreurs

- Échec build/tests → PR au lieu d'un push, jamais de code cassé sur main
- Échec de l'agent ou de l'API → le workflow échoue visiblement (email GitHub),
  aucun push, le site n'est pas touché
- Données GSC indisponibles → mode dégradé, le run continue
- Le journal étant committé, un run raté n'efface pas la mémoire de l'agent

## Tests / validation

- Tests unitaires du site (existants dans theklope) exécutés à chaque run
- Période d'essai : 3 premiers jours en `DELIVERY_MODE: pr`, Gregory relit les PR
- Bascule en `push` seulement après validation humaine de la qualité
- `workflow_dispatch` permet un run d'essai immédiat sans attendre le cron

## Hors périmètre (YAGNI)

- Dashboard de suivi, base de données d'état (approche C) — le journal markdown suffit
- Netlinking / backlinks externes
- Multi-langue (site FR uniquement)
- Modification du design ou des fonctionnalités e-commerce du site
