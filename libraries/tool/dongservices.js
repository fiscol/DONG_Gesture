// 傳到DongSlide測試
exports._requestDongSlide = function (Rate, Code) {
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
// 傳到DongSlide Youtube切換
// Apicta 正昌DEMO使用
// exports._requestDongYoutube = function (Rate, Code) {
//   var request = require('request')

//   var postData = {
//     name: 'tony',
//     slider_control: 'play',
//     Rate: Rate,
//     ActionCode: Code
//   }

//   var url = 'https://dongslide.herokuapp.com/api/MotionTool/slider'
//   var options = {
//     method: 'post',
//     body: postData,
//     json: true,
//     url: url
//   }
//   request(options, function (err, res, body) {
//     if (err) {
//       return
//     }
//   })
// }
// 傳到DongMotion測試
exports._requestDongMotionSign = function (_LocalURL) {
  var request = require('request');
  var url = _LocalURL + "/api/mac_password";
  console.log("_requestDongMotionSign "+url);
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

// 傳到DongMotion測試
exports._requestDongMotionYoutubePlay = function (_LocalURL) {
  var request = require('request');
  var url = _LocalURL + "/api/youtube_play_pause";
  console.log("_requestDongMotionKnock "+url);
  var options = {
    method: 'get',
    url: url
  }
  request(options, function (err, res, body) {
    if (err) {
      return
    }
  })
  console.log('request Youtube');
}