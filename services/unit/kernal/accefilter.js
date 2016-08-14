//低通率波設定
var kFilteringFactor = 0.1;
var accelX = 0.0;
var accelY = 0.0;
var accelZ = 0.0;
var motionRawData = [];

exports._motionRawDataInput = function(_AccelerationX, _AccelerationY, _AccelerationZ, _Model){
    //Pre-Setup For Dong_engine
    motionRawData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    
    if (model == 0){
        //=====原本使用的input版本
        motionRawData[0] = _AccelerationX;
        motionRawData[1] = _AccelerationY;
        motionRawData[2] = _AccelerationZ;
    }
    
    if (model == 1){
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
    
    if (model == 2){
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