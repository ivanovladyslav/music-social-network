const User = require('../models/user.model');
const Post = require('../models/post.model');
const Message = require('../models/message.model');
var async = require("async");
const path = require('path');
const fs = require('fs');

exports.signup = function(req, res) {
	res.render('signup');
}

exports.login = function(req, res) {
	if(!req.session.username) {
		res.render('login');
	} else {
		res.send('you already logged in!');
	}
}

exports.signup_submit = function(req, res) {
	var user = new User ({
	  	email: req.body.email,
	  	username: req.body.username,
	  	password: req.body.password,
	  	passwordConf: req.body.passwordConf
	});
//use schema.create to insert data into the db
	user.save(function (err, next) {
		if (err) {
				console.log(err)
			} else {
				res.redirect('login');
			}
		});
}

exports.login_submit = function(req, res) {
  	User.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err) console.log(err);
			if(user) {
			  	req.session.username = user.username;
			  	req.session.email = user.email;
			  	req.session.user_id = user._id.toString();
					req.session.avatar = user.avatar.toString();
					req.session.description = user.description;
			  	res.redirect('../profile/'+user.username);
			}
  });
}

exports.logout = function(req, res) {
	if(req.session) {
		req.session.destroy(function(err) {
			if(err) {
				res.send(err);
			} else {
				res.redirect('/user/login');
			}
		});
	}
}

exports.profile = async function(req, res) {
	let isUserInFriends = false;
	let userId = await User.findOne({ username:req.params.id });
	let postData = Post.find({ authorid: userId._id });
	let userData = User.findOne({ username: req.params.id });

	userData.select('username avatar description id friends');
	postData.select('title tags authorname cover id');

	userData.exec(function(err, userDataExecuted) {
		if (err) console.log(err);

		user = JSON.parse(JSON.stringify(userDataExecuted));

		if(user.friends.includes(req.session.username)) {
			isUserInFriends = true;
		}
		postData.exec(function (err, posts) {
			if (err) console.log(err);
			res.render('profile', {user: user, username: req.session.username, posts, isUserInFriends});
		});
	});
}

exports.profile_edit = function(req, res) {
	if(req.session.username) {
		res.render('profile_edit', {
			profile_nickname: req.session.username,
			profile_description: req.session.description,
			profile_avatar: req.session.avatar,
			username: req.session.username
		});
	} else {
		res.redirect('/user/login');
	}
}

exports.profile_edit_submit = function(req, res) {
	req.session.username = req.body.name;
	User.findByIdAndUpdate(
		req.session.user_id,
	{
		username: req.body.name,
		description: req.body.description
	},
	function(err, raw) {
		if(err) res.send(err);
		Post.updateMany(
			{ authorid: req.session.user_id },
			{ $set: {authorname: req.session.username}},
			function(err) {
				if(err) res.send(err);
				res.redirect('/user/profile/'+req.session.username);
		});
	});
}

exports.profile_avatar_submit = function(req, res) {
	req.session.avatar = req.file.filename;
	User.findByIdAndUpdate(req.session.user_id, { avatar: req.file.filename }, function(err, raw) {
		if(err) res.send(err);
	});
	res.redirect('/user/profile/'+req.session.username);
}

exports.messages = function(req, res) {
	Message.find({ to: req.session.username }, function(err, messagesToSend) {
		messages = JSON.parse(JSON.stringify(messagesToSend));
		console.log(messages);
		res.render('messages', {messages, username: req.session.username});
	});
}

exports.invitefriend = function(req, res) {
	var message = new Message ({
	  	text: "",
			from: req.session.username,
			to: req.params.to,
			messagetype: "FriendInvite"
	});
//use schema.create to insert data into the db
	message.save(function (err, next) {
		if (err) {
				console.log(err)
			} else {
				res.redirect('/user/profile/'+req.params.to);
			}
		});
}

exports.acceptfriend = function(req, res) {
	User.findByIdAndUpdate(req.session.user_id, { $push: { friends: req.params.from } }, function(err, raw) {
		Message.remove({form: req.params.from, to: req.session.username});
		if(err) res.send(err);
		res.redirect('/user/profile/'+req.session.username);
	});
}

exports.search = function(req, res) {
	User.find({username: {"$regex": new RegExp(req.param('username').replace(/\s+/g,"\\s+"), "gi")} }, function(err, users){
		if(err) throw err;
		if(users != "") {
			res.render('matches',{results: users, username: req.session.username});
		} else {
			res.send("No matched results");
		}
	});
}
