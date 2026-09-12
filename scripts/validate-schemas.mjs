import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
};

function logSuccess(msg) {
    console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function logWarn(msg) {
    console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
}

function logError(msg) {
    console.log(`${colors.red}✗${colors.reset} ${msg}`);
}

let errorCount = 0;
let warnCount = 0;

/**
 * Validate theme.json structure and compatibility
 */
function validateThemeJson() {
    const themeJsonPath = path.join(rootDir, 'themes/eee-theme/theme.json');
    console.log(`\n${colors.bold}Validating theme.json...${colors.reset}`);

    if (!fs.existsSync(themeJsonPath)) {
        logError(`theme.json not found at ${themeJsonPath}`);
        errorCount++;
        return;
    }

    try {
        const content = fs.readFileSync(themeJsonPath, 'utf8');
        const theme = JSON.parse(content);

        // Check schema
        if (!theme.$schema) {
            logWarn('theme.json is missing "$schema" property.');
            warnCount++;
        } else {
            logSuccess(`Schema defined: ${theme.$schema}`);
        }

        // Check version
        if (!theme.version) {
            logError('theme.json is missing required "version" property.');
            errorCount++;
        } else if (theme.version < 2) {
            logWarn(`theme.json version is ${theme.version}. Version 2 or 3 is recommended for WordPress 6.0+`);
            warnCount++;
        } else {
            logSuccess(`theme.json version: ${theme.version}`);
        }

        // Validate top-level keys
        const allowedKeys = new Set([
            '$schema',
            'version',
            'settings',
            'styles',
            'customTemplates',
            'templateParts',
            'patterns',
            'title',
            'description',
        ]);

        Object.keys(theme).forEach((key) => {
            if (!allowedKeys.has(key)) {
                logWarn(`Unknown top-level key in theme.json: "${key}"`);
                warnCount++;
            }
        });

        // Check settings and styles presence
        if (theme.settings) {
            logSuccess('theme.json settings block is valid.');
        }
        if (theme.styles) {
            logSuccess('theme.json styles block is valid.');
        }
    } catch (err) {
        logError(`Failed to parse theme.json: ${err.message}`);
        errorCount++;
    }
}

/**
 * Validate all block.json files in plugins/eee23-blocks/src/blocks
 */
function validateBlockJsons() {
    const blocksDir = path.join(rootDir, 'plugins/eee23-blocks/src/blocks');
    console.log(`\n${colors.bold}Validating custom block.json files...${colors.reset}`);

    if (!fs.existsSync(blocksDir)) {
        logError(`Blocks directory not found at ${blocksDir}`);
        errorCount++;
        return;
    }

    const entries = fs.readdirSync(blocksDir, { withFileTypes: true });
    const blockFolders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    if (blockFolders.length === 0) {
        logWarn('No custom block directories found.');
        return;
    }

    for (const folder of blockFolders) {
        const blockJsonPath = path.join(blocksDir, folder, 'block.json');
        console.log(`\nChecking block: ${colors.cyan}${folder}${colors.reset}`);

        if (!fs.existsSync(blockJsonPath)) {
            logError(`Missing block.json in ${folder}`);
            errorCount++;
            continue;
        }

        try {
            const raw = fs.readFileSync(blockJsonPath, 'utf8');
            const block = JSON.parse(raw);

            // Check name
            if (!block.name || !block.name.includes('/')) {
                logError(`Invalid block name in ${folder}: "${block.name}". Must be in "namespace/block-name" format.`);
                errorCount++;
            } else {
                logSuccess(`Name: ${block.name}`);
            }

            // Check apiVersion
            if (!block.apiVersion) {
                logWarn(`Block "${folder}" does not declare "apiVersion" (defaults to v1). apiVersion 2 or 3 recommended.`);
                warnCount++;
            } else if (block.apiVersion < 3) {
                logWarn(`Block "${folder}" uses apiVersion ${block.apiVersion}. Consider upgrading to apiVersion 3 for full iframe & modern editor support.`);
                warnCount++;
            } else {
                logSuccess(`apiVersion: ${block.apiVersion}`);
            }

            // Check title & category
            if (!block.title) {
                logError(`Block "${folder}" is missing "title".`);
                errorCount++;
            }
            if (!block.category) {
                logError(`Block "${folder}" is missing "category".`);
                errorCount++;
            }

            // Check file references
            const checkFileRef = (field, relPath) => {
                if (!relPath) return;
                const cleanPath = relPath.replace(/^file:\.\//, './');
                const resolved = path.join(blocksDir, folder, cleanPath);
                // Also check if src has tsx/ts/scss equivalent
                const exists =
                    fs.existsSync(resolved) ||
                    fs.existsSync(resolved.replace(/\.js$/, '.tsx')) ||
                    fs.existsSync(resolved.replace(/\.js$/, '.ts')) ||
                    fs.existsSync(resolved.replace(/\.css$/, '.scss'));
                if (!exists) {
                    logWarn(`Block "${folder}" references ${field} "${relPath}" which was not found locally in src/`);
                    warnCount++;
                }
            };

            checkFileRef('editorScript', block.editorScript);
            checkFileRef('editorStyle', block.editorStyle);
            checkFileRef('style', block.style);

            // Check for __experimental usage
            const rawStr = JSON.stringify(block);
            const experimentalMatches = rawStr.match(/"__experimental[^"]*"/g);
            if (experimentalMatches) {
                const uniqueExperimental = [...new Set(experimentalMatches)];
                logWarn(`Block "${folder}" uses experimental flags (${uniqueExperimental.join(', ')}). Check for stabilization in upcoming WordPress updates.`);
                warnCount++;
            }
        } catch (err) {
            logError(`Failed to parse block.json in ${folder}: ${err.message}`);
            errorCount++;
        }
    }
}

console.log(`${colors.bold}=== WordPress Schema & Metadata Validation ===${colors.reset}`);
validateThemeJson();
validateBlockJsons();

console.log(`\n${colors.bold}--- Schema Validation Summary ---${colors.reset}`);
console.log(`Errors:   ${errorCount === 0 ? colors.green : colors.red}${errorCount}${colors.reset}`);
console.log(`Warnings: ${warnCount === 0 ? colors.green : colors.yellow}${warnCount}${colors.reset}`);

if (errorCount > 0) {
    console.error(`\n${colors.red}Schema validation failed with ${errorCount} error(s).${colors.reset}`);
    process.exit(1);
} else {
    console.log(`\n${colors.green}All schema and metadata validations passed!${colors.reset}`);
    process.exit(0);
}
