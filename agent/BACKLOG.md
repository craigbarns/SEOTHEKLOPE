# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## ⚠️ Correctif GUARDRAILS du 08-01 pas encore mergé sur `main` (à re-suivre)

Le correctif de conformité (commit `7bec44e`, branche `seo/2026-08-01`,
purge des promesses de sevrage/nocivité ajoutées par le batch de contenu
du 07-30) **n'est toujours pas mergé sur `main`** au 2026-08-02. Vérifié
le 08-02 par `grep -n "sevrage\|arrêter de fumer" src/data/blog.js
src/data/categorySeo.js` sur `main` (`e41262c`) : les 8 occurrences non
conformes identifiées le 08-01 sont **toujours en ligne sur le site**.
La branche est basée directement sur `main` actuel donc fusionnerait sans
conflit — ce n'est qu'un délai de fusion (1 jour au 08-02, pas encore une
alerte vu le pattern habituel de ce repo), pas un souci de contenu
obsolète. **Ne pas refaire ce correctif tant que la branche n'est pas
confirmée non mergée après plusieurs jours** (pour éviter un doublon) —
mais si `7bec44e` n'est toujours pas mergé d'ici 2-3 jours, il vaudra
mieux le reproduire directement sur `main` plutôt que de laisser une
non-conformité publicitaire vape en ligne indéfiniment : un écart
GUARDRAILS prime sur le risque de doublon de PR.

Point de vigilance permanent : `main` reçoit régulièrement du contenu
d'autres processus/agents sans passer par ce journal — refaire un
`grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus sain\|sans
danger"` sur `blog.js`/`categorySeo.js`/`staticSeoPages.js` après tout
nouvel afflux de contenu externe, même hors du rythme d'audit habituel.

## État réel sur `main` au 2026-08-02

- `src/data/blog.js` : maillage guide → page statique (3 liens inline)
  **recréé le 08-02** (voir JOURNAL) — traité, ne plus reprendre ce point
  sauf nouvelle régression constatée par `grep`.
- Titre 85 car. / meta description 220 car. du guide
  `quelle-cigarette-electronique-choisir` : correctif du 07-31
  (branche `seo/2026-07-31`) toujours pas mergé au 08-01, **non
  revérifié le 08-02** (un seul sujet traité aujourd'hui) — à confirmer
  avant de reprendre ce point.
- `src/data/categorySeo.js` : `meilleures-ventes` **toujours à 117
  caractères** (sous la fourchette 140-160) lors du dernier contrôle
  (07-31), malgré plusieurs tentatives passées — non revérifié le 08-02.
- `src/data/productGuides.js` : `GUIDES_BY_CATEGORY.ecig` listait 5
  guides pour une limite d'affichage à 4 lors du dernier audit du 07-31
  — non revérifié depuis, à confirmer avant de reprendre ce point (le
  batch de contenu du 07-30 a pu changer la donne).

## Optimisations repérées

- [ ] `categorySeo.js` : `meilleures-ventes` toujours sous 140 caractères
      (117 au dernier contrôle) — allonger dans le même style que les
      autres catégories.
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
- [ ] Rythme : dernier contenu créé le 07-30. Si les prochains runs
      restent sur de l'optimisation/audit, repasser sur du contenu longue
      traîne (priorité 1 de la mission) pour respecter le rythme
      indicatif ~3 jours/semaine.

## Technique

Audit complet le 2026-07-31 (build, tests, liens, longueurs
titres/meta) — voir JOURNAL pour le détail. Audit ciblé conformité
GUARDRAILS refait le 2026-08-01 suite à l'afflux de contenu du 07-30 (voir
ci-dessus — correctif pas encore mergé au 08-02). Refaire un audit
technique complet (pas seulement conformité) dans ~1 semaine ou après un
nouvel afflux de contenu non tracé dans ce journal.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides en batch, images, avis Google,
      redirections, refonte balises produit + cron CRM...). Toujours
      revérifier chaque affirmation du backlog/journal directement dans
      le code sur `main` avant d'agir, **y compris la conformité
      GUARDRAILS** du contenu ajouté par ces autres processus.
- [ ] Suivre la fusion de la branche `seo/2026-08-01` (correctif
      GUARDRAILS) — voir constat en tête de ce fichier.
