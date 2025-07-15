// contact.js (optional functionality)

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});
