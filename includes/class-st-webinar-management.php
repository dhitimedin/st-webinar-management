<?php
/**
 * File containing the class ST_Webinar_Management.
 *
 * @package st-webinar-management
 * @since   1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles core plugin hooks and action setup.
 *
 * @since 1.0.0
 */
class ST_Webinar_Management {

	/**
	 * The single instance of the class.
	 *
	 * @var self
	 * @since  1.0.0
	 */
	private static $instance = null;

	/**
	 * Main Webinar Management Instance.
	 *
	 * Ensures only one instance of Webinar Management is loaded or can be loaded.
	 *
	 * @since  1.0.0
	 * @static
	 * @see SWM()
	 * @return self Main instance.
	 */
	public static function instance() {
		self::$instance = self::$instance ?? new self();
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Includes.
		if ( is_admin() ) {
			include_once ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/includes/admin/class-st-webinar-management-admin.php';
		}

	}


	/**
	 * Performs plugin activation steps.
	 */
	public function activate() {
	}

	/**
	 * Solves the loading order issue which occurs when is_admin() starts to return true at a point after plugin
	 * load.
	 *
	 * @since 1.0.0
	 */
	public function include_admin_files() {
		if ( is_admin() && ! class_exists( 'ST_Webinar_Management_Admin' ) ) {
			include_once ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/includes/admin/class-st-webinar-management-admin.php';
		}
	}

}
