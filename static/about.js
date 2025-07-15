document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".about-box");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.2 });

  boxes.forEach((box) => observer.observe(box));
});
