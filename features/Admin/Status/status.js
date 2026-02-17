document.addEventListener('DOMContentLoaded', function() {
    fetchBorrowers();
});

async function fetchBorrowers(){
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const tableContainer = document.querySelector('.statusContent');
    
    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    messageDiv.textContent = '';

    await fetch(`/getBorrowers`)
        .then(response => response.json())
        .then(data => {
            data.borrowers.forEach(borrower => {
                if(!borrower.returned && !borrower.damage && !borrower.lost && borrower.facultyConfirmed){
                    const borrowerContainer = document.createElement('tr');
                    const borrowerName = document.createElement('td');
                    borrowerName.classList.add('borrowerName');
                    borrowerName.textContent = borrower.studentName;
                    const statusCell = document.createElement('td');
                    
                    const dateBorrowedCell = document.createElement('td');
                    if(!borrower.requestConfirmed){
                        statusCell.textContent = 'Pending';
                        dateBorrowedCell.textContent = borrower.dateBorrowed;
                    }
                    else{
                        statusCell.textContent = 'Borrowing';
                        dateBorrowedCell.textContent = borrower.dateBorrowed;
                    }
                    
                    borrowerName.addEventListener('click', ()=>{
                        window.location.href = `/Admin/Status/statusDetails.html?id=${borrower._id}`;
                    });
                    borrowerContainer.appendChild(borrowerName);
                    borrowerContainer.appendChild(statusCell);
                    borrowerContainer.appendChild(dateBorrowedCell);
                    tableBody.appendChild(borrowerContainer);
                }
            });
            if(tableBody.children.length === 0){
                messageDiv.textContent = 'There are currently no borrowers';
                return;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}
