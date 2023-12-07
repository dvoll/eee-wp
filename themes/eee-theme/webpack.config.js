// WordPress webpack config.
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Utilities.
const path = require('path');

// Add any a new entry point by extending the webpack config.
module.exports = {
    ...defaultConfig,
    ...{
        entry: {
            'js/view': path.resolve(process.cwd(), 'resources', 'view.js'),
            'js/editor': path.resolve(process.cwd(), 'resources', 'editor.js'),
            'css/block-styles': path.resolve(process.cwd(), 'resources', 'styles/block-styles.scss'),
        },
    },
};
