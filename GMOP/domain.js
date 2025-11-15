const StellarSDK = require("@stellar/stellar-sdk");
const { server, NETWORK, issuer } = require("./util");

(async () => {
  try {
    const issuerAcc = await server.loadAccount(issuer.publicKey());

    const latest = await server.ledgers().order("desc").limit(1).call();
    const baseFee = latest.records[0].base_fee_in_stroops;

    const tx = new StellarSDK.TransactionBuilder(issuerAcc, {
      fee: baseFee.toString(),
      networkPassphrase: NETWORK,
      timebounds: await server.fetchTimebounds(90),
    })
      .addOperation(StellarSDK.Operation.setOptions({
        homeDomain: process.env.HOME_DOMAIN
      }))
      .build();

    tx.sign(issuer);
    await server.submitTransaction(tx);

    console.log("✅ Home Domain set:", process.env.HOME_DOMAIN);

  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err);
  }
})();
