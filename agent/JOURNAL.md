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

