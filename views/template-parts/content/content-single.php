<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

if ( ! function_exists( 'get_breadcrumb' ) ) {
	/**
	 * Creates a breadcrumb for webinar single page.
	 *
	 * @return void|string
	 */
	function get_breadcrumb() {

		$kses_defaults = wp_kses_allowed_html( 'post' );

		$svg_args     = array(
			'svg'   => array(
				'class'           => true,
				'aria-hidden'     => true,
				'aria-labelledby' => true,
				'role'            => true,
				'xmlns'           => true,
				'width'           => true,
				'height'          => true,
				'fill'            => true,
				'viewbox'         => true, // <= Must be lower case!
			),
			'g'     => array( 'fill' => true ),
			'title' => array( 'title' => true ),
			'path'  => array(
				'd'      => true,
				'fill'   => true,
				'stroke' => true,
			),
		);
		$allowed_tags = array_merge( $kses_defaults, $svg_args );

		$home_svg = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2rem" height="2rem" viewBox="0 0 50 50" fill="#21689D">
		<path d="M 24.962891 1.0546875 A 1.0001 1.0001 0 0 0 24.384766 1.2636719 L 1.3847656 19.210938 A 1.0005659 1.0005659 0 0 0 2.6152344 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.384766 20.789062 A 1.0005657 1.0005657 0 1 0 48.615234 19.210938 L 41 13.269531 L 41 6 L 35 6 L 35 8.5859375 L 25.615234 1.2636719 A 1.0001 1.0001 0 0 0 24.962891 1.0546875 z M 25 3.3222656 L 44 18.148438 L 44 45 L 32 45 L 32 26 L 18 26 L 18 45 L 6 45 L 6 18.148438 L 25 3.3222656 z M 37 8 L 39 8 L 39 11.708984 L 37 10.146484 L 37 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z" stroke="#21689D"></path>
		</svg>';
		echo wp_kses( $home_svg, $allowed_tags ) . '&nbsp;&nbsp;<a class="st-breadcrumb-home" href="' . esc_url_raw( home_url() ) . '" rel="nofollow">Home</a>';

		if ( is_singular() ) {  // Check for any single post, page, or custom post type.
			// Get the post type object.
			$post_type_object = get_post_type_object( get_post_type() );

			if ( $post_type_object->has_archive ) {  // Check if the post type has an archive.
				echo '&nbsp;&nbsp;&#62;&nbsp;&nbsp;';
				echo '<a href="' . esc_url_raw( get_post_type_archive_link( get_post_type() ) ) . '">' . esc_html( $post_type_object->label ) . '</a>';
			}

			if ( is_single() ) {
				echo ' &nbsp;&nbsp;&#62;&nbsp;&nbsp; ';
				echo '<span>' . esc_html( get_the_title() ) . '</span>';
			}
		} elseif ( is_category() ) {
			echo '&nbsp;&nbsp;&#62;&nbsp;&nbsp;';
			the_category( ' &bull; ' ); // This works for categories.
		} elseif ( is_tax() ) { // Check for custom taxonomies.
			echo '&nbsp;&nbsp;&#62;&nbsp;&nbsp;';
			$taxonomy  = get_queried_object(); // Get the current taxonomy object.
			$term_link = get_term_link( $taxonomy->term_id, $taxonomy->taxonomy ); // Get the link for the current term using get_term_link.
			echo '<a href="' . esc_url_raw( $term_link ) . '">' . esc_html( $taxonomy->name ) . '</a>'; // Display taxonomy name and link.
		} elseif ( is_page() ) {
			echo '&nbsp;&nbsp;&#62;&nbsp;&nbsp;';
			echo wp_kses_post( the_title() );
		} elseif ( is_search() ) {
			echo '&nbsp;&nbsp;&#62;&nbsp;&nbsp;Search Results for... ';
			echo '"<em>';
			echo wp_kses_post( the_search_query() );
			echo '</em>"';
		}
	}
}

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<header class="entry-header alignwide">
		<div class="st-webinar-breadcrumb">
			<?php get_breadcrumb(); ?>
		</div>
		<div class="st-webinar-singlepage-title">
			<div class="st-start-date-container">
				<?php $start_date = strtotime( get_post_meta( get_the_ID(), 'startDate', true ) ); ?>
				<span class="st-day">
					<?php echo esc_attr( gmdate( 'd', $start_date ) ); ?>
				</span>
				<span class="st-month">
					<?php echo esc_attr( gmdate( 'M', $start_date ) ); ?>
				</span>
			</div>
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		</div>
		<h2><?php echo esc_html( get_post_meta( get_the_ID(), 'subtitle', true ) ); ?></h2>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<div id="st-program-info-container" class="st-program-info-container">
			<div class="st-day-container">
				<div class="st-icon-container">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#21689D" class="bi bi-calendar" viewBox="0 0 16 16">
						<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
					</svg>
				</div>
				<div class="text-container">
					<span><?php esc_html_e( 'Day', 'st-webinar-management' ); ?></span>
					<span>
						<?php esc_html_e( 'Fourth-fair', 'st-webinar-management' ); ?>
						<?php echo esc_attr( gmdate( 'd F', $start_date ) ); ?>
					</span>
				</div>
			</div>
			<div  class="st-schedule-container">
				<div class="st-icon-container">
					<svg xmlns="http://www.w3.org/2000/svg" fill="#21689D" class="bi bi-clock" viewBox="0 0 16 16">
						<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
						<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
					</svg>
				</div>
				<div class="text-container">
					<span><?php esc_html_e( 'Schedule', 'st-webinar-management' ); ?></span>
					<span>
						<?php echo esc_attr( gmdate( 'H, eO', $start_date ) ); ?>
					</span>
				</div>
			</div>
			<div  class="st-duration-container">
				<div class="st-icon-container">
					<svg xmlns="http://www.w3.org/2000/svg" fill="#21689D" class="bi bi-hourglass-split" viewBox="0 0 16 16">
						<path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
					</svg>
				</div>
				<div class="text-container">
					<span><?php esc_html_e( 'Duration', 'st-webinar-management' ); ?></span>
					<span>
						<?php echo esc_html( get_post_meta( get_the_ID(), 'duration', true ) ); ?>
					</span>
				</div>
			</div>
		</div>
		<figure id="st-post-thumbnail" class="st-post-thumbnail">
			<img src="<?php echo esc_url_raw( get_the_post_thumbnail_url( get_the_ID() ) ); ?>" class="st-webinar-banner" />
		</figure>
		<div id="wp-block-st-webinar-management-webinar" class="wp-block-st-webinar-management-webinar">
			<header class="st-webinar-section-header">
				<h2 class="st-webinar-section-title"><?php esc_html_e( 'Webinar Details', 'st-webinar-management' ); ?></h2>
				<div class="st-color-bar-h2"></div>
			</header>

			<?php
			echo wp_kses_post( get_the_content() );

			// wp_link_pages(
			// array(
			// 'before'   => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'twentytwentyone' ) . '">',
			// 'after'    => '</nav>',
			// * translators: %: Page number. */
			// 'pagelink' => esc_html__( 'Page %', 'twentytwentyone' ),
			// )
			// );
			?>
		</div>
	</div><!-- .entry-content -->
	<!-- Program Highlights -->
	<div class="st-highlight-content">
		<?php $highlights = get_post_meta( get_the_ID(), 'highlightRows', true ); ?>
		<?php if ( ! empty( $highlights ) ) : ?>
			<!-- section-header -->
			<header class="st-webinar-section-header">
				<h2 class="st-webinar-section-title"><?php esc_html_e( 'Program', 'st-webinar-management' ); ?></h2>
				<div class="st-color-bar-h2"></div>
			</header>
			<!-- section-header -->
			<?php foreach ( $highlights as $highlight ) : ?>
				<div class="st-highlight">
					<div class="st-highlight-time">
						<?php echo esc_attr( gmdate( 'H:i', strtotime( $highlight['highlightTime'] ) ) ); ?>
					</div>
					<div class="st-highlight-description">
						<?php echo esc_html( $highlight['highlightDescription'] ); ?>
					</div>
				</div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
	<!-- Program Highlights -->
	<!-- Speakers -->
	<div class="st-speakers-container">
		<?php $speakers = get_post_meta( get_the_ID(), 'speakers', true ); ?>
		<?php if ( ! empty( $speakers ) ) : ?>
			<!-- section-header -->
			<header class="st-webinar-section-header">
				<h2 class="st-webinar-section-title"><?php esc_html_e( 'Speakers', 'st-webinar-management' ); ?></h2>
				<div class="st-color-bar-h2"></div>
			</header>
			<!-- section-header -->
			<!-- Speaker Section Content -->
			<div class="st-speaker-grid-container">
				<?php foreach ( $speakers as $speaker ) : ?>
					<?php $avatars = array_values( json_decode( $speaker['avatar_urls'], true ) ); ?>
					<figure class="st-speaker-card">
						<img class="st-speaker-image" src="<?php echo esc_url_raw( $avatars[ count( $avatars ) - 1 ] ); ?>" alt="<?php echo esc_html( $post->title ); ?>" />
						<p>
							<figcaption class="st-speaker-name"><?php echo esc_html( $speaker['name'] ); ?></figcaption>
							<figcaption class="st-speaker-details"><?php echo esc_html( $speaker['description'] ); ?></figcaption>
						<p>
					</figure>
<!-- 					<div class="st-speaker">
						<div class="st-speaker-avatar">
							<?php $avatars = array_values( json_decode( $speaker['avatar_urls'], true ) ); ?>
							<img src="<?php echo esc_url_raw( $avatars[ count( $avatars ) - 1 ] ); ?>" />
						</div>
						<div class="st-speaker-name">
							<?php echo esc_html( $speaker['name'] ); ?>
						</div>
						<div class="st-speaker-description">
							<?php echo esc_html( $speaker['description'] ); ?>
						</div>
					</div> -->
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
	<!-- Speakers -->

	<footer class="entry-footer default-max-width">
		<?php twenty_twenty_one_entry_meta_footer(); ?>
	</footer><!-- .entry-footer -->

	<?php if ( ! is_singular( 'attachment' ) ) : ?>
		<?php get_template_part( 'template-parts/post/author-bio' ); ?>
	<?php endif; ?>

</article><!-- #post-<?php the_ID(); ?> -->
