var express = require('express');
var router = express.Router();
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var api = require('../libraries/tool/postdata.js');
var db = require('../libraries/firebase_db.js');

//存放每天更新的motionUrl片段
var motionUrl = "";

//設定排程
function startInterval(_Days, _Callback) {
    _Callback();
    //每天重產一次motionUrl
    return setInterval(_Callback, _Days * 1000 * 60 * 60 * 24);
}

//重產隨機碼(7碼)
function _GenerateURL() {
    motionUrl = Math.random().toString(36).substr(2, 7);
    console.log(motionUrl);
}

//觸發產製隨機碼事件，替換motionUrl
startInterval(1, _GenerateURL);

//驗證motionUrl片段
router.param("motionurl", function (req, res, next, _MotionUrl) {
    //驗證通過
    if (_MotionUrl == motionUrl) {
        next();
    }
    //驗證失敗
    else {
        res.json({ "Error": "傳入錯誤的URL，無法使用動作辨識功能。" });
    }
});

/*
minderbeta API 測試
*/
router.post("/Minder/:motionurl" + motionUrl, function (req, res) {
    var DataRaw = req.body;
    var ProcessedCode = JSON.parse(DataRaw.Code);
    var MinderResult = minderBetaService._lcsRateComputing(
        ProcessedCode, 0.5, 1, 1);
    var UID = DataRaw.UID;
    var IsTrial = JSON.parse(DataRaw.IsTrial);
    db._GetRequestCount(UID, IsTrial).then(function (_Count) {
        var DataResult = {
            User: UID,
            ProcessCode: ProcessedCode,
            MotionCode: MinderResult.ActionCode,
            Similarity: parseInt(MinderResult.Rate * 100)
        }
        var DataFinish = api._postData(DataResult);
        db._SaveMotion(UID, DataFinish, _Count);
        db._AddRequestCount(UID, IsTrial, _Count);
        MinderResult["RequestCount"] = _Count + 1;
        res.json(MinderResult);
    });
});

/* 
processbeta API 測試
*/
router.post("/Raw/:motionurl", function (req, res) {
    var DataRaw = req.body;
    var Threshold = 0.18;
    var ProcessedCode = processBetaService._processData(DataRaw, Threshold).mixBinaryCodes;
    var MinderResult = minderBetaService._lcsRateComputing(
        ProcessedCode, 0.5, 1, 1);
    var UID = DataRaw.UID;
    var IsTrial = JSON.parse(DataRaw.IsTrial);
    db._GetRequestCount(UID, IsTrial).then(function (_Count) {
        var DataResult = {
            User: UID,
            ProcessCode: ProcessedCode,
            MotionCode: MinderResult.ActionCode,
            Similarity: parseInt(MinderResult.Rate * 100)
        }
        var DataFinish = api._postData(DataResult);
        db._SaveMotion(UID, DataFinish, _Count);
        db._AddRequestCount(UID, IsTrial, _Count);
        MinderResult["RequestCount"] = _Count + 1;
        res.json(MinderResult);
    });
})

//使用者是付費會員，回傳特定格式的URL片段
router.post('/getMotionUrl', function (req, res) {
    var UID = req.body.UID;
    if (UID) {
        db._CheckUserType(UID).then(function (_UserData) {
            (_UserData != null) ? res.json({ "URL": motionUrl }) : res.json({ "Error": "不是正式會員" });
        }).catch(function (err) {
            res.json({ "Error": "確認會員資格出現錯誤" });
        })
    }
    else {
        res.json({ "Error": "未傳入正式會員ID" });
    }
});

module.exports = router;