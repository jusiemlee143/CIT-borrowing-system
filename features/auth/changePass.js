const form = document.getElementById("changePassForm");

form.addEventListener("submit", event => {
    event.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search); 
    const email = urlParams.get('email');

    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }
    fetch('/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, confirmPassword}),
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.error) {
            alert(data.error);
        } else if(data && data.message) {
            alert(data.message);
            window.location.href = '/auth/loginPage.html';
        }
    })
});