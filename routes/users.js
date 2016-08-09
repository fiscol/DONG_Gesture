var express = require('express');
var async = require('async');
var usersService = require('../services/users/users.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//input:userid
router.post('/login', function (req, res, next) {
    var LoginUser = req.body;
    //取得登入狀況
    usersService._login(LoginUser).then(function(data){
        if(data != null){
            //登入成功:
            res.json(data);
        }
        else{
            //權限不足:
            res.json({"Error":"登入失敗"});
        }
    }).catch((err)=>{
        //未傳入ID:
        res.json({"Error":"未傳入使用者ID"});
    })
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
