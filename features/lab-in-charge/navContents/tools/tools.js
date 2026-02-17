document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    const searchInput = document.querySelector('.searchTools input');
    searchInput.addEventListener('input', findTool);
});

function fetchData(query = '') {
    fetch(`/getTools?query=${query}`)
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            displayData(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function findTool(event) {
    const query = event.target.value.trim();
    fetchData(query);
}

function displayData(data) {
    const dataContainer = document.getElementById('toolList');
    dataContainer.innerHTML = '';
    const tableContainer = document.querySelector('.searchContents');

    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    messageDiv.textContent = '';
    data.forEach(tool => {
        const listTool = document.createElement('li');
        listTool.textContent = tool.name;
        dataContainer.appendChild(listTool);
        
        listTool.addEventListener('click', () =>{
            window.location.href = `/lab-in-charge/navContents/tools/toolDetails.html?id=${tool._id}`;
        });
    });
    if(dataContainer.children.length === 0){
        messageDiv.textContent = 'NO TOOLS ADDED';
        return;
    }
}
const toolsEquip = document.getElementById("ToolsEquip");

toolsEquip.addEventListener("submit", async event =>{
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById('toolPic');

    const formData = new FormData();
    formData.append('toolPic', image.files[0]);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('price', price);

    console.log("Description: ", description);

    if(quantity < 1){
        alert("Quantity should not be less than 1!!!");
    }
    else {
        await fetch('/addToolsEquipment', {
        method: 'POST',
        body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.error) {
                alert(data.error);
            } else if(data && data.message) {
                alert(data.message);
            }
            window.location.reload();
        })
      .catch(error => console.error('Error adding tools/equipments:', error));
    }
});
document.getElementById('toolPic').addEventListener('change', function(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var profileImage = document.getElementById('toolImage');
        profileImage.src = reader.result;
        profileImage.style.display = 'block';
        var imageLabel = document.getElementById('imageLabel');
        imageLabel.textContent = event.target.files[0].name;
    }
    reader.readAsDataURL(event.target.files[0]);
});