document.addEventListener("DOMContentLoaded", function () {
  const btnOpenModal = document.querySelector(".btn-modal");
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".close");
  const letterPrivate = document.querySelector(".letter-Private");

  btnOpenModal.addEventListener("click", function () {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    if (content === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    modal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  addTarget.addEventListener("click", function () {
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "publicTarget";
    emailInput.placeholder = "공개 대상을 입력하세요.";

    letterPrivate.appendChild(emailInput);
  });
});

function pushLetter(event) {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const publicDate = document.getElementById("publicDate").value;
  const publicDateObj = new Date(publicDate);
  const now = new Date();

  if (publicDateObj < now) {
    alert("현재 시간 이후로 설정해주세요.");
    return;
  }

  const publicTarget = document.getElementById("publicTarget").value;

  console.log(title, content, publicTarget);
}

function tempSave(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const privateKey = prompt("임시 저장을 위한 비밀번호를 입력해주세요.");
  if (!privateKey) {
    alert("비밀번호를 입력해주세요.");
  }
  if (privateKey) {
    const data = {
      title,
      content,
    };
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      privateKey
    ).toString();

    fetch("/letterWrite/tempSave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, encrypted }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.result === "success") {
          alert("임시 저장되었습니다.");
          location.href = "/myLetterList";
        } else {
          alert("임시 저장에 실패하였습니다.");
        }
      })
      .catch((err) => {
        console.error("임시 저장 중 에러 발생");
      });
  }
}
