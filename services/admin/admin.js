var db = require('../../libraries/firebase_db.js');
var calculator = require('../../libraries/tool/gettime.js');
require('es6-promise');

//管理者登入
exports._adminLogin = function (_AdminData) {
    return _getAdminData(_AdminData).then(function (_DBAdminData) {
        if (_DBAdminData.Password == _AdminData.Password) {
            _updateStatus(_DBAdminData.AdminID, true);
            return Promise.resolve(
                {
                    "Name": _DBAdminData.Name,
                    "Rights": _DBAdminData.Rights
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
//管理者登出
exports._adminLogout = function (_AdminData) {
    return _getAdminData(_AdminData).then(function (_DBAdminData) {
        _updateStatus(_DBAdminData.AdminID, false);
        return Promise.resolve(_DBAdminData.Name + "已登出。");
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//新增管理者
exports._addNewAdmin = function (_AdminData) {
    if (_AdminData.Name && _AdminData.Password && _AdminData.Rights) {
        var Ref = "DONGCloud/DongService/Admin/TotalAdmin";
        var Callback = function (count) {
            Ref = "DONGCloud/DongService/Admin/Admin" + count.snapshot.val();
            var Data = {
                "Name": _AdminData.Name,
                "Password": _AdminData.Password,
                "Rights": _AdminData.Rights
            };
            db._transaction(Ref, Data);

            return Promise.resolve(exports._adminLogin(_AdminData));

        }
        return _checkAdmin(_AdminData).then(function (_DBAdminData) {
            if (_DBAdminData === null) {
                return Promise.resolve(db._transactionCount(Ref, Callback));
            }
            else {
                return Promise.reject("您已為系統管理者。");
            }
        })
    }
    else {
        return Promise.reject("未傳入完整的管理者資訊。");
    }
}
//取得管理者資訊
exports._getAdminInfo = function (_AdminName) {
    //查詢個別管理者
    if (_AdminName) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Admin";
        // Child
        var ChildName = "Name";
        // AdminName
        var Name = _AdminName;
        // 讀取管理者資料, 回傳
        return Promise.resolve(db._equalTo(RefPath, ChildName, Name, null));
    }
    //回傳全部管理者
    else {
        // DB Table
        var RefPath = "DONGCloud/DongService";
        var ChildName = "Admin";
        // 回傳所有產品
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
}
//編輯管理者資訊
exports._updateAdminInfo = function (_AdminData) {
    if (_AdminData.AdminID && (_AdminData.Rights || _AdminData.Name || _AdminData.Password)) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Admin";
        // Child
        var ChildName = _AdminData.AdminID;
        var Data = {};
        for (var prop in _AdminData) {
            if (typeof _AdminData[prop] != 'function' && (prop == "Rights" || prop == "Name" || prop == "Password")) {
                Data[prop] = _AdminData[prop];
            }
        }
        db._update(RefPath, ChildName, Data);
        return Promise.resolve("已更新管理者資訊。");
    }
    else {
        return Promise.reject(new Error("未傳入正確的管理者資訊"));
    }
}
//取得產品清單
exports._getProducts = function () {
    // DB Table
    var RefPath = "DONGCloud/DongService";
    var ChildName = "Products";
    // 回傳所有產品
    return Promise.resolve(db._onValuePromise(RefPath, ChildName));
}
//各產品用戶數量
exports._getUserCount = function (_ProductName) {
    //查詢個別商品總用戶
    if (_ProductName) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Products";
        // Child
        var ChildName = "Name";
        // 讀取管理者資料, 回傳
        return db._equalTo(RefPath, ChildName, _ProductName, null).then(function (_ProductData) {
            return Promise.resolve(_ProductData["TotalUsers"]);
        }).catch((err) => {
            return Promise.reject(err);
        })
    }
    //回傳錯誤訊息
    else {
        // 回傳所有產品
        return Promise.reject(new Error("未傳入商品名稱"));
    }
}
//審核產品
exports._verifyProduct = function () {

}
//加入新產品
exports._addNewProduct = function (_ProductData) {
    if (_ProductData.Name && _ProductData.Description && _ProductData.NeedVerify) {
        var Ref = "DONGCloud/DongService/Products/TotalProducts";
        var Callback = function (count) {
            Ref = "DONGCloud/DongService/Products/Product" + count.snapshot.val();
            var Data = {
                "Name": _ProductData.Name,
                "Description": _ProductData.Description,
                "NeedVerify": _ProductData.NeedVerify,
                "TotalUsers": 0
            };
            db._transaction(Ref, Data);
            return Promise.resolve("已加入新產品" + _ProductData.Name + "。");
        }
        return db._transactionCount(Ref, Callback);
    }
    else {
        return Promise.reject(new Error("未傳入正確的產品資訊"));
    }
}
//編輯產品
exports._updateProduct = function (_ProductData) {
    if (_ProductData.ProductID && (_ProductData.Description || _ProductData.Name || _ProductData.NeedVerify)) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Products";
        // Child
        var ChildName = _ProductData.ProductID;
        var Data = {};
        for (var prop in _ProductData) {
            if (typeof _ProductData[prop] != 'function' && (prop == "Description" || prop == "Name" || prop == "NeedVerify")) {
                Data[prop] = _ProductData[prop];
            }
        }
        db._update(RefPath, ChildName, Data);
        return Promise.resolve("已更新產品。");
    }
    else {
        return Promise.reject(new Error("未傳入正確的產品資訊"));
    }
}
//移除產品
exports._removeProduct = function (_ProductName) {
    //查詢產品資料
    if (_ProductName) {
        // DB Table
        var RefPath = "DONGCloud/DongService/Products";
        // Child
        var ChildName = "Name";
        // 讀取產品資料
        return db._equalTo(RefPath, ChildName, _ProductName, null).then(function (_ProductData) {
            if (_ProductData != null) {
                //取產品ID
                var ProductID;
                for (var prop in _ProductData) {
                    if (typeof _ProductData[prop] != 'function') {
                        ProductID = prop;
                    }
                }
                var ChildName = ProductID;
                var Data = {
                    "Deleted": true
                };
                //更新產品刪除狀態
                db._update(RefPath, ChildName, Data);
                return Promise.resolve("已移除產品" + _ProductData[ProductID].Name + "。");
            }
            else {
                return Promise.reject(new Error("找不到對應產品資料"));
            }
        }).catch((err) => {
            return Promise.reject(err);
        })
    }
    //回傳錯誤訊息
    else {
        // 回傳所有產品
        return Promise.reject(new Error("未傳入產品名稱"));
    }
}
//個別用戶對產品的使用頻率
exports._getUserFrequency = function () {

}
//所有用戶對產品的平均使用頻率
exports._getProductFrequency = function () {

}
//目前線上使用者清單
exports._getUsersList = function () {
    //online/TotalUsers
    //username/status
    //socket:sports room clientcount
}

//以Name查詢管理者
var _checkAdmin = function (_AdminData) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Admin";
    // Child
    var ChildName = "Name";
    // Admin Name
    var Name = _AdminData.Name;
    // 讀取使用者資料, 回傳

    if (ChildName) {
        //return Promise.resolve(db._onValuePromise(RefPath, ChildName));
        return Promise.resolve(db._equalTo(RefPath, ChildName, Name, null));
    }
    else {
        return Promise.reject(new Error("未傳入管理者名稱"));
    }
}

//回傳管理者資訊
var _getAdminData = function (_AdminData) {
    return _checkAdmin(_AdminData).then(function (_DBAdminData) {
        if (_DBAdminData != null) {
            var AdminID;
            for (var prop in _DBAdminData) {
                if (typeof _DBAdminData[prop] != 'function') {
                    AdminID = prop;
                    _DBAdminData[AdminID].AdminID = AdminID;
                }
            }
            return Promise.resolve(_DBAdminData[AdminID]);
        }
        else {
            return Promise.reject(new Error("找不到對應管理者資料"));
        }
    })
}

//更新管理者上線狀態
var _updateStatus = function (_AdminID, _Status) {
    var Ref = "DONGCloud/DongService/Admin";
    var ChildName = _AdminID;
    //date, status
    var Data = {
        "Online": _Status
    };
    if (_Status == true) {
        Data.LastLoginAt = calculator._dateTimeNow();
    }
    db._update(Ref, ChildName, Data);
}