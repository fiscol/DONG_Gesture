/*
minderbeta API 測試
*/

var express = require('express');
var router = express.Router();
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var api = require('../DONG_Calculate.js');

router.post('/Minder', function (req, res) {
    var DataRaw = req.body;
    var ProcessedCode = JSON.parse(DataRaw.Code);
    var MinderResult = minderBetaService._lcsRateComputing(
ProcessedCode, 0.5, 1, 1);
    var UID = DataRaw.UID;
    var IsTrial = DataRaw.IsTrial;
    _GetRequestCount(UID, IsTrial).then(function(_Count){
        var DataResult = {
            User : UID,
            ProcessCode : ProcessedCode,
            MotionCode : MinderResult.ActionCode,
            Similarity : parseInt(MinderResult.Rate * 100)
        }
        var DataFinish = api._postData(DataResult);
        _SaveMotion(UID, DataFinish, _Count);
        _AddRequestCount(UID, IsTrial, _Count);
        MinderResult["RequestCount"] = _Count + 1;
        res.json(MinderResult);
    });
});

/* 
processbeta API 測試
*/
router.post('/Raw', function(req, res){
    var DataRaw = req.body;
    var Threshold = 0.18;
    var ProcessedCode = processBetaService._processData(DataRaw, Threshold).mixBinaryCodes;
    var MinderResult = minderBetaService._lcsRateComputing(
ProcessedCode, 0.5, 1, 1);
    var UID = DataRaw.UID;
    var IsTrial = DataRaw.IsTrial;
    _GetRequestCount(UID, IsTrial).then(function(_Count){
        var DataResult = {
            User : UID,
            ProcessCode : ProcessedCode,
            MotionCode : MinderResult.ActionCode,
            Similarity : parseInt(MinderResult.Rate * 100)
        }
        var DataFinish = api._postData(DataResult);
        _SaveMotion(UID, DataFinish, _Count);
        _AddRequestCount(UID, IsTrial, _Count);
        MinderResult["RequestCount"] = _Count + 1;
        res.json(MinderResult);
    });
})

function _GetRequestCount(_UID, _IsTrial){
    var DB = require('../libraries/firebase_db.js');
    // DB Table
    var RefPath = (_IsTrial == true)? "DONGCloud/DongService/Trial/"  : "DONGCloud/DongService/";
    RefPath += _UID
    // UserID
    var ChildName = "RequestCount";
    // 讀取使用者資料, 回傳
    
    if(ChildName){
        return Promise.resolve(DB._onValuePromise(RefPath, ChildName));
    }
    else{
        return Promise.reject(new Error("未傳入使用者ID"));
    }
    
}

function _SaveMotion(_UID, _DataResult, _RequestCount){
    var DB = require('../libraries/firebase_db.js');
    // DB Path
    var RefPath = "DONGCloud/MotionData/" + _UID;
    // Child Name
    _RequestCount++;
    var ChildName = "Data" + _RequestCount;
    // 存到DB
    DB._set(RefPath, ChildName, _DataResult);
}

function _AddRequestCount(_UID, _IsTrial, _RequestCount){
    var DB = require('../libraries/firebase_db.js');
    var Calculator = require('../DONG_Calculate.js');
    // DB Path
    var RefPath = (_IsTrial == true)? "DONGCloud/DongService/Trial" : "DONGCloud/DongService";
    // Child Name
    var ChildName = _UID;
    var Data = {
                    "RequestCount" : _RequestCount + 1,
                    "LastExecDate" : Calculator._getDateTimeNow()
               };
    // 存到DB
    DB._update(RefPath, ChildName, Data);
}

module.exports = router;