
document.addEventListener("DOMContentLoaded", async function() {
    
    await fetchData();

   
    const addButton = document.getElementById('buttonContainer');
    addButton.addEventListener('click', function() {
        
        window.location.href = 'addFaculty.html';
    });

    const searchInput = document.querySelector('.searchTools input');
    searchInput.addEventListener('input', findFaculty);
});

async function fetchData(query = '') {
    await fetch(`/getFaculties?query=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            displayFaculty(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

async function findFaculty(event) {
    const query = event.target.value.trim();
    await fetchData(query);
}

function displayFaculty(data) {
    const facultyList = document.getElementById('facultyList');
    facultyList.innerHTML = '';
    const tableContainer = document.querySelector('.borrowingContent');

    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    messageDiv.textContent = '';

    data.forEach(faculty => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = faculty.name;
        const idNumber = document.createElement('td');
        idNumber.textContent = faculty.idNumber;
        row.addEventListener('click', () =>{
            window.location.href = `/Admin/Faculty/facultydetails.html?id=${faculty._id}`;
        });

        row.appendChild(nameCell);
        row.appendChild(idNumber);
        facultyList.appendChild(row);
    });
    if(facultyList.children.length === 0){
        messageDiv.textContent = 'NO FACULTY ADDED!';
        return;
    }
}