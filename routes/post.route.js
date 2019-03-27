const express = require('express');
const upload = require('../upload');
const router = express.Router();

const post_controller = require('../controllers/post.controller');

router.get('/', post_controller.index);
router.get('/create', post_controller.create);
router.get('/post/:id',post_controller.post);
router.get('/track/:id', post_controller.track); //?
router.get('/addtracks/:releaseid',  post_controller.addtracks);
router.get('/delete/:id', post_controller.delete);
router.post('/create_submit', upload.single('cover'), post_controller.create_submit);
router.post('/addtracks_submit', upload.single('audio'), post_controller.addtracks_submit);

module.exports = router;
