# EEE WordPress (eee-wp)

Containerized WordPress 7.1 development environment for EEE featuring Full Site Editing (FSE), custom Gutenberg blocks, and mail testing.

## Quick Start

```bash
# Start Docker environment
docker compose up -d

# Build all assets (theme + blocks)
npm run build

# Run PHP quality checks (PHPStan Level 6)
npm run check:php

# Run all checks
npm run check
```

- **WordPress Frontend & Admin**: [http://localhost:8086](http://localhost:8086)
- **MailHog Web UI**: [http://localhost:8025](http://localhost:8025)

## AI Coding & Development

This repository is configured for AI pair programming with Antigravity, Gemini Code Assist, Cursor, and Copilot.
- **AI Agent Guidelines**: See [GEMINI.md](file:///home/dvoll/code/eee-wp/GEMINI.md) and [AGENTS.md](file:///home/dvoll/code/eee-wp/AGENTS.md).
- **Workspace Skills**: See `.agents/skills/` for runbooks (`wp-docker`, `gutenberg-blocks`, `fse-theme`, `php-code-quality`).

## Notes

### Fluid font size calculation

Preferred size linear faktor:

$maxScreenWidth = 62.5rem$ (1000px; layout.wideSize)

$minScreenWidth = 20rem$ (320px)

$linearFactor = 100 * ((maxFontSize - minFontSize) / (maxScreenWidth - minScreenWidth))$

$preferredFontSize = minFontSize + ((1vw - 0.2rem) * linearFactor)$


### Read debug log

```bash
docker compose exec -t wordpress tail -f /var/www/html/wp-content/debug.log
```

### WP-CLI

Run commands via:
```bash
docker compose run --rm wp-cli <command>
# or host alias:
docker-wp <command>
```

### React 18 & React 19 Upgrade Path

The custom Gutenberg blocks in `plugins/eee23-blocks/` are currently built with **React 18** (`^18.2.0`) and `@wordpress/scripts` `^26.16.0`. This configuration is fully compatible with the WordPress 7.1 runtime and cleanly passes all block serialization and invalidation tests.

#### Upgrading to React 19 / Modern `@wordpress/*` Packages
Modern releases of `@wordpress/scripts` (v30+) and `@wordpress/*` packages enforce React 19 peer dependencies (`peer react@"^19.3.0"`). Attempting to upgrade `@wordpress/*` packages without updating React will trigger `ERESOLVE` npm peer dependency errors.

To perform a future upgrade to React 19:
1. Bump `react` and `react-dom` to `^19.x` in `plugins/eee23-blocks/package.json` (and `themes/eee-theme/package.json` if applicable).
2. Update `@types/react` to `^19.x`.
3. Update `@wordpress/scripts` and `@wordpress/*` packages to their latest versions matching React 19.
4. Rebuild all block assets (`npm run build:blocks`) and run block serialization tests (`npm run test:blocks`) to verify compatibility.

### Update TODOs
- Update scripts and check for experimental values
- Optional: Update block frontend to module scripts