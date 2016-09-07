//先記一些TIP
var db = require('../../libraries/firebase_db.js');
var minderBetaService = require('../unit/kernal/minderbeta.js');
//General

//Signature

//Add 3 Sample For Initial Pattern
//Return Added Sample Count, Message Succeeded or Failed
exports._AddNewSample = function (_UID, _PatternCount, _SampleCount, _SampleArr, _MinderData, _Threshold) {
    var AddResult = false;
    var ErrorMessage = "";
    //_SampleCount != 1  --->  Use Sample1 / Sample2 to Calculate Rate and TraceBack
    if (_SampleCount >= 1 && _SampleCount < 3) {
        var RefPath = "DONGCloud/PatternData/" + _UID;
        var ChildName = "Pattern" + _PatternCount;
        //Compare New Sample Pattern with Added Sample Pattern
        return db._onValuePromise(RefPath, ChildName).then(function (_Data) {
            var Similarity = minderBetaService._lcsComputing(_Data["Sample" + 1].MinderData, _MinderData).Rate;
            AddResult = (Similarity >= _Threshold) ? true : false;
            if (_SampleCount == 2 && AddResult == true) {
                Similarity = minderBetaService._lcsComputing(_Data["Sample" + 2].MinderData, _MinderData).Rate;
                AddResult = (Similarity >= _Threshold) ? true : false;
            }
            //Update SampleCount and Add New Sample Pattern
            if (AddResult == true) {
                //Update SampleCount
                var RefPath = "DONGCloud/DongService";
                var ChildName = _UID;
                _SampleArr[_SampleArr.length - 1] = (Number(_SampleCount) + 1);
                var Data = {
                    "SampleCount": _SampleArr.toString()
                }
                db._update(RefPath, ChildName, Data);
                //Add New Sample Pattern
                RefPath = "DONGCloud/PatternData/" + _UID + "/Pattern" + _PatternCount;
                ChildName = "Sample" + (Number(_SampleCount) + 1);
                Data = {
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
        });
    }
    else if (_SampleCount == 3) {
        //Update PatternCount and SampleCount
        var RefPath = "DONGCloud/DongService";
        var ChildName = _UID;
        _PatternCount++;
        _SampleArr.push(1);
        var Data = {
            "PatternCount": _PatternCount,
            "SampleCount": _SampleArr.toString()
        }
        db._update(RefPath, ChildName, Data);
        //Add New Sample Pattern
        RefPath = "DONGCloud/PatternData/" + _UID + "/Pattern" + _PatternCount;
        _SampleCount = 1;
        ChildName = "Sample" + _SampleCount;
        Data = {
            "MinderData": _MinderData,
            "AVGRate": 0,
            "StandardDeviation": 0,
            "PassTotal": 0,
            "TotalCount": 0,
            "Threshold": _Threshold
        }
        db._set(RefPath, ChildName, Data);
        return Promise.resolve({ "Message": "成功加入Pattern Sample。", "SampleCount": _SampleCount });
    }
    else {
        return Promise.resolve({ "Error": "加入Pattern Sample失敗。" });
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



//Check and Update Results
exports._CheckResults = function (_UID, _PatternCount, _SampleCount, _MinderData, _Threshold) {
    var RefPath = "DONGCloud/PatternData/" + _UID;
    var ChildName = "Pattern" + _PatternCount;
    return db._onValuePromise(RefPath, ChildName).then(function (_Data) {
        var RateArr = [];
        for (var i = 1; i <= _SampleCount; i++) {
            RateArr.push(minderBetaService._lcsComputing(_Data["Sample" + i].MinderData, _MinderData).Rate);
        }

        function isBigEnough(element, index, array) {
            return (element >= _Threshold);
        }
        var AllPass = RateArr.every(isBigEnough);
        var SomePass = RateArr.some(isBigEnough);

        if (AllPass || SomePass) {
            for (var i = 1; i <= RateArr.length; i++) {
                var Rate = RateArr[i - 1];
                var UpdateData = {};
                var HistoryRateArr = (_Data["Sample" + i].hasOwnProperty("RateArr")) ? _Data["Sample" + i].RateArr.split(',') : [];
                HistoryRateArr.push(Rate);
                UpdateData.RateArr = HistoryRateArr.toString();
                UpdateData.AVGRate = (_Data["Sample" + i].AVGRate * _Data["Sample" + i].TotalCount + Rate) / (_Data["Sample" + i].TotalCount + 1);
                UpdateData.PassTotal = (Rate >= _Data["Sample" + i].Threshold) ? _Data["Sample" + i].PassTotal + 1 : _Data["Sample" + i].PassTotal;
                UpdateData.TotalCount = _Data["Sample" + i].TotalCount + 1;
                UpdateData.StandardDeviation = _StandardDeviation(UpdateData.RateArr.split(','), UpdateData.AVGRate, UpdateData.TotalCount);

                var RefPath = "DONGCloud/PatternData/" + _UID + "/Pattern" + _PatternCount;

                var ChildName = "Sample" + i;
                db._update(RefPath, ChildName, UpdateData);

                if (Rate < _Data["Sample" + i].Threshold && (Rate >= UpdateData.AVGRate - UpdateData.StandardDeviation || Rate <= UpdateData.AVGRate + UpdateData.StandardDeviation)) {
                    db._GetTrainingCount(_UID, false).then(function (_TrainingCount) {
                        if (_TrainingCount != null) {
                            _CheckTrainingResults(_UID, _PatternCount, _TrainingCount, _MinderData, _Threshold);
                        }
                        else {
                            _AddTrainingData(_UID, _PatternCount, _TrainingCount, _MinderData, _Threshold);
                        }
                    })
                }
            }
        }

        //Pass
        if (AllPass == true) {
            return Promise.resolve({
                "Pattern": _PatternCount,
                "Message": "Pass",
                "Rate": "[" + RateArr + "]"
            });
        }
        //Failed at some sample (Check TrainingData)
        else if (SomePass == true) {
            return Promise.resolve({
                "Pattern": _PatternCount,
                "Message": "Fail",
                "Rate": "[" + RateArr + "]"
            });
        }
        //All Failed(Error)
        else {
            return Promise.resolve({
                "Pattern": _PatternCount,
                "Message": "Fail",
                "Rate": "[" + RateArr + "]"
            });
        }
    });
}

function _StandardDeviation(_RateArr, _AVG, _TotalCount) {
    var TotalDeviation = 0;
    for (var i = 0; i < _RateArr.length; i++) {
        TotalDeviation += Math.pow((Number(_RateArr[i]) - _AVG), 2);
    }
    var StandardDeviation = Math.sqrt((1 / _TotalCount * TotalDeviation));
    return StandardDeviation;
}

//Interval
//Rate < Threshold && Rate between AVGRate +- 1σ
function _AddTrainingData(_UID, _PatternCount, _TrainingCount, _MinderData, _Threshold) {
    var RefPath = "DONGCloud/DongService";
    var ChildName = _UID;
    var TrainingArr = (_TrainingCount == null) ? [] : _TrainingCount.split(',');
    if (_TrainingCount == null || TrainingArr.length < _PatternCount) {
        TrainingArr.push(1);
    }
    else {
        TrainingArr[_PatternCount - 1] = Number(TrainingArr[_PatternCount - 1]) + 1;
    }
    var Data = {
        "TrainingCount": TrainingArr.toString()
    };
    db._update(RefPath, ChildName, Data);

    var RefPath = "DONGCloud/PatternData/" + _UID + "/Pattern" + _PatternCount;
    var ChildName = "Training" + TrainingArr[_PatternCount - 1];
    var Data = {
        "MinderData": _MinderData,
        "AVGRate": 0,
        "StandardDeviation": 0,
        "PassTotal": 0,
        "TotalCount": 0,
        "Threshold": _Threshold
    }
    db._set(RefPath, ChildName, Data);
    //Training1
    //AVGRate = 0.61
    //PASS/Total = 9/13
    //Training2
    //AVGRate = 0.67
    //PASS/Total = 6/8
    //Sample3
    //AVGRate = 0.58
    //PASS/Total = 20/32
}

function _CheckTrainingResults(_UID, _PatternCount, _TrainingCount, _MinderData, _Threshold) {
    var RefPath = "DONGCloud/PatternData/" + _UID;
    var ChildName = "Pattern" + _PatternCount;
    return db._onValuePromise(RefPath, ChildName).then(function (_Data) {
        var RateArr = [];
        for (i = 1; i <= _TrainingCount; i++) {
            RateArr.push(minderBetaService._lcsComputing(_Data["Training" + i].MinderData, _MinderData).Rate);
        }
        var HasSameMinderData = false;
        for (var i = 1; i <= RateArr.length; i++) {
            var Rate = RateArr[i - 1];
            var UpdateData = {};
            var HistoryRateArr = (_Data["Training" + i].hasOwnProperty("RateArr")) ? _Data["Training" + i].RateArr.split(',') : [];
            HistoryRateArr.push(Rate);
            UpdateData.RateArr = HistoryRateArr.toString();
            UpdateData.AVGRate = (_Data["Training" + i].AVGRate * _Data["Training" + i].TotalCount + Rate) / (_Data["Training" + i].TotalCount + 1);
            UpdateData.PassTotal = (Rate >= _Data["Training" + i].Threshold) ? _Data["Training" + i].PassTotal + 1 : _Data["Training" + i].PassTotal;
            UpdateData.TotalCount = _Data["Training" + i].TotalCount + 1;
            UpdateData.StandardDeviation = _StandardDeviation(UpdateData.RateArr.split(','), UpdateData.AVGRate, UpdateData.TotalCount);

            var RefPath = "DONGCloud/PatternData/" + _UID + "/Pattern" + _PatternCount;

            var ChildName = "Training" + i;
            db._update(RefPath, ChildName, UpdateData);
            if (Rate == 1) {
                HasSameMinderData = true;
            }
        }
        if (HasSameMinderData == false) {
            _AddTrainingData(_UID, _PatternCount, _TrainingCount, _MinderData, _Threshold);

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