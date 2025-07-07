function getUTCTime() {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", " UTC");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { getUTCTime, sleep };