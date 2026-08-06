# JOURNAL de l'agent SEO

Mémoire persistante. Le run du jour AJOUTE une entrée en HAUT de la liste
(sous cette introduction), au format ci-dessous. Ne jamais réécrire les
entrées passées.

## Format d'entrée

### AAAA-MM-JJ — [type : contenu | optimisation | audit]
- **Fait** : description concise de la modification livrée
- **Pourquoi** : donnée GSC ou raisonnement qui a motivé le choix
- **Fichiers** : liste des fichiers touchés dans theklope
- **Suite** : ce que le prochain run devrait envisager

### 2026-08-06 — [type : optimisation]
- **🔎 Cause racine de l'alerte pipeline enfin identifiée — ce n'est pas un
  bug de push, c'est un blocage de revue humaine** : avant de choisir une
  tâche, revérifié l'état du remote (`git ls-remote --heads origin | grep
  seo` : `seo/2026-08-01`, `02` et `05` toujours présentes, `03`/`04`
  toujours absentes — inchangé depuis le 08-05) et la conformité sur
  `main` (`grep` sevrage/arrêter de fumer sur `blog.js`/`categorySeo.js` :
  toujours les 7 mêmes occurrences). Nouveauté : `craigbarns/theklope`
  étant public, l'API REST GitHub est accessible **sans authentification**
  (`curl https://api.github.com/repos/craigbarns/theklope/pulls?state=all`)
  — jusqu'ici aucun run n'avait essayé cette voie faute de `gh auth`. Deux
  découvertes majeures :
  1. `agent-repo/.github/workflows/seo-agent.yml` a `DELIVERY_MODE: pr`
     (mode par défaut), avec le commentaire « Passer à "push" ici après la
     période d'essai de 3 jours » — jamais fait. En mode `pr`, chaque run
     crée une PR qui **attend une fusion humaine**, il n'y a aucun
     mécanisme d'auto-merge. Ce n'était donc pas un push cassé mais un
     goulot d'étranglement de revue.
  2. La liste des PR (`.../pulls?state=all`) montre un **merge groupé
     humain le 2026-07-30T18:33:20Z** (PR #24, #38–#41, #43, #45, #11) —
     et plus aucune fusion depuis. Les PR #46 (`seo/2026-07-31`), #47
     (`seo/2026-08-01`, contient le correctif de conformité), #48
     (`seo/2026-08-02`) et #50 (`seo/2026-08-05`) sont **toutes ouvertes**,
     et toutes affichent `mergeable: true` / `mergeable_state: clean`
     (vérifié via `GET /repos/craigbarns/theklope/pulls/{46,47,48,50}`) —
     donc **aucun conflit, prêtes à fusionner d'un clic**. Aucune PR
     n'existe pour `seo/2026-08-03`/`08-04` (anomalie distincte : ces
     jours-là le run n'a produit ni branche ni PR — cause encore inconnue,
     mais sans rapport avec le mécanisme de push/merge lui-même).
  - **Conclusion actionnable pour un humain** : fusionner la PR #47
    (https://github.com/craigbarns/theklope/pull/47) résout l'écart
    GUARDRAILS immédiatement, sans nouveau travail de l'agent — le
    correctif y est déjà, vert, sans conflit. Fusionner aussi #46/#48/#50
    au passage (contenu SEO légitime en attente). Décision indépendante à
    prendre par l'humain : garder le mode `pr` (revue systématique) et
    mettre en place une cadence de fusion régulière, ou repasser
    `DELIVERY_MODE` à `push` si la confiance dans les vérifications
    automatiques (build/tests/liens) est jugée suffisante.
  - Conformément à la décision du 08-05, **je n'ai pas recommis le
    correctif de conformité une 5e fois** : il est déjà prêt et vert dans
    la PR #47, une nouvelle branche identique n'apporterait rien.
- **Fait** : à la place, traité un point d'optimisation du backlog repéré
  le 08-05 : dans `src/data/blog.js`, remplacé les IDs produits fantômes
  `xros-4-mini-269` (8 occurrences dans `relatedProductIds`, sur 8 guides)
  et `pixo-aura-2-301` (2 occurrences) — aucun des deux ne correspond à un
  `id` réel de `src/data/products.js`, ils étaient filtrés silencieusement
  par `BlogPost.jsx`, privant ces guides de leur maillage produit associé.
  Remplacés uniformément par deux kits pods compacts réels et en stock :
  `q16-pro-146` (Q16 PRO Justfog, 39,90€, stock 113) et `pocke-x-144`
  (POCKE X, 39,90€, stock 120), cohérents avec le profil « pod compact/
  débutant » évoqué dans ces guides (y compris `xros-5-vs-xros-pro-
  comparatif`, qui reste par ailleurs un guide comparant des produits
  Vaporesso XROS non vendus par la boutique — problème de fond distinct,
  déjà repéré, non traité aujourd'hui, voir Suite).
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Point de maillage
  interne cassé identifié et documenté le 08-05 (priorité 2 de la
  mission : optimisation catégories/produits, maillage interne), non
  traité ce jour-là faute de temps sur un seul sujet par run.
- **Fichiers** : `src/data/blog.js`, `public/llms-full.txt` (régénéré par
  le build)
- **Vérifié** : `npm ci`, `npm run build` (408 pages pré-rendues : 308
  produits, 45 catégories, 35 articles, 20 pages statiques), `npm test`
  (197/197), `node scripts/crawl-links.mjs` (0 lien cassé / 7830
  vérifiés) — tous verts.
- **Suite** :
  1. **Priorité pour un humain** : fusionner la PR #47 (correctif de
     conformité, clean/mergeable) — et idéalement #46/#48/#50 — sur
     `github.com/craigbarns/theklope`. Une fois fait, revérifier au
     prochain run avec le `grep` habituel que `main` est bien conforme.
  2. Anomalie distincte à surveiller : pourquoi `seo/2026-08-03` et
     `08-04` n'ont produit aucune branche/PR (contrairement au simple
     goulot de revue humaine qui explique 07-31/08-01/08-02/08-05) —
     pas d'hypothèse solide depuis ce contexte agent, à corréler avec les
     logs du run GitHub Actions de ces deux jours si un humain y a accès.
  3. Contenu, non traité aujourd'hui : le guide `xros-5-vs-xros-pro-
     comparatif` compare des produits Vaporesso XROS qui ne sont pas au
     catalogue THEKLOPE (aucun `id` contenant « xros » dans
     `products.js`) — au-delà du simple lien produit cassé corrigé
     aujourd'hui, le contenu lui-même promet une comparaison de produits
     non vendus en boutique ; à revoir dans un futur passage contenu
     (remplacer par une comparaison de pods réellement en catalogue, ou
     dépublier).
  4. Items backlog non revérifiés aujourd'hui (un seul sujet par run) :
     `categorySeo.js` `meilleures-ventes` (117 caractères au dernier
     contrôle), `productGuides.js` `GUIDES_BY_CATEGORY.ecig` (5 guides
     pour un `limit` par défaut de 4), titre/meta
     `quelle-cigarette-electronique-choisir`.

---

### 2026-08-05 — [type : contenu]
- **⚠️ Alerte pipeline confirmée et aggravée, correctif de conformité NON
  reproduit aujourd'hui (décision volontaire)** : avant de choisir une
  tâche, vérifié comme demandé par la Suite du 08-04 si le correctif de
  conformité (sevrage/arrêt du tabac) avait atteint `main`. Résultat :
  non — `grep -n "sevrage\|arrêter de fumer\|nocivité\|moins nocif\|plus
  sain\|sans danger" src/data/blog.js src/data/categorySeo.js` sur `main`
  (`879bdf6`) remonte les mêmes 7 occurrences non conformes qu'au 08-01.
  Plus grave : `git ls-remote --heads origin | grep seo` montre que les
  branches `seo/2026-08-01` et `seo/2026-08-02` existent bien sur le
  remote (contenu identique, non mergées), mais **`seo/2026-08-03` et
  `seo/2026-08-04` n'existent pas du tout** — pas seulement « non
  mergées », elles n'ont **jamais été poussées**, alors que le journal
  de ces deux jours affirme un commit local vérifié vert. Vérifié aussi
  `git merge-base --is-ancestor 7bec44e HEAD` → NO. Confirmé également
  qu'aucun jeton (`gh auth status`, `env | grep -i token`) n'est
  disponible dans ce contexte pour consulter les logs GitHub Actions ou
  lister les PR ouvertes sur `craigbarns/theklope` — impossible d'aller
  plus loin dans le diagnostic depuis l'agent. Conformément à
  l'instruction explicite laissée le 08-04 (« ne pas reproduire ce
  correctif une 4e fois sans investigation humaine du pipeline » si le
  même sort se reproduit), **je n'ai pas recommis ce correctif
  aujourd'hui** : une 3e/4e branche identique (`seo/2026-08-01` et
  `seo/2026-08-02` portent déjà ce contenu, prêt à fusionner sans
  conflit) n'apporterait aucune valeur marginale et ne résoudrait pas la
  cause racine. **Un humain doit investiguer en priorité** : (1) les
  logs des jobs `seo-agent.yml` des 08-03 et 08-04 (étape « Livraison sur
  theklope », `git push origin "$BRANCH" --force` — voir si le push a
  échoué ou n'a jamais été atteint), (2) pourquoi `seo/2026-08-01` et
  `seo/2026-08-02` restent ouvertes sans être mergées ni fermées après
  plusieurs jours. Le correctif à mergerait ces deux branches suffirait à
  résoudre l'écart GUARDRAILS sans nouveau travail de contenu.
- **Fait** : dans ce contexte (correctif de conformité volontairement non
  repris, voir ci-dessus), traité une tâche différente pour respecter la
  règle « une tâche par run » et le rythme de la mission : nouveau guide
  « Voyager en avion avec sa cigarette électronique : les règles à
  connaître » (`voyager-avion-cigarette-electronique`, catégorie
  Réglementation) : rangement cabine/soute des batteries lithium, règle
  des liquides à 100 ml en cabine et purge du réservoir avant le vol,
  rappel de vérifier la réglementation du pays de destination. FAQ (3
  questions) + 2 produits associés (kits pods compacts Argus G2 Mini et
  Q16 PRO). Contenu factuel et réglementaire, aucune promesse de santé ni
  ton publicitaire, conforme GUARDRAILS.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Aucun contenu long
  format traité depuis le 2026-07-30 (6 jours, les runs 08-01 à 08-04
  ayant tous été des audits/reproductions du correctif de conformité) —
  écart avec le rythme indicatif ~3 jours/semaine de contenu (priorité 1
  de la mission). Sujet choisi après vérification qu'aucun des 36 guides
  existants ne traitait le voyage en avion (`grep -n "slug:"
  src/data/blog.js`) ; recherche longue traîne pertinente et non couverte
  (règles bagages/batteries/liquides), dans la continuité éditoriale des
  guides pratiques déjà en ligne.
- **Repéré en cours de route, non traité aujourd'hui** : en cherchant des
  IDs produits valides pour le maillage du nouveau guide, découvert que
  `xros-4-mini-269` (8 occurrences dans `relatedProductIds` de
  `blog.js`) et `pixo-aura-2-301` (2 occurrences) ne correspondent à
  **aucun `id` réel** dans `src/data/products.js` (`grep -n "xros-4-mini\|
  pixo-aura-2" src/data/products.js` → rien). Ces références cassées ne
  cassent ni le build ni les tests (le composant `BlogPost.jsx` filtre
  silencieusement les IDs introuvables), mais privent 8 guides d'un
  produit associé sur 2 ou 3 attendus — utilisé `argus-g2-mini-1500mah-
  voopoo-offre-groupee-1-1-279` et `q16-pro-146` (IDs vérifiés existants)
  pour le nouveau guide. À corriger dans un futur run d'optimisation
  (remplacer ces 2 IDs fantômes par de vrais IDs de kits pods compacts
  dans les 8+2 guides concernés).
- **Fichiers** : `src/data/blog.js`, `public/llms-full.txt` (régénéré par
  le build)
- **Vérifié** : `npm ci`, `npm run build` (409 pages pré-rendues : 308
  produits, 45 catégories, 36 articles, 20 pages statiques), `npm test`
  (197/197), `node scripts/crawl-links.mjs` (0 lien cassé / 7841
  vérifiés) — tous verts. Vérifié dans
  `dist/guides/voyager-avion-cigarette-electronique/index.html` que le
  titre, la meta description, le JSON-LD `BlogPosting`/`BreadcrumbList`
  et le disclaimer « réservés aux personnes majeures » sont bien présents
  dans le HTML pré-rendu (les produits associés, comme sur tous les
  guides existants, ne sont pas dans ce shell SEO statique — rendus côté
  client uniquement, comportement inchangé). `grep` conformité sur le
  nouveau contenu (`sevrage`, `nocivité`, etc.) : aucune occurrence.
- **Suite** :
  1. **Priorité pour un humain** : investiguer pourquoi `seo/2026-08-03`
     et `seo/2026-08-04` n'existent pas sur le remote alors que les
     journaux des 08-03/08-04 décrivent un commit local vérifié vert, et
     pourquoi `seo/2026-08-01`/`seo/2026-08-02` (contenu de correctif
     identique, prêt à fusionner sans conflit) restent ouvertes sans
     être ni mergées ni fermées. Tant que ce n'est pas résolu, ne pas
     reproduire mécaniquement ce correctif à chaque run (déjà fait 3
     fois) — mais si au prochain run les branches 08-01/08-02
     disparaissent aussi du remote, c'est un signal encore plus fort
     qu'un humain doit agir sur le pipeline avant tout nouveau run SEO.
  2. IDs produits fantômes `xros-4-mini-269` / `pixo-aura-2-301` dans
     `blog.js` (voir ci-dessus) — à corriger dans un futur run
     d'optimisation, indépendamment de l'écart GUARDRAILS.
  3. Items backlog non revérifiés aujourd'hui (un seul sujet par run) :
     `categorySeo.js` `meilleures-ventes` (117 caractères au dernier
     contrôle), `productGuides.js` `GUIDES_BY_CATEGORY.ecig` (toujours 5
     guides pour un `limit` par défaut de 4, revérifié en passant
     aujourd'hui — le 5e, `erreurs-frequentes-debutant-vape`, reste
     tronqué), titre/meta `quelle-cigarette-electronique-choisir`.

---

### 2026-08-04 — [type : audit]
- **Fait** : troisième reproduction du correctif de conformité GUARDRAILS
  (sevrage/arrêt du tabac). Avant de choisir une tâche, vérifié l'état réel
  de `site/` : `main` est à `8effe99` (a avancé de plusieurs commits humains
  non liés au SEO depuis le 08-03 — outils d'emailing admin, filtres
  catégories). La branche `seo/2026-08-03` annoncée fusionnée/committée
  dans le journal du 08-03 **n'existe pas sur le remote**
  (`git branch -a` : seules `seo/2026-08-01` et `seo/2026-08-02` existent
  parmi les branches SEO d'août — pas de `2026-08-03`). Un `grep` sur
  `blog.js`/`categorySeo.js` confirme que les **mêmes 7 formulations non
  conformes** (sevrage, arrêt du tabac) identifiées le 08-01 et
  « corrigées » le 08-03 sont toujours en ligne sur `main` — le correctif
  du 08-03 a donc été perdu (jamais poussé, ou poussé puis jamais
  fusionné et la branche supprimée/non trouvée). Reproduit à l'identique
  les 7 corrections (mêmes formulations de remplacement que le 08-01/08-03,
  retrouvées via `git diff main origin/seo/2026-08-01` malgré le fait que
  cette branche soit désormais structurellement obsolète sur le reste du
  diff — seules les 3 lignes `blog.js`/`categorySeo.js` liées à la
  conformité ont été reprises, pas le reste de son diff qui contient des
  dizaines de fichiers sans rapport, preuve de son âge) : tirage MTL,
  intro top-eliquides, titre/description/intro guide sels de nicotine,
  FAQ dosage, description/section sachets de nicotine, intro coût vape,
  metaDescription/section `e-liquides-sels-de-nicotine` dans
  `categorySeo.js`. N'a pas touché à `staticSeoPages.js` : la branche
  `seo/2026-08-01` contenait aussi un changement `29€→49€` sur le seuil de
  livraison gratuite, mais ce n'est pas une question de conformité
  GUARDRAILS (juste une dérive de contenu d'une branche obsolète) — laissé
  en l'état pour ne pas modifier un prix sans confirmation.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Écart GUARDRAILS
  non négociable (publicité vape non conforme à l'art. L3513-4 CSP)
  resté en ligne sur le site depuis au moins le 08-01 (4 jours), malgré
  deux tentatives de correctif précédentes qui ne se sont jamais
  concrétisées sur `main`. Priorité absolue sur toute autre tâche de la
  mission tant que ce n'est pas fusionné.
- **Fichiers** : `src/data/blog.js`, `src/data/categorySeo.js`,
  `public/llms-full.txt` (régénéré par le build)
- **Vérifié** : `npm ci`, `npm run build` (404 pages pré-rendues : 308
  produits, 41 catégories, 35 articles, 20 pages statiques), `npm test`
  (197/197), `node scripts/crawl-links.mjs` (0 lien cassé / 7780
  vérifiés) — tous verts. `grep` dans `dist/` confirme qu'aucune
  occurrence de « sevrage » ou « arrêter de fumer » ne subsiste, sauf la
  question FAQ légitime (« Peut-on promettre que la vape aide à arrêter
  de fumer ? » → « Non »).
- **⚠️ Alerte pipeline, plus grave qu'un simple délai de fusion** : ce
  n'est plus seulement « la PR n'est pas encore mergée » (pattern observé
  depuis fin juillet) — c'est la **deuxième fois consécutive qu'un
  correctif de conformité committé disparaît entièrement** (ni sur `main`,
  ni sur une branche remote retrouvable), alors que d'autres travaux
  (contenu, optimisation) des mêmes runs ont fini par apparaître sur
  `main` d'une manière ou d'une autre. Hypothèse : soit le push de la
  branche échoue spécifiquement certains jours sans que je puisse le
  détecter depuis ce contexte, soit une branche fusionnée est supprimée
  après merge (normal) mais alors le contenu devrait être sur `main` — ce
  qui n'est pas le cas. Un humain doit investiguer le pipeline de
  livraison (`agent-repo/.github/workflows/seo-agent.yml`, mode de
  livraison, logs CI des runs 08-01 et 08-03) plutôt que de laisser
  l'agent reproduire ce correctif une 4e fois sans comprendre la cause
  racine.
- **Suite** :
  1. **Ne pas reproduire ce correctif une 4e fois sans investigation
     humaine du pipeline** si `seo/2026-08-04` connaît le même sort — au
     prochain run, vérifier d'abord si ce commit a atteint `main`
     (`grep` conformité). S'il a de nouveau disparu, escalader plus
     fortement plutôt que de re-corriger mécaniquement.
  2. Items du backlog non revérifiés aujourd'hui (un seul sujet par run) :
     titre/meta `quelle-cigarette-electronique-choisir`, longueur
     `meilleures-ventes` dans `categorySeo.js`,
     `GUIDES_BY_CATEGORY.ecig` vs. limite d'affichage dans
     `productGuides.js`.
  3. Aucun contenu long format traité depuis le 07-30 — si le prochain
     run confirme que ce correctif a bien été fusionné, revenir sur une
     page de contenu longue traîne (priorité 1 de la mission).

---

### 2026-08-03 — [type : audit]
- **Fait** : le correctif de conformité GUARDRAILS du 2026-08-01 (commit
  `7bec44e`, branche `seo/2026-08-01`, « purger les mentions de
  sevrage/arrêt du tabac non conformes ») n'était **toujours pas fusionné
  sur `main`** après 3 jours (`git merge-base --is-ancestor 7bec44e
  origin/main` → NO ; `grep -n "sevrage\|arrêter de fumer\|nocivité\|moins
  nocif\|plus sain\|sans danger"` sur `blog.js`/`categorySeo.js` sur
  `origin/main` (`68d3f4b`) confirmait les mêmes 8 occurrences non
  conformes encore en ligne). Conformément au seuil fixé les 08-01/08-02
  (« si toujours pas mergé d'ici 2-3 jours, reproduire directement sur
  main »), j'ai reproduit le correctif directement sur `main` par
  `git cherry-pick -n 7bec44e`, qui s'est appliqué sans conflit (le
  contenu visé n'avait pas bougé depuis). Après application, un nouveau
  `grep` ne remonte plus que deux occurrences légitimes (une FAQ de la
  page `/conformite-vape` qui répond explicitement « non » à la promesse
  de sevrage, et une ligne de `llms-full.txt` qui est elle-même un
  engagement de non-promesse santé) — aucune formulation promotionnelle
  restante.
- **Pourquoi** : écart GUARDRAILS (publicité vape non conforme à l'art.
  L3513-4 CSP) resté en ligne sur le site pendant plusieurs jours faute de
  fusion humaine de la PR `seo/2026-08-01` ; le backlog précisait
  explicitement qu'un tel écart prime sur le risque de doublon de PR une
  fois le délai de 2-3 jours dépassé. Pas de données GSC disponibles
  aujourd'hui (`gsc-data.json` vide).
- **Fichiers** : `public/llms-full.txt`, `src/data/blog.js`,
  `src/data/categorySeo.js` (contenu identique au commit `7bec44e`,
  committé sur une nouvelle branche `seo/2026-08-03` basée sur `main`
  actuel `68d3f4b`). `npm run build` (sitemap + llms-full + vite build +
  prerender 404 pages) et `npm test` (197/197) passent après application.
- **Suite** : si la PR `seo/2026-08-01` finit par être fusionnée en plus
  de celle d'aujourd'hui, elle sera un no-op (contenu identique) — pas de
  conflit attendu. Vérifier lors du prochain run que `seo/2026-08-03` a
  bien été fusionnée ; sinon, ce correctif de conformité aura été
  reproduit deux fois sans jamais atteindre `main`, ce qui indiquerait un
  problème plus large dans le pipeline de fusion des PR à investiguer
  (pas seulement un délai). Aucun contenu long format traité aujourd'hui
  (dernier contenu créé le 07-30) : si les prochains runs restent sur de
  l'audit/optimisation, revenir sur une page de contenu longue traîne
  pour respecter le rythme indicatif de la mission. Points de la liste
  « À vérifier » du BACKLOG (titre/meta `quelle-cigarette-electronique-
  choisir`, longueur `meilleures-ventes`, `GUIDES_BY_CATEGORY.ecig` vs.
  limite d'affichage) non revérifiés aujourd'hui — un seul sujet traité
  ce run, conformément à la règle « une tâche par run ».

---

### 2026-08-02 — [type : optimisation]
- **⚠️ Constat prioritaire, non traité aujourd'hui** : le correctif de
  conformité GUARDRAILS du run d'hier (2026-08-01, commit `7bec44e`
  « purger les mentions de sevrage/arrêt du tabac non conformes », branche
  `seo/2026-08-01`) **n'est toujours pas mergé sur `main`**. Vérifié par
  `git merge-base --is-ancestor 7bec44e main` (→ NO) et confirmé par
  `grep -n "sevrage\|arrêter de fumer" src/data/blog.js src/data/categorySeo.js`
  sur `main` actuel (`e41262c`) : les 8 occurrences non conformes
  identifiées hier sont **toujours en ligne sur le site**. Vérifié aussi
  que la branche `seo/2026-08-01` est basée directement sur `main` actuel
  (`git merge-base main 7bec44e` = `e41262c`, le head de `main`) : elle
  fusionnerait sans conflit si elle était mergée, ce n'est donc qu'un
  problème de délai de fusion, pas un problème de contenu obsolète. Ce
  n'est qu'1 jour de latence (le pattern habituel de ce repo va de 1 à 8
  jours avant fusion humaine), donc pas encore traité comme une alerte
  au sens du run du 07-31/08-01 — mais comme il s'agit d'un écart
  GUARDRAILS (publicité vape non conforme, en ligne), **ne pas laisser
  ce point filer plusieurs jours sans le re-signaler**. Je n'ai pas
  refait le correctif aujourd'hui pour ne pas dupliquer un travail déjà
  fait et prêt à fusionner sans conflit — mais si `7bec44e` n'est
  toujours pas mergé dans 2-3 jours, il faudra probablement le reproduire
  directement sur `main` plutôt que d'attendre indéfiniment, la
  non-conformité étant plus urgente qu'un risque de doublon de PR.
- **Fait** : recréé les 3 liens inline retour guide → page statique
  identifiés dans le backlog comme régression du rebuild manuel du
  07-30 (`b24679d`) : `compatibilite-resistances-cartouches` →
  `boutique-vape-marseille` (dans la section « Utiliser les fiches
  produits »), `livraison-produits-vape-france` → `livraison-retours`
  (dans la FAQ retour e-liquide ouvert), `quelle-cigarette-electronique-choisir`
  → `cigarette-electronique-marseille` (dans la FAQ conseil en magasin).
  Même pattern que les 07-26/07-27 : lien `<a href="...">` inline dans le
  texte d'une section ou d'une FAQ (`blog.js` passe par
  `dangerouslySetInnerHTML`), style déjà géré par la règle Tailwind
  `[&_a]` de `BlogPost.jsx` (inchangée).
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Après avoir
  confirmé le constat GUARDRAILS ci-dessus (non traité aujourd'hui par
  choix, pour éviter un doublon d'une seule journée de latence),
  revérifié l'état réel de `main` sur les items du backlog plutôt que de
  faire confiance au journal : les 3 liens retour étaient toujours
  absents de `blog.js` (`grep` sur les 3 URLs cibles → aucune occurrence),
  confirmant la régression déjà qualifiée depuis le 07-31. Tâche choisie
  car rapide, déjà qualifiée, conforme à la priorité 2 de la mission
  (maillage interne), et le rythme récent (opt/audit/opt/contenu/opt/audit
  sur les 6 derniers jours) permettait une optimisation sans dévier du
  rythme indicatif.
- **Fichiers** : `src/data/blog.js`
- **Vérifié** : `npm ci`, `npm run build` (404 pages pré-rendues : 308
  produits, 41 catégories, 35 articles, 20 pages statiques), `npm test`
  (188/188), `node scripts/crawl-links.mjs` (0 lien cassé / 6973
  vérifiés) — tous verts. Vérifié dans `dist/guides/.../index.html` que
  les 3 `<a href>` inline apparaissent bien dans le HTML pré-rendu de
  chacun des 3 guides concernés.
- **Suite** :
  1. Re-suivre le mergde de `seo/2026-08-01` (conformité GUARDRAILS) —
     voir constat prioritaire ci-dessus, à re-signaler si toujours pas
     mergé d'ici 2-3 jours.
  2. `categorySeo.js` `meilleures-ventes` toujours à 117 caractères
     (sous 140-160) — non revérifié aujourd'hui (un seul sujet par run),
     mais probablement toujours d'actualité.
  3. `productGuides.js` : `GUIDES_BY_CATEGORY.ecig` vs. `limit` de
     `relatedGuidesForProduct()` — non revérifié aujourd'hui, à confirmer
     avant de reprendre ce point.
  4. Contenu : le dernier guide créé date du 07-30 ; si le prochain run
     est aussi de l'optimisation ou de l'audit, envisager de repasser sur
     du contenu longue traîne (priorité 1 de la mission) pour respecter
     le rythme indicatif ~3 jours/semaine.

---

### 2026-08-01 — [type : audit]
- **Fait** : audit de conformité GUARDRAILS sur le contenu ajouté par un
  autre processus le 07-30 (commits `ba2ccf0`/`fd0338b`, ~13 guides +
  refonte catégories, non tracés dans ce journal). Trouvé et corrigé
  7 violations explicites de la règle n°1 de GUARDRAILS.md (« INTERDIT :
  toute promesse de santé, d'aide au sevrage, ou comparaison de nocivité
  avec le tabac ») :
  1. `categorySeo.js` `e-liquides-sels-de-nicotine` : metaDescription
     (« sevrage efficace ») et section (« réussir son sevrage tabagique
     sans sensation de manque ») → reformulé en dosage/sensation en
     gorge, sans promesse de sevrage.
  2. `blog.js` guide `meilleure-cigarette-electronique` : FAQ « Quel est
     le meilleur tirage pour arrêter de fumer ? » → reformulé en
     question factuelle (comparaison au tirage d'une cigarette
     traditionnelle), réponse inchangée (déjà factuelle).
  3. `blog.js` guide `top-10-meilleurs-eliquides` : intro affirmant que
     « le choix du e-liquide est responsable à 80% de la réussite de
     votre sevrage » (statistique non sourcée + promesse de sevrage) →
     reformulé sur le choix technique (goût, nicotine, PG/VG).
  4. `blog.js` guide `sels-de-nicotine-guide-complet` : titre (« Le Guide
     Complet pour un Sevrage Réussi »), description (« avantages pour
     arrêter de fumer »), intro (« ont révolutionné le sevrage
     tabagique ») et FAQ (« recommandé... pour le sevrage immédiat ») →
     tout reformulé en contenu factuel (dosage, compatibilité matériel),
     titre/description gardés à une longueur comparable (54/126
     caractères).
  5. `blog.js` guide `sachets-nicotine-interdits-2026` : description
     (« alternatives pour le sevrage ») → « produits de substitution
     disponibles ».
  6. `blog.js` même guide, section « Se tourner vers la vape aux sels de
     nicotine » (« demeure le levier le plus efficace ») → reformulé en
     description réglementaire neutre, sans affirmation d'efficacité
     pour l'arrêt du tabac.
  7. `blog.js` guide `vapoter-moins-cher-que-fumer-cout` : intro (« Outre
     les bénéfices majeurs pour la santé... pour arrêter le tabac ») →
     supprimé la promesse de bénéfice santé, gardé uniquement l'angle
     économique (légitime, ce guide compare des coûts, pas la nocivité).
  N'a pas touché : la question FAQ ligne 994 du guide
  `reglementation-vape-france` (« Peut-on promettre que la vape aide à
  arrêter de fumer ? » → « Non ») qui est déjà conforme et sert de
  contre-exemple ; le titre/résumé du guide `vapoter-moins-cher-que-fumer-cout`
  (comparaison de **coût**, pas de nocivité, autorisée) ; les mentions
  factuelles de « santé publique »/« autorités de santé » dans un
  contexte réglementaire (décrets), qui ne sont pas des promesses de
  THEKLOPE. N'a pas non plus touché aux statistiques non sourcées qui ne
  relèvent pas de GUARDRAILS (ex. « 70% des débutants... », dans
  `top-10-meilleurs-eliquides`) — à qualifier séparément si besoin, pour
  garder le diff du jour focalisé sur la conformité.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). En vérifiant
  l'état réel de `main` avant de choisir une tâche (comme toujours),
  repéré que `main` a reçu 3 nouveaux commits humains depuis le dernier
  run (avis Google, redirections 301, balises SEO produit + cron CRM —
  tous hors du périmètre theklope/GUARDRAILS de cet agent, non modifiés).
  En profitant de cette vérification pour re-dérouler l'audit
  `grep`/longueurs prévu par le backlog, un `grep -n "sevrage\|arrêter"`
  sur `blog.js`/`categorySeo.js` a fait remonter 8 occurrences, dont 7
  de vraies violations de GUARDRAILS (règle non négociable, priorité sur
  toute autre tâche de la mission) ajoutées par un batch de contenu du
  07-30 jamais audité pour la conformité jusqu'ici. Choisi de traiter
  cette non-conformité avant les items déjà connus du backlog (régression
  de maillage, `meilleures-ventes` trop courte) : un écart GUARDRAILS sur
  du contenu déjà en ligne est plus urgent qu'une optimisation de
  maillage ou de longueur de meta description.
- **Fichiers** : `src/data/blog.js`, `src/data/categorySeo.js`,
  `public/llms-full.txt` (régénéré par le build)
- **Vérifié** : `npm ci`, `npm run build` (404 pages pré-rendues : 308
  produits, 41 catégories, 35 articles, 20 pages statiques), `npm test`
  (188/188), `node scripts/crawl-links.mjs` (0 lien cassé / 6970
  vérifiés) — tous verts. Revérifié par `grep` dans `dist/` qu'aucune
  occurrence de « sevrage » ou « arrêter de fumer » ne subsiste dans les
  pages concernées, et que le nouveau titre du guide sels de nicotine
  apparaît bien dans `<title>`.
- **Suite** : items backlog toujours ouverts, non traités aujourd'hui
  (un seul sujet par run, ici la conformité) :
  1. Régression de maillage guide → page statique (3 liens inline perdus
     lors de la reconstruction du 07-30) — toujours absente de `main`,
     revérifié aujourd'hui (`grep` sur les 3 slugs cibles : aucune
     occurrence dans `blog.js`).
  2. `categorySeo.js` `meilleures-ventes` toujours à 117 caractères.
  3. `productGuides.js` : `GUIDES_BY_CATEGORY.ecig` à 5 guides pour une
     limite d'affichage à 4 — non revérifié aujourd'hui, à confirmer
     avant de reprendre ce point.
  4. La branche `seo/2026-07-31` (run d'hier, correction titre/meta
     `quelle-cigarette-electronique-choisir`) n'est **pas encore
     mergée** sur `main` au 08-01 — mais ce n'est qu'un jour de latence
     (contrairement au blocage de 8 jours résolu le 07-31), donc pas
     d'alerte à ce stade ; à re-surveiller si elle reste ouverte
     plusieurs jours. Attention aussi : cette branche diffe désormais
     contre un `main` qui a avancé sur `api/`/`vercel.json`/
     `scripts/prerender.mjs` (commits humains du 07-31 non liés au SEO)
     — surveiller si un conflit de fusion apparaît.
  5. Nouveau, repéré aujourd'hui sans être traité : `top-10-meilleurs-eliquides`
     contient des statistiques non sourcées (« 80% de la réussite »,
     « 70% des débutants ») — la première a été retirée avec la
     correction sevrage, la seconde (70%) reste et n'est pas un problème
     GUARDRAILS à proprement parler, mais mériterait d'être sourcée ou
     retirée dans un futur passage qualité contenu.
  6. Recommandé pour un prochain run : ne pas re-lancer un audit complet
     de conformité tant que ce point n'est pas re-qualifié — mais
     comme `main` continue de recevoir du contenu d'autres processus non
     tracé ici (déjà 13 guides ajoutés d'un coup le 07-30 sans passer par
     ce journal), un nouveau `grep` conformité (sevrage, nocivité, ton
     publicitaire, ciblage mineurs) reste à refaire après tout nouvel
     afflux de contenu externe, même hors du rythme d'audit habituel.

---

### 2026-07-31 — [type : optimisation]
- **✅ Le blocage de livraison signalé du 2026-07-24 au 07-30 est résolu.**
  `git log` sur `site/` montre que les 8 branches `seo/2026-07-22` à
  `seo/2026-07-30` ont toutes été mergées sur `main` par un humain (série
  de commits `Merge remote-tracking branch 'origin/seo/2026-07-2X'`),
  suivies d'un commit de reconstruction manuelle (`b24679d`, « reconstruire
  blog.js et llms-full.txt après merge des PR SEO quotidiens ») et de
  plusieurs commits d'un autre processus (images des guides, mention
  factuelle des avis Google). `main` contient maintenant 35 guides
  (`src/data/blog.js`) contre 22 au 07-30. Plus besoin de vérifier
  `git merge-base --is-ancestor` avant d'agir : l'état de `main` est de
  nouveau la seule source de vérité fiable (ce qui était déjà la règle,
  mais qui redevient simple à appliquer).
- **Fait** : audit complet post-fusion (build, tests, liens, longueurs de
  titres/meta descriptions sur `blog.js`/`categorySeo.js`/
  `staticSeoPages.js`), puis correction du pire écart trouvé : le guide
  `quelle-cigarette-electronique-choisir` (ajouté le 07-29 par un autre
  processus, non tracé dans ce journal) avait un titre de 85 caractères et
  une meta description de **220 caractères** (soit ~96 caractères pour le
  `<title>` complet avec le suffixe « | THEKLOPE ») — très au-dessus des
  limites d'affichage Google (~60 car. pour le titre, ~155-160 car. pour
  la meta description), avec un risque réel de troncature disgracieuse en
  SERP pour l'un des guides les plus importants du site (relié depuis la
  page locale Marseille et le maillage produit → guides catégorie `ecig`).
  Raccourci à 52 caractères (titre) et 153 caractères (description), sens
  et mots-clés conservés, sans aucune promesse de santé/sevrage (contenu
  factuel comparatif, conforme GUARDRAILS).
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Avec le blocage de
  livraison résolu, un audit s'imposait avant tout nouveau contenu ou
  optimisation ciblée, pour repartir d'un état de `main` vérifié plutôt
  que du journal (dernier audit : 07-28, avant la fusion massive et avant
  les ~13 guides ajoutés entre-temps par un autre processus). L'audit n'a
  trouvé qu'un seul écart significatif (celui corrigé ci-dessus) ; les
  autres écarts trouvés sont mineurs ou déjà qualifiés (voir Suite/
  BACKLOG). Un audit + correction ponctuelle reproduit le pattern du
  07-28 (audit qui corrige aussi ce qu'il trouve, diff toujours minimal).
- **Fichiers** : `src/data/blog.js`, `public/llms-full.txt` (régénéré par
  le build)
- **Vérifié** : `npm ci`, `npm run build` (404 pages pré-rendues : 308
  produits, 41 catégories, 35 articles, 20 pages statiques), `npm test`
  (186/186), `node scripts/crawl-links.mjs` (0 lien cassé / 6970
  vérifiés) — tous verts. Vérifié dans
  `dist/guides/quelle-cigarette-electronique-choisir/index.html` que le
  nouveau titre et la nouvelle meta description apparaissent bien dans
  `<title>`, `<meta name="description">`, `og:description`,
  `twitter:description` et le JSON-LD `BlogPosting.headline/description`.
- **Suite** — écarts repérés pendant l'audit, non traités aujourd'hui
  (un seul écart par run) :
  1. `src/data/categorySeo.js` : `meilleures-ventes` toujours à 117
     caractères (sous la fourchette 140-160), malgré 2 tentatives
     passées (07-24, 07-28) — celles-ci ont bien été mergées pour
     `nouveautes` (152, conforme) mais pas pour `meilleures-ventes`,
     resté inchangé. À corriger dans un prochain run d'optimisation.
  2. **Régression détectée** : le maillage guide → page statique ajouté
     les 07-26 et 07-27 (liens inline retour depuis
     `compatibilite-resistances-cartouches` vers `boutique-vape-marseille`,
     depuis `livraison-produits-vape-france` vers `livraison-retours`, et
     depuis `quelle-cigarette-electronique-choisir` vers
     `cigarette-electronique-marseille`) a disparu de `main` — probablement
     perdu lors de la reconstruction manuelle de `blog.js` (`b24679d`).
     Seul le lien retour de `reglementation-vape-france` vers
     `conformite-vape` (07-27) a survécu. Le sens page statique → guide
     (`links` array) est lui bien intact. À re-créer.
  3. `src/data/productGuides.js` : `GUIDES_BY_CATEGORY.ecig` liste
     maintenant **5** guides (`entretenir-kit-classique-box` a été ajouté
     entre-temps par un autre processus) alors que
     `relatedGuidesForProduct` a un `limit` par défaut de 4 (corrigé de 3
     à 4 le 07-29 pour la même raison) — le 5e guide
     (`erreurs-frequentes-debutant-vape`) est de nouveau tronqué pour
     toutes les fiches produit `ecig`. Même classe de bug que le 07-29,
     à surveiller si d'autres catégories dépassent leur limite après de
     futurs ajouts de guides.
  4. Guide `stockage-eliquides-batterie-vape` (existe sur `main` depuis la
     fusion) toujours absent du maillage produit → guides
     (`productGuides.js`, catégories `eliquide`/`ecig`/`pod`) — à ajouter
     une fois le point 3 ci-dessus clarifié (ne pas dépasser la limite
     d'affichage).
  5. Mineur, non urgent (déjà noté 07-28) : titre `alternatives-puffs-jetables`
     (69 car.), et nouveau : `puffs-interdites-france-2025-2026` (titre 77
     car.) et 2 meta descriptions `categorySeo.js` sous 140 (`xros-cartouches`
     131, `puffs-jetables` 132 car. — probablement volontaire, gamme de
     produits nichée, à confirmer avant de toucher).
  Prochaine étape suggérée : traiter le point 2 (régression maillage) ou
  le point 1 (meilleures-ventes) en priorité, ce sont les plus rapides et
  les plus qualifiés.

---

### 2026-07-30 — [type : contenu]
- **⚠️ Mise à jour du constat de blocage (voir 2026-07-29)** : `gsc-data.json`
  toujours vide. Revérifié le workflow `agent-repo/.github/workflows/seo-agent.yml` :
  `DELIVERY_MODE` est toujours `pr` (non corrigé, comme prévu — décision
  humaine). Revérifié aussi les 7 branches `seo/2026-07-22` à
  `seo/2026-07-28` **plus la branche `seo/2026-07-29`** créée par le run
  d'hier : `git merge-base --is-ancestor` confirme qu'aucune des 8 n'est
  mergée sur `main`. Nouveau constat, plus grave que celui du 07-29 : en
  diffant chacune de ces branches contre `origin/main` actuel (`git diff
  origin/main origin/seo/2026-07-2X --stat`), les diffs affichent
  désormais des **dizaines de fichiers non liés au SEO** (tout `api/`,
  `supabase/`, `src/lib/pricing.js`, `src/pages/Checkout.jsx`, etc.) en
  sens inverse, preuve que ces branches sont basées sur un `main` très
  ancien (avant les refontes checkout/CRO des PR #36-#44 mergées entre
  temps par un autre processus). Elles ne sont donc plus de simples PR «
  en attente de review » : elles sont **structurellement obsolètes et ne
  pourront plus se fusionner proprement** sans résolution manuelle massive
  de conflits sans rapport avec le SEO. Recommandation renforcée pour un
  humain : fermer ces 8 PR sans les fusionner, et juger au cas par cas
  si leur contenu SEO (guides, maillage, meta descriptions — détaillé
  dans les entrées 07-22 à 07-29 ci-dessous) mérite d'être recréé
  manuellement sur `main` actuel. Je n'ai pas fermé ces PR moi-même
  (action de gestion de PR sur le repo theklope, hors du périmètre d'un
  commit de contenu).
- **Fait** : nouveau guide « Entretenir un kit classique ou une box de
  cigarette électronique » (`entretenir-kit-classique-box`, catégorie
  Entretien) : nettoyage du clearomiseur, joints (o-rings), pas de vis
  510/contacts, stockage de la box et de la batterie (dont batterie
  amovible). FAQ + 2 produits associés (Aegis Legend 3 200w, Gen 80s
  iTank 2 — deux box/kits avec clearomiseur, cohérents avec le sujet).
- **Pourquoi** : ce guide avait déjà été proposé deux fois (runs
  07-23 et 07-25, sous des noms différents — l'entretien de kit
  classique/box vs. le stockage e-liquides/batterie) mais jamais mergé
  sur `main` (branches `seo/2026-07-23` et `seo/2026-07-25`, toutes deux
  désormais obsolètes — voir constat ci-dessus). Vérifié directement dans
  `blog.js` sur `main` avant d'agir (pas seulement le journal) : toujours
  21 guides, aucun ne couvre l'entretien d'un kit tubulaire/box (seul
  `entretenir-pod-rechargeable` existe, pour les pods). Contenu priorité 1
  de la mission, écart de longue date jamais résolu à cause du blocage de
  livraison — recréé directement plutôt que de retenter un correctif
  d'optimisation déjà 3x tenté sans effet (meta descriptions
  `categorySeo.js`) ou déjà fait localement mais non mergé
  (`productGuides.js` limit=3→4, toujours à 3 sur `main`, revérifié
  aujourd'hui).
- **Fichiers** : `src/data/blog.js`, `public/llms-full.txt` (régénéré par
  le build)
- **Vérifié** : `npm ci`, `npm run build` (360 pages pré-rendues, 22
  articles), `npm test` (180/180), `node scripts/crawl-links.mjs` (0 lien
  cassé / 4601 vérifiés) — tous verts. Vérifié dans `dist/guides/entretenir-kit-classique-box/index.html`
  que le titre, la meta description, le disclaimer « réservés aux
  personnes majeures » et les 2 liens produits associés sont bien
  présents dans le HTML pré-rendu.
- **Suite** : voir le constat de blocage ci-dessus — à traiter avant que
  d'autres runs ne s'accumulent sur des branches obsolètes. Une fois des
  PR fermées/mergées par un humain : (1) `productGuides.js` — le nouveau
  guide n'a volontairement pas été ajouté au maillage produit → guides
  (`GUIDES_BY_CATEGORY`, catégorie `ecig`) car cette catégorie a déjà 4
  guides mappés pour une limite d'affichage toujours à 3 sur `main` (le
  correctif limit=4 du 07-29 n'a jamais été mergé) — l'ajouter maintenant
  l'aurait rendu invisible ; (2) meta descriptions `nouveautes`/
  `meilleures-ventes` toujours sous 140 caractères sur `main` (135 et 117
  caractères, revérifié aujourd'hui) ; (3) maillage `staticSeoPages.js` ↔
  `blog.js` (guide → page statique) toujours absent de `main`.

---

### 2026-07-29 — [type : optimisation]
- **⚠️ Constat prioritaire (non lié au diff du jour)** : la cause probable
  du blocage signalé depuis le 2026-07-24 a été identifiée. Le workflow
  `agent-repo/.github/workflows/seo-agent.yml` a `DELIVERY_MODE: pr` (ligne
  17), avec un commentaire explicite en ligne 15 : « Passer à "push" ici
  après la période d'essai de 3 jours. » Le premier run date du 2026-07-21
  (PR #23) : la période d'essai de 3 jours est donc dépassée depuis
  longtemps (8 jours). Confirmé avec `git merge-base --is-ancestor` :
  **aucune** des 7 branches `seo/2026-07-22` à `seo/2026-07-28` n'est
  ancêtre de `main` — 0 des 7 derniers runs SEO n'a atteint la prod, alors
  que `main` a avancé de 20+ commits sur la même période via d'autres PR
  (#25 à #42, un autre processus/agent). Résultat concret : tout le travail
  content/maillage des runs 07-22 à 07-27 (guides, maillage interne,
  meta descriptions) reste invisible sur le site en ligne. Recommandation
  pour un humain : soit fusionner (ou fermer si obsolètes) les PR
  `seo/2026-07-22` à `seo/2026-07-28` sur `craigbarns/theklope`, soit
  repasser `DELIVERY_MODE` à `push` dans le workflow si la qualité des
  runs passés est jugée suffisante — les deux ne s'excluent pas. Je n'ai
  pas modifié ce paramètre moi-même : c'est un changement de pipeline de
  livraison vers la prod d'un site e-commerce, à valider par un humain.
- **Fait** : dans `src/data/productGuides.js`, `relatedGuidesForProduct()`
  avait un `limit` par défaut de 3, mais `GUIDES_BY_CATEGORY` liste 4
  guides pour les catégories `eliquide`, `ecig` et `resistance`. Le 4e
  guide de chacune (`lire-fiche-eliquide`, `erreurs-frequentes-debutant-vape`,
  `compatibilite-resistances-cartouches`) était donc systématiquement
  tronqué et n'apparaissait jamais dans le bloc « Guides utiles » d'aucune
  fiche produit de ces catégories, malgré sa pertinence évidente (ex. :
  le guide compatibilité résistances/cartouches n'était lié depuis aucune
  fiche produit résistance). Passé `limit` à 4 ; aucun effet sur les
  5 autres catégories (`pod`, `accessoire`, `pack`, `diy`,
  `alternative-puff`), qui n'ont que 3 guides mappés.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}}`). En vérifiant
  l'état réel de `main` avant de choisir une tâche (les runs précédents
  s'appuyaient sur le journal, qui s'est révélé périmé — voir constat
  ci-dessus), j'ai audité `categorySeo.js` (les 2 meta descriptions courtes
  identifiées le 07-24/07-28 sont toujours courtes sur `main`, aucune des
  2 branches n'a été mergée) et `productGuides.js` dans la foulée
  (priorité 2 de la mission : maillage catégories/produits/guides). Choisi
  ce bug de troncature plutôt que de refaire une 3e fois le correctif des
  meta descriptions (déjà tenté 2 fois sans être mergé — un 3e correctif
  identique n'aurait ajouté aucune valeur marginale une fois le blocage
  résolu, juste un conflit de plus sur les mêmes lignes).
- **Fichiers** : `src/data/productGuides.js`
- **Vérifié** : `npm ci`, `npm run build` (359 pages pré-rendues),
  `npm test` (169/169), `node scripts/crawl-links.mjs` (0 lien cassé /
  4874 vérifiés) — tous verts. Vérifié dans `dist/produit/.../index.html`
  qu'une fiche produit résistance lie désormais bien vers
  `compatibilite-resistances-cartouches`.
- **Suite** : voir le constat prioritaire ci-dessus — à traiter avant
  toute autre chose. Une fois le blocage résolu (fusion des PR et/ou
  passage en mode `push`), vérifier les conflits triviaux attendus sur
  `categorySeo.js` (2 branches touchent les mêmes 2 lignes de meta
  description) et revalider que le contenu des branches 07-22 à 07-28
  est toujours pertinent avant de fusionner (rien ne semble périmé à ce
  jour). Ne pas re-proposer le correctif des meta descriptions
  `nouveautes`/`meilleures-ventes` dans un nouveau run tant que le
  blocage n'est pas résolu.

---

### 2026-07-28 — [type : audit]
- **Fait** : audit technique complet (aucun run de type audit dans le
  journal jusqu'ici, malgré la priorité 4 de la mission et le rythme
  indicatif ~2 jours/semaine). Vérifié : sitemap (`generate-sitemap.mjs`,
  `sitemap-data.mjs` — logique saine, dates ISO validées, pas d'URL
  `undefined`/`null`), `robots.txt` (cohérent, disallow admin/checkout/
  panier/favoris), canoniques (`Seo.jsx` — calcul par défaut origine+path
  correct), JSON-LD (types bien formés sur les 359 pages pré-rendues),
  liens internes (`crawl-links.mjs` : 0 cassé / 4592 vérifiés). Contrôle
  systématique des longueurs de titres/meta descriptions sur les 3
  fichiers de données SEO (`blog.js`, `categorySeo.js`,
  `staticSeoPages.js`) via un script Node ad hoc : seules `nouveautes`
  (135) et `meilleures-ventes` (139 caractères) étaient sous la fourchette
  140-160 respectée par les 8 autres catégories — corrigées à 157 et 158
  caractères, même style que l'existant (mention adultes, livraison
  France). `cigarette-electronique-marseille` (161, static page) et 2
  titres de guides (67-69 caractères) sont des dépassements mineurs,
  laissés en l'état (pas assez significatifs pour justifier une
  modification isolée).
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Constat du rythme :
  les 7 dernières entrées du journal (2026-07-21 à 2026-07-27) sont
  uniquement de type contenu/optimisation, jamais audit — écart avec la
  mission (priorité 4, ~2 jours/semaine). L'écart de meta description
  était déjà qualifié par le backlog/journal depuis le 2026-07-22 mais
  jamais corrigé sur `main` car porté par la branche `seo/2026-07-24`,
  toujours pas mergée. `main` est resté à `9e0db8d` (aucun changement
  depuis le run du 07-27) — confirmé avant d'agir pour éviter tout
  doublon.
- **Fichiers** : `src/data/categorySeo.js`
- **Suite** : les branches `seo/2026-07-22` à `seo/2026-07-27` (6
  branches maintenant) existent toujours sur le remote sans être mergées
  sur `main` — le mécanisme de merge semble bloqué structurellement ;
  pourrait valoir la peine de signaler ce point à un humain si la
  situation persiste encore plusieurs runs. Pistes techniques mineures
  repérées mais non traitées : `cigarette-electronique-marseille`
  (meta description à 161 caractères, 1 au-dessus du max) et les titres de
  `alternatives-puffs-jetables` (69) / `autonomie-cigarette-electronique`
  (67) légèrement longs — à regrouper dans un futur petit passage
  d'optimisation si d'autres écarts similaires apparaissent, plutôt que
  de faire un commit pour un seul caractère.
- **Vérifié** : `npm ci`, `npm run build` (359 pages pré-rendues),
  `npm test` (144/144), `node scripts/crawl-links.mjs` (0 lien cassé /
  4592 vérifiés) — tous verts. Vérifié dans `dist/` que les 2 nouvelles
  meta descriptions apparaissent bien dans le HTML pré-rendu des pages
  catégorie concernées.

---

### 2026-07-27 — [type : optimisation]
- **Fait** : maillage interne restant entre `staticSeoPages.js` et
  `blog.js` — ajouté un lien inline dans le corps du guide
  `reglementation-vape-france` vers la page statique `conformite-vape`, et
  un lien inline dans le corps du guide `quelle-cigarette-electronique-choisir`
  vers la page statique `cigarette-electronique-marseille`. Ces deux pages
  statiques linkaient déjà vers leur guide respectif (sens page → guide)
  mais aucun lien retour n'existait (sens guide → page). Ajouté aussi la
  règle Tailwind `[&_a]` dans `BlogPost.jsx` pour styliser ces liens
  inline (couleur neon, souligné) — absente sur `main` avant ce run.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Avant de choisir
  cette tâche, vérifié l'état réel de `main` (pas seulement le backlog) :
  les 5 branches `seo/2026-07-22` à `seo/2026-07-26` existent toujours sur
  le remote mais ne sont **toujours pas mergées sur `main`**, qui n'a pas
  bougé depuis la PR #35 (harmonisation du nom de marque). Confirmé par
  `git diff` que chacune de ces 5 branches est basée sur le même commit
  `9e0db8d` (pas empilées les unes sur les autres) : ce sont bien 5 runs
  distincts dont le travail reste bloqué en dehors de `main`. Vérifié
  précisément le contenu de `seo/2026-07-26` (diff contre `9e0db8d`) : ce
  run a traité **uniquement** la paire `boutique-vape-marseille` ↔
  `compatibilite-resistances-cartouches` et `livraison-retours` ↔
  `livraison-produits-vape-france`. La paire `conformite-vape` ↔
  `reglementation-vape-france` et `cigarette-electronique-marseille` ↔
  `quelle-cigarette-electronique-choisir`, identifiée dans le backlog,
  n'avait donc été traitée par aucun run précédent (vérifié directement
  dans `blog.js` sur `main` : aucun des deux guides ne contenait de lien
  retour). Tâche choisie car élément de maillage interne concret et
  déjà qualifié par le backlog, dans la continuité de la priorité 2 de la
  mission. Audit rapide avant modification : build, tests (144/144) et
  `crawl-links.mjs` (0 lien cassé / 4592 vérifiés) déjà verts sur `main`.
- **Fichiers** : `src/data/blog.js`, `src/pages/BlogPost.jsx`
- **Suite** : les 5 branches `seo/2026-07-22` à `seo/2026-07-26`
  toujours **pas mergées sur `main`** au 2026-07-27 — à re-vérifier avant
  tout nouveau run pour éviter un doublon si elles finissent par être
  mergées d'un coup (elles contiennent : maillage guide↔guide
  `getRelatedPosts`, guide entretien kit classique/box, meta descriptions
  `categorySeo.js` nouveautes/meilleures-ventes, guide stockage
  e-liquides/batteries, maillage boutique-marseille/livraison-retours ↔
  guides). Avec le lien ajouté aujourd'hui, les 4 pages statiques de
  `staticSeoPages.js` linkent maintenant chacune vers au moins un guide
  qui linke en retour — le trou de maillage identifié dans le backlog
  depuis plusieurs runs est donc comblé (sous réserve que les 5 branches
  en attente ne soient jamais mergées ; si elles le sont, aucun conflit
  attendu car elles touchent des paires de pages différentes).
