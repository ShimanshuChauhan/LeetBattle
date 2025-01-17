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

  ws.on('message', (message) => {
    const data = JSON.parse(message)

    if (data.type === 'create_room') {
      const { user, questionUrl } = data.data;

      //create a unique room ID
      const roomId = generateRoomID();
      rooms[roomId] = {
        roomId: roomId,
        players: [{ userId: user.userId, ws: ws }],
        gameStatus: 'waiting',
        questionUrl: questionUrl
      };

      console.log("Room created: ", rooms[roomId]);

      //send response back to client
      ws.send(JSON.stringify({
        type: 'room_created',
        success: true,
        roomId: roomId
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  })
});


function generateRoomID() {
  return Math.random().toString(36).substring(2, 9);
}
