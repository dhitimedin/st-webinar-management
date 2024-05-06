import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import Edit from './edit';
import Save from './save';

// Import your SCSS file
import '../scss/promotion-block.scss';

registerBlockType(metadata.name,{
	title: metadata.title,
	icon: metadata.icon,
    attributes: metadata.attributes,
    category: metadata.category,
    edit: Edit,
    save: Save // Add the save function to display the block on the front end
});
