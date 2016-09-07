exports._TriggerBoxing = function (req, _MinderCode, _MinderResult, _MinderThreshold) {
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (_MinderResult.Rate >= _MinderThreshold) {
        // Send RealTimeData to View
        var punch = (_MinderResult.ActionCode == 1) ? "heavy" : "normal";
        req.io.sockets.emit('boxing', { punch: punch });
    }
}