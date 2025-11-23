const StellarSDK = require("@stellar/stellar-sdk");
const { server, NETWORK, issuer, distributor, GM } = require("./util");

module.exports = async function () {
  try {
    console.log("🔹 Running create GM job...");

    const distributorAcc = await server.loadAccount(distributor.publicKey());
    const issuerAcc = await server.loadAccount(issuer.publicKey());

    const latest = await server.ledgers().order("desc").limit(1).call();
    const baseFee = latest.records[0].base_fee_in_stroops;

    // STEP 1 — TRUSTLINE
    console.log("🔹 Creating trustline...");
    const trustTx = new StellarSDK.TransactionBuilder(distributorAcc, {
      fee: baseFee.toString(),
      networkPassphrase: NETWORK,
      timebounds: await server.fetchTimebounds(90),
    })
      .addOperation(
        StellarSDK.Operation.changeTrust({
          asset: GM,
          limit: undefined
        })
      )
      .build();

    trustTx.sign(distributor);
    await server.submitTransaction(trustTx);
    console.log("✅ Trustline created.");

    // STEP 2 — MINT TOKEN
    console.log("🔹 Minting GM tokens...");
    const mintTx = new StellarSDK.TransactionBuilder(issuerAcc, {
      fee: baseFee.toString(),
      networkPassphrase: NETWORK,
      timebounds: await server.fetchTimebounds(90),
    })
      .addOperation(
        StellarSDK.Operation.payment({
          destination: distributor.publicKey(),
          asset: GM,
          amount: process.env.GM_MINT_AMOUNT || "99000000"
        })
      )
      .build();

    mintTx.sign(issuer);
    await server.submitTransaction(mintTx);

    console.log("✅ GM minted successfully.");

    return true;
  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err);
    throw err;
  }
};
