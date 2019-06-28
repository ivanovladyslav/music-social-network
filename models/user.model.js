var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		require: true,
		trim: true
	},
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false,
		default: ""
	},
	avatar: {
		type: String,
		required: false,
		default: ""
	}
});

UserSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if(err) return handleError(err);
		user.password = hash;
		next();
	})
});

UserSchema.statics.authenticate = function (email, password, callback) {
	console.log(email);
	this.findOne({email:email})
		.exec(function(err,user) {
			if (err) {
				return callback(err);
			} else if (!user) {
				var err = new Error('User not found!');
				err.status = 401;
				return callback(err);
			}
		bcrypt.compare(password, user.password, function(err, result) {
			if(result) {
				return callback(null, user);
			} else {
				return callback();
			}
		})
	});
}

module.exports = mongoose.model('User', UserSchema);
