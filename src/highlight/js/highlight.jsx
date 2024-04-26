import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import HighlightEdit from './highlightedit';

// Import your SCSS file
import '../scss/highlight.scss';

registerBlockType(metadata.name, {
	title: 'Webinar Highlight',
	icon: 'clock', // Same icon as defined in blocks.json
	category: 'common',
	attributes: {
		highlightRows: {
			type: 'array',
			default: [],
		},
	},
	edit: HighlightEdit,
	save: ({ attributes }) => null,
});
