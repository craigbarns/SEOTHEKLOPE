# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## 🚨 ALERTE PIPELINE — non résolue au 08-05, NE PAS reproduire le correctif mécaniquement

Chronologie complète : correctif committé le 08-01 (branche
`seo/2026-08-01`, commit `7bec44e`) → jamais mergé → reproduit le 08-03
sur une nouvelle branche → **absente du remote au 08-04** → reproduit une
3e fois le 08-04 sur `seo/2026-08-04` → **au 08-05, cette branche est
elle aussi absente du remote**, tout comme `seo/2026-08-03`
(`git ls-remote --heads origin | grep seo` : seules `seo/2026-08-01` et
`seo/2026-08-02` existent, toutes deux non mergées). Les mêmes 7
formulations non conformes (sevrage, arrêt du tabac) sont toujours en
ligne sur `main` au 08-05.

**Ce n'est plus un délai de fusion humaine** : c'est soit un échec de
push répété et spécifique aux runs 08-03/08-04 (jamais aux 08-01/08-02),
soit ces deux runs n'ont en réalité produit aucun commit malgré ce
qu'affirment leurs entrées de journal. Depuis ce contexte d'agent,
impossible d'aller plus loin : pas de `GH_TOKEN`/`gh auth`, donc pas
d'accès aux logs GitHub Actions ni à la liste des PR sur
`craigbarns/theklope`.

**Décision prise le 08-05 : ne plus reproduire ce correctif à chaque run.**
`seo/2026-08-01` et `seo/2026-08-02` portent déjà ce contenu exact, prêt à
fusionner sans conflit — une 4e/5e branche identique n'apporte aucune
valeur marginale et ne résout pas la cause racine. **Un humain doit
investiguer en priorité** :
1. Logs des jobs `seo-agent.yml` des 08-03 et 08-04 (étape « Livraison sur
   theklope », en particulier `git push origin "$BRANCH" --force`).
2. Pourquoi `seo/2026-08-01`/`seo/2026-08-02` restent ouvertes sans être
   ni mergées ni fermées après 4-5 jours alors qu'elles fusionneraient
   sans conflit.

**Prochain run : revérifier l'état du remote avant toute décision**
(`git ls-remote --heads origin | grep seo`, puis `grep -n "sevrage\|
arrêter de fumer" src/data/blog.js src/data/categorySeo.js` sur `main`).
Si `seo/2026-08-01`/`seo/2026-08-02` disparaissent aussi du remote, c'est
un signal encore plus fort qu'un humain doit agir sur le pipeline avant
tout nouveau run SEO — l'escalader de façon très visible plutôt que de
continuer à corriger un symptôme qui revient.

Point de vigilance permanent : `main` reçoit régulièrement du contenu
d'autres processus/agents sans passer par ce journal — refaire un
`grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus sain\|sans
danger"` sur `blog.js`/`categorySeo.js`/`staticSeoPages.js` après tout
nouvel afflux de contenu externe, même hors du rythme d'audit habituel.

## État réel sur `main` au 2026-08-05

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
- `src/data/productGuides.js` : `GUIDES_BY_CATEGORY.ecig` liste toujours
  **5 guides pour une limite d'affichage à 4** — reconfirmé le 08-05 (le
  5e, `erreurs-frequentes-debutant-vape`, reste invisible dans le bloc
  « Guides utiles » des fiches produit `ecig`).
- `src/data/blog.js` : **nouveau, repéré le 08-05** — les IDs produits
  `xros-4-mini-269` (8 occurrences dans `relatedProductIds`) et
  `pixo-aura-2-301` (2 occurrences) ne correspondent à aucun `id` réel
  dans `src/data/products.js`. Ne casse ni le build ni les tests
  (filtré silencieusement par `BlogPost.jsx`), mais prive ces guides
  d'un produit associé attendu. IDs réels de kits pods compacts utilisés
  à la place pour le nouveau guide du 08-05 :
  `argus-g2-mini-1500mah-voopoo-offre-groupee-1-1-279`, `q16-pro-146`.
- `src/data/staticSeoPages.js` : repéré en passant le 08-04 (non traité,
  hors sujet du jour) — la branche obsolète `seo/2026-08-01` contenait un
  changement de seuil de livraison gratuite 29€→49€ sur les pages
  `boutique-vape-marseille`/`cigarette-electronique-marseille` ; `main`
  est toujours à 29€. Pas une question GUARDRAILS, à confirmer avec le
  reste du site (prix réel appliqué) avant de toucher.

## Optimisations repérées

- [ ] `categorySeo.js` : `meilleures-ventes` toujours sous 140 caractères
      (117 au dernier contrôle) — allonger dans le même style que les
      autres catégories.
- [ ] `productGuides.js` : revérifier `GUIDES_BY_CATEGORY.ecig` vs.
      `limit` de `relatedGuidesForProduct()` (5 guides mappés pour une
      limite à 4, reconfirmé le 08-05) — soit retirer un guide, soit
      adapter le `limit` pour cette catégorie spécifiquement.
- [ ] IDs produits fantômes `xros-4-mini-269` / `pixo-aura-2-301` dans
      `blog.js` (voir ci-dessus, repéré le 08-05) — remplacer par des IDs
      réels dans les guides concernés.
- [ ] Une fois le point `GUIDES_BY_CATEGORY.ecig` clarifié, ajouter
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
- [ ] Rythme : contenu traité le 08-05 (guide voyage en avion,
      `voyager-avion-cigarette-electronique`) après un écart de 6 jours
      sans contenu long format (dernier avant : 07-30, les runs 08-01 à
      08-04 ayant été des audits/reproductions du correctif de
      conformité). Si les prochains runs reviennent sur de
      l'optimisation/audit, garder en tête le rythme indicatif
      ~3 jours/semaine de contenu.

## Technique

Audit complet le 2026-07-31 (build, tests, liens, longueurs
titres/meta) — voir JOURNAL pour le détail. Audit ciblé conformité
GUARDRAILS refait le 2026-08-01, 08-03 et 08-04 (voir alerte pipeline en
tête de ce fichier — le correctif ne tient pas sur `main`). Refaire un
audit technique complet (pas seulement conformité) dans ~1 semaine ou
après un nouvel afflux de contenu non tracé dans ce journal.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides en batch, images, avis Google,
      redirections, refonte balises produit + cron CRM...). Toujours
      revérifier chaque affirmation du backlog/journal directement dans
      le code sur `main` avant d'agir, **y compris la conformité
      GUARDRAILS** du contenu ajouté par ces autres processus.
- [ ] Voir l'alerte pipeline en tête de ce fichier (mise à jour le
      08-05) : `seo/2026-08-03` et `seo/2026-08-04` n'existent pas sur le
      remote, `seo/2026-08-01`/`seo/2026-08-02` existent mais ne sont pas
      mergées. Ne pas reproduire le correctif de conformité à chaque run
      tant qu'un humain n'a pas investigué — revérifier l'état du remote
      au prochain run avant toute décision.
