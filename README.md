# Compagnon Road Trip Canada 🍁

Application web familiale pour notre voyage au **Québec & Montréal** (octobre 2026) :
planning, réservations, carte (points d'intérêt), documents, et un module de comptes
partagés entre les deux familles (façon Tricount).

👉 **App en ligne :** https://TON-PSEUDO.github.io/kanadapp/
*(remplace `TON-PSEUDO` par ton pseudo GitHub une fois Pages activé)*

---

## Comment ça marche

- **`index.html`** : toute l'application, en un seul fichier autonome
  (React, Supabase, Leaflet et jsPDF chargés depuis des CDN — une connexion Internet
  est nécessaire).
- **Données partagées** : stockées dans un projet **Supabase** (table `kv`), pas dans ce dépôt.
  Chaque voyageur voit les mêmes données ; les modifications sont partagées.
- **Hébergement** : ce dépôt est publié via **GitHub Pages**.

> 🔒 **Confidentialité** — Ce dépôt est **public**, donc `index.html` ne contient
> **aucune donnée sensible** (pas de références de réservation, pas de liens vers les
> billets). Ces informations vivent uniquement dans Supabase.

---

## Fonctionnalités

- **PLANNING** — itinéraire jour par jour (matin / après-midi / soir), éditable en ligne.
- **RÉSA** — vols, hébergement, location du véhicule, billetterie (chargés depuis Supabase).
- **DOCS** — accès au dossier Google Drive partagé + arborescence des fichiers.
- **CARTE** — points d'intérêt sur OpenStreetMap, avec liens Waze.
- **COMPTES** — dépenses & remboursements entre familles (DAVID / BRISSET),
  équilibrage en euros, statistiques (camembert + histogramme), export PDF.
- **AIDE** — infos voyageurs et liens utiles.

---

## Déploiement (GitHub Pages)

1. Ce dépôt doit être **public** et contenir `index.html`.
2. **Settings ▸ Pages** ▸ *Build and deployment* :
   - Source : **Deploy from a branch**
   - Branche : `main`, dossier : `/ (root)` ▸ **Save**
3. Après ~1 minute, l'URL publique s'affiche. Ouvre-la, mets-la en favori, partage-la.

### Mettre à jour l'application
Remplace simplement `index.html` (même nom) via **Add file ▸ Upload files** ▸ *Commit*.
L'URL ne change pas ; chacun a la nouvelle version au prochain chargement.

---

## Configuration des données (Supabase)

Les scripts SQL **ne doivent pas** être ajoutés à ce dépôt public : ils s'exécutent
directement dans Supabase.

1. **SQL Editor** ▸ exécuter le script *schéma* (crée la table `kv` + les règles d'accès).
2. **SQL Editor** ▸ exécuter le script *seed* (injecte vols, location, billetterie et index Drive).

> ⚠️ Le script *seed* contient des informations privées (références de réservation,
> liens vers les billets) : **ne le commite jamais ici**. Garde-le hors du dépôt
> (par ex. dans le dossier Drive partagé restreint).

---

## Structure du dépôt

```
kanadapp/
├── index.html   ← l'application (à uploader / mettre à jour)
└── README.md    ← ce fichier
```

---

## Notes

- La clé « anon » de Supabase présente dans `index.html` est **publique par conception** ;
  la protection des données repose sur les règles RLS côté Supabase.
- Le mot de passe d'entrée de l'app est un simple filtre côté navigateur, pas une sécurité forte.
- Voyage privé, usage familial — merci de ne pas diffuser le lien au-delà du groupe.
