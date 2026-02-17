const form = document.getElementById("createAccountForm");

form.addEventListener("submit", event => {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var admin = false;
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }

    fetch('/createAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, admin})
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.error) {
            alert(data.error);
        } else if(data && data.message) {
            alert(data.message);
            window.location.href= '/auth/loginPage.html';
        }
    })
    .catch(error => console.error('Error creating account:', error));
});