//20160815 Ver.1 Fiscol
//Note : exports._processData補上清空mixBinaryCodes = [];

//var foundation = require("foundation");

//var motionQuenAcc = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
//var motionCodeAcc = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];

//低通率波設定
var kFilteringFactor = 0.1;
var accelX = 0.0;
var accelY = 0.0;
var accelZ = 0.0;
var motionRawData = [];

//ProcessBeta相關設定
var motionQuenAccX = [0.0, 0.0];
var motionCodeAccX = [0,0,0,0,0,0,0,0];

var motionQuenAccY = [0.0, 0.0];
var motionCodeAccY = [0,0,0,0,0,0,0,0];

var motionQuenAccZ = [0.0, 0.0];
var motionCodeAccZ = [0,0,0,0,0,0,0,0];

var motionCodeAccAll = [];
var mixBinaryCodes = [];
var catchMixBinaryCodes = [];
var onOffCount = 0;

var hammingDistance = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var finalCodeArr = [];

var motionState = false; //是否可執行動作的狀態
var listeningState = false; //是否可聆聽指令的狀態
var motionStateCount = 0; //計算Motion_State多久的參數
var listeningStateCount = 0; //計算Listening_State多久的參數

exports._processData = function(_RawCode, _Threshold){
    var AX = JSON.parse("[" + _RawCode["AX"] + "]")[0];
    var AY = JSON.parse("[" + _RawCode["AY"] + "]")[0];
    var AZ = JSON.parse("[" + _RawCode["AZ"] + "]")[0];
    for(var i = AX.length-1; i >= 0; i--){
        _motionRawDataInput(AX[i], AY[i], AZ[i], 1);
        _accProcessing_beta(motionRawData[0], _Threshold, "X", 1);
        _accProcessing_beta(motionRawData[1], _Threshold, "Y", 1);
        _accProcessing_beta(motionRawData[2], _Threshold, "Z", 1);
        _mixBinaryCodesProcessing(motionCodeAccX[0], motionCodeAccY[0], motionCodeAccZ[0]);
        catchMixBinaryCodes = mixBinaryCodes; //產生MixBinaryCodes[]
    }
    if(catchMixBinaryCodes != []){
        var FinalCode_before = _pureMixBinaryCodes(catchMixBinaryCodes); //去雜訊
        finalCodeArr = _shortMixBinaryCodes(FinalCode_before); //縮短
    }
    mixBinaryCodes = [];
    
    return {"mixBinaryCodes": finalCodeArr};
}


var _motionRawDataInput = function(_AccelerationX, _AccelerationY, _AccelerationZ, _Model){
    //Pre-Setup For Dong_engine
    motionRawData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    
    if (_Model == 0){
        //=====原本使用的input版本
        motionRawData[0] = _AccelerationX;
        motionRawData[1] = _AccelerationY;
        motionRawData[2] = _AccelerationZ;
    }
    
    if (_Model == 1){
        //=====低通濾波使用的input版本
        //計算重力值純量
        accelX = (_AccelerationX * kFilteringFactor) + (accelX * (1.0 - kFilteringFactor));
        accelY = (_AccelerationY * kFilteringFactor) + (accelY * (1.0 - kFilteringFactor));
        accelZ = (_AccelerationZ * kFilteringFactor) + (accelZ * (1.0 - kFilteringFactor));
        
        //計算加速度值純量
        motionRawData[0] = _AccelerationX-accelX;
        motionRawData[1] = _AccelerationY-accelY;
        motionRawData[2] = _AccelerationZ-accelZ;
    }
    
    if (_Model == 2){
        //並行，並且存在六種資料型態
        motionRawData[0] = _AccelerationX;
        motionRawData[1] = _AccelerationY;
        motionRawData[2] = _AccelerationZ;
        
        accelX = (_AccelerationX * kFilteringFactor) + (accelX * (1.0 - kFilteringFactor));
        accelY = (_AccelerationY * kFilteringFactor) + (accelY * (1.0 - kFilteringFactor));
        accelZ = (_AccelerationZ * kFilteringFactor) + (accelZ * (1.0 - kFilteringFactor));
        
        motionRawData[3] = _AccelerationX-accelX;
        motionRawData[4] = _AccelerationY-accelY;
        motionRawData[5] = _AccelerationZ-accelZ;
    }
}

var _accProcessing_beta = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    if(_Axis === "X"){
        _xGAxis(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel);
    }
    if(_Axis === "Y"){
        _yGAxis(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel);
    }
    if(_Axis === "Z"){
        _zGAxis(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel);
    }
};

var _xGAxis = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    motionQuenAccX.unshift(_InputMotionRawData);
    var RawDataDiff = _rawDataDifference(motionQuenAccX[0], motionQuenAccX[1], _DifferenceModel);
    if(RawDataDiff > _Threshold){
        motionCodeAccX = _unshiftWithLimit(1,  motionCodeAccX);
    }
    else if(RawDataDiff < (-1 * _Threshold)){
        motionCodeAccX = _unshiftWithLimit(2,  motionCodeAccX);
    }
    else{
        motionCodeAccX = _unshiftWithLimit(0,  motionCodeAccX);
    }
};

