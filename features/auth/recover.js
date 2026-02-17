const form = document.getElementById("recoverAccountForm");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const Email = document.getElementById("email");
var CODE = 0;

form.addEventListener("submit", async event => {
    event.preventDefault();
    
    var inputtedCode = document.getElementById("code").value;
    if( CODE == inputtedCode){
        alert('Thank you for confirming. Redirecting to Change Password');
        window.location.href = `/auth/changePassword.html?email=${encodeURIComponent(Email.value)}`;
    }
    else{
        alert('Wrong Code. Please try again');
        inputtedCode.value = "";
    }
});

sendCodeBtn.addEventListener("click", async event =>{
    event.preventDefault();
    try{
        var email = Email.value;
        const response = await fetch('/checkEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        if (response.ok){
            const data = await response.json();
            if(data.exists){
                CODE = generateCode();
                const codeSent = await Code(email, CODE);
                if(codeSent){
                    alert('Code sent successfully!\nYou can now check your email for the verification code.');
                }
                else{
                    alert('Failed to send code');
                }
            }
        }
        else{
            alert('Email does not exist!');
        }
    } catch (error){
        console.error('Error', error);
    }
});

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function Code(email, code) {
    try {
        const response = await fetch('/sendCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code })
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending code:', error);
        return false;
    }
}