- **Vérifié** : `npm ci`, `npm run build` (359 pages pré-rendues),
  `npm test` (144/144), `node scripts/crawl-links.mjs` (0 lien cassé /
  4594 vérifiés) — tous verts. Vérifié dans `dist/` que les 2 `<a href>`
  inline sont bien présents dans le HTML pré-rendu des guides.

---

### 2026-07-26 — [type : optimisation]
- **Fait** : maillage interne entre 2 pages `staticSeoPages.js` et 2 guides
  `blog.js`. Ajouté un lien vers le guide `compatibilite-resistances-cartouches`
  dans les `links` de `boutique-vape-marseille`, et un lien vers le guide
  `livraison-produits-vape-france` dans les `links` de `livraison-retours`.
  En retour, ajouté un lien inline (`<a href="...">`) dans le corps de
  chacun de ces deux guides vers la page statique correspondante. Comme
  aucun style n'existait pour les liens inline dans le corps des articles
  (`BlogPost.jsx`), ajouté une règle Tailwind `[&_a]` (couleur neon,
  souligné) pour que ces liens ne s'affichent pas en bleu par défaut.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Backlog identifiait
  explicitement ce trou de maillage (mission priorité 2). Vérification
  faite avant d'agir : le backlog datait du 2026-07-25 et affirmait que
  `cigarette-electronique-marseille` n'avait aucun lien vers un guide —
  faux aujourd'hui, ce lien existe déjà sur `main` (probablement ajouté par
  une des PR #25-#35 mergées entre-temps, non tracées dans ce journal). Il
  ne restait donc que `boutique-vape-marseille` et `livraison-retours` sans
  lien vers un guide. Pour le sens retour (guide → page statique), vérifié
  que `sections[].text`/`faq[].a` de `staticSeoPages.js` sont rendus en
  texte échappé par React (pas de HTML possible côté page statique), alors
  que le contenu des guides (`blog.js`) passe par `dangerouslySetInnerHTML`
  et supporte donc un `<a>` inline — d'où le choix d'ajouter les liens
  retour côté guide uniquement.
  Avant de choisir cette tâche, audit rapide sans rien à corriger : build,
  `npm test` (144/144) et `node scripts/crawl-links.mjs` (0 lien cassé /
  4592 vérifiés) déjà verts sur `main` avant modification.
