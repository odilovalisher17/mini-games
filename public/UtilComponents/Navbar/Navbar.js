// const navbar = `
//   <nav class="navbar">
//     <div></div>
//     <div class="navbar-text">
//       <h2>Mini Games.uz</h2>
//     </div>
//     <div></div>
//   </nav>
// `;

// export default navbar;

const navbar = document.createElement("nav");
navbar.class = "navbar";

const leftDiv = document.createElement("div");

const centerDiv = document.createElement("div");
centerDiv.className = "navbar-text";
const centerH2 = document.createElement("h2");
centerH2.innerText = "Mini Games.uz";

const rightDiv = document.createElement("div");

navbar.append(leftDiv);
navbar.append(centerDiv);
navbar.append(rightDiv);

export default navbar;
