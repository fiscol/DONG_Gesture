var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DONG Cloud Monitor Page', userName:"Dong User" });
});

router.get('/products', function (req, res) {
    res.render('products.ejs');
});

router.get('/main', function (req, res) {
    res.render('main.ejs', { title: 'DONG UserPage', userName:req.userName });
});

router.get('/user', function(req, res, next){
  res.render('userPage');
});

router.get('/doc', function(req, res, next){
  res.render('docPage/docIndex');
});



// Demo Page
router.get('/demo-boxing', function(req, res, next){
  res.render('demo/demo-boxing');
});
router.post('/boxing', function (req, res, next) {
    // 解析body
    var punch = req.body.punch;
    req.io.sockets.emit('boxing',{punch:punch});
    console.log(punch)
    res.json(punch);
});
// Demo Page End




module.exports = router;
