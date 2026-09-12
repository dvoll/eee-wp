---
name: php-code-quality
description: >-
  Run PHP static analysis (PHPStan at level 6) and manage PHP dependencies using Docker.
---

# PHP Code Quality & Analysis Guide

PHP code in this project (`themes/eee-theme`, `plugins/eee23-blocks`, `plugins/eee23-mail-config`) is analyzed using **PHPStan at level 6** with WordPress stubs and extensions.

To avoid PHP version mismatches with the host environment, all PHP analysis and Composer operations run inside Docker.

## Running PHPStan Analysis

### From Repository Root
```bash
# Run PHPStan via Docker Compose
docker compose run --rm composer run phpstan

# Or via npm script alias
npm run check:php
```

### Direct Analysis with Arguments
```bash
# Analyze specific path
docker compose run --rm composer exec phpstan analyse themes/eee-theme

# Generate baseline or run with custom memory limit
docker compose run --rm composer exec phpstan analyse --memory-limit=512M
```

## Managing Composer Dependencies

Use the `composer` service in `docker-compose.yaml`:

```bash
# Install dependencies
docker compose run --rm composer install

# Require a new dev dependency
docker compose run --rm composer require --dev <package-name>

# Update dependencies
docker compose run --rm composer update
```

## Code Quality Standards

1. **Strict Typing**: Add parameter types and return type declarations to functions and methods wherever possible.
2. **WordPress API**: Use WordPress core APIs and sanitize/escape all input and output (`esc_html`, `esc_attr`, `sanitize_text_field`).
3. **Prevent Direct Access**: Every PHP entry file must start with:
   ```php
   if ( ! defined( 'ABSPATH' ) ) {
       exit; // Exit if accessed directly.
   }
   ```
4. **Configuration Check**: Ensure `phpstan.neon` excludes `node_modules` and `vendor` directories so only your theme and plugin code are checked.
