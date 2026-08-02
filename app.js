// public/js/app.js

document.addEventListener("DOMContentLoaded", () => {

    console.log("Anikous Music Institute Loaded");


    // Join Now Button
    const joinBtn = document.querySelector(".hero button");

    if (joinBtn) {

        joinBtn.addEventListener("click", () => {
            window.location.href = "register.html";
        });

    }


    // Login Check
    const user = localStorage.getItem("user");

    if (user) {
        console.log("User Logged In:", user);
    }


    // Logout Function
    const logoutBtn = document.getElementById("logout");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.href = "login.html";

        });

    }


    // Navigation Protection
    const dashboardPages = [
        "teacher.html",
        "student.html"
    ];

    const currentPage = window.location.pathname;

    dashboardPages.forEach(page => {

        if (currentPage.includes(page)) {

            if (!localStorage.getItem("token")) {

                window.location.href = "login.html";

            }

        }

    });


});


// Save User Login Data

function saveUser(user, token){

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "token",
        token
    );

}


// Get Current User

function getUser(){

    return JSON.parse(
        localStorage.getItem("user")
    );

}


// Logout

function logout(){

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href="login.html";

}
