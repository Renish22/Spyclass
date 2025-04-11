const zmq = require('zeromq');
const WebSocket = require('ws');

// Create REP ZMQ socket to receive and respond to ZMQ messages
const zmqSocket = new zmq.Reply();

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8082 });
const clients = new Set();

console.log('🔌 WebSocket server started on ws://localhost:8082');
console.log('📡 Binding ZMQ REP socket to tcp://0.0.0.0:8081...');

// Track WebSocket connections
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('🟢 WebSocket client connected. Total:', clients.size);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔴 WebSocket client disconnected. Total:', clients.size);
  });
});

// Start ZMQ server
(async () => {
  await zmqSocket.bind('tcp://0.0.0.0:8081');
  console.log('✅ ZMQ REP socket bound to tcp://0.0.0.0:8081');

  for await (const [msg] of zmqSocket) {
    const messageStr = msg.toString();
    console.log('📩 Received ZMQ message:', messageStr);

    // Broadcast to all connected WebSocket clients
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    }

    // Reply back to the ZMQ sender
    await zmqSocket.send(JSON.stringify({
      status: 200,
      message: 'Message received successfully'
    }));
  }
})();
