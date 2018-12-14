var express = require('express');
var router = express.Router();
console.log("index router js");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + 'public/pages/login.html');
});

module.exports = router;