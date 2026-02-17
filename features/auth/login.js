const login = document.getElementById("loginAccount");

login.addEventListener("submit", async event =>{
    event.preventDefault();
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    await fetch('/checkAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password})
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.error) {
            alert(data.error);
        } else if(data && data.message) {
            if(data.isAdmin){
                const modalContent = document.getElementById('modal-content');
                const modalPlaceholder = document.getElementById('modal');
                modalPlaceholder.style.display = 'block';
                modalPlaceholder.appendChild(modalContent);

                modalPlaceholder.addEventListener('click', (event) =>{
                    if (event.target === modalPlaceholder) {
                        modal.style.display = 'none';
                    }
                });
            } else{
                alert(data.message);
                window.location.href= '/lab-in-charge/navContents/tools/tools.html';
            }
        } 
    })
    .catch(error => console.error('Error logging account:', error));
});

const adminBtn = document.getElementById('adminBtn');
const licBtn = document.getElementById('licBtn');
adminBtn.addEventListener('click', () => {
    window.location.href= '/Admin/Tools/tools.html';
    
    alert("Login Successful as Admin");
});
licBtn.addEventListener('click', () => {
    window.location.href= '/lab-in-charge/navContents/tools/tools.html';
    
    alert("Login Successful");
});