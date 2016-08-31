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

router.post('/:devcode/AddPattern', function (req, res, next) {
    var UID = req.body.UID;
    if (UID) {
        var DataRaw = req.body;
        var MinderData = JSON.parse(DataRaw.Code).toString();
        db._GetPatternCount(UID, false).then(function (_PatternCount) {
            var PatternCount = _PatternCount;
            db._GetSampleCount(UID, false).then(function (_SampleArr) {
                var SampleCount = _SampleArr.split(',')[_PatternCount - 1];
                var Threshold = 0.5;
                train._AddNewSample(UID, PatternCount, SampleCount, MinderData, Threshold).then(function (_Result) {
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
        db._GetPatternCount(UID, false).then(function (_PatternCount) {
            for(var i = 1; i <= _PatternCount; i++){
                var Threshold = 0.5;
                train._CheckResults(UID, i, MinderData, Threshold).then(function (_Result) {
                    if(_Result.Message == "Pass"){
                        var punch = (_Result.Pattern == 1)? "heavy" :"normal";
                        req.io.sockets.emit('boxing',{punch:punch});
                        res.json(_Result);
                    }
                })
            }
        })
    }
    else {
        res.json({ "Error": "未傳入會員ID" });
    }
})

module.exports = router;