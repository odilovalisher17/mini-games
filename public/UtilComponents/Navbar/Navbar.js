const navbar = document.createElement("nav");
navbar.className = "navbar";

const leftDiv = document.createElement("div");

const centerDiv = document.createElement("div");
centerDiv.className = "navbar-text";
const centerH2 = document.createElement("h2");
centerH2.innerText = "Mini Games.uz";
centerDiv.append(centerH2);

const rightDiv = document.createElement("div");

navbar.append(leftDiv);
navbar.append(centerDiv);
navbar.append(rightDiv);

export default navbar;
