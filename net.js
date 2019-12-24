const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const {latestBlockMsg, latestBlockNumberMsg} = require('./messages');
const {initMessageHandler} = require('./handler');
const {getBlockchain, generateNextBlock, addBlock} = require('./chain');

const httpPort = process.env.HTTP_PORT || 3003
const p2pPort = process.env.P2P_PORT || 6003
const sockets = []

const initHttpServer = () => {
  const app = express();
  app.use(bodyParser.json());

  app.get('/blocks', (_, res) => res.send(JSON.stringify(getBlockchain())));

  app.post('/mineBlock', (req, res) => {
      const newBlock = generateNextBlock(req.body.data);
      addBlock(newBlock);
      broadcast(latestBlockMsg());
      console.log('block added: ' + JSON.stringify(newBlock));
      res.send();
  });

  app.get('/peers', (req, res) => {
      res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
  });

  app.post('/addPeer', (req, res) => {
      connectToPeers([req.body.peer]);
      res.send();
  });

  app.listen(httpPort, () => console.log('Listening http on port: ' + httpPort));
};


const initP2PServer = () => {
  const server = new WebSocket.Server({port: p2pPort});
  server.on('connection', ws => initConnection(ws));
  console.log('listening websocket p2p port on: ' + p2pPort);

};

const initErrorHandler = (ws) => {
  const closeConnection = (ws) => {
    console.log('connection failed to peer: ' + ws.url);
    sockets.splice(sockets.indexOf(ws), 1);
  };

  ws.on('close', () => closeConnection(ws));
  ws.on('error', () => closeConnection(ws));
}

const initConnection = ws => {
	sockets.push(ws);
	initMessageHandler(ws, write, broadcast);
	initErrorHandler(ws);
	write(ws, latestBlockNumberMsg());
}

const connectToPeers = newPeers => {
	newPeers.forEach(peer => {
		const ws = new WebSocket(peer)

		ws.on('open', () => initConnection(ws))

		ws.on('error', (err) => {
			console.log('connection failed', err)
		})
	})
}

const write = (ws, message) => ws.send(JSON.stringify(message))
const broadcast = message => sockets.forEach(socket => write(socket, message))

module.exports = {
  initHttpServer,
  initP2PServer,
  connectToPeers,
	broadcast
}
