# Brief projet — thibaut.parpex (thème WordPress)

## Identité

- **Auteur :** Thibaut Parpex (`Thibsp999`)
- **Email :** parpex.thibaut40@gmail.com
- **Démarré le :** 2026-05-06

## Objectif

Thème WordPress portfolio personnel, nom `thibaut.parpex` (affiché tel quel dans la liste des thèmes WP).

---

## Infrastructure

| Paramètre | Valeur |
|-----------|--------|
| Hébergement | OVH Starter — WordPress CMS préinstallé |
| Déploiement | Git push via **Deployer for Git** |
| Accès FTP | Oui |
| Accès SSH | Non |
| WP-CLI | Non disponible |

> Sans SSH ni WP-CLI, toute configuration WordPress passe par des hooks PHP ou l'admin WP.

---

## Design

| Zone | Spec |
|------|------|
| Fond | Noir `#000`, canvas halftone organique (points ultra-fins) |
| Typo | **Fraunces** (Google Fonts, variable) — poids 300/400/500, optical sizing auto |
| Header | `thibaut.parpex` haut gauche · nav Work / About / Contact haut droite · pas de séparateur · padding `13px 48px` |
| Footer | Instagram bas droite · pas de séparateur · padding `11px 48px` |
| Animation | 12 blobs : 3 suivent vaguement le curseur, 9 autonomes (trajectoires Lissajous) · scintillement individuel par point · rayon pulsant |

---

## Structure des fichiers

```
thibautparpex/
├── style.css           ← en-tête WP (Theme Name: thibaut.parpex)
├── functions.php       ← setup · Fraunces · hook activation + fallback init
├── header.php          ← DOCTYPE, <canvas>, header logo + nav
├── footer.php          ← footer Instagram, wp_footer()
├── index.php           ← fallback
├── front-page.php      ← page d'accueil
├── page.php            ← fallback générique
├── page-work.php       ← articles event/art/vj + filtres JS
├── page-about.php      ← photo (image à la une) + texte (contenu WP)
├── page-contact.php    ← formulaire NOM/MESSAGE → sovideoevent@gmail.com
└── assets/
    ├── css/main.css    ← tous les styles
    └── js/halftone.js  ← animation canvas autonome
```

---

## Pages & setup automatique

Le hook `after_switch_theme` + fallback `init` (option `thibautparpex_setup_done`) créent automatiquement :

| Page | Slug | Template auto-sélectionné |
|------|------|--------------------------|
| Home | `/` | `front-page.php` |
| Work | `/work` | `page-work.php` |
| About | `/about` | `page-about.php` |
| Contact | `/contact` | `page-contact.php` |

Crée aussi les catégories **event / art / vj**, le menu **Navigation principale**, et configure **Réglages > Lecture**.

> Pour réinitialiser : supprimer l'option `thibautparpex_setup_done` via `/wp-admin/options.php`

---

## Détail des pages

### Work (`page-work.php`)
- Requête WP sur les catégories `event`, `art`, `vj`
- Grille responsive avec image à la une, titre, catégorie, date
- 4 boutons de filtre (all / event / art / vj) — filtrage client-side JS
- Les catégories sont auto-créées à l'activation

### About (`page-about.php`)
- Deux colonnes : photo gauche (image à la une de la page WP) + texte droite
- Placeholder visible si pas d'image à la une définie
- Texte : contenu de la page WP (éditable en admin) ou placeholder intégré

### Contact (`page-contact.php`)
- Deux colonnes : texte intro gauche (contenu WP) + formulaire droite
- Champs : Nom · Message
- Envoi via `wp_mail()` → `sovideoevent@gmail.com`
- Sécurisé avec nonce WordPress
- Messages de succès / erreur inline

---

## Déploiement

1. `git push` → Deployer for Git déploie dans `wp-content/themes/thibautparpex/`
2. **Apparence > Thèmes** → activer `thibaut.parpex` (si pas encore fait)
3. Charger le site → setup auto au premier chargement

---

## Notes techniques

- Animation : `N_FOLLOW` et `N_WANDER` configurables en tête de `halftone.js`
- Contact : nécessite que le serveur OVH ait le mail PHP configuré (cas standard OVH)
- Pour des layouts Work différenciés par projet : créer des Page Templates nommés dans WP admin
