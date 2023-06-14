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

//////////////////////////////

function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.state === 200) {
        localStorage.setItem("accessToken", res.accessToken);
        location.href = "main";
      } else {
        alert("로그인 실패");
      }
    });
}
