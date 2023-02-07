const express = require("express");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, hexToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "215fcdc664ef414851a6f931d34fe035deb4e3e8": 100,
  "567898a206ce7810b19b4b3cc1ca63e5c32c99cf": 50,
  "87f04cd822b70f7215f7ead12b59091ba239ac88": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  // TODO: get a signature from the client
  // recover the public address from the signature
  // sender is public address.

  const { signature, recipient, amount, recoveryBit } = req.body;
  const msgHash = keccak256(utf8ToBytes(amount.toString()));
  const publicKey = await secp.recoverPublicKey(msgHash, hexToBytes(signature), recoveryBit);
  const sender = toHex(keccak256(publicKey.slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
