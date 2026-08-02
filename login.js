const loginBtn = document.getElementById("loginBtn");
const role = document.getElementById("role");
const userid = document.getElementById("userid");
const password = document.getElementById("password");
const message = document.getElementById("message");

loginBtn.onclick = () => {

    const user = userid.value.trim();
    const pass = password.value.trim();
    const userRole = role.value;

    if (!user || !pass) {
        message.innerText = "Enter User ID and Password";
        return;
    }

    // Demo Login
    if (userRole === "teacher" &&
        user === "teacher" &&
        pass === "1234") {

        window.location.href = "index.html";
        return;
    }

    if (userRole === "student" &&
        user === "student1" &&
        pass === "1234") {

        window.location.href = "index.html";
        return;
    }

    message.innerText = "Invalid User ID or Password";

};
