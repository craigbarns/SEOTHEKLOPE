# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## ✅ Blocage de livraison résolu (constat du 2026-07-31)

Le blocage signalé du 07-24 au 07-30 (8 branches `seo/2026-07-22` à
`seo/2026-07-30` non mergées) est terminé : un humain les a toutes
mergées sur `main`, suivi d'une reconstruction manuelle de `blog.js`
(commit `b24679d`). `main` est de nouveau la seule source de vérité
fiable — plus besoin de vérifier `git merge-base --is-ancestor` avant
d'agir, il suffit de vérifier l'état réel du code sur `main` (ce qui
reste toujours la bonne pratique, blocage ou non).

Point de vigilance : `main` continue de recevoir des commits d'autres
processus/agents non tracés dans ce journal (ex. : le guide
`quelle-cigarette-electronique-choisir` ajouté le 07-29, la mention des
avis Google le 07-31). Toujours revérifier le code directement plutôt que
de se fier au seul journal.

## État réel sur `main` au 2026-07-31

- `src/data/blog.js` : 35 guides. Titre/meta description du guide
  `quelle-cigarette-electronique-choisir` corrigés le 07-31 (étaient à
  85/220 caractères, ramenés à 52/153).
- `src/data/categorySeo.js` : `nouveautes` corrigé (152 car., dans la
  fourchette 140-160). `meilleures-ventes` **toujours à 117 caractères**
  (sous la fourchette) malgré 2 tentatives passées — à corriger.
- `src/data/productGuides.js` : `limit` par défaut est bien à 4 (corrigé),
  mais `GUIDES_BY_CATEGORY.ecig` liste maintenant 5 guides → le 5e
  (`erreurs-frequentes-debutant-vape`) est de nouveau tronqué pour les
  fiches produit `ecig`. Guide `stockage-eliquides-batterie-vape` non
  mappé dans ce fichier.
- Maillage guide ↔ page statique (`staticSeoPages.js` ↔ `blog.js`) :
  sens page → guide (`links` array) intact sur les 4 pages statiques.
  Sens guide → page (lien inline dans le corps) : **régression** — seul
  le lien de `reglementation-vape-france` vers `conformite-vape` a
  survécu à la reconstruction du 07-30. Les 3 autres (ajoutés les 07-26
  et 07-27) ont disparu :
  - `compatibilite-resistances-cartouches` → `boutique-vape-marseille`
  - `livraison-produits-vape-france` → `livraison-retours`
  - `quelle-cigarette-electronique-choisir` → `cigarette-electronique-marseille`

## Optimisations repérées

- [ ] Recréer les 3 liens retour guide → page statique perdus dans la
      reconstruction du 07-30 (voir ci-dessus). Pattern déjà utilisé les
      07-26/07-27 : lien `<a href="...">` inline dans le `text` d'une
      section ou d'une FAQ du guide (le contenu de `blog.js` passe par
      `dangerouslySetInnerHTML`, contrairement à `staticSeoPages.js` qui
      échappe le texte).
- [ ] `categorySeo.js` : `meilleures-ventes` toujours sous 140 caractères
      (117) — allonger dans le même style que les autres catégories.
- [ ] `productGuides.js` : soit retirer un guide de `GUIDES_BY_CATEGORY.ecig`
      (5 mappés, limite d'affichage 4), soit repasser `limit` à 5 pour
      cette catégorie spécifiquement (actuellement un seul `limit` global
      pour tous les appels). Vérifier l'impact sur les autres catégories
      avant de changer le `limit` global.
- [ ] Une fois le point ci-dessus clarifié, ajouter
      `stockage-eliquides-batterie-vape` au maillage produit → guides
      (catégories `eliquide`/`ecig`/`pod`), sans dépasser la limite
      d'affichage effective.
- [ ] Mineur, non urgent : titres `alternatives-puffs-jetables` (69 car.)
      et `puffs-interdites-france-2025-2026` (77 car.) légèrement longs ;
      meta descriptions `categorySeo.js` `xros-cartouches` (131) et
      `puffs-jetables` (132) sous 140 — probablement volontaire pour des
      gammes nichées, à confirmer avant de toucher. À regrouper avec
      d'autres écarts similaires plutôt qu'un commit dédié.

## Technique

Audit complet refait le 2026-07-31 (le précédent datait du 07-28, avant
la fusion massive) : build (404 pages pré-rendues : 308 produits, 41
catégories, 35 articles, 20 pages statiques), `npm test` (186/186),
`node scripts/crawl-links.mjs` (0 lien cassé / 6970 vérifiés), longueurs
de titres/meta descriptions sur `blog.js`/`categorySeo.js`/
`staticSeoPages.js` — tous verts sauf les écarts listés ci-dessus. Refaire
un audit similaire dans ~1 semaine ou après un nouvel afflux de contenu
non tracé dans ce journal.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides, images, avis Google, refonte
      conversion/checkout...). Toujours revérifier chaque affirmation du
      backlog/journal directement dans le code sur `main` avant d'agir.
