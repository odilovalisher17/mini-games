import navbar from "./UtilComponents/Navbar/Navbar.js";
import homePage from "./pages/home/home.js";
import xoPage from "./pages/xo/xo.js";

const render = () => {
  document.body.innerHTML = "";
  document.body.append(navbar);

  switch (window.location.pathname) {
    case "/":
      document.body.append(homePage);
      break;

    case "/xo":
      document.body.append(xoPage());
      break;

    // default:
    //   document.body.append(navbar);
  }
};

render();
window.addEventListener("popstate", render);
window.addEventListener("app:render", render);
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-route]");
  if (!el) return;

  history.pushState({}, "", el.dataset.route);
  render();
});

export { render };
