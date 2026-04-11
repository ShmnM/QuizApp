
document.addEventListener("DOMContentLoaded", () => {
  const darkBtn = document.getElementById("darkModeBtn");
  const body = document.body;

  function updateDarkMode() {
    if (localStorage.getItem("darkMode") === "true") {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
  }

  if (darkBtn) {
    darkBtn.addEventListener("click", () => {
      const isDark = body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", (!isDark).toString());
      updateDarkMode();
    });
  }

  updateDarkMode();
});
