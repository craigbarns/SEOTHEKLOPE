# Agent SEO quotidien THEKLOPE — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un workflow GitHub Actions quotidien dans SEOTHEKLOPE qui fait tourner Claude pour améliorer le SEO du site theklope (contenu, optimisation, audit), avec garde-fous build/tests et conformité vape.

**Architecture:** Le repo SEOTHEKLOPE contient la mémoire de l'agent (fichiers markdown), un script de récupération Search Console sans dépendance, et un workflow cron qui clone les deux repos, exécute Claude Code en mode headless dans le clone de theklope, vérifie build+tests, puis livre (push direct ou PR selon `DELIVERY_MODE`).

**Tech Stack:** GitHub Actions, Claude Code CLI (`@anthropic-ai/claude-code`, headless `-p`), Node 20 (script GSC sans dépendance, `node:test`), gh CLI pour les PR.

## Global Constraints

- Tout le contenu produit est en **français**
- Conformité vape France (art. L3513-4 CSP) : pas de promesse santé, ton informatif, mention 18+
- Cron : `0 4 * * *` UTC (≈ 6h Paris) ; mode initial `DELIVERY_MODE: pr`
- L'agent ne pousse jamais lui-même : c'est le workflow qui livre après vérification
- Repos : agent = `craigbarns/SEOTHEKLOPE`, site = `craigbarns/theklope` (branche `main`)
- Secrets : `ANTHROPIC_API_KEY` (obligatoire), `THEKLOPE_TOKEN` (obligatoire), `GSC_CREDENTIALS` (optionnel)

---

### Task 1: Fichiers mémoire de l'agent (GUARDRAILS, MISSION, JOURNAL, BACKLOG)

**Files:**
- Create: `agent/GUARDRAILS.md`
- Create: `agent/MISSION.md`
- Create: `agent/JOURNAL.md`
- Create: `agent/BACKLOG.md`

**Interfaces:**
- Produces: les quatre fichiers markdown lus par le prompt de la Task 3. Chemins exacts : `agent/GUARDRAILS.md`, `agent/MISSION.md`, `agent/JOURNAL.md`, `agent/BACKLOG.md`.

- [ ] **Step 1: Écrire `agent/GUARDRAILS.md`**

```markdown
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
```

- [ ] **Step 2: Écrire `agent/MISSION.md`**

```markdown
# MISSION — Stratégie SEO THEKLOPE

## Objectif

Augmenter le trafic organique français de theklope.com : boutique en ligne
de cigarettes électroniques, e-liquides, pods, résistances et accessoires,
avec ancrage local à Marseille.

## Public

Vapoteurs adultes en France cherchant du matériel, des consommables
compatibles et des informations pratiques d'utilisation.

## Priorités (dans l'ordre)

1. **Contenu longue traîne** : guides pratiques (« comment choisir sa
   résistance », « quelle cartouche pour quel pod »), pages de comparaison
   factuelle de matériel, glossaire vape. Format : pages dans
   `src/data/staticSeoPages.js` avec FAQ et JSON-LD, comme l'existant.
2. **Optimisation des pages catégories et produits** : titres, meta
   descriptions, maillage interne entre guides ↔ catégories ↔ produits.
3. **SEO local Marseille** : renforcer la page boutique locale existante.
4. **Santé technique** : sitemap à jour, canoniques, données structurées
   valides, liens internes non cassés.

## Rythme hebdomadaire indicatif

- ~3 jours : création de contenu (1 page complète par run)
- ~2 jours : optimisation de l'existant
- ~2 jours : audit technique et corrections

Si les données Search Console montrent une opportunité claire (page en
position 5-15 avec des impressions), la saisir en priorité.

## Mots-clés thématiques

cigarette électronique, e-liquide, pod, puff rechargeable, résistance,
kit vape débutant, vape Marseille, accessoires vape, sels de nicotine
(présentation factuelle uniquement — voir GUARDRAILS).
```

- [ ] **Step 3: Écrire `agent/JOURNAL.md`**

```markdown
# JOURNAL de l'agent SEO

Mémoire persistante. Le run du jour AJOUTE une entrée en HAUT de la liste
(sous cette introduction), au format ci-dessous. Ne jamais réécrire les
entrées passées.

## Format d'entrée

### AAAA-MM-JJ — [type : contenu | optimisation | audit]
- **Fait** : description concise de la modification livrée
- **Pourquoi** : donnée GSC ou raisonnement qui a motivé le choix
- **Fichiers** : liste des fichiers touchés dans theklope
- **Suite** : ce que le prochain run devrait envisager

---

*(aucun run pour l'instant)*
```

