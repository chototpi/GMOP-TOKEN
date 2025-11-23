require("dotenv").config();
const StellarSDK = require("@stellar/stellar-sdk");

const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
const NETWORK = "Pi Testnet";

module.exports = {
  server,
  NETWORK,
  issuer: StellarSDK.Keypair.fromSecret(process.env.ISSUER_SECRET),
  distributor: StellarSDK.Keypair.fromSecret(process.env.DISTRIBUTOR_SECRET),
  GM: new StellarSDK.Asset("GM", StellarSDK.Keypair.fromSecret(process.env.ISSUER_SECRET).publicKey())
};
