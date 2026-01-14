import homePage from "./pages/home/home";

const navigate = (url) => {
  history.pushState({}, "", url);
};
