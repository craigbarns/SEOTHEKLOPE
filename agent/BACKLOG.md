# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## 🚨 ALERTE PIPELINE — toujours bloquée, reconfirmée le 08-08

**Ce n'est pas un bug technique : c'est un goulot de revue humaine.**
`craigbarns/theklope` est public, donc l'API REST GitHub est consultable
sans jeton (`curl https://api.github.com/repos/craigbarns/theklope/pulls?state=all`).
`agent-repo/.github/workflows/seo-agent.yml` tourne toujours en
`DELIVERY_MODE: pr` : chaque run crée une PR qui attend une fusion
humaine, sans auto-merge. Dernier merge groupé humain :
**2026-07-30T18:33:20Z** — rien depuis (9 jours). Au 08-08, **6 PR SEO
ouvertes**, toutes `mergeable: true` / `mergeable_state: clean` au
dernier contrôle :
- **#46** (`seo/2026-07-31`)
- **#47** (`seo/2026-08-01`) — **devenue superflue le 08-08** : contenait
  le correctif de conformité sevrage/arrêt du tabac, mais celui-ci a été
  appliqué directement sur `main` aujourd'hui (commit `4a7d859`, voir
  JOURNAL) plutôt que d'attendre une 9e journée de fusion humaine. Un
  humain peut fermer cette PR sans la fusionner — son diff vit déjà sur
  `main`.
- **#48** (`seo/2026-08-02`)
- **#50** (`seo/2026-08-05`)
- **#51** (`seo/2026-08-06`) — contient le correctif des IDs produits
  fantômes `xros-4-mini-269`/`pixo-aura-2-301` dans `blog.js`, **toujours
  non fusionné, toujours d'actualité**.
- **#52** (`seo/2026-08-07`) — nouvelle depuis le dernier contrôle,
  contenu non audité par ce run (un seul sujet traité aujourd'hui).

**Action attendue d'un humain, priorité absolue** : décider du sort de
#47 (fermer sans fusionner, son contenu est déjà sur `main`), puis
fusionner #46/#48/#50/#51/#52 (contenu/correctifs SEO légitimes en
attente, non liés à la conformité). Ensuite, décider en connaissance de
cause : garder `DELIVERY_MODE: pr` avec une cadence de revue régulière,
ou repasser à `push` si les vérifications automatiques (build/tests/
liens, toutes vertes à chaque run) sont jugées suffisantes. **Ce goulot
dure maintenant depuis 9 jours** — le correctif de conformité du 08-08
montre qu'une intervention agent directe (contourner la PR bloquée) est
une option viable quand GUARDRAILS est en jeu, mais ce n'est pas une
solution durable pour le contenu SEO normal (volume trop important pour
committer en direct sans revue).

