# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## ✅ Audit conformité GUARDRAILS fait le 2026-08-01

Un batch de ~13 guides + refonte catégories ajouté le 07-30 par un autre
processus (`ba2ccf0`/`fd0338b`, jamais tracé dans ce journal) contenait 7
promesses de sevrage/bénéfice santé interdites par GUARDRAILS.md. Toutes
corrigées le 08-01 (voir JOURNAL). Point de vigilance permanent : `main`
reçoit régulièrement du contenu d'autres processus/agents sans passer par
ce journal — refaire un `grep -n "sevrage\|arrêter de fumer\|nocivité\|moins
nocif\|plus sain\|sans danger"` sur `blog.js`/`categorySeo.js`/
`staticSeoPages.js` après tout nouvel afflux de contenu externe, même hors
du rythme d'audit habituel.

## État réel sur `main` au 2026-08-01

- `src/data/blog.js` : plus de 35 guides (batch du 07-30 ajouté). Titre
  85 car. / meta description 220 car. du guide
  `quelle-cigarette-electronique-choisir` **toujours pas corrigés sur
  `main`** — le correctif existe sur la branche `seo/2026-07-31` (run
  d'hier) mais n'est pas encore mergé (1 jour de latence normale au
  08-01, pas une alerte à ce stade). Ne pas refaire ce correctif tant que
  la branche n'est pas confirmée non mergée après plusieurs jours.
- `src/data/categorySeo.js` : `meilleures-ventes` **toujours à 117
  caractères** (sous la fourchette 140-160) malgré plusieurs tentatives
  passées.
- `src/data/productGuides.js` : `GUIDES_BY_CATEGORY.ecig` listait 5
  guides pour une limite d'affichage à 4 lors du dernier audit du 07-31
  — non revérifié depuis, à confirmer avant de reprendre ce point (le
  batch de contenu du 07-30 a pu changer la donne).
- Maillage guide ↔ page statique (`staticSeoPages.js` ↔ `blog.js`) :
  sens page → guide (`links` array) intact sur les 4 pages statiques.
  Sens guide → page (lien inline dans le corps) : **toujours en
  régression**, reconfirmé le 08-01 par `grep` — aucun des 3 liens
  suivants n'existe dans `blog.js` :
  - `compatibilite-resistances-cartouches` → `boutique-vape-marseille`
  - `livraison-produits-vape-france` → `livraison-retours`
  - `quelle-cigarette-electronique-choisir` → `cigarette-electronique-marseille`
  (seul le lien de `reglementation-vape-france` vers `conformite-vape`
  a survécu à la reconstruction du 07-30).

## Optimisations repérées

- [ ] Recréer les 3 liens retour guide → page statique listés ci-dessus.
      Pattern déjà utilisé les 07-26/07-27 : lien `<a href="...">` inline
      dans le `text` d'une section ou d'une FAQ du guide (`blog.js` passe
      par `dangerouslySetInnerHTML`, contrairement à `staticSeoPages.js`
      qui échappe le texte).
- [ ] `categorySeo.js` : `meilleures-ventes` toujours sous 140 caractères
      (117) — allonger dans le même style que les autres catégories.
- [ ] `productGuides.js` : revérifier `GUIDES_BY_CATEGORY.ecig` vs.
      `limit` de `relatedGuidesForProduct()` (5 guides mappés pour une
      limite à 4 lors du dernier contrôle) — soit retirer un guide, soit
      adapter le `limit` pour cette catégorie spécifiquement.
- [ ] Une fois le point ci-dessus clarifié, ajouter
      `stockage-eliquides-batterie-vape` au maillage produit → guides
      (catégories `eliquide`/`ecig`/`pod`), sans dépasser la limite
      d'affichage effective.
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

## Technique

Audit complet le 2026-07-31 (build, tests, liens, longueurs
titres/meta) — voir JOURNAL pour le détail. Audit ciblé conformité
GUARDRAILS refait le 2026-08-01 suite à l'afflux de contenu du 07-30 (voir
ci-dessus). Refaire un audit technique complet (pas seulement conformité)
dans ~1 semaine ou après un nouvel afflux de contenu non tracé dans ce
journal.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides en batch, images, avis Google,
      redirections, refonte balises produit + cron CRM...). Toujours
      revérifier chaque affirmation du backlog/journal directement dans
      le code sur `main` avant d'agir, **y compris la conformité
      GUARDRAILS** du contenu ajouté par ces autres processus (voir
      constat du 08-01 ci-dessus — ce n'était encore jamais arrivé mais
      ça peut se reproduire).
