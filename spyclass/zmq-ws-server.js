// server.js (or create a dedicated zmq-ws-server.js)
const zmq = require('zeromq');
const WebSocket = require('ws');

const sock = new zmq.Subscriber();
const wss = new WebSocket.Server({ port: 8082 });

// Subscribe to all messages
zmqSocket.bind('tcp://*:8082');
sock.subscribe();

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
});

(async () => {
  for await (const [msg] of sock) {
    const message = JSON.parse(msg.toString());
    console.log('ZMQ Message:', message);

    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
})();
