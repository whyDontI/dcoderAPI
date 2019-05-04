const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
	const { email, password, password2 } = req.body;
	let errors = [];

	//Check required
	if(!email || !password || !password2){
		errors.push({ message: "Please fill in all the fields" });
	}

	// Password match
	if(password !== password2 ){
		errors.push({ message: "Passwords do not match" })
	}

	if(errors.length > 0){
		console.log(req.body);
		res.send(errors);
	} else {
		// No Errors, good to go

		User.findOne({ email: email })
		.then(user => {
			if(user){
				res.status(201).json({
					message: 'User already exists'
				});
			} else {
				const newUser = new User({
					email,
					password
				});
				// Hash password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash)	=>{
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
						.then(user => {
							res.status(200).json({
								email: user.email,
								message: 'Registered Successfully'
							});
						})
						.catch(err => console.log(err));
					})
				})
			}
		})
		.catch(err => console.log(err));
	}
});

// Login handle

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email })
	.exec()
	.then(user => {
		if(!user){
			return res.status(401).json({
				message: "Auth Failed"
			});
		}
		console.log(req.body.password + " " + user.password.length);
		bcrypt.compare(req.body.password, user.password, (err, result) => {
			console.log("Error " + err);
			if(err || !result){
				return res.status(401).json({
					message: "Auth Failed"
				});
			}

			if(result){

				const token = jwt.sign({
					email: user.email,
					userId: user._id
					},
					"dcoder",
					{
						expiresIn: '1h'
					}
				);

				return res.status(200).json({
					email: user.email,
					message: 'Auth successful',
					token: token
				});
			}

		});
	})
	.catch(err => {
		console.log(err);
	});
});

module.exports = router;