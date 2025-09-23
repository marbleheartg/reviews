# Mini App Template

A minimal Hardhat + Bun template for developing Solidity smart contracts with TypeScript tooling.

### Features

- **Hardhat** with Solidity 0.8.28 (EVM Cancun)
- **Forked Base Mainnet** support via Alchemy
- **Bun** for fast scripts (`bunx` wrapper for Hardhat)
- **OpenZeppelin Contracts** and **Viem**
- Example contract, test, and Ignition module scaffold

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

## Project Structure

```
contracts/
  Contract.sol            # Example contract
  types/
    index.sol             # Types scaffold
ignition/
  modules/
    Contract.ts           # Ignition deployment module (scaffold)
test/
  Contract.ts             # Example viem-based tests
hardhat.config.ts         # Hardhat config (Cancun, Base fork)
```

## Hardhat Configuration Notes

- Solidity `0.8.28` with optimizer (200 runs), `evmVersion: "cancun"`.
- Local `hardhat` network is configured to fork Base mainnet via Alchemy using `ALCHEMY_API_KEY`.

## Deployment

This repo includes an Ignition module scaffold at `ignition/modules/Contract.ts`. If you plan to deploy using Hardhat Ignition, ensure the plugin is installed and configured.

Basic approach (once plugin is added):

```bash
bunx hardhat ignition deploy ignition/modules/Contract.ts --network hardhat
```

## Troubleshooting

- Missing TypeScript: install a compatible version
  ```bash
  bun add -d typescript@^5.8.3
  ```
- Alchemy key not picked up: confirm `.env` exists and `ALCHEMY_API_KEY` is set.
- Bun not found: open a new terminal so your shell picks up Bun, or install via the Bun docs.

## License

MIT
