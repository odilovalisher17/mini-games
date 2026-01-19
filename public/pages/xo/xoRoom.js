function xoRoomPage() {
  const roomId = window.location.pathname.split("/")?.[3];
  const socket = new WebSocket(`ws://localhost:3333`);
  socket.onopen = () => {
    console.log("conncted");

    socket.send(
      JSON.stringify({
        type: "xo_join_room",
        room_id: roomId,
        username: "123",
      }),
    );
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
  };

  return roomId;
}

export default xoRoomPage;
