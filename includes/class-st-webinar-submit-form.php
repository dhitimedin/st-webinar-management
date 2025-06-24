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
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_form_submission' ),
				'permission_callback' => '__return_true',
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

			// Email Integration
			$this->handle_email_integration( $form_data );

			return rest_ensure_response( __( 'Form submission successful.', 'st-webinar-management' ) );
		} else {
			return new WP_Error( 'form_submission_failed', __( 'Failed to submit form data.', 'st-webinar-management' ), array( 'status' => 500 ) );
		}
	}

	/**
	 * Handles email integration with Mailchimp or Mautic.
	 *
	 * @param array $form_data The form data.
	 */
	private function handle_email_integration( $form_data ) {
		$platform = get_option( 'st_webinar_email_platform' );

		if ( 'mailchimp' === $platform ) {
			$api_key = get_option( 'st_webinar_mailchimp_api_key' );
			$list_id = get_option( 'st_webinar_mailchimp_list_id' );

			if ( ! empty( $api_key ) && ! empty( $list_id ) ) {
				$server_prefix = substr( $api_key, strrpos( $api_key, '-' ) + 1 );
				$url           = "https://{$server_prefix}.api.mailchimp.com/3.0/lists/{$list_id}/members/";

				$response = wp_remote_post(
					$url,
					array(
						'headers' => array(
							'Authorization' => 'Basic ' . base64_encode( 'user:' . $api_key ),
							'Content-Type'  => 'application/json',
						),
						'body'    => json_encode(
							array(
								'email_address' => $form_data['email'],
								'status'        => 'subscribed',
								'merge_fields'  => array(
									'FNAME' => $form_data['first_name'],
									'LNAME' => $form_data['last_name'],
								),
							)
						),
					)
				);

				if ( is_wp_error( $response ) ) {
					// Handle Mailchimp API error
					error_log( 'Mailchimp API Error: ' . $response->get_error_message() );
				} else {
					$body = json_decode( wp_remote_retrieve_body( $response ) );
					if ( isset( $body->status ) && 'subscribed' !== $body->status && isset( $body->title ) ) {
						// Handle Mailchimp API error response
						error_log( 'Mailchimp Subscription Error: ' . $body->title . ' - ' . $body->detail );
					}
				}
			}
		} elseif ( 'mautic' === $platform ) {
			$mautic_url      = get_option( 'st_webinar_mautic_url' );
			$mautic_username = get_option( 'st_webinar_mautic_username' );
			$mautic_password = get_option( 'st_webinar_mautic_password' );

			if ( ! empty( $mautic_url ) && ! empty( $mautic_username ) && ! empty( $mautic_password ) ) {
				$url      = trailingslashit( $mautic_url ) . 'api/contacts/new';
				$response = wp_remote_post(
					$url,
					array(
						'headers' => array(
							'Authorization' => 'Basic ' . base64_encode( $mautic_username . ':' . $mautic_password ),
							'Content-Type'  => 'application/json',
						),
						'body'    => json_encode(
							array(
								'firstname' => $form_data['first_name'],
								'lastname'  => $form_data['last_name'],
								'email'     => $form_data['email'],
							)
						),
					)
				);

				if ( is_wp_error( $response ) ) {
					// Handle Mautic API error
					error_log( 'Mautic API Error: ' . $response->get_error_message() );
				} else {
					$body = json_decode( wp_remote_retrieve_body( $response ) );
					if ( isset( $body->errors ) ) {
						// Handle Mautic API error response
						$error_messages = array();
						foreach ( $body->errors as $error ) {
							$error_messages[] = $error->message;
						}
						error_log( 'Mautic Error: ' . implode( ', ', $error_messages ) );
					}
				}
			}
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
