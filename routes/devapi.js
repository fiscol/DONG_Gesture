var express = require('express');
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var train = require('../services/api/train.js');
var db = require('../libraries/firebase_db.js');
var router = express.Router();

//驗證motionUrl片段
router.param("devcode", function (req, res, next, _DevCode) {
    //驗證通過
    if (_DevCode == "pvdplus") {
        next();
    }
    //驗證失敗
    else {
        res.json({ "Error": "傳入錯誤的URL，無法使用動作辨識功能。" });
    }
});

//LCS API
//pvdplus/LCS
router.post('/:devcode/LCS', function (req, res, next) {
    var MotionInput = req.body;
    if (MotionInput.input1 && MotionInput.input2) {
        res.json(minderBetaService._lcsComputing(JSON.parse(MotionInput.input1), JSON.parse(MotionInput.input2)));
    }
    else {
        res.json({ "Error": "請傳入input1與input2參數" });
    }
})
//Add New User Pattern(Private)
router.post('/:devcode/AddPattern', function (req, res, next) {
    var UID = req.body.UID;
    if (UID) {
        var DataRaw = req.body;
        var MinderData = JSON.parse(DataRaw.Code).toString();
        db._GetPatternCount(UID, false).then(function (_PatternCount) {
            db._GetSampleCount(UID, false).then(function (_SampleArr) {
                var SampleArr = _SampleArr.split(',');
                var SampleCount = SampleArr[_PatternCount - 1];
                var Threshold = DataRaw.Threshold;
                train._AddNewSample(UID, _PatternCount, SampleCount, SampleArr, MinderData, Threshold).then(function (_Result) {
                    res.json(_Result);
                })
            });
        })
    }
    else {
        res.json({ "Error": "未傳入會員ID" });
    }
})

router.post('/:devcode/CheckPattern', function (req, res, next) {
    var UID = req.body.UID;
    if (UID) {
        var DataRaw = req.body;
        var MinderData = JSON.parse(DataRaw.Code).toString();
        var CheckResult = "Fail";
        db._GetPatternCount(UID, false).then(function (_PatternCount) {
            db._GetSampleCount(UID, false).then(function (_SampleArr) {
                for (var i = 1; i <= _PatternCount; i++) {
                    var Threshold = 0.6;
                    var SampleArr = _SampleArr.split(',');
                    var SampleCount = SampleArr[i - 1];
                    train._CheckResults(UID, i, SampleCount, MinderData, Threshold).then(function (_Result) {
                        if (_Result.Message == "Pass") {
                            CheckResult = "Pass";
                            var punch = (_Result.Pattern == 1) ? "heavy" : "normal";
                            req.io.sockets.emit('boxing', { punch: punch });
                            res.json(_Result);
                            res.end();
                        }
                        else if (_Result.Pattern == _PatternCount && CheckResult == "Fail") {
                            res.json({ "Message": "Fail" });
                            res.end();
                        }
                    })
                }
            })
        })
    }
    else {
        res.json({ "Error": "未傳入會員ID" });
    }
})
//產DT2016的VIP Code
router.get('/:devcode/GetCode', function (req, res) {
    var crypt = require("../libraries/tool/crypt.js");
    var codeArr = [];
    for (var i = 1; i < 151; i++) {
        var number = i.toString();
        var code = "";
        switch (i % 3) {
            case 0:
                code = number + "dt";
                break;
            case 1:
                code = "d" + number + "t";
                break;
            case 2:
                code = "dt" + number;
                break;
        }

        var result = crypt._encrypt(code);
        codeArr.push(result);
    }
    res.json({ "Codes": codeArr });
})

module.exports = router;