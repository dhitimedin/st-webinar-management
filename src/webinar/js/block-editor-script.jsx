import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import metadata from '../block.json';
import Edit from './edit';

// Import your SCSS file
import '../scss/block-editor.scss';

registerBlockType(metadata.name /* 'st-webinar-management/webinar' */, {
	title: 'Webinar',
	icon: 'dashicons-megaphone',
	edit: Edit,
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save();
		return (
			<RichText.Content
				{...blockProps}
				tagName="p"
				value={attributes.description}
			/>
		);
	},
});
