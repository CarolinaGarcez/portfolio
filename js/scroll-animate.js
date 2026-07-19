const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show-animate');
      // Opcional: observer.unobserve(entry.target) se quiser que anime apenas 1 vez
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const hiddenElements = document.querySelectorAll('.animate-section');
  hiddenElements.forEach((el) => observer.observe(el));
});
