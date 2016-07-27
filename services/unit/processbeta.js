//var foundation = require("foundation");

//var motionQuenAcc = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
//var motionCodeAcc = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];

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

var motionState = false; //是否可執行動作的狀態
var listeningState = false; //是否可聆聽指令的狀態
var motionStateCount = 0; //計算Motion_State多久的參數
var listeningStateCount = 0; //計算Listening_State多久的參數

exports._accProcessing_beta = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    if(_Axis === "X"){
        this._xGAxis(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel);
    }
    if(_Axis === "Y"){
        this._yGAxis(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel);
    }
    if(_Axis === "Z"){
        this._zGAxis(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel);
    }
};

exports._xGAxis = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    this.motionQuenAccX.unshift(_InputMotionRawData);
    var RawDataDiff = this._rawDataDifference(this.motionQuenAccX[0], this.motionQuenAccX[1], _DifferenceModel);
    if(RawDataDiff > _Threshold){
        this.motionCodeAccX = this._unshiftWithLimit(1,  this.motionCodeAccX);
    }
    else if(RawDataDiff < (-1 * _Threshold)){
        this.motionCodeAccX = this._unshiftWithLimit(2,  this.motionCodeAccX);
    }
    else{
        this.motionCodeAccX = this._unshiftWithLimit(0,  this.motionCodeAccX);
    }
};

exports._yGAxis = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    this.motionQuenAccY.unshift(_InputMotionRawData);
    var RawDataDiff = this._rawDataDifference(this.motionQuenAccY[0], this.motionQuenAccY[1], _DifferenceModel);
    if(RawDataDiff > _Threshold){
        this.motionCodeAccY = this._unshiftWithLimit(1,  this.motionCodeAccY);
    }
    else if(RawDataDiff < (-1 * _Threshold)){
        this.motionCodeAccY = this._unshiftWithLimit(2,  this.motionCodeAccY);
    }
    else{
        this.motionCodeAccY = this._unshiftWithLimit(0,  this.motionCodeAccY);
    }
};

exports._zGAxis = function(_InputMotionRawData, _Threshold, _Axis, _DifferenceModel){
    this.motionQuenAccY.unshift(_InputMotionRawData);
    var RawDataDiff = this._rawDataDifference(this.motionQuenAccZ[0], this.motionQuenAccZ[1], _DifferenceModel);
    if(RawDataDiff > _Threshold){
        this.motionCodeAccZ = this._unshiftWithLimit(1,  this.motionCodeAccZ);
    }
    else if(RawDataDiff < (-1 * _Threshold)){
       this.motionCodeAccZ = this._unshiftWithLimit(2,  this.motionCodeAccZ);
    }
    else{
        this.motionCodeAccZ = this._unshiftWithLimit(0,  this.motionCodeAccZ);
    }
};

//unshift加入新元素到陣列第一個位置，從陣列移除最後一個元素
exports._unshiftWithLimit = function(_Input, _Array){
    _Array.unshift(_Input);
    _Array.pop();
    return _Array;
}

//測試API建構，原始資料後值減前值
exports._rawDataDifference = function(_AccRawData0, _AccRawData1, _DifferenceModel){
    var AccBool = 0;
    if(_DifferenceModel === 0){
        AccBool = _AccRawData1 - _AccRawData0; //加速度差分版本
    }
    if(_DifferenceModel === 1){
        AccBool = _AccRawData0; //加速度本質對應
    }
    return AccBool;
};

//計算合成向量編碼
exports._mixBinaryCodeComputing = function(_ForX, _ForY, _ForZ){
    var MixBinaryCode = 0;
    var X, Y, Z;
    _ForX = (_ForX === 0)? 1 : _ForX;
    _ForY = (_ForY === 0)? 1 : _ForY;
    _ForZ = (_ForZ === 0)? 1 : _ForZ;
    X = parseFloat((_ForX - 1) * Math.pow(2.0, 0.0));
    Y = parseFloat((_ForY - 1) * Math.pow(2.0, 1.0));
    Z = parseFloat((_ForZ - 1) * Math.pow(2.0, 1.0));

    MixBinaryCode = parseInt(X + Y + Z);
    return MixBinaryCode; //0~~7
};

//產生MixBinaryCodes[]
exports._mixBinaryCodesProcessing = function(_ForX, _ForY, _ForZ){
    var MixCode = this._mixBinaryCodeComputing(_ForX, _ForY, _ForZ);
    this.mixBinaryCodes.unshift(MixCode); //產生MixBinaryCodes[]
};

//去除MixBinaryCodes雜訊(delete 0)
exports._pureMixBinaryCodes = function(_MixBinaryCodes){
    var PureMixBinaryCodesArray = [];
    for(var i = 0; i < this.mixBinaryCodes.length; i++){
        if(this.mixBinaryCodes[i] != 0){ //&& this.mixBinaryCodes[i] != 1
            PureMixBinaryCodesArray.push(this.mixBinaryCodes[i]);
        }
    }
    return PureMixBinaryCodesArray;
};

//強制縮減PureMixBinaryCodes [將3碼一樣的縮減成1碼]
exports._shortMixBinaryCodes = function(_PureMixBinaryCodes){
    var ShortMixBinaryCodesArray = [];
    if(_PureMixBinaryCodes.length > 2){
        for(var i = 0; i < this._PureMixBinaryCodes.length - 2; i++){
            if(_PureMixBinaryCodes.length > 2){
                if(_PureMixBinaryCodes[i] === _PureMixBinaryCodes[i + 1] && _PureMixBinaryCodes[i + 1] === _PureMixBinaryCodes[i + 2]){
                    ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[i]);
                    var j = i + 2;
                    if(j === (_PureMixBinaryCodes.length - 3)){
                        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[j - 2]);
                        ShortMixBinaryCodesArray.push(_PureMixBinaryCodes[j - 1]);
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

//控制擷取的區塊閥門func
exports._listening_Controller = function(){
    if(this.hammingDistance[0] >= 5 && this.hammingDistance[1] >= 5 && this.hammingDistance[2] >= 5){
        this.listeningStateCount += 1;
        if(this.listeningStateCount >= 3){
            this.listeningState = true;
            this.motionState = false;
            this.listeningStateCount = 0;
        }
    }
    else{
        this.listeningState = false;
        this.motionState = true;
    }
};

//hamming distance XOR function (HDXOR_ver1)
exports._hammingDistanceXOR() = function(_Initial, _Against, _ForCode){
    this.hammingDistance[_ForCode] = (_Initial != _Against)? this.hammingDistance[_ForCode]: this.hammingDistance[_ForCode] += 1;
}