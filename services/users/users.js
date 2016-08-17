var db = require('../../libraries/firebase_db.js');
var calculator = require('../../DONG_Calculate.js');
require('es6-promise');

//註冊使用者資訊
exports._register = function(_RegisterData){
    if(_RegisterData.UID && _RegisterData.Email && _RegisterData.UserName){
        var Ref = "DONGCloud/DongService";
        var ChildName = _RegisterData.UID;
        var Data = {
            "EnabledDate" : calculator._getDateTimeNow(),
            "Status" : "On",
            "RequestCount" : 0
        };
        db._set(Ref, ChildName, Data);

        Ref += "/" + ChildName;
        ChildName = "UserDetail";
        Data = {
            "Email" : _RegisterData.Email,
            "UserName" : _RegisterData.UserName,
        };
        db._set(Ref, ChildName, Data);
        return Promise.resolve("註冊完成");
    }
    else{
        return Promise.reject(new Error("使用者註冊資料有遺漏，註冊失敗"));
    }
}

//註冊試用帳號
exports._registerTrial = function(_RegisterData){
    if(_RegisterData.UID){
        var Ref = "DONGCloud/DongService/Trial";
        var ChildName = _RegisterData.UID;
        var Data = {
            "EnabledDate" : calculator._getDateTimeNow(),
            "RequestCount" : 0
        };
        db._set(Ref, ChildName, Data);
        return Promise.resolve("試用帳號註冊完成");
    }
    else{
        return Promise.reject(new Error("試用帳號註冊失敗"));
    }
}

//透過UID登入，回傳使用者資訊
exports._logIn = function(_UserData){
    //160817_是否需要加入Token, 先記起來(Fiscol)
    if(_UserData.UID){
        return _logStatus(_UserData.UID, "On").then(function(data){
            if(data != "找不到帳號"){
                return _logIn(_UserData.UID);
            }
            else{
                return Promise.reject(new Error(data));
            }
        });
    }
    else{
        return Promise.reject(new Error("未傳入使用者ID"));
    }
}

//透過UID登出
exports._logOut = function(_UserData){
    if(_UserData.UID){
        return _logStatus(_UserData.UID, "Off").then(function(data){
            if(data != "找不到帳號"){
                return Promise.resolve("已登出");
            }
            else{
                return Promise.reject(new Error(data));
            }
        });
    }
    else{
        return Promise.reject(new Error("未傳入使用者ID"));
    }
}

//回傳使用者資訊
var _logIn = function(_UID){
    // DB Table
    var RefPath = "DONGCloud/DongService";
    // UserID
    var ChildName = _UID;
    // 讀取使用者資料, 回傳
    if(ChildName){
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
    else{
        return Promise.reject(new Error("未傳入使用者ID"));
    }
}

//修改登入/登出狀態
var _logStatus = function(_UID, _Status){
    var Ref = "DONGCloud/DongService";
    var ChildName = _UID;
    return db._onValuePromise(Ref, ChildName).then(function(data){
        if(data){
            if(_Status == "On" || _Status == "Off"){
                var Data = {
                    "Status" : _Status,
                    "LastLoginDate" : calculator._getDateTimeNow()
                };
                db._update(Ref, ChildName, Data);
                return "登入/登出成功";
            }
        }
        else{
            return "找不到帳號";
        }
    })
}