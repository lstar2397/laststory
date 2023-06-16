async function myLetterListGet() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    location.href = "login";
  }

  fetch("/myLetterList/getList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.result === "success") {
        const list = res.myPost;

        const listTable = document.querySelector(".myLetterList");

        list.forEach((item) => {
          const tr = document.createElement("tr");
          tr.className = "item";

          const postId = document.createElement("td");
          postId.innerHTML = item.postid;
          tr.appendChild(postId);

          const title = document.createElement("td");
          title.innerHTML = item.title;
          tr.appendChild(title);

          const fixButton = document.createElement("button");
          fixButton.innerHTML = "수정";
          fixButton.addEventListener("click", () => {
            const password = prompt("비밀번호를 입력해주세요.");

            const Decrypt = CryptoJS.AES.decrypt(item.encrypted, password);
            const data = Decrypt.toString(CryptoJS.enc.Utf8);

            console.log(data);

            console.log(item.postid);

            const jsonData = JSON.parse(data);

            if (data === "") {
              alert("비밀번호가 일치하지 않습니다.");
            } else {
              localStorage.setItem("title", jsonData.title);
              localStorage.setItem("content", jsonData.content);
              localStorage.setItem("postid", item.postid);
              location.href = "/letterUpdate";
            }
          });
          tr.appendChild(fixButton);

          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = "삭제";
          deleteButton.addEventListener("click", () => {
            const confirm = prompt("비밀번호를 입력해주세요.");
            if (confirm) {
              fetch("/myLetterList/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, postid: item.postid, confirm }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.result === "success") {
                    alert("삭제되었습니다.");
                    location.href = "/myLetterList";
                  } else {
                    alert("비밀번호가 일치하지 않습니다.");
                  }
                })
                .catch((err) => {
                  console.error("에러 발생");
                });
            }
          });
          tr.appendChild(deleteButton);

          listTable.appendChild(tr);
        });
      } else {
        alert("로그인이 필요합니다.");
        location.href = "login";
      }
    })
    .catch((err) => {
      console.error("에러 발생");
    });
}
