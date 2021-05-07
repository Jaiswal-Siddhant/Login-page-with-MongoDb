const mongoose = require('mongoose');
const validator = require('validator');

/**
 * 	Creating User schema in mongoose which contains format
 * 	Format here is : 
 * 		email: String [required]
 * 		password: String [required]
 */
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: [true, 'Already present'],
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Invalid Error');
			}
		},
	},
	password: {
		type: String,
		minlength: 8,
		required: true
	},
});

// Creating new Collection using model
const User = new mongoose.model('DbLogin', userSchema);

// Exporting User schema
module.exports = User;