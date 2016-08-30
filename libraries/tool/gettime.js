/*
2016/08/17 從DONG_Calculate.js整理到tool(BigQ)
呼叫現在時間yyyy-mm-dd h:m:s 小工具
*/
exports._dateTimeNow = function(){

    // Time Log Test
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
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