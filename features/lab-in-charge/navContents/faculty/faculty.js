
document.addEventListener("DOMContentLoaded", async function() {
    await fetchData();

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
    const tableBody = document.getElementById('facultyList');
    tableBody.innerHTML = '';
    const tableContainer = document.querySelector('.facultyContent');

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
        nameCell.classList.add("facultyName");
        const idNumber = document.createElement('td');
        idNumber.textContent = faculty.idNumber;
        nameCell.textContent = faculty.name;
        nameCell.addEventListener('click', () =>{
            window.location.href = `/lab-in-charge/navContents/faculty/facultydetails.html?id=${faculty._id}`;
        });

        row.appendChild(nameCell);
        row.appendChild(idNumber);
        tableBody.appendChild(row);
    });
    if(facultyList.children.length === 0){
        messageDiv.textContent = 'NO FACULTY ADDED';
        return;
    }
}

