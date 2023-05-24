function vaild_signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const password_check = document.getElementById("password_check").value;
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;

  if (username === "") {
    alert("아이디를 입력해주세요.");
    event.preventDefault();
  } else if (password === "") {
    alert("비밀번호를 입력해주세요.");
    event.preventDefault();
  } else if (password_check === "") {
    alert("비밀번호 확인을 입력해주세요.");
    event.preventDefault();
  } else if (password !== password_check) {
    alert("비밀번호가 일치하지 않습니다.");
    event.preventDefault();
  } else if (nickname === "") {
    alert("닉네임을 입력해주세요.");
    event.preventDefault();
  } else if (email === "") {
    alert("이메일을 입력해주세요.");
    event.preventDefault();
  } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    alert("이메일 형식이 올바르지 않습니다.");
    event.preventDefault();
  }
}
