<?php
/**
 * Uninstall file for the plugin. Runs when plugin is deleted in WordPress Admin.
 *
 * @package st-webinar-management
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

// Drop the database table.
global $wpdb;
$table_name = $wpdb->prefix . 'webinar_viewers_entries';
$wpdb->query( "DROP TABLE IF EXISTS {$table_name}" ); // phpcs:ignore
