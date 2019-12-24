const {calculateHash} = require('./crypto');

const createBlock = (index, prevHash, ts, data, hash) => ({
  index,
  prevHash,
  ts,
  data,
  hash
})

const calculateBlockHash = ({index, prevHash, ts, data}) => calculateHash(index, prevHash, ts, data);

module.exports = {
  createBlock,
  calculateBlockHash
}
