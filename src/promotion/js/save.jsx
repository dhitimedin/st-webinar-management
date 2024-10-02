import React from 'react';
import { __ } from '@wordpress/i18n';
import WebinarDetails from './webinar-details';


export default function Save({ attributes }) {
	const { selectedWebinarDetails } = attributes;

	// return null;

    // Render an empty container if selectedWebinarDetails is falsy or incomplete
	console.log( selectedWebinarDetails);
    if (
		!selectedWebinarDetails ||
		!selectedWebinarDetails.hasOwnProperty('title') ||
		!selectedWebinarDetails.hasOwnProperty('meta')
	) {
        return null;
    }

	console.log( selectedWebinarDetails );

	return (
		<WebinarDetails webinarDetails={selectedWebinarDetails} />
	);
}