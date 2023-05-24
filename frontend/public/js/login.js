function valid_login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("아이디와 비밀번호를 입력해주세요.");
    event.preventDefault();
  }
}
