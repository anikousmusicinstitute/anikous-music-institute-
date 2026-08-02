const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.onclick = async () => {

    const role = document.getElementById("role").value;
    const username = document.getElementById("userid").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        message.innerText = "Enter User ID and Password";
        return;
    }

    const res = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await res.json();

    if (!data.success) {
        message.innerText = data.message;
        return;
    }

    if (role !== data.role) {
        message.innerText = "Wrong Role Selected";
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    if (data.role === "teacher") {
        window.location.href = "teacher.html";
    } else {
        window.location.href = "student.html";
    }
};
