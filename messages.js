const {getBlockchain, getLatestBlock} = require('./chain');

const MessageTypes = {
  LATEST_BLOCK_NUMBER: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2

}

const latestBlockNumberMsg = () => ({type: MessageTypes.LATEST_BLOCK_NUMBER});
const queryAllMsg = () => ({type: MessageTypes.QUERY_ALL});

const chainMsg = () =>({
  type: MessageTypes.RESPONSE_BLOCKCHAIN, 
  data: JSON.stringify(getBlockchain())
});

const latestBlockMsg = () => ({
  type: MessageTypes.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify([getLatestBlock()])
});

module.exports = {
  MessageTypes,
  latestBlockNumberMsg,
  chainMsg,
  latestBlockMsg
}