- [ ] **Step 4: Écrire `agent/BACKLOG.md`**

```markdown
# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## Pages de contenu à créer

- [ ] Guide : comment choisir sa résistance (ohms, watts, compatibilité)
- [ ] Guide : pod ou kit débutant, comment choisir son premier matériel
- [ ] Guide : comprendre les taux de nicotine et les sels de nicotine (factuel)
- [ ] Glossaire de la vape (termes techniques expliqués)
- [ ] Guide : entretenir sa cigarette électronique (nettoyage, remplacement)

## Optimisations repérées

- [ ] Vérifier que chaque catégorie de `categorySeo.js` a une meta
      description unique de 140-160 caractères
- [ ] Maillage interne : lier les pages SEO statiques entre elles et vers
      les catégories

## Technique

- [ ] Vérifier que toutes les pages du sitemap répondent en 200
- [ ] Valider le JSON-LD des pages existantes (schema.org)
```

- [ ] **Step 5: Vérifier et committer**

Run : `ls agent/` — attendu : `BACKLOG.md GUARDRAILS.md JOURNAL.md MISSION.md`

```bash
git add agent/
git commit -m "feat: fichiers mémoire de l'agent (mission, guardrails, journal, backlog)"
```

---

### Task 2: Script Search Console sans dépendance (TDD)

**Files:**
- Create: `package.json`
- Create: `scripts/fetch-gsc.mjs`
- Test: `scripts/fetch-gsc.test.mjs`

**Interfaces:**
- Produces: `node scripts/fetch-gsc.mjs` écrit sur stdout un JSON
  `{ "generatedAt": string, "siteUrl": string, "topQueries": Row[], "topPages": Row[] }`
  où `Row = { keys: string[], clicks: number, impressions: number, ctr: number, position: number }`.
  Sans secret `GSC_CREDENTIALS` : `{}` et exit 0. Exports testés :
  `dateRange(today?: Date): { startDate: string, endDate: string }` et
  `buildRequestBody(startDate: string, endDate: string, dimension: string): object`.

- [ ] **Step 1: Créer `package.json`**

```json
{
  "name": "seotheklope-agent",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test scripts/"
  }
}
```

- [ ] **Step 2: Écrire le test qui échoue `scripts/fetch-gsc.test.mjs`**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dateRange, buildRequestBody } from './fetch-gsc.mjs'

test('dateRange : 28 jours se terminant 3 jours avant aujourd’hui', () => {
  const { startDate, endDate } = dateRange(new Date('2026-07-21T10:00:00Z'))
  assert.equal(endDate, '2026-07-18')
  assert.equal(startDate, '2026-06-21')
})

test('buildRequestBody : corps de requête Search Analytics', () => {
  const body = buildRequestBody('2026-06-21', '2026-07-18', 'query')
  assert.deepEqual(body, {
    startDate: '2026-06-21',
    endDate: '2026-07-18',
    dimensions: ['query'],
    rowLimit: 50,
  })
})
```

- [ ] **Step 3: Vérifier que le test échoue**

Run : `npm test`
Attendu : FAIL — `Cannot find module ... fetch-gsc.mjs`

- [ ] **Step 4: Écrire `scripts/fetch-gsc.mjs`**

```js
// Récupère les données Google Search Console pour le run quotidien de
// l'agent SEO, sans aucune dépendance npm (JWT signé via node:crypto).
// Sortie : JSON sur stdout. Sans secret GSC_CREDENTIALS : "{}" (mode dégradé).
import { createSign } from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

export function dateRange(today = new Date()) {
  const end = new Date(today)
  end.setUTCDate(end.getUTCDate() - 3) // GSC a ~3 jours de latence
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 27)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { startDate: iso(start), endDate: iso(end) }
}

