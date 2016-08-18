var express = require('express');
var router = express.Router();
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var api = require('../libraries/tool/postdata.js');
var db = require('../libraries/firebase_db.js');

/*
minderbeta API 測試
*/
router.post('/Minder', function (req, res) {
    var DataRaw = req.body;
    var ProcessedCode = JSON.parse(DataRaw.Code);
    var MinderResult = minderBetaService._lcsRateComputing(
ProcessedCode, 0.5, 1, 1);
    var UID = DataRaw.UID;
    var IsTrial = JSON.parse(DataRaw.IsTrial);
    db._GetRequestCount(UID, IsTrial).then(function(_Count){
        var DataResult = {
            User : UID,
            ProcessCode : ProcessedCode,
            MotionCode : MinderResult.ActionCode,
            Similarity : parseInt(MinderResult.Rate * 100)
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
router.post('/Raw', function(req, res){
    var DataRaw = req.body;
    var Threshold = 0.18;
    var ProcessedCode = processBetaService._processData(DataRaw, Threshold).mixBinaryCodes;
    var MinderResult = minderBetaService._lcsRateComputing(
ProcessedCode, 0.5, 1, 1);
    var UID = DataRaw.UID;
    var IsTrial = JSON.parse(DataRaw.IsTrial);
    db._GetRequestCount(UID, IsTrial).then(function(_Count){
        var DataResult = {
            User : UID,
            ProcessCode : ProcessedCode,
            MotionCode : MinderResult.ActionCode,
            Similarity : parseInt(MinderResult.Rate * 100)
        }
        var DataFinish = api._postData(DataResult);
        db._SaveMotion(UID, DataFinish, _Count);
        db._AddRequestCount(UID, IsTrial, _Count);
        MinderResult["RequestCount"] = _Count + 1;
        res.json(MinderResult);
    });
})



module.exports = router;