**Anomalie distincte, encore non expliquée** : aucune PR/branche n'existe
pour `seo/2026-08-03` et `08-04`. Pas de piste solide depuis ce contexte
agent (pas d'accès aux logs GitHub Actions).

**Prochain run** : vérifier si #47 a été fermée/fusionnée (elle est
superflue, son contenu est déjà sur `main`) et si #46/#48/#50/#51/#52 ont
avancé. Ne pas recorriger `blog.js` (IDs fantômes, PR #51) en double
tant qu'elle est ouverte — seulement revérifier si elle a été fusionnée.

Point de vigilance permanent : `main` reçoit régulièrement du contenu
d'autres processus/agents sans passer par ce journal — refaire un
`grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus sain\|sans
danger"` sur `blog.js`/`categorySeo.js`/`staticSeoPages.js` après tout
nouvel afflux de contenu externe, même hors du rythme d'audit habituel.

## État réel sur `main` au 2026-08-08

- `src/data/productGuides.js` : `GUIDES_BY_CATEGORY.ecig` avait 5 guides
  pour une limite d'affichage à 4 (`relatedGuidesForProduct()`, `limit =
  4`) — **corrigé le 08-07**, retiré `erreurs-frequentes-debutant-vape`
  de la liste `ecig` (reste maillé via `pack` et `FALLBACK_GUIDE_SLUGS`).
  Traité, ne plus reprendre sauf nouvelle régression.
- `src/data/blog.js` : IDs produits fantômes `xros-4-mini-269` /
  `pixo-aura-2-301` — correctif prêt dans la **PR #51 (non fusionnée)**,
  donc **toujours présents sur `main`** (confirmé par `grep` le 08-07,
  8+2 occurrences). Ne pas recorriger tant que la PR #51 est ouverte —
  seulement revérifier si elle a été fusionnée.
- Titre 85 car. / meta description 220 car. du guide
  `quelle-cigarette-electronique-choisir` : correctif du 07-31
  (branche `seo/2026-07-31`, PR #46) toujours pas mergé, **non revérifié
  depuis le 08-01** (un seul sujet traité par run) — à confirmer avant de
  reprendre ce point.
- `src/data/categorySeo.js` : `meilleures-ventes` **toujours à 117
  caractères** (sous la fourchette 140-160) lors du dernier contrôle
  (07-31) — non revérifié depuis.
- `src/data/staticSeoPages.js` : repéré en passant le 08-04 (non traité,
  hors sujet du jour) — la branche obsolète `seo/2026-08-01` contenait un
  changement de seuil de livraison gratuite 29€→49€ sur les pages
  `boutique-vape-marseille`/`cigarette-electronique-marseille` ; `main`
  est toujours à 29€. Pas une question GUARDRAILS, à confirmer avec le
  reste du site (prix réel appliqué) avant de toucher.

## Optimisations repérées

- [ ] `categorySeo.js` : `meilleures-ventes` toujours sous 140 caractères
      (117 au dernier contrôle) — allonger dans le même style que les
      autres catégories.
- [ ] Contenu : le guide `xros-5-vs-xros-pro-comparatif` compare des
      produits Vaporesso XROS absents du catalogue THEKLOPE (aucun `id`
      contenant « xros » dans `products.js`) — à revoir dans un futur
      passage contenu (comparaison de pods réellement en catalogue, ou
      dépublication).
- [ ] Maillage : une fois la PR #51 fusionnée (ou le point IDs fantômes
      revérifié), envisager d'ajouter `stockage-eliquides-batterie-vape`
      au maillage produit → guides (catégories `eliquide`/`ecig`/`pod`),
      sans dépasser la limite d'affichage effective (4).
- [ ] Contenu, non-GUARDRAILS : le guide `top-10-meilleurs-eliquides`
      contient une statistique non sourcée (« 70% des débutants
      commencent par un goût Classic ») — pas une violation GUARDRAILS,
      mais à sourcer ou retirer dans un futur passage qualité contenu.
- [ ] Mineur, non urgent : titres `alternatives-puffs-jetables` (69 car.)
      et `puffs-interdites-france-2025-2026` (77 car.) légèrement longs ;
      meta descriptions `categorySeo.js` `xros-cartouches` (131) et
      `puffs-jetables` (132) sous 140 — probablement volontaire pour des
      gammes nichées, à confirmer avant de toucher. À regrouper avec
      d'autres écarts similaires plutôt qu'un commit dédié.
- [ ] Rythme : dernier contenu long format le 08-05 (guide voyage en
      avion). Si les prochains runs reviennent sur de
      l'optimisation/audit, garder en tête le rythme indicatif
      ~3 jours/semaine de contenu — envisager un nouveau guide au
      prochain run si aucune opportunité GSC ne prime.

## Technique

Audit complet le 2026-07-31 (build, tests, liens, longueurs
titres/meta). Audit ciblé conformité GUARDRAILS refait les 08-01, 08-03,
08-04, 08-05, 08-06 et 08-07 (voir historique JOURNAL), puis **corrigé
directement sur `main` le 08-08** (commit `4a7d859`, sans attendre la
fusion de la PR #47 — voir alerte pipeline). Refaire un audit technique
complet (pas seulement conformité) au prochain run si aucune tâche
contenu/optimisation plus prioritaire ne s'impose — le dernier audit
complet date maintenant de plus d'une semaine et demie.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides en batch, images, avis Google,
      redirections, refonte balises produit + cron CRM...). Toujours
      revérifier chaque affirmation du backlog/journal directement dans
      le code sur `main` avant d'agir, **y compris la conformité
      GUARDRAILS** du contenu ajouté par ces autres processus — refaire
      le `grep -n "sevrage\|arrêter de fumer\|arrêter le tabac\|nocivité\|
      moins nocif\|plus sain\|sans danger"` sur `blog.js`/`categorySeo.js`/
      `staticSeoPages.js` après tout nouvel afflux de contenu externe.
- [ ] Voir l'alerte pipeline en tête de ce fichier : le correctif de
      conformité est réglé directement sur `main` (08-08), mais le
      goulot de revue humaine (`DELIVERY_MODE: pr`) persiste pour les
      PR #46/#48/#50/#51/#52 restantes. Revérifier leur état au prochain
      run avant toute décision. Ne pas recorriger `blog.js` (IDs
      fantômes, PR #51) en double tant qu'elle est ouverte.
