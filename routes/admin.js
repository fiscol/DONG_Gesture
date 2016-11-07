var express = require('express');
var session = require('express-session');
var async = require('async');
var usersService = require('../services/users/users.js');
var router = express.Router();
var configDB = require('../config/path.js');
var serverPath = configDB.ServerUrl;
////頁面

//主頁面
router.get('/', function (req, res) {
    if (req.param('user') == req.session.userName && req.session.userName) {
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