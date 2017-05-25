var express = require('express');
var session = require('express-session');
var async = require('async');
var adminService = require('../services/admin/admin.js');
var router = express.Router();
var configDB = require('../config/path.js');
var serverPath = configDB.ServerUrl;
var PythonShell = require('python-shell');
var fs = require('fs');
////頁面

//主頁面
router.get('/', function (req, res) {
    if (req.param('admin') == req.session.AdminName && req.session.AdminName) {
        res.render('admin.ejs', { title: 'DONG Admin', adminName: req.session.AdminName, products: '123' });
    }
    else {
        res.redirect('/admin/login');
    }
})
//登入驗證
router.get('/login', function (req, res) {
    res.render('adminLogin.ejs', { user: req.session.AdminName });
})
//編輯管理者資訊頁面
router.post('/editAdmin', function (req, res) {
    var Body = req.body;
    if (req.session.AdminName && req.session.AdminName == Body.Admin) {
        adminService._getAdminInfo().then(function (data) {
            //成功, 回傳管理者資料
            res.render('partials/admin/editAdmin.ejs', {
                adminName: Body.Admin,
                adminData: data,
                totalAdmin: data["TotalAdmin"],
                updatePath: serverPath + "admin/updateAdminInfo",
                addNewPath: serverPath + "admin/addNewAdmin",
                refreshPath: serverPath + "admin/editAdmin"
            }, function (err, html) {
                res.send(html);
            });
        }).catch((err) => {
            //失敗
            res.json({ "Error": err });
        })
    }
    else {
        res.redirect('/admin/login');
    }
})
//編輯產品資訊頁面
router.post('/editProducts', function (req, res) {
    var Body = req.body;
    if (req.session.AdminName && req.session.AdminName == Body.Admin) {
        adminService._getProducts().then(function (data) {
            res.render('partials/admin/editProducts.ejs', {
                adminName: Body.Admin,
                productData: data,
                totalAdmin: data["TotalProducts"],
                updatePath: serverPath + "admin/updateProduct",
                addNewPath: serverPath + "admin/addNewProduct",
                refreshPath: serverPath + "admin/editProducts"
            }, function (err, html) {
                res.send(html);
            });
        }).catch((err) => {
            //失敗
            res.json({ "Error": err });
        })
    }
    else {
        res.redirect('/admin/login');
    }
})
//查詢使用者頁面
router.post('/searchUser', function (req, res) {
    var Body = req.body;
    if (req.session.AdminName && req.session.AdminName == Body.Admin) {
        res.render('partials/admin/searchUser.ejs', { adminName: Body.Admin, path: serverPath + "admin" }, function (err, html) {
            res.send(html);
        });
    }
    else {
        res.redirect('/admin/login');
    }
})

////API
//管理者登入
router.post('/adminLogin', function (req, res) {
    var AdminData = req.body;
    //取得登入狀況
    adminService._adminLogin(AdminData).then(function (data) {
        //登入成功
        if (req.session.AdminName && req.session.Rights) {
            if (req.session.AdminName == AdminData.Name) {
                console.log(req.session);
                res.json(
                    {
                        "Index": serverPath + "admin?admin=" + AdminData.Name
                    }
                );
            }
            else {
                req.session.regenerate(function () {
                    req.session.AdminName = AdminData.Name;
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
            req.session.AdminName = AdminData.Name;
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
    if (req.session.AdminName) {
        var AdminData = {
            Name: req.session.AdminName
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
        //新增成功
        res.json({
            "Message": "已加入管理者" + AdminData.Name + "。"
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
router.post('/updateProduct', function (req, res) {
    var ProductData = req.body;
    adminService._updateProduct(ProductData).then(function (data) {
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
router.get('/getUsersList', function (req, res) {

})
router.get('/python', function (req, res) {
    PythonShell.run('/python.py', function (err, results) {
        if (err) {
            res.json({ 'err': err.message });
        }
        else {
            res.json({ 'result': results });
        }
    });
});
router.get('/py', function (req, res) {
    PythonShell.run('/py.py', function (err, results) {
        if (err) {
            res.json({ 'err': err.message });
        }
        else {
            res.json({ 'result': results });
        }
    });
});
module.exports = router;