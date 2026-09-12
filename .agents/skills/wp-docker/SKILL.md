---
name: wp-docker
description: >-
  Manage the local WordPress Docker environment, run WP-CLI commands, inspect WordPress debug logs, and control container lifecycle.
---

# WordPress Docker Environment Guide

This project runs a containerized WordPress development environment using Docker Compose.

## Services Architecture

- **wordpress**: Apache + PHP 8.2 (`wordpress:6.4` base image with custom php.ini). Exposed on port `8086` (`http://localhost:8086`).
- **db**: MariaDB database container exposed on port `3306`.
- **mailhog**: Local SMTP testing server. Web UI at `http://localhost:8025`, SMTP port `1025`.
- **wp-cli**: WordPress CLI container (`wordpress:cli`) configured to interact with the database and WordPress install.
- **composer**: Composer CLI container (`composer:lts`) for running PHP package operations and PHPStan without host PHP dependencies.

## Key Runbooks and Commands

### Starting and Stopping the Environment

```bash
# Start all services in the background
docker compose up -d

# Check running status of all containers
docker compose ps

# Stop all containers
docker compose down

# View logs from all services or a specific service
docker compose logs -f wordpress
```

### Running WP-CLI Commands

The host environment provides an alias:
```bash
docker-wp <command>
```
Which maps to:
```bash
docker compose run --rm wp-cli <command>
```

#### Common WP-CLI Operations
```bash
# Check WordPress version and status
docker compose run --rm wp-cli core version
docker compose run --rm wp-cli status

# List plugins and their status
docker compose run --rm wp-cli plugin list

# Activate custom project plugins
docker compose run --rm wp-cli plugin activate eee23-blocks
docker compose run --rm wp-cli plugin activate eee23-mail-config

# Clear object cache / transients
docker compose run --rm wp-cli cache flush

# Export / import database
docker compose run --rm wp-cli db export backup.sql
docker compose run --rm wp-cli db import backup.sql
```

### Reading Debug Logs

WordPress is configured with `WP_DEBUG: 1`, `WP_DEBUG_LOG: true`, and `SCRIPT_DEBUG: true`. To inspect PHP errors, warnings, and custom debug logs:

```bash
docker compose exec -t wordpress tail -f /var/www/html/wp-content/debug.log
```

### Mail Testing with MailHog

All emails sent via `wp_mail()` are routed by the `eee23-mail-config` plugin to the local MailHog service (`mailhog:1025`).
- Access the Web Mailbox at: `http://localhost:8025`
