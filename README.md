# Compagnon de voyage 🧳

Application web pour préparer et suivre un voyage en groupe : planning jour par jour,
réservations, carte des lieux, documents partagés, et un module de comptes façon
Tricount entre les groupes de voyageurs. Pensée pour être réutilisée d'un voyage à
l'autre — chaque voyage a ses propres données, entièrement isolées des autres.

👉 **App en ligne :** https://TON-PSEUDO.github.io/NOM-DU-DEPOT/
*(remplace `TON-PSEUDO` et `NOM-DU-DEPOT` une fois GitHub Pages activé)*

---

## Comment ça marche

- **Trois fichiers HTML autonomes** (React, Supabase, Leaflet et jsPDF chargés depuis
  des CDN — une connexion Internet est nécessaire) :
  - **`index.html`** — page d'accueil : une tuile par voyage enregistré, protégée par
    mot de passe, plus une tuile Administration.
  - **`roadbook.html`** — l'application d'un voyage donné, sélectionné via `?trip=<id>`
    dans l'URL. Navigation : onglets Planning, Map, Resa et Comptes (en bas de l'écran
    sur téléphone, en haut sur grand écran) ; le menu ☰ donne accès à Docs, Bloc-notes,
    Settings et à la zone Exports (Planning, Comptes, Tripedia). Chaque écran est une entrée de l'historique du navigateur : le bouton
    Retour d'Android ramène à l'écran précédent au lieu de quitter l'application.
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
- **MAP** — registre unique des lieux du voyage, groupés par zone. Une activité peut
  référencer plusieurs lieux, une réservation un lieu ; le lien Google Maps est
  optionnel. Tous les lieux sont modifiables (zone comprise), saisissables depuis Map,
  une activité ou une réservation, ou importables par CSV (export Google Takeout) ;
  carte Leaflet légère pour les lieux géolocalisés.
- **RESA** — vols, hébergement, location de véhicule, billetterie ; chaque réservation
  peut être reliée à une entrée de planning et/ou à une dépense, avec des liens
  croisés pour naviguer entre les trois.
- **DOCS** (menu ☰) — accès au dossier Google Drive partagé du voyage, dont le lien se
  renseigne dans Settings.
- **COMPTES** — dépenses en euros ou en devises (plusieurs taux de repli par voyage) et
  statistiques ; trois actions en badges : nouvelle dépense, nouveau remboursement,
  statistiques.
  - **Affectation par voyageur, toujours.** Chaque dépense est affectée aux voyageurs
    qui en ont profité (« Concerne ») : à parts égales (4 convives sur 8 = 25 % chacun,
    le payeur pouvant en faire partie ou non) ou en pourcentages libres (le total doit
    faire 100 %). Les autres voyageurs ne sont pas concernés.
  - **Les groupes ne sont qu'une vue.** Le réglage de Settings choisit comment le solde
    se présente et se règle : par **groupe** (familles) — le solde d'un groupe est la
    somme de ceux de ses membres, le remboursement va de famille à famille — ou par
    **voyageur** : solde de chacun, virements proposés pour tout solder, remboursement
    de voyageur à voyageur. Un voyageur seul n'a qu'un total.
  - **Compatibilité.** Une ancienne dépense répartie entre deux groupes (50/50, 100 %,
    parts) garde exactement son résultat : elle n'est réécrite en affectation par
    voyageur que si on modifie sa sélection. Les remboursements entre groupes et entre
    voyageurs sont tous pris en compte, quelle que soit la vue.
- **Bloc-notes** (menu ☰) — liste de tâches partagée, ouverte à tous les voyageurs.
- **Exports** (menu ☰) — trois PDF regroupés au même endroit : le **Planning** (à
  imprimer), les **Comptes** (admin) et **Tripedia**, un PDF exhaustif du voyage
  (planning, réservations, lieux, comptes) pensé pour nourrir le contexte d'un
  assistant IA.

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
   règles d'accès) — sans donnée, celui-ci peut être versionné.
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
