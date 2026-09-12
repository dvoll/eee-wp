import { spawnSync } from 'node:child_process';
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
    dim: '\x1b[2m',
};

// Target WordPress version from CLI argument, default to 6.8
const args = process.argv.slice(2);
const targetVersion = args[0] && !args[0].startsWith('-') ? args[0] : '6.8';

console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}   WordPress Update Assessment Runner${colors.reset}`);
console.log(`${colors.bold}   Targeting WordPress Core: ${colors.green}${targetVersion}${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

const results = [];

function runStep(name, cmd, cmdArgs, opts = {}) {
    console.log(`${colors.bold}▶ Running: ${name}...${colors.reset}`);
    const start = Date.now();
    const result = spawnSync(cmd, cmdArgs, {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['inherit', 'pipe', 'pipe'],
        ...opts,
    });
    const duration = ((Date.now() - start) / 1000).toFixed(1);

    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    const isSuccess = result.status === 0;

    // Check for real warnings based on tool output
    let hasWarnings = false;
    if (name.includes('Schema')) {
        hasWarnings = stdout.includes('Warnings: ') && !stdout.includes('Warnings: 0') && !stdout.includes('Warnings: \x1b[32m0');
    } else if (name.includes('PHP Compatibility')) {
        hasWarnings = stdout.includes('WARNING');
    } else if (name.includes('PHPStan')) {
        hasWarnings = !stdout.includes('[OK] No errors');
    }

    let status = 'PASS';
    if (!isSuccess) {
        status = 'FAIL';
    } else if (hasWarnings) {
        status = 'WARN';
    }

    results.push({
        name,
        status,
        duration: `${duration}s`,
        output: stdout + (stderr ? `\n${stderr}` : ''),
    });

    if (status === 'PASS') {
        console.log(`  ${colors.green}✔ Finished in ${duration}s (Passed)${colors.reset}\n`);
    } else if (status === 'WARN') {
        console.log(`  ${colors.yellow}⚠ Finished in ${duration}s (Warnings detected)${colors.reset}\n`);
    } else {
        console.log(`  ${colors.red}✖ Failed in ${duration}s (Exit code: ${result.status})${colors.reset}\n`);
    }

    return { status, stdout, stderr };
}

// 1. Theme & Block Schema Validation
runStep(
    'WordPress Theme & Block Schema Validation',
    'node',
    ['scripts/validate-schemas.mjs']
);

// 2. Custom Block Serialization & Invalidation (Jest)
runStep(
    'Custom Gutenberg Block Rendering & Invalidation',
    'npm',
    ['--prefix', 'plugins/eee23-blocks', 'run', 'test', '--', '--ci']
);

// 3. PHP Compatibility & Deprecations (via Docker Composer)
runStep(
    `PHP Compatibility & WP Deprecations (${targetVersion})`,
    'docker',
    [
        'compose',
        'run',
        '--rm',
        'composer',
        'vendor/bin/phpcs',
        '--runtime-set',
        'minimum_supported_wp_version',
        targetVersion,
    ]
);

// 4. PHPStan Static Analysis & Deprecation Rules (via Docker Composer)
runStep(
    'PHPStan Static Analysis & Deprecations (Level 6)',
    'docker',
    ['compose', 'run', '--rm', 'composer', 'run', 'phpstan']
);

// Summary Table
console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}              ASSESSMENT SCORECARD                  ${colors.reset}`);
console.log(`${colors.bold}  Target WordPress Version: ${colors.green}${targetVersion}${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);

console.log(`┌─────────────────────────────────────────────────────────────┬──────────┬──────────┐`);
console.log(`│ Check                                                       │ Status   │ Duration │`);
console.log(`├─────────────────────────────────────────────────────────────┼──────────┼──────────┤`);

for (const r of results) {
    const paddedName = r.name.padEnd(59);
    let colorStatus;
    if (r.status === 'PASS') colorStatus = `${colors.green}PASS    ${colors.reset}`;
    else if (r.status === 'WARN') colorStatus = `${colors.yellow}WARN    ${colors.reset}`;
    else colorStatus = `${colors.red}FAIL    ${colors.reset}`;

    const paddedDuration = r.duration.padStart(8);
    console.log(`│ ${paddedName} │ ${colorStatus} │ ${paddedDuration} │`);
}
console.log(`└─────────────────────────────────────────────────────────────┴──────────┴──────────┘`);

const totalFailures = results.filter((r) => r.status === 'FAIL').length;
const totalWarnings = results.filter((r) => r.status === 'WARN').length;

console.log(`\n${colors.bold}Assessment Outcome:${colors.reset}`);
if (totalFailures === 0 && totalWarnings === 0) {
    console.log(`${colors.green}${colors.bold}✔ ALL CHECKS PASSED.${colors.reset} Repository is fully compatible with WordPress ${targetVersion}.`);
} else if (totalFailures === 0) {
    console.log(`${colors.yellow}${colors.bold}⚠ COMPATIBLE WITH ADVISORIES (${totalWarnings} check(s) with warnings).${colors.reset}`);
    console.log(`  The codebase does not contain breaking failures for WordPress ${targetVersion}, but consider reviewing warnings.`);
} else {
    console.log(`${colors.red}${colors.bold}✖ ISSUES DETECTED (${totalFailures} check(s) failed).${colors.reset}`);
    console.log(`  Action is required before upgrading to WordPress ${targetVersion}.`);
}

// Print actionable guidance if issues found
if (totalFailures > 0 || totalWarnings > 0) {
    console.log(`\n${colors.bold}Actionable Remediation Guidance:${colors.reset}`);
    for (const r of results) {
        if (r.status === 'FAIL' || r.status === 'WARN') {
            console.log(`\n${colors.bold}[${r.name}]${colors.reset}`);
            if (r.name.includes('Schema')) {
                console.log('  • Check block.json apiVersion and consider upgrading from v2 to v3.');
                console.log('  • Audit __experimental* properties in block.json files for core standardization.');
            } else if (r.name.includes('PHP Compatibility')) {
                console.log('  • Inspect flagged deprecated WordPress functions/parameters in output.');
                console.log('  • Replace deprecated core functions with modern equivalents.');
            } else if (r.name.includes('PHPStan')) {
                console.log('  • Resolve type mismatches or update stubs via: composer update php-stubs/wordpress-stubs');
            } else if (r.name.includes('Rendering')) {
                console.log('  • Review block save.js outputs to ensure serialized markup matches fixtures without invalidation.');
            }
        }
    }
}

console.log('');
process.exit(totalFailures > 0 ? 1 : 0);
