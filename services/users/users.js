var db = require('../../libraries/firebase_db.js');
var calculator = require('../../libraries/tool/gettime.js');
require('es6-promise');

//20161011 版本 Fiscol

exports._logIn = function (_UserData) {
    return _getUserData(_UserData).then(function (_DBUserData) {
        if (_DBUserData.Password == _UserData.Password) {
            _updateStatus(_DBUserData.UserName, true);
            return Promise.resolve(
                {
                    "UserName": _DBUserData.UserName,
                    "UserEmail": _DBUserData.Email,
                    "NowStep": _DBUserData.NowStep,
                    "Products": (_DBUserData.Products != null)? _DBUserData.Products : null
                }
            );
        }
        else {
            return Promise.reject(new Error("密碼錯誤"));
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
var _getUserData = function (_UserData) {
    return exports._checkEmail(_UserData).then(function (_DBUserData) {
        if (_DBUserData != null) {
            var UserName;
            for (var prop in _DBUserData) {
                if (typeof _DBUserData[prop] != 'function') {
                    UserName = prop;
                    _DBUserData[UserName].UserName = UserName;
                }
            }
            return Promise.resolve(_DBUserData[UserName]);
        }
        else {
            return Promise.reject(new Error("找不到對應使用者資料"));
        }
    })
}
/*
case "login" :
    SQLquery = "SELECT * from user_login WHERE user_email='"+req.body.user_email+"' AND `user_password`='"+req.body.user_password+"'";
    break;
    */
exports._checkEmail = function (_UserData) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Users";
    // Child
    var ChildName = "Email";
    // User Email
    var Email = _UserData.Email;
    // 讀取使用者資料, 回傳

    if (ChildName) {
        //return Promise.resolve(db._onValuePromise(RefPath, ChildName));
        return Promise.resolve(db._equalTo(RefPath, ChildName, Email, null));
    }
    else {
        return Promise.reject(new Error("未傳入使用者Email"));
    }
}
/*
case "checkEmail" :
    SQLquery = "SELECT * from user_login WHERE user_email='"+req.body.user_email+"'";
    break;
    */
exports._register = function (_UserData) {
    // var Ref = "DONGCloud/DongService/Users";
    // var ChildName = _UserData.UserName;
    // var Data = {
    //     "Email": _UserData.Email,
    //     "Password": _UserData.Password
    // };
    // db._set(Ref, ChildName, Data);
    // return Promise.resolve("註冊完成");
    var Ref = "DONGCloud/DongService/Users/TotalUsers";
    var Callback = function (count) {
        Ref = "DONGCloud/DongService/Users/User" + count.snapshot.val();
        var Data = {
            "Email": _UserData.Email,
            "Password": _UserData.Password
        };
        db._transaction(Ref, Data);
        var NowStep = "products";
        return _saveSteps(_UserData, NowStep).then(function(){
            return Promise.resolve(exports._logIn(_UserData));
        });
    }
    return exports._checkEmail(_UserData).then(function (_DBUserData) {
        if (_DBUserData === null) {
            return Promise.resolve(db._transactionCount(Ref, Callback));
        }
        else {
            return Promise.reject("您已註冊Dong服務");
        }
    })
}
/*
case "register" :
    SQLquery = "INSERT into user_login(user_email,user_password,user_name) VALUES ('"+req.body.user_email+"','"+req.body.user_password+"','"+req.body.user_name+"')";
    break;
*/
exports._logOut = function (_UserData) {
    return _getUserData(_UserData).then(function (_DBUserData) {
        _updateStatus(_DBUserData.UserName, false);
        return Promise.resolve(_DBUserData.UserName + "已登出。");
    }).catch((err) => {
        return Promise.reject(err);
    })
}

var _updateStatus = function (_UserName, _Status) {
    var Ref = "DONGCloud/DongService/Users";
    var ChildName = _UserName;
    //date, status
    var Data = {
        "Online": _Status
    };
    if (_Status == true) {
        Data.LastLoginAt = calculator._dateTimeNow();
    }
    db._update(Ref, ChildName, Data);
    //checkemail
    //transactioncount
}
/*
case "addStatus" :
    SQLquery = "INSERT into user_status(user_id,user_status) VALUES ("+req.session.key["user_id"]+",'"+req.body.status+"')";
    break;
*/
exports._getList = function () {
    //online/TotalUsers
    //username/status
}
/*
case "getStatus" :
    SQLquery = "SELECT * FROM user_status WHERE user_id="+req.session.key["user_id"];
    break;
*/
//紀錄使用者目前操作步驟
var _saveSteps = function (_UserData, _NowStep) {
    return _getUserData(_UserData).then(function (_DBUserData) {
        var Ref = "DONGCloud/DongService/Users";
        var ChildName = _DBUserData.UserName;
        var Data = {
            "NowStep": _NowStep
        };
        db._update(Ref, ChildName, Data);
        return Promise.resolve("已儲存" + _DBUserData.UserName + "的使用步驟。");
    }).catch((err) => {
        return Promise.reject(err);
    })
}

exports._chooseProduct = function (_UserData, _Products) {
    return _getUserData(_UserData).then(function (_DBUserData) {
        var Ref = "DONGCloud/DongService/Users";
        var ChildName = _DBUserData.UserName;
        var Data = {
            "Products": _Products
        };
        db._update(Ref, ChildName, Data);
        var NowStep = "main";
        return _saveSteps(_UserData, NowStep).then(function(){
            return Promise.resolve(
                {
                    "UserName":_DBUserData.UserName,
                    "NowStep": NowStep,
                    "Products": _Products
                }
            );
        })
    }).catch((err) => {
        return Promise.reject(err);
    })
}
// exports._transaction = function (_UserData) {
//     var Ref = "DONGCloud/DongService/Users/User2";
//     var Data = {
//         "Email": _UserData.Email,
//         "Password": _UserData.Password
//     };
//     return Promise.resolve(db._transaction(Ref, Data));
// }

// exports._transactionCount = function(){
//     var Ref = "DONGCloud/DongService/Users/TotalUsers";
//     return Promise.resolve(db._transactionCount(Ref));
// }
//註冊使用者(VIPCode)
// exports._registerVIP = function (_RegisterData) {
//     //檢查UID, VIPCode
//     //註冊會員資料E-mail, UID
//     var Crypt = require("../../libraries/tool/crypt.js");

//     if (_RegisterData.Code && _RegisterData.Email && _RegisterData.UserName) {
//         var DecryptCode = Crypt._decrypt(_RegisterData.Code);
//         if (DecryptCode.indexOf("d") > -1 && DecryptCode.indexOf("t") > -1) {
//             //註冊會員
//             var Ref = "DONGCloud/DTUsers";
//             var ChildName = DecryptCode;
//             var Data = {
//                 "EnabledDate": calculator._dateTimeNow(),
//             };
//             db._set(Ref, ChildName, Data);

//             Ref += "/" + ChildName;
//             ChildName = "UserDetail";
//             Data = {
//                 "Email": _RegisterData.Email,
//                 "UserName": _RegisterData.UserName,
//             };
//             db._set(Ref, ChildName, Data);
//             return Promise.resolve("感謝您，我們將會儘速提供您最新的API使用資訊!!");
//         }
//         else {
//             //註冊失敗，回傳錯誤訊息
//             return Promise.reject(new Error("使用者註冊碼錯誤，註冊失敗"));
//         }
//     }
//     else {
//         //註冊失敗，回傳錯誤訊息
//         return Promise.reject(new Error("使用者註冊資料有遺漏，註冊失敗"));
//     }
// }

//註冊使用者資訊
// exports._register = function (_RegisterData) {
//     if (_RegisterData.UID && _RegisterData.Email && _RegisterData.UserName) {
//         var Ref = "DONGCloud/DongService";
//         var ChildName = _RegisterData.UID;
//         var Data = {
//             "EnabledDate": calculator._dateTimeNow(),
//             "Status": "On",
//             "RequestCount": 0
//         };
//         db._set(Ref, ChildName, Data);

//         Ref += "/" + ChildName;
//         ChildName = "UserDetail";
//         Data = {
//             "Email": _RegisterData.Email,
//             "UserName": _RegisterData.UserName,
//         };
//         db._set(Ref, ChildName, Data);
//         return Promise.resolve("註冊完成");
//     }
//     else {
//         return Promise.reject(new Error("使用者註冊資料有遺漏，註冊失敗"));
//     }
// }

//註冊試用帳號
// exports._registerTrial = function (_RegisterData) {
//     if (_RegisterData.UID) {
//         var Ref = "DONGCloud/DongService/Trial";
//         var ChildName = _RegisterData.UID;
//         var Data = {
//             "EnabledDate": calculator._dateTimeNow(),
//             "RequestCount": 0
//         };
//         db._set(Ref, ChildName, Data);
//         return Promise.resolve("試用帳號註冊完成");
//     }
//     else {
//         return Promise.reject(new Error("試用帳號註冊失敗"));
//     }
// }

//透過UID登入，回傳使用者資訊
// exports._logIn = function (_UserData) {
//     //160817_是否需要加入Token, 先記起來(Fiscol)
//     if (_UserData.UID) {
//         return _logStatus(_UserData.UID, "On").then(function (data) {
//             if (data != "找不到帳號") {
//                 return _logIn(_UserData.UID);
//             }
//             else {
//                 return Promise.reject(new Error(data));
//             }
//         });
//     }
//     else {
//         return Promise.reject(new Error("未傳入使用者ID"));
//     }
// }

//透過UID登出
// exports._logOut = function (_UserData) {
//     if (_UserData.UID) {
//         return _logStatus(_UserData.UID, "Off").then(function (data) {
//             if (data != "找不到帳號") {
//                 return Promise.resolve("已登出");
//             }
//             else {
//                 return Promise.reject(new Error(data));
//             }
//         });
//     }
//     else {
//         return Promise.reject(new Error("未傳入使用者ID"));
//     }
// }

//回傳使用者資訊
// var _logIn = function (_UID) {
//     // DB Table
//     var RefPath = "DONGCloud/DongService";
//     // UserID
//     var ChildName = _UID;
//     // 讀取使用者資料, 回傳
//     if (ChildName) {
//         return Promise.resolve(db._onValuePromise(RefPath, ChildName));
//     }
//     else {
//         return Promise.reject(new Error("未傳入使用者ID"));
//     }
// }

//修改登入/登出狀態
// var _logStatus = function (_UID, _Status) {
//     var Ref = "DONGCloud/DongService";
//     var ChildName = _UID;
//     return db._onValuePromise(Ref, ChildName).then(function (data) {
//         if (data) {
//             if (_Status == "On" || _Status == "Off") {
//                 var Data = {
//                     "Status": _Status,
//                     "LastLoginDate": calculator._dateTimeNow()
//                 };
//                 db._update(Ref, ChildName, Data);
//                 return "登入/登出成功";
//             }
//         }
//         else {
//             return "找不到帳號";
//         }
//     })
// }