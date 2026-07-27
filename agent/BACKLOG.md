# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## Pages de contenu à créer

Note (2026-07-22) : plusieurs idées de contenu de ce backlog étaient déjà
couvertes par des articles existants dans `src/data/blog.js` (20 guides déjà
publiés) : « pod ou kit débutant » ≈ `quelle-cigarette-electronique-choisir`,
« taux de nicotine » = `choisir-taux-nicotine-e-liquide`, « glossaire » =
`lexique-vape`, « entretien » (pods) = `entretenir-pod-rechargeable`. Elles
ont été retirées. Vérifier `src/data/blog.js` avant de proposer un nouveau
guide pour éviter le doublon.

## Optimisations repérées

- [x] Maillage interne `conformite-vape` ↔ `reglementation-vape-france` et
      `cigarette-electronique-marseille` ↔ `quelle-cigarette-electronique-choisir`
      — **fait le 2026-07-27** : lien retour guide → page statique ajouté
      pour les 2 paires (voir JOURNAL). Les 4 pages statiques de
      `staticSeoPages.js` linkent désormais chacune vers un guide qui
      linke en retour. Rappel technique conservé pour référence future :
      les pages `staticSeoPages.js` rendent `sections[].text`/`faq[].a` en
      texte échappé (pas de HTML possible côté page statique) — seul le
      sens guide → page statique est possible via HTML inline, le sens
      page statique → guide passe par le `links` array existant
      (`{ to, label }`).
- [ ] Ajouter le nouveau guide `stockage-eliquides-batterie-vape`
      (2026-07-25, toujours sur la branche `seo/2026-07-25` non mergée) au
      maillage produit → guides (`productGuides.js`, catégories
      `eliquide`/`ecig`/`pod`) une fois cette branche mergée sur `main` —
      attention à la limite de 3 guides affichés par catégorie
      (`relatedGuidesForProduct`, limit=3) : ne pas juste l'ajouter en fin
      de liste sinon il ne s'affichera jamais

## Technique

Vérifié le 2026-07-27 (avant le run de maillage interne) :
`node scripts/crawl-links.mjs` sur `dist/` (0 lien cassé / 4592 puis 4594
après modification, 359 pages pré-rendues, 21 articles), build et
`npm test` (144/144) déjà verts sur `main` avant modification — rien à
corriger pour l'instant. Refaire le contrôle après publication de contenus
importants ou en cas de doute.

## À vérifier

- [ ] Les 5 branches `seo/2026-07-22` (maillage guide↔guide
      `getRelatedPosts`), `seo/2026-07-23` (guide entretien kit
      classique/box), `seo/2026-07-24` (meta descriptions
      `categorySeo.js` nouveautes/meilleures-ventes), `seo/2026-07-25`
      (guide stockage e-liquides/batteries) et `seo/2026-07-26` (maillage
      boutique-marseille/livraison-retours ↔ guides) existent sur le
      remote mais sont **toujours pas mergées sur `main` au 2026-07-27**
      — confirmé qu'elles sont chacune basées sur le même commit `9e0db8d`
      (5 runs distincts, pas empilés). Vérifier leur statut avant de
      refaire du travail sur ces sujets (pas de doublon). En particulier,
      les meta descriptions `nouveautes` (135 caractères) et
      `meilleures-ventes` (139 caractères) de `categorySeo.js` sont
      **toujours** sous la fourchette 140-160 sur `main` au 2026-07-27 —
      la correction existe sur `seo/2026-07-24` mais n'est pas mergée ;
      candidat direct pour un prochain run si la branche n'a toujours pas
      bougé.
- [ ] `main` contient des PR (#25 à #35) non tracées dans ce journal
      (schéma local, IndexNow, maillage produit→guides, guide backlinks,
      harmonisation du nom de marque…) — probablement un autre
      processus/agent sur ce repo partagé. Constat concret le 2026-07-26 :
      le backlog du 2026-07-25 affirmait que `cigarette-electronique-marseille`
      n'avait aucun lien vers un guide, ce qui était déjà faux au moment de
      vérifier — donc bien re-vérifier chaque affirmation du backlog dans
      le code avant d'agir, ne pas la prendre pour acquise
