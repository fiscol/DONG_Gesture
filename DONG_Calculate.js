exports._getDateTimeNow = function(){
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
  var RandomSimilarity = (Math.floor((Math.random() * 10) + 1))*10;
  var RandomGestureNum = (Math.floor((Math.random() * 3) + 1));
  
  var DateTimeNow = _getDateTimeNow();

  data = {
      User: data.User,
      RawCode: data.RawCode,
      MotionCode: "[0]",
      Time: DateTimeNow,
      MaxSpeed: RandomSpeed,
      MaxPower: RandomPower,
      Similarity: RandomSimilarity,
      GestureNum: RandomGestureNum,
    }



  return data
}