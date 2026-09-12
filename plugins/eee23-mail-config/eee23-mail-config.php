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
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- PHPMailer uses PascalCase properties
		$php_mailer->Host = EEE_SMTP_HOST;
		$php_mailer->Port = (int) EEE_SMTP_PORT;
		$php_mailer->SMTPSecure = EEE_SMTP_ENCRYPTION;
		$php_mailer->SMTPAuth = true;
		$php_mailer->Username = EEE_SMTP_USER;
		$php_mailer->Password = EEE_SMTP_PASS;
		// phpcs:enable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	}
}, 10 );

add_action( 'init', function () {
	if (
		defined( 'EEE_SMTP_FROM' )
	) {
		add_filter( 'wp_mail_from', fn() => sanitize_email( (string) EEE_SMTP_FROM ) );
	}
	if (
		defined( 'EEE_SMTP_FROM_NAME' )
	) {
		add_filter( 'wp_mail_from_name', fn() => sanitize_text_field( (string) EEE_SMTP_FROM_NAME ) );
	}
} );

add_filter( 'form_block_recipients', function () {
	if ( defined( 'EEE_FORM_RECIPIENT' ) ) {
		return [ sanitize_email( (string) EEE_FORM_RECIPIENT ) ];
	}
	return [ 'kontakt@wordpress.local' ];
}, 10, 1 );

/**
 * @param WP_Error $wp_error
 * @return void
 */
function eee_action_wp_mail_failed( $wp_error ): void {
	if ( wp_get_environment_type() === 'development' ) {
		error_log( print_r( $wp_error, true ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log,WordPress.PHP.DevelopmentFunctions.error_log_print_r -- Intentional dev-only logging guarded by environment check.
	}
}
add_action( 'wp_mail_failed', 'eee_action_wp_mail_failed', 10, 1 );
