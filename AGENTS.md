# Agent Guidelines for EEE WordPress (eee-wp)

This file provides context and operational guidelines for autonomous AI agents working in this repository.

See [GEMINI.md](file:///home/dvoll/code/eee-wp/GEMINI.md) for full project architecture and workflow details.

## Quick Cheat Sheet

| Task | Command |
|---|---|
| Start Dev Containers | `docker compose up -d` |
| Check Containers | `docker compose ps` |
| View Debug Log | `docker compose exec -t wordpress tail -f /var/www/html/wp-content/debug.log` |
| WP-CLI Command | `docker compose run --rm wp-cli <command>` (or `docker-wp <command>`) |
| Build All Assets | `npm run build` |
| Build Blocks | `npm run build:blocks` |
| Build Theme | `npm run build:theme` |
| Lint Blocks | `npm run lint:blocks` |
| Lint PHP (WPCS) | `npm run lint:php` |
| Auto-format PHP (PHPCBF) | `npm run format:php` |
| Run PHPStan (Level 6) | `npm run check:php` |
| Test Blocks (Jest) | `npm run test:blocks` |
| Validate Schemas | `npm run check:schemas` |
| Run All Checks | `npm run check` |
| Assess WP Update | `npm run assess:wp [-- <version>]` |

## Core Directives

1. **Dockerized Environment**: The project runs WordPress 6.4 and PHP 8.2 in Docker. Always run PHP / Composer commands via `docker compose run --rm composer ...`.
2. **Source vs Build**:
   - `plugins/eee23-blocks/src/` -> builds into `build/`. Run `npm run build:blocks`.
   - `themes/eee-theme/resources/` -> builds into `public/`. Run `npm run build:theme`.
   - Never directly modify `build/` or `public/`.
3. **Quality Standards**:
   - PHP code must pass PHPStan Level 6 (`npm run check:php`).
   - JS/SCSS code must conform to Prettier and ESLint configs (`npm run lint:blocks`).
   - Block attributes must stay in sync with `block.json`.
