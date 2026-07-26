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

