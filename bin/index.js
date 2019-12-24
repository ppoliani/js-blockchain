const {
  connectToPeers, 
  initHttpServer, 
  initP2PServer
} = require('../net');

const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []

connectToPeers(initialPeers);
initHttpServer();
initP2PServer();
