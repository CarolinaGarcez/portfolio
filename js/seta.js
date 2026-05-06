const scrollBtn = document.getElementById("scrollBtn");

scrollBtn.addEventListener("click", () => {
  const sections = document.querySelectorAll("main section");
  const scrollPosition = window.scrollY;

  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].offsetTop;

    if (sectionTop > scrollPosition + 50) {
      sections[i].scrollIntoView({ behavior: "smooth" });
      break;
    }
  }
});