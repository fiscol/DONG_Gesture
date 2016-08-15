/*
minderbeta API 測試
*/

var express = require('express');
var router = express.Router();
var minderBetaService = require('../services/unit/kernal/minderbeta.js');
var processBetaService = require('../services/unit/kernal/processbeta.js');

router.post('/minder', function (req, res) {
    var RawCode = req.body;
    var MinderResult = minderBetaService._lcsRateComputing(
RawCode.Data, 0.55, 1, 1);
    res.json(MinderResult);
});

/* 
processbeta API 測試
*/
router.post('/process', function(req, res){
    var RawCode = req.body;
    var Threshold = 0.18;

    var ProcessedCode = processBetaService._processData(RawCode, Threshold);
    var MinderResult = minderBetaService._lcsRateComputing(
ProcessedCode.mixBinaryCodes, 0.55, 1, 1);
    res.json(MinderResult);
})

module.exports = router;