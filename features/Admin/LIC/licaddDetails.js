document.addEventListener("DOMContentLoaded", function() {
    const licName = document.getElementById("licName");
    const birthday = document.getElementById("licBirthday");
    const email = document.getElementById("licEmail");
    let code = document.getElementById("codeGenerator");
    const courseYear = document.getElementById("courseYear");
    const  idNumber = document.getElementById("idNumber");

    document.getElementById("AddLic").addEventListener("submit", async function(event) {
        event.preventDefault(); 

        document.querySelector('.codeBtn').addEventListener('click', function(event) {
            event.preventDefault();
            const generatedCode = generateUniqueCode(birthday.value);
            code.textContent = generatedCode;

            event.stopPropagation();
        });
    });
    document.getElementById("add").addEventListener("click", async function(event) {
        event.preventDefault();
        if(code.textContent.trim() !== ""){
            const profilePic = document.getElementById('profilePic').files[0];
            if(!profilePic){
                alert('Please add profile pic');
                return;
            }
            const dateOfBirth = new Date(birthday.value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-').split('T')[0];
            const formData = new FormData();
            formData.append('profilePic', profilePic);
            formData.append('name', licName.value);
            formData.append('birthday', dateOfBirth);
            formData.append('email', email.value);
            formData.append('courseYear', courseYear.value);
            formData.append('idNumber', idNumber.value);
            formData.append('generateCode', code.textContent);
            formData.append('password', '123');
            formData.append('admin', 'false');
            try {
                const response = await fetch('/createAccount', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (response.ok || response.status === 201) {
                    console.log(data.message);
                    alert("Laboratory In-charge added successfully");
    
                    document.getElementById("AddLic").reset();
                } else {
                    console.error(data.error);
                    alert("This laboratory in-charge already exists"); 
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }else{
            const requiredInputs = document.querySelectorAll("#AddLic [required]");
            for (const input of requiredInputs) {
                if (!input.checkValidity()) {
                    input.reportValidity()
                    break;
                }else{
                    code.textContent = 'fill-in required';
                    setTimeout(function() {
                        code.textContent = '';
                    }, 2000);
                    
                }
            }
        }
    });
});
function generateUniqueCode(birthday) {
    const dateOfBirth = new Date(birthday);
    const randomCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const formattedBirthday = dateOfBirth.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '');
    const code = `LIC-${formattedBirthday}-${randomCode}`;
    return code;
}
document.getElementById('profilePic').addEventListener('change', function(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var profileImage = document.getElementById('profileImage');
        profileImage.src = reader.result;
        profileImage.style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
});