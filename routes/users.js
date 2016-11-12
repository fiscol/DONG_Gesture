var express = require('express');
var session = require('express-session');
var async = require('async');
var usersService = require('../services/users/users.js');
var router = express.Router();
var configDB = require('../config/path.js');
var serverPath = configDB.ServerUrl;

////20161012 Fiscol 登入測試
router.use(session({
    secret: 'PVDPlusUserLogin',
    cookie: { maxAge: 60 * 1000 * 60 * 24 * 14 } //cookie存在兩週
}));

////頁面相關API
//登入頁面
router.get('/login', function (req, res) {
    res.render('login.ejs', { user: req.session.userName });
});

//主頁面
router.get('/main', function (req, res) {
    if (req.param('user') == req.session.userName && req.session.userName) {
        res.render('main.ejs', { title: 'DONG UserPage', userName: req.session.userName, products: req.session.products });
    }
    else {
        res.redirect('/users/login');
    }
});

//選擇商品頁面
router.get('/products', function (req, res) {
    if (req.param('user') == req.session.userName && req.session.userName) {
        var Products;
        _getProductList(req).then(function (data) {
            Products = data;
            res.render('products.ejs', { title: 'DONG Products', userName: req.session.userName, products:Products });
        }).catch((err) => {
            res.redirect('/users/login');
        });
    }
    else {
        res.redirect('/users/login');
    }
});

////Input with output API

//使用者註冊
router.post('/register', function (req, res) {
    var RegisterData = req.body;
    //寫入使用者註冊資訊
    usersService._register(RegisterData).then(function (data) {
        req.session.isVisit = 1;
        req.session.userEmail = data.UserEmail;
        req.session.userName = data.Name;
        req.session.userID = data.UserID;
        //註冊成功
        res.json({
            "Message": "Success",
            "Index": serverPath + "users/" + data.NowStep + "?user=" + data.Name,
            "Page": data.NowStep
        });
    }).catch((err) => {
        //註冊失敗
        res.json({
            "Error": err,
            "Message": "Failed"
        });
    })
})

//使用者登入
router.post('/login', function (req, res) {
    var UserData = req.body;
    //取得登入狀況
    usersService._logIn(UserData).then(function (data) {
        //登入成功
        if (req.session.isVisit) {
            if (req.session.userEmail == UserData.Email) {
                req.session.isVisit++;
                console.log(req.session);
                //res.json({"Message": "歡迎, 這是您第 " + req.session.isVisit + "次登入頁面"});
                res.json(
                    {
                        "Message": "Success",
                        "Index": serverPath + "users/" + data.NowStep + "?user=" + data.Name,
                        "Page": data.NowStep
                    }
                );
            }
            else {
                req.session.regenerate(function () {
                    req.session.isVisit = 1;
                    req.session.userEmail = UserData.Email;
                    req.session.userName = data.Name;
                    req.session.userID = data.UserID;
                    if (data.Products) {
                        req.session.products = data.Products;
                    }
                    res.json(
                        {
                            "Message": "Success",
                            "Index": serverPath + "users/" + data.NowStep + "?user=" + data.Name,
                            "Page": data.NowStep
                        }
                    );
                    console.log(req.session);
                });
            }
        }
        else {
            req.session.isVisit = 1;
            req.session.userEmail = UserData.Email;
            req.session.userName = data.Name;
            req.session.userID = data.UserID;
            if (data.Products) {
                req.session.products = data.Products;
            }
            res.json(
                {
                    "Message": "Success",
                    "Index": serverPath + "users/" + data.NowStep + "?user=" + data.Name,
                    "Page": data.NowStep
                }
            );
            console.log(req.session);
            //res.json({"Message": "歡迎第一次登入本系統"});
        }
    }).catch((err) => {
        //未傳入ID
        res.json({
            "Error": err,
            "Message": "Failed"
        });
    })
})

//使用者登出
router.get('/logout', function (req, res) {
    if (req.session.userEmail) {
        var UserData = {
            Email: req.session.userEmail
        }
        //取得登入狀況
        usersService._logOut(UserData).then(function (data) {
            //登出成功
            req.session.destroy(function () {
                res.json(
                    {
                        "Message": "Success",
                        "Index": serverPath + "users/login"
                    }
                );
            });
        }).catch((err) => {
            //未傳入ID
            res.json({
                "Error": err,
                "Message": "Failed"
            });
        })
    }
    else {
        res.json({ "Error": "目前沒有登入的使用者" });
    }
})

