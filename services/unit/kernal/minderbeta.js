var lcsLength = require("./lcslength.js");
var Pattern = require('../../api/pattern.js');
var String = require("../../../libraries/tool/string.js");
var FinalCode = [];
var PatternTypeNumPhone = 1;
// exports._dongMinderBata = {
//     //FinalCode, PatternTypeNumPhone不確定來源
//     'LCSRate': _lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).Rate,
//     'LCSActionCode': _lcsRateComputing(FinalCode, 0.55, 1, PatternTypeNumPhone).ActionCode
// };

exports._lcsRateComputing = function (_UID, _Product, _Input, _Threshold, _PatternModel, _PatternType) {
    var PatternCase = new Array(30);
    var LCSScore = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var LCSRate = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var PatternStart = 0;
    var PatternEnd = 0;

    //=============Test Code=============
    if (_PatternModel === 1) {
        return Pattern._GetUserPatterns(_UID, _Product).then(function (_PatternData) {
            for (var i = 0; i < Object.keys(_PatternData).length; i++) {
                var Key = String._format("Pattern{0}", i + 1);
                PatternCase[i] = _PatternData[Key]["Data"].split(',').map(Number);
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
            var ActionCode = LCSRate.indexOf(Rate) + 1; //PatternStart = 0; While Pattern + Count Started from 1

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
