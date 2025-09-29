import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Abi } from "viem";
import reviewsAbi from "./artifacts/contracts/Reviews.sol/Reviews.json";

export default defineConfig({
  out: "artifacts/contracts/Reviews.sol/generated.ts",
  contracts: [
    {
      name: "Reviews",
      abi: reviewsAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
