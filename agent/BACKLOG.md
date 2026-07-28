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
- [x] Meta descriptions `nouveautes` et `meilleures-ventes` sous 140
      caractères — **fait le 2026-07-28** directement sur `main` (audit
      technique), sans attendre la branche `seo/2026-07-24` qui portait le
      même correctif mais restait bloquée.
- [ ] Mineur, non urgent : meta description `cigarette-electronique-marseille`
      à 161 caractères (1 au-dessus du max 160) ; titres de guides
      `alternatives-puffs-jetables` (69) et `autonomie-cigarette-electronique`
      (67) légèrement longs. À regrouper avec d'autres écarts similaires
      plutôt qu'un commit dédié pour si peu.

## Technique

Vérifié le 2026-07-28 (audit) : sitemap (`generate-sitemap.mjs` +
`sitemap-data.mjs`), `robots.txt`, canoniques (`Seo.jsx`), JSON-LD (359
pages pré-rendues), `node scripts/crawl-links.mjs` (0 lien cassé / 4592
vérifiés), longueurs de titres/meta descriptions sur `blog.js`,
`categorySeo.js`, `staticSeoPages.js` — tout vérifié, un seul écart
significatif trouvé et corrigé (voir JOURNAL). Build et `npm test`
(144/144) verts. Refaire un audit similaire dans ~1 semaine ou après
publication de contenus importants.

## À vérifier

- [ ] Les branches `seo/2026-07-22` à `seo/2026-07-27` (6 branches)
      existent sur le remote mais sont **toujours pas mergées sur `main`
      au 2026-07-28** — confirmé que `main` est resté à `9e0db8d` (aucun
      changement depuis le run du 07-27). Vérifier leur statut avant de
      refaire du travail sur ces sujets (pas de doublon) : maillage
      guide↔guide `getRelatedPosts` (07-22), guide entretien kit
      classique/box (07-23), meta descriptions `categorySeo.js` (07-24 —
      **le même correctif a été refait directement sur `main` le
      2026-07-28**, donc si cette branche est mergée un jour, un conflit
      trivial est possible sur ces 2 lignes), guide stockage
      e-liquides/batteries (07-25), maillage boutique-marseille/
      livraison-retours ↔ guides (07-26), maillage conformite-vape/
      cigarette-electronique-marseille ↔ guides (07-27). Le blocage dure
      depuis plus d'une semaine sur 6 branches distinctes : si la
      situation persiste encore après plusieurs runs, envisager de
      signaler explicitement le problème plutôt que de continuer à
      contourner au cas par cas.
- [ ] `main` contient des PR (#25 à #35) non tracées dans ce journal
      (schéma local, IndexNow, maillage produit→guides, guide backlinks,
      harmonisation du nom de marque…) — probablement un autre
      processus/agent sur ce repo partagé. Constat concret le 2026-07-26 :
      le backlog du 2026-07-25 affirmait que `cigarette-electronique-marseille`
      n'avait aucun lien vers un guide, ce qui était déjà faux au moment de
      vérifier — donc bien re-vérifier chaque affirmation du backlog dans
      le code avant d'agir, ne pas la prendre pour acquise
