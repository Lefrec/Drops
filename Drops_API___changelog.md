---
title: 'Drops API : changelog'

---

# Drops API : changelog

Mise à jour déployée sur `main`. L'API est coupée environ une minute pendant le redéploiement. Vos comptes, drops, likes et commentaires sont conservés.

Pensez à **recoller le nouveau `/contract.md`** dans vos fichiers d'agent : les types ont changé.

## À corriger dans votre code (changements cassants)

### Le verrouillage et l'ouverture des drops n'existent plus

Un drop est toujours complet et à sa position exacte.

- Champs **supprimés** de `Drop` : `locked`, `openedByMe`, `opensCount`, et `location.precision`. `location` vaut désormais `{ lat, lng }`.
- Routes **supprimées** (elles renvoient 404) : `POST /drops/{id}/open` et `GET /drops/{id}/opens`.
- Erreurs **supprimées** : `403 drop_locked` et `403 too_far`. Le champ `error.meta` n'existe plus.
- `GET` et `PATCH /admin/settings` sont supprimés (réservé à l'enseignant).
- WebSocket :
  - `drop:opened`, `settings:updated` et la notification `drop_opened` ne sont plus envoyés.
  - Le message `hello` devient `{ user, serverTime, online }` (plus de `lockMode`).
  - `notification.kind` vaut `drop_liked` ou `drop_commented`.

### `GET /drops/{id}/comments` ne renvoie plus que les commentaires de premier niveau

Les réponses se lisent avec la nouvelle route `GET /comments/{id}/replies` (voir plus bas). Chaque commentaire porte `repliesCount` pour savoir s'il en a.

## Nouveautés

### Plus de restriction de zone

`POST /drops` et `PATCH /drops/{id}` acceptent n'importe quelle position. Seules les bornes de latitude et de longitude sont vérifiées (erreurs sous la clé `location`).

### Réponses aux commentaires (un seul niveau)

- `POST /drops/{id}/comments` accepte `parentId` (facultatif) : `{ "content": "…", "parentId": 7 }`.
- Répondre à une réponse la rattache au **commentaire racine** : `parentId` est toujours l'id d'un commentaire de premier niveau. Triez les réponses par `createdAt`.
- `parentId` inconnu ou appartenant à un autre drop : `422` sous la clé `parentId`.
- `GET /comments/{id}/replies` renvoie les réponses d'un commentaire de premier niveau, paginées, de la plus ancienne à la plus récente. `404` si l'id est celui d'une réponse.
- `Drop.commentsCount` compte commentaires et réponses.

### Commentaires supprimés

Un commentaire de premier niveau supprimé **qui a des réponses** reste dans la liste, sous forme de « trace » :

- `deleted: true`, `content: ""`, `isMine: false`.
- `author` anonymisé : `{ id: 0, username: "deleted", displayName: "Commentaire supprimé", avatarUrl: null }`.

Il disparaît définitivement avec sa dernière réponse. Sans réponse, ou pour une réponse, la suppression est immédiate.

### Dislikes

- Sur les drops : `POST` et `DELETE /drops/{id}/dislike`.
- Sur les commentaires : `POST` et `DELETE /comments/{id}/like`, et `POST` et `DELETE /comments/{id}/dislike`. Réagir à un commentaire supprimé donne `404`.
- Un utilisateur a **au plus une réaction** par drop ou par commentaire : poser un like retire le dislike, et l'inverse.
- Toutes ces routes sont idempotentes et renvoient `{ liked, disliked, likesCount, dislikesCount }`. Les routes `like` des drops renvoient désormais aussi `disliked` et `dislikesCount`.

### Nouveaux champs

| Objet | Champs ajoutés |
|---|---|
| `Drop` | `dislikesCount`, `dislikedByMe` |
| `Comment` | `parentId` (`null` au premier niveau), `deleted`, `repliesCount`, `likesCount`, `dislikesCount`, `likedByMe`, `dislikedByMe` |

### WebSocket

- `like:updated` devient `{ dropId, likesCount, dislikesCount }`.
- Nouveau message `comment:updated` : `{ comment }`. Il arrive quand les compteurs de réactions d'un commentaire changent, ou quand un commentaire supprimé est conservé (`deleted: true`).
- `comment:created` est aussi envoyé pour les réponses (`comment.parentId` renseigné).
- `comment:deleted` est inchangé : `{ dropId, commentId }`.

Tout est détaillé sur `/docs`, `/contract.md` et `/ws-docs`.