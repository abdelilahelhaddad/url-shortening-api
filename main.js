const navbar = document.querySelector("#navbar");
const burgerMenu = document.querySelector(".burger-menu");

burgerMenu.addEventListener("click", () => {
  navbar.classList.toggle("active");
})
