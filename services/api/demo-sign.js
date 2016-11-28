//觸發DongServices(DEMO CASE使用)
exports._TriggerDongServicesDemoSign = function(req, _MinderResult){

    // 過門檻值則觸發DONGSlide, DongMotion
    var DongServices = require('../../libraries/tool/dongservices.js');
    // if (_MinderResult.Rate >= _MinderThreshold) {
        // for DEMO-sign Threshold = 0.1
        if (_MinderResult.Rate >= 0.5) {
        var SignRate = _MinderResult.Rate;
        var ActionCode = _MinderResult.ActionCode;
        DongServices._requestDongSlide(SignRate, ActionCode, req.body.UID);
        
    };
}




