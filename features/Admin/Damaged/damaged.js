document.addEventListener("DOMContentLoaded", function() {
    fetchOnHoldBorrowers();

    const searchInput = document.querySelector('.searchTools input');
    searchInput.addEventListener('input', findBorrower);
});

async function findBorrower(event) {
    const query = event.target.value.trim();
    await fetchOnHoldBorrowers(query);
}

async function fetchOnHoldBorrowers(query = ''){
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const tableContainer = document.querySelector('.damagedContent');

    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    messageDiv.textContent = '';
    
    await fetch(`/getBorrowers?query=${query}`)
        .then(response => response.json())
        .then(data => {
            data.borrowers.forEach(borrower => {
                if((borrower.damage || borrower.lost) && !borrower.returned){
                    const borrowerContainer = document.createElement('tr');

                    const accountable = document.createElement('td');
                    accountable.textContent = borrower.studentName;

                    const reasonOnHold = document.createElement('td');
                    reasonOnHold.textContent = (borrower.lost && borrower.damage) ? 'Lost & Damage' : (borrower.lost ? 'Lost' : 'Damage');

                    const dateOnHold = document.createElement('td');
                    dateOnHold.textContent = borrower.dateOnHold;

                    borrowerContainer.addEventListener('click', ()=>{
                        window.location.href = `/Admin/Damaged/damagedDetails.html?id=${borrower._id}`;
                    });
                    borrowerContainer.appendChild(accountable);
                    borrowerContainer.appendChild(reasonOnHold);
                    borrowerContainer.appendChild(dateOnHold);

                    tableBody.appendChild(borrowerContainer);
                }
            });
            if(tableBody.children.length === 0){
                messageDiv.textContent = 'NO DAMAGED TOOLS FOUND!';
                return;
            }
        });
}