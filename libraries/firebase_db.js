// Firebase realtime database

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

// set
exports._set = function(path, childname ,value, error){
	var db = firebase.database();
	var ref = db.ref(path);
	childname = childname + count;
	ref.child(childname).set(value);
	console.log('ref.set '+ value)
	if (error) {
      console.log("Data could not be saved." + error);
  	} else {
  	  console.log("Data saved successfully.");
  	}
  	count++;
};

// update
// Error: Firebase.update failed: First argument  must be an object containing the children to replace.
exports._update = function(path, childname, value, error){
	var db = firebase.database();
	var ref = db.ref(path);
	ref.child(childname).update(value);
	console.log('ref.update '+ value)
	if (error) {
      console.log("Data could not be updated." + error);
  	} else {
  	  console.log("Data updated successfully.");
  	}
};

// push
exports._push = function(path, childname, value, error){
	var db = firebase.database();
	var ref = db.ref(path);
	ref.child(childname).push(value);
	console.log('ref.push '+ value);
	if (error) {
      console.log("Data could not be pushed." + error);
  	} else {
  	  console.log("Data pushed successfully."+ref.child(childname).push(value).key);
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
var count = 0;
// Read database
exports._onValue =  function(path, childname){
	var db = firebase.database();
	var ref = db.ref(path);
	ref.child(childname).on("value", function(snapshot){
		console.log(snapshot.val())
		return snapshot.val()
	}, function (errorObject) {
 		console.log("The read failed: " + errorObject.code);
	});	
};

exports._onChildAdded =  function(path){
	var db = firebase.database();
	var ref = db.ref(path);
	// Retrieve new posts as they are added to our database
	ref.on("child_added", function(snapshot) {
  		// console.log("newChild: " + snapshot.val());
  		console.log("PrePost: " + snapshot.val());
	});
};

exports._onChildChanged =  function(path){
	var db = firebase.database();
	var ref = db.ref(path);
	// Get the data on a post that has changed
	ref.on("child_changed", function(snapshot) {
	  var changedPost = snapshot.val();
	  console.log("The updated post title is " + changedPost.title);
	});
};


