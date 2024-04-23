import { React } from 'react';
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
			{ highlightTime: dayjs() },
			{ highlightDescription: '' },
		],
	);

	useEffect(() => {
		// Update the block attributes when the rows change
		setAttributes({ highlightRows: rows });
		setMeta({ ...meta, highlightRows: rows });
	}, [rows]);

	const addHighlightRow = () => {
		setRows([...rows, { highlightTime: dayjs(), highlightDescription: '' }]);
		// setAttributes({ highlightRows: rows });
	};

	const removeHighlightRow = (index) => {
		const updatedRows = [...rows];
		updatedRows.splice(index, 1);
		setRows(updatedRows);
	};

	const updateHighlightRow = (rowIndex, updatedData) => {
		const updatedRows = [...rows];
		updatedRows[rowIndex] = updatedData;
		setRows(updatedRows);
	};

	return (
		<div className="highlight-row-container">
			{rows.map((row, index) => (
				<div key={index} className="highlight-row">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<TimePicker
							ampm={false}
							closeOnSelect={true}
							label={__('Basic time picker', 'st-webinar-management')}
							value={dayjs(row.highlightTime) || dayjs()}
							onChange={
								(newValue) => updateHighlightRow(index, { ...row, highlightTime: newValue })
							}
						/>
					</LocalizationProvider>
					<TextControl
						label={__('Highlight Description', 'st-webinar-management')}
						value={row.highlightDescription || ''} // Use default highlightDescription or row specific description
						onChange={
							(newDescription) => updateHighlightRow(
								index,
								{ ...row, highlightDescription: newDescription },
							)
						}
					/>
					<button className="remove-row-btn" onClick={() => removeHighlightRow(index)}>
						{ __('Remove', 'st-webinar-management') }
					</button>
				</div>
			))}
			<button className="add-row-btn" onClick={addHighlightRow}>
				{ __('Add Highlight', 'st-webinar-management') }
			</button>
		</div>
	);
}
