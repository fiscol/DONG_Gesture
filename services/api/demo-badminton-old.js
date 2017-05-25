//觸發DongServices(DEMO CASE使用)
exports._TriggerDongServices = function (req, _UID, _MinderCode, _MinderResult, _MinderThreshold, _Localurl) {
    if (_UID == "70Hfhlb3P9VFEIeIozSqfoFy3eA2" && _MinderResult.ActionCode > 3) {
        //160815 Fiscol DEMO用，監控頁面當Rate > 0.4時才觸發DashBoard動畫
        if (_MinderResult.Rate >= _MinderThreshold) {
            // Send RealTimeData to View
            req.io.sockets.emit('RealTimeData', {
                MaxSpeed: (Math.floor((Math.random() * 10) + 1)) * 17,
                MaxPower: (Math.floor((Math.random() * 10) + 1)) * 37,
                Similarity: parseInt(_MinderResult.Rate * 100),
                GestureNum: (_MinderResult.ActionCode),
                Successful: true,
                ActionCode: _MinderResult.ActionCode,
                UID: _UID
            });
        } else {
            req.io.sockets.emit('RealTimeData', {
                MaxSpeed: (Math.floor((Math.random() * 10) + 1)) * 17,
                MaxPower: (Math.floor((Math.random() * 10) + 1)) * 37,
                Similarity: parseInt(_MinderResult.Rate * 100),
                Successful: false,
                ActionCode: _MinderResult.ActionCode,
                UID: _UID
            });
        }
        //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才寫到介面Table
        if (_MinderResult.Rate >= _MinderThreshold) {
            // Send DBdata to View
            req.io.sockets.emit('DBData', {
                //Name: _UID + " (Pass)",
                Name: "Apicta (Pass)",
                Rawdata: _MinderCode,
                Rate: _MinderResult.Rate,
                ActionCode: _MinderResult.ActionCode
            });
        } else {
            // Send DBdata to View
            req.io.sockets.emit('DBData', {
                //Name: _UID,
                Name: "Apicta",
                Rawdata: _MinderCode,
                Rate: _MinderResult.Rate,
                ActionCode: _MinderResult.ActionCode
            });
        }
    }
    // 過門檻值則觸發DONGSlide, DongMotion
    var DongServices = require('../../libraries/tool/dongservices.js');
    // if (_MinderResult.Rate >= _MinderThreshold) {
    var SignRate = _MinderResult.Rate;
    var ActionCode = _MinderResult.ActionCode;
    //Apicta 正昌DEMO使用
    // if (_UID == "70Hfhlb3P9VFEIeIozSqfoFy3eA2") {
        if (_MinderResult.Rate >= 0.4) {
            console.log("pass(old)");
            DongServices._requestDongYoutube(SignRate, ActionCode);
        }
        // else if (_MinderResult.ActionCode == 2 && _MinderResult.Rate >= 0.4) {
        //     DongServices._requestDongSlide(SignRate, ActionCode, _UID);
        // };
    // }
    // else {
    //     DongServices._requestDongSlide(SignRate, ActionCode);
    // }
    console.log('_requestDongSlide Good')
    // if (_UID != "70Hfhlb3P9VFEIeIozSqfoFy3eA2") {
    // if (_MinderResult.ActionCode == 1 && _MinderResult.Rate >= 0.55) {
    //     console.log(_MinderResult.Rate);
    //     DongServices._requestDongMotionSign(_Localurl);
    //     console.log('Dong Services Sign.');
    //     // DongServices._requestDongMotionKnock(_Localurl);
    //     // console.log('Dong Services Knock.');
    // } else if (_MinderResult.ActionCode == 2 && _MinderResult.Rate > 0.4) {
    //     // 2016/09/12 IOT Salon Demo Youtube Play
    //     console.log(_MinderResult.Rate);
    //     DongServices._requestDongMotionYoutubePlay(_Localurl);
    //     console.log('Dong Services YoutubePlay.');

    // };
    // }
    // };
    //暫存最原始的三組簽名Data(Mark,BigQ,David)
    //4,2,4,6,3,3,1,4,4,6,3,2,2,5,3,2,4,4,2,3,2,2,1,1,4,4,3,2,4,4,3,4,6,3,3,6,6,5,3,4,3,3,3
    //2,4,3,3,7,7,4,1,2,4,4,3,2,4,4,1,3,6,4,3,3,2,2,4,4,3,3,4,4,6,3,3,1,4,3,4,3,4,4,2,2,1
    //4,4,5,3,2,2,3,5,4,3,7,5,4,4,2,2,4,3,7,7,6,4,4,3,4,4,6,3,2,4,5,3,2,2,4,3,1,4,7,6,3,7,7,4,3,4,4,3
}
