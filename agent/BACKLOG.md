# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## Pages de contenu à créer

- [ ] Vérifier s'il manque un guide sur le stockage des e-liquides et
      batteries (sécurité, conditions de conservation)

Note (2026-07-22) : plusieurs idées de contenu de ce backlog étaient déjà
couvertes par des articles existants dans `src/data/blog.js` (20 guides déjà
publiés) : « pod ou kit débutant » ≈ `quelle-cigarette-electronique-choisir`,
« taux de nicotine » = `choisir-taux-nicotine-e-liquide`, « glossaire » =
`lexique-vape`, « entretien » (pods) = `entretenir-pod-rechargeable`. Elles
ont été retirées. Vérifier `src/data/blog.js` avant de proposer un nouveau
guide pour éviter le doublon.

## Optimisations repérées

- [ ] Étendre le maillage interne : seule `conformite-vape` (dans
      `staticSeoPages.js`) linke aujourd'hui vers un guide
      (`reglementation-vape-france`) ; `boutique-vape-marseille`,
      `cigarette-electronique-marseille` et `livraison-retours` n'en ont
      aucun, et aucun guide `blog.js` ne linke vers une page
      `staticSeoPages.js` en retour

## Technique

Vérifié le 2026-07-24 : `node scripts/crawl-links.mjs` sur `dist/` (0 lien
cassé / 4592 vérifiés) et JSON-LD des 359 pages pré-rendues (tous types
bien formés) — rien à corriger pour l'instant. Refaire le contrôle après
publication de contenus importants ou en cas de doute.

## À vérifier

- [ ] Les commits `efc312a` (maillage guide↔guide) et `8cfed8c` (guide
      entretien kit classique/box) sont restés sur les branches
      `seo/2026-07-22` et `seo/2026-07-23`, toujours pas mergés sur `main`
      au 2026-07-24 — vérifier leur statut avant de refaire du travail sur
      ces sujets
- [ ] `main` contient des PR (#25 à #35) non tracées dans ce journal
      (schéma local, IndexNow, maillage produit→guides, guide backlinks…) —
      probablement un autre processus sur ce repo partagé, à garder en
      tête en cas d'incohérence entre journal et code
