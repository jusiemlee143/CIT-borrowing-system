let modalContent;

document.addEventListener('DOMContentLoaded', async function() {
    fetchBorrowers();
    const modalResponse = await fetch('modal.html');
    const modalHtml = await modalResponse.text();
    const tempElement = document.createElement('div');
    tempElement.innerHTML = modalHtml;
    modalContent = tempElement.querySelector('.modal-content');
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
                    
                    const returnButton = document.createElement('td');
                    returnButton.textContent = 'Returned';
                    const onHoldButton = document.createElement('td');
                    onHoldButton.textContent = 'On-Hold';
                    if(borrower.requestConfirmed){
                        statusCell.textContent = 'Borrowing';
                        returnButton.classList.remove('disabled');
                        onHoldButton.classList.remove('disabled');
                    }else{
                        statusCell.textContent = 'Pending';
                        returnButton.classList.add('disabled');
                        onHoldButton.classList.add('disabled');
                    }
                    
                    borrowerName.addEventListener('click', ()=>{
                        window.location.href = `/lab-in-charge/navContents/status/statusDetails.html?id=${borrower._id}`;
                    });
                    returnButton.addEventListener('click', async ()=>{
                        const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '-');
                        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                        if (!returnButton.classList.contains('disabled')) {
                            const response = await fetch('/returned', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    _id: borrower._id, 
                                    returned: true, 
                                    // tools: borrower.tools,
                                    dateReturned: currentDate,
                                    timeReturned: currentTime,
                                 }),
                            });
                            const data = await response.json();
                            alert(data.message);
                            fetchBorrowers();
                        }                
                    });
                    onHoldButton.addEventListener('click', async () => {
                        if (!onHoldButton.classList.contains('disabled')) {
                            // const modal = document.getElementById('modal');
                            

                            const modalPlaceholder = document.getElementById('modal');
                            modalPlaceholder.style.display = 'block';
                            modalPlaceholder.appendChild(modalContent);
                            
                            const damageBtn = document.getElementById('damagedBtn');
                            const lostBtn = document.getElementById('lostBtn');
                            const bothBtn = document.getElementById('bothBtn');
                            let button;
                            damageBtn.addEventListener('click', () => {
                                // modal.style.display = 'none';
                                button = 'damageBtn';
                                window.location.href = `/lab-in-charge/navContents/status/onHoldTools.html?id=${borrower._id}&button=${button}`;
                            });

                            lostBtn.addEventListener('click', () => {
                                // modal.style.display = 'none';
                                button = 'lostBtn';
                                window.location.href = `/lab-in-charge/navContents/status/onHoldTools.html?id=${borrower._id}&button=${button}`;
                            });
                            bothBtn.addEventListener('click', () => {
                                // modal.style.display = 'none';
                                button = 'bothBtn';
                                window.location.href = `/lab-in-charge/navContents/status/onHoldTools.html?id=${borrower._id}&button=${button}`;
                            });
                            modalPlaceholder.addEventListener('click', (event) =>{
                                if (event.target === modalPlaceholder) {
                                    modal.style.display = 'none';
                                }
                            });
                        }
                    });
                    borrowerContainer.appendChild(borrowerName);
                    borrowerContainer.appendChild(statusCell);
                    borrowerContainer.appendChild(returnButton);
                    borrowerContainer.appendChild(onHoldButton);

                    tableBody.appendChild(borrowerContainer);
                }
            });
            if(tableBody.children.length === 0){
                messageDiv.textContent = '';
                messageDiv.textContent = 'NO CURRENT BORROWERS';
                return;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}