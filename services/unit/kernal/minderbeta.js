var lcsLength = require("./lcslength.js");

var FinalCode = [];
var PatternTypeNumPhone = 1;
// exports._dongMinderBata = {
//     //FinalCode, PatternTypeNumPhone不確定來源
//     'LCSRate': _lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).Rate,
//     'LCSActionCode': _lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).ActionCode
// };

exports._lcsRateComputing = function (_Input, _Threshold, _PatternModel, _PatternType) {
    var PatternCase = new Array(30);
    var LCSScore = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var LCSRate = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var PatternStart = 0;
    var PatternEnd = 0;

    //=============Test Code=============
    if (_PatternModel === 1) {
        var Pattern4 = _lcsPatternChartDev.mark;

        PatternCase[18] = Pattern4.temp_case1;
        PatternCase[19] = Pattern4.temp_case2;
        PatternCase[20] = Pattern4.temp_case3;
        PatternCase[21] = Pattern4.badminton_case1;
        PatternCase[22] = Pattern4.badminton_case2;
        PatternCase[23] = Pattern4.badminton_case3;

        PatternStart = 18;
        PatternEnd = 23;
    }
    //=======================

    if (_Input.length >= 1) { //避免濾除過後出現空值
        for (var PatternCaseNum = PatternStart; PatternCaseNum <= PatternEnd; PatternCaseNum++) {
            LCSScore[PatternCaseNum] = parseFloat(lcsLength._lcsNumberFor2(_Input, PatternCase[PatternCaseNum]).Score);
            LCSRate[PatternCaseNum] = LCSScore[PatternCaseNum] / parseFloat(Math.max(_Input.length, PatternCase[PatternCaseNum].length));
        }
    }

    var Rate = Math.max.apply(null, LCSRate);
    var ActionCode = LCSRate.indexOf(Rate);

    return { 'Rate': Rate, 'ActionCode': ActionCode };
};

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
