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

// equalTo
exports._equalTo = function(_Path, _ChildName, _Value, error){
    var db = firebase.database();
    var ref = db.ref(_Path);
    return ref.orderByChild(_ChildName).equalTo(_Value).once("value").then(function(snapshot) {
      return snapshot.val();
    }, function (error) {
        return error;
    });
}

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
exports._transaction = function(_Path, _Value, error){
	var db = firebase.database();
	var ref = db.ref(_Path);
	ref.transaction(function(currentData) {
        if (currentData === null) {
            return _Value;
        } 
        else {
            console.log('Data already exists.');
            return _Value; // Abort the transaction.
        }
    }, function(error, committed, snapshot) {
        if (error) {
            console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
            console.log('We aborted the transaction (because data already exists).');
        } else {
            console.log('Data added!');
        }
        console.log("Data: ", snapshot.val());
    })
};

exports._transactionCount = function(_Path, _Callback){
	var db = firebase.database();
	var ref = db.ref(_Path);
	return ref.transaction(function(currentRank) {
    // If _Path has never been set, currentRank will be `null`.
    return Number(currentRank) + 1;
    }).then(function(_Count){
        return Promise.resolve(_Callback(_Count));
    });
};
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
// exports._logIn = function (_Token) {
//     return firebase.auth().verifyIdToken(_Token).then(function (_UserData) {
//         return _UserData;
//         // ...
//     }).catch(function (error) {
//         return error;
//         // Handle error
//     });
// }

