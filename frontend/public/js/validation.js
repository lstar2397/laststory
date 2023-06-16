function IsEmailValid(email) {
  return email.indexOf("@") !== -1 && email.indexOf(".") !== -1;
}

function IsMetaMaskAddressValid(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function validateSignUp(event) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const password_check = document.getElementById("password_check").value;
  const nickname = document.getElementById("nickname").value;
  const metamask_address = document.getElementById("metamask_address").value;
  const email = document.getElementById("email").value;

  const validationRules = [
    { field: "username", value: username, message: "아이디를 입력해주세요." },
    { field: "password", value: password, message: "비밀번호를 입력해주세요." },
    {
      field: "password_check",
      value: password_check,
      message: "비밀번호 확인을 입력해주세요.",
    },
    {
      field: "password_length",
      value: password.length >= 8,
      message: "비밀번호는 8자 이상이어야 합니다.",
    },
    {
      field: "password_match",
      value: password === password_check,
      message: "비밀번호가 일치하지 않습니다.",
    },
    { field: "nickname", value: nickname, message: "닉네임을 입력해주세요." },
    {
      field: "metamask_address",
      value: IsMetaMaskAddressValid(metamask_address),
      message: "메타마스크 주소 형식에 맞지 않습니다. 주소를 불러와주세요.",
    },
    { field: "email", value: email, message: "이메일을 입력해주세요." },
    {
      field: "email_format",
      value: IsEmailValid(email),
      message: "이메일 형식이 올바르지 않습니다.",
    },
    {
      field: "auth",
      value: document.getElementById("auth").value,
      message: "인증번호를 입력해주세요.",
    },
  ];

  for (const rule of validationRules) {
    if (!rule.value) {
      alert(rule.message);
      event.preventDefault();
      return;
    }
  }
}

function validateLogin(event) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const validationRules = [
    { field: "username", value: username, message: "아이디를 입력해주세요." },
    { field: "password", value: password, message: "비밀번호를 입력해주세요." },
  ];

  for (const rule of validationRules) {
    if (!rule.value) {
      alert(rule.message);
      event.preventDefault();
      return;
    }
  }
}

function authSend() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;

  fetch("/signup/authentication", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.result === "success") {
        alert("인증번호가 전송되었습니다.");
      } else {
        alert("인증번호 전송에 실패하였습니다.");
      }
    });
}

function getMetamaskAddress() {
  const metamaskAddress = document.getElementById("metamask_address");

  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(function (accounts) {
        const address = accounts[0];
        metamaskAddress.value = address;
      })
      .catch(function (error) {
        console.log(error);
        alert("MetaMask에서 주소를 가져오는 동안 오류가 발생했습니다.");
      });
  } else {
    alert("MetaMask를 설치 및 로그인 해주세요.");
    window.open(
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      "_blank"
    );
  }
}
