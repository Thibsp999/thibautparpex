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
| Typo | **Instrument Serif** (Google Fonts) — serif contemporain, poids 400 + italique |
| Header | `thibaut.parpex` haut gauche · nav Work / About / Contact haut droite · padding compact (`13px 48px`) |
| Séparateur | Ligne épaisse blanche (`3px solid #fff`) entre header↔contenu et contenu↔footer |
| Footer | Lien Instagram bas droite : <https://www.instagram.com/thibs.p/> · padding compact (`11px 48px`) |
| Interactivité | 10 blobs organiques (dont 3 errants indépendants) — scintillement individuel par point, rayon pulsant, drift X/Y découplé |

---

## Structure des fichiers

```
thibautparpex/              ← racine du thème (= ce repo)
├── style.css               ← en-tête WP (Theme Name: thibaut.parpex)
├── functions.php           ← setup · enqueue · hook d'activation (pages + menu + lecture)
├── header.php              ← DOCTYPE, <canvas>, .site-header logo + nav
├── footer.php              ← .site-footer Instagram, wp_footer()
├── index.php               ← fallback template
├── front-page.php          ← page d'accueil statique
├── page.php                ← template générique Work / About / Contact
└── assets/
    ├── css/
    │   └── main.css        ← tous les styles (layout, typo, responsive)
    └── js/
        └── halftone.js     ← animation canvas : grille + blobs + suivi souris + scintillement
```

---

## Pages & configuration — automatiques à l'activation

Le hook `after_switch_theme` dans `functions.php` crée automatiquement :

| Page | Slug | Template |
|------|------|----------|
| Home | `/` | `front-page.php` (définie comme page statique) |
| Work | `/work` | `page.php` |
| About | `/about` | `page.php` |
| Contact | `/contact` | `page.php` |

Il crée aussi le menu **Navigation principale** (Work / About / Contact) et configure **Réglages > Lecture** (page statique = Home).

**Rien à faire manuellement** — activer le thème suffit.

---

## Installation

1. Copier le dossier dans `wp-content/themes/`
2. **Apparence > Thèmes** → activer `thibaut.parpex`
3. ✅ Pages, menu et réglages lecture sont créés automatiquement

---

## Notes techniques

- Animation configurable via les constantes en tête de `halftone.js` (`GRID`, `MAX_R`, `N_BLOBS`, etc.)
- `page.php` minimal par choix — créer `page-work.php` etc. pour des layouts différenciés
- Police : Instrument Serif (Google Fonts). Alternative possible : Fraunces (variable, plus contrasté)
