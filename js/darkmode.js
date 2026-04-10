
  // DARK MODE
  const sun = document.querySelector(".fa-sun");

  if (sun) {
    sun.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }
