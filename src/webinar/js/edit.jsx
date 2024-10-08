import React from 'react';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect, dispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	BaseControl,
	CheckboxControl,
} from '@wordpress/components';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
	const postTitle = useSelect(
		(select) => select('core/editor').getEditedPostAttribute('title'),
		[],
	);
	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[],
	);
	const blocks = useSelect(
		(select) => select('core/block-editor').getBlocks(),
		[],
	);
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');
	const {
		subtitle,
		startDate,
		endDate,
		duration,
		registrationForm,
		streamingLink,
		speakers,
	} = meta;

	const [timeCheck, setTimeCheck] = useState(startDate);
	const [isStartDateSelected, setIsStartDateSelected] = useState(false);
	const [selectedDuration, setSelectedDuration] = useState(duration);

	useEffect(() => {
		setMeta({ ...meta, title: postTitle });
		setAttributes({ ...attributes, title: postTitle });
	}, [postTitle]);

	useEffect(() => {
		// Update isStartDateSelected on startDate change
		setIsStartDateSelected(!!attributes.startDate);
		if ( attributes.startDate ) {;
			setTimeCheck(attributes.startDate);
		}
	}, [startDate]);

	const onChangeSubtitle = (newSubtitle) => {
		setMeta({ ...meta, subtitle: newSubtitle });
		setAttributes({ ...attributes, subtitle: newSubtitle });
	};

	const onChangeStartDate = (newStartDate) => {
		const dateString = newStartDate.format('YYYY-MM-DD HH:mm Z');
		setMeta({ ...meta, startDate: dateString });
		setAttributes({
			...attributes,
			startDate: dateString,
		});
		setTimeCheck(dateString);
		setIsStartDateSelected(true); // Enable endDate when startDate is selected
	};

	const onChangeEndDate = (newEndDate) => {
		// Check if startDate is defined and greater than newEndDate
		if (startDate && dayjs(startDate).isBefore(newEndDate, 'minute')) {
			// Calculate duration in hours and minutes
			const durationHours = dayjs(newEndDate).diff(startDate, 'hours');
			const durationMinutes = dayjs(newEndDate).diff(startDate, 'minutes') % 60;
			const calculatedDuration = `${durationHours} hour${durationHours !== 1 ? 's' : ''} ${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''}`;
			// Update duration with calculated values
			const dateString = newEndDate.format('YYYY-MM-DD HH:mm Z');
			setMeta({
				...meta,
				endDate: dateString,
				duration: calculatedDuration,
			});
			setSelectedDuration(calculatedDuration);
			setAttributes({
				...attributes,
				endDate: dateString,
				duration: calculatedDuration,
			});
		} else {
			const dateString = newEndDate.format('YYYY-MM-DD HH:mm Z');
			setMeta({ ...meta, endDate: dateString });
			setAttributes({
				...attributes,
				endDate: dateString,
			});
		}
		// setMeta({ ...meta, endDate: newEndDate });
	};

	const validateDuration = (newDuration) => {
		const regex = /^(\d+ )?(hours?|hrs?) ?(\d+ )?(mins?|min(?:utes)?)?$/i;
		return regex.test(newDuration);
	};

	const formatDuration = (newDuration) => {
		const { hours, minutes } = newDuration;
		let formattedDuration = '';
		if (hours > 0) {
			formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
		}
		if (minutes > 0) {
			formattedDuration += formattedDuration.length > 0 ? ' ' : '';
			formattedDuration += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
		}
		return formattedDuration;
	};

	const findAdjacentBlock = (blockName) => {
		const adjacentBlock = blocks.find((block) => block.name === blockName);
		return adjacentBlock;
	};

	const updateAdjacentBlockState = (adjacentBlock, attributeName, attributeValue) => {
		if (!adjacentBlock) return; // Handle case where block is not found

		// Assuming the adjacent block uses setAttributes to update state
		dispatch('core/block-editor').updateBlockAttributes(adjacentBlock.clientId, { [attributeName]: attributeValue });
	};

	useEffect(() => {
		const adjacentBlock = findAdjacentBlock('st-webinar-management/highlight');

		if (isStartDateSelected && endDate && adjacentBlock) {
			updateAdjacentBlockState(adjacentBlock, 'minTime', startDate);
			updateAdjacentBlockState(adjacentBlock, 'maxTime', endDate);
		} else if (adjacentBlock) {
			// Clear minTime and maxTime if conditions not met
			updateAdjacentBlockState(adjacentBlock, 'minTime', null);
			updateAdjacentBlockState(adjacentBlock, 'maxTime', null);
		}
	}, [isStartDateSelected, endDate]);

	const onChangeDescription = (newDescription) => {
		setAttributes({ ...attributes, description: newDescription });
		setMeta({ ...meta, description: newDescription });
	};

	const onChangeRegistrationForm = (newRegistrationForm) => {
		setMeta({ ...meta, registrationForm: newRegistrationForm });
		setAttributes({ ...attributes, registrationForm: newRegistrationForm });
	};

	const onChangeStreamingLink = (newStreamingLink) => {
		setMeta({ ...meta, streamingLink: newStreamingLink });
		setAttributes({ ...attributes, streamingLink: newStreamingLink });
	};

	const onChangeSpeakers = (newSpeakers) => {
		// Ensure that each speaker's avatar_urls field is a properly formatted string.
		const formattedSpeakers = newSpeakers.map((speaker) => ({
			...speaker,
			avatar_urls: typeof speaker.avatar_urls === 'string' ? speaker.avatar_urls : JSON.stringify(speaker.avatar_urls),
			id: parseInt(speaker.id),
		}));

		console.log( formattedSpeakers );
		console.log( formattedSpeakers[0]?.avatar_urls );
		console.log( typeof formattedSpeakers[0]?.avatar_urls );
		console.log( typeof formattedSpeakers[0]?.id );
		console.log( typeof formattedSpeakers[0]?.description );
		console.log( typeof formattedSpeakers[0]?.name );

		// Update both block attributes and meta.
		setAttributes({ ...attributes, speakers: [...formattedSpeakers] });
		setMeta({ ...meta, speakers: formattedSpeakers });
	};

	return (
		<>
			<InspectorControls key="webinar-inspector">
				<PanelBody title={__('Speakers', 'st-webinar-management')}>
					<SpeakersChecklistControl
						label={__('Select Speakers', 'st-webinar-management')}
						speakers={attributes.speakers ? attributes.speakers : [] }
						setMeta={setMeta}
						onChange={onChangeSpeakers} // Update speakers using setMeta
					/>
				</PanelBody>
			</InspectorControls>
			<div className="webinar-block-editor">
				{/* Textboxes for title, subtitle, and other details */}
				<TextControl
					label={__('Subtitle', 'st-webinar-management')}
					value={attributes.subtitle}
					onChange={onChangeSubtitle}
				/>
				<div className="webinar-date-time-diuration-container">
					<div className="webinar-date-time-container">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								label={__('Begins at', 'st-webinar-management')}
								value={attributes.startDate ? dayjs(attributes.startDate) : null}
								onChange={onChangeStartDate}
							/>
						</LocalizationProvider>
					</div>
					<div className="webinar-date-time-container">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								label={__('Ends at', 'st-webinar-management')}
								value={attributes.endDate ? dayjs(attributes.endDate) : null}
								onChange={onChangeEndDate}
								minTime={timeCheck ? dayjs(timeCheck) : null}
								minDate={timeCheck ? dayjs(timeCheck) : null}
								disabled={!isStartDateSelected} // Disable endDate initially
							/>
						</LocalizationProvider>
					</div>
					<div style={{ display: 'flex', position: 'relative' }}>
						<TextControl
							label={__('Duration', 'st-webinar-management')}
							value={attributes.duration}
							className="st-diable-duration"
						/>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<TextControl
						label={__('Registration Form', 'st-webinar-management')}
						value={attributes.registrationForm}
						onChange={onChangeRegistrationForm}
					/>
					<TextControl
						label={__('Streaming Link', 'st-webinar-management')}
						value={attributes.streamingLink}
						onChange={onChangeStreamingLink}
					/>
				</div>
				{/* Other controls */}
				<div className="webinar-description">
					{/* Label with for attribute */}
					<span className="field-header">
						{__('Description', 'st-webinar-management')}
					</span>
					<div>
						<RichText
							tagName="p"
							onChange={onChangeDescription}
							allowedFormats={['core/bold', 'core/italic']}
							value={attributes.description}
							placeholder={__('Write your text...')}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

const SpeakersChecklistControl = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [speakerLists, setSpeakerLists] = useState([]);
	const { label, onChange, speakers } = props;

	// Use select hook directly within the component body
	const registeredSpeakers = useSelect((select) => select('core').getUsers({ roles: 'speaker' }));

	useEffect(() => {
		// Fetch speakers inside useEffect
		const fetchSpeakers = async () => {
			const formattedSpeakers = registeredSpeakers?.map((speaker) => ({
				id: speaker.id,
				name: speaker.name,
				description: speaker.description,
				avatar_urls: JSON.stringify(speaker.avatar_urls),
			})) || [];
			setSpeakerLists(formattedSpeakers);
			setIsLoading(false);
		};

		fetchSpeakers();
	}, [registeredSpeakers]);

	const handleChange = (speakerId, checked) => {
		const updatedSpeakers = [...speakers]; // Copy to avoid mutation
		const speakerIndex = updatedSpeakers.findIndex((spkr) => spkr.id === speakerId);

		if (checked && speakerIndex === -1) {
			updatedSpeakers.push(speakerLists.find((spkr) => spkr.id === speakerId));
		} else if (!checked && speakerIndex !== -1) {
			updatedSpeakers.splice(speakerIndex, 1);
		}

		onChange(updatedSpeakers);
	};

	return (
		<BaseControl label={label}>
			{isLoading && speakerLists.length <= 0 ? (
				<p>{__('Loading speakers or an Empty speaker list...', 'st-webinar-management')}</p>
			) : (
				speakerLists.map((speaker) => (
					<CheckboxControl
						key={speaker.id}
						label={speaker.name}
						// Use props.metaKey.speakers for safety
						checked={speakers?.some((selected) => selected.id === speaker.id)}
						onChange={(checked) => handleChange(speaker.id, checked)}
					/>
				))
			)}
		</BaseControl>
	);
};
