const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const post = require('./routes/post.route');
const user = require('./routes/user.route');
// const { Readable } = require('stream');
const db_url = 'YOUR DB URL';

app.use(session({
	secret: 'keyboard cat',
	resave:false,
	saveUninitialized:false,
	cookie: { maxAge: 600000 }
}));
app.use(express.static(path.join(__dirname,"public")));
app.use('/upload', express.static(path.join(__dirname,"/upload")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', post);
app.use('/user', user);

let mongoDB = process.env.MONGODB_URI || db_url;
mongoose.connect(mongoDB, {autoIndex: false, useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', (err) => {
		console.log('MONGO ERROR');
	}
);
db.on('connected', () => {
		console.log('MONGO SUCCESS');
	}
);

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'jade');

module.exports = app;
