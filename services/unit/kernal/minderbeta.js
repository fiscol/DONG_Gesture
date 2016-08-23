var lcsLength = require("./lcslength.js");
var db = require('../../../libraries/firebase_db.js');
var String = require("../../../libraries/tool/string.js");
var FinalCode = [];
var PatternTypeNumPhone = 1;
// exports._dongMinderBata = {
//     //FinalCode, PatternTypeNumPhone不確定來源
//     'LCSRate': _lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).Rate,
//     'LCSActionCode': _lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).ActionCode
// };

//Pattern的上限?
//什麼情況加入Pattern TraingData? (相似度 > Threshold && Rank withing Top 30)
//一組Pattern最多會存在幾組Training Data? (暫定30)

//GestureNum
//MotionCode
//RawCode
//Similarity
exports._lcsRateComputing = function (_Input, _Threshold, _PatternModel, _PatternType) {
    var PatternCase = new Array(30);
    var LCSScore = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var LCSRate = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var PatternStart = 0;
    var PatternEnd = 0;

    //=============Test Code=============
    if (_PatternModel === 1) {
        return db._GetUserPatterns("70Hfhlb3P9VFEIeIozSqfoFy3eA2").then(function (_PatternData) {
            for(var i = 0; i < Object.keys(_PatternData).length; i++){
                var Key = String._format("Pattern{0}", i + 1);
                PatternCase[i] = _PatternData[Key].split(',').map(Number);
            }
            PatternStart = 0;
            PatternEnd = Object.keys(_PatternData).length - 1;

            if (_Input.length >= 1) { //避免濾除過後出現空值
                for (var PatternCaseNum = PatternStart; PatternCaseNum <= PatternEnd; PatternCaseNum++) {
                    LCSScore[PatternCaseNum] = parseFloat(lcsLength._lcsNumberFor2(_Input, PatternCase[PatternCaseNum]).Score);
                    LCSRate[PatternCaseNum] = LCSScore[PatternCaseNum] / parseFloat(Math.max(_Input.length, PatternCase[PatternCaseNum].length));
                }
            }
            var Rate = Math.max.apply(null, LCSRate);
            var ActionCode = LCSRate.indexOf(Rate);

            return { 'Rate': Rate, 'ActionCode': ActionCode };
        }).catch(function (err) {
            return ({ "Error": "運算Rate出現錯誤" });
        })
    }
};

exports._lcsComputing = function (_Input1, _Input2) {
    var LCSResult = lcsLength._lcsNumberFor2(_Input1, _Input2);
    var LCSScore = parseFloat(LCSResult.Score);
    var TraceBack = String._format("[{0}]", LCSResult.TraceBack.split('').toString());
    var LCSRate = LCSScore / parseFloat(Math.max(_Input1.length, _Input2.length));

    return { 'Rate': LCSRate, 'TraceBack': TraceBack }
}


var _lcsPatternChart = {};

var _lcsPatternChartDev = {
    'mark': { //1.1>0.18
        'temp_case1': [4, 2, 4, 6, 3, 3, 1, 4, 4, 6, 3, 2, 2, 5, 3, 2, 4, 4, 2, 3, 2, 2, 1, 1, 4, 4, 3, 2, 4, 4, 3, 4, 6, 3, 3, 6, 6, 5, 3, 4, 3, 3, 3], //david
        'temp_case2': [2, 4, 3, 3, 7, 7, 4, 1, 2, 4, 4, 3, 2, 4, 4, 1, 3, 6, 4, 3, 3, 2, 2, 4, 4, 3, 3, 4, 4, 6, 3, 3, 1, 4, 3, 4, 3, 4, 4, 2, 2, 1], //mark
        'temp_case3': [4, 4, 5, 3, 2, 2, 3, 5, 4, 3, 7, 5, 4, 4, 2, 2, 4, 3, 7, 7, 6, 4, 4, 3, 4, 4, 6, 3, 2, 4, 5, 3, 2, 2, 4, 3, 1, 4, 7, 6, 3, 7, 7, 4, 3, 4, 4, 3], //BigQ
        'badminton_case1': [2, 4, 6, 6, 5, 7, 5, 7, 1, 1, 1, 1, 1, 3, 3, 2], //右手由上往下揮拍
        'badminton_case2': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 4, 6, 6, 7, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //右手由下往上揮拍
        'badminton_case3': [2, 2, 4, 3, 3, 4] //右手由左下往上揮拍(反拍)
    },
    'Word': {
        'temp_case1': [2, 2, 2, 6, 6, 4, 2], //r
        'temp_case2': [2, 2, 6, 4, 2, 3, 2], //r
        'temp_case3': [2, 2, 4, 4, 2, 2, 4, 4, 2], //g
        'temp_case4': [2, 2, 6, 4, 4, 2, 4, 6, 2], //g
        'temp_case5': [2, 4, 4, 2, 2, 4, 4, 2, 2], //b
        'temp_case6': [2, 4, 4, 2, 2, 4, 4, 2, 2, 2, 2], //b
        'temp_case7': [4, 4, 2, 4, 2, 2, 4, 4, 2, 2], //y
        'temp_case8': [4, 2, 5, 7, 6, 6, 4, 2, 2, 4, 2, 6, 2] //y  
    }
};
