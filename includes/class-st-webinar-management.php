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

		/*
		A.
		if ( is_admin() ) {
			include_once ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/includes/admin/class-st-webinar-management-admin.php';
		}
		*/

		add_action( 'init', array( $this, 'st_webinar_management_init' ) );
	}


	/**
	 * Performs plugin activation steps.
	 */
	public function activate() {

		// Create the custom role 'speaker' with enhanced capabilities.
		add_role(
			'speaker',
			__( 'Speaker', 'st-webinar-management' ),
			array(
				'read'         => true, // Allow basic reading permissions.
				'edit_posts'   => false, // Prevent post editing by default.
				'delete_posts' => false, // Prevent post deletion by default.
			)
		);

		// Add custom rewrite rule for top-level URLs.
		add_rewrite_rule(
			'^([^/]*)/?', // Match any single term (e.g., /stock-market/).
			'index.php?webinar_type=$matches[1]', // Rewrite to taxonomy query.
			'top' // Priority (optional, default is "top").
		);

		// Flush rewrite rules.
		flush_rewrite_rules();

	}

	/**
	 * Registers custom post type and custom taxonomy on init.
	 *
	 * @return void
	 */
	public function st_webinar_management_init() {
		// Create the custom post type 'webinar'.
		register_post_type(
			'webinar',
			array(
				'labels'          => array(
					'name'          => __( 'Webinar Management', 'st-webinar-management' ),
					'singular_name' => __( 'Webinar', 'st-webinar-management' ),
				),
				'public'          => true,
				'has_archive'     => true,
				'supports'        => array( 'title', 'editor', 'thumbnail' ), // Add basic support.
				'menu_icon'       => 'dashicons-megaphone',
				'show_in_rest'    => true,
				'capability_type' => 'post',
				'custom_fields'   => array(
					// Custom fields for webinar details.
					'webinar_subtitle'          => array(
						'label' => __( 'Subtitle', 'st-webinar-management' ),
					),
					'webinar_start_time'        => array(
						'label' => __( 'Start Time (Datetime)', 'st-webinar-management' ),
						'type'  => 'datetime-local', // Use specific type.
					),
					'webinar_end_time'          => array(
						'label' => __( 'End Time (Datetime)', 'st-webinar-management' ),
						'type'  => 'datetime-local', // Use specific type.
					),
					'webinar_duration'          => array(
						'label' => __( 'Duration', 'st-webinar-management' ),
					),
					'webinar_description'       => array(
						'label' => __( 'Description', 'st-webinar-management' ),
						'type'  => 'string', // Allows HTML by default.
					),
					'webinar_registration_form' => array(
						'label' => __( 'Registration Form', 'st-webinar-management' ),
						'type'  => 'string', // Use for storing form code (e.g., shortcode).
					),
					'webinar_streaming_link'    => array(
						'label' => __( 'Streaming Platform Link', 'st-webinar-management' ),
						'type'  => 'string', // URL.
					),
					'webinar_highlights'        => array( // Array for storing multiple highlights.
						'label'      => __( 'Highlights', 'st-webinar-management' ),
						'type'       => 'repeater', // Use a repeater field plugin for this.
						'sub_fields' => array(
							'highlight_time'        => array(
								'label' => __( 'Highlight Time', 'st-webinar-management' ),
								'type'  => 'time',
							),
							'highlight_description' => array(
								'label' => __( 'Highlight Description', 'st-webinar-management' ),
								'type'  => 'string',
							),
						),
					),
				),
			)
		);

		// Create the custom taxonomy 'webinar_category'.
		$labels = array(
			'name'          => _x( 'Webinar Types', 'Taxonomy general name', 'st-webinar-management' ),
			'singular_name' => _x( 'Webinar Types', 'Taxonomy singular name', 'st-webinar-management' ),
			'menu_name'     => __( 'Webinar Types', 'st-webinar-management' ),
			// ... other standard taxonomy label definitions ...
		);
		// Register custom taxonomy "webinar_type" (hierarchical for categories).
		register_taxonomy(
			'webinar_type',
			array( 'webinar' ), // Post type associated with the taxonomy.
			array(
				'hierarchical' => true, // Set to "false" for non-hierarchical (tags).
				'labels'       => $labels,
				'rewrite'      => array( // Define rewrite rules.
					'slug'       => '', // No slug in the URL (top-level).
					'with_front' => false, // Remove "index.php" in permalinks.
				),
			)
		);

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
