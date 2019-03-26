const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

var storage = multer.diskStorage({
  destination: 'upload/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});
var upload = multer({ storage: storage })

module.exports = upload;
