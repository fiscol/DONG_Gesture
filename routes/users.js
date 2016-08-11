var express = require('express');
var async = require('async');
var usersService = require('../services/users/users.js');
var router = express.Router();

//使用者註冊
router.post('/register', function(req, res){
    var RegisterData = req.body;
    //寫入使用者註冊資訊(
    usersService._register(RegisterData).then(function(data){
        //註冊成功
        res.json({"Message":"您已註冊成功"});
    }).catch((err)=>{
        //註冊失敗
        res.json({"Error":"未傳入使用者ID/Email/UserName，或登入時出現問題"});
    })
})

//使用者登入
router.post('/login', function(req, res){
    var UserData = req.body;
    //取得登入狀況
    usersService._logIn(UserData).then(function(data){
        if(data != null){
            //登入成功
            res.json(data);
        }
        else{
            //權限不足
            res.json({"Error":"登入失敗"});
        }
    }).catch((err)=>{
        //未傳入ID
        res.json({"Error":"未傳入使用者ID，或登入時出現問題"});
    })
})

//使用者登出
router.post('/logout', function(req, res){
    var UserData = req.body;
    //取得登入狀況
    usersService._logOut(UserData).then(function(data){
        if(data == "已登出"){
            //登出成功
            res.json({"Message":"已登出"});
        }
    }).catch((err)=>{
        //未傳入使用者資訊
        res.json({"Error":"未傳入使用者ID，或登出時出現問題"});
    })
})

//測試加入Object屬性用
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
