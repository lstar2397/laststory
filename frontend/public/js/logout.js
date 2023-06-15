document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
  } else {
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  }

  logoutButton.addEventListener("click", function (event) {
    localStorage.removeItem("accessToken");
    location.href = "login";
  });
});
