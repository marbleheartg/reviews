# Reviews Smart Contract

A Solidity smart contract for managing user reviews with Farcaster integration, built with Hardhat + Bun. This project provides a decentralized review system where users can create reviews using their Farcaster ID (FID) and pay a small fee in ETH.

## Overview

The Reviews contract allows users to:

- Create reviews associated with their Farcaster ID (FID)
- Pay a small fee (0.0001 ETH minimum) to submit reviews
- Store positive or negative reviews with text content
- Have reviews managed by the contract owner

### Key Features

- **Hardhat** with Solidity 0.8.28 (EVM Cancun)
- **Forked Base Mainnet** support via Alchemy
- **Bun** for fast scripts (`bunx` wrapper for Hardhat)
- **OpenZeppelin Contracts** and **Viem**
- FID-based user identification system
- Pay-per-review system with ETH payments
- Owner-controlled review deletion
- Withdrawable contract balance

---

## Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 18+ recommended
- Alchemy API key for Base mainnet

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```
2. Create a `.env` file with your Alchemy key:
   ```bash
   echo "ALCHEMY_API_KEY=your_alchemy_key_here" > .env
   ```

## Scripts

Defined in `package.json`:

- `bun run compile` — compile contracts
- `bun run test` — run tests
- `bun run fork` — start a Hardhat node forking Base mainnet at a fixed block

Example usage:

```bash
bun run compile
bun run test
bun run fork
```

The `fork` script uses:

```bash
dotenv bunx hardhat node \
  --fork https://base-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY \
  --fork-block-number 31564648
```

Make sure `.env` contains `ALCHEMY_API_KEY`.

## Contract Details

### Review Structure

```solidity
struct Review {
    uint256 fid;        // Farcaster ID
    uint256 timestamp;  // Block timestamp when created
    string text;        // Review content (1-100 characters)
    bool isPositive;    // Whether review is positive or negative
}
```

### Key Functions

- `createReview(uint256 fid, string memory text, bool isPositive)` - Create a new review (requires 0.0001 ETH minimum)
- `getReview(uint256 fid)` - Retrieve a review by FID
- `deleteReview(uint256 fid)` - Delete a review (owner only)
- `withdraw()` - Withdraw contract balance (owner only)

## Project Structure

```
contracts/
  Reviews.sol             # Main Reviews smart contract
  types/
    index.sol             # Review struct definition
ignition/
  modules/
    Reviews.ts            # Ignition deployment module
test/
  Reviews.ts              # Viem-based tests for Reviews contract
hardhat.config.ts         # Hardhat config (Cancun, Base fork)
artifacts/                # Compiled contract artifacts
cache/                    # Hardhat cache files
```

## Hardhat Configuration Notes

- Solidity `0.8.28` with optimizer (200 runs), `evmVersion: "cancun"`.
- Local `hardhat` network is configured to fork Base mainnet via Alchemy using `ALCHEMY_API_KEY`.

## Deployment

### Using Thirdweb (Recommended)

Deploy your contract using Thirdweb:

```bash
bunx thirdweb deploy -k <project-secret-key>
```

### Using Hardhat Ignition

This repo includes an Ignition module at `ignition/modules/Reviews.ts`. Deploy using:

```bash
bun run deploy
```

Or manually:

```bash
bunx hardhat ignition deploy ignition/modules/Reviews.ts --network localhost
```

### Contract Interaction

After deployment, you can interact with the contract:

```javascript
// Create a review
await contract.createReview(
  fid, // Farcaster ID
  "Great service!", // Review text
  true, // Is positive
  { value: ethers.parseEther("0.0001") } // Payment
);

// Get a review
const review = await contract.getReview(fid);
```

## Testing

Run the test suite to verify contract functionality:

```bash
bun run deploy
```

The tests cover:

- Review creation with proper payment
- Review retrieval
- Owner-only functions (delete, withdraw)
- Input validation and error handling

## Troubleshooting

- **Alchemy key not picked up**: Confirm `.env` exists and `ALCHEMY_API_KEY` is set
- **Bun not found**: Open a new terminal so your shell picks up Bun, or install via the Bun docs
- **Compilation errors**: Ensure all dependencies are installed with `bun install`
- **Fork issues**: Verify your Alchemy API key has access to Base mainnet

## License

MIT