- **Fichiers** : `src/data/staticSeoPages.js`, `src/data/blog.js`,
  `src/pages/BlogPost.jsx`
- **Suite** : les branches `seo/2026-07-22` à `seo/2026-07-25` (maillage
  guide↔guide `getRelatedPosts`, guide entretien kit classique/box, guide
  stockage e-liquides/batteries) sont **toujours pas mergées sur `main`**
  au 2026-07-26 — à vérifier avant de refaire ce travail. Maillage restant
  dans le backlog : `conformite-vape` et `cigarette-electronique-marseille`
  ont un lien vers un guide mais aucun des guides correspondants
  (`reglementation-vape-france`, `quelle-cigarette-electronique-choisir`)
  ne linke en retour vers la page statique — même limitation technique
  (texte échappé côté page statique) à garder en tête, mais le lien retour
  côté guide reste possible comme fait aujourd'hui. Attention : re-vérifier
  l'état du backlog à chaque run, plusieurs de ses constats se sont révélés
  périmés à cause des PR non tracées (#25-#35) sur ce repo partagé.
- **Vérifié** : `npm ci`, `npm run build` (359 pages pré-rendues dont les 2
  guides et 2 pages modifiées), `npm test` (144/144),
  `node scripts/crawl-links.mjs` (0 lien cassé / 4596 vérifiés) — tous
  verts. Vérifié aussi dans `dist/` que les 2 `<a href>` inline sont bien
  présents dans le HTML pré-rendu des guides.

---

### 2026-07-25 — [type : contenu]
- **Fait** : nouveau guide « Comment bien conserver ses e-liquides et sa
  batterie ? » (`stockage-eliquides-batterie-vape`, catégorie Entretien) :
  protection des e-liquides contre la chaleur/lumière, entretien de la
  batterie intégrée (charge USB-C), préparation d'une pause d'utilisation.
  FAQ + produits associés (2 e-liquides + un kit à batterie intégrée).
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Item explicitement
  identifié dans le backlog (« vérifier s'il manque un guide sur le
  stockage des e-liquides et batteries ») ; vérifié dans `blog.js` (21
  slugs) qu'aucun des 21 guides existants ne couvrait ce sujet — seul
  `erreurs-frequentes-debutant-vape` le mentionne dans sa meta description
  sans le traiter dans le corps. Dernier run (2026-07-24) étant de
  l'optimisation, contenu logique pour respecter le rythme mission.
- **Fichiers** : `src/data/blog.js`, `public/llms-full.txt` (régénéré par
  le build)
- **Suite** : les branches `seo/2026-07-22` (maillage guide↔guide,
  `getRelatedPosts`) et `seo/2026-07-23` (guide entretien kit
  classique/box) sont **toujours pas mergées sur `main`** au 2026-07-25 —
  vérifié à nouveau (`getRelatedPosts` absent de `src/`,
  `entretenir-kit-classique-box` absent de `blog.js`). Ne pas refaire ce
  travail avant d'avoir confirmé leur statut. Pistes backlog restantes :
  maillage `staticSeoPages.js` ↔ `blog.js` (toujours aucun lien retour
  d'un guide vers une page statique) ; envisager d'ajouter
  `stockage-eliquides-batterie-vape` au maillage produit → guides
  (`productGuides.js`, catégories `eliquide`/`ecig`/`pod`) lors d'un
  prochain run d'optimisation, sans dépasser la limite de 3 guides
  affichés par catégorie.
- **Vérifié** : `npm ci`, `npm run build` (22 articles pré-rendus),
  `npm test` (144/144), `node scripts/crawl-links.mjs` (0 lien cassé /
  4601 vérifiés) — tous verts.

---

### 2026-07-24 — [type : optimisation]
- **Fait** : allongé les meta descriptions `nouveautes` (135→152) et
  `meilleures-ventes` (139→157 caractères) dans `categorySeo.js` pour
  rentrer dans la fourchette 140-160 des 8 autres catégories.
- **Pourquoi** : `gsc-data.json` toujours vide (`{}`). Item déjà identifié
  et chiffré dans le backlog ; vérifié que la mesure était toujours
  valable avant d'agir. Un audit préalable (crawl des liens internes via
  `scripts/crawl-links.mjs`, absent du build mais existant dans le repo :
  0 lien cassé sur 4592 vérifiés ; validation du JSON-LD sur les 359 pages
  pré-rendues : tous les types présents — Product, BlogPosting, FAQPage,
  LocalBusiness, CollectionPage, WebSite, Organization — bien formés, le
  pattern `@graph` avec `@context` au niveau racine est correct et n'est
  pas une erreur) n'a rien trouvé d'autre à corriger, donc bascule sur
  cette optimisation déjà qualifiée par le backlog.
- **Fichiers** : `src/data/categorySeo.js`
- **Suite** : important — les branches `seo/2026-07-22` (maillage
  guide↔guide) et `seo/2026-07-23` (guide entretien kit classique/box)
  n'étaient **toujours pas mergées sur `main`** au 2026-07-24 ; le code
  correspondant (`getRelatedPosts`, `entretenir-kit-classique-box`)
  n'existe pas sur `main`. À vérifier avant tout nouveau run sur ces
  sujets pour éviter un doublon si elles finissent par être mergées.
  Note aussi : `main` contient plusieurs PR (#25 à #35, schéma local,
  IndexNow, maillage produit→guides, guide backlinks, etc.) non tracées
  dans ce journal — probablement un autre processus/agent sur ce repo
  partagé ; à garder en tête en cas d'incohérence entre journal et code.
  Pistes backlog restantes : maillage `staticSeoPages.js` ↔ `blog.js`
  (aucun guide ne linke vers une page statique en retour, sauf
  `conformite-vape`) ; guide stockage e-liquides/batteries à vérifier.

---

### 2026-07-23 — [type : contenu]
- **Fait** : nouveau guide « Entretenir un kit classique ou une box de
  cigarette électronique » (`entretenir-kit-classique-box`) : nettoyage du
  clearomiseur, joints (o-rings), pas de vis 510/contacts, stockage de la
  box et de la batterie. Ajouté aussi au maillage produit → guides
  (`productGuides.js`, catégorie `ecig`).
- **Pourquoi** : `gsc-data.json` toujours vide, donc pas d'opportunité
  chiffrée. Le backlog notait explicitement ce trou de contenu :
  `entretenir-pod-rechargeable` couvre les pods mais aucun guide ne
  couvrait l'entretien d'un kit tubulaire/box, alors que la mission place
  le contenu longue traîne en priorité 1 et que le dernier run (2026-07-22)
  était déjà de l'optimisation (maillage guide↔guide).
- **Fichiers** : `src/data/blog.js`, `src/data/productGuides.js`,
  `public/llms-full.txt` (régénéré par le build)
- **Suite** : à noter — le commit `efc312a` (maillage interne guide↔guide,
  run du 2026-07-22) n'est pas encore sur `main` (branche
  `seo/2026-07-22` non mergée) ; vérifier son état avant d'enchaîner sur le
  même sujet. Prochaines pistes backlog : meta descriptions
  `categorySeo.js` (`nouveautes`, `meilleures-ventes`) sous 140 caractères ;
  maillage `staticSeoPages.js` ↔ `blog.js` (seule `conformite-vape` linke
  vers un guide aujourd'hui) ; vérifier l'opportunité d'un guide sur le
  stockage e-liquides/batteries.

---

### 2026-07-22 — [type : optimisation]
- **Fait** : maillage interne entre guides `blog.js` — ajout de
  `getRelatedPosts(slug)` (mêmes catégories) et d'un bloc « Guides
  associés » dans la sidebar de `BlogPost.jsx`, à côté des produits
  associés existants.
- **Pourquoi** : GSC vide (`gsc-data.json` = `{}`), donc pas d'opportunité
  chiffrée à saisir. Le backlog notait explicitement un manque de maillage
  interne (mission priorité 2). En explorant le code j'ai découvert que
  `blog.js` contient déjà 20 guides publiés sans aucun lien croisé entre
  eux — un vrai trou de maillage, plus impactant que les idées de contenu
  du backlog (qui, vérification faite, étaient pour la plupart déjà
  couvertes par des articles existants — voir note dans BACKLOG.md).
- **Fichiers** : `src/data/blog.js`, `src/pages/BlogPost.jsx`
- **Suite** : maillage `staticSeoPages.js` ↔ `blog.js` (aucun lien
  actuellement) ; corriger 2 meta descriptions de `categorySeo.js` sous
  140 caractères ; envisager un guide entretien kit classique/box (le
  seul entretien existant vise les pods).

---

### 2026-07-21 — [type : contenu]
- **Fait** : guide « comment choisir sa résistance » (run d'essai, PR #23 mergée sur main le 2026-07-21, publié)
- **Pourquoi** : première idée du backlog contenu ; run d'essai en mode PR
- **Fichiers** : `src/data/blog.js`, `public/llms-full.txt`
- **Suite** : vérifier si la PR #23 a été mergée avant d'enchaîner ; prochaine idée backlog ou opportunité GSC

