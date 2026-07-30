# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## ⚠️ Blocage de livraison — priorité absolue (constat du 2026-07-29, aggravé le 2026-07-30)

`agent-repo/.github/workflows/seo-agent.yml` a toujours `DELIVERY_MODE: pr`
(revérifié le 07-30, non corrigé — décision humaine, pas de l'agent).
Premier run le 2026-07-21 (PR #23, mergée) : depuis, **aucune** des 8
branches `seo/2026-07-22` à `seo/2026-07-29` n'a été mergée sur `main`
(vérifié le 07-30 via `git merge-base --is-ancestor` sur chacune — toutes
`NOT merged`).

**Aggravation constatée le 2026-07-30** : ces 8 branches sont maintenant
basées sur un `main` très ancien (avant les refontes checkout/CRO
mergées entre-temps par un autre processus — PR #36-#44). Un
`git diff origin/main origin/seo/2026-07-2X --stat` sur chacune fait
apparaître des dizaines de fichiers sans rapport avec le SEO
(`api/`, `supabase/`, `src/lib/pricing.js`, `src/pages/Checkout.jsx`...)
en sens inverse. Elles ne sont donc plus de simples PR « en attente de
review » : elles sont **structurellement obsolètes** et ne pourront plus
être mergées proprement sans résolution manuelle massive de conflits
sans rapport avec le SEO.

Une entrée de journal marquée « fait » signifie seulement que l'agent a
commité dans son clone local ce jour-là, pas que le contenu est mergé sur
`main` — toujours vérifier `git merge-base --is-ancestor
origin/seo/<date> origin/main` (ou grep le contenu attendu directement
dans le fichier sur `main`) avant de supposer qu'un ancien run a atteint
la prod.

Action attendue d'un humain : fermer les 8 PR en attente sur
`craigbarns/theklope` (elles ne sont plus mergeables telles quelles),
juger au cas par cas si leur contenu SEO mérite d'être recréé
manuellement sur `main` actuel, et/ou repasser `DELIVERY_MODE` à `push`
dans le workflow pour que les prochains runs arrivent directement en
prod. Pas une action que l'agent doit prendre seul (gestion de PR et
pipeline de livraison vers la prod d'un site e-commerce).

Tant que ce n'est pas résolu : ne pas refaire un correctif déjà tenté sur
une branche en attente (voir « État réel sur `main` » ci-dessous) — soit
attendre la décision humaine, soit (comme le 07-30) choisir une tâche de
contenu neuve qui ne duplique rien.

## État réel sur `main` au 2026-07-30 (à ne pas reperdre de vue)

- `src/data/categorySeo.js` : meta descriptions `nouveautes` (135
  caractères) et `meilleures-ventes` (117 caractères) **toujours sous la
  fourchette 140-160 sur `main`** — corrigées 2 fois (07-24, 07-28) mais
  sur des branches maintenant obsolètes (voir blocage ci-dessus). Ne pas
  retenter tant que le blocage n'est pas résolu.
- `src/data/blog.js` : 22 guides sur `main` depuis le 2026-07-30 (nouveau
  guide `entretenir-kit-classique-box`, voir JOURNAL). Toujours aucun
  `getRelatedPosts`/maillage guide↔guide (07-22), aucun maillage
  guide↔page statique (07-26/07-27), et le guide
  `stockage-eliquides-batterie-vape` (proposé 07-25) n'a pas été recréé.
- `src/data/productGuides.js` : `relatedGuidesForProduct` tronque
  toujours à `limit=3` alors que `ecig` a 4 guides mappés (le correctif
  limit=4 du 07-29 n'a jamais été mergé, revérifié le 07-30). Le nouveau
  guide `entretenir-kit-classique-box` n'a volontairement pas été ajouté
  au maillage produit → guides pour cette raison (voir JOURNAL
  2026-07-30) — l'ajouter à `ecig` sans corriger `limit` le rendrait
  invisible.

## Pages de contenu à créer

Note (2026-07-22) : plusieurs idées de contenu de ce backlog étaient déjà
couvertes par des articles existants dans `src/data/blog.js` : « pod ou
kit débutant » ≈ `quelle-cigarette-electronique-choisir`, « taux de
nicotine » = `choisir-taux-nicotine-e-liquide`, « glossaire » =
`lexique-vape`, « entretien pods » = `entretenir-pod-rechargeable`,
« entretien kit classique/box » = `entretenir-kit-classique-box` (ajouté
le 2026-07-30). Vérifier `src/data/blog.js` avant de proposer un nouveau
guide pour éviter le doublon.

- [ ] Guide sur le stockage des e-liquides et de la batterie (chaleur,
      lumière, charge USB-C, pause d'utilisation) — proposé le 07-25 mais
      jamais mergé (branche obsolète). Aucun guide équivalent sur `main`
      au 07-30 : toujours une piste de contenu valable.

## Optimisations repérées

- [ ] Maillage interne `conformite-vape` ↔ `reglementation-vape-france` et
      `cigarette-electronique-marseille` ↔ `quelle-cigarette-electronique-choisir`
      — codé le 2026-07-27 mais sur une branche maintenant obsolète, donc
      toujours absent de `main`. Rappel technique conservé pour référence
      future : les pages `staticSeoPages.js` rendent
      `sections[].text`/`faq[].a` en texte échappé (pas de HTML possible
      côté page statique) — seul le sens guide → page statique est
      possible via HTML inline, le sens page statique → guide passe par
      le `links` array existant (`{ to, label }`).
- [ ] `productGuides.js` : repasser `limit` de 3 à 4 dans
      `relatedGuidesForProduct` (voir « État réel sur `main` »
      ci-dessus) — petit correctif déjà qualifié, à faire lors d'un
      prochain run d'optimisation une fois le blocage de livraison
      clarifié.
- [ ] Une fois le guide stockage e-liquides/batterie recréé, envisager de
      l'ajouter au maillage produit → guides (`productGuides.js`,
      catégories `eliquide`/`ecig`/`pod`) — attention à la limite
      d'affichage (voir point ci-dessus), ne pas l'ajouter en 5e position
      d'une catégorie qui en a déjà 4.
- [ ] Meta descriptions `nouveautes` et `meilleures-ventes` sous 140
      caractères — voir « État réel sur `main` » ci-dessus. Ne pas
      retenter tant que le blocage de livraison n'est pas résolu.
- [ ] Mineur, non urgent : meta description `cigarette-electronique-marseille`
      à 161 caractères (1 au-dessus du max 160) ; titres de guides
      `alternatives-puffs-jetables` (69) et `autonomie-cigarette-electronique`
      (67) légèrement longs. À regrouper avec d'autres écarts similaires
      plutôt qu'un commit dédié pour si peu.

## Technique

Vérifié le 2026-07-28 (audit) : sitemap (`generate-sitemap.mjs` +
`sitemap-data.mjs`), `robots.txt`, canoniques (`Seo.jsx`), JSON-LD,
liens internes (`crawl-links.mjs`), longueurs de titres/meta descriptions
sur `blog.js`, `categorySeo.js`, `staticSeoPages.js` — un seul écart
significatif trouvé (meta descriptions `nouveautes`/`meilleures-ventes`,
toujours pas sur `main`, voir plus haut). Build, `npm test` et
`crawl-links.mjs` verts au 2026-07-30 (360 pages pré-rendues, 22
articles, 180/180 tests, 0 lien cassé / 4601 vérifiés). Refaire un audit
similaire dans ~1 semaine ou après publication de contenus importants —
et une fois le blocage de livraison résolu, réaudité l'écart entre ce que
le journal décrit comme « fait » et ce qui est réellement sur `main`.

## À vérifier

- [ ] Voir le blocage de livraison en tête de ce fichier — statut au
      2026-07-30 : 8 branches (`seo/2026-07-22` à `seo/2026-07-29`)
      toujours pas mergées sur `main` et désormais structurellement
      obsolètes (basées sur un `main` très ancien). `DELIVERY_MODE`
      toujours `pr`.
- [ ] `main` contient des PR non tracées dans ce journal (schéma local,
      IndexNow, maillage produit→guides, guide backlinks, harmonisation
      du nom de marque, refonte conversion/checkout, réécriture de
      meta/H1 homepage et JSON-LD par un autre agent le 07-29…) —
      probablement un autre processus/agent sur ce repo partagé. Bien
      re-vérifier chaque affirmation du backlog/journal directement dans
      le code sur `origin/main` avant d'agir, ne jamais la prendre pour
      acquise.
