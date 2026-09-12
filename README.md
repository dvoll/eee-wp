# EEE WordPress (eee-wp)

Containerized WordPress 6.4 development environment for EEE featuring Full Site Editing (FSE), custom Gutenberg blocks, and mail testing.

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

### Update TODOs
- Update scripts and check for experimental values
- Optional: Update block frontend to module scripts