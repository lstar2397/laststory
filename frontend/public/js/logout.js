document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  const token = localStorage.getItem("token");

  if (token) {
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
  } else {
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  }

  console.log(token);

  logoutButton.addEventListener("click", function (event) {
    localStorage.removeItem("token");
    location.href = "login";
  });
});
