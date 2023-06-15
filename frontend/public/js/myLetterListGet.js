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
        const listDiv = document.querySelector(".myLetterList");

        console.log(list);

        list.forEach((item) => {
          const div = document.createElement("div");
          div.className = "item";

          const postId = document.createElement("span");
          postId.innerHTML = "Post ID: " + item.postid;
          div.appendChild(postId);

          const title = document.createElement("h3");
          title.innerHTML = item.title;
          div.appendChild(title);

          const username = document.createElement("p");
          username.innerHTML = "By: " + item.username;
          div.appendChild(username);

          listDiv.appendChild(div);
        });
      } else {
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.error("에러 발생");
    });
}

myLetterListGet();
