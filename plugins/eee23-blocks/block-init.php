<?php
/**
 * Plugin Name:       EEE 2023 Blocks Plugin
 * Description:       Blocks for EEE 2023
 * Requires at least: 6.2
 * Requires PHP:      8.0
 * Version:           0.1.0
 * Author:            Dario Voll
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       eee23-blocks
 *
 * @package           eee23-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function eee23_blocks_block_init(): void {
	register_block_type( __DIR__ . '/build/blocks/teaser-image-text' );
}
add_action( 'init', 'eee23_blocks_block_init' );


/**
 * Add custom image size for teaser-image-text block
 */
function eee23_blocks_image_sizes(): void {
	add_image_size( 'eee23-blocks-teaser', 344, 516 );
}
add_action( 'after_setup_theme', 'eee23_blocks_image_sizes' );
