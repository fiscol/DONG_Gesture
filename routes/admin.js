var express = require('express');
var session = require('express-session');
var async = require('async');
var adminService = require('../services/admin/admin.js');
var router = express.Router();
var configDB = require('../config/path.js');
var serverPath = configDB.ServerUrl;
////頁面

//主頁面
router.get('/', function (req, res) {
    if (req.param('admin') == req.session.userName && req.session.userName) {
        res.render('admin.ejs', { title: 'DONG Admin', user: req.session.userName });
    }
    else {
        res.redirect('/admin/login');
    }
})
//登入驗證
router.get('/login', function (req, res) {
    res.render('login.ejs', { user: req.session.userName });
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
router.post('/adminLogout', function (req, res) {

})
//新增管理者
router.post('/addNewAdmin', function (req, res) {

})
//取得管理者資訊
router.get('/getAdminInfo', function (req, res) {

})
//編輯管理者資訊
router.post('/updateAdminInfo', function (req, res) {

})
//取得產品清單
router.get('/getProducts', function (req, res) {

})
//各產品用戶數量
router.get('/getUserCount', function (req, res) {

})
//審核產品
router.post('/verifyProduct', function (req, res) {

})
//加入新產品
router.post('/addNewProduct', function (req, res) {

})
//編輯產品
router.post('/editProduct', function (req, res) {

})
//移除產品
router.post('/removeProduct', function (req, res) {

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