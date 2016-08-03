/*
minderbeta API 測試
*/

var express = require('express');
var router = express.Router();
var minderBetaService = require('../services/unit/minderbeta.js');

router.post('/minder', function (req, res) {
    var RawCode = req.body;
    var MinderResult = minderBetaService._lcsRateComputing(
RawCode.Data, 0.55, 1, 1);
    res.json(MinderResult);
});

module.exports = router;