export function buildRequestBody(startDate, endDate, dimension) {
  return { startDate, endDate, dimensions: [dimension], rowLimit: 50 }
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(JSON.stringify({
    iss: creds.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claims}`)
  const signature = signer.sign(creds.private_key, 'base64url')
  const assertion = `${header}.${claims}.${signature}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!res.ok) throw new Error(`Token Google refusé : ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.access_token
}

async function queryGsc(siteUrl, token, body) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GSC ${res.status} : ${await res.text()}`)
  const data = await res.json()
  return data.rows ?? []
}

async function main() {
  const raw = process.env.GSC_CREDENTIALS
  const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:theklope.com'
  if (!raw) {
    process.stdout.write('{}')
    return
  }
  const creds = JSON.parse(raw)
  const token = await getAccessToken(creds)
  const { startDate, endDate } = dateRange()
  const [topQueries, topPages] = await Promise.all([
    queryGsc(siteUrl, token, buildRequestBody(startDate, endDate, 'query')),
    queryGsc(siteUrl, token, buildRequestBody(startDate, endDate, 'page')),
  ])
  process.stdout.write(JSON.stringify(
    { generatedAt: new Date().toISOString(), siteUrl, startDate, endDate, topQueries, topPages },
    null, 2,
  ))
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isDirectRun) {
  main().catch((err) => {
    console.error(`fetch-gsc : ${err.message}`)
    process.exit(1)
  })
}
```

- [ ] **Step 5: Vérifier que les tests passent**

Run : `npm test`
Attendu : PASS (2 tests)

- [ ] **Step 6: Vérifier le mode dégradé**

Run : `unset GSC_CREDENTIALS; node scripts/fetch-gsc.mjs`
Attendu : sortie exactement `{}`, code retour 0

- [ ] **Step 7: Commit**

```bash
git add package.json scripts/
git commit -m "feat: script Search Console sans dépendance, avec tests et mode dégradé"
```

---

### Task 3: Prompt de mission quotidien de l'agent

**Files:**
- Create: `agent/PROMPT.md`

**Interfaces:**
- Consumes: chemins des fichiers de la Task 1, `gsc-data.json` produit par le workflow (Task 4).
- Produces: le texte passé à `claude -p` par le workflow. Suppose l'arborescence du runner : `agent-repo/` (SEOTHEKLOPE) et `site/` (theklope), cwd = racine du workspace.

- [ ] **Step 1: Écrire `agent/PROMPT.md`**

```markdown
Tu es l'agent SEO quotidien de THEKLOPE, boutique en ligne française de
cigarettes électroniques. Tu travailles depuis la racine du workspace :

- `agent-repo/` : ton repo (mémoire et règles)
- `site/` : clone du site theklope (React + Vite), branche main
- `gsc-data.json` : données Google Search Console des 28 derniers jours
  (peut être vide `{}` — travaille alors sans données)

## Démarche obligatoire, dans l'ordre

1. Lis `agent-repo/agent/GUARDRAILS.md` — règles inviolables.
2. Lis `agent-repo/agent/MISSION.md`, `agent-repo/agent/JOURNAL.md`,
   `agent-repo/agent/BACKLOG.md` et `gsc-data.json`.
3. Choisis UNE SEULE tâche pour aujourd'hui (contenu, optimisation ou
   audit) selon la mission, le rythme indicatif, le journal (ne répète pas
   ce qui vient d'être fait) et les opportunités GSC.
4. Explore le code concerné dans `site/` avant de modifier quoi que ce soit.
5. Implémente la tâche dans `site/`, en respectant les patterns existants.
6. Si tu as créé une page, vérifie qu'elle est bien référencée partout où
   il faut (routes, `staticSeoPages.js`, données du sitemap).
7. Vérifie ton travail : `cd site && npm ci && npm run build` doit réussir,
   ainsi que les tests du site s'il y en a. Corrige jusqu'à ce que ce soit
   vert. Si tu n'y arrives pas, annule proprement tes modifications
   (`git checkout .`) et note l'échec dans le journal.
8. Committe dans `site/` avec un message clair en français commençant par
   `seo:` (exemple : `seo: guide choisir sa résistance`). NE POUSSE PAS —
   le workflow s'en charge après vérification.
9. Mets à jour `agent-repo/agent/JOURNAL.md` (nouvelle entrée EN HAUT,
   format décrit dans le fichier) et `agent-repo/agent/BACKLOG.md` (retire
   ce qui est fait, ajoute ce que tu as repéré). Committe dans `agent-repo`
   avec le message `journal: run du AAAA-MM-JJ`. NE POUSSE PAS.

## Rappels

- Une tâche, un diff relisible en 10 minutes. Pas plus.
- Tout en français. Conformité GUARDRAILS non négociable.
- Ne touche jamais aux fichiers interdits listés dans GUARDRAILS.md.
```

- [ ] **Step 2: Vérifier et committer**

Run : `cat agent/PROMPT.md | head -5` — attendu : le texte ci-dessus.

```bash
git add agent/PROMPT.md
git commit -m "feat: prompt de mission quotidien de l'agent"
```

---

### Task 4: Workflow GitHub Actions quotidien

**Files:**
- Create: `.github/workflows/seo-agent.yml`

**Interfaces:**
- Consumes: `agent/PROMPT.md` (Task 3), `scripts/fetch-gsc.mjs` (Task 2), secrets `ANTHROPIC_API_KEY`, `THEKLOPE_TOKEN`, `GSC_CREDENTIALS`.
- Produces: run quotidien à 4h UTC ; livraison push ou PR sur `craigbarns/theklope` ; commit du journal sur SEOTHEKLOPE.

- [ ] **Step 1: Écrire `.github/workflows/seo-agent.yml`**

```yaml
name: Agent SEO quotidien

on:
  schedule:
    - cron: '0 4 * * *' # ≈ 6h heure de Paris
  workflow_dispatch:
    inputs:
      delivery_mode:
        description: Mode de livraison
        type: choice
        options: [pr, push]
        default: pr

# pr = pull request à relire | push = merge automatique sur main.
# Passer à "push" ici après la période d'essai de 3 jours.
env:
  DELIVERY_MODE: pr
  GSC_SITE_URL: sc-domain:theklope.com

permissions:
  contents: write

concurrency:
  group: seo-agent
  cancel-in-progress: false

jobs:
  seo:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    steps:
      - name: Checkout SEOTHEKLOPE (agent)
        uses: actions/checkout@v4
        with:
          path: agent-repo

      - name: Checkout theklope (site)
        uses: actions/checkout@v4
        with:
          repository: craigbarns/theklope
          token: ${{ secrets.THEKLOPE_TOKEN }}
          path: site
          fetch-depth: 0

      - name: Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Résoudre le mode de livraison
        run: echo "MODE=${{ inputs.delivery_mode || env.DELIVERY_MODE }}" >> "$GITHUB_ENV"

      - name: Données Search Console (mode dégradé si absentes)
        env:
          GSC_CREDENTIALS: ${{ secrets.GSC_CREDENTIALS }}
        run: node agent-repo/scripts/fetch-gsc.mjs > gsc-data.json || echo '{}' > gsc-data.json

      - name: Config git des deux clones
        run: |
          for d in site agent-repo; do
            git -C "$d" config user.name "seo-agent"
            git -C "$d" config user.email "seo-agent@users.noreply.github.com"
          done

      - name: Installer Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run de l'agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: claude -p "$(cat agent-repo/agent/PROMPT.md)" --dangerously-skip-permissions --model claude-sonnet-5

      - name: Vérification build + tests du site
        id: verify
        continue-on-error: true
        working-directory: site
        run: |
          npm ci
          npm run build
          npm test --if-present

      - name: Livraison sur theklope
        env:
          GH_TOKEN: ${{ secrets.THEKLOPE_TOKEN }}
        working-directory: site
        run: |
          COMMITS=$(git rev-list origin/main..HEAD --count)
          if [ "$COMMITS" -eq 0 ]; then
            echo "Aucune modification produite aujourd'hui." >> "$GITHUB_STEP_SUMMARY"
            exit 0
          fi
          if [ "${{ steps.verify.outcome }}" = "success" ] && [ "$MODE" = "push" ]; then
            git push origin HEAD:main
            echo "✅ Poussé sur main de theklope ($COMMITS commit(s)) — déploiement Vercel en cours." >> "$GITHUB_STEP_SUMMARY"
          else
            BRANCH="seo/$(date +%Y-%m-%d)"
            git checkout -b "$BRANCH"
            git push origin "$BRANCH" --force
            gh pr create --repo craigbarns/theklope \
              --base main --head "$BRANCH" \
              --title "SEO du jour — $(date +%d/%m/%Y)" \
              --body "$(git log origin/main..HEAD --pretty='- %s')

Build/tests : ${{ steps.verify.outcome }}. PR générée par l'agent SEO.

🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
              || echo "PR déjà existante pour $BRANCH"
            echo "📝 PR ouverte sur theklope (build/tests : ${{ steps.verify.outcome }})." >> "$GITHUB_STEP_SUMMARY"
          fi

      - name: Sauvegarder le journal de l'agent
        if: always()
        working-directory: agent-repo
        run: |
          git add agent/
          git diff --cached --quiet && exit 0
          git commit -m "journal: run du $(date +%F)" || true
          git pull --rebase origin main
          git push origin main
```

- [ ] **Step 2: Vérifier la syntaxe YAML**

Run : `node -e "process.stdout.write('ok\n')" && ruby -ryaml -e "YAML.load_file('.github/workflows/seo-agent.yml'); puts 'YAML valide'" 2>/dev/null || python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/seo-agent.yml')); print('YAML valide')"`
Attendu : `YAML valide`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/seo-agent.yml
git commit -m "feat: workflow quotidien de l'agent SEO (cron + livraison pr/push)"
```

---

### Task 5: README de pilotage

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: noms exacts des secrets et du workflow des tasks précédentes.

- [ ] **Step 1: Écrire `README.md`**

```markdown
# SEOTHEKLOPE — Agent SEO quotidien

Agent autonome qui améliore chaque jour le SEO de
[theklope](https://github.com/craigbarns/theklope) (une tâche par jour :
contenu, optimisation ou audit technique). Tourne à 6h heure de Paris via
GitHub Actions.

## Piloter l'agent

| Pour… | Faire… |
|---|---|
| Changer la stratégie | Éditer `agent/MISSION.md` |
| Ajouter/retirer une règle | Éditer `agent/GUARDRAILS.md` |
| Suggérer des idées | Ajouter des lignes dans `agent/BACKLOG.md` |
| Voir ce qu'il a fait | Lire `agent/JOURNAL.md` |
| Lancer un run tout de suite | Onglet Actions → « Agent SEO quotidien » → Run workflow |
| Activer le merge automatique | Dans `.github/workflows/seo-agent.yml`, passer `DELIVERY_MODE: pr` à `push` |

## Secrets à configurer (Settings → Secrets and variables → Actions)

| Secret | Comment l'obtenir |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys. Facturation à l'usage. |
| `THEKLOPE_TOKEN` | GitHub → Settings → Developer settings → Fine-grained tokens. Accès au repo `theklope` uniquement, permissions Contents **Read and write** + Pull requests **Read and write**. |
| `GSC_CREDENTIALS` | (Optionnel) Google Cloud Console → compte de service avec l'API Search Console activée → clé JSON. Ajouter l'email du compte de service comme utilisateur de la propriété dans Search Console. Coller tout le JSON dans le secret. |

Sans `GSC_CREDENTIALS`, l'agent tourne en mode dégradé (bonnes pratiques,
sans données de positionnement).

## Sécurité

- Mode initial : `pr` — l'agent ouvre une pull request à relire. Passer en
  `push` après quelques jours si la qualité convient.
- Même en mode `push`, un build ou des tests en échec ⇒ PR au lieu d'un
  push. Jamais de code cassé sur main.
- Conformité vape France encodée dans `agent/GUARDRAILS.md`.
```

- [ ] **Step 2: Commit et push**

```bash
git add README.md
git commit -m "docs: README de pilotage de l'agent"
git push
```

---

### Task 6: Validation de bout en bout

**Files:**
- Aucun nouveau fichier — configuration des secrets (action de Gregory) et run d'essai.

**Interfaces:**
- Consumes: tout ce qui précède, poussé sur `main` de SEOTHEKLOPE.

- [ ] **Step 1: Pousser tout sur GitHub**

Run : `git push origin main`
Attendu : le workflow « Agent SEO quotidien » apparaît dans l'onglet Actions de SEOTHEKLOPE.

- [ ] **Step 2: Gregory configure les secrets**

`ANTHROPIC_API_KEY` et `THEKLOPE_TOKEN` (obligatoires), `GSC_CREDENTIALS`
(optionnel) — voir le README. Vérification : `gh secret list -R craigbarns/SEOTHEKLOPE`
liste au moins les deux obligatoires.

- [ ] **Step 3: Run d'essai manuel en mode PR**

Run : `gh workflow run "Agent SEO quotidien" -R craigbarns/SEOTHEKLOPE -f delivery_mode=pr`
Puis : `gh run watch -R craigbarns/SEOTHEKLOPE`
Attendu : run vert ; une PR « SEO du jour » ouverte sur craigbarns/theklope ;
une nouvelle entrée dans `agent/JOURNAL.md` sur SEOTHEKLOPE.

- [ ] **Step 4: Relecture humaine de la PR d'essai**

Gregory relit la PR : qualité du contenu, conformité GUARDRAILS, build
Vercel de la preview. Merge si OK.

- [ ] **Step 5: Après 3 jours satisfaisants, activer l'auto-merge**

Éditer `.github/workflows/seo-agent.yml` : `DELIVERY_MODE: pr` → `push`,
committer, pousser.
```
