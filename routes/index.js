var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DONG Cloud Monitor Page' });
});

router.get('/user', function(req, res, next){
  res.render('userPage');
});

router.get('/admin', function(req, res, next){
  res.render('admin');
})


module.exports = router;
