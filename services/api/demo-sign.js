//觸發DongServices(DEMO CASE使用)
exports._TriggerDongServicesDemoSign = function(req, ){

    // 過門檻值則觸發DONGSlide, DongMotion
    var DongServices = require('../../libraries/tool/dongservices.js');
    // if (_MinderResult.Rate >= _MinderThreshold) {
        // for DEMO-sign Threshold = 0.1
        if (_MinderResult.Rate >= 0.1) {
        var SignRate = _MinderResult.Rate;
        var ActionCode = _MinderResult.ActionCode;
        DongServices._requestDongSlide(SignRate, ActionCode);
        if (_MinderResult.ActionCode == 1) {
            console.log(_Localurl);
            DongServices._requestDongMotion(_Localurl);
            console.log('Dong Services called.');
        };
    };
}