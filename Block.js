const createBlock = (index, prevHash, ts, data, hash) => ({
  index,
  prevHash,
  ts,
  data,
  hash
})

module.exports = {createBlock}
