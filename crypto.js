const crypto = require('crypto');

const calculateHash = (
  index,
  prevHash,
  ts,
  data
) => crypto.createHash('sha256')
  .update(index + prevHash + ts + data)
  .digest('hex');

  module.exports = {calculateHash}
