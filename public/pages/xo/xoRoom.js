import globalState from "../../globalState.js";

function xoRoomPage() {
  const roomId = window.location.pathname.split("/")?.[3];
  const socket = new WebSocket(`ws://10.10.171.171:3333`);
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

    xoGameRoomContainer.innerHTML = "";

    const roomBody = document.createElement("div");
    roomBody.className = "xo-room-body";
    xoGameRoomContainer.append(roomBody);

    if (data.state.players[0]) {
      const firstPlayer = document.createElement("div");
      firstPlayer.className = "xo-player-1";
      const firstPlayerName = document.createElement("span");
      firstPlayerName.innerText = data.state.players[0].username;
      firstPlayer.append(firstPlayerName);
      const firstPlayerFigure = document.createElement("span");
      firstPlayerFigure.innerText = "X";
      firstPlayer.append(firstPlayerFigure);
      roomBody.append(firstPlayer);
    }

    const middlePart = document.createElement("div");
    roomBody.append(middlePart);

    const gameStatus = document.createElement("div");
    gameStatus.className = "xo-game-status";

    if (data.state.players.length === 2) {
      gameStatus.innerHTML = `Player <span style="color:${
        data.state.turn === 0 ? "red" : "blue"
      }">${
        data.state.players[data.state.turn].username
      }</span>, your turn, make a move.`;
    } else {
      gameStatus.innerText = "Please wait for your opponent to connect...";
    }
    middlePart.append(gameStatus);

    const board = document.createElement("div");
    board.className = "xo-board";
    middlePart.append(board);

    for (let cellIdx in data.state.board) {
      let cell = data.state.board[cellIdx];
      const cellDiv = document.createElement("div");
      cellDiv.className = "xo-board-cell";
      if (!cell) {
        cellDiv.onclick = () => {
          socket.send(
            JSON.stringify({
              type: "xo_make_move",
              room_id: roomId,
              pos: cellIdx,
            }),
          );
        };
      }
      board.append(cellDiv);

      if (cell) {
        const cellFigure = document.createElement("div");
        cellFigure.className = "xo-cell-figure";
        cellFigure.innerText = cell;
        cellDiv.append(cellFigure);
      }

      if (data.type === "xo_game_over") {
        if (data.winning_position.includes(cellIdx * 1)) {
          setTimeout(() => {
            cellDiv.style.background =
              data.state.winner === "x"
                ? "rgba(255,0,0,0.5)"
                : "rgba(0,0,255,0.5)";

            cellDiv.style.animation = "xowin 1s 1 ease-in-out";
          }, 10);
        }
      }
    }

    if (data.state.players[1]) {
      const secondPlayer = document.createElement("div");
      secondPlayer.className = "xo-player-2";
      const secondPlayerName = document.createElement("span");
      secondPlayerName.innerText = data.state.players[1].username;
      secondPlayer.append(secondPlayerName);
      const secondPlayerFigure = document.createElement("span");
      secondPlayerFigure.innerText = "O";
      secondPlayer.append(secondPlayerFigure);
      roomBody.append(secondPlayer);
    }
  };

  // -------------------- UI ----------------------------
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
