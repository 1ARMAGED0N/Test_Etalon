var express = require('express');
var router = express.Router();

/* GET list of available rooms for a period of time. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
