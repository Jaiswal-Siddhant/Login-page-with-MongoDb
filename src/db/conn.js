const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

// Connecting to MongoDB
mongoose
	.connect('mongodb://localhost:27017/user-api', {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Connection Successful');
	})
	.catch((_e) => {
		console.log('Error!');
	});
