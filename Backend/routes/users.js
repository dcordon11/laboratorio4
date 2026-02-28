var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('no hay nada que ver aca ');
});

module.exports = router;
