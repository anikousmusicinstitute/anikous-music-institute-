const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");

registerBtn.onclick = async () => {

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !username || !password) {
        message.innerText = "Fill all fields";
        return;
    }

    const res = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            username,
            password,
            role
        })
    });

    const data = await res.json();

    if (data.success) {
        message.innerText = "User Created Successfully";
    } else {
        message.innerText = data.message;
    }

};
