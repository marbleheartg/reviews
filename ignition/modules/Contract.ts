import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ContractModule", (m) => {
  const Contract = m.contract("Contract", [""]);

  return { Contract };
});
