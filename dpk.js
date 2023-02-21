const crypto = require("crypto");

const _hash = data => {
  const HASH_ALGORITHM = process.env.HASH_ALGORITHM || "sha3-512"
  return crypto.createHash(HASH_ALGORITHM).update(data).digest("hex")
}

exports.deterministicPartitionKey = (event = { partitionKey: "0" }) => {
  const MAX_PARTITION_KEY_LENGTH = process.env.MAX_PARTITION_KEY_LENGTH || 256;

  let candidate = event.partitionKey || _hash(JSON.stringify(event))

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = _hash(candidate);
  }
  return candidate;
};