//先記一些TIP
var db = require('../../libraries/firebase_db.js');
var minderBetaService = require('../unit/kernal/minderbeta.js');
//General

//Signature

//Add 3 Sample For Initial Pattern
//Return Added Sample Count, Message Succeeded or Failed
exports._AddNewSample = function (_UID, _PatternCount, _SampleCount, _MinderData, _Threshold) {
    var AddResult = false;
    var ErrorMessage = "";
    //_SampleCount != 1  --->  Use Sample1 / Sample2 to Calculate Rate and TraceBack
    if (_SampleCount >= 1 && _SampleCount < 3) {
        var RefPath = "DONGCloud/PatternData/" + _UID;
        var ChildName = "Pattern" + _PatternCount;
        db._onValuePromise(RefPath, ChildName).then(function (_Data) {
            var Similarity = minderBetaService._lcsComputing(JSON.parse(_Data["Sample" + 1].MinderData), JSON.parse(_MinderData)).Rate;
            AddResult = (Similarity >= _Threshold) ? true : false;
            if (_SampleCount == 2 && AddResult == true) {
                Similarity = minderBetaService._lcsComputing(JSON.parse(_Data["Sample" + 2].MinderData), JSON.parse(_MinderData)).Rate;
                AddResult = (Similarity >= _Threshold) ? true : false;
            }
            
        });
    }
    if (_SampleCount == 0 || AddResult == true) {
        var RefPath = "DONGCloud/PatternData/" + _UID + "/Pattern" + _PatternCount;
        _SampleCount++;
        var ChildName = "Sample" + _SampleCount;
        var Data = {
            "MinderData": _MinderData,
            "AVGRate": 0,
            "StandardDeviation": 0,
            "PassTotal": 0,
            "TotalCount": 0,
            "Threshold": _Threshold
        }
        db._set(RefPath, ChildName, Data);
        return { "Message": "成功加入Pattern Sample。", "SampleCount": _SampleCount };
    }
    else {
        return { "Error": "加入Pattern Sample失敗。" };
    }
    //Rate < Threshold  --->  Return Please Re-Send Sample Message
    //Rate >= Threshold  --->  Add Pattern and Succeed Message
}
//Set Threshold (Strict, Medium, Easy)
//Return Message Succeeded or Failed
exports._SetPatternLevel = function (UID, _PatternCount, _ThresholdLevel) {
    //Strict=>0.8
    //Medium=>0.6
    //Easy=>0.5
}
//Reset 3 Sample For Initial Pattern
//Return Reseted Sample Count, Message Succeeded or Failed
exports._ResetPattern = function (_UID, _PatternCount, _SampleCount) {
    //Clear Pattern Sample
    //
}

//Interval
//Rate < Threshold && Rate between AVGRate +- 1σ
exports._AddTrainingData = function (_UID, _PatternCount, _SampleCount, _TrainingDataCount) {
    //
}

exports._UpdateResults = function (_UID, _PatternCount, _MinderData, _Threshold) {
    var RefPath = "DONGCloud/PatternData/" + _UID;
    var ChildName = "Pattern" + _PatternCount;
    db._onValuePromise(RefPath, ChildName).then(function (_Data) {
        var RateArr = [];
        RateArr.push(minderBetaService._lcsComputing(JSON.parse(_Data["Sample" + 1].MinderData), JSON.parse(_MinderData)).Rate);
        RateArr.push(minderBetaService._lcsComputing(JSON.parse(_Data["Sample" + 2].MinderData), JSON.parse(_MinderData)).Rate);
        RateArr.push(minderBetaService._lcsComputing(JSON.parse(_Data["Sample" + 3].MinderData), JSON.parse(_MinderData)).Rate);
        function isBigEnough(element, index, array) {
            return (element >= _Threshold);
        }
        var AllPass = RateArr.every(isBigEnough);
        var SomePass = RateArr.some(isBigEnough);
        //Pass
        if (AllPass == true) {
            
        }
        //Failed at some sample (Check TrainingData)
        else if (SomePass == true) {

        }
        //All Failed(Error)
        else {
            return { "Error": "未通過Pattern Threshold。" }
        }
    });
}

//Length

//Weight

//Average

//被Training出來的Sample長度必須接近原有Pattern
//Rate低，但長度相近 ---> Sample Pattern有問題(?)
//透過TraceBack找出相異區間
//迭代運算找出替代Sample

//近期的資料權重較重? (適應系統 + 使用者近期的習慣)
//密集出現的Rate區間資料
//收集足夠的Sample data(?)
//每隔多久學習 + 更新Training Data?
//學習的Training Data最多保留幾組?
//驗證學習成果能否提高Pattern辨識Rate
//Pattern在DB的子節點項目
//Pattern的上限?
//什麼情況加入Pattern TrainingData? (相似度 > Threshold)
//一組Pattern最多會存在幾組Training Data? (暫定30)

//GestureNum
//MotionCode
//RawCode
//Similarity