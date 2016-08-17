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
        res.json({"Error":"未傳入使用者ID/Email/UserName，或註冊時出現問題"});
    })
})

//使用者登入
router.post('/login', function(req, res){
    var UserData = req.body;
    //取得登入狀況
    usersService._logIn(UserData).then(function(data){
        if(data != null){
            //登入成功
            res.json({"Message":"登入成功"});
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

//試用帳號註冊
//由Client傳入一組UID註冊
router.post('/register_trial', function(req, res){
    var TrialUserData = req.body;
    //寫入使用者註冊資訊(
    usersService._registerTrial(TrialUserData).then(function(data){
        //註冊成功
        res.json({"Message":"新增試用帳號成功"});
    }).catch((err)=>{
        //註冊失敗
        res.json({"Error":"未傳入UID，或試用帳號建立時出現問題"});
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

//測試crypto(帳密加解密)
router.post('/crypto',function(req, res){
    try 
    {
        var crypto              = require('crypto');
        var CRYPTO_ALGORITHM    = "aes-256-ctr";
        var CRYPTO_PASSWORD     = "3zTvzr3p67VC61jmV54rIYu1545x4TlY";
        var CRYPTO_IV           = "0123456789012345";
        var string_data = req.body.pw;
        var cipher      = crypto.createCipheriv(CRYPTO_ALGORITHM, CRYPTO_PASSWORD, CRYPTO_IV);
        var encrypted   = cipher.update(string_data, "utf8", "hex");
        encrypted       += cipher.final("hex"); // to hex
        console.log("encrypted final: " + encrypted);
        // --------------------------------------------------------------- //
        var encrypted_string = encrypted;
        var decipher    = crypto.createDecipheriv(CRYPTO_ALGORITHM, CRYPTO_PASSWORD, CRYPTO_IV);
        var decrypted   = decipher.update(encrypted_string, "hex", "utf8"); 
        decrypted       += decipher.final("utf8"); // to utf8
        console.log("decrypted final: " + decrypted);
        res.json({"result":decrypted});
        res.end();
    } 
    catch (err) {
        res.json({"result":"crypto support is disabled!"});
        res.end();
    }
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
