// Firebase realtime database
require('es6-promise');
// init
var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./libraries/DONG-TEST-e4e5735fa7bb.json",
    databaseURL: "https://dong-test-8ac54.firebaseio.com",
    databaseAuthVariableOverride: {
        uid: "BigQ"
    }
});
/*
	.Write
*/
var count = 0;

// set
exports._set = function (_Path, _ChildName, _Value, error) {
    var db = firebase.database();
    var ref = db.ref(_Path);
    // childname = childname + count;
    ref.child(_ChildName).set(_Value);
    console.log('ref.set ' + _Value)
    if (error) {
        console.log("Data could not be saved." + error);
    } else {
        console.log("Data saved successfully.");
    }
    // count++;
};

// update
// Error: Firebase.update failed: First argument  must be an object containing the children to replace.
exports._update = function (_Path, _ChildName, _Value, error) {
    var db = firebase.database();
    var ref = db.ref(_Path);
    ref.child(_ChildName).update(_Value);
    console.log('ref.update ' + _Value)
    if (error) {
        console.log("Data could not be updated." + error);
    } else {
        console.log("Data updated successfully.");
    }
};

// push
exports._push = function (_Path, _ChildName, _Value, error) {
    var db = firebase.database();
    var ref = db.ref(_Path);
    ref.child(_ChildName).push(_Value);
    console.log('ref.push ' + _Value);
    if (error) {
        console.log("Data could not be pushed." + error);
    } else {
        console.log("Data pushed successfully." + ref.child(childname).push(value).key);
    }
};


// transaction
// exports._transaction = function(childname, path, value, error){
// 	var db = firebase.database();
// 	var ref = db.ref(path);
// 	ref.child(childname).push(value);
// 	console.log('ref.push '+ value);
// 	if (error) {
//       console.log("Data could not be pushed." + error);
//   	} else {
//   	  console.log("Data pushed successfully.");
//   	}
// };


// wilmaRef.transaction(function(currentData) {
//   if (currentData === null) {
//     return { name: { first: 'Wilma', last: 'Flintstone' } };
//   } else {
//     console.log('User wilma already exists.');
//     return; // Abort the transaction.
//   }
// }, function(error, committed, snapshot) {
//   if (error) {
//     console.log('Transaction failed abnormally!', error);
//   } else if (!committed) {
//     console.log('We aborted the transaction (because wilma already exists).');
//   } else {
//     console.log('User wilma added!');
//   }
//   console.log("Wilma's data: ", snapshot.val());
// });



/*
	.Read
*/
// Read database
exports._onValue = function (_Path, _ChildName, _Callback) {
    var db = firebase.database();
    var ref = db.ref(_Path);
    ref.child(_ChildName).on("value", function (snapshot) {
        var onValueResult = snapshot.val();
        console.log(onValueResult);
        // 回傳onValueResult給api.js
        _Callback && _Callback(onValueResult);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
};

// Read database with Promise
exports._onValuePromise = function (_Path, _ChildName) {
    var db = firebase.database();
    var ref = db.ref(_Path);
    return ref.child(_ChildName).once("value").then(function (snapshot) {
        return snapshot.val();
    }, function (error) {
        return error;
    })
};

// exports._onChildAdded =  function(path){
// 	var db = firebase.database();
// 	var ref = db.ref(path);
// 	// Retrieve new posts as they are added to our database
// 	ref.on("child_added", function(snapshot) {
//   		// console.log("newChild: " + snapshot.val());
//   		console.log("PrePost: " + snapshot.val());
// 	});
// };

// exports._onChildChanged =  function(path){
// 	var db = firebase.database();
// 	var ref = db.ref(path);
// 	// Get the data on a post that has changed
// 	ref.on("child_changed", function(snapshot) {
// 	  var changedPost = snapshot.val();
// 	  console.log("The updated post title is " + changedPost.title);
// 	});
// };

//使用者登入
exports._logIn = function (_Token) {
    return firebase.auth().verifyIdToken(_Token).then(function (_UserData) {
        return _UserData;
        // ...
    }).catch(function (error) {
        return error;
        // Handle error
    });
}

/*
取得目前Request總數
*/
exports._GetRequestCount = function (_UID, _IsTrial) {
    // DB Table
    var RefPath = (_IsTrial == true) ? "DONGCloud/DongService/Trial/" : "DONGCloud/DongService/";
    RefPath += _UID
    // UserID
    var ChildName = "RequestCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }

}

/*
確認使用者是否為付費會員
*/
exports._CheckUserType = function (_UID) {
    // DB Table
    var RefPath = "DONGCloud/DongService";
    // UserID
    var ChildName = _UID;
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.reject(new Error("未傳入使用者ID"));
    }

}
/*
儲存MotionData到DB
*/
exports._SaveMotion = function (_UID, _DataResult, _RequestCount) {
    // DB Path
    var RefPath = "DONGCloud/MotionData/" + _UID;
    // Child Name
    _RequestCount++;
    var ChildName = "Data" + _RequestCount;
    // 存到DB
    this._set(RefPath, ChildName, _DataResult);
}

/*
更新Request總數到DB
*/
exports._AddRequestCount = function (_UID, _IsTrial, _RequestCount) {
    var Calculator = require('../libraries/tool/gettime.js');
    // DB Path
    var RefPath = (_IsTrial == true) ? "DONGCloud/DongService/Trial" : "DONGCloud/DongService";
    // Child Name
    var ChildName = _UID;
    var Data = {
        "RequestCount": _RequestCount + 1,
        "LastExecDate": Calculator._dateTimeNow()
    };
    // 存到DB
    this._update(RefPath, ChildName, Data);
}

/*
取得Pattern總數
*/
exports._GetPatternCount = function (_UID, _IsTrial) {
    // DB Table
    var RefPath = (_IsTrial == true) ? "DONGCloud/DongService/Trial/" : "DONGCloud/DongService/";
    RefPath += _UID
    // UserID
    var ChildName = "PatternCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

/*
加入Pattern到DB
*/
exports._AddUserPattern = function (_UID, _MinderData, _PatternCount) {
    // DB Path
    var RefPath = "DONGCloud/PatternData/" + _UID;
    // Child Name
    _PatternCount++;
    var ChildName = "Pattern" + _PatternCount;
    // 存到DB
    this._set(RefPath, ChildName, _MinderData);
}

/*
更新Pattern總數到DB
*/
exports._AddPatternCount = function (_UID, _IsTrial, _PatternCount) {
    var Calculator = require('../libraries/tool/gettime.js');
    // DB Path
    var RefPath = (_IsTrial == true) ? "DONGCloud/DongService/Trial" : "DONGCloud/DongService";
    // Child Name
    var ChildName = _UID;
    var Data = {
        "PatternCount": _PatternCount + 1
    };
    // 存到DB
    this._update(RefPath, ChildName, Data);
}

exports._GetUserPatterns = function (_UID) {
    // DB Table
    var RefPath = "DONGCloud/PatternData";
    // UserID
    var ChildName = _UID;
    // 讀取Pattern資料, 回傳
    if (ChildName) {
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

exports._GetSampleCount = function (_UID, _IsTrial) {
    // DB Table
    var RefPath = (_IsTrial == true) ? "DONGCloud/DongService/Trial/" : "DONGCloud/DongService/";
    RefPath += _UID
    // UserID
    var ChildName = "SampleCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

exports._GetTrainingCount = function (_UID, _IsTrial) {
    // DB Table
    var RefPath = (_IsTrial == true) ? "DONGCloud/DongService/Trial/" : "DONGCloud/DongService/";
    RefPath += _UID
    // UserID
    var ChildName = "TrainingCount";
    // 讀取使用者資料, 回傳

    if (ChildName) {
        return Promise.resolve(this._onValuePromise(RefPath, ChildName));
    }
    else {
        return Promise.resolve(0);
    }
}

exports._GetSignResult = function(){
    // DB Table
    var RefPath = "DONGCloud/MotionData";
    // UserID
    var ChildName = "DigitalTaipei";
    // 讀取使用者資料, 回傳
    return Promise.resolve(this._onValuePromise(RefPath, ChildName)).then(function(_Data){
        var Pass = 0;
        var Fail = 0;
        for(var i = 1; i <= Object.keys(_Data).length; i++){
            (_Data["Data" + i].Similarity >= 50)? Pass++:Fail++; 
        }
        return {"Pass":Pass, "Fail":Fail}
    });
}