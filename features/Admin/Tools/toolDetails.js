document.addEventListener("DOMContentLoaded", () => {
    // Get the tool ID from the query parameter
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get("id");

    let tool = null;

    // Fetch tool details using the tool ID
    fetch(`/getToolDetails?id=${toolId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tool details');
            }
            return response.json();
        })
        .then(fetchedTool => {
            tool = fetchedTool;
            displayToolDetails(tool);
        })
        .catch(error => console.error('Error fetching tool details:', error));

    const displayToolDetails = (tool) => {
        document.getElementById("name").textContent = tool.name;
        document.getElementById("description").textContent = tool.description;
        document.getElementById("quantity").textContent = `Quantity | ${tool.quantity}`;
        document.getElementById("price").textContent = `₱${tool.price}`;
        // const toolImage = document.getElementById('uploadedImage');
        // toolImage.src = `/images/${tool.img}`;
        const imgElement = document.getElementById('uploadedImage');
        imgElement.src = `/images/${tool.img}`;
        imgElement.style.display = 'block';
    };

    // Add event listener to handle image upload and display
    document.getElementById('imageUpload').addEventListener('change', function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const imgElement = document.getElementById('uploadedImage');
            imgElement.src = reader.result;
            imgElement.style.display = 'block';
        }
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    document.getElementById("edit").addEventListener("click", () => {
        // Replace text with input fields for editing
        saveBtn.disabled = false; 
        const editImage = document.getElementById('editImage');
        editImage.style.display = 'flex';
        const nameElement = document.getElementById("name");
        nameElement.innerHTML = `<input type="text" id="editname" value="${tool.name}" class="edit-input">`;

        const descriptionElement = document.getElementById("description");
        descriptionElement.innerHTML = `<input type="text" id="editDescription" value="${tool.description}" class="edit-input">`;

        const quantityElement = document.getElementById("quantity");
        quantityElement.innerHTML = `Quantity: <input type="number" id="editQuantity" value="${tool.quantity}" class="edit-input">`;

        const priceElement = document.getElementById("price");
        priceElement.innerHTML = `Price: ₱<input type="number" id="editPrice" value="${tool.price}" step="0.01" class="edit-input">`;
    });

    const saveBtn = document.getElementById("save");
    saveBtn.addEventListener("click", () => {
        saveBtn.disabled = true;
        const editImage = document.getElementById('editImage');
        editImage.style.display = 'none';
        // Get the updated values
        const toolPic = document.getElementById('imageUpload').files[0];
        const updatedName = document.getElementById("editname").value;
        const updatedDescription = document.getElementById("editDescription").value;
        const updatedQuantity = parseInt(document.getElementById("editQuantity").value, 10);
        const updatedPrice = parseInt(document.getElementById("editPrice").value, 10);

        const isToolPicChanged = toolPic ? true : false;
        const isNameChanged = updatedName !== tool.name;
        const isDescriptionChanged = updatedDescription !== tool.description;
        const isQuantityChanged = updatedQuantity !== tool.quantity;
        const isPriceChanged = updatedPrice !== tool.price;
        if (!isToolPicChanged && !isNameChanged && !isDescriptionChanged && !isQuantityChanged && !isPriceChanged) {
            alert('No changes made');
            return;
        }
        const formData = new FormData();
        formData.append('imageUpload', toolPic);
        formData.append('name', updatedName);
        formData.append('description', updatedDescription);
        formData.append('quantity', updatedQuantity);
        formData.append('price', updatedPrice);
        // Send updated details to the server
        fetch(`/updateToolDetails?id=${toolId}`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update tool details');
            }
            return response.json()
        })
        .then(data =>{
            if(!data.error){
                window.location.reload();
                alert('Tool details updated successfully!');
            }
        })
        .catch(error => console.error('Error updating tool details:', error));
        
        
    });

    document.getElementById("delete").addEventListener("click", () => {
        // Send request to delete the tool
        const confirmDelete = window.confirm("Are you sure you want to delete this data?");

        if (confirmDelete) {
            fetch(`/deleteTool?id=${toolId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete tool');
                }
                alert('Tool deleted successfully!');
                // Redirect to the tools list page or another appropriate page
                window.location.href = '/Admin/Tools/tools.html';
            })
            .catch(error => console.error('Error deleting tool:', error));
        }
        
    });
});