//確認是否有使用者登入
router.get('/checkUser', function (req, res) {
    if (req.session.userEmail) {
        var UserData = {
            "Email": req.session.userEmail
        }
        //取得登入狀況
        usersService._checkUserByEmail(UserData).then(function (data) {
            //登出成功
            req.session.destroy(function () {
                res.json(
                    {
                        "Message": "Success",
                        "Index": serverPath + "users/login"
                    }
                );
            });
        }).catch((err) => {
            //未傳入ID
            res.json({
                "Error": err,
                "Message": "Failed"
            });
        })
    }
    else {
        res.json({
            "Error": "目前沒有登入的使用者",
            "Message": "Failed"
        })
    }
})
////需調整前後端的產品ＡＰＩ
//取得產品清單與選購紀錄
var _getProductList = function (req) {
    if (req.session.userEmail) {
        var Products;
        return usersService._getProductList().then(function (data) {
            Products = data;
            if (req.session.products) {
                for (var i = 1; i <= Products.TotalProducts; i++) {
                    Products["Product" + i]["Purchased"] = false;
                    for (var j = 0; j < req.session.products.length; j++) {
                        if (Products["Product" + i].Name == req.session.products[j]) {
                            Products["Product" + i]["Purchased"] = true;
                        }
                    }
                }
                return Promise.resolve(Products);
            }
            else {
                for (var i = 0; i < Products.TotalProducts; i++) {
                    Products["Product" + i]["Purchased"] = false;
                }
                return Promise.resolve(Products);
            }
        });
    }
    else {
        return Promise.reject({
            "Error": "沒有登入的使用者, 無法選擇產品",
            "Message": "Failed"
        });
    }
}
router.get('/getProductList', function (req, res) {
    _getProductList(req).then(function (data) {
        res.json(data);
    }).catch((err) => {
        //未傳入ID
        res.json(err);
    });
})

//儲存使用者選擇產品
router.post('/saveProduct', function (req, res) {
    if (req.session.userEmail && req.body["Products[]"]) {
        var UserData = {
            Email: req.session.userEmail
        }
        var Products = req.body["Products[]"];
        usersService._chooseProduct(UserData, Products).then(function (data) {
            req.session.products = data.Products;
            res.json(
                {
                    "Message": "Success",
                    "Index": serverPath + "users/" + data.NowStep + "?user=" + data.Name
                }
            );
        }).catch((err) => {
            res.json({
                "Error": err,
                "Message": "Failed"
            });
        })
    }
    else {
        res.json({ "Error": "沒有傳入使用者帳號或商品" });
    }
})

//測試session
router.post('/setSession', function (req, res) {
    var Data = req.body;
    if (Data.User) {
        req.session.user = Data.User;
        res.json({ "Message": "已存入session" });
    }
    else {
        res.json({ "Message": "沒有傳入User, 本次未存入session" });
    }
})

router.get('/checkSession', function (req, res) {
    if (req.session.user) {
        res.json({
            "Message": "找到session了",
            "user": req.session.user
        });
    }
    else {
        res.json({
            "Message": "沒有找到session"
        });
    }
})

router.get('/removeSession', function (req, res) {
    req.session.destroy(function () {
        res.json(
            {
                "Message": "移除session了"
            }
        );
    });
})
//以Email查詢使用者
// router.post('/checkEmail', function (req, res) {
//     var UserData = req.body;
//     //寫入使用者註冊資訊(
//     usersService._checkEmail(UserData).then(function (data) {
//         //註冊成功
//         res.json(data);
//     }).catch((err) => {
//         //註冊失敗
//         res.json({ "Error": "未傳入使用者Email，或查詢時出現問題" });
//     })
// })

//測試遞增transaction API
// router.post('/transaction', function (req, res) {
//     var RegisterData = req.body;
//     //寫入使用者註冊資訊(
//     usersService._transaction(RegisterData).then(function (data) {
//         //註冊成功
//         res.json({ "Message": "您已註冊成功" });
//     }).catch((err) => {
//         //註冊失敗
//         res.json({ "Error": "未傳入使用者Email/UserName，或註冊時出現問題" });
//     })
// })

//測試遞增transaction API
// router.get('/transactionCount', function (req, res) {
//     //var RegisterData = req.body;
//     //寫入使用者註冊資訊(
//     usersService._transactionCount().then(function (data) {
//         //註冊成功
//         res.json({ "Message": "您已更新User Count" });
//     }).catch((err) => {
//         //註冊失敗
//         res.json({ "Error": "更新User Count出現問題" });
//     })
// })

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

//紀錄使用者目前操作步驟
// router.post('/saveSteps', function (req, res) {
//     if (req.session.userEmail && req.body.NowStep) {
//         var UserData = {
//             Email: req.session.userEmail
//         }
//         var NowStep = req.body.NowStep;
//         usersService._saveSteps(UserData, NowStep).then(function (data) {
//             if (data != null) {
//                 res.json({ "Message": data });
//             }
//         }).catch((err) => {
//             res.json({ "Error": data });
//         })
//     }
//     else {
//         res.json({ "Error": "沒有傳入使用者帳號或操作步驟" });
//     }
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
