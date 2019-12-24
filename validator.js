const {calculateBlockHash} = require('./block');
const {getGenesisBlock} = require('./genesis');

const validateBlock = (newBlock, prevBlock) => {
  if(newBlock.index !== prevBlock.index + 1) {
    console.error('Invalid block index');
    return false;
  }

  if(newBlock.prevHash !== prevBlock.hash) {
    console.error('Invalid previous block hash');
    return false;
  }

  if(calculateBlockHash(newBlock) !== newBlock.hash) {
    console.error('Invalid block hash');
    return false;
  }

  return true;
}

const validateChain = blockchain => {
  if(JSON.stringify(blockchain[0]) !== getGenesisBlock()) {
    return false;
  }

  try {
    blockchain.reduce((prevBlock, block) => {
      if(validateBlock(block, prevBlock)) {
        throw new Error('Blockchain has invalid blocks');
      }

      return block;
    });

    return true;
  }
  catch(error) {
    return false;
  }
  
}

module.exports = {
  validateBlock,
  validateChain
}
