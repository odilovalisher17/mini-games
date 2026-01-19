import navbar from "./UtilComponents/Navbar/Navbar.js";
import homePage from "./pages/home/home.js";
import xoPage from "./pages/xo/xoPage.js";
import xoRoomPage from "./pages/xo/xoRoom.js";

const render = () => {
  document.body.innerHTML = "";
  document.body.append(navbar);

  let parsedUrl = window.location.pathname.split("/");

  if (parsedUrl[1] === "") {
    return document.body.append(homePage);
  }
  if (parsedUrl[1] === "xo") {
    if (parsedUrl.length === 2) {
      return document.body.append(xoPage());
    }
    document.body.append(xoRoomPage());
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
