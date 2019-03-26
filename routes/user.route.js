const express = require('express');
const upload = require('../upload');
const router = express.Router();

const user_controller = require('../controllers/user.controller');
//multer configuration

//routes
router.get('/signup', user_controller.signup);
router.get('/login', user_controller.login);
router.get('/profile/:id', user_controller.profile);
router.get('/logout', user_controller.logout);
router.get('/profile_edit', user_controller.profile_edit);
router.get('/search', user_controller.search);
router.get('/messages', user_controller.messages);
router.get('/invitefriend/:to', user_controller.invitefriend);
router.get('/acceptfriend/:from', user_controller.acceptfriend);
router.post('/profile_avatar_submit', upload.single('avatar'), user_controller.profile_avatar_submit);
router.post('/profile_edit_submit', user_controller.profile_edit_submit);
router.post('/signup_submit', user_controller.signup_submit);
router.post('/login_submit', user_controller.login_submit);

module.exports = router;
