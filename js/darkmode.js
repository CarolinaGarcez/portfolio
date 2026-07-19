// DARK MODE
const toggleThemeBtn = document.getElementById("toggle-theme");
const toggleIcon = toggleThemeBtn ? toggleThemeBtn.querySelector("i") : null;

// Verifica o tema salvo no localStorage
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  if (toggleIcon) {
    toggleIcon.classList.replace("fa-moon", "fa-sun");
  }
}

if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    // Troca o ícone e salva no localStorage
    if (document.body.classList.contains("dark-mode")) {
      if (toggleIcon) toggleIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      if (toggleIcon) toggleIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
    }
  });
}
