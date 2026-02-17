document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Extract user ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        // Fetch user details using the user ID
        const response = await fetch(`/getUsers?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();

        let user;
        for (const userDataItem of userData) {
            if (userDataItem._id === userId) {
                user = userDataItem;
                break;
            }
        }

        if (!user) {
            console.log('User not found with ID:', userId);
            return;
        }
        //test
        console.log('Img:', user.img);
        console.log('Name:', user.name);
        console.log('Username:', user.username);
        console.log('Email:', user.email);
        console.log('Course & Year:', user.courseYear);
        console.log('Birthday:', user.birthday); 
        console.log('ID Number:', user.idNumber);

        
        const originalImageFilename = user.img;

        // Populate HTML elements with user data
        if (userId == user._id) {
            const profileImage = document.getElementById('profileImage');
            profileImage.src = `/images/${user.img}`;
        
            document.getElementById('licName').value = user.name || "N/A";
            document.getElementById('Code').value = user.username || "N/A";
            document.getElementById('licEmail').value = user.email || "N/A";
            document.getElementById('courseYear').value = user.courseYear || "N/A";
            document.getElementById('licBirthday').value = user.birthday || "N/A"; 
            document.getElementById('idNumber').value = user.idNumber || "N/A"; 
        } else {
            console.log(userId);
        }

        // Edit button click event handler
        document.getElementById("Edit").addEventListener("click", function() {
            alert("You're in edit mode");
            document.getElementById('profilePic').disabled = false;
            document.getElementById('camera').style.display = 'flex';
            document.querySelectorAll("input:not([id='Code'])").forEach(function(input) {
                input.removeAttribute("readonly");
                
            });
        });

        // Save button click event handler
        document.getElementById("Save").addEventListener("click", async function() {
            
            const newImageFilename = document.getElementById('profilePic').files[0]?.name;

            // Compare the new image filename with the original one
            const isImageChanged = newImageFilename && newImageFilename !== originalImageFilename;

            const formData = new FormData();
            const newImageFile = document.getElementById('profilePic').files[0];
            formData.append('profilePic', newImageFile);

            // Append other updated fields to the formData object
            formData.append('name', document.getElementById('licName').value);
            formData.append('birthday', document.getElementById('licBirthday').value);
            formData.append('email', document.getElementById('licEmail').value);
            formData.append('courseYear', document.getElementById('courseYear').value);
            formData.append('idNumber', document.getElementById('idNumber').value);
            // Compare the updated data with the original user data
            const isDataChanged = (
                document.getElementById('licName').value !== user.name ||
                document.getElementById('licBirthday').value !== user.birthday ||
                document.getElementById('licEmail').value !== user.email ||
                document.getElementById('courseYear').value !== user.courseYear ||
                document.getElementById('idNumber').value !== user.idNumber ||
                isImageChanged
            );
        
            document.querySelectorAll("input:not([id='Code'])").forEach(function(input) {
                input.setAttribute("readonly", true);
            });
            document.getElementById('profilePic').disabled = true;
            document.getElementById('camera').style.display = 'none';

            if (!isDataChanged) {
                alert("No changes made");
                return;
            }
        
            try {
                const response = await fetch(`/updateLic?id=${userId}`, {
                    method: 'PUT',
                    body: formData
                });
                if (!response.ok) {
                    throw new Error('Failed to update LIC data');
                }
                alert("LIC data updated successfully");
            } catch (error) {
                console.error('Error updating LIC data:', error);
            }
        });
        
        

       //delete button
        document.getElementById("Delete").addEventListener("click", async function() {
            const confirmDelete = window.confirm("Are you sure you want to delete this data?");
            if (confirmDelete) {
                try {
                    const response = await fetch(`/deleteLic?id=${userId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete LIC data');
                    }
                    alert("LIC data deleted successfully");
                    
                    document.querySelectorAll("input").forEach(function(input) {
                        input.value = "";
                    window.location.href = `/Admin/LIC/lic.html`;
                    });
                } catch (error) {
                    console.error('Error deleting LIC data:', error);
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
document.getElementById('profilePic').addEventListener('change', function(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var profileImage = document.getElementById('profileImage');
        profileImage.src = reader.result;
        profileImage.style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
});
