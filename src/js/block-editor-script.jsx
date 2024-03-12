import { useState } from "react";
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, DateTimePicker } from '@wordpress/components';
import DurationPicker from 'react-duration-picker';
import { __ } from '@wordpress/i18n';

// Import your SCSS file
import '../scss/block-editor.scss';

registerBlockType( 'st-webinar-management/webinar', {
	title: 'Webinar',
	edit: ( { attributes, setAttributes } ) => {
		const {
			webinarId,
			title,
			subtitle,
			thumbnail,
			startDate,
			endDate,
			duration,
			description,
			registrationForm,
			streamingLink,
			highlights,
			speakers,
			isStartDatePickerOpen,
			isEndDatePickerOpen,
		} = attributes;

		const [isOpen, setIsOpen] = useState(false);

		const onChangeTitle = ( newTitle ) => {
			setAttributes( { title: newTitle } );
		};

		const onChangeSubtitle = ( newSubtitle ) => {
			setAttributes( { subtitle: newSubtitle } );
		};

		const onOpenStartDatePicker = () => {
			setAttributes( { isStartDatePickerOpen: true } );
		};

		const onOpenEndDatePicker = () => {
			setAttributes( { isEndDatePickerOpen: true } );
		};

		const onCloseDatePicker = () => {
			setAttributes( { isStartDatePickerOpen: false, isEndDatePickerOpen: false } );
		};

		const onChangeStartDate = ( newStartDate ) => {
			setAttributes( { startDate: newStartDate } );
			onCloseDatePicker();
		};

		const onChangeEndDate = ( newEndDate ) => {
			setAttributes( { endDate: newEndDate } );
			onCloseDatePicker();
		};

		const validateDuration = ( duration ) => {
			const regex = /^(\d+ )?(hours?|hrs?) ?(\d+ )?(mins?|min(?:utes)?)?$/i;
			return regex.test( duration );
		};

		const onChangeDuration = ( newDuration ) => {
			/* setAttributes( { duration: newDuration } ); */
			const formattedDuration = formatDuration(newDuration); // Function to format hours & minutes
			console.log( formattedDuration );
			setAttributes( { duration: formattedDuration } );
			// setIsOpen(false);
		};

		const formatDuration = ( duration ) => {
			const { hours, minutes } = duration;
			let formattedDuration = '';
			if (hours > 0) {
				formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
			}
			if (minutes > 0) {
				formattedDuration += (formattedDuration.length > 0 ? ' ' : '') + `${minutes} minute${minutes > 1 ? 's' : ''}`;
			}
			return formattedDuration;
		};

		const onChangeDescription = ( newDescription ) => {
			setAttributes( { description: newDescription } );
		};

		const onChangeRegistrationForm = ( newRegistrationForm ) => {
			setAttributes( { registrationForm: newRegistrationForm } );
		};

		const onChangeStreamingLink = ( newStreamingLink ) => {
			setAttributes( { streamingLink: newStreamingLink } );
		};


		const addHighlight = () => {
			setAttributes( { highlights: [...highlights, { time: '', description: '' }] } );
		  };

		const removeHighlight = ( index ) => {
			const updatedHighlights = [...highlights];
			updatedHighlights.splice( index, 1 );
			setAttributes( { highlights: updatedHighlights } );
		};

		const onChangeHighlightTime = ( index, newTime ) => {
				const updatedHighlights = [...highlights];
				updatedHighlights[index].time = newTime;
				setAttributes( { highlights: updatedHighlights } );
		};

		const onChangeHighlightDescription = ( index, newDescription ) => {
			const updatedHighlights = [...highlights];
			updatedHighlights[index].description = newDescription;
			setAttributes( { highlights: updatedHighlights } );
		};

		const onSpeakerChange = ( selectedSpeakers ) => {
			setAttributes( { speakers: selectedSpeakers } );
		};

		const blockProps = useBlockProps();

		// Logic to fetch available speakers (replace with actual logic)
		const availableSpeakers = [
			{ value: 1, label: 'Speaker 1' },
			{ value: 2, label: 'Speaker 2' },
			// ... (other speakers)
		];

		const webinars = [ // Replace with actual logic to fetch available webinars
			{ id: 1, title: 'Webinar 1' },
			{ id: 2, title: 'Webinar 2' },
		];

		return (
			<>
				<InspectorControls key="webinar-inspector">
					<PanelBody title={ __( 'Webinar Details', 'st-webinar-management' ) }>
{/* 					<SelectControl
						label={ __( 'Select Webinar', 'textdomain' ) }
						value={ webinarId }
						options={ webinars.map( webinar => ( { value: webinar.id, label: webinar.title } ) ) }
						onChange={ ( newId ) => setAttributes( { webinarId: newId } ) }
					/> */}

					</PanelBody>
				</InspectorControls>
				<div { ...blockProps } className="webinar-block-editor">
					<h2>{ __( 'Webinar Details', 'textdomain' ) }</h2>
					{/* Textboxes for title, subtitle, and other details */}
					<div>
						<TextControl
							label={ __( 'Title', 'st-webinar-management' ) }
							value={ title }
							onChange={ onChangeTitle }
						/>
						<TextControl
							label={ __( 'Subtitle', 'st-webinar-management' ) }
							value={ subtitle }
							onChange={ onChangeSubtitle }
						/>
						<div style={ { display: 'flex', position: 'relative' } }>
							<input
								type="text"
								placeholder={ __( 'Start Date & Time', 'st-webinar-management' ) }
								onFocus={ onOpenStartDatePicker }
								value={ startDate }
								readOnly // Disable text input
							/>
							{isStartDatePickerOpen && (
								<div className="webinar-date-time-picker">
									<DateTimePicker
										currentDate={ startDate }
										onChange={ onChangeStartDate }
										onClose={ onCloseDatePicker }
									/>
								</div>
							)}
						</div>
						<div style={ { display: 'flex', position: 'relative' } }>
							<input
								type="text"
								placeholder={ __( 'End Date & Times', 'st-webinar-management' ) }
								onFocus={ onOpenEndDatePicker }
								value={ endDate }
								readOnly // Disable text input
							/>
							{isEndDatePickerOpen && (
								<div className="webinar-date-time-picker">
									<DateTimePicker
										currentDate={ endDate }
										onChange={ onChangeEndDate }
										onClose={ onCloseDatePicker }
									/>
								</div>
							)}
						</div>
{/* 						<TextControl
							label={ __( 'Duration', 'st-webinar-management' ) }
							value={ duration }
							onChange={ onChangeDuration }
						/> */}
						<div style={ { display: 'flex', position: 'relative' } }>
							<TextControl
								label={ __( 'Duration', 'st-webinar-management' ) }
								value={ duration }
								onClick={ () => setIsOpen(true) } // Open modal on click
								readOnly // Disable text input
							/>
							<div className="duration-picker-modal">
								{isOpen && (
									<DurationPicker
										onChange={ onChangeDuration }
										initialDuration={{ hours: 0, minutes: 0 }} // Set initial duration
										showSeconds={false} // Hide seconds selection
									/>
								)}
							</div>
						</div>
						<TextareaControl
							label={ __( 'Description', 'st-webinar-management' ) }
							value={ description }
							onChange={ onChangeDescription }
						/>
						<TextControl
							label={ __( 'Registration Form', 'st-webinar-management' ) }
							value={ registrationForm }
							onChange={ onChangeRegistrationForm }
						/>
						<TextControl
							label={ __( 'Streaming Link', 'st-webinar-management' ) }
							value={ streamingLink }
							onChange={ onChangeStreamingLink }
						/>
						{/* Highlight management section */}
						<h3>{ __( 'Highlights', 'st-webinar-management' ) }</h3>
						<InnerBlocks
							template={ [ [ 'st-webinar-management/highlight' ] ] } // Preset template with one Highlight block
							templateLock="all" // Lock entire template, allowing only Highlight blocks
							allowedBlocks={ [ 'st-webinar-management/highlight' ] }
						>
						</InnerBlocks>
						<button onClick={ addHighlight }>{ __( 'Add Highlight', 'st-webinar-management' ) }</button>

					{/* Textboxes for title, subtitle, and other details */}
					</div>
				</div>
				<InnerBlocks
					template={ [] } // Empty template to prevent default content
					templateLock="all" // Lock entire template
					allowedBlocks={ [ 'st-webinar-management/highlight' ] } // Allow only highlight block
				/>
			</>
		);
	},
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
			highlights
		} = attributes;

		// Implement logic to create a new webinar post with the attributes
		// using WordPress APIs (e.g., wp.apiFetch)

		const createWebinar = async () => {
		  const response = await wp.apiFetch( {
			path: '/wp/v2/webinars',
			method: 'POST',
			data: {
			  title,
			  subtitle,
			  // ... (map other attributes to post fields)
			  meta: {
				startDate,
				endDate,
				duration,
				description,
				registrationForm,
				streamingLink,
				highlights, // Add highlights as an array of objects
			  },
			},
		  } );
		  // Handle the response (success/error)
		  if ( response ) {
			// Display saved title or a success message
			return <h2>{ title }</h2>;
		  } else {
			// Display error message
			return <p>{ __( 'Error creating webinar. Please try again.', 'st-webinar-management' ) }</p>;
		  }
		};

		return createWebinar();
	},
} );

