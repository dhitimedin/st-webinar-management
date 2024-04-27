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
		minTime: {
			type: 'string',
			default: null,
		},
		maxTime: {
			type: 'string',
			default: null,
		}
	},
	edit: HighlightEdit,
	save: () => null,
});
