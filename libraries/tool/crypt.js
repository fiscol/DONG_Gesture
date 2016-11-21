var crypto = require('crypto');
var crypto_algorithm = "aes-256-ctr";
var crypto_key = "pvd1234567890plus12345678901user".toString("utf8");
var crypto_IV = "pvd234567890plus".toString("utf8");

//帳密加密
exports._encrypt = function (_Code) {
    var Cipher = crypto.createCipheriv(crypto_algorithm, crypto_key, crypto_IV);
    var Encrypted = Cipher.update(_Code, "utf8", "hex");
    Encrypted += Cipher.final("hex"); // to hex
    return Encrypted;
};

//帳密解密
exports._decrypt = function (_EncryptedCode) {
    var Decipher = crypto.createDecipheriv(crypto_algorithm, crypto_key, crypto_IV);
    var Decrypted = Decipher.update(_EncryptedCode, "hex", "utf8");
    Decrypted += Decipher.final("utf8"); // to utf8
    return Decrypted;
}