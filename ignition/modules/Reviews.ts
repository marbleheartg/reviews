import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ReviewsModule", (m) => {
  const Contract = m.contract("Reviews", [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  ]);

  return { Contract };
});
