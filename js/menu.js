// MENU MOBILE
  const bars = document.querySelector(".bars");
  const menu = document.querySelector("#menu");

  if (bars && menu) {
    bars.addEventListener("click", () => {
      menu.classList.toggle("mobile-menu");
    });
  }