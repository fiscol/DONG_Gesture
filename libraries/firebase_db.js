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
exports._set = function(_Path, _ChildName, _Value, error){
	var db = firebase.database();
	var ref = db.ref(_Path);
	// childname = childname + count;
	ref.child(_ChildName).set(_Value);
	console.log('ref.set '+ _Value)
	if (error) {
      console.log("Data could not be saved." + error);
  	} else {
  	  console.log("Data saved successfully.");
  	}
  	// count++;
};

// update
// Error: Firebase.update failed: First argument  must be an object containing the children to replace.
exports._update = function(_Path, _ChildName, _Value, error){
	var db = firebase.database();
	var ref = db.ref(_Path);
	ref.child(_ChildName).update(_Value);
	console.log('ref.update '+ _Value)
	if (error) {
      console.log("Data could not be updated." + error);
  	} else {
  	  console.log("Data updated successfully.");
  	}
};

// push
exports._push = function(_Path, _ChildName, _Value, error){
	var db = firebase.database();
	var ref = db.ref(_Path);
	ref.child(_ChildName).push(_Value);
	console.log('ref.push '+ _Value);
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
exports._onValue =  function(_Path, _ChildName, _Callback){
	var db = firebase.database();
	var ref = db.ref(_Path);
	ref.child(_ChildName).on("value", function(snapshot){
		var onValueResult = snapshot.val();
		console.log(onValueResult);
		// 回傳onValueResult給api.js
		_Callback && _Callback( onValueResult );
	}, function (errorObject) {
 		console.log("The read failed: " + errorObject.code);
	});	
};

// Test Read database with Promise
exports._onValueTest =  function(_Path, _ChildName){
	var db = firebase.database();
	var ref = db.ref(_Path);
	return ref.child(_ChildName).once("value").then(function(snapshot){
		return snapshot.val();
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


