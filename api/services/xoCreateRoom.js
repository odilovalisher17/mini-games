export default function xoCreateRoom(req, rooms) {
  const roomId = Math.random().toString(36).substring(7);
  rooms.xo.push({
    room_id: roomId,
    players: [],
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
