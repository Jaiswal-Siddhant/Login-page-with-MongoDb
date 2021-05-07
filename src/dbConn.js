/**
 * 	  API endpoints:
 * 		1. http://localhost:3000/users
 * 			Method: get
 * 			Description: Get All Users
 * 
 * 		2. http://localhost:3000/users
 * 			Method: post
 * 			Description: Create user entry in DB
 * 
 * 		3. http://localhost:3000/user/:query
 * 			Method: get
 * 			Description: Get Specific user from DB
 * 
 * 		4. http://localhost:3000/users/:key
 * 			Method: patch
 * 			Description: Update a user
 * 
 * 		5. http://localhost:3000/users
 * 			Method: delete
 * 			Description: Delete User from DB {request is stored in body}
 * 
 * 		6. http://localhost:3000/verify/:EmailQuery
 * 			Method: get
 * 			Description: Get Email and Password from DB
 * 
 * 		7. http://localhost:3000/getEmail/:EmailQuery
 * 			Method: get
 * 			Description: Get if Email is Valid or not
 * 
 * 		8. http://localhost:3000/setpass/
 * 			Method: patch
 * 			Description: Update Password for User Email sent form body of request
 */

const { request } = require('express');

// Importing express module
const express = require('express');

// creating schema object
const Users = require('./models/users');

// connecting to mongo
require('./db/conn');

/********************************************* */
const cors = require('cors');
var bodyParser = require('body-parser');
/********************************************* */

// Creating instance of express module
const app = express();

// Using 'cors' module to avoid CORS error
app.use(cors());

// Initializing port
const port = process.env.PORT || 3000;

// Using BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// using JSON for express
app.use(express.json());

// code to avoid CORS error
app.use(function (_req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('x-Trigger', 'CORS');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// To save User info
app.post('/users', async (req, res) => {
	var isOk = { result: false };
	try {
		// Create Entry of user
		const user = new Users(req.body);

		// save entry to DB
		const createUser = await user.save();
		isOk.result = true;
	} catch (e) {
		isOk.result = false;
		console.log('e');
	} finally {
		// Send JSON object isOk
		res.setHeader('Content-Type', 'application/json');
		res.status(201).end(JSON.stringify(isOk));
	}
});

// To get all students in DB
app.get('/users', async (_req, res) => {
	try {
		// Users.find() returns all entries in DB
		const result = await Users.find();
		res.status(200).send(result);
	} catch (e) {
		res.status(404).send();
		console.log(e);
	}
});

// To get specific user
app.get('/user/:key', async (req, res) => {
	try {
		// sending creds in query format is not good practice. It's for sake of demonstration
		const key = req.query;
		const result = await Users.find(key);

		// DEBUG message
		console.log(result);

		// If User is found in DB retrun result
		if (result.length != 0) {
			res.status(200).send(result);
		} else {
			// Else return Not Found
			res.status(404).send('Not Found!');
			console.log('404');
		}
	} catch (error) {
		res.status(404).send();
		console.log('error');
	}
});

// To Update User info
app.patch('/users/:key', async (req, res) => {
	try {
		const key = req.query;
		const toUpdate = req.body;
		
		// Documentation => https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/

		const result = await Users.findOneAndUpdate(
			key,
			{ $set: toUpdate },
			{ useFindAndModify: false }
		);
		if (result.length != 0) {
			res.status(200).send(result);
		} else {
			res.status(404).send();
		}
	} catch (e) {
		res.status(404).send();
		console.log(e);
	}
});

// Not of much use as we are not using it in login form 
// To Delete User Info
app.delete('/users', async (req, res) => {
	try {
		const toDelete = req.body;
		const result = await Users.deleteOne(toDelete);
		if (result.length != 0) {
			res.status(200).send(result);
		} else {
			res.status(404).send();
		}
	} catch (e) {
		res.status(404).send();
		console.log(e);
	}
});

// To Verify User for Login at index.html
app.get('/verify/:user', async (req, res) => {
	try {
		const key = req.query;
		const result = await Users.find(key);

		// Fetch email id and password from user input
		let gotMail = req.query.email.toString();
		let gotPass = req.query.password.toString();

		// Fetch email id and password from DB
		let searchedMail = result[0].email.toString();
		let searchedPass = result[0].password.toString();

		var jsonObj = {
			found: false,
			url: '',
		};

		// Check if they match
		if (gotMail == searchedMail && gotPass == searchedPass) {
			var user = { found: true };
			console.log('OK');
		} else {
			res.status(404).send();
		}
	} catch (e) {
		var user = { found: false };
		console.log('F');
	} finally {
		// Code to avoid CORS error and to redirect user
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Headers', 'Content-Type');
		if (user.found) {
			res.status(200).redirect('http://localhost:5500/demo.html');
		} else {
			res.status(404).end();
		}
	}
});

// To verify user email for forget password
app.get('/getEmail/:user', async (req, res) => {
	var isOk = { result: false };
	try {

		// Fetch Email from query 
		const key = req.query;

		// Find user in DB
		const result = await Users.find(key);
		
		let gotMail = req.query.email.toString();
		let searchedMail = result[0].email.toString();
		// console.log(gotMail==searchedMail);
		if (gotMail == searchedMail) {
			isOk.result = true;
			console.log('OK');
		} else {
			isOk.result = false;
		}
	} catch (e) {
		console.log('wrong');
		isOk.result = false;
	} finally {

		// Code to avoid CORS and to send JSON object
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Headers', 'Content-Type');
		res.send(JSON.stringify(isOk));
	}
});

// Change Password in Forgot Password
app.patch('/setPass/', async (req, res) => {
	try {
		const toUpdate = req.body;
		console.log(toUpdate);
		const result = await Users.findOneAndUpdate(
			toUpdate.enail,
			{ $set: { password: toUpdate.pass } },
			{ useFindAndModify: false }
		);
		var isOk = { ok: false };
		
		// If Password is changed successfully 
		if (result.length != 0) {
			isOk.ok = true;
		} else {
			isOk.ok = false;
		}
		if (isOk.ok) {
			res.status(200).send(isOk);
		} else {
			res.status(404).send(isOk);
		}
		res.end();
	} catch (e) {
		res.status(404).send();
		console.log(e);
	}
});

// Start Listening at ${port}
app.listen(port, () => {
	console.log(`Listening on port ${port}....`);
});