// const xo = `
//     <div class="xo-container">
//         <form class="game-xo" id='gameXO'>
//             <h1>X/O Game Page</h1>
//             <input placeholder="Enter your nickname" autofocus />
//             <button>Join Game</button>
//         </form>
//     </div>
// `;

// const joingame = (e) => {
//   //   e.preventDefault();
//   console.log("hi");
// };

// // document
// //   .getElementById("gameXO")
// //   .addEventListener("submit", (e) => joingame(e));

// export default xo;

const xo = document.createElement("div");
xo.className = "xo-container";

export default xo;
