function IsEmailValid(email) {
    return email.indexOf("@") !== -1 && email.indexOf(".") !== -1;
}

function validateSignUp(event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const password_check = document.getElementById("password_check").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;

    const validationRules = [
        { field: "username", value: username, message: "아이디를 입력해주세요." },
        { field: "password", value: password, message: "비밀번호를 입력해주세요." },
        { field: "password_check", value: password_check, message: "비밀번호 확인을 입력해주세요." },
        { field: "password_match", value: password === password_check, message: "비밀번호가 일치하지 않습니다." },
        { field: "nickname", value: nickname, message: "닉네임을 입력해주세요." },
        { field: "email", value: email, message: "이메일을 입력해주세요." },
        { field: "email_format", value: IsEmailValid(email), message: "이메일 형식이 올바르지 않습니다." },
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
