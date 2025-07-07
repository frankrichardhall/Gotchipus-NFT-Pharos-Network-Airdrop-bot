const { ethers } = require("ethers");
const axios = require("axios");
const { faker } = require("@faker-js/faker");
const { getUTCTime } = require("../utils/time");
const { CONFIG } = require("../config");

class GotchipusBot {
  constructor(privateKey) {
    this.RPC_URL = "https://testnet.dplabs-internal.com";
    this.NFT_CONTRACT_ADDRESS = "0x0000000038f050528452D6Da1E7AACFA7B3Ec0a8";

    this.ERC20_CONTRACT_ABI = [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "address", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ];

    this.MINT_CONTRACT_ABI = [
      {
        inputs: [],
        name: "freeMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "claimWearable",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    this.proxies = [];
    this.proxy_index = 0;
    this.account_proxies = {};

    this.provider = new ethers.providers.JsonRpcProvider(this.RPC_URL);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": faker.internet.userAgent(),
      "Content-Type": "application/json",
    };

    this.mintContract = new ethers.Contract(
      this.NFT_CONTRACT_ADDRESS,
      this.MINT_CONTRACT_ABI,
      this.wallet
    );
  }

  async getBalance() {
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(
        `[${getUTCTime()}] Balance for ${this.wallet.address}: ${ethers.utils.formatEther(balance)} ETH`
      );
    } catch (err) {
      console.log(`[${getUTCTime()}] Failed to fetch balance:`, err.message);
    }
  }

  async freeMint() {
    try {
      const tx = await this.mintContract.freeMint();
      await tx.wait();
      console.log(`[${getUTCTime()}] ✅ Mint successful for ${this.wallet.address}`);
    } catch (err) {
      console.log(`[${getUTCTime()}] ❌ Mint failed for ${this.wallet.address}:`, err.message);
    }
  }

  async claimWearable() {
    try {
      const tx = await this.mintContract.claimWearable();
      await tx.wait();
      console.log(`[${getUTCTime()}] ✅ Wearable claimed for ${this.wallet.address}`);
    } catch (err) {
      console.log(`[${getUTCTime()}] ❌ Failed to claim wearable for ${this.wallet.address}:`, err.message);
    }
  }
}

module.exports = { GotchipusBot };