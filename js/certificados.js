// certificados.js

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".certificate-card");

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    // remove active
    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    // adiciona active
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    cards.forEach(card => {

      const category = card.getAttribute("data-category");

      if(filter === "all" || filter === category){

        card.style.display = "block";

      } else {

        card.style.display = "none";

      }

    });

  });

});