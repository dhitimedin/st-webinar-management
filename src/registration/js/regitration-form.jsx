import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const WebinarRegistrationForm = () => {
	const [formData, setFormData] = useState({
		fname: '',
		lname: '',
		email: '',
		consent: false,
	});
	const [registrationStatus, setRegistrationStatus] = useState(false);
	const [registrationStatusMessage, setRegistrationStatusMessage] = useState(null);

	const handleChange = (e) => {
		const {
			name,
			value,
			type,
			checked,
		} = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('/wp-json/st-webinar-management/v1/submit-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				setRegistrationStatus(true);
				setRegistrationStatusMessage('Successfully registered!');
				// Reset form fields upon successful registration
				setFormData({
					fname: '',
					lname: '',
					email: '',
					consent: false,
				});
			} else {
				const errorData = await response.json();
				setRegistrationStatus(false);
				setRegistrationStatusMessage(errorData.message || 'Registration failed. Please try again.');
			}
		} catch (error) {
			console.error('Error:', error);
			setRegistrationStatus(false);
			setRegistrationStatus('An error occurred. Please try again later.');
		}
	};

	return (
		<div>
			{registrationStatus ? (
				<p>{registrationStatusMessage}</p>
			) : (
				<>
					{registrationStatusMessage && <div className="error-message">{registrationStatusMessage}</div>}
					<form id="st-webinar-registration-form" name="st-webinar-registration-form" method="post" onSubmit={handleSubmit} className="st-registration-container">
						<div className="st-registration-input-container">
							<label htmlFor="fname">{__('First name:', 'st-webinar-management')}</label>
							<input type="text" id="fname" name="fname" value={formData.fname} onChange={handleChange} />
						</div>
						<div className="st-registration-input-container">
							<label htmlFor="lname">{__('Last name:', 'st-webinar-management')}</label>
							<input type="text" id="lname" name="lname" value={formData.lname} onChange={handleChange} />
						</div>
						<div className="st-registration-input-container">
							<label htmlFor="st-email">{__('Email:', 'st-webinar-management')}</label>
							<input type="email" id="st-email" name="email" value={formData.email} onChange={handleChange} />
						</div>
						<div className="st-acknowledgement-box">
							<input type="checkbox" id="st-data-consent" name="consent" checked={formData.consent} onChange={handleChange} required />
							<label htmlFor="st-data-consent">
								{__("I acknowledge and agree to the terms outlined above regarding Sagacitas Technologies Pvt. Ltd's collection, storage, and use of my personal data.", 'st-webinar-management')}
							</label>
						</div>
						<div className="st-register-button-container">
							<input type="submit" className="st-register-button" value="Register me" />
						</div>
					</form>
				</>
			)}
		</div>
	);
};

export default WebinarRegistrationForm;
