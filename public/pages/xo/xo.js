const xo = document.createElement("div");
xo.className = "xo-container";

const xoForm = document.createElement("form");
xoForm.className = "game-xo";
xoForm.onsubmit = (e) => {
  e.preventDefault();
  console.log("hi");
};
xo.append(xoForm);

const formH1 = document.createElement("h1");
formH1.innerText = "X/O Game Page";
xoForm.append(formH1);

const formInput = document.createElement("input");
formInput.placeholder = "Enter your nickname";
formInput.autofocus = true;
xoForm.append(formInput);

// ------------- Play Btn ------------------------
const formBtn = document.createElement("button");
formBtn.className = "xo-play-btn";
xoForm.append(formBtn);

const svg = document.createElement("img");
svg.src = "/img/chevron-right-solid.svg";
svg.alt = "Not Found";
svg.style.height = "20px";
svg.style.marginRight = "10px";
formBtn.append(svg);

const span = document.createElement("span");
span.innerText = "Play";
formBtn.append(span);
// -----------------------------------------

// ------------- Private Room Btn ------------------------
const formPrivRoomBtn = document.createElement("button");
formPrivRoomBtn.className = "xo-room-btn";
formPrivRoomBtn.setAttribute("data-route", `/xo/room/${crypto.randomUUID()}`);
xoForm.append(formPrivRoomBtn);

const svg2 = document.createElement("img");
svg2.src = "/img/key-solid.svg";
svg2.alt = "Not Found";
svg2.style.height = "20px";
svg2.style.marginRight = "10px";
formPrivRoomBtn.append(svg2);

const spanPriveRoom = document.createElement("span");
spanPriveRoom.innerText = "Create a private room";
formPrivRoomBtn.append(spanPriveRoom);
// -----------------------------------------

export default xo;
