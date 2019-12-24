const{getGenesisBlock} = require('./genesis');
const {validateChain} = require('./validator');

const blockchain = [getGenesisBlock()];

const addBlock = block => {
  if(validateBlock(block, getLatestBlock())) {
    blockchain.push(block);
  }
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
