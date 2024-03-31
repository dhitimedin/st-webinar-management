import { useState, useEffect, useRef } from '@wordpress/element';
import { InspectorControls, useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, DateTimePicker, SelectControl, BaseControl, CheckboxControl } from '@wordpress/components';
import DurationPicker from 'react-duration-picker';
import {MediaUpload} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
    const postTitle = wp.data.select( 'core/editor' ).getCurrentPost().title;

    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    // Inside the `edit` function:
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([]);

    const blockProps = useBlockProps();

    const postType = useSelect(
        ( select ) => select( 'core/editor' ).getCurrentPostType(),
        []
    );

    const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

    const title = meta[ 'title' ];
    const subtitle = meta[ 'subtitle' ];
    const thumbnail = meta[ 'thumbnail' ];
    const startDate = meta[ 'startDate' ];
    const endDate = meta[ 'endDate' ];
    const duration = meta[ 'duration' ];
/*     const description = meta[ 'description' ]; */
    const registrationForm = meta[ 'registrationForm' ];
    const streamingLink = meta[ 'streamingLink' ];
    const speakers = meta[ 'speakers' ];

    useEffect( () => {
        setMeta( { ...meta, title: postTitle } );
      }, [postTitle] );

     useEffect(() => {
        // Add event listener on modal open
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !modalRef.current.contains(event.currentTarget))
            {
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


    const onChangeSubtitle = ( newSubtitle ) => {
        setMeta( { ...meta, subtitle: newSubtitle } );
    };

    const onOpenStartDatePicker = () => {
        setIsStartDatePickerOpen( true );
    };

    const onOpenEndDatePicker = () => {
        setIsEndDatePickerOpen(true);
    };

    const onCloseDatePicker = () => {
        setIsStartDatePickerOpen(false);
        setIsEndDatePickerOpen(false);
    };

    const onChangeStartDate = ( newStartDate ) => {
        setMeta( { ...meta, startDate: newStartDate } );
        onCloseDatePicker();
    };

    const onChangeEndDate = ( newEndDate ) => {
        setMeta( { ...meta, endDate: newEndDate } );
        onCloseDatePicker();
    };

     const validateDuration = ( duration ) => {
        const regex = /^(\d+ )?(hours?|hrs?) ?(\d+ )?(mins?|min(?:utes)?)?$/i;
        return regex.test( duration );
    };

    const toggleModal = () => {
        setIsOpen(!isOpen); // Toggle state based on current value
    };

    const onChangeDuration = (newDuration) => {
        if (newDuration !== "") {
            const formattedDuration = formatDuration(newDuration);
            const currentDuration = meta?.duration;
            if (formattedDuration !== currentDuration) {
                setMeta({ ...meta, duration: formattedDuration });
            }
        }
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
        setAttributes( { ...attributes, description: newDescription } );
        setMeta( { ...meta, description: newDescription } );
    };

    const onChangeRegistrationForm = ( newRegistrationForm ) => {
        setMeta( { ...meta, registrationForm: newRegistrationForm } );
    };

    const onChangeStreamingLink = ( newStreamingLink ) => {
        setMeta( { ...meta, streamingLink: newStreamingLink } );
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
                <PanelBody title={ __( 'Speakers', 'st-webinar-management' ) }>
                    <SpeakersChecklistControl
                        label={ __( 'Select Speakers', 'st-webinar-management' ) }
                        speakers= {attributes.speakers}
                        setMeta={setMeta}
                        onChange={onChangeSpeakers} // Update speakers using setMeta
                    />
                </PanelBody>
            </InspectorControls>
            <div  className="webinar-block-editor">
                {/* Textboxes for title, subtitle, and other details */}
                <div>
                    <TextControl
                        label={ __( 'Subtitle', 'st-webinar-management' ) }
                        value={ subtitle }
                        onChange={ onChangeSubtitle }
                    />
                    <div style={ { display: 'flex', justifyContent: 'space-between' } }>
                        <div className={'webinar-date-time-duration-container'} >
                            <label className={'webinar-label'} htmlFor="startDateInput">  {/* Label with for attribute */}
                                {__( 'Begins at', 'st-webinar-management' )}
                            </label>
                            <input
                                type="text"
                                id="startDateInput"
                                placeholder={ __( 'Start Date & Time', 'st-webinar-management' ) }
                                onFocus={ onOpenStartDatePicker }
                                value={ startDate }
                                readOnly // Disable text input
                                onClick={(event) => {
                                    event.stopPropagation(); // Prevent click from bubbling up
                                    setIsStartDatePickerOpen(true);
                                }}
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
                        <div className={'webinar-date-time-duration-container'}>
                            <label className={'webinar-label'} htmlFor="endDateInput">  {/* Label with for attribute */}
                                {__( 'Ends at', 'st-webinar-management' )}
                            </label>
                            <input
                                type="text"
                                id="endDateInput"
                                placeholder={ __( 'End Date & Times', 'st-webinar-management' ) }
                                onFocus={ onOpenEndDatePicker }
                                value={ endDate }
                                readOnly // Disable text input
                                onClick={(event) => {
                                    event.stopPropagation(); // Prevent click from bubbling up
                                    setIsEndDatePickerOpen(true);
                                }}
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
                        <div style={ { display: 'flex', position: 'relative' } }>
                            <TextControl
                                label={ __( 'Duration', 'st-webinar-management' ) }
                                value={ duration }
                                onChange={ (value) => {
                                    // Validate duration if entered manually
                                    console.log( value );
                                    if (validateDuration(value)) {
                                        console.log( 'validate' );
                                        setAttributes({ duration: value });
                                    }
                                }}
                                onClick={ (event) => {
                                    event.stopPropagation();  // Prevent click from bubbling up
                                    toggleModal();
                                }} // Open modal on click
                                // readOnly // Disable text input
                            />
                            <div ref={modalRef} className={`duration-picker-modal ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
                                {isOpen && (
                                    <DurationPicker
                                        onChange={ onChangeDuration }
                                        initialDuration={{ hours: 0, minutes: 0 }} // Set initial duration
                                        showSeconds={false} // Hide seconds selection
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={ { display: 'flex', justifyContent: 'space-between' } }>
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
                    </div>
                    {/* Other controls */}
                    <div className="webinar-description">
                        <span className={'field-header'}>  {/* Label with for attribute */}
                            { __( 'Description', 'st-webinar-management' ) }
                        </span>
                        <div>
                            <RichText
                                { ...blockProps }
                                tagName="p"
                                onChange={ onChangeDescription }
                                allowedFormats={ [ 'core/bold', 'core/italic' ] }
                                value={ attributes.description }
                                placeholder={ __( 'Write your text...' ) }
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

    // Use select hook directly within the component body
    const speakersData = useSelect((select) => select('core').getUsers({ roles: 'speaker' }));

    useEffect(() => {
        // Fetch speakers inside useEffect
        const fetchSpeakers = async () => {
            const speakers = speakersData ? speakersData.map((speaker) => ({
                id: speaker.id,
                name: speaker.name,
                description: speaker.description,
                avatar_urls: speaker.avatar_urls,
            })) : [];
            setSpeakerLists(speakers);
            setIsLoading(false);
        };

        fetchSpeakers();
    }, [speakersData]);

    return (
        <BaseControl label={props.label}>
            {isLoading ? (
                <p>{__('Loading speakers...', 'st-webinar-management')}</p>
            ) : (
                speakerLists.length > 0 ? (
                    speakerLists.map((speaker, index) => (
                        <CheckboxControl
                            key={speaker.id}
                            label={speaker.name}
                            checked={props.speakers?.some((selected) => selected.id === speaker.id)} // Use props.metaKey.speakers for safety
                            onChange={(checked, value) => {
                                const updatedSpeakers = checked
                                    ? [...(props.speakers || []), speaker] // Handle case where speakers is initially empty
                                    : props.speakers?.filter((speaker) => speaker.id !== value);
                                // props.setMeta({ ...props.metaKey, speakers: updatedSpeakers });
                                props.onChange(updatedSpeakers);
                            }}
                        />
                    ))
                ) : (
                    <p>{__('No speakers selected.', 'st-webinar-management')}</p>
                )
            )}
        </BaseControl>
    );
};

