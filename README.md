# Compagnon de voyage 🧳

Application web pour préparer et suivre un voyage en groupe : planning jour par jour,
réservations, carte des lieux, documents partagés, et un module de comptes façon
Tricount entre les groupes de voyageurs. Pensée pour être réutilisée d'un voyage à
l'autre — chaque voyage a ses propres données, entièrement isolées des autres.

👉 **App en ligne :** https://elem-bee.github.io/kanadapp/

---

## Comment ça marche

- **Trois fichiers HTML autonomes** (React, Supabase, Leaflet et jsPDF chargés depuis
  des CDN — une connexion Internet est nécessaire) :
  - **`index.html`** — page d'accueil : une tuile par voyage enregistré, protégée par
    mot de passe, plus une tuile Administration.
  - **`roadbook.html`** — l'application d'un voyage donné (Planning, Map, Resa, Docs,
    Comptes, Bloc-notes), sélectionné via `?trip=<id>` dans l'URL.
  - **`admin.html`** — tableau de bord général : création de voyages, mots de passe,
    réglages partagés entre tous les voyages.
- **Données partagées** : stockées dans un projet **Supabase** (table `kv`), pas dans
  ce dépôt. Chaque voyageur d'un même voyage voit les mêmes données ; les
  modifications sont partagées en temps réel.
- **Hébergement** : ce dépôt est publié via **GitHub Pages**.
- **Multi-voyages** : un seul dépôt et un seul projet Supabase peuvent héberger
  plusieurs voyages en parallèle, chacun avec ses propres voyageurs, son propre
  planning, ses propres réglages — sans se mélanger.

> 🔒 **Confidentialité** — Ce dépôt est **public**, donc aucun des trois fichiers HTML
> ne contient de donnée sensible propre à un voyage (pas de référence de réservation,
> pas de lien vers des billets, pas de nom de voyageur en dur). Ces informations
> vivent uniquement dans Supabase, chargées à l'exécution.

---

## Rôles

| Rôle | Où | Ce qu'il peut faire |
|---|---|---|
| **Voyageur** | `roadbook.html` | Consulter le planning, la carte, les réservations, les documents ; gérer le bloc-notes partagé. |
| **Gentil Organisateur** | `roadbook.html` | Tout ce que voit le Voyageur, plus l'édition complète du contenu (planning, lieux, réservations, documents) et l'accès au module Comptes. |
| **Administrateur** | `admin.html` | Créer des voyages, gérer leurs mots de passe, activer/masquer leurs sections — sans accès au contenu détaillé d'un voyage. |

Les mots de passe sont **numériques** (clavier adapté automatiquement sur mobile),
générés automatiquement à la création d'un voyage et régénérables à tout moment
depuis `admin.html`.

---

## Fonctionnalités

- **PLANNING** — itinéraire jour par jour, éditable en ligne (notes enrichies, liens,
  pièces jointes). Chaque entrée peut être associée à un lieu et à une réservation.
- **MAP** — liste des lieux d'intérêt, groupés par zone, alimentée automatiquement par
  les lieux du planning et des réservations, complétable manuellement ou par import
  CSV (export Google Takeout) ; carte Leaflet légère pour les lieux géolocalisés, et
  liens vers des cartes ou listes Google Maps partagées.
- **RESA** — vols, hébergement, location de véhicule, billetterie ; chaque réservation
  peut être reliée à une entrée de planning et/ou à une dépense, avec des liens
  croisés pour naviguer entre les trois.
- **DOCS** — accès à un dossier Google Drive partagé, avec arborescence et
  ré-indexation à la demande.
- **COMPTES** — dépenses et remboursements entre groupes de voyageurs (définis
  librement, pas figés), équilibrage en euros, statistiques, export PDF.
- **Bloc-notes** — liste de tâches partagée, ouverte à tous les voyageurs.
- **Export Tripedia** — un PDF exhaustif du voyage (planning, réservations, lieux,
  comptes), pensé pour nourrir le contexte d'un assistant IA.

---

## Déploiement (GitHub Pages)

1. Ce dépôt doit être **public** et contenir `index.html`, `roadbook.html` et
   `admin.html`.
2. **Settings ▸ Pages** ▸ *Build and deployment* :
   - Source : **Deploy from a branch**
   - Branche : `main`, dossier : `/ (root)` ▸ **Save**
3. Après ~1 minute, l'URL publique s'affiche. Ouvre-la, mets-la en favori, partage-la.

### Mettre à jour l'application
Remplace les fichiers HTML voulus (mêmes noms) via **Add file ▸ Upload files** ▸
*Commit*. L'URL ne change pas ; chacun a la nouvelle version au prochain chargement.

---

## Configuration des données (Supabase)

Les scripts SQL contenant des données réelles **ne doivent pas** être ajoutés à ce
dépôt public : ils s'exécutent directement dans Supabase, hors du dépôt.

1. **SQL Editor** ▸ exécuter le script de **schéma** (crée la table `kv` et les
   règles d'accès) — celui-ci reste lui aussi **hors du dépôt**.
2. **SQL Editor** ▸ exécuter, pour chaque voyage, un script de **données** propre à
   ce voyage (voyageurs, vols, hébergement, etc.) — celui-ci reste **hors du dépôt**.

> ⚠️ Tout script contenant des informations privées (références de réservation,
> liens vers des billets, coordonnées de voyageurs) ne doit jamais être commité ici.
> Garde-le hors du dépôt (par ex. dans un dossier Drive partagé restreint).

---

## Structure du dépôt

```
├── index.html    ← page d'accueil multi-voyages
├── roadbook.html ← application d'un voyage
├── admin.html    ← tableau de bord administrateur
└── README.md     ← ce fichier
```

---

## Notes

- La clé « anon » de Supabase présente dans les fichiers HTML est **publique par
  conception** ; la protection des données repose sur les règles RLS côté Supabase.
- Les mots de passe d'entrée sont un simple filtre côté navigateur, pas une sécurité
  forte — suffisant pour un usage privé entre voyageurs de confiance.
- Usage privé, entre voyageurs d'un même groupe — merci de ne pas diffuser les liens
  au-delà.
