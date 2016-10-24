var express = require('express');
var session = require('express-session');
var async = require('async');
var usersService = require('../services/users/users.js');
var router = express.Router();

////20161012 Fiscol 登入測試
router.use(session({
    secret: 'PVDPlusUserLogin',
    cookie: { maxAge: 60 * 1000 * 60 * 24 * 14 } //cookie存在兩週
}));

router.get('/login', function (req, res) {
    res.render('login.ejs');
});

//使用者註冊
router.post('/checkEmail', function (req, res) {
    var UserData = req.body;
    //寫入使用者註冊資訊(
    usersService._checkEmail(UserData).then(function (data) {
        //註冊成功
        res.json(data);
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": "未傳入使用者Email，或查詢時出現問題" });
    })
})

////Digital Taipei 使用者區塊
//使用者登入(VIPCode)
// router.post('/RegisterVIP', function (req, res) {
//     var RegisterData = req.body;
//     usersService._registerVIP(RegisterData).then(function (data) {
//         res.json({ "Message": data });
//     }).catch((err) => {
//         //註冊失敗
//         res.json({ "Error": err.message });
//     })
// })

//測試遞增transaction API
router.post('/transaction', function (req, res) {
    var RegisterData = req.body;
    //寫入使用者註冊資訊(
    usersService._transaction(RegisterData).then(function (data) {
        //註冊成功
        res.json({ "Message": "您已註冊成功" });
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": "未傳入使用者Email/UserName，或註冊時出現問題" });
    })
})

//測試遞增transaction API
router.get('/transactionCount', function (req, res) {
    //var RegisterData = req.body;
    //寫入使用者註冊資訊(
    usersService._transactionCount().then(function (data) {
        //註冊成功
        res.json({ "Message": "您已更新User Count" });
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": "更新User Count出現問題" });
    })
})

//使用者註冊
router.post('/register', function (req, res) {
    var RegisterData = req.body;
    //寫入使用者註冊資訊(
    usersService._register(RegisterData).then(function (data) {
        //註冊成功
        res.json({ "Message": "您已註冊成功" });
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": err });
    })
})

//使用者登入
router.post('/login', function (req, res) {
    var UserData = req.body;
    //取得登入狀況
    usersService._logIn(UserData).then(function (data) {
        if (data != null) {
            //登入成功
            if (req.session.isVisit) {
                if (req.session.userEmail == UserData.Email) {
                    req.session.isVisit++;
                    console.log(req.session);
                    //res.json({"Message": "歡迎, 這是您第 " + req.session.isVisit + "次登入頁面"});
                    res.json({ "Index": "http://localhost:3004" });
                }
                else {
                    req.session.regenerate(function () {
                        req.session.isVisit = 1;
                        req.session.userEmail = UserData.Email;
                        res.json({ "Index": "http://localhost:3004" });
                        console.log(req.session);
                    });
                }
            } else {
                req.session.isVisit = 1;
                req.session.userEmail = UserData.Email;
                res.json({ "Index": "http://localhost:3004" });
                console.log(req.session);
                //res.json({"Message": "歡迎第一次登入本系統"});
            }
        }
        else {
            //權限不足
            res.json({ "Error": "登入失敗" });
        }
    }).catch((err) => {
        //未傳入ID
        res.json({ "Error": "登入失敗" });
    })
})

//試用帳號註冊
//由Client傳入一組UID註冊
// router.post('/register_trial', function (req, res) {
//     var TrialUserData = req.body;
//     //寫入使用者註冊資訊(
//     usersService._registerTrial(TrialUserData).then(function (data) {
//         //註冊成功
//         res.json({ "Message": "新增試用帳號成功" });
//     }).catch((err) => {
//         //註冊失敗
//         res.json({ "Error": "未傳入UID，或試用帳號建立時出現問題" });
//     })
// })

//使用者登出
router.get('/logout', function (req, res) {
    if(req.session.userEmail){
        var UserData = {
            Email: req.session.userEmail
        }
        //取得登入狀況
        usersService._logOut(UserData).then(function (data) {
            if (data != null) {
                //登出成功
                req.session.destroy(function () {
                    res.json({ "Message": "已登出" });
                });
            }
            else {
                //權限不足
                res.json({ "Error": "登出失敗" });
            }
        }).catch((err) => {
            //未傳入ID
            res.json({ "Error": "登出失敗" });
        })
    }
    else{
        res.json({"Error": "目前沒有登入的使用者"});
    }
})

//使用者登出
// router.post('/logout', function (req, res) {
//     var UserData = req.body;
//     //取得登入狀況
//     usersService._logOut(UserData).then(function (data) {
//         if (data == "已登出") {
//             //登出成功
//             res.json({ "Message": "已登出" });
//         }
//     }).catch((err) => {
//         //未傳入使用者資訊
//         res.json({ "Error": "未傳入使用者ID，或登出時出現問題" });
//     })
// })

//測試加入Object屬性用
router.get('/monkey', function (req, res, next) {
    var monkey1 = new Monkey("Bobo");
    monkey1.SetProp("bananas", 5);
    monkey1.SetProp("hands", 2);

    res.json(monkey1);
});

var Monkey = function (name) {
    this.name = name;
};

Monkey.prototype.SetProp = function (key, value) {
    this[key] = value;
};

function User(user) {
    this.username = user.username;
    this.userpass = user.userpass;
};

module.exports = router;
