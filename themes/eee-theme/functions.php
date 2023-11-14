<?php
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


		// Add view.js script
		wp_register_script(
			'eee_theme_23-script',
			get_template_directory_uri() . '/view.js',
			array(),
			$version_string,
			true // add to footer
		);
		wp_enqueue_script( 'eee_theme_23-script' );

	}

endif;

add_action( 'wp_enqueue_scripts', 'eee_theme_23_styles' );
