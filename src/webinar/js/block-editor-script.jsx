import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import metadata from '../block.json';
import Edit from './edit'

// Import your SCSS file
import '../scss/block-editor.scss';

// Outside the registerBlockType function

let isSaving = false;

registerBlockType( metadata.name /* 'st-webinar-management/webinar' */, {
	title: 'Webinar',
	icon: "dashicons-megaphone",
	edit: Edit,
	save: ( { attributes } ) => {
		const {
			title,
			subtitle,
			startDate,
			endDate,
			duration,
			description,
			registrationForm,
			streamingLink,
			speakers,
			webinarType, // Define webinarType here
		} = attributes;

        const blockProps = useBlockProps.save();


		// Implement logic to create a new webinar post with the attributes
		// using WordPress APIs (e.g., wp.apiFetch)
		/* const createWebinar = async () => {
			if (isSaving) {
				return; // Prevent multiple API calls during save
			}

			isSaving = true;
			const response = await apiFetch( {
				path: '/wp/v2/webinar',
				method: 'POST',
				data: {
					title,
					meta: {
						subtitle,
						startDate,
						endDate,
						duration,
						description,
						registrationForm,
						streamingLink,
						speakers,
						webinarType, // Define webinarType here
					},
				},
			} );

			isSaving = false;
		  // Handle the response (success/error)
		  if ( response ) {
			// Display saved title or a success message
			return <h2>{ title }</h2>;
		  } else {
			// Display error message
			return <p>{ __( 'Error creating webinar. Please try again.', 'st-webinar-management' ) }</p>;
		  }
		};

		return createWebinar(attributes); */
		return null;
	},
} );

