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

const xoForm = document.createElement("form");
xoForm.className = "game-xo";
xo.append(xoForm);

const formH1 = document.createElement("h1");
formH1.innerText = "X/O Game Page";
xoForm.append(formH1);

const formInput = document.createElement("input");
formInput.placeholder = "Enter your nickname";
formInput.autofocus = true;
xoForm.append(formInput);

const formBtn = document.createElement("button");
formBtn.innerText = "Join Game";
xoForm.append(formBtn);

export default xo;
