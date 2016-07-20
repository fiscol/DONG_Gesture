// Firebase realtime database

// init
var firebase = require("firebase");
	firebase.initializeApp({
	  serviceAccount: "DONG-TEST-e4e5735fa7bb.json",
	  databaseURL: "https://dong-test-8ac54.firebaseio.com",
	  databaseAuthVariableOverride: {
	    uid: "BigQ"
	  }
	});
/*
	.Write
*/

// set
exports._set = function(childname ,path, value, error){
	var db = firebase.database();
	var ref = db.ref(path);
	ref.child(childname).set(value);
	console.log('ref.set '+ value)
	if (error) {
      console.log("Data could not be saved." + error);
  	} else {
  	  console.log("Data saved successfully.");
  	}
};

// update
// Error: Firebase.update failed: First argument  must be an object containing the children to replace.
// exports._update = function(path, value, error){
// 	var db = firebase.database();
// 	var ref = db.ref(path);
// 	ref.child("childOBJ").update(value);
// 	console.log('ref.update '+ value)
// 	if (error) {
//       console.log("Data could not be updated." + error);
//   	} else {
//   	  console.log("Data updated successfully.");
//   	}
// };

// push
exports._push = function(childname, path, value, error){
	var db = firebase.database();
	var ref = db.ref(path);
	ref.child(childname).push(value);
	console.log('ref.push '+ value);
	if (error) {
      console.log("Data could not be pushed." + error);
  	} else {
  	  console.log("Data pushed successfully.");
  	}
};

/*
	.Read
*/

// Read database
exports.on_value =  function(path){
	var db = firebase.database();
	var ref = db.ref(path);
	ref.on("value", function(snapshot){
		console.log(snapshot.val());
	}, function (errorObject) {
 		console.log("The read failed: " + errorObject.code);
	});	
};

exports.on_child_added =  function(path){
	var db = firebase.database();
	var ref = db.ref(path);
	// Retrieve new posts as they are added to our database
	ref.on("child_added", function(snapshot, prevChildKey) {
  		var newPost = snapshot.val();
  		console.log("Author: " + newPost.author);
  		console.log("Title: " + newPost.title);
  		console.log("Previous Post ID: " + prevChildKey);
	});
};

exports.on_child_changed =  function(path){
	var db = firebase.database();
	var ref = db.ref(path);
	// Get the data on a post that has changed
	ref.on("child_changed", function(snapshot) {
	  var changedPost = snapshot.val();
	  console.log("The updated post title is " + changedPost.title);
	});
};


