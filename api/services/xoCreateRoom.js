export default function xoCreateRoom(req, rooms) {
  console.log(req.body);
  const roomId = Math.random().toString(36).substring(7);
  rooms.xo.push({
    room_id: roomId,
    players: [
      {
        username: req.username,
      },
    ],
    isStarted: false,
    turn: null,
    winner: undefined,
    board: Array.from({ length: 9 }),
  });

  return {
    message: "Success!",
    room_id: roomId,
  };
}
