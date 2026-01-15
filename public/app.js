import navbar from "./UtilComponents/Navbar/Navbar.js";
import homePage from "./pages/home/home.js";

const navigate = (url) => {
  history.pushState({}, "", url);
};

document.body.innerHTML = navbar + homePage;

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-route]");
  if (!el) return;

  navigate(el.dataset.route);
});
