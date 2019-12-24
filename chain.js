const {calculateHash} = require('./crypto');
const {createBlock} = require('./block')

const generateNextBlock = blockData => {
  const prevBlock = getLatestBlock();
  const nextIndex = prevBlock.index + 1;
  const ts = new Date().getTime() / 1000;
  const nextHash = calculateHash(nextIndex, prevBlock.hash, ts, blockData);

  return createBlock(
    nextIndex, 
    prevBlock.hash, 
    ts, 
    blockData, 
    nextHash
  );
}
