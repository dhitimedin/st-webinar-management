import React from 'react';
import { createRoot } from 'react-dom';
import WebinarRegistrationForm from './regitration-form';

document.addEventListener('DOMContentLoaded', () => {
	const webinarContainer = document.querySelector('#st-registration-form-container');
	const root = createRoot(webinarContainer);
	root.render(<WebinarRegistrationForm />);
});
