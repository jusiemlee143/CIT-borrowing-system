document.addEventListener('DOMContentLoaded', function() {
    fetchBorrowers();

    const section = document.getElementById('sectionSelect');
    section.addEventListener('change', findBorrower);

    const searchInput = document.querySelector('.searchTools input');
    searchInput.addEventListener('input', findBorrower);
});

async function fetchBorrowers(query = '', section = '') {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const tableContainer = document.querySelector('.historyContent');

    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    
    messageDiv.textContent = '';

    await fetch(`/getBorrowers?query=${query}&section=${section}`)
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            displayBorrowers(data.borrowers); 
            if(tableBody.children.length === 0){
                messageDiv.textContent = 'NO HISTORY FOUND!';
                return;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

async function findBorrower(event) {
    const section = document.getElementById('sectionSelect');
    const selectedOption = section.value;
    const query = event.target.value.trim();
    await fetchBorrowers(query, selectedOption);
}

function displayBorrowers(borrowers) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    borrowers.forEach(borrower => {
        if(borrower.returned){
            const borrowerContainer = document.createElement('tr');
            const borrowerName = document.createElement('td');
            borrowerName.textContent = borrower.studentName;
            const section = document.createElement('td');
            section.textContent = borrower.section;
            const dateBorrowed = document.createElement('td');
            dateBorrowed.textContent = borrower.dateBorrowed;
            const dateReturned = document.createElement('td');
            dateReturned.textContent = borrower.dateReturned;

            borrowerContainer.addEventListener('click', () => {
                window.location.href = `/Admin/History/historydetails.html?id=${borrower._id}`;
            });
            borrowerContainer.appendChild(borrowerName);
            borrowerContainer.appendChild(section);
            borrowerContainer.appendChild(dateBorrowed);
            borrowerContainer.appendChild(dateReturned);

            tableBody.appendChild(borrowerContainer);
        }
    });
}
