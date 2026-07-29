# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## ⚠️ Blocage de livraison — priorité absolue (constat du 2026-07-29)

`agent-repo/.github/workflows/seo-agent.yml` a `DELIVERY_MODE: pr` avec un
commentaire indiquant de passer à `push` après une période d'essai de 3
jours. Premier run le 2026-07-21 (PR #23, mergée) : depuis, **aucune**
des 7 branches `seo/2026-07-22` à `seo/2026-07-28` n'a été mergée sur
`main` (vérifié le 07-29 via `git merge-base --is-ancestor` sur chacune —
toutes `NOT merged`), alors que la période d'essai est dépassée depuis
longtemps. Conséquence : tout le contenu/maillage produit par 7 runs
consécutifs (guides, maillage interne, meta descriptions) est invisible
sur le site en ligne, malgré des entrées de journal qui les décrivaient
parfois comme « fait » — **une entrée de journal marquée [x]/« fait »
signifie seulement que l'agent a commité dans son clone local ce
jour-là, pas que le contenu est mergé sur `main`.** Toujours vérifier
`git merge-base --is-ancestor origin/seo/<date> origin/main` (ou
grep directement le contenu attendu dans le fichier sur `main`) avant de
supposer qu'un ancien run a atteint la prod.

Action attendue d'un humain : fusionner/fermer les 7 PR en attente sur
`craigbarns/theklope`, et/ou repasser `DELIVERY_MODE` à `push` dans le
workflow si la qualité des runs passés est jugée suffisante. Pas une
action que l'agent doit prendre seul (changement de pipeline de livraison
vers la prod d'un site e-commerce).

Tant que ce n'est pas résolu : éviter de refaire un correctif déjà
tenté sur une branche en attente (voir liste ci-dessous), pour ne pas
accumuler des PR redondantes qui entreront en conflit entre elles à la
fusion.

## État réel sur `main` au 2026-07-29 (à ne pas reperdre de vue)

- `src/data/categorySeo.js` : meta descriptions `nouveautes` (135
  caractères) et `meilleures-ventes` (117 caractères) **toujours sous la
  fourchette 140-160 sur `main`** — corrigées 2 fois (07-24, 07-28) mais
  sur des branches jamais mergées. Ne pas retenter un 3e correctif tant
  que le blocage ci-dessus n'est pas résolu (conflit trivial garanti avec
  2 branches existantes sur les mêmes lignes).
- `src/data/blog.js` : toujours 21 guides sur `main` (aucun des guides
  « entretenir-kit-classique-box » ou « stockage-eliquides-batterie-vape »
  proposés en 07-23/07-25, aucun `getRelatedPosts`/maillage guide↔guide
  de 07-22, aucun maillage guide↔page statique de 07-26/07-27).
- `src/data/productGuides.js` : **corrigé le 2026-07-29** (ce run) —
  `relatedGuidesForProduct` tronquait à 3 guides alors que 3 catégories
  (`eliquide`, `ecig`, `resistance`) en ont 4 mappés ; `limit` passé à 4
  (voir JOURNAL). Ce correctif est un commit direct sur `main` dans mon
  clone local (comme d'habitude, poussé ensuite par le workflow) — à
  reconfirmer une fois le blocage de livraison résolu.

## Pages de contenu à créer

Note (2026-07-22) : plusieurs idées de contenu de ce backlog étaient déjà
couvertes par des articles existants dans `src/data/blog.js` (20 guides déjà
publiés) : « pod ou kit débutant » ≈ `quelle-cigarette-electronique-choisir`,
« taux de nicotine » = `choisir-taux-nicotine-e-liquide`, « glossaire » =
`lexique-vape`, « entretien » (pods) = `entretenir-pod-rechargeable`. Elles
ont été retirées. Vérifier `src/data/blog.js` avant de proposer un nouveau
guide pour éviter le doublon.

## Optimisations repérées

- [ ] Maillage interne `conformite-vape` ↔ `reglementation-vape-france` et
      `cigarette-electronique-marseille` ↔ `quelle-cigarette-electronique-choisir`
      — codé le 2026-07-27 mais **toujours sur la branche `seo/2026-07-27`
      non mergée**, donc absent de `main`. Rappel technique conservé pour
      référence future : les pages `staticSeoPages.js` rendent
      `sections[].text`/`faq[].a` en texte échappé (pas de HTML possible
      côté page statique) — seul le sens guide → page statique est
      possible via HTML inline, le sens page statique → guide passe par
      le `links` array existant (`{ to, label }`).
- [ ] Ajouter le nouveau guide `stockage-eliquides-batterie-vape`
      (2026-07-25, toujours sur la branche `seo/2026-07-25` non mergée) au
      maillage produit → guides (`productGuides.js`, catégories
      `eliquide`/`ecig`/`pod`) une fois cette branche mergée sur `main` —
      attention à la limite d'affichage (`relatedGuidesForProduct`,
      limit=4 depuis le 2026-07-29) : ne pas l'ajouter en 5e position
      d'une catégorie qui en a déjà 4, sinon il ne s'affichera jamais.
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
`sitemap-data.mjs`), `robots.txt`, canoniques (`Seo.jsx`), JSON-LD (359
pages pré-rendues), `node scripts/crawl-links.mjs` (0 lien cassé / 4592
vérifiés), longueurs de titres/meta descriptions sur `blog.js`,
`categorySeo.js`, `staticSeoPages.js` — un seul écart significatif trouvé
(meta descriptions `nouveautes`/`meilleures-ventes`, toujours pas sur
`main`, voir plus haut). Build et `npm test` verts (169/169 au
2026-07-29, `crawl-links.mjs` 4874 liens vérifiés). Refaire un audit
similaire dans ~1 semaine ou après publication de contenus importants —
et une fois le blocage de livraison résolu, réaudité l'écart entre ce que
le journal décrit comme « fait » et ce qui est réellement sur `main`.

## À vérifier

- [ ] Voir le blocage de livraison en tête de ce fichier — statut au
      2026-07-29 : 7 branches (`seo/2026-07-22` à `seo/2026-07-28`)
      toujours pas mergées sur `main`, cause probable identifiée
      (`DELIVERY_MODE: pr` dans le workflow, période d'essai dépassée).
- [ ] `main` contient des PR (#25 à #42) non tracées dans ce journal
      (schéma local, IndexNow, maillage produit→guides, guide backlinks,
      harmonisation du nom de marque, refonte conversion/checkout…) —
      probablement un autre processus/agent sur ce repo partagé. Bien
      re-vérifier chaque affirmation du backlog/journal directement dans
      le code sur `origin/main` avant d'agir, ne jamais la prendre pour
      acquise.
