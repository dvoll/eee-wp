# EEE-WP — AI Coding & Agent Guidelines

Welcome to the **EEE WordPress (eee-wp)** project repository. This document establishes technical architecture, coding standards, environment workflows, and constraints for AI coding agents and human developers.

---

## 1. Project Overview & Architecture

This repository is a containerized WordPress development environment powering the EEE web platform. It leverages WordPress Full Site Editing (FSE), custom Gutenberg blocks built with React, custom plugins, and containerized tooling.

### Technology Stack
- **WordPress**: 7.1+ (FSE / Block Theme architecture)
- **PHP**: 8.2 (Container runtime), analyzed with **PHPStan Level 6**
- **JavaScript / CSS**: React 18 (with React 19 upgrade path documented in README), `@wordpress/scripts`, Webpack, SCSS
- **Database**: MariaDB (via Docker Compose)
- **Mail Testing**: MailHog (SMTP on port 1025, Web UI on port 8025)
- **Local Dev URLs**:
  - WordPress Site: [http://localhost:8086](http://localhost:8086)
  - MailHog Webbox: [http://localhost:8025](http://localhost:8025)

---

## 2. Directory Structure Map

```text
├── .agents/                    # Antigravity / AI Agent skills and runbooks
│   └── skills/
│       ├── wp-docker/          # Docker environment & WP-CLI runbook
│       ├── gutenberg-blocks/   # Custom block development runbook
│       ├── fse-theme/          # FSE theme & theme.json runbook
│       └── php-code-quality/   # PHPStan and Composer via Docker
├── docker-compose.yaml         # Docker orchestration (db, wordpress, wp-cli, mailhog, composer)
├── package.json                # Root build, lint, and test scripts
├── composer.json               # PHP dependencies (PHPStan & WordPress stubs)
├── phpstan.neon                # PHPStan static analysis configuration (Level 6)
├── post-deploy.sh              # Deployment staging sync script
├── wp-plugin-setup.sh          # Helper script for activating default plugins
│
├── plugins/
│   ├── eee23-blocks/           # Custom Gutenberg blocks plugin (React + @wordpress/scripts)
│   │   ├── src/                # Block source files (block.json, edit, save, SCSS)
│   │   ├── build/              # Compiled block assets (DO NOT edit directly)
│   │   └── eee23-blocks.php    # Plugin entrypoint registering block types
│   │
│   └── eee23-mail-config/      # Mail configuration plugin
│       └── eee23-mail-config.php # PHPMailer SMTP setup & form recipient filters
│
├── themes/
│   └── eee-theme/              # Modern FSE Block Theme
│       ├── theme.json          # Global styles, color palettes, typography, dimensions
│       ├── templates/          # HTML block templates (page.html, index.html, etc.)
│       ├── parts/              # HTML block template parts (header.html, footer.html)
│       ├── patterns/           # Custom block patterns
│       ├── resources/          # Theme JS (view.js, editor.js) and SCSS sources
│       ├── public/             # Compiled theme assets and .asset.php metadata
│       └── functions.php       # Asset enqueuing and filters
│
└── wordpress/
    ├── Dockerfile              # Custom WordPress container build
    └── custom.ini              # Custom PHP settings (memory limit, upload size)
```

---

## 3. Essential Workflows & Commands

### Docker Environment & WP-CLI
All server runtimes, databases, WP-CLI, and Composer tools run inside Docker.

```bash
# Start all containers
docker compose up -d

# Check status of containers
docker compose ps

# Run WP-CLI commands (or use host alias: docker-wp <command>)
docker compose run --rm wp-cli core version
docker compose run --rm wp-cli plugin list

# Tail debug logs in real time
docker compose exec -t wordpress tail -f /var/www/html/wp-content/debug.log

# Stop containers
docker compose down
```

### Building Assets (Gutenberg Blocks & Theme)
Run these commands from the repository root:

```bash
# Build both custom blocks and theme assets
npm run build

# Build Gutenberg blocks only
npm run build:blocks

# Start watch mode for blocks during active development
npm run start:blocks

# Build theme assets only
npm run build:theme

# Start watch mode for theme assets
npm run start:theme
```

### Code Quality & Static Analysis
```bash
# Run WordPress Coding Standards (PHPCS) via Docker
npm run lint:php
# or via composer:
docker compose run --rm composer run phpcs

# Auto-fix PHP code standards violations (PHPCBF)
npm run format:php

# Run PHPStan (level 6 with deprecation rules) via Docker
docker compose run --rm composer run phpstan
# or:
npm run check:php

# Lint block JavaScript and CSS
npm run lint:blocks

# Run block unit and invalidation tests (Jest)
npm run test:blocks

# Validate theme.json and block.json schemas
npm run check:schemas

# Auto-format block source code
npm run format:blocks

# Run all quality checks (JS/CSS lint, PHPCS, PHPStan, Schemas, Block tests)
npm run check

# Assess compatibility with a new or target WordPress version
npm run assess:wp -- 6.8
```

---

## 4. Coding Standards & Agent Constraints

### Critical Rules for AI Agents

1. **Docker for PHP and Composer**: Always execute Composer and PHPStan commands through Docker (`docker compose run --rm composer ...`), not the host PHP, to ensure consistent PHP 8.2 compatibility.
2. **Never Edit Output Folders Directly**:
   - `plugins/eee23-blocks/build/` is generated from `plugins/eee23-blocks/src/`.
   - `themes/eee-theme/public/` is generated from `themes/eee-theme/resources/`.
   - Always edit the source files and run `npm run build`.
3. **Never Touch Core WordPress Files**: All project code must remain isolated in `themes/eee-theme/`, `plugins/eee23-blocks/`, or `plugins/eee23-mail-config/`.
4. **PHPStan Level 6 Cleanliness**: Every PHP change must pass `npm run check:php` without errors. Use strict typing and check for nullability.
5. **Gutenberg Block Schema**:
   - Every block must have a valid `block.json`.
   - Block attributes must match between `block.json`, `edit.js`, and `save.js`.
   - If altering existing static block HTML output, implement deprecation migrations to avoid block validation errors in the WordPress editor.
6. **FSE Templates & `theme.json`**:
   - Styling presets, colors, and layout widths should be defined in `theme.json` rather than hardcoded styles.
   - Template files in `templates/` and `parts/` must use valid Gutenberg block markup comments (e.g. `<!-- wp:template-part {"slug":"header"} /-->`).
