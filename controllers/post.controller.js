const Post = require('../models/post.model');
const User = require('../models/user.model');
const fs = require('fs');

exports.create_submit = async function(req, res) {
	console.log(req.body);
	var contributorsArray = [];
	if(req.body.contributors) {
		let contributorsFromRequest = []
		let rolesFromRequest = [];
		if(typeof req.body.contributors == 'string') {
			contributorsFromRequest = [req.body.contributors];
			rolesFromRequest = [req.body.roles];
		} else {
			contributorsFromRequest = req.body.contributors;
			rolesFromRequest = req.body.roles;
		}
		for (var i = 0; i < contributorsFromRequest.length; i++) {
			var idOfContributor;
			idOfContributor = await User.findOne({username:contributorsFromRequest[i]});
			console.log(idOfContributor);
			if(idOfContributor) {
				contributorsArray.push({
					id: idOfContributor._id,
					role: rolesFromRequest[i]
				});
			} else {
				contributorsArray.push({
					name: contributorsFromRequest[i],
					role: rolesFromRequest[i]
				});
			}
		}
	}
	console.log(contributorsArray);

	let post = new Post({
		title: req.body.title,
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
		if(user) {
			data.contributors[i] = {
				_id: data.contributors[i]._id,
				id: user.username,
				role: data.contributors[i].role
			}
		} else {
			data.contributors[i] = {
				id: data.contributors[i].name,
				role: data.contributors[i].role
			}
		}
	}
	for (var i = 0; i < data.tracks.length; i++) {
		if (data.tracks[i].contributors) {
			for (var j = 0; j < data.tracks[i].contributors.length; j++) {
				let user = await User.findOne({ _id: data.tracks[i].contributors[j].id});
				if(user) {
					data.tracks[i].contributors[j] = {
						_id: data.tracks[i].contributors[j]._id,
						id: user.username,
						role: data.tracks[i].contributors[j].role
					}
				} else {
					data.tracks[i].contributors[j] = {
						id: data.tracks[i].contributors[j].name,
						role: data.tracks[i].contributors[j].role
					}
				}
			}
		}
	}
	res.render('post', { post: data, username: req.session.username });
}

exports.track = async function(req, res) {
	file='upload/'+req.params.id;
	fs.exists(file, (exists) => {
        if (exists) {
            const rstream = fs.createReadStream(file);
            rstream.pipe(res);
        } else {
            res.send('Error - 404');
            res.end();
        }
  });
}

exports.addtracks_submit = async function(req, res) {
	console.log(req.body);
	console.log(req.file.filename);

	var contributorsArray = [];
	if(typeof req.body.contributors == 'string') {
		contributorsFromRequest = [req.body.contributors];
		rolesFromRequest = [req.body.roles];
	} else {
		contributorsFromRequest = req.body.contributors;
		rolesFromRequest = req.body.roles;
	}
	if(req.body.contributors) {
		for (var i = 0; i < contributorsFromRequest.length; i++) {
			var idOfContributor = await User.findOne({username:contributorsFromRequest[i]});
			if(idOfContributor) {
				contributorsArray.push({
					id: idOfContributor._id,
					role: rolesFromRequest[i]
				});
			} else {
				contributorsArray.push({
					name: contributorsFromRequest[i],
					role: rolesFromRequest[i]
				});
			}
		}
	}

	Post.findByIdAndUpdate(req.body.releaseid,
		{
			$addToSet: {
				contributors: contributorsArray,
				tracks: {
					title: req.body.title,
					audio: req.file.filename,
					contributors: contributorsArray
				}
			}
		}, function(err, raw) {
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
