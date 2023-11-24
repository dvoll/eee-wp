<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * EEE Theme 2023 functions and definitions
 */


// if ( ! function_exists( 'eee_theme_23_support' ) ) :

// 	/**
// 	 * Sets up theme defaults and registers support for various WordPress features.
// 	 *
// 	 * @return void
// 	 */
// 	function eee_theme_23_support() {

// 		// Add support for block styles.
// 		add_theme_support( 'wp-block-styles' );

// 		// Enqueue editor styles.
// 		add_editor_style( 'style.css' );

// 	}

// endif;

// add_action( 'after_setup_theme', 'eee_theme_23_support' );

if ( ! function_exists( 'eee_theme_23_styles' ) ) :

	/**
	 * Enqueue styles.
	 *
	 * @since Twenty Twenty-Two 1.0
	 *
	 * @return void
	 */
	function eee_theme_23_styles() {
		// Register theme stylesheet.
		$theme_version = wp_get_theme()->get( 'Version' );

		// @phpstan-ignore-next-line
		$version_string = is_string( $theme_version ) ? $theme_version : false;
		wp_register_style(
			'eee_theme_23-style',
			get_template_directory_uri() . '/style.css',
			array(),
			$version_string
		);

		// Enqueue theme stylesheet.
		wp_enqueue_style( 'eee_theme_23-style' );

		$script_asset = include get_parent_theme_file_path( 'public/js/view.asset.php' );
		// Add view.js script
		wp_register_script(
			'eee_theme_23-script',
			get_parent_theme_file_uri( 'public/js/view.js' ),
			$script_asset['dependencies'],
			$script_asset['version'],
			true // add to footer
		);
		wp_enqueue_script( 'eee_theme_23-script' );

	}

endif;

add_action( 'wp_enqueue_scripts', 'eee_theme_23_styles' );

// function eee_theme_23_add_editor_script(): void {
// 	$script_asset = include get_parent_theme_file_path( 'public/js/editor.asset.php' );

// 	wp_enqueue_script(
// 		'eee-theme-23-editor',
// 		get_parent_theme_file_uri( 'public/js/editor.js' ),
// 		$script_asset['dependencies'],
// 		$script_asset['version'],
// 		true
// 	);
// }
// add_action( 'enqueue_block_editor_assets', 'eee_theme_23_add_editor_script' );


function eee_theme_23_include_svg_icons(): void {
	// Define SVG sprite file.
	$svg_icons = get_parent_theme_file_path( '/assets/icons/svg-sprite.html' );
	$svg_template = get_parent_theme_file_path( '/assets/icons/svg-template.html' );

	error_log( file_exists( $svg_icons ) ? 'true' : 'no' );

	// If it exists, include it.
	if ( file_exists( $svg_icons ) && file_exists( $svg_template ) ) {
		require_once( $svg_icons );
		require_once( $svg_template );
	}
}
add_action( 'wp_footer', 'eee_theme_23_include_svg_icons', 9999 );
