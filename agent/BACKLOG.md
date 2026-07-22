# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## Pages de contenu à créer

- [ ] Guide dédié à l'entretien d'un kit classique / box (nettoyage, joints,
      contacts) — `entretenir-pod-rechargeable` couvre déjà les pods, mais
      pas les kits tubulaires/box
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

- [ ] Meta descriptions `categorySeo.js` sous 140 caractères : `nouveautes`
      (135) et `meilleures-ventes` (139) — allonger légèrement pour rentrer
      dans la fourchette 140-160 (les 8 autres catégories sont déjà bonnes)
- [ ] Étendre le maillage interne : les pages `staticSeoPages.js` ne
      linkent pas encore vers les guides `blog.js` (et inversement) — après
      le maillage guide↔guide fait le 2026-07-22, prochaine étape naturelle

## Technique

- [ ] Vérifier que toutes les pages du sitemap répondent en 200
- [ ] Valider le JSON-LD des pages existantes (schema.org)
