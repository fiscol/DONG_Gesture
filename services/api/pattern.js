var db = require('../../libraries/firebase_db.js');
/*
取得目前Request總數
*/
exports._GetRequestCount = function (_UID, _Product) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Stats/";
    RefPath += _Product + "/UserData/" + _UID;
    // UserID
    var ChildName = "RequestCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }

}

/*
確認使用者是否為付費會員
*/
exports._CheckUserType = function (_UID) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Users";
    // UserID
    var ChildName = "Name";
    var Value = _UID;
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(db._equalTo(RefPath, ChildName, Value, null));
    }
    else {
        return Promise.reject(new Error("未傳入使用者ID"));
    }

}
/*
儲存MotionData到DB
*/
exports._SaveMotion = function (_UID, _Product, _DataResult, _RequestCount) {
    // DB Path
    var RefPath = "DONGCloud/MotionData/" + _Product + "/" + _UID;
    // Child Name
    _RequestCount++;
    var ChildName = "Data" + _RequestCount;
    // 存到DB
    db._set(RefPath, ChildName, _DataResult);
}

/*
更新Pattern Count總數到DB
*/
exports._AddPatternUseCount = function (_UID, _Product, _PatternID) {
    // DB Path
    var RefPath = "DONGCloud/PatternData/";
    RefPath += _Product + "/" + _UID + "/" + _PatternID + "/Count";
    // 存到DB
    return Promise.resolve(db._transactionCount(RefPath, function(_Count){}));
}

/*
更新Request總數到DB
*/
exports._AddRequestCount = function (_UID, _Product, _RequestCount) {
    var Calculator = require('../../libraries/tool/gettime.js');
    // DB Path
    var RefPath = "DONGCloud/DongService/Stats/";
    RefPath += _Product + "/UserData";
    // Child Name
    var ChildName = _UID;
    var Data = {
        "RequestCount": _RequestCount + 1,
        "LastExecDate": Calculator._dateTimeNow()
    };
    // 存到DB
    db._update(RefPath, ChildName, Data);
}

/*
取得Pattern總數
*/
exports._GetPatternCount = function (_UID, _Product) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Stats/";
    RefPath += _Product + "/UserData/" + _UID;
    // UserID
    var ChildName = "PatternCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

/*
加入Pattern到DB
*/
exports._AddUserPattern = function (_UID, _Product, _MinderData, _PatternCount) {
    // DB Path
    var RefPath = "DONGCloud/PatternData/";
    RefPath += _Product + "/" + _UID;
    // Child Name
    _PatternCount++;
    var ChildName = "Pattern" + _PatternCount;
    var Data = {
        "Data": _MinderData,
        "Note": null,
        "Count": 0,
        "Deleted": false
    };
    // 存到DB
    db._set(RefPath, ChildName, Data);
}

/*
移除DB Pattern
*/
exports._DeleteUserPattern = function (_UID, _Product, _PatternID) {
    // DB Path
    var RefPath = "DONGCloud/PatternData/";
    RefPath += _Product + "/" + _UID;
    // Child Name
    var ChildName = _PatternID;
    var Data = {
        "Deleted": true
    };
    // 存到DB
    db._update(RefPath, ChildName, Data);
    return Promise.resolve("已移除Pattern");
}

/*
更新Pattern總數到DB
*/
exports._AddPatternCount = function (_UID, _Product, _PatternCount) {
    var Calculator = require('../../libraries/tool/gettime.js');
    // DB Path
    var RefPath = "DONGCloud/DongService/Stats/";
    RefPath += _Product + "/UserData";
    // Child Name
    var ChildName = _UID;
    var Data = {
        "PatternCount": _PatternCount + 1
    };
    // 存到DB
    db._update(RefPath, ChildName, Data);
}

exports._GetUserPatterns = function (_UID, _Product) {
    // DB Table
    var RefPath = "DONGCloud/PatternData/" + _Product;
    // UserID
    var ChildName = _UID;
    // 讀取Pattern資料, 回傳
    if (ChildName) {
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

exports._GetSampleCount = function (_UID, _Product) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Stats";
    RefPath += _Product + "/UserData/" + _UID;
    // UserID
    var ChildName = "SampleCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

exports._GetTrainingCount = function (_UID, _Product) {
    // DB Table
    var RefPath = "DONGCloud/DongService/Stats";
    RefPath += _Product + "/UserData/" + _UID;
    // UserID
    var ChildName = "TrainingCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(db._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

exports._GetSignResult = function () {
    // DB Table
    var RefPath = "DONGCloud/MotionData/Drone";
    // UserID
    var ChildName = "DigitalTaipei";
    // 讀取使用者資料, 回傳
    return Promise.resolve(db._onValuePromise(RefPath, ChildName)).then(function (_Data) {
        var Pass = 0;
        var Fail = 0;
        for (var i = 1; i <= Object.keys(_Data).length; i++) {
            if (_Data["Data" + i].MotionCode == 1) {
                (_Data["Data" + i].Similarity >= 50) ? Pass++ : Fail++;
            }
        }
        return { "Pass": Pass, "Fail": Fail }
    });
}