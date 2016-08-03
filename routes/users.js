var express = require('express');
var async = require('async');
var usersService = require('../services/users/users.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//input:userid, password
//登入成功:
//登入失敗:
//權限不足:
var data;
router.post('/login', function (req, res, next) {
    var LoginUser = req.body;
    // DB Table
    //var RefPath = "DONGCloud/UserDetail";
    // UserID
    //var ChildName = LoginUser.UserID;
 
    // 讀取Data Row, 回傳
    //var UserDetail = db._onValue(RefPath, ChildName);
    //取得登入狀況
    //var UserDetail = usersService._login(LoginUser);
    
    
    async.parallel({
        data:function(){
            setTimeout(function(){return 1+3;}, 3000)},
        data2:function(){
            return 2+5;}
    },function(err, results){
    console.log(results.data + ' ' + results.data2);
    });
   
});

router.get('/monkey', function(req, res, next){
    
    var monkey1 = new Monkey("Bobo");
    monkey1.SetProp("bananas", 5);
    monkey1.SetProp("hands", 2);

    res.json(monkey1);
});

var Monkey = function(name){
    this.name = name;
};

Monkey.prototype.SetProp = function(key, value){
    this[key] = value;
};

module.exports = router;
