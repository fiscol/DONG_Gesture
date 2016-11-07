var db = require('../../libraries/firebase_db.js');
var calculator = require('../../libraries/tool/gettime.js');
require('es6-promise');

//管理者登入
exports._adminLogin = function () {

}
//管理者登出
exports._adminLogout = function () {

}
//新增管理者
exports._addNewAdmin = function () {

}
//取得管理者資訊
exports._getAdminInfo = function (AdminName) {
    //查詢個別管理者
    if (AdminName) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Admin";
        // Child
        var ChildName = "Name";
        // AdminName
        var Name = AdminName;
        // 讀取管理者資料, 回傳
        return Promise.resolve(db._equalTo(RefPath, ChildName, Name, null));
    }
    //回傳全部管理者
    else {
        // DB Table
        var RefPath = "DONGCloud/DongService";
        var ChildName = "Admin";
        // 回傳所有產品
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
}
//編輯管理者資訊
exports._updateAdminInfo = function () {

}
//取得產品清單
exports._getProducts = function () {
    // DB Table
    var RefPath = "DONGCloud/DongService";
    var ChildName = "Products";
    // 回傳所有產品
    return Promise.resolve(this._onValuePromise(RefPath, ChildName));
}
//各產品用戶數量
exports._getUserCount = function (ProductName) {
    //查詢個別管理者
    if (ProductName) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Products";
        // Child
        var ChildName = "Name";
        // ProductName
        var Email = ProductName;
        // 讀取管理者資料, 回傳
        return Promise.resolve(db._equalTo(RefPath, ChildName, Email, null));
    }
    //回傳全部管理者
    else {
        // DB Table
        var RefPath = "DONGCloud/DongService";
        var ChildName = "Products";
        // 回傳所有產品
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
}
//審核產品
exports._verifyProduct = function () {

}
//加入新產品
exports._addNewProduct = function (Product) {
    if (Product.Name && Product.Description && Product.NeedVerify) {

    }
    else {
        return Promise.reject(new Error(""));
    }
}
//編輯產品
exports._editProduct = function () {

}
//移除產品
exports._removeProduct = function () {

}
//個別用戶對產品的使用頻率
exports._getUserFrequency = function () {

}
//所有用戶對產品的平均使用頻率
exports._getProductFrequency = function () {

}
//目前線上使用者清單
exports._getList = function () {
    //online/TotalUsers
    //username/status
}