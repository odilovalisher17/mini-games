import navbar from "./UtilComponents/Navbar/Navbar.js";
import homePage from "./pages/home/home.js";

const navigate = (url) => {
  history.pushState({}, "", url);
};

document.body.innerHTML = navbar + homePage;
