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
        localStorage.setItem("token", res.token);
        location.href = "main";
      } else {
        alert("로그인 실패");
      }
    });
}
