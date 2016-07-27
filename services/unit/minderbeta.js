//var foundation = require("foundation");

exports._dongMinderBata = {
    //FinalCode, PatternTypeNumPhone不確定來源
    'LCSRate': this._lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).Rate,
    'LCSActionCode': this._lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).ActionCode
};

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

        PatternStart = 18;
        PatternEnd = 20;
    }
    //=======================

    if (_Input.length >= 1) { //避免濾除過後出現空值
        for (var PatternCaseNum = PatternStart; Patten_Case_Num <= PatternEnd; PatternCaseNum++) {
            //LCSScore[PatternCaseNum] = parseFloat(lcsLength._lcsNumber(_Input, PatternCaseNum));
            LCSRate[PatternCaseNum] = LCSScore[Patten_Case_Num] / parseFloat(Math.max(_Input.length, PatternCaseNum));
        }
    }

    var Rate = Math.max.apply(null, LCSRate);
    var ActionCode = LCSRate.indexOf(Rate);

    return { 'Rate': Rate, 'ActionCode': ActionCode };
};

exports._lcsPatternChart = {};

exports._lcsPatternChartDev = {
    'mark': { //1.1>0.18
        'temp_case1': [4, 2, 4, 6, 3, 3, 1, 4, 4, 6, 3, 2, 2, 5, 3, 2, 4, 4, 2, 3, 2, 2, 1, 1, 4, 4, 3, 2, 4, 4, 3, 4, 6, 3, 3, 6, 6, 5, 3, 4, 3, 3, 3], //david
        'temp_case2': [2, 4, 3, 3, 7, 7, 4, 1, 2, 4, 4, 3, 2, 4, 4, 1, 3, 6, 4, 3, 3, 2, 2, 4, 4, 3, 3, 4, 4, 6, 3, 3, 1, 4, 3, 4, 3, 4, 4, 2, 2, 1], //mark
        'temp_case3': [4, 4, 5, 3, 2, 2, 3, 5, 4, 3, 7, 5, 4, 4, 2, 2, 4, 3, 7, 7, 6, 4, 4, 3, 4, 4, 6, 3, 2, 4, 5, 3, 2, 2, 4, 3, 1, 4, 7, 6, 3, 7, 7, 4, 3, 4, 4, 3] //BigQ
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
