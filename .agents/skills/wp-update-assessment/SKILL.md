---
name: wp-update-assessment
description: Assess compatibility with new WordPress releases, scan for PHP deprecations, validate schemas, and run block rendering tests.
---

# WordPress Update Assessment Skill

Use this skill when evaluating a newly announced WordPress release, bumping the target WordPress version, or verifying that plugins and themes in this repository will continue working seamlessly.

## Quick Command

To assess compatibility against a specific WordPress version (e.g. 6.8):

```bash
npm run assess:wp -- 6.8
```

Or run baseline assessment against the current configuration:

```bash
npm run assess:wp
```

---

## What the Assessment Checks

1. **Theme & Block Schema Validation (`scripts/validate-schemas.mjs`)**:
   - Inspects `themes/eee-theme/theme.json` schema version and settings.
   - Inspects all custom blocks in `plugins/eee23-blocks/src/blocks/*/block.json`.
   - Flags `__experimental*` features that may change or be deprecated across major WordPress updates.
   - Validates `apiVersion` (recommends upgrading from v2 to v3 for modern iframe/editor features).

2. **Custom Block Serialization & Invalidation (Jest)**:
   - Tests all custom blocks (`grid`, `grid-col`, `stage-homepage`, `teaser-image-text`).
   - Ensures blocks register with core, serialize valid markup, and parse back without block invalidation warnings.

3. **PHP Deprecation & Compatibility Scan (PHPCompatibilityWP / WPCS via Docker)**:
   - Checks all PHP code in `themes/` and `plugins/` against target WordPress deprecations and PHP 8.2 standards.
   - Runs cleanly inside Docker composer container: `docker compose run --rm composer phpcs --runtime-set minimum_supported_wp_version <version>`.

4. **PHPStan Static Analysis & Deprecation Rules (Level 6 via Docker)**:
   - Evaluates code against `php-stubs/wordpress-stubs` and `phpstan-deprecation-rules`.
   - Catches deprecated core function signatures and parameter changes.

---

## Update Assessment Procedure

When a new WordPress version is released:

### Step 1: Run the Assessment
```bash
npm run assess:wp -- <new_version>
```

### Step 2: Review the Scorecard
- **PASS**: The repository has no breaking changes for this version.
- **WARN**: The codebase runs fine, but advisories exist (e.g. experimental attributes, apiVersion upgrades, or non-breaking warnings).
- **FAIL**: Breaking deprecations or invalidations were caught. Review the failed step log.

### Step 3: Resolving Common Update Advisories
- **Block apiVersion**: If upgrading `apiVersion: 2` to `3`, verify whether iframe-isolated editor styles are needed.
- **Deprecated PHP Functions**: Replace deprecated functions with their recommended replacements as noted in the WPCS or PHPStan output.
- **Updating WordPress Stubs**: Update `composer.json` stubs when testing against new releases:
  ```bash
  docker compose run --rm composer require --dev php-stubs/wordpress-stubs:^<new_version>
  ```
- **Updating Block Packages**:
  ```bash
  npm --prefix plugins/eee23-blocks run packages-update
  ```
