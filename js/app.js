

let menuBtn = document.getElementById("menuBtn");
let sideNav = document.getElementById("sideNav");
const mobileNav = document.querySelector(".links");
const hamburger = document.querySelector(".hamburger");
const navbar = document.querySelector("nav");


hamburger.addEventListener("click", function () {
  mobileNav.classList.toggle("active");
  hamburger.classList.toggle("is-active");
});

var scroll = new SmoothScroll('a[href*="#"]',{
  speed: 1000,
  speedAsDuration: true
});

console.log("Hello World");