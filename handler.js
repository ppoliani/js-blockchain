const {getLatestBlock, addBlock, replaceChain} = require('./chain');
const {
  MessageTypes,
  latestBlockMsg,
  chainMsg,
  queryAllMsg
} = require('./messages');

const initMessageHandler = (ws, write, broadcast) => {
	ws.on('message', data => {
		const message = JSON.parse(data)
		console.log('Received message' + JSON.stringify(message))

		switch (message.type) {
			case MessageTypes.LATEST_BLOCK_NUMBER:
				write(ws, latestBlockMsg())
				break
			case MessageTypes.QUERY_ALL:
				write(ws, chainMsg())
				break
			case MessageTypes.RESPONSE_BLOCKCHAIN:
				handleBlockchainResponse(message, broadcast)
				break
		}
	})
}

const handleBlockchainResponse = (message, broadcast) => {
	const receivedBlocks = JSON.parse(message.data).sort(
		(b1, b2) => b1.index - b2.index
	);
	const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
	const latestBlockHeld = getLatestBlock();

	if (latestBlockReceived.index > latestBlockHeld.index) {
		console.log(
			'blockchain possibly behind. We got: ' +
				latestBlockHeld.index +
				' Peer got: ' +
				latestBlockReceived.index
		);

		if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
			console.log('We can append the received block to our chain')
			addBlock(latestBlockReceived)
			broadcast(getLatestBlock())
    } 
    else if (receivedBlocks.length === 1) {
			console.log('We have to query the chain from our peer')
			broadcast(queryAllMsg())
    } 
    else {
			console.log('Received blockchain is longer than current blockchain')
			replaceChain(receivedBlocks)
		}
  } 
  else {
		console.log(
			'received blockchain is not longer than current blockchain. Do nothing'
		)
	}
}

module.exports = {
	initMessageHandler
}
