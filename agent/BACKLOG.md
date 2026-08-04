# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## 🚨 ALERTE PIPELINE — un correctif de conformité disparaît deux fois de suite

Chronologie : correctif committé le 08-01 (branche `seo/2026-08-01`,
commit `7bec44e`) → jamais mergé → reproduit le 08-03 directement sur une
nouvelle branche `seo/2026-08-03` → **au 08-04, cette branche n'existe
plus sur le remote** (`git branch -a` : absente) et les mêmes 7
formulations non conformes étaient de retour sur `main`. Reproduit une
3e fois le 08-04 sur `seo/2026-08-04` (voir JOURNAL).

**Ce n'est plus un simple délai de fusion humaine** (pattern habituel
1-8 jours observé sur ce repo depuis fin juillet) : c'est un correctif
qui **disparaît entièrement** après avoir été committé et soi-disant
vérifié vert. Deux hypothèses non tranchées depuis ce contexte : échec
de push spécifique à certains runs, ou branche supprimée après un
merge qui n'aurait pourtant pas appliqué son contenu à `main`.

**Prochain run : vérifier d'abord si `seo/2026-08-04` (ou son contenu)
est bien sur `main`** (`grep -n "sevrage\|arrêter de fumer"
src/data/blog.js src/data/categorySeo.js`). Si les mêmes 7 occurrences
sont de nouveau là, **ne pas reproduire mécaniquement une 4e fois** —
consigner l'alerte de façon très visible et suggérer à un humain
d'investiguer le pipeline (`agent-repo/.github/workflows/seo-agent.yml`,
logs CI des runs 08-01/08-03/08-04) plutôt que de continuer à corriger
un symptôme qui revient.

Point de vigilance permanent : `main` reçoit régulièrement du contenu
d'autres processus/agents sans passer par ce journal — refaire un
`grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus sain\|sans
danger"` sur `blog.js`/`categorySeo.js`/`staticSeoPages.js` après tout
nouvel afflux de contenu externe, même hors du rythme d'audit habituel.

## État réel sur `main` au 2026-08-04

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
- [ ] Suivre le sort de la branche `seo/2026-08-04` (3e reproduction du
      correctif GUARDRAILS) — voir alerte pipeline en tête de ce fichier.
      Si elle disparaît aussi, escalader vers un humain plutôt que de
      reproduire une 4e fois.
