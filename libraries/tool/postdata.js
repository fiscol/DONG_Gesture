/*
2016/08/17 從DONG_Calculate.js整理到tool(BigQ)
*/

exports._postData = function(data){
  var RandomSpeed = (Math.floor((Math.random() * 10) + 1))*17;
  var RandomPower = (Math.floor((Math.random() * 10) + 1))*37;
  var RandomGestureNum = (Math.floor((Math.random() * 3) + 1)); 
  var GetTime = require('./gettime.js');
  var DateTimeNow = GetTime._dateTimeNow();

  data = {
      RawCode: data.ProcessCode.toString(),
      MotionCode: data.MotionCode,
      Time: DateTimeNow,
      MaxSpeed: RandomSpeed,
      MaxPower: RandomPower,
      Similarity: data.Similarity,
      GestureNum: RandomGestureNum,
    }

  return data
}