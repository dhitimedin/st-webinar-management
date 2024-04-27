import React from 'react';
import { TextControl } from '@wordpress/components';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

export default function HighlightEdit({ attributes, setAttributes }) {
	const { highlightRows, minTime, maxTime } = attributes;
	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[],
	);
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	// State management for dynamic rows
	const [rows, setRows] = useState(
		highlightRows
		|| [
			{
				index: 0,
				highlightTime: null,
				highlightDescription: '',
			},
		],
	);

	// State for minTime and maxTime
	const [minTimeState, setMinTimeState] = useState(minTime);
	const [maxTimeState, setMaxTimeState] = useState(maxTime);

	useEffect(() => {
		// Update the block attributes when the rows change
		setAttributes({ ...attributes, highlightRows: rows });
		setMeta({ ...meta, highlightRows: rows });
	}, [rows]);

	useEffect(() => {
		if (minTime) {
			setMinTimeState(minTime);
		}

		if (maxTime) {
			setMaxTimeState(maxTime);
		}
	}, [minTime, maxTime]);

	const addHighlightRow = () => {
		setRows([...rows, { index: rows.length, highlightTime: null, highlightDescription: '' }]);
		// setAttributes({ highlightRows: rows });
	};

	const removeHighlightRow = (index) => {
		const updatedRows = rows.filter((row) => row.index !== index);
		setRows(updatedRows);
	};

	const updateHighlightRow = (rowIndex, newData) => {
		const updatedRows = rows.map((row, index) => {
			if (index === rowIndex) {
				const updatedRow = { ...row, ...newData };
				// Convert highlightTime to string if it exists
				if (newData.highlightTime) {
					updatedRow.highlightTime = newData.highlightTime.toString();
				}
				return updatedRow;
			}
			return row;
		});
		setRows(updatedRows);
	};

	return (
		<div className="highlight-row-container">
			<h2>{__('Add Highlights', 'st-webinar-management')}</h2>
			{rows.map((row) => (
				<div key={row.index} className="highlight-row">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<TimePicker
							ampm={false}
							closeOnSelect
							label={__('Basic time picker', 'st-webinar-management')}
							value={dayjs(row.highlightTime) || null}
							onChange={
								(newValue) => updateHighlightRow(row.index, { ...row, highlightTime: newValue })
							}
							minTime={minTimeState ? dayjs(minTimeState) : null}
							maxTime={maxTimeState ? dayjs(maxTimeState) : null}
						/>
					</LocalizationProvider>
					<TextControl
						label={__('Highlight Description', 'st-webinar-management')}
						value={row.highlightDescription || ''} // Use default highlightDescription or row specific description
						onChange={
							(newDescription) => updateHighlightRow(
								row.index,
								{ ...row, highlightDescription: newDescription },
							)
						}
					/>
					<button type="button" className="remove-row-btn" onClick={() => removeHighlightRow(row.index)}>
						{ __('Remove', 'st-webinar-management') }
					</button>
				</div>
			))}
			<button
				type="button"
				className="add-row-btn"
				disabled={!minTimeState || !maxTimeState} // Disable button if minTime or maxTime is not set
				onClick={addHighlightRow}
			>
				{ __('Add Highlight', 'st-webinar-management') }
			</button>
		</div>
	);
}
