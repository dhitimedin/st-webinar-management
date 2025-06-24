<?php
/**
 * File containing the class ST_Webinar_Management_Admin.
 *
 * @package st-webinar-management
 * @since   1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles admin-specific functionality.
 *
 * @since 1.0.0
 */
class ST_Webinar_Management_Admin {

	/**
	 * The single instance of the class.
	 *
	 * @var self
	 * @since  1.0.0
	 */
	private static $instance = null;

	/**
	 * Main ST_Webinar_Management_Admin Instance.
	 *
	 * Ensures only one instance of ST_Webinar_Management_Admin is loaded or can be loaded.
	 *
	 * @since  1.0.0
	 * @static
	 * @return self Main instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Adds the admin menu page.
	 */
	public function add_admin_menu() {
		add_submenu_page(
			'edit.php?post_type=webinar',
			__( 'Webinar Settings', 'st-webinar-management' ),
			__( 'Settings', 'st-webinar-management' ),
			'manage_options',
			'st_webinar_settings',
			array( $this, 'settings_page_content' )
		);

		add_submenu_page(
			'edit.php?post_type=webinar',
			__( 'Email Templates', 'st-webinar-management' ),
			__( 'Email Templates', 'st-webinar-management' ),
			'manage_options',
			'st_webinar_email_templates',
			array( $this, 'email_templates_page_content' )
		);
	}

	/**
	 * Registers the settings fields.
	 */
	public function register_settings() {
		register_setting( 'st_webinar_settings_group', 'st_webinar_email_platform' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_mailchimp_api_key' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_mailchimp_list_id' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_mautic_url' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_mautic_username' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_mautic_password' );

		// Automated Email Settings
		register_setting( 'st_webinar_settings_group', 'st_webinar_enable_reminder_email' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_reminder_email_template' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_reminder_email_timing' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_enable_post_event_email' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_post_event_email_template' );
		register_setting( 'st_webinar_settings_group', 'st_webinar_post_event_email_timing' );

		add_settings_section(
			'st_webinar_email_settings_section',
			__( 'Email Integration Settings', 'st-webinar-management' ),
			null,
			'st_webinar_settings'
		);

		add_settings_field(
			'st_webinar_email_platform',
			__( 'Email Platform', 'st-webinar-management' ),
			array( $this, 'render_email_platform_field' ),
			'st_webinar_settings',
			'st_webinar_email_settings_section'
		);

		add_settings_field(
			'st_webinar_mailchimp_api_key',
			__( 'Mailchimp API Key', 'st-webinar-management' ),
			array( $this, 'render_mailchimp_api_key_field' ),
			'st_webinar_settings',
			'st_webinar_email_settings_section'
		);

		add_settings_field(
			'st_webinar_mailchimp_list_id',
			__( 'Mailchimp List ID', 'st-webinar-management' ),
			array( $this, 'render_mailchimp_list_id_field' ),
			'st_webinar_settings',
			'st_webinar_email_settings_section'
		);

		add_settings_field(
			'st_webinar_mautic_url',
			__( 'Mautic URL', 'st-webinar-management' ),
			array( $this, 'render_mautic_url_field' ),
			'st_webinar_settings',
			'st_webinar_email_settings_section'
		);

		add_settings_field(
			'st_webinar_mautic_username',
			__( 'Mautic Username', 'st-webinar-management' ),
			array( $this, 'render_mautic_username_field' ),
			'st_webinar_settings',
			'st_webinar_email_settings_section'
		);

		add_settings_field(
			'st_webinar_mautic_password',
			__( 'Mautic Password', 'st-webinar-management' ),
			array( $this, 'render_mautic_password_field' ),
			'st_webinar_settings',
			'st_webinar_email_settings_section'
		);

		// Automated Email Settings
		add_settings_section(
			'st_webinar_automated_email_settings_section',
			__( 'Automated Email Settings', 'st-webinar-management' ),
			null,
			'st_webinar_settings'
		);

		add_settings_field(
			'st_webinar_enable_reminder_email',
			__( 'Enable Reminder Emails', 'st-webinar-management' ),
			array( $this, 'render_enable_reminder_email_field' ),
			'st_webinar_settings',
			'st_webinar_automated_email_settings_section'
		);

		add_settings_field(
			'st_webinar_reminder_email_template',
			__( 'Reminder Email Template', 'st-webinar-management' ),
			array( $this, 'render_reminder_email_template_field' ),
			'st_webinar_settings',
			'st_webinar_automated_email_settings_section'
		);

		add_settings_field(
			'st_webinar_reminder_email_timing',
			__( 'Reminder Email Timing', 'st-webinar-management' ),
			array( $this, 'render_reminder_email_timing_field' ),
			'st_webinar_settings',
			'st_webinar_automated_email_settings_section'
		);

		add_settings_field(
			'st_webinar_enable_post_event_email',
			__( 'Enable Post-Event Emails', 'st-webinar-management' ),
			array( $this, 'render_enable_post_event_email_field' ),
			'st_webinar_settings',
			'st_webinar_automated_email_settings_section'
		);

		add_settings_field(
			'st_webinar_post_event_email_template',
			__( 'Post-Event Email Template', 'st-webinar-management' ),
			array( $this, 'render_post_event_email_template_field' ),
			'st_webinar_settings',
			'st_webinar_automated_email_settings_section'
		);

		add_settings_field(
			'st_webinar_post_event_email_timing',
			__( 'Post-Event Email Timing', 'st-webinar-management' ),
			array( $this, 'render_post_event_email_timing_field' ),
			'st_webinar_settings',
			'st_webinar_automated_email_settings_section'
		);
	}

	/**
	 * Renders the settings page content.
	 */
	public function settings_page_content() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Webinar Settings', 'st-webinar-management' ); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'st_webinar_settings_group' );
				do_settings_sections( 'st_webinar_settings' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Renders the email platform selection field.
	 */
	public function render_email_platform_field() {
		$platform = get_option( 'st_webinar_email_platform' );
		?>
		<select name="st_webinar_email_platform" id="st_webinar_email_platform">
			<option value="none" <?php selected( $platform, 'none' ); ?>><?php esc_html_e( 'None', 'st-webinar-management' ); ?></option>
			<option value="mailchimp" <?php selected( $platform, 'mailchimp' ); ?>><?php esc_html_e( 'Mailchimp', 'st-webinar-management' ); ?></option>
			<option value="mautic" <?php selected( $platform, 'mautic' ); ?>><?php esc_html_e( 'Mautic', 'st-webinar-management' ); ?></option>
		</select>
		<?php
	}

	/**
	 * Renders the Mailchimp API key field.
	 */
	public function render_mailchimp_api_key_field() {
		$api_key = get_option( 'st_webinar_mailchimp_api_key' );
		?>
		<input type="text" name="st_webinar_mailchimp_api_key" id="st_webinar_mailchimp_api_key" value="<?php echo esc_attr( $api_key ); ?>" class="regular-text">
		<?php
	}

	/**
	 * Renders the Mailchimp list ID field.
	 */
	public function render_mailchimp_list_id_field() {
		$list_id = get_option( 'st_webinar_mailchimp_list_id' );
		?>
		<input type="text" name="st_webinar_mailchimp_list_id" id="st_webinar_mailchimp_list_id" value="<?php echo esc_attr( $list_id ); ?>" class="regular-text">
		<?php
	}

	/**
	 * Renders the Mautic URL field.
	 */
	public function render_mautic_url_field() {
		$url = get_option( 'st_webinar_mautic_url' );
		?>
		<input type="text" name="st_webinar_mautic_url" id="st_webinar_mautic_url" value="<?php echo esc_attr( $url ); ?>" class="regular-text">
		<?php
	}

	/**
	 * Renders the Mautic username field.
	 */
	public function render_mautic_username_field() {
		$username = get_option( 'st_webinar_mautic_username' );
		?>
		<input type="text" name="st_webinar_mautic_username" id="st_webinar_mautic_username" value="<?php echo esc_attr( $username ); ?>" class="regular-text">
		<?php
	}

	/**
	 * Renders the Mautic password field.
	 */
	public function render_mautic_password_field() {
		$password = get_option( 'st_webinar_mautic_password' );
		?>
		<input type="password" name="st_webinar_mautic_password" id="st_webinar_mautic_password" value="<?php echo esc_attr( $password ); ?>" class="regular-text">
		<?php
	}

	/**
	 * Renders the enable reminder email field.
	 */
	public function render_enable_reminder_email_field() {
		$enable_reminder_email = get_option( 'st_webinar_enable_reminder_email' );
		?>
		<input type="checkbox" name="st_webinar_enable_reminder_email" id="st_webinar_enable_reminder_email" value="1" <?php checked( $enable_reminder_email, 1 ); ?>>
		<?php
	}

	/**
	 * Renders the reminder email template field.
	 */
	public function render_reminder_email_template_field() {
		$reminder_email_template = get_option( 'st_webinar_reminder_email_template' );
		$templates               = $this->get_email_templates();
		?>
		<select name="st_webinar_reminder_email_template" id="st_webinar_reminder_email_template">
			<option value=""><?php esc_html_e( 'Select a template', 'st-webinar-management' ); ?></option>
			<?php foreach ( $templates as $template ) : ?>
				<option value="<?php echo esc_attr( $template->id ); ?>" <?php selected( $reminder_email_template, $template->id ); ?>><?php echo esc_html( $template->name ); ?></option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	/**
	 * Renders the reminder email timing field.
	 */
	public function render_reminder_email_timing_field() {
		$reminder_email_timing = get_option( 'st_webinar_reminder_email_timing', '24' ); // Default to 24 hours
		?>
		<input type="number" name="st_webinar_reminder_email_timing" id="st_webinar_reminder_email_timing" value="<?php echo esc_attr( $reminder_email_timing ); ?>" class="small-text">
		<label for="st_webinar_reminder_email_timing"><?php esc_html_e( 'Hours before webinar', 'st-webinar-management' ); ?></label>
		<?php
	}

	/**
	 * Renders the enable post-event email field.
	 */
	public function render_enable_post_event_email_field() {
		$enable_post_event_email = get_option( 'st_webinar_enable_post_event_email' );
		?>
		<input type="checkbox" name="st_webinar_enable_post_event_email" id="st_webinar_enable_post_event_email" value="1" <?php checked( $enable_post_event_email, 1 ); ?>>
		<?php
	}

	/**
	 * Renders the post-event email template field.
	 */
	public function render_post_event_email_template_field() {
		$post_event_email_template = get_option( 'st_webinar_post_event_email_template' );
		$templates                 = $this->get_email_templates();
		?>
		<select name="st_webinar_post_event_email_template" id="st_webinar_post_event_email_template">
			<option value=""><?php esc_html_e( 'Select a template', 'st-webinar-management' ); ?></option>
			<?php foreach ( $templates as $template ) : ?>
				<option value="<?php echo esc_attr( $template->id ); ?>" <?php selected( $post_event_email_template, $template->id ); ?>><?php echo esc_html( $template->name ); ?></option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	/**
	 * Renders the post-event email timing field.
	 */
	public function render_post_event_email_timing_field() {
		$post_event_email_timing = get_option( 'st_webinar_post_event_email_timing', '1' ); // Default to 1 day
		?>
		<input type="number" name="st_webinar_post_event_email_timing" id="st_webinar_post_event_email_timing" value="<?php echo esc_attr( $post_event_email_timing ); ?>" class="small-text">
		<label for="st_webinar_post_event_email_timing"><?php esc_html_e( 'Days after webinar', 'st-webinar-management' ); ?></label>
		<?php
	}

	/**
	 * Renders the email templates page content.
	 */
	public function email_templates_page_content() {
		// Handle form submissions for creating/deleting templates
		if ( isset( $_POST['action'] ) ) {
			if ( 'create_template' === $_POST['action'] && check_admin_referer( 'st_create_template_nonce' ) ) {
				$this->create_email_template();
			} elseif ( 'delete_template' === $_POST['action'] && isset( $_GET['template_id'] ) && check_admin_referer( 'st_delete_template_nonce_' . absint( $_GET['template_id'] ) ) ) {
				$this->delete_email_template( absint( $_GET['template_id'] ) );
			}
		}

		$templates = $this->get_email_templates();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Email Templates', 'st-webinar-management' ); ?></h1>
			<?php settings_errors( 'st_webinar_templates_notices' ); ?>
			<h2><?php esc_html_e( 'Create New Template', 'st-webinar-management' ); ?></h2>
			<form method="post" action="">
				<input type="hidden" name="action" value="create_template">
				<?php wp_nonce_field( 'st_create_template_nonce' ); ?>
				<table class="form-table">
					<tbody>
						<tr>
							<th scope="row"><label for="template_name"><?php esc_html_e( 'Template Name', 'st-webinar-management' ); ?></label></th>
							<td><input type="text" name="template_name" id="template_name" class="regular-text" required></td>
						</tr>
						<tr>
							<th scope="row"><label for="template_subject"><?php esc_html_e( 'Email Subject', 'st-webinar-management' ); ?></label></th>
							<td><input type="text" name="template_subject" id="template_subject" class="regular-text" required></td>
						</tr>
						<tr>
							<th scope="row"><label for="template_body"><?php esc_html_e( 'Email Body', 'st-webinar-management' ); ?></label></th>
							<td><?php wp_editor( '', 'template_body', array( 'textarea_name' => 'template_body', 'media_buttons' => false, 'textarea_rows' => 10 ) ); ?></td>
						</tr>
					</tbody>
				</table>
				<?php submit_button( __( 'Create Template', 'st-webinar-management' ) ); ?>
			</form>

			<h2><?php esc_html_e( 'Existing Templates', 'st-webinar-management' ); ?></h2>
			<table class="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th scope="col"><?php esc_html_e( 'Name', 'st-webinar-management' ); ?></th>
						<th scope="col"><?php esc_html_e( 'Subject', 'st-webinar-management' ); ?></th>
						<th scope="col"><?php esc_html_e( 'Actions', 'st-webinar-management' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php if ( ! empty( $templates ) ) : ?>
						<?php foreach ( $templates as $template ) : ?>
							<tr>
								<td><?php echo esc_html( $template->name ); ?></td>
								<td><?php echo esc_html( $template->subject ); ?></td>
								<td>
									<a href="<?php echo esc_url( add_query_arg( array( 'page' => 'st_webinar_email_templates', 'action' => 'delete_template', 'template_id' => $template->id, '_wpnonce' => wp_create_nonce( 'st_delete_template_nonce_' . $template->id ) ) ) ); ?>"
									   onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete this template?', 'st-webinar-management' ); ?>');">
										<?php esc_html_e( 'Delete', 'st-webinar-management' ); ?>
									</a>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php else : ?>
						<tr>
							<td colspan="3"><?php esc_html_e( 'No templates found.', 'st-webinar-management' ); ?></td>
						</tr>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
		<?php
	}

	/**
	 * Creates a new email template.
	 */
	private function create_email_template() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'webinar_email_templates';

		$name    = isset( $_POST['template_name'] ) ? sanitize_text_field( $_POST['template_name'] ) : '';
		$subject = isset( $_POST['template_subject'] ) ? sanitize_text_field( $_POST['template_subject'] ) : '';
		$body    = isset( $_POST['template_body'] ) ? wp_kses_post( $_POST['template_body'] ) : '';


		if ( empty( $name ) || empty( $subject ) || empty( $body ) ) {
			add_settings_error( 'st_webinar_templates_notices', 'empty_fields', __( 'All fields are required.', 'st-webinar-management' ), 'error' );
			return;
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name'    => $name,
				'subject' => $subject,
				'body'    => $body,
			),
			array( '%s', '%s', '%s' )
		);

		if ( $result ) {
			add_settings_error( 'st_webinar_templates_notices', 'template_created', __( 'Template created successfully.', 'st-webinar-management' ), 'updated' );
		} else {
			add_settings_error( 'st_webinar_templates_notices', 'template_create_error', __( 'Error creating template.', 'st-webinar-management' ), 'error' );
		}
	}

	/**
	 * Deletes an email template.
	 *
	 * @param int $template_id The ID of the template to delete.
	 */
	private function delete_email_template( $template_id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'webinar_email_templates';

		$result = $wpdb->delete( $table_name, array( 'id' => $template_id ), array( '%d' ) );

		if ( $result ) {
			add_settings_error( 'st_webinar_templates_notices', 'template_deleted', __( 'Template deleted successfully.', 'st-webinar-management' ), 'updated' );
		} else {
			add_settings_error( 'st_webinar_templates_notices', 'template_delete_error', __( 'Error deleting template.', 'st-webinar-management' ), 'error' );
		}
	}

	/**
	 * Retrieves all email templates.
	 *
	 * @return array
	 */
	private function get_email_templates() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'webinar_email_templates';
		return $wpdb->get_results( "SELECT * FROM $table_name ORDER BY created_at DESC" );
	}
}

ST_Webinar_Management_Admin::instance();
