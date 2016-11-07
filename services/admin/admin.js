var db = require('../../libraries/firebase_db.js');
var calculator = require('../../libraries/tool/gettime.js');
require('es6-promise');

//取得產品清單
exports._getProducts = function(){

}
//各產品用戶數量
exports._getUserCount = function(){

}
//審核產品
exports._verifyProduct = function(){

}
//加入新產品
exports._addNewProduct = function(Product){
    if(Product.Name && Product.Description && Product.NeedVerify){

    }
    else{
        return Promise.reject("");
    }
}
//編輯產品
exports._editProduct = function(){

}
//移除產品
exports._removeProduct = function(){

}
//個別用戶對產品的使用頻率
exports._getUserFrequency = function(){

}
//所有用戶對產品的平均使用頻率
exports._getProductFrequency = function(){

}
//目前線上使用者清單
exports._getList = function(){
    //online/TotalUsers
    //username/status
}