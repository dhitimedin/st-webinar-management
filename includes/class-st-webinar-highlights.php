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
class ST_Webinar_Highlights {

	/**
	 * Initialize the class.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Register the block.
	 */
	public function register_block() {
		register_block_type(
			'st-webinar-management/highlights',
			array(
				'attributes'      => array(
					'highlights' => array(
						'type'    => 'array',
						'default' => array(),
					),
				),
				'render_callback' => array( $this, 'render_block' ),
			)
		);
	}

	/**
	 * Render the block.
	 *
	 * @param array $attributes Block attributes.
	 * @return string Block output.
	 */
	public function render_block( $attributes ) {
		ob_start();
		?>
		<div class="webinar-highlights">
			<?php if ( ! empty( $attributes['highlights'] ) ) : ?>
				<h3>Webinar Highlights</h3>
				<ul>
					<?php foreach ( $attributes['highlights'] as $highlight ) : ?>
						<li>
							<strong>Time:</strong> <?php echo esc_html( $highlight['time'] ); ?><br>
							<strong>Description:</strong> <?php echo esc_html( $highlight['description'] ); ?>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
				<p>No highlights available.</p>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}

new ST_Webinar_Highlights();
