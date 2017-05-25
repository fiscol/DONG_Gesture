var express = require('express');
var router = express.Router();
var fs = require('fs');
// var dataFileBuffer = fs.readFileSync('../train-images-idx3-ubyte');
// var labelFileBuffer = fs.readFileSync('../train-labels-idx1-ubyte');
// var dataBuffer1 = fs.readFileSync('/users/fiscol/selfie/pixelFile');
// var dataBuffer2 = fs.readFileSync('/users/fiscol/videos/1428842742901809844_311362416/pixelFile');
// var trainPixelBuffer = fs.readFileSync('/users/fiscol/videos/train/trainbuffer');
// var testPixelBuffer = fs.readFileSync('/users/fiscol/videos/test/testbuffer');
// var trainLabelArrayLength = fs.readFileSync('/users/fiscol/videos/IMG_1704/trainlabel.txt').toString().split("\n").length;
// var testLabelArrayLength = fs.readFileSync('/users/fiscol/videos/test/testlabel.txt').toString().split("\n").length;
// const path = "VID_20170117_133559";
// var testLength1 = fs.readFileSync('/users/fiscol/videos/' + path + '/testbuffer');
// var testLength2 = fs.readFileSync('/users/fiscol/videos/' + path + '/testlabel.txt').toString().split("\n").length;
// var trainLength1 = fs.readFileSync('/users/fiscol/videos/' + path + '/trainbuffer');
// var trainLength2 = fs.readFileSync('/users/fiscol/videos/' + path + '/trainlabel.txt').toString().split("\n").length;
// var allLength1 = fs.readFileSync('/users/fiscol/videos/' + path + '/pixelFile');
// var allLength2 = fs.readFileSync('/users/fiscol/videos/' + path + '/label.txt').toString().split("\n").length;
// var allLength3 = fs.readFileSync('/users/fiscol/selfie/pixelFile');
// var testLength3 = fs.readFileSync('/users/fiscol/selfie/testbuffer');
// var trainLength3 = fs.readFileSync('/users/fiscol/selfie/trainbuffer');
// var testlabel = fs.readFileSync('/users/fiscol/videos/test/testlabel.txt').toString().split("\n").length;
// var testbuffer = fs.readFileSync('/users/fiscol/videos/test/testbuffer');
// var testbin = fs.readFileSync('/users/fiscol/videos/test/testdata.bin');

var length1 = fs.readFileSync('/users/fiscol/Downloads/1.jpg');

var length2 = fs.readFileSync('/users/fiscol//Downloads/2.jpg');

var pixelValues = [];

// It would be nice with a checker instead of a hard coded 60000 limit here
// console.log(dataFileBuffer);
// for (var image = 0; image <= 0; image++) {
//     var pixels = [];

//     for (var y = 0; y <= 27; y++) {
//         for (var x = 0; x <= 27; x++) {
//             var index = (image * 28 * 28) + (x + (y * 28)) + 16;
//             var pixel = dataFileBuffer[index];
//             pixels.push(pixel);
//             if(pixel != 0){
//                 console.log(index + ":" + pixel);
//             }
//         }
//     }

//     var imageData = {};
//     imageData[JSON.stringify(labelFileBuffer[image + 8])] = pixels;

//     pixelValues.push(imageData);

// }
// console.log(dataBuffer1[46400] + " " + dataBuffer1[46401] + " " + dataBuffer1[46402]);
// console.log(dataBuffer2[4802] + " " + dataBuffer2[4805] + " " + dataBuffer2[4808]);
// console.log(trainPixelBuffer.byteLength);
// console.log(trainLabelArrayLength);
// console.log(testPixelBuffer.byteLength/4800);
// console.log(trainLabelArrayLength);
// console.log(testLabelArrayLength);
// console.log(dataBuffer[0]);

// console.log(testLength1.byteLength/4800);
// console.log(testLength2);
// console.log(trainLength1.byteLength/4800);
// console.log(trainLength2);
// console.log(allLength1.byteLength/4800);
// console.log(allLength2);
// console.log(allLength3.byteLength/4800);
// console.log(testLength3.byteLength/4800);
// console.log(trainLength3.byteLength/4800);
// console.log(testlabel);
// console.log(testbuffer.byteLength/4800);
// console.log(testbin.byteLength/4801);

console.log(length1.byteLength)
console.log(length2.byteLength)

// for (var image = 0; image <= 100; image++) {
//     var pixels = [];

//     var index = (image * 32 * 32 * 3) + image;
//     var pixel = dataBuffer[index];
//     pixels.push(pixel);

//     console.log(index + ":" + pixel);


//     // var imageData = {};
//     // imageData[JSON.stringify(labelFileBuffer[image + 8])] = pixels;

//     // pixelValues.push(imageData);

// }
module.exports = router;