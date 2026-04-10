// Espera o HTML carregar antes de rodar o JS
document.addEventListener("DOMContentLoaded", () => {

  // TEXTO ANIMADO
  const element = document.querySelector("#element");

  if (element) {
    new Typed("#element", {
      strings: ["Front-End Developer em formação", "HTML, CSS e JavaScript", "Suporte de TI"],
      startDelay: 1000,
      typeSpeed: 50,
      backSpeed: 80,
      loop: true
    });
  }

});