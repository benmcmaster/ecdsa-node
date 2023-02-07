const { kMaxLength } = require("buffer");
const secp = require("ethereum-cryptography/secp256k1");
const {keccak256} = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
console.log("privateKey: ", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
console.log("publicKey: ", toHex(publicKey));

const address = keccak256(publicKey.slice(1)).slice(-20);
console.log("address: ", toHex(address));