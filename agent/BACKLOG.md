# BACKLOG — idées et opportunités

L'agent pioche ici et y ajoute ce qu'il repère. Retirer une ligne quand
elle est traitée (la déplacer dans le JOURNAL).

## 🚨 ALERTE PIPELINE — cause racine trouvée le 08-06, action humaine requise

**Ce n'est pas un bug technique : c'est un goulot de revue humaine.**
`craigbarns/theklope` est public, donc l'API REST GitHub est consultable
sans jeton (`curl https://api.github.com/repos/craigbarns/theklope/pulls?state=all`).
Elle montre que `agent-repo/.github/workflows/seo-agent.yml` tourne en
`DELIVERY_MODE: pr` (mode par défaut, jamais basculé en `push` malgré le
commentaire « après la période d'essai de 3 jours ») : chaque run crée une
PR qui attend une fusion humaine, sans auto-merge. Dernier merge groupé
humain : **2026-07-30T18:33:20Z** (PR #24, #38-#41, #43, #45, #11) — rien
depuis. Résultat : PR **#46** (`seo/2026-07-31`), **#47**
(`seo/2026-08-01`, contient le correctif de conformité sevrage/arrêt du
tabac), **#48** (`seo/2026-08-02`) et **#50** (`seo/2026-08-05`) sont
toutes **ouvertes** et toutes `mergeable: true` / `mergeable_state: clean`
(aucun conflit) — prêtes à fusionner d'un clic sur
`github.com/craigbarns/theklope/pull/47` (et 46/48/50).

**Action attendue d'un humain, priorité absolue** : fusionner la PR #47
pour corriger l'écart GUARDRAILS en ligne depuis le 08-01. Fusionner aussi
#46/#48/#50 (contenu SEO légitime en attente). Ensuite, décider en
connaissance de cause : garder `DELIVERY_MODE: pr` avec une cadence de
revue régulière, ou repasser à `push` si les vérifications automatiques
(build/tests/liens, toutes vertes à chaque run) sont jugées suffisantes.

**Anomalie distincte, encore non expliquée** : aucune PR/branche n'existe
pour `seo/2026-08-03` et `08-04` (contrairement aux autres jours qui ont
bien produit une PR, juste non fusionnée). Pas de piste solide depuis ce
contexte agent (pas d'accès aux logs GitHub Actions) — à corréler avec les
logs des runs de ces deux jours si un humain y a accès.

**Prochain run** : si la PR #47 (ou une autre PR de conformité) est
toujours ouverte, ne pas la reproduire une nouvelle fois — le contenu est
déjà prêt. Revérifier simplement l'état (`grep` conformité sur `main`,
liste des PR ouvertes) et continuer de le documenter tant que ce n'est pas
fusionné.

Point de vigilance permanent : `main` reçoit régulièrement du contenu
d'autres processus/agents sans passer par ce journal — refaire un
`grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus sain\|sans
danger"` sur `blog.js`/`categorySeo.js`/`staticSeoPages.js` après tout
nouvel afflux de contenu externe, même hors du rythme d'audit habituel.

## État réel sur `main` au 2026-08-06

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
- `src/data/blog.js` : IDs produits fantômes `xros-4-mini-269` /
  `pixo-aura-2-301` (repérés le 08-05) **corrigés le 08-06** — remplacés
  par `q16-pro-146` / `pocke-x-144` dans les 10 occurrences concernées.
  Traité, ne plus reprendre sauf nouvelle régression constatée par
  `grep -n "xros-4-mini-269\|pixo-aura-2-301" src/data/blog.js`.
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
- [ ] Contenu, repéré le 08-06 en corrigeant les IDs fantômes ci-dessus :
      le guide `xros-5-vs-xros-pro-comparatif` compare des produits
      Vaporesso XROS absents du catalogue THEKLOPE (aucun `id` contenant
      « xros » dans `products.js`) — à revoir dans un futur passage
      contenu (comparaison de pods réellement en catalogue, ou
      dépublication).
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
GUARDRAILS refait le 2026-08-01, 08-03, 08-04 et 08-05 (voir alerte
pipeline en tête de ce fichier — le correctif attend une fusion humaine
dans la PR #47, ce n'est plus un mystère technique depuis le 08-06).
Refaire un audit technique complet (pas seulement conformité) dans
~1 semaine ou après un nouvel afflux de contenu non tracé dans ce
journal.

## À vérifier

- [ ] `main` reçoit régulièrement des commits d'autres processus/agents
      non tracés dans ce journal (guides en batch, images, avis Google,
      redirections, refonte balises produit + cron CRM...). Toujours
      revérifier chaque affirmation du backlog/journal directement dans
      le code sur `main` avant d'agir, **y compris la conformité
      GUARDRAILS** du contenu ajouté par ces autres processus.
- [ ] Voir l'alerte pipeline en tête de ce fichier (mise à jour le
      08-06) : la cause racine est identifiée (revue humaine des PR, pas
      un bug de push) et la PR #47 est prête à fusionner. Ne pas
      reproduire le correctif de conformité tant qu'elle est ouverte —
      revérifier son état (fusionnée ou toujours ouverte) au prochain
      run avant toute décision.
