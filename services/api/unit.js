var db = require('../../libraries/firebase_db.js');

exports._RawProcess = function (_RawData) {
    /*
    Kernal Part
    */
    // 編碼處理 + 運算Rate, Pattern
    var MinderBetaService = require('../unit/kernal/minderbeta.js');
    var ProcessBetaService = require('../unit/kernal/processbeta.js');
    var Threshold = 0.18;
    // 轉換為一列編碼
    var UID = _RawData.UID;
    var ProcessedCode = ProcessBetaService._processData(_RawData, Threshold).mixBinaryCodes;
    var MinderThreshold = 0.5;
    var PatternModel = 1;
    var PatternType = 1;
    // 運算Rate, Pattern 
    return MinderBetaService._lcsRateComputing(
        UID, ProcessedCode, MinderThreshold, PatternModel, PatternType).then(function (_MinderResult) {
            /*
    Unit Part
    */
            var api = require('../../libraries/tool/postdata.js');
            
            var DataResult = {
                User: UID,
                ProcessCode: ProcessedCode,
                MotionCode: _MinderResult.ActionCode,
                Similarity: parseInt(_MinderResult.Rate * 100)
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
            return db._GetRequestCount(UID, IsTrial).then(function (_Count) {
                db._SaveMotion(UID, DataFinish, _Count);
                db._AddRequestCount(UID, IsTrial, _Count);
                return _MinderResult;
            });


        })
}

exports._MinderProcess = function (_MinderData) {
    /*
    Kernal Part
    */
    // 運算Rate, Pattern
    var MinderBetaService = require('../unit/kernal/minderbeta.js');
    var UID = _MinderData.UID;
    var ProcessedCode = JSON.parse(_MinderData.Code);
    var MinderThreshold = 0.5;
    var PatternModel = 1;
    var PatternType = 1;
    // 運算Rate, Pattern 
    return MinderBetaService._lcsRateComputing(
        UID, ProcessedCode, MinderThreshold, PatternModel, PatternType).then(function (_MinderResult) {
            /*
    Unit Part
    */
            var api = require('../../libraries/tool/postdata.js');
            
            var DataResult = {
                User: UID,
                ProcessCode: ProcessedCode,
                MotionCode: _MinderResult.ActionCode,
                Similarity: parseInt(_MinderResult.Rate * 100)
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
            return db._GetRequestCount(UID, IsTrial).then(function (_Count) {
                db._SaveMotion(UID, DataFinish, _Count);
                db._AddRequestCount(UID, IsTrial, _Count);
                return _MinderResult;
            });


        });
}
