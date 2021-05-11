const navbar = document.querySelector("#navbar");
const burgerMenu = document.querySelector(".burger-menu");

burgerMenu.addEventListener("click", () => {
  navbar.classList.toggle("active");
})

const URLbtn = document.querySelector(".URLbtn");
const url = document.querySelector("#url");
const SpanURL = document.querySelector(".error");

URLbtn.addEventListener("click", (e) => {
  e.preventDefault();
  const urlValue = url.value;
  const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (pattern.test(urlValue)) {
    alert("Url is valid");
    return true;
  } else {
    url.classList.add("error");
    SpanURL.style.display = "block";
  }
})