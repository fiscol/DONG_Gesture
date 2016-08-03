var express = require('express');
var router = express.Router();
var minderBetaService = require('../services/unit/minderbeta.js');

router.get('/minder', function (req, res) {
    var MinderResult = minderBetaService._lcsRateComputing(
[4, 5, 3, 3, 7, 5, 4, 4, 6, 1, 2, 2, 3, 2, 4, 4, 3, 3, 4, 4, 5, 2, 3, 1, 4, 4, 2, 3, 1, 4, 4, 2, 3, 3, 4, 4, 2, 3, 4, 6, 2], 0.55, 1, 1);
    res.json(MinderResult);
});

module.exports = router;