---
name: gutenberg-blocks
description: >-
  Develop, build, lint, and register custom WordPress Gutenberg blocks in plugins/eee23-blocks.
---

# Gutenberg Block Development Guide

Custom blocks for this project are housed in `plugins/eee23-blocks/`. They are modern WordPress Gutenberg blocks developed with React, `@wordpress/scripts`, and `block.json` metadata.

## Directory Structure

```text
plugins/eee23-blocks/
├── src/
│   ├── index.js                # Main script registering block styles or shared logic
│   └── blocks/                 # Block source directories
│       ├── <block-name>/
│       │   ├── block.json      # Metadata, attributes, supports, asset references
│       │   ├── index.js        # Block registration (edit, save, attributes)
│       │   ├── edit.js         # Editor React component
│       │   ├── save.js         # Frontend save function (or null for dynamic blocks)
│       │   ├── style.scss      # Frontend + editor styles
│       │   └── index.scss      # Editor-only styles
└── build/                      # Auto-generated compilation output (DO NOT edit directly)
    └── blocks/
        └── <block-name>/
```

## Build and Development Commands

You can run build commands either from the repository root or within the plugin folder:

### From Repository Root
```bash
# Build all blocks for production
npm run build:blocks

# Start watch mode during active block development
npm run start:blocks

# Lint JavaScript and CSS
npm run lint:blocks

# Automatically format block source code
npm run format:blocks
```

### From `plugins/eee23-blocks`
```bash
npm run build
npm run start
npm run lint:js
npm run lint:css
npm run format
```

## Registering a New Block

When creating a new block:
1. Create a new folder under `plugins/eee23-blocks/src/blocks/<block-name>/`.
2. Provide `block.json` specifying `"apiVersion": 3` (or 2), `$schema`, `name` (`eee23-blocks/<block-name>`), `title`, `attributes`, and assets.
3. Register the block in `plugins/eee23-blocks/eee23-blocks.php`:
   ```php
   register_block_type( __DIR__ . '/build/blocks/<block-name>' );
   ```
4. Run `npm run build:blocks` to generate the build artifacts.
5. In the WordPress admin or via WP-CLI, verify the block is registered and available.

## Rules & Best Practices

- **Never edit files in `build/`**: Always make changes in `src/` and run `npm run build:blocks`.
- **Attribute Schema**: Ensure all attributes used in `edit.js` and `save.js` are declared with their respective types and defaults in `block.json`.
- **Block Validation**: If you change the markup produced by `save.js` for an existing block with existing posts, implement a `deprecated` block definition to avoid block invalidation errors in the editor.
- **Dynamic vs Static**:
  - For server-rendered (dynamic) blocks, `save` should return `null` or `<InnerBlocks.Content />`, and a PHP render callback / `render.php` should be used.
  - For static blocks, `save.js` produces HTML markup stored directly in `post_content`.
