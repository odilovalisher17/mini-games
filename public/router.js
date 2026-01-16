import navbar from "./UtilComponents/Navbar/Navbar.js";
import homePage from "./pages/home/home.js";
import xo from "./pages/xo/xo.js";

const render = () => {
  document.body.innerHTML = "";
  switch (window.location.pathname) {
    case "/":
      document.body.append(navbar);
      document.body.append(homePage);
      break;

    case "/xo":
      document.body.append(navbar);
      document.body.append(xo);
      break;

    default:
      document.body.append(navbar);
  }
};

render();
window.addEventListener("popstate", render);
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-route]");
  if (!el) return;

  history.pushState({}, "", el.dataset.route);
  render();
});
