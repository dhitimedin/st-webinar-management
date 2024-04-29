<?php
/**
 * File containing the class ST_Webinar_Highlights.
 *
 * @package st-webinar-management
 * @since   1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles creating of highlights block.
 *
 * @since 1.0.0
 */
class ST_Webinar_Submit_Form {

	/**
	 * Initialize the class.
	 */
	public function __construct() {
		// Expose API to receive submission data.
		add_action( 'rest_api_init', array( $this, 'form_submission_route' ) );

		// Enqueue script for 'registration.min.js' on single 'webinar' post pages.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_registration_script' ) );
	}

	/**
	 * Register API endpoints route for form submission.
	 *
	 * @return void
	 */
	public function form_submission_route() {
		register_rest_route(
			'st-webinar-management/v1',
			'/submit-form',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'handle_form_submission' ),
			)
		);
	}

	/**
	 * Checks for nounce and then routes the submission to the appropriate hook.
	 *
	 * @param  WP_REST_Request $request request data.
	 * @return string|WP_Error|WP_REST_Response
	 */
	public function handle_form_submission( WP_REST_Request $request ) {
		// Get form data from request body.
		$form_data = $request->get_json_params();

		// Perform validation and processing of form data.
		// For example, you can access form fields like $form_data['fname'], $form_data['lname'], etc.

		// Check if consent is true.
		if ( ! isset( $form_data['consent'] ) || ! $form_data['consent'] ) {
			return new WP_Error( 'invalid_data', __( 'Consent not given.', 'st-webinar-management' ), array( 'status' => 400 ) );
		}

		// Example validation: Check if required fields are present.
		if ( empty( $form_data['fname'] ) || empty( $form_data['lname'] ) || empty( $form_data['email'] ) ) {
			return new WP_Error( 'invalid_data', __( 'Incomplete form data.', 'st-webinar-management' ), array( 'status' => 400 ) );
		}

		// Save form data to database.
		global $wpdb;
		$table_name = $wpdb->prefix . 'webinar_viewers_entries';

		$form_data = array(
			'first_name' => sanitize_text_field( $form_data['fname'] ),
			'last_name'  => sanitize_text_field( $form_data['lname'] ),
			'email'      => sanitize_email( $form_data['email'] ),
			'timestamp'  => current_time( 'mysql' ),
		);

		//phpcs:ignore
		$result = $wpdb->insert(
			$table_name,
			$form_data
		);

		// Check if the insertion was successful.
		if ( $result ) {
			// Apply filter to submitted data and timestamp.
			do_action( 'st_webinar_submission', $form_data );

			return rest_ensure_response( __( 'Form submission successful.', 'st-webinar-management' ) );
		} else {
			return new WP_Error( 'form_submission_failed', __( 'Failed to submit form data.', 'st-webinar-management' ), array( 'status' => 500 ) );
		}
	}


	/**
	 * Enqueue 'registration.min.js' script on single 'webinar' post pages.
	 *
	 * @return void
	 */
	public function enqueue_registration_script() {
		if ( is_singular( 'webinar' ) && ! is_admin() ) {
			// Get the asset file data.
			$asset_file = ST_WEBINAR_MANAGEMENT_PLUGIN_DIR . '/assets/registration/js/registration.min.asset.php';
			$asset_data = file_exists( $asset_file ) ? include $asset_file : array();

			// Enqueue the script with its dependencies.
			wp_enqueue_script(
				'registration-script',
				ST_WEBINAR_MANAGEMENT_PLUGIN_URL . '/assets/registration/js/registration.min.js',
				$asset_data['dependencies'] ?? array( 'react', 'react-dom' ),
				$asset_data['version'] ?? null,
				true // Load script in footer.
			);
		}
	}
}

new ST_Webinar_Submit_Form();
