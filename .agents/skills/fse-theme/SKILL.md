---
name: fse-theme
description: >-
  Develop and customize the Full Site Editing (FSE) block theme in themes/eee-theme, including templates, template parts, patterns, theme.json, and compiled assets.
---

# Full Site Editing (FSE) Theme Guide

The project theme is located at `themes/eee-theme/`. It is a modern Full Site Editing (block) theme built to take advantage of WordPress block templates, theme.json design tokens, and modular block styles.

## Theme Architecture

```text
themes/eee-theme/
├── theme.json                  # Design tokens, color palette, font sizes, layout settings
├── functions.php               # Theme asset registration and WordPress filters
├── style.css                   # Theme metadata stylesheet
├── templates/                  # Block HTML templates (index.html, page.html, single.html, etc.)
├── parts/                      # Reusable block HTML template parts (header.html, footer.html)
├── patterns/                   # PHP/HTML block patterns
├── assets/                     # Raw static assets (icons, SVGs, images)
├── resources/                  # Source files for theme scripts and SCSS styles
│   ├── view.js                 # Frontend interactivity script
│   ├── editor.js               # Editor enhancements script
│   └── styles/
│       └── block-styles.scss   # Custom block SCSS styles
└── public/                     # Output of @wordpress/scripts build (enqueued in functions.php)
    ├── js/
    └── css/
```

## Build and Asset Compilation

Theme assets in `resources/` are compiled to `public/` using `@wordpress/scripts`.

### From Repository Root
```bash
# Build theme assets
npm run build:theme

# Watch mode for theme assets
npm run start:theme
```

### From `themes/eee-theme`
```bash
npm run build
npm run start
```

## Working with `theme.json`

`theme.json` is the source of truth for all styling rules, design tokens, and presets:
- **`settings.color.palette`**: Global colors.
- **`settings.typography.fontSizes`**: Fluid font sizes with `clamp()` or linear calculations.
- **`settings.layout`**: Content width (`contentSize`) and wide width (`wideSize`).
- **`styles.elements`**: Default styles for elements like `link`, `heading`, `button`.
- **`styles.blocks`**: Block-specific styling overrides.

## Guidelines for Modifying FSE Templates

- Templates (`templates/*.html`) and template parts (`parts/*.html`) consist of WordPress block markup comments (e.g., `<!-- wp:group -->...<!-- /wp:group -->`).
- Always ensure block comments are well-formed and attribute JSON inside comments is valid.
- When referencing template parts, use the proper slug (e.g. `<!-- wp:template-part {"slug":"header","theme":"eee-theme"} /-->`).
- After modifying files in `resources/`, always run `npm run build:theme` so the generated `.asset.php` files in `public/` stay in sync.
