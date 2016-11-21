var express = require('express');
var session = require('express-session');
var async = require('async');
var adminService = require('../services/admin/admin.js');
var router = express.Router();
var configDB = require('../config/path.js');
var serverPath = configDB.ServerUrl;

// router.use(session({
//     secret: 'PVDPlusAdminLogin',
//     cookie: { maxAge: 60 * 1000 * 60 * 24 * 14 } //cookie存在兩週
// }));
////頁面

//主頁面
router.get('/', function (req, res) {
    if (req.param('admin') == req.session.Name && req.session.Name) {
        res.render('admin.ejs', { title: 'DONG Admin', user: req.session.Name });
    }
    else {
        res.redirect('/admin/login');
    }
})
//登入驗證
router.get('/login', function (req, res) {
    res.render('login.ejs', { user: req.session.Name });
})
//編輯管理者資訊頁面
router.get('/editAdmin', function (req, res) {

})
//編輯產品資訊頁面
router.get('/editProducts', function (req, res) {

})
////API
//管理者登入
router.post('/adminLogin', function (req, res) {
    var AdminData = req.body;
    //取得登入狀況
    adminService._adminLogin(AdminData).then(function (data) {
        //登入成功
        if (req.session.Name && req.session.Rights) {
            if (req.session.Name == AdminData.Name) {
                console.log(req.session);
                res.json(
                    {
                        "Index": serverPath + "admin?admin=" + AdminData.Name
                    }
                );
            }
            else {
                req.session.regenerate(function () {
                    req.session.Name = AdminData.Name;
                    req.session.Rights = data.Rights;
                    req.session.AdminID = data.AdminID;
                    res.json(
                        {
                            "Index": serverPath + "admin?admin=" + AdminData.Name
                        }
                    );
                    console.log(req.session);
                });
            }
        }
        else {
            req.session.Name = AdminData.Name;
            req.session.Rights = data.Rights;
            req.session.AdminID = data.AdminID;
            res.json(
                {
                    "Index": serverPath + "admin?admin=" + AdminData.Name
                }
            );
            console.log(req.session);
        }
    }).catch((err) => {
        res.json({ "Error": "登入失敗" });
    })
})
//管理者登出
router.get('/adminLogout', function (req, res) {
    if (req.session.Name) {
        var AdminData = {
            Name: req.session.Name
        }
        //取得登入狀況
        adminService._adminLogout(AdminData).then(function (data) {
            //登出成功
            req.session.destroy(function () {
                res.json(
                    {
                        "Index": serverPath + "admin/login"
                    }
                );
            });
        }).catch((err) => {
            //未傳入ID
            res.json({ "Error": "登出失敗" });
        })
    }
    else {
        res.json({ "Error": "目前沒有登入的管理者" });
    }
})
//新增管理者
router.post('/addNewAdmin', function (req, res) {
    var AdminData = req.body;
    //寫入管理者資訊(
    adminService._addNewAdmin(AdminData).then(function (data) {
        req.session.Name = data.Name;
        req.session.Rights = data.Rights;
        req.session.AdminID = data.AdminID;
        //新增成功
        res.json({
            "Message": "已加入管理者" + AdminData.Name + "。",
            "Index": serverPath + "admin?admin=" + AdminData.Name
        });
    }).catch((err) => {
        //新增失敗
        res.json({ "Error": err });
    })
})
//取得管理者資訊
router.post('/getAdminInfo', function (req, res) {
    var AdminData = req.body;
    adminService._getAdminInfo(AdminData.Name).then(function (data) {
        //成功, 回傳管理者資料
        res.json(data);
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//編輯管理者資訊
router.post('/updateAdminInfo', function (req, res) {
    var AdminData = req.body;
    adminService._updateAdminInfo(AdminData).then(function (data) {
        //編輯成功
        res.json({ "Message": data });
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//取得產品清單
router.get('/getProducts', function (req, res) {
    adminService._getProducts().then(function (data) {
        //成功, 回傳產品清單資料
        res.json(data);
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//各產品用戶數量
router.post('/getUserCount', function (req, res) {
    var ProductData = req.body;
    adminService._getUserCount(ProductData.ProductName).then(function (data) {
        //成功, 回傳產品使用人數
        res.json({ "Message": "Total Users : " + data });
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//審核產品
router.post('/verifyProduct', function (req, res) {

})
//加入新產品
router.post('/addNewProduct', function (req, res) {
    var ProductData = req.body;
    adminService._addNewProduct(ProductData).then(function (data) {
        //新增成功
        res.json({ "Message": data });
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//編輯產品
router.post('/editProduct', function (req, res) {
    var ProductData = req.body;
    adminService._editProduct(ProductData).then(function (data) {
        //編輯成功
        res.json({ "Message": data });
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//移除產品
router.post('/removeProduct', function (req, res) {
    var ProductData = req.body;
    adminService._removeProduct(ProductData.ProductName).then(function (data) {
        //移除成功
        res.json({ "Message": data });
    }).catch((err) => {
        //失敗
        res.json({ "Error": err });
    })
})
//個別用戶對產品的使用頻率
router.post('/getUserFrequency', function (req, res) {

})
//所有用戶對產品的平均使用頻率
router.post('/getProductFrequency', function (req, res) {

})
//目前線上使用者清單
router.get('/getList', function (req, res) {

})

module.exports = router;