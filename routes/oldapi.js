//20160822 Ver.1 Fiscol
//Note : 切割為開發測試 / 一般使用者 / 免費試用者區塊，區分API;
//將運算部份切割到Service層

/*
api.js
*/
var express = require('express');
var session = require('express-session');
var unitServices = require('../services/api/unit.js');
var patternServices = require('../services/api/pattern.js');
var demoServices = require('../services/api/demo-badminton-old.js');
var boxingServices = require('../services/api/demo-boxing.js');
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var api = require('../libraries/tool/postdata.js');
var db = require('../libraries/firebase_db.js');
var router = express.Router();

//原始G-Sensor Data，輸出Rate和ActionCode，滿足門檻值觸發其他服務
router.post('/iOS/Raw', function (req, res, next) {
    // 解析body
    var RawData = req.body;
    var Threshold = 0.18;
    var MinderCode = processBetaService._processData(RawData, Threshold).mixBinaryCodes;
    unitServices._RawProcess(RawData).then(function (_MinderResult) {
        var MinderThreshold = 0.4;
        demoServices._TriggerDongServices(req, RawData.UID, MinderCode, _MinderResult, MinderThreshold, localurl);
        res.json(_MinderResult);
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": err.message });
    });
});

//一列編碼，輸出Rate和ActionCode，滿足門檻值觸發其他服務
router.post('/iOS/Minder', function (req, res, next) {
    // 解析body
    var MinderData = req.body;
    var MinderCode = JSON.parse(MinderData.Code);
    unitServices._MinderProcess(MinderData).then(function (_MinderResult) {
        var MinderThreshold = 0.4;
        demoServices._TriggerDongServices(req, MinderData.UID, MinderCode, _MinderResult, MinderThreshold, localurl);

        // For DT DEMO
        //var demoServicesSign = require('../services/api/demo-sign.js');
        //demoServicesSign._TriggerDongServicesDemoSign(req, _MinderResult);
        //boxingServices._TriggerBoxing(req, MinderCode, _MinderResult, MinderThreshold);
        res.json(_MinderResult);
        
    }).catch((err) => {
        //註冊失敗
        res.json({ "Error": err.message });
    });
});

var localurl;
router.post('/localurl', function (req, res, next) {
    localurl = req.body.url;
    console.log('get DONG Motion URL:' + localurl);
    res.send(localurl);
});

module.exports = router;