# SEOTHEKLOPE — Agent SEO quotidien

Agent autonome qui améliore chaque jour le SEO de
[theklope](https://github.com/craigbarns/theklope) (une tâche par jour :
contenu, optimisation ou audit technique). Tourne à 6h heure de Paris via
GitHub Actions.

## Piloter l'agent

| Pour… | Faire… |
|---|---|
| Changer la stratégie | Éditer `agent/MISSION.md` |
| Ajouter/retirer une règle | Éditer `agent/GUARDRAILS.md` |
| Suggérer des idées | Ajouter des lignes dans `agent/BACKLOG.md` |
| Voir ce qu'il a fait | Lire `agent/JOURNAL.md` |
| Lancer un run tout de suite | Onglet Actions → « Agent SEO quotidien » → Run workflow |
| Activer le merge automatique | Dans `.github/workflows/seo-agent.yml`, passer `DELIVERY_MODE: pr` à `push` |

## Secrets à configurer (Settings → Secrets and variables → Actions)

| Secret | Comment l'obtenir |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys. Facturation à l'usage. |
| `THEKLOPE_TOKEN` | GitHub → Settings → Developer settings → Fine-grained tokens. Accès au repo `theklope` uniquement, permissions Contents **Read and write** + Pull requests **Read and write**. |
| `GSC_CREDENTIALS` | (Optionnel) Google Cloud Console → compte de service avec l'API Search Console activée → clé JSON. Ajouter l'email du compte de service comme utilisateur de la propriété dans Search Console. Coller tout le JSON dans le secret. |

Sans `GSC_CREDENTIALS`, l'agent tourne en mode dégradé (bonnes pratiques,
sans données de positionnement).

## Sécurité

- Mode initial : `pr` — l'agent ouvre une pull request à relire. Passer en
  `push` après quelques jours si la qualité convient.
- Même en mode `push`, un build ou des tests en échec ⇒ PR au lieu d'un
  push. Jamais de code cassé sur main.
- Conformité vape France encodée dans `agent/GUARDRAILS.md`.
