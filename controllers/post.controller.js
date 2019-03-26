const Post = require('../models/post.model');
const User = require('../models/user.model');
var async = require("async");
const path = require('path');

exports.create_submit = async function(req, res) {
	console.log(req.body);
	var contributorsArray = [];
	if(req.body.contributors) {
		let contributorsFromRequest = req.body.contributors;
		let rolesFromRequest = req.body.roles;
		for (var i = 0; i < contributorsFromRequest.length; i++) {
			var idOfContributor = await User.findOne({username:contributorsFromRequest[i]});
			contributorsArray.push({
				id: idOfContributor._id,
				role: rolesFromRequest[i]
			});
		}
	}

	let post = new Post({
		text: req.body.title,
		tags: req.body.tags.split(' '),
		authorid: req.session.user_id,
		authorname: req.session.username,
		cover: req.file.filename,
		contributors: contributorsArray,
		tracks: []
	});
	post.save(function(err) {
		if(err) console.log(err);
		console.log('saved');
		res.redirect('/post/'+post._id);
	});
}

exports.post = async function(req, res) {
	data = await Post.findOne({ _id: req.params.id });
	console.log(data);
	contributorsNames = [];
	for (var i = 0; i < data.contributors.length; i++) {
		let user = await User.findOne({ _id: data.contributors[i].id});
		data.contributors[i] = {
			_id: data.contributors[i]._id,
			id: user.username,
			role: data.contributors[i].role
		}
	}
	for (var i = 0; i < data.tracks.length; i++) {
		for (var j = 0; j < data.contributors.length; j++) {
			let user = await User.findOne({ _id: data.tracks[i].contributors[j].id});
			data.tracks[i].contributors[j] = {
				_id: data.tracks[i].contributors[j]._id,
				id: user.username,
				role: data.tracks[i].contributors[j].role
			}
		}
	}
	console.log(contributorsNames);
	// for (var i = 0; i < data.contributors.length; i++)
	// data.contributors = contributorsNames.slice();
	console.log(data.contributors);
	console.log(data);
	res.render('post', { post: data, username: req.session.username });
}

exports.addtracks_submit = async function(req, res) {
	console.log(req.body);
	var contributorsArray = [];
	if(req.body.contributors) {
		for (var i = 0; i < req.body.contributors.length; i++) {
			var idOfContributor = await User.findOne({username:req.body.contributors[i]});
			contributorsArray.push({
				id: idOfContributor._id,
				role: req.body.roles[i]
			});
		}
	}

	Post.findByIdAndUpdate(req.body.releaseid, {tracks: {title: req.body.title, contributors: contributorsArray}}, function(err, raw) {
		if(err) res.send(err);
	});
	res.redirect('/post/'+req.body.releaseid);
}

exports.create = function(req,res) {
	if(req.session.username) {
		res.render('create');
	} else {
		res.redirect('/user/login');
	}
};

exports.addtracks = function(req, res) {
	res.render('addtracks', {username: req.session.username, releaseid: req.params.releaseid})
}

exports.delete = function(req, res) {
	if(req.session.username) {
		Post.findByIdAndRemove(req.params.id, (err, post) => {
	      if (err) return res.status(500).send(err);
	      res.redirect('/user/profile/'+req.session.username)
	  });
	}
}

exports.index = function(req, res) {
	data = Post.find({});
	data.select('title tags authorname cover id');
	data.exec(function(err, posts) {
		if (err) res.send(err);
		res.render('index', {posts, username: req.session.username});
	});
}
