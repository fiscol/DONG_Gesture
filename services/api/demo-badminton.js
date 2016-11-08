//觸發DongServices(DEMO CASE使用)
exports._TriggerDongServices = function (req, _UID, _MinderCode, _MinderResult, _MinderThreshold, _Localurl) {
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (_MinderResult.Rate >= _MinderThreshold) {
        // Send RealTimeData to View
        req.io.sockets.emit('RealTimeData', {
            MaxSpeed: (Math.floor((Math.random() * 10) + 1)) * 17,
            MaxPower: (Math.floor((Math.random() * 10) + 1)) * 37,
            Similarity: parseInt(_MinderResult.Rate * 100),
            GestureNum: (_MinderResult.ActionCode % 3),
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
            Name: _UID + " (Pass)",
            Rawdata: _MinderCode,
            Rate: _MinderResult.Rate,
            ActionCode: _MinderResult.ActionCode
        });
    } else {
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
    // if (_MinderResult.Rate >= _MinderThreshold) {
    var SignRate = _MinderResult.Rate;
    var ActionCode = _MinderResult.ActionCode;
    if (_UID == "70Hfhlb3P9VFEIeIozSqfoFy3eA2") {
        if (_MinderResult.ActionCode == 7 && _MinderResult.Rate >= 0.4) {
            DongServices._requestDongYoutube(SignRate, ActionCode);
        }
        else if (_MinderResult.ActionCode == 8 && _MinderResult.Rate > 0.4) {
            DongServices._requestDongSlide(SignRate, ActionCode);
        };
    }
    // else {
    //     DongServices._requestDongSlide(SignRate, ActionCode);
    // }

    console.log('_requestDongSlide Good')
    if (_UID != "70Hfhlb3P9VFEIeIozSqfoFy3eA2") {
        if (_MinderResult.ActionCode == 1 && _MinderResult.Rate >= 0.55) {
            console.log(_MinderResult.Rate);
            DongServices._requestDongMotionSign(_Localurl);
            console.log('Dong Services Sign.');
            // DongServices._requestDongMotionKnock(_Localurl);
            // console.log('Dong Services Knock.');
        } else if (_MinderResult.ActionCode == 2 && _MinderResult.Rate > 0.4) {
            // 2016/09/12 IOT Salon Demo Youtube Play
            console.log(_MinderResult.Rate);
            DongServices._requestDongMotionYoutubePlay(_Localurl);
            console.log('Dong Services YoutubePlay.');

        };
    }
    // };
}
