var db = require('../../libraries/firebase_db.js');

exports._RawProcess = function(_RawData){
/*
Kernal Part
*/
    // 編碼處理 + 運算Rate, Pattern
    var MinderBetaService = require('../unit/kernal/minderbeta.js');
    var ProcessBetaService = require('../unit/kernal/processbeta.js');
    var Threshold = 0.18;
    // 轉換為一列編碼
    var ProcessedCode = ProcessBetaService._processData(_RawData, Threshold).mixBinaryCodes;
    var MinderThreshold = 0.5;
    var PatternModel = 1;
    var PatternType = 1;
    // 運算Rate, Pattern 
    var MinderResult = MinderBetaService._lcsRateComputing(
ProcessedCode, MinderThreshold, PatternModel, PatternType);
/*
Unit Part
*/
    var api = require('../../libraries/tool/postdata.js');
    var UID = _RawData.UID;
    var DataResult = {
        User : UID,
        ProcessCode : ProcessedCode,
        MotionCode : MinderResult.ActionCode,
        Similarity : parseInt(MinderResult.Rate * 100)
    }
    var DataFinish = api._postData(DataResult);
    
/*
Learn Part
*/

/*
DB Part
*/
    // 存到DB
    var IsTrial = false;
    db._GetRequestCount(UID, IsTrial).then(function(_Count){
        db._SaveMotion(UID, DataFinish, _Count);
        db._AddRequestCount(UID, IsTrial, _Count);
    });

    return MinderResult;
}

exports._MinderProcess = function(_MinderData){
/*
Kernal Part
*/
    // 運算Rate, Pattern
    var MinderBetaService = require('../unit/kernal/minderbeta.js');
    var ProcessedCode = JSON.parse(_MinderData.Code);
    var MinderThreshold = 0.5;
    var PatternModel = 1;
    var PatternType = 1;
    // 運算Rate, Pattern 
    var MinderResult = MinderBetaService._lcsRateComputing(
ProcessedCode, MinderThreshold, PatternModel, PatternType);
/*
Unit Part
*/
    var api = require('../../libraries/tool/postdata.js');
    var UID = _MinderData.UID;
    var DataResult = {
        User : UID,
        ProcessCode : ProcessedCode,
        MotionCode : MinderResult.ActionCode,
        Similarity : parseInt(MinderResult.Rate * 100)
    }
    var DataFinish = api._postData(DataResult);
/*
Learn Part
*/

/*
DB Part
*/
    // 存到DB
    var IsTrial = false;
    db._GetRequestCount(UID, IsTrial).then(function(_Count){
        db._SaveMotion(UID, DataFinish, _Count);
        db._AddRequestCount(UID, IsTrial, _Count);
    });
    
    return MinderResult;
}
