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
                    
                    const instructor = document.createElement('td');
                    instructor.textContent = borrower.instructor;
                    
                    const section = document.createElement('td');
                    section.textContent = borrower.section;

                    const reasonOnHold = document.createElement('td');
                    reasonOnHold.textContent = (borrower.lost && borrower.damage) ? 'Lost & Damage' : (borrower.lost ? 'Lost' : 'Damage');

                    const dateBorrowed = document.createElement('td');
                    dateBorrowed.textContent = borrower.dateBorrowed;
                    
                    const dateOnHold = document.createElement('td');
                    dateOnHold.textContent = borrower.dateOnHold;

                    borrowerContainer.addEventListener('click', ()=>{
                        window.location.href = `/lab-in-charge/navContents/damaged/damagedDetails.html?id=${borrower._id}`;
                    });
                    borrowerContainer.appendChild(accountable);
                    borrowerContainer.appendChild(instructor);
                    borrowerContainer.appendChild(section);
                    borrowerContainer.appendChild(reasonOnHold);
                    borrowerContainer.appendChild(dateBorrowed);
                    borrowerContainer.appendChild(dateOnHold);

                    tableBody.appendChild(borrowerContainer);
                }
            });
            if(tableBody.children.length === 0){
                messageDiv.textContent = 'No damaged tools found';
                return;
            }
        });
}
