// room = {
//   roomId: null,
//   users: [],
//   gameStatus: 'waiting',
//   questionUrl: null,
//   winner: null,
// }

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
console.log("Server started on port 8080");
const rooms = {};

server.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  })
});
