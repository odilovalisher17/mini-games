import globalState from "../../globalState.js";

function xoRoomPage() {
  const roomId = window.location.pathname.split("/")?.[3];
  const socket = new WebSocket(`ws://localhost:3333`);
  socket.onopen = () => {
    console.log("conncted");

    if (globalState.xo.username) {
      socket.send(
        JSON.stringify({
          type: "xo_join_room",
          room_id: roomId,
          username: globalState.xo.username,
        }),
      );
    }
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
  };

  const xoGameRoomContainer = document.createElement("div");
  xoGameRoomContainer.className = "xo-game-room-container";
  if (!globalState.xo.username) {
    const usernameBody = document.createElement("form");
    usernameBody.className = "xo-username-body";
    usernameBody.onsubmit = (e) => {
      e.preventDefault();
      globalState.xo.username = e.target.username.value;

      socket.send(
        JSON.stringify({
          type: "xo_join_room",
          room_id: roomId,
          username: globalState.xo.username,
        }),
      );
    };
    xoGameRoomContainer.append(usernameBody);

    const usernameInput = document.createElement("input");
    usernameInput.placeholder = "Enter your nickname";
    usernameInput.autofocus = true;
    usernameInput.name = "username";
    usernameBody.append(usernameInput);

    const usernameBtn = document.createElement("button");
    usernameBtn.innerText = "Play";
    usernameBody.append(usernameBtn);
  }
  return xoGameRoomContainer;
}

export default xoRoomPage;
