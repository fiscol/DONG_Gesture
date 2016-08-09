var db = require('../../libraries/firebase_db.js');
require('es6-promise');

exports._login = function(_UserData){
    // DB Table
    var RefPath = "DONGCloud/DongService";
    // UserID
    var ChildName = _UserData.UserID;
    // 讀取使用者資料, 回傳
    if(ChildName){
        return Promise.resolve(db._onValueTest(RefPath, ChildName));
    }
    else{
        return Promise.reject(new Error("未傳入使用者ID"));
    }
}
