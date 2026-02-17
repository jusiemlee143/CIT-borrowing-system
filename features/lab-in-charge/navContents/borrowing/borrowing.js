document.addEventListener('DOMContentLoaded', function() {
    fetchBorrowers();
});

async function fetchBorrowers(){
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const tableContainer = document.querySelector('.borrowingContent');

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
                if(!borrower.requestConfirmed && borrower.facultyConfirmed){
                    const borrowerContainer = document.createElement('tr');
                    const borrowerName = document.createElement('td');
                    borrowerName.classList.add('borrowerName');
                    borrowerName.textContent = borrower.studentName;
                    const confirmButton = document.createElement('td');
                    confirmButton.textContent = 'Confirm';
                    const declineButton = document.createElement('td');
                    declineButton.textContent = 'Decline';
                    
                    borrowerName.addEventListener('click', ()=>{
                        window.location.href = `/lab-in-charge/navContents/borrowing/borrowingDetails.html?id=${borrower._id}`;
                    });
                    confirmButton.addEventListener('click', async ()=>{
                        const response = await fetch('/confirmRequest', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ _id: borrower._id }),
                        });
                    
                        const data = await response.json();
                        alert(data.message);
                        fetchBorrowers();
                    });
                    declineButton.addEventListener('click', async ()=>{
                        console.log(borrower.tools);
                        const response = await fetch('/declineRequest', {
                            method: 'PUT',
                            headers:{
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ _id: borrower._id, tools: borrower.tools})
                        });

                        const data = await response.json();
                        alert(data.message);
                        fetchBorrowers();
                    });
                    borrowerContainer.appendChild(borrowerName);
                    borrowerContainer.appendChild(confirmButton);
                    borrowerContainer.appendChild(declineButton);

                    tableBody.appendChild(borrowerContainer);
                }
            });
            if(tableBody.children.length === 0){
                messageDiv.textContent = 'There are currently no borrower request';
                return;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}