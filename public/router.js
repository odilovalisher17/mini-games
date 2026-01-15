import navbar from "./UtilComponents/Navbar/Navbar.js";
import homePage from "./pages/home/home.js";
import xo from "./pages/xo/xo.js";

const render = () => {
  switch (window.location.pathname) {
    case "/":
      document.body.innerHTML = navbar + homePage;
      break;

    case "/xo":
      document.body.innerHTML = navbar + xo;
      break;

    default:
      document.body.innerHTML =
        navbar +
        `
        <div>
          <h1>404 - Page Not Found</h1>
        </div>
      `;
  }
};

const navigate = (url) => {
  history.pushState({ url }, "", url);
  render();
};

render();
window.addEventListener("popstate", render);
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-route]");
  if (!el) return;

  navigate(el.dataset.route);
});
