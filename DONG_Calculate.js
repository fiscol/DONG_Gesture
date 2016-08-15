exports._getDateTimeNow = function(){
    return _getDateTimeNow();
}

var _getDateTimeNow = function(){
    // Time Log Test
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();


  if(dd<10) {
      dd='0'+dd
  } 
  
  if(mm<10) {
      mm='0'+mm
  }

  if(h<10) {
      h='0'+h
  }
  if(m<10) {
      m='0'+m
  } 
  if(s<10) {
      s='0'+s
  }     
  today = yyyy+'/'+mm+'/'+dd+" "+h+":"+m+":"+s;
  return today;
}

exports._postData = function(data){
  var RandomSpeed = (Math.floor((Math.random() * 10) + 1))*17;
  var RandomPower = (Math.floor((Math.random() * 10) + 1))*37;
  var RandomGestureNum = (Math.floor((Math.random() * 3) + 1)); 
  var DateTimeNow = _getDateTimeNow();

  data = {
      RawCode: data.ProcessCode.toString(),
      MotionCode: data.MotionCode,
      Time: DateTimeNow,
      MaxSpeed: RandomSpeed,
      MaxPower: RandomPower,
      Similarity: data.Similarity,
      GestureNum: RandomGestureNum,
    }
  return data;
}