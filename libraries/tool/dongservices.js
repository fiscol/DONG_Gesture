// 傳到DongSlide測試
exports._requestDongSlide = function (Rate, Code){
    var request = require('request')
    
    var postData = {
      name: 'mark',
      Rate: Rate,
      ActionCode: Code
    }

    var url = 'http://dongslide.herokuapp.com/api/MotionID'
    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: url
    }
    request(options, function (err, res, body) {
      if (err) {
        return
      }
    })
}

// 傳到DongMotion測試
exports._requestDongMotion = function (_LocalURL){
    var request = require('request');
    var url = _LocalURL + "/api/mac_password";
    console.log(url);
    var options = {
      method: 'get',
      url: url
    }
    request(options, function (err, res, body) {
      if (err) {
        return
      }
    })
    console.log('request');
}