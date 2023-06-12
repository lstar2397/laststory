document.addEventListener("DOMContentLoaded", function () {
  const authButtons = document.getElementById("auth-buttons");
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  if (authButtons) {
    const isLoggedIn = sessionStorage.getItem("user");

    if (isLoggedIn) {
      loginButton.style.display = "none";
      logoutButton.style.display = "block";
    } else {
      loginButton.style.display = "block";
      logoutButton.style.display = "none";
    }
  }

  logoutButton.addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.clear();
    location.href = "login";
  });
});
