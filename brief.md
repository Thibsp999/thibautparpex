# Brief projet — thibaut.parpex (thème WordPress)

## Identité

- **Auteur :** Thibaut Parpex (`Thibsp999`)
- **Email :** parpex.thibaut40@gmail.com
- **Démarré le :** 2026-05-06

## Objectif

Thème WordPress portfolio personnel, nom `thibaut.parpex` (affiché tel quel dans la liste des thèmes WP).

---

## Design

| Zone | Spec |
|------|------|
| Fond | Noir `#000`, canvas halftone organique interactif (points ultra-fins) |
| Typo | Playfair Display (Google Fonts) — serif moderne, poids 400 & 500 |
| Header | `thibaut.parpex` haut gauche · nav Work / About / Contact haut droite |
| Séparateur | Ligne épaisse blanche (`3px solid #fff`) entre header↔contenu et contenu↔footer |
| Footer | Lien Instagram haut droit : <https://www.instagram.com/thibs.p/> |
| Interactivité | Formes organiques halftone lentement attirées par le curseur (Canvas + RAF) |

---

## Structure des fichiers

```
thibautparpex/              ← racine du thème (= ce repo)
├── style.css               ← en-tête d'enregistrement WP (Theme Name: thibaut.parpex)
├── functions.php           ← setup, enqueue (Playfair Display, main.css, halftone.js), nav menu
├── header.php              ← DOCTYPE, <canvas>, .site-header avec logo + nav
├── footer.php              ← .site-footer avec lien Instagram, wp_footer()
├── index.php               ← template de secours (boucle WP standard)
├── front-page.php          ← page d'accueil statique
├── page.php                ← template générique → utilisé pour Work, About, Contact
└── assets/
    ├── css/
    │   └── main.css        ← tous les styles (layout, typo, responsive)
    └── js/
        └── halftone.js     ← animation canvas halftone (grille de points + blobs + souris)
```

---

## Pages WordPress à créer (admin)

| Titre | Slug | Template utilisé |
|-------|------|-----------------|
| (Home) | `/` | `front-page.php` — à définir comme page statique dans Réglages > Lecture |
| Work | `/work` | `page.php` |
| About | `/about` | `page.php` |
| Contact | `/contact` | `page.php` |

### Navigation
Après avoir créé les pages : **Apparence > Menus** → créer un menu, y ajouter les 4 pages, l'assigner à l'emplacement **Navigation principale**.

---

## Installation

1. Copier le dossier `thibautparpex/` dans `wp-content/themes/`
2. **Apparence > Thèmes** → activer `thibaut.parpex`
3. Créer les pages Work, About, Contact
4. Créer et assigner le menu principal
5. **Réglages > Lecture** → définir la page d'accueil statique

---

## Évolutions prévues / notes

- Le fond halftone est configurable via les constantes en tête de `halftone.js` (`GRID`, `MAX_R`, `N_BLOBS`, etc.)
- `page.php` est volontairement minimal — ajouter `page-work.php`, `page-about.php`, `page-contact.php` pour des layouts différenciés si besoin
- Police alternative possible : Cormorant Garamond (plus condensé) ou EB Garamond
