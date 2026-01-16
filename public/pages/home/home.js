// const homePage = `
//   <div class="game-list">
//     <div class="game-list-container">
//       <div class="game" data-route="/xo">
//         <img alt="Not Found" src="/img/xo.png" />
//       </div>
//       <div class="game">
//         <img alt="Not Found" src="/img/rock-paper-scissors.png" />
//       </div>
//       <div class="game">
//         <img alt="Not Found" src="/img/chess.jpg" />
//       </div>
//       <div class="game">
//         <img alt="Not Found" src="/img/checkers.png" />
//       </div>
//       <div class="game">
//         <img alt="Not Found" src="/img/narda.png" />
//       </div>
//       <div class="game">
//         <img alt="Not Found" src="/img/monopoly.png" />
//       </div>
//       <div class="game">
//         <img alt="Not Found" src="/img/mafia.png" />
//       </div>
//     </div>
//   </div>
// `;

// export default homePage;

const homePage = document.createElement("div");
homePage.className = "game-list";

const gameListContainer = document.createElement("div");
gameListContainer.className = "game-list-container";
homePage.append(gameListContainer);

const listOfGames = [
  {
    name: "xo",
    img: "/img/xo.png",
  },
  {
    name: "rock-paper-scissors",
    img: "/img/rock-paper-scissors.png",
  },
  {
    name: "chess",
    img: "/img/chess.jpg",
  },
  {
    name: "checkers",
    img: "/img/checkers.png",
  },
  {
    name: "narda",
    img: "/img/narda.png",
  },
  {
    name: "monopoly",
    img: "/img/monopoly.png",
  },
  {
    name: "mafia",
    img: "/img/mafia.png",
  },
];

for (let game of listOfGames) {
  const gameDiv = document.createElement("div");
  gameDiv.className = "game";
  gameListContainer.append(gameDiv);

  const gameImg = document.createElement("img");
  gameImg.alt = "Not Found";
  gameImg.src = game.img;
  gameDiv.append(gameImg);
}

export default homePage;
