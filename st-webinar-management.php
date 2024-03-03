<?php
/**
 * Plugin Name:       Webinar Management Plugin
 * Description:       Streamline webinar management directly from your WordPress site.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4.1
 * Author:            Sagacitas Technologies Pvt. Ltd.
 * Author URI:        https://linkedin.com/in/nisitkumar
 * License:           GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.en.html
 * Text Domain:       st-webinar-management
 * Domain Path:       /languages
 *
 * @package st-webinar-management
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No skiddies please!' );
}

// Define constants.
define( 'ST_WEBINAR_MANAGEMENT_VERSION', '1.0.1' );
define( 'ST_WEBINAR_MANAGEMENT_PLUGIN_DIR', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define(
	'ST_WEBINAR_MANAGEMENT_PLUGIN_URL',
	untrailingslashit( plugins_url( basename( plugin_dir_path( __FILE__ ) ), basename( __FILE__ ) ) ),
);
define( 'ST_WEBINAR_MANAGEMENT_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
// Shared UI Version.
if ( ! defined( 'ST_WEBINAR_MANAGEMENT_SUI_VERSION' ) ) {
	define( 'ST_WEBINAR_MANAGEMENT_SUI_VERSION', '2.12.23' );
}

/**
 * Includes class ST_Webinar_Management_Dependency_Checker and checks for plugins
 * environment dependecies. Exits early if not met.
 */
require_once dirname( __FILE__ ) .
	'/includes/class-st-webinar-management-dependency-checker.php';

if ( ! ST_Webinar_Management_Dependency_Checker::check_dependencies() ) {
	return;
}

/**
 * Includes class ST_Webinar_Management for execution of the core functionalities
 */
require_once dirname( __FILE__ ) . '/includes/class-st-webinar-management.php';

/**
 * Main instance of Webinar Management.
 *
 * Returns the main instance of ST's Webinar Management to prevent the need to use globals.
 *
 * @since  1.0.0
 * @return ST_Webinar_Management
 */
function SWM() { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName
	return ST_Webinar_Management::instance();
}

$GLOBALS['st_connector_app'] = SWM();

// Activation - works with symlinks.
register_activation_hook(
	basename( dirname( __FILE__ ) ) . '/' . basename( __FILE__ ),
	array( SWM(), 'activate' )
);

// register_deactivation_hook( __FILE__, array( SWMC(), 'unschedule_cron_jobs' ) );
// Cleanup on deactivation.
