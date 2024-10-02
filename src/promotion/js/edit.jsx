import React from 'react';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import WebinarDetails from './webinar-details';

export default function Edit({ attributes, setAttributes }) {
	const { selectedWebinarId, selectedWebinarDetails } = attributes;
	const [webinarDataLoaded, setWebinarDataLoaded] = useState(false); // Track webinar data loading state

	const webinarPosts = useSelect((select) =>
		select('core').getEntityRecords('postType', 'webinar')
	);

	useEffect(() => {
		if (webinarPosts !== null) {
			setWebinarDataLoaded(true); // Set loaded state when data arrives
		}
	}, [webinarPosts]); // Update state when webinarPosts changes

	const webinarOptions = webinarDataLoaded && webinarPosts?.map((webinar) => ({
		value: parseInt( webinar.id ),
		label: webinar.title.rendered,
	}));

	const onChangeWebinar = (newWebinarId) => {
		setAttributes({ selectedWebinarId: parseInt(newWebinarId) });
		if (webinarPosts) {
			let webinarDetails = webinarPosts?.find((webinar) => parseInt(webinar.id) === parseInt(newWebinarId));
			if ( webinarDetails){
				let blockTitle = webinarDetails?.title;
				let blockMeta = webinarDetails?.meta;
				const selectedDetails = {
					title: blockTitle,
					meta: { subtitle: blockMeta.subtitle, startDate: blockMeta.startDate, duration: blockMeta.duration, speakers: blockMeta.speakers } };
				setAttributes({selectedWebinarDetails: selectedDetails});
			}
		} else {
		  setAttributes({ selectedWebinarDetails: null });
		}
	};

	return (
		<div>
		{webinarDataLoaded === null && <p>{__('Loading webinars...', 'st-webinar-management')}</p>}
		{webinarDataLoaded === false && <p>{__('Webinars not found.', 'st-webinar-management')}</p>}
		{webinarDataLoaded && (
			<>
			{selectedWebinarDetails ? (
                <WebinarDetails webinarDetails={selectedWebinarDetails} />
			) : (
				<SelectControl
				label={__('Select Webinar', 'st-webinar-management')}
				value={parseInt(selectedWebinarId)}
				options={[{ value: '', label: __('Select Webinar', 'st-webinar-management') }, ...webinarOptions]}
				onChange={onChangeWebinar}
				/>
			)}
			</>
		)}
		</div>
	);
}