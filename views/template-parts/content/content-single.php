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

		$svg_args = array(
			'svg'   => array(
				'class'           => true,
				'aria-hidden'     => true,
				'aria-labelledby' => true,
				'role'            => true,
				'xmlns'           => true,
				'width'           => true,
				'height'          => true,
				'fill'            => true,
				'viewbox'         => true // <= Must be lower case!
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
		<figure class="post-thumbnail">
			<img src="<?php echo esc_url_raw( get_the_post_thumbnail_url( get_the_ID() ) ); ?>" class="st-webinar-banner" />
		</figure>
		<?php // twenty_twenty_one_post_thumbnail(); ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php
		the_content();

		wp_link_pages(
			array(
				'before'   => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'twentytwentyone' ) . '">',
				'after'    => '</nav>',
				/* translators: %: Page number. */
				'pagelink' => esc_html__( 'Page %', 'twentytwentyone' ),
			)
		);
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer default-max-width">
		<?php twenty_twenty_one_entry_meta_footer(); ?>
	</footer><!-- .entry-footer -->

	<?php if ( ! is_singular( 'attachment' ) ) : ?>
		<?php get_template_part( 'template-parts/post/author-bio' ); ?>
	<?php endif; ?>

</article><!-- #post-<?php the_ID(); ?> -->