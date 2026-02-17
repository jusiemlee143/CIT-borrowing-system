document.addEventListener("DOMContentLoaded", function() {
    console.log('This is loaded');
    fetch('/chat.html')
        .then(response => response.text())
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.appendChild(div);
        });
});