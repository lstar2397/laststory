document.addEventListener("DOMContentLoaded", function () {
  const btnOpenModal = document.querySelector(".btn-modal");
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".close");
  const publishBtn = document.getElementById("btn-yes");
  const publicRadio = document.getElementById("public");
  const privateRadio = document.getElementById("private");
  const letterPublic = document.querySelector(".letter-Public");
  const letterPrivate = document.querySelector(".letter-Private");

  btnOpenModal.addEventListener("click", function () {
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

  publicRadio.addEventListener("change", function () {
    letterPublic.style.display = "block";
    letterPrivate.style.display = "none";
  });

  privateRadio.addEventListener("change", function () {
    letterPublic.style.display = "none";
    letterPrivate.style.display = "block";
  });

  publishBtn.addEventListener("click", function () {
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "publicTarget";
    emailInput.placeholder = "공개 대상을 입력하세요.";

    letterPrivate.appendChild(emailInput);
  });
  });

  // 초기에 공개 옵션 선택
  publicRadio.checked = true;
  letterPublic.style.display = "block";
  letterPrivate.style.display = "none";

  publishBtn.addEventListener("click", function () {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!publicRadio.checked) {
      const publicDate = document.getElementById("publicDate").value;
      const publicTime = document.getElementById("publicTime").value;
      const publicDateTime = publicDate + " " + publicTime;
      const publicDateObj = new Date(publicDateTime);
      const now = new Date();

      if (publicDateObj < now) {
        alert("현재 시간 이후로 설정해주세요.");
        return;
      }
      const publicTarget = document.getElementById("publicTarget").value;
    }
  });
});

function tempSave(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const privateKey = prompt("임시 저장을 위한 비밀번호를 입력해주세요.");
  if (!privateKey) {
    alert("비밀번호를 입력해주세요.");
  } else {
    const data = {
      title,
      content,
    };
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      privateKey
    ).toString();
    console.log(encrypted);

    fetch("/letterWrite/tempSave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encrypted }),
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
