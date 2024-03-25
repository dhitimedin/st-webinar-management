import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import metadata from '../block.json';
import Edit from './edit'

// Import your SCSS file
import '../scss/block-editor.scss';

registerBlockType( metadata.name /* 'st-webinar-management/webinar' */, {
	title: 'Webinar',
	icon: "dashicons-megaphone",
	edit: Edit,
	save: ( { attributes } ) => {
        const blockProps = useBlockProps.save();
		return null;
	},
} );

