const StellarSDK = require("@stellar/stellar-sdk");
const { server, NETWORK, issuer } = require("./util");

module.exports = async () => {
  try {
    console.log("Running set-home-domain job...");

    const issuerAcc = await server.loadAccount(issuer.publicKey());

    const latest = await server.ledgers().order("desc").limit(1).call();
    const baseFee = latest.records[0].base_fee_in_stroops;

    const tx = new StellarSDK.TransactionBuilder(issuerAcc, {
      fee: baseFee.toString(),
      networkPassphrase: NETWORK,
      timebounds: await server.fetchTimebounds(90),
    })
      .addOperation(
        StellarSDK.Operation.setOptions({
          homeDomain: process.env.HOME_DOMAIN
        })
      )
      .build();

    tx.sign(issuer);
    await server.submitTransaction(tx);

    console.log("Home domain set successfully.");
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
