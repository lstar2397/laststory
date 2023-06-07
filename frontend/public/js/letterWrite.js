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

function postLetter(event) {
  event.preventDefault();
  const popup = document.getElementById("popup");
  popup.style.display = "block";
}

function closePopup() {
  popup.style.display = "none";
}
