var crypto = require('crypto');
var crypto_algorithm = "aes-256-ctr";
var crypto_key = "pvd1234567890plus12345678901user".toString("utf8");
var crypto_IV = "pvd234567890plus".toString("utf8");

exports._crypt = function (_Code) {
    if(_Code.Data_encrypted){
        return _decrypt(_Code.Data_encrypted);
    }
    else if(_Code.Data_decrepted){
        return _encrypt(_Code.Data_decrepted);
    }
    else{
        return {"Error":"Params error."};
    }
};

//帳密加密
var _encrypt = function (_Code) {
    var Cipher = crypto.createCipheriv(crypto_algorithm, crypto_key, crypto_IV);
    var Encrypted = Cipher.update(_Code, "utf8", "hex");
    Encrypted += Cipher.final("hex"); // to hex
    return { "Data_encrypted": Encrypted };
};

//帳密解密
var _decrypt = function (_Code) {
    var Decipher = crypto.createDecipheriv(crypto_algorithm, crypto_key, crypto_IV);
    var Decrypted = Decipher.update(_Code, "hex", "utf8");
    Decrypted += Decipher.final("utf8"); // to utf8
    return { "Data_decrypted": Decrypted };
}