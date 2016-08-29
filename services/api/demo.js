//觸發DongServices(DEMO CASE使用)
exports._TriggerDongServices = function(req, _UID, _MinderCode, _MinderResult, _MinderThreshold){
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (_MinderResult.Rate >= _MinderThreshold) {
        // Send RealTimeData to View
        req.io.sockets.emit('RealTimeData', {
            MaxSpeed: (Math.floor((Math.random() * 10) + 1)) * 17,
            MaxPower: (Math.floor((Math.random() * 10) + 1)) * 37,
            Similarity: parseInt(_MinderResult.Rate * 100),
            GestureNum: (_MinderResult.ActionCode % 3) + 1
        });
    }
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才寫到介面Table
    if (_MinderResult.Rate >= _MinderThreshold) {
        // Send DBdata to View
        req.io.sockets.emit('DBData', {
            Name: _UID,
            Rawdata: _MinderCode,
            Rate: _MinderResult.Rate,
            ActionCode: _MinderResult.ActionCode
        });
    }

    // 過門檻值則觸發DONGSlide, DongMotion
    var DongServices = require('../../libraries/tool/dongservices.js');
    if (_MinderResult.Rate >= _MinderThreshold) {
        if (_MinderResult.ActionCode == 19) {
            DongServices._requestDongSlide();
            DongServices._requestDongMotion(localurl);
            console.log('Dong Services called.');
        };
    };
}