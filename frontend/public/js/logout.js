require("dotenv").config();

function logout() {
  fetch(`/logout/${BACKEND_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("로그아웃 중 에러 발생");
    });
}
