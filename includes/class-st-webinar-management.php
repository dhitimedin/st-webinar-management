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
		// include_once ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/includes/class-st-webinar-highlights.php';

		add_action( 'init', array( $this, 'st_webinar_management_init' ) );

		add_action( 'init', array( $this, 'st_register_webinar_blocks' ) );

		add_action( 'init', array( $this, 'st_register_post_meta' ) );

		add_action( 'save_post', array( $this, 'save_webinar_block' ), 10, 2 );

		// Restrict allowed block type for webinar custom post to paragraph and highlights.
		add_filter( 'allowed_block_types_all', array( $this, 'restrict_webinar_blocks' ), 10, 2 );
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
				'supports'        => array(
					'title',
					'editor',
					'thumbnail',
					'custom-fields',
				), // Add basic support.
				'menu_icon'       => 'dashicons-megaphone',
				'show_in_rest'    => true,
				'capability_type' => 'post',
				'rewrite'         => array( 'slug' => 'webinar' ),
				'taxonomies'      => array( 'webinar_type' ), // Assign webinar_type taxonomy.
				'template'        => array(
					array( 'st-webinar-management/webinar' ),
					array( 'st-webinar-management/highlight' ),
				),
				'template_lock'   => 'all',
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
				'show_in_rest' => true,
			)
		);

	}


	/**
	 * Registers the blocks webinar and highlihts.
	 *
	 * @return void
	 */
	public function st_register_webinar_blocks() {
		register_block_type( ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/assets/webinar' );
		register_block_type( ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/assets/highlight' );
	}


	/**
	 * Register custom meta fields for webinar post.
	 *
	 * @return void
	 */
	public function st_register_post_meta() {
		// Registering custom post meta.
		$custom_fields = array(
			'subtitle'         => array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'startDate'        => array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'endDate'          => array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'duration'         => array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'description'      => array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'registrationForm' => array(
				'type'              => 'string',
				'sanitize_callback' => 'esc_url',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'streamingLink'    => array(
				'type'              => 'string',
				'sanitize_callback' => 'esc_url',
				'show_in_rest'      => true,
				'single'            => true,
			),
			'speakers'         => array(
				'type'              => 'array',
				'show_in_rest'      => array(
					'schema' => array(
						'items' => array(
							'type' => 'object',
							'properties' => array(
								'id'          => array(
									'type' => 'integer', // Assuming speaker ID is an integer
								),
								'name'        => array(
									'type' => 'string',
								),
								'description' => array(
									'type' => 'string',
								),
								'avatar_urls' => array(
									'type' => 'string', // Assuming avatar_urls is an object.
								),
							),
						),
					),
				),
				'single'            => true,
				'sanitize_callback' => array( $this, 'sanitize_speaker_array' ), // 'wp_kses_post',
			),
/* 			'webinarType'      => array( 'string', 'wp_kses_post' ), */
		);

		foreach ( $custom_fields as $key => $value ) {
			register_post_meta(
				'webinar',
				$key,
				$value
			);
		}
	}

	/**
	 * Array of speakers.
	 *
	 * @param array $value Array of values to be stored for a speaker.
	 * @return array
	 */
	public function sanitize_speaker_array( $value ) {
		// Validate and sanitize individual speaker objects within the array.
		$sanitized_speakers = array();
		foreach ( $value as $speaker ) {
			$sanitized_speaker = array(
				'id'          => (int) $speaker['id'],
				'name'        => sanitize_text_field( $speaker['name'] ),
				'description' => wp_kses_post( $speaker['description'] ),
				'avatar_urls' => esc_url( $speaker['avatar_urls'] )
				// Sanitize 'avatar_urls' based on its format.
			);
			$sanitized_speakers[] = $sanitized_speaker;
		}
		return $sanitized_speakers;
	}


	/**
	 * Callback method for save_post hook.
	 *
	 * @param int     $post_id id of the post.
	 * @param WP_Post $post    post data.
	 * @return void
	 */
	public function save_webinar_block( $post_id, $post ) {
		if (
			'block' !== $post->post_type ||
			! is_string( $post->post_content ) ||
			false === strpos( $post->post_content, '[st-webinar-management/webinar]' )
		) {
			return;
		}

		$attributes = get_block_attributes( $post_id );

		// Retrieve webinar data using $attributes['webinarId']
		// Save data to the corresponding webinar post (custom fields)
		// Example code:.
		if ( isset( $attributes['highlightRows'] ) && is_array( $attributes['highlightRows'] ) ) {
			update_post_meta( $post_id, 'highlight_row', $attributes['highlightRows'] );
		}
	}

	/**
	 * Restricts Webinar custom post to have only paragraph and highlight blocks.
	 *
	 * @param array   $allowed_blocks aray of blocks allowed for this post.
	 * @param WP_Post $post           post object.
	 * @return array
	 */
	public function restrict_webinar_blocks( $allowed_blocks, $post ) {
		if ( ! empty( $post->post_type ) && ( 'webinar' === $post->post_type ) ) {
			return array(
				'core/paragraph',
				'st-webinar-management/webinar',
				'st-webinar-management/highlight',
			);
		}
		return $allowed_blocks; // Return default blocks for other post types.
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
