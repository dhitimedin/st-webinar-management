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
	const { highlightRows } = attributes;
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
				highlightTime: dayjs(),
				highlightDescription: '',
			},
		],
	);

	useEffect(() => {
		// Update the block attributes when the rows change
		setAttributes({ highlightRows: rows });
		setMeta({ ...meta, highlightRows: rows });
	}, [rows]);

	const addHighlightRow = () => {
		setRows([...rows, { index: rows.length, highlightTime: dayjs(), highlightDescription: '' }]);
		// setAttributes({ highlightRows: rows });
	};

	const removeHighlightRow = (index) => {
		const updatedRows = rows.filter((row) => row.index !== index);
		setRows(updatedRows);
	};

	const updateHighlightRow = (rowIndex, updatedData) => {
		const updatedRows = rows.map((row) => {
			if (row.index === rowIndex) {
				return { ...row, ...updatedData };
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
							value={dayjs(row.highlightTime) || dayjs()}
							onChange={
								(newValue) => updateHighlightRow(row.index, { ...row, highlightTime: newValue })
							}
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
			<button type="button" className="add-row-btn" onClick={addHighlightRow}>
				{ __('Add Highlight', 'st-webinar-management') }
			</button>
		</div>
	);
}
