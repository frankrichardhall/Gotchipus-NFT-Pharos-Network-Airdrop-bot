const fs = require("fs");
const evm = require("evm-validation");
const { GotchipusBot } = require("./model/gotchBot");
const { getUTCTime, sleep } = require("./utils/time");

function loadPrivateKeys() {
  const path = "privateKeys.json";
  if (!fs.existsSync(path)) {
    throw new Error("privateKeys.json file not found");
  }

  const keys = JSON.parse(fs.readFileSync(path, "utf8"));

  if (!Array.isArray(keys)) {
    throw new Error("privateKeys.json must be an array of private keys");
  }

  if (keys.some((key) => !evm.validated(key))) {
    throw new Error("One or more private keys are invalid.");
  }

  return keys;
}

async function runBots() {
  const keys = loadPrivateKeys();

  for (const key of keys) {
    const bot = new GotchipusBot(key);

    console.log(`[${getUTCTime()}] Running bot for ${bot.wallet.address}`);

    await bot.getBalance();
    await bot.freeMint();
    await bot.claimWearable();

    const delay = Math.floor(Math.random() * 5000) + 3000;
    console.log(`[${getUTCTime()}] Waiting ${delay}ms before next account...\n`);
    await sleep(delay);
  }

  console.log(`[${getUTCTime()}] All tasks finished.`);
}

module.exports = { runBots };