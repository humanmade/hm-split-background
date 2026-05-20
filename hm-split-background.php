<?php
/**
 * Plugin Name:       HM Split Background
 * Description:       Adds a "Split Background" panel to the core/group block, enabling a hard-edge vertical gradient without manual CSS.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Author:            Human Made Limited
 * Author URI:        https://humanmade.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hm-split-background
 */

namespace HM\SplitBackground;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const VERSION = '1.0.0';

function bootstrap() : void {
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_editor_assets' );
}

function enqueue_editor_assets() : void {
	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'hm-split-background-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );
