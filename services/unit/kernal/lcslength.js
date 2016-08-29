//計算LCSLength

//此_lcsNumber只能算數列，會回傳LCSLength分數(score)
//如下可以呼叫出不同的回傳值
//ex
//_lcsNumber(x, y)
exports._lcsNumber = function (_X, _Y) {
    //: a two dimensional array [0...y.count][0...x.count] of Int
    var Score = [], Row = [];
    for (var i = 0; i <= _X.length; i++) {
        Row.push(0);
    }
    for (var j = 0; j <= _Y.length; j++) {
        Score.push(Row.slice());
    }

    for (var i = 1; i <= _Y.length; i++) {
        for (var j = 1; j <= _X.length; j++) {
            if (_X[j - 1] === _Y[i - 1]) {
                Score[i][j] = Score[i - 1][j - 1] + 1;
            }
            else {
                var U = Score[i - 1][j];
                var L = Score[i][j - 1];

                Score[i][j] = (U > L) ? U : L;
            }
        }
    }
    return Score[_Y.length][_X.length];
};

//_lcsNumberFor2只能算數列，會回傳LCSLength分數(score)跟對應匹配到的數列(traceback)
//如下可以呼叫出不同的回傳值
//ex
//_lcsNumberFor2(x, y).score
//_lcsNumberFor2(x, y).traceback

exports._lcsNumberFor2 = function (_X, _Y) {
    //: a two dimensional array [0...y.count][0...x.count] of Int
    var Score = [], Row = [];
    for (var i = 0; i <= _X.length; i++) {
        Row.push(0);
    }
    for (var j = 0; j <= _Y.length; j++) {
        Score.push(Row.slice());
    }

    //Score
    for (var i = 1; i <= _Y.length; i++) {
        for (var j = 1; j <= _X.length; j++) {
            if (_X[j - 1] === _Y[i - 1]) {
                Score[i][j] = Score[i - 1][j - 1] + 1;
            }
            else {
                var U = Score[i - 1][j];
                var L = Score[i][j - 1];

                Score[i][j] = (U > L) ? U : L;
            }
        }
    }

    //TraceBack
    function _traceBack(_A, _B) {
        if (_A === 0 || _B === 0) {
            return [[]];
        }
        var I = _A - 1;
        var J = _B - 1;
        if (_X[I] === _Y[J]) {
            return _traceBack(I, J) + [_X[I]];//重要，這邊要問Mark
        }

        var Result = [[]];
        if (Score[_B][I] >= Score[J][_A]) {
            Result += _traceBack(I, _B);
        }
        if (Score[J][_A] > Score[_B][I]) {
            Result += _traceBack(_A, J);
        }
        return Result;
    }
    return { 'TraceBack': _traceBack(_X.length, _Y.length), 'Score': Score[_Y.length][_X.length] };
};

//此LCS_string能算字串，會回傳LCSLength分數(scroe)跟對應匹配到的數列(traceback)
//ex
//print(_lcsString("AGCAT", "GAC")) --->  "["AC", "GA", "GC"]"

exports._lcsString = function (_X, _Y) {
    function _lcsTraceBackString() {
        //: a two dimensional array [0...y.count][0...x.count] of Int
        var Score = [], Row = [];
        for (var i = 0; i <= _X.length; i++) {
            Row.push(0);
        }
        for (var j = 0; j <= _Y.length; j++) {
            Score.push(Row.slice());
        }

        //Score
        for (var i = 1; i <= _Y.length; i++) {
            for (var j = 1; j <= _X.length; j++) {
                if (_X[j - 1] === _Y[i - 1]) {
                    Score[i][j] = Score[i - 1][j - 1] + 1;
                }
                else {
                    var U = Score[i - 1][j];
                    var L = Score[i][j - 1];

                    Score[i][j] = (U > L) ? U : L;
                }
            }
        }
        function _traceBackString(_A, _B) {
            if (_A === 0 || _B === 0) {
                return [[]];
            }
            var I = _A - 1;
            var J = _B - 1;
            if (_X[I] === _Y[J]) {
                return _traceBackString(I, J) + [_X[I]];//重要，這邊要問Mark
            }

            var Result = [[]];
            if (Score[_B][I] >= Score[J][_A]) {
                Result += _traceBackString(I, _B);
            }
            if (Score[J][_A] > Score[_B][I]) {
                Result += _traceBackString(_A, J);
            }
            return Result;
        }
        return _traceBackString(_X.length, _Y.length);
    }
    var LCS = _lcsTraceBackString();

    //: Turn the arrays back into strings and unique them
    var Result = [];
    for (var i = 0; i < LCS.length; i++) {
        if (Result.length == 0 || Result.length != i + 1) {
            Result.push(LCS[i]);
        }
    }
    return Result;
};