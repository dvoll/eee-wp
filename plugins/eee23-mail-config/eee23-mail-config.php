<?php
/**
 * Plugin Name:     EEE 23 Mail Config
 * Plugin URI:      https://daario.de
 * Description:     Sets SMTP Mail config for development and production
 * Author:          Dario Voll
 * Author URI:      https://daario.de
 * Text Domain:     eee23-mail-config
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Eee23_Mail_Config
 */


add_action( 'phpmailer_init', function (\PHPMailer\PHPMailer\PHPMailer $php_mailer) {
	if (
		defined( 'EEE_SMTP_HOST' ) &&
		defined( 'EEE_SMTP_PORT' ) &&
		defined( 'EEE_SMTP_ENCRYPTION' ) &&
		defined( 'EEE_SMTP_USER' ) &&
		defined( 'EEE_SMTP_PASS' )
	) {
		$php_mailer->IsSMTP();
		$php_mailer->Host = EEE_SMTP_HOST;
		$php_mailer->Port = EEE_SMTP_PORT;
		$php_mailer->SMTPSecure = EEE_SMTP_ENCRYPTION;
		$php_mailer->SMTPAuth = true;
		$php_mailer->Username = EEE_SMTP_USER;
		$php_mailer->Password = EEE_SMTP_PASS;
	}
}, 10 );

add_action( 'init', function () {
	if (
		defined( 'EEE_SMTP_FROM' )
	) {
		add_filter( 'wp_mail_from', fn( $email ) => EEE_SMTP_FROM );
	}
	if (
		defined( 'EEE_SMTP_FROM_NAME' )
	) {
		add_filter( 'wp_mail_from_name', fn( $name ) => EEE_SMTP_FROM_NAME );
	}
} );

add_filter( 'form_block_recipients', function ($recipients) {
	if ( defined( 'EEE_FORM_RECIPIENT' ) ) {
		return [ EEE_FORM_RECIPIENT ];
	}
	return [ 'kontakt@wordpress.local' ];
}, 10, 1 );

/**
 * @param WP_Error $wp_error
 * @return void
 */
function eee_action_wp_mail_failed( $wp_error ): void {
	if ( wp_get_environment_type() === 'development' ) {
		error_log( print_r( $wp_error, true ) );
	}
}
add_action( 'wp_mail_failed', 'eee_action_wp_mail_failed', 10, 1 );


// add_action( 'init', function () {
// 	// Example inside the the init hook to ensure that the PHPMailer settings are applied before trying to send the email.
// 	wp_mail( 'josh@bonnick.dev', 'Test Email', 'Hello Mailhog' );
// } );
