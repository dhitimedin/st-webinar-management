import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import Edit from './edit';
import Save from './save';

// Import your SCSS file
import '../scss/block-editor.scss';

/**
 * Define a custom SVG icon for the block.
 */
const WebinarIcon = (
	<svg
		fill="#000000"
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		xmlSpace="preserve"
	>
		<path
			d="M4,2C2.9,2,2,2.9,2,4v13c0,1.1,0.9,2,2,2h6v1H6v2h12v-2h-4v-1h6c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2H4z M4,4h16v13H4V4z
			M12,5c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,5,12,5z M10,10c-1.1,0-2,0.9-2,2v1h8v-1c0-1.1-0.9-2-2-2H10z M5,14v2h4v-2H5z
			M10,14v2h4v-2H10z M15,14v2h4v-2H15z"
		/>
		<rect fill="none" width="24" height="24" />
	</svg>
);

registerBlockType(metadata.name, {
	title: metadata.title,
	icon: WebinarIcon,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save: Save,
});
