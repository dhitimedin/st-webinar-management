import React from 'react';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { InspectorControls, RichText } from '@wordpress/block-editor';
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
import DurationPicker from 'react-duration-picker';
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

	const modalRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const [timeCheck, setTimeCheck] = useState(startDate);

	useEffect(() => {
		setMeta({ ...meta, title: postTitle });
	}, [postTitle]);

	useEffect(() => {
		// Add event listener on modal open
		const handleClickOutside = (event) => {
			if (
				isOpen
				&& modalRef.current
				&& !modalRef.current.contains(event.target)
				&& !modalRef.current.contains(event.currentTarget)
			) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}

		return () => {
			// Remove event listeners on unmount
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isOpen]);

	const onChangeSubtitle = (newSubtitle) => {
		setMeta({ ...meta, subtitle: newSubtitle });
	};

	const onChangeStartDate = (newStartDate) => {
		setMeta({ ...meta, startDate: newStartDate });
		setTimeCheck(newStartDate.toString());
	};

	const onChangeEndDate = (newEndDate) => {
		setMeta({ ...meta, endDate: newEndDate });
	};

	const validateDuration = (newDuration) => {
		const regex = /^(\d+ )?(hours?|hrs?) ?(\d+ )?(mins?|min(?:utes)?)?$/i;
		return regex.test(newDuration);
	};

	const toggleModal = () => {
		setIsOpen(!isOpen); // Toggle state based on current value
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

	const onChangeDuration = (newDuration) => {
		if (newDuration !== '') {
			const formattedDuration = formatDuration(newDuration);
			const currentDuration = meta?.duration;
			if (formattedDuration !== currentDuration) {
				setMeta({ ...meta, duration: formattedDuration });
			}
		}
	};

	const onChangeDescription = (newDescription) => {
		setAttributes({ ...attributes, description: newDescription });
		setMeta({ ...meta, description: newDescription });
	};

	const onChangeRegistrationForm = (newRegistrationForm) => {
		setMeta({ ...meta, registrationForm: newRegistrationForm });
	};

	const onChangeStreamingLink = (newStreamingLink) => {
		setMeta({ ...meta, streamingLink: newStreamingLink });
	};

	// Inside the `edit` function:
	const onChangeSpeakers = (newSpeakers) => {
		setAttributes({ ...attributes, speakers: newSpeakers });
		setMeta({ ...meta, speakers: newSpeakers });
		// Update block state if necessary (consider using setAttributes)
	};

	return (
		<>
			<InspectorControls key="webinar-inspector">
				<PanelBody title={__('Speakers', 'st-webinar-management')}>
					<SpeakersChecklistControl
						label={__('Select Speakers', 'st-webinar-management')}
						speakers={speakers}
						setMeta={setMeta}
						onChange={onChangeSpeakers} // Update speakers using setMeta
					/>
				</PanelBody>
			</InspectorControls>
			<div className="webinar-block-editor">
				{/* Textboxes for title, subtitle, and other details */}
				<div>
					<TextControl
						label={__('Subtitle', 'st-webinar-management')}
						value={subtitle}
						onChange={onChangeSubtitle}
					/>
					<div className="webinar-date-time-diuration-container">
						<div className="webinar-date-time-container">
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label={__('Begins at', 'st-webinar-management')}
									value={startDate ? dayjs(startDate) : null}
									onChange={onChangeStartDate}
								/>
							</LocalizationProvider>
						</div>
						<div className="webinar-date-time-container">
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label={__('Ends at', 'st-webinar-management')}
									value={endDate ? dayjs(endDate) : null}
									onChange={onChangeEndDate}
									minTime={timeCheck ? dayjs(timeCheck) : null}
									minDate={timeCheck ? dayjs(timeCheck) : null}
								/>
							</LocalizationProvider>
						</div>
						<div style={{ display: 'flex', position: 'relative' }}>
							<TextControl
								label={__('Duration', 'st-webinar-management')}
								value={duration}
								onChange={(value) => {
									// Validate duration if entered manually
									if (validateDuration(value)) {
										setAttributes({ duration: value });
									}
								}}
								onClick={(event) => {
									event.stopPropagation();
									toggleModal();
								}}
							/>
							<div ref={modalRef} className={`duration-picker-modal ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
								{isOpen && (
									<DurationPicker
										onChange={onChangeDuration}
										initialDuration={{ hours: 0, minutes: 0 }} // Set initial duration
										showSeconds={false} // Hide seconds selection
									/>
								)}
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<TextControl
							label={__('Registration Form', 'st-webinar-management')}
							value={registrationForm}
							onChange={onChangeRegistrationForm}
						/>
						<TextControl
							label={__('Streaming Link', 'st-webinar-management')}
							value={streamingLink}
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
						checked={speakers.some((selected) => selected.id === speaker.id)}
						onChange={(checked) => handleChange(speaker.id, checked)}
					/>
				))
			)}
		</BaseControl>
	);
};
