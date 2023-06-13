require("dotenv").config();

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-button");

  logoutBtn.addEventListener("click", function (event) {
    fetch(`/logout${BACKEND_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          location.href = "/login";
        } else {
          alert(res.msg);
        }
      })
      .catch((err) => {
        console.error("로그아웃 중 에러 발생");
      });
  });
});
