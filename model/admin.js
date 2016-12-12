var Admin = function (data) {  
    this.data = data;
}

Admin.prototype.data = {}

// Admin.prototype.changeName = function (name) {  
//     this.data.name = name;
// }

// Admin.findById = function (id, callback) {  
//     db.get('users', {id: id}).run(function (err, data) {
//         if (err) return callback(err);
//         callback(null, new User(data));
//     });
// }

// Admin.prototype.save = function (callback) {  
//     var self = this;
//     db.get('users', {id: this.data.id}).update(JSON.stringify(this.data)).run(function (err, result) {
//         if (err) return callback(err);
//         callback(null, self); 
//     });
// }

Admin.prototype.get = function (name) {  
    return this.data[name];
}

Admin.prototype.set = function (name, value) {  
    this.data[name] = value;
}

module.exports = Admin;