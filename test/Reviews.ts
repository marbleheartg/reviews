import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("Reviews", function () {
  async function fixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const contract = await hre.viem.deployContract("Reviews", [
      owner.account.address,
    ]);
    const publicClient = await hre.viem.getPublicClient();
    return { contract, owner, otherAccount, publicClient };
  }

  describe("createReview", function () {
    it("should create a review", async function () {
      const { contract } = await loadFixture(fixture);

      await contract.write.createReview([1n, "Test review", true], {
        value: parseEther("0.0001"),
      });

      const review = await contract.read.getReview([1n]);

      expect(review.fid).to.equal(1n);
      expect(review.text).to.equal("Test review");
      expect(review.isPositive).to.equal(true);
      expect(review.timestamp).to.be.a("bigint");
    });
  });

  describe("deleteReview", function () {
    it("should delete a review", async function () {
      const { contract } = await loadFixture(fixture);

      await contract.write.deleteReview([1n]);

      expect(await contract.read.getReview([1n])).to.deep.equal({
        fid: 0n,
        timestamp: 0n,
        text: "",
        isPositive: false,
      });
    });
  });
});