var _yGAxis = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    motionQuenAccY.unshift(_InputMotionRawData);
    var RawDataDiff = _rawDataDifference(motionQuenAccY[0], motionQuenAccY[1], _DifferenceModel);
    if(RawDataDiff > _Threshold){
        motionCodeAccY = _unshiftWithLimit(1,  motionCodeAccY);
    }
    else if(RawDataDiff < (-1 * _Threshold)){
        motionCodeAccY = _unshiftWithLimit(2,  motionCodeAccY);
    }
    else{
        motionCodeAccY = _unshiftWithLimit(0,  motionCodeAccY);
    }
};

var _zGAxis = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    motionQuenAccZ.unshift(_InputMotionRawData);
    var RawDataDiff = _rawDataDifference(motionQuenAccZ[0], motionQuenAccZ[1], _DifferenceModel);
    if(RawDataDiff > _Threshold){
        motionCodeAccZ = _unshiftWithLimit(1,  motionCodeAccZ);
    }
    else if(RawDataDiff < (-1 * _Threshold)){
        motionCodeAccZ = _unshiftWithLimit(2,  motionCodeAccZ);
    }
    else{
        motionCodeAccZ = _unshiftWithLimit(0,  motionCodeAccZ);
    }
};

//unshift加入新元素到陣列第一個位置，從陣列移除最後一個元素
var _unshiftWithLimit = function(_Input, _Array){
    _Array.unshift(_Input);
    _Array.pop();
    return _Array;
}

//測試API建構，原始資料後值減前值
var _rawDataDifference = function(_AccRawData0, _AccRawData1, _DifferenceModel){
    var AccBool = 0;
    if(_DifferenceModel === 0){
        AccBool = _AccRawData1 - _AccRawData0; //加速度差分版本
    }
    if(_DifferenceModel === 1){
        AccBool = _AccRawData0; //加速度本質對應
    }
    return AccBool;
};

//***
//計算合成向量編碼
var _mixBinaryCodeComputing = function(_ForX, _ForY, _ForZ){
    var MixBinaryCode = 0;
    var X, Y, Z;
    _ForX = (_ForX === 0)? 1 : _ForX;
    _ForY = (_ForY === 0)? 1 : _ForY;
    _ForZ = (_ForZ === 0)? 1 : _ForZ;
    X = parseFloat((_ForX - 1) * Math.pow(2.0, 0.0));
    Y = parseFloat((_ForY - 1) * Math.pow(2.0, 1.0));
    Z = parseFloat((_ForZ - 1) * Math.pow(2.0, 2.0));

    MixBinaryCode = parseInt(X + Y + Z);
    return MixBinaryCode; //0~~7
};

//***
//產生MixBinaryCodes[]
var _mixBinaryCodesProcessing = function(_ForX, _ForY, _ForZ){
    var MixCode = _mixBinaryCodeComputing(_ForX, _ForY, _ForZ);
    mixBinaryCodes.unshift(MixCode); //產生MixBinaryCodes[]
};

//***
//去除MixBinaryCodes雜訊(delete 0)
var _pureMixBinaryCodes = function(_MixBinaryCodes){
    var PureMixBinaryCodesArray = [];
    for(var i = 0; i < mixBinaryCodes.length; i++){
        if(mixBinaryCodes[i] != 0){ //&& this.mixBinaryCodes[i] != 1
            PureMixBinaryCodesArray.push(mixBinaryCodes[i]);
        }
    }
    return PureMixBinaryCodesArray;
};

//***
//強制縮減PureMixBinaryCodes [將3碼一樣的縮減成1碼]
var _shortMixBinaryCodes = function(_PureMixBinaryCodes){
    var ShortMixBinaryCodesArray = [];
    if(_PureMixBinaryCodes.length > 2){
        for(var i = 0; i < _PureMixBinaryCodes.length - 2; i++){
            if(_PureMixBinaryCodes.length > 2){
                if(_PureMixBinaryCodes[i] === _PureMixBinaryCodes[i + 1] && _PureMixBinaryCodes[i + 1] === _PureMixBinaryCodes[i + 2]){
                    //ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i]);
                    if(i + 2 === (_PureMixBinaryCodes.length - 3)){
                        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i]);
                        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i + 1]);
                    }
                }
                else{
                    ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i]);
                    if(i === (_PureMixBinaryCodes.length - 3)){
                        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i + 1]);
                        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i + 2]);
                    }
                }
            }
            else{
                ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i]);
                if(i === (_PureMixBinaryCodes.length - 3)){
                    ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i + 1]);
                    ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i + 2]);
                }
            }
        }
    }

    if(_PureMixBinaryCodes.length === 2){
        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[0]);
        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[1]);
    }
    if(_PureMixBinaryCodes.length === 1){
        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[0]);
    }
    if(_PureMixBinaryCodes.length === 0){
        ShortMixBinaryCodesArray.push(255);
    }

    return ShortMixBinaryCodesArray;
};

//***
//控制擷取的區塊閥門func
var _listening_Controller = function(){
    if(hammingDistance[0] >= 5 && hammingDistance[1] >= 5 && hammingDistance[2] >= 5){
        listeningStateCount += 1;
        if(listeningStateCount >= 3){
            listeningState = true;
            motionState = false;
            listeningStateCount = 0;
        }
    }
    else{
        listeningState = false;
        motionState = true;
    }
};

//***
//hamming distance XOR function (HDXOR_ver1)
exports._hammingDistanceXOR = function(_Initial, _Against, _ForCode){
    hammingDistance[_ForCode] = (_Initial != _Against)? hammingDistance[_ForCode]: hammingDistance[_ForCode] += 1;
}