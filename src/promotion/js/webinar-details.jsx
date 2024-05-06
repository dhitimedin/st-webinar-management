import React from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Heading from './heading';
import Subheading from './subheading';
import List from './list';

const WebinarDetails = ({ webinarDetails }) => {
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

	const webinarListDetails = [
		{ label: __('Start Date: ', 'st-webinar-management'), text: formatDate(webinarDetails?.meta.startDate) },
		{ label: __('Duration: ', 'st-webinar-management'), text: webinarDetails?.meta.duration },
		{ label: __('Speakers: ', 'st-webinar-management'), text: webinarDetails?.meta.speakers?.map((speaker) => speaker.name).join(', ') },
	  ];

	  console.log( webinarDetails );

    return (
        <>
		  <Heading title={webinarDetails?.title.rendered} />
		  <Subheading subtitle={webinarDetails?.meta.subtitle} />
		  <List items={webinarListDetails} />
		  <Button
			variant="secondary"
			href={webinarDetails?.link}
			className="cta-button"
		  >
			{__('Download For Free', 'st-webinar-management')}
		  </Button>
        </>
    );
};

export default WebinarDetails;