// Optional: Define the Highlight component (assuming it's in the same folder)
const Highlight = ( { highlight, onHighlightChange } ) => {
	// ... (implement editing functionality for time, description, and speakers)
	// ... (return JSX to render the highlight details)
  };

// Define the highlight block
registerBlockType( 'st-webinar-management/highlight', {
	title: 'Highlight',
	icon: 'dashicons-clock',
	category: 'common',
	attributes: {
		time: {
			type: 'string',
		},
		description: {
			type: 'string',
		},
		speakers: {
			type: 'array',
			default: [],
		},
	},
	edit: ( { attributes, setAttributes } ) => {
		const { time, description } = attributes;
		return (
			<div className="webinar-highlight">
				<label htmlFor="highlight-time">Time:</label>
				<input type="time" id="highlight-time" value={ time } onChange={ ( e ) => setAttributes( { time: e.target.value } ) } />
				<label htmlFor="highlight-description">Description:</label>
				<textarea id="highlight-description" value={ description } onChange={ ( e ) => setAttributes( { description: e.target.value } ) } />
			</div>
		);
	},
	save: ( { attributes } ) => {
		const { time, description } = attributes;
		return (
			<div className="webinar-highlight">
				<span className="webinar-highlight-time">{ time }</span>
				<p className="webinar-highlight-description">{ description }</p>
			</div>
		);
	},
});


