const{getGenesisBlock} = require('./genesis');
const {validateChain, validateBlock} = require('./validator');
const {calculateHash} = require('./crypto');
const {broadcast} = require('./net');
const {createBlock} = require('./block')

const blockchain = [getGenesisBlock()];

const addBlock = block => {
  if(validateBlock(block, getLatestBlock())) {
    blockchain.push(block);
  }
}

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

const replaceChain = newBlocks => {
  if(validateChain(newBlocks) && newBlocks.length > blockchain.length) {
    console.info('Replacing blockchain');
    blockchain = newBlocks;
    broadcast(responseLatestMsg());
  }
  else {
    console.error('Cannot replace blockchain');
  }
} 

const getLatestBlock = () => blockchain[blockchain.length - 1];

const getBlockchain = () => blockchain;


module.exports = {
  getLatestBlock,
  getBlockchain,
  addBlock,
  generateNextBlock,
  replaceChain
}
