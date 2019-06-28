var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: String,
	authorid: String,
	authorname: String,
	cover: {
		type: String,
		required: false,
		default: ""
	},
	tags: [{
		type: String,
		required: false
	}],
	contributors: [{
			id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
			name: {type: String, required: false} ,
			role: String,
			required: false
	}],
	tracks: [{
		title: String,
		audio: {
			type: String,
			default: ""
		},
		contributors: [{
				id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
				name: {type: String, required: false},
				role: String
		}],
		required: false
	}]
});

module.exports = mongoose.model('Post', PostSchema);
