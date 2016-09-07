//20160822 Ver.1 Fiscol
//Note : 切割為開發測試 / 一般使用者 / 免費試用者區塊，區分API;
//將運算部份切割到Service層

/*
api.js
*/
var express = require('express');
var unitServices = require('../services/api/unit.js');
var demoServices = require('../services/api/demo-badminton.js');
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var api = require('../libraries/tool/postdata.js');
var db = require('../libraries/firebase_db.js');
var router = express.Router();

////開發測試區塊
//原始G-Sensor Data，輸出Rate和ActionCode，滿足門檻值觸發其他服務
router.post('/iOS/Raw', function (req, res, next) {
    // 解析body
    var RawData = req.body;
    var Threshold = 0.18;
    var MinderCode = processBetaService._processData(RawData, Threshold).mixBinaryCodes;
    unitServices._RawProcess(RawData).then(function (_MinderResult) {
        var MinderThreshold = 0.6;
        res.json(_MinderResult);
        demoServices._TriggerDongServices(req, RawData.UID, MinderCode, _MinderResult, MinderThreshold, localurl);
    });
});

//一列編碼，輸出Rate和ActionCode，滿足門檻值觸發其他服務
router.post('/iOS/Minder', function (req, res, next) {
    // 解析body
    var MinderData = req.body;
    var MinderCode = JSON.parse(MinderData.Code);
    unitServices._MinderProcess(MinderData).then(function (_MinderResult) {
        var MinderThreshold = 0.6;
        res.json(_MinderResult);
        demoServices._TriggerDongServices(req, MinderData.UID, MinderCode, _MinderResult, MinderThreshold, localurl);

        // For DT DEMO
        var demoServicesSign = require('../services/api/demo-sign.js');
        demoServicesSign._TriggerDongServicesDemoSign(req, _MinderResult);

    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": err.message });
    })
});


//加入使用者的RawPattern
router.post('/addRawPattern', function (req, res) {
    var UID = req.body.UID;
    if (UID) {
        var DataRaw = req.body;
        var Threshold = 0.18;
        var ProcessedCode = processBetaService._processData(DataRaw, Threshold).mixBinaryCodes.toString();
        var IsTrial = false;
        db._GetPatternCount(UID, IsTrial).then(function (_PatternCount) {
            db._AddUserPattern(UID, ProcessedCode, _PatternCount);
            db._AddPatternCount(UID, IsTrial, _PatternCount);
            res.json({ "Message": "儲存會員Pattern成功" });
        })
    }
    else {
        res.json({ "Error": "未傳入會員ID" });
    }
});

//加入使用者的MinderPattern
router.post('/addMinderPattern', function (req, res) {
    var UID = req.body.UID;
    if (UID) {
        var DataRaw = req.body;
        var ProcessedCode = JSON.parse(DataRaw.Code).toString();
        var IsTrial = false;
        db._GetPatternCount(UID, IsTrial).then(function (_PatternCount) {
            db._AddUserPattern(UID, ProcessedCode, _PatternCount);
            db._AddPatternCount(UID, IsTrial, _PatternCount);
            res.json({ "Message": "儲存會員Pattern成功" });
        })
    }
    else {
        res.json({ "Error": "未傳入會員ID" });
    }
});

var localurl;
router.post('/localurl', function (req, res, next) {
    localurl = req.body.url;
    res.send(localurl);
});

////一般使用者區塊

//存放每天更新的motionUrl片段
var motionUrl = "";

//設定排程，一啟動Server端就會觸發第一次產製，之後每天更新一次隨機碼
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
router.post("/Minder/:motionurl", function (req, res) {
    var MinderData = req.body;
    //var MinderCode = JSON.parse(MinderData.Code);
    unitServices._MinderProcess(MinderData).then(function (_MinderResult) {

        res.json(_MinderResult);
    });
});

/* 
processbeta API 測試
*/
router.post("/Raw/:motionurl", function (req, res) {
    // 解析body
    var RawData = req.body;
    var Threshold = 0.18;
    //var MinderCode = processBetaService._processData(RawData, Threshold).mixBinaryCodes;
    unitServices._RawProcess(RawData).then(function (_MinderResult) {
        res.json(_MinderResult);
    })
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

////免費試用者區塊


////Digital Taipei 使用者區塊

//Mark簽名判斷(當天使用)

//Create API

//Check API

//Check Example API(Mark簽名)
router.post('/Recognize', function(req, res){
    var RawData = req.body;
    var Threshold = 0.18;
    RawData.UID = "DigitalTaipei";
    unitServices._RawProcess(RawData).then(function (_MinderResult) {
        res.json(_MinderResult);
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": err.message });
    })
})

//Get Signature Results
router.get('/SignResult', function(req, res){
    db._GetSignResult().then(function (_Data) {  
        res.json(_Data);
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": err.message });
    })
})


module.exports = router;