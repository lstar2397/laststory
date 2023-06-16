document.addEventListener("DOMContentLoaded", function () {
  const btnOpenModal = document.querySelector(".btn-modal");
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".close");

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
});

async function pushLetter(event) {
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

  const filename = `letter-${now}.txt`;

  const fileContent = `Title: ${title}\n\n${content}`; // Combine title and content

  const file = new File([fileContent], filename, { type: "text/plain" });

  const cid = await uploadFileToIpfs(file, filename);

  alert("CID: " + cid);

  // cid
  console.log("cid: ", cid);
  // 공개시간
  console.log("publicDate: ", publicDate);
  // 공개 대상 지갑주소
  console.log("publicTarget: ", publicTarget);
}

async function uploadFileToIpfs(file, filename) {
  const formData = new FormData();
  formData.append("file", file, filename);

  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`,
      Accept: "application/json",
    },
    body: formData,
  });
  const result = await response.json();

  return result.cid;
}

function tempSave(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const token = localStorage.getItem("token");

  if (title === "") {
    alert("제목을 입력해주세요.");
    return;
  }
  if (content === "") {
    alert("내용을 입력해주세요.");
    return;
  }

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
      body: JSON.stringify({ title, encrypted, token }),
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

function tempUpdate(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const token = localStorage.getItem("token");
  const postId = localStorage.getItem("postid");

  if (title === "") {
    alert("제목을 입력해주세요.");
    return;
  }
  if (content === "") {
    alert("내용을 입력해주세요.");
    return;
  }

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

    fetch("/letterUpdate/tempUpdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, encrypted, token, postId }),
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

function updateLetter() {
  const title = document.getElementById("title");
  const content = document.getElementById("content");

  const localStorageTitle = localStorage.getItem("title");
  const localStorageContent = localStorage.getItem("content");

  if (localStorageTitle === "" && localStorageContent === "") {
    return;
  } else {
    title.value = localStorageTitle;
    content.value = localStorageContent;

    localStorage.removeItem("title");
    localStorage.removeItem("content");
  }
}

updateLetter();
