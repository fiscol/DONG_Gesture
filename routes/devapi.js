var express = require('express');
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');
var router = express.Router();

//驗證motionUrl片段
router.param("devcode", function (req, res, next, _DevCode) {
    //驗證通過
    if (_DevCode == "pvdplus") {
        next();
    }
    //驗證失敗
    else {
        res.json({ "Error": "傳入錯誤的URL，無法使用動作辨識功能。" });
    }
});

//LCS API
//pvdplus/LCS
router.post('/:devcode/LCS', function (req, res, next) {
    var MotionInput = req.body;
    if (MotionInput.input1 && MotionInput.input2) {
        res.json(minderBetaService._lcsComputing(JSON.parse(MotionInput.input1), JSON.parse(MotionInput.input2)));
    }
    else {
        res.json({ "Error": "請傳入input1與input2參數" });
    }
})

module.exports = router;