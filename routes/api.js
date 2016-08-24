//20160815 Ver.1 Fiscol
//Note : iOS串上RawData做ViewData串接與寫入DB測試;
//20160815 Ver.2 Fiscol
//Note : 將minder/raw兩種input, 拆成兩組api
//20160815 Ver.3 Fiscol
//Note : 當Rate > 門檻值(0.5)時，才觸發監控介面動畫，表格更新

/*
api.js
*/
var express = require('express');
var apiServices = require('../services/api/api.js');
var router = express.Router();
/*
API Server
*/
var rawReqURL = '/iOS/Raw';
router.post(rawReqURL, function (req, res, next) {
    // 解析body
    var RawData = req.body;
    var MinderResult = apiServices._RawProcess(RawData);
    var ProcessBetaService = require('../services/unit/kernal/processbeta.js');
    var Threshold = 0.18;
    var ProcessedCode = ProcessBetaService._processData(RawData, Threshold).mixBinaryCodes;
    var MinderThreshold = 0.5;
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (MinderResult.Rate >= MinderThreshold) {
        // Send RealTimeData to View 
        req.io.sockets.emit('RealTimeData', {
            MaxSpeed: (Math.floor((Math.random() * 10) + 1)) * 17,
            MaxPower: (Math.floor((Math.random() * 10) + 1)) * 37,
            Similarity: parseInt(MinderResult.Rate * 100),
            GestureNum: (MinderResult.ActionCode % 3) + 1
        });
    }
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才寫到介面Table
    if (MinderResult.Rate >= MinderThreshold) {
        // Send DBdata to View
        req.io.sockets.emit('DBData', {
            Name: RawData.UID,
            Rawdata: ProcessedCode,
            Rate: MinderResult.Rate,
            ActionCode: MinderResult.ActionCode
        });
    }

    // 過門檻值則觸發DONGSlide, DongMotion
    var DongServices = require('../libraries/tool/dongservices.js');
    if (MinderResult.Rate >= MinderThreshold) {
        if (MinderResult.ActionCode == 19) {
            DongServices._requestDongSlide();
            DongServices._requestDongMotion(localurl);
            console.log('Dong Services called.');
        };
    };
    res.json(MinderResult);
});

var minderReqURL = '/iOS/Minder';
router.post(minderReqURL, function (req, res, next) {
    // 解析body
    var MinderData = req.body;
    var MinderResult = apiServices._MinderProcess(MinderData);
    var ProcessedCode = JSON.parse(MinderData.Code);
    var MinderThreshold = 0.5;
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (MinderResult.Rate >= MinderThreshold) {
        // Send RealTimeData to View
        req.io.sockets.emit('RealTimeData', {
            MaxSpeed: (Math.floor((Math.random() * 10) + 1)) * 17,
            MaxPower: (Math.floor((Math.random() * 10) + 1)) * 37,
            Similarity: parseInt(MinderResult.Rate * 100),
            GestureNum: (MinderResult.ActionCode % 3) + 1
        });
    }
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才寫到介面Table
    if (MinderResult.Rate >= MinderThreshold) {
        // Send DBdata to View
        req.io.sockets.emit('DBData', {
            Name: MinderData.UID,
            Rawdata: ProcessedCode,
            Rate: MinderResult.Rate,
            ActionCode: MinderResult.ActionCode
        });
    }

    // 過門檻值則觸發DONGSlide, DongMotion
    var DongServices = require('../libraries/tool/dongservices.js');
    if (MinderResult.Rate >= MinderThreshold) {
        if (MinderResult.ActionCode == 19) {
            DongServices._requestDongSlide();
            DongServices._requestDongMotion(localurl);
            console.log('Dong Services called.');
        };
    };
    res.json(MinderResult);
});

var localurl;
router.post('/localurl', function (req, res, next) {
    localurl = req.body.url;
    res.send(localurl);
});

module.exports = router;