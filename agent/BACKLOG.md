# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## ⚠️ À suivre : la reproduction du 08-03 (branche `seo/2026-08-03`) sera-t-elle mergée ?

Le correctif initial (commit `7bec44e`, branche `seo/2026-08-01`) n'ayant
toujours pas été mergé sur `main` après 3 jours (confirmé le 08-03 par
`git merge-base --is-ancestor 7bec44e origin/main` → NO, et par un `grep`
retrouvant les mêmes 8 occurrences non conformes sur `origin/main`
`68d3f4b`), il a été **reproduit directement sur `main`** le 2026-08-03
via `git cherry-pick -n 7bec44e` sur une nouvelle branche
`seo/2026-08-03` (build + 197 tests vérifiés verts — voir JOURNAL du
08-03).

**Prochain run : vérifier que `seo/2026-08-03` est bien mergée sur
`main`.** Si elle ne l'est toujours pas après 2-3 jours, ce sera le
deuxième correctif de conformité bloqué de suite — creuser pourquoi les
PR de conformité en particulier ne sont pas fusionnées plutôt que de
reproduire une 3e fois sans comprendre la cause. Si `seo/2026-08-01`
finit par être mergée en plus de `seo/2026-08-03`, ce sera un no-op
(contenu identique), pas un conflit à résoudre.

Point de vigilance permanent : `main` reçoit régulièrement du contenu
d'autres processus/agents sans passer par ce journal — refaire un
`grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus sain\|sans
danger"` sur `blog.js`/`categorySeo.js`/`staticSeoPages.js` après tout
nouvel afflux de contenu externe, même hors du rythme d'audit habituel.

## État réel sur `main` au 2026-08-03

- `src/data/blog.js` : maillage guide → page statique (3 liens inline)
  **recréé le 08-02** (voir JOURNAL) — traité, ne plus reprendre ce point
  sauf nouvelle régression constatée par `grep`.
- Titre 85 car. / meta description 220 car. du guide
  `quelle-cigarette-electronique-choisir` : correctif du 07-31
  (branche `seo/2026-07-31`) toujours pas mergé au 08-01, **non
  revérifié depuis le 08-01** (un seul sujet traité par run) — à
  confirmer avant de reprendre ce point.
- `src/data/categorySeo.js` : `meilleures-ventes` **toujours à 117
  caractères** (sous la fourchette 140-160) lors du dernier contrôle
  (07-31), malgré plusieurs tentatives passées — non revérifié depuis.
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
GUARDRAILS refait le 2026-08-01, re-vérifié et corrigé directement sur
`main` le 2026-08-03 (voir ci-dessus). Refaire un audit technique complet
(pas seulement conformité) dans ~1 semaine ou après un nouvel afflux de
contenu non tracé dans ce journal.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides en batch, images, avis Google,
      redirections, refonte balises produit + cron CRM...). Toujours
      revérifier chaque affirmation du backlog/journal directement dans
      le code sur `main` avant d'agir, **y compris la conformité
      GUARDRAILS** du contenu ajouté par ces autres processus.
- [ ] Suivre la fusion de la branche `seo/2026-08-03` (reproduction du
      correctif GUARDRAILS) — voir constat en tête de ce fichier.
