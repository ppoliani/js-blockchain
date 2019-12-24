const {createBlock} = require('./block')

const GENESIS_BLOCK = createBlock(
  0,
  0,
  1577190788
);

const getGenesisBlock = () => GENESIS_BLOCK;

module.exports = {getGenesisBlock}
