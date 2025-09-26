import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ReviewsModule", (m) => {
  const Contract = m.contract("Reviews", [
    process.env.TESTING_WALLET_ADDRESS as `0x${string}`,
  ]);

  // const testingWallet = process.env.TESTING_WALLET_ADDRESS;

  // const from = m.getAccount(0);

  // m.send("fundTestingWallet", testingWallet!, parseEther("100"), undefined, {
  //   from,
  // });

  return { Contract };
});
