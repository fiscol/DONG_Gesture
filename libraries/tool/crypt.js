var crypto = require('crypto');
var crypto_algorithm = "aes-256-ctr";
var crypto_key = "3zTvzr3p67VC61jmV54rIYu1545x4TlY";
var crypto_IV = "0123456789012345";

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