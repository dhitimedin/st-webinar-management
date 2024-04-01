<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
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
		echo '<a href="' . esc_url_raw( home_url() ) . '" rel="nofollow">Home</a>';

		if ( is_singular() ) {  // Check for any single post, page, or custom post type.
			// Get the post type object.
			$post_type_object = get_post_type_object( get_post_type() );

			if ( $post_type_object->has_archive ) {  // Check if the post type has an archive.
				echo '&nbsp;&nbsp;&#187;&nbsp;&nbsp;';
				echo '<a href="' . esc_url_raw( get_post_type_archive_link( get_post_type() ) ) . '">' . esc_html( $post_type_object->label ) . '</a>';
			}

			if ( is_single() ) {
				echo ' &nbsp;&nbsp;&#187;&nbsp;&nbsp; ';
				the_title();
			}
		} elseif ( is_category() ) {
			echo '&nbsp;&nbsp;&#187;&nbsp;&nbsp;';
			the_category( ' &bull; ' ); // This works for categories.
		} elseif ( is_tax() ) { // Check for custom taxonomies.
			echo '&nbsp;&nbsp;&#187;&nbsp;&nbsp;';
			$taxonomy  = get_queried_object(); // Get the current taxonomy object.
			$term_link = get_term_link( $taxonomy->term_id, $taxonomy->taxonomy ); // Get the link for the current term using get_term_link.
			echo '<a href="' . esc_url_raw( $term_link ) . '">' . esc_html( $taxonomy->name ) . '</a>'; // Display taxonomy name and link.
		} elseif ( is_page() ) {
			echo '&nbsp;&nbsp;&#187;&nbsp;&nbsp;';
			echo wp_kses_post( the_title() );
		} elseif ( is_search() ) {
			echo '&nbsp;&nbsp;&#187;&nbsp;&nbsp;Search Results for... ';
			echo '"<em>';
			echo wp_kses_post( the_search_query() );
			echo '</em>"';
		}
	}
}


get_header();
?>
<div class="breadcrumb"><?php get_breadcrumb(); ?></div>
<?php
/* Start the Loop */
while ( have_posts() ) :
	the_post();

	get_template_part( 'template-parts/content/content-single' );

	if ( is_attachment() ) {
		// Parent post navigation.
		the_post_navigation(
			array(
				/* translators: %s: Parent post link. */
				'prev_text' => sprintf( __( '<span class="meta-nav">Published in</span><span class="post-title">%s</span>', 'twentytwentyone' ), '%title' ),
			)
		);
	}

	// If comments are open or there is at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}

	// Previous/next post navigation.
	$twentytwentyone_next = is_rtl() ? twenty_twenty_one_get_icon_svg( 'ui', 'arrow_left' ) : twenty_twenty_one_get_icon_svg( 'ui', 'arrow_right' );
	$twentytwentyone_prev = is_rtl() ? twenty_twenty_one_get_icon_svg( 'ui', 'arrow_right' ) : twenty_twenty_one_get_icon_svg( 'ui', 'arrow_left' );

	$twentytwentyone_next_label     = esc_html__( 'Next post', 'twentytwentyone' );
	$twentytwentyone_previous_label = esc_html__( 'Previous post', 'twentytwentyone' );

	the_post_navigation(
		array(
			'next_text' => '<p class="meta-nav">' . $twentytwentyone_next_label . $twentytwentyone_next . '</p><p class="post-title">%title</p>',
			'prev_text' => '<p class="meta-nav">' . $twentytwentyone_prev . $twentytwentyone_previous_label . '</p><p class="post-title">%title</p>',
		)
	);
endwhile; // End of the loop.

get_footer();
