document.addEventListener('DOMContentLoaded', ()=>{
    displayBorrower();
});
async function displayBorrower(){
    const urlParams = new URLSearchParams(window.location.search); 
    const borrowerString = urlParams.get('borrower');
    const borrower = JSON.parse(decodeURIComponent(borrowerString));
    const tableBody = document.getElementById('tbody');
    document.getElementById('borrowerName').textContent = borrower.studentName;
    document.getElementById('section').textContent = borrower.section;
    document.getElementById('dateBorrowed').textContent = borrower.dateBorrowed;
    document.getElementById('groupNumber').textContent = borrower.groupNumber;
    document.getElementById('instructorName').textContent = borrower.instructor;
    document.getElementById('activityTitle').textContent = borrower.activityTitle;

    let memberIndex = 0;
    
    borrower.tools.forEach(tool => {
        const row = document.createElement('tr');

        const quantityCell = document.createElement('td');
        quantityCell.textContent = tool.quantity;

        const toolNameCell = document.createElement('td');
        toolNameCell.textContent = tool.toolName;
        
        const memberCell = document.createElement('td');
        memberCell.textContent = memberIndex < borrower.memberNames.length ? borrower.memberNames[memberIndex] : "";
        memberIndex = Math.min(memberIndex + 1, borrower.memberNames.length);

        row.appendChild(quantityCell);
        row.appendChild(toolNameCell);
        row.appendChild(memberCell);

        tableBody.appendChild(row);
    });
    if(borrower.memberNames.length > borrower.tools.length){
        for(let i = borrower.tools.length; i < borrower.memberNames.length ; i++){
            const row = document.createElement('tr');
            const memberCell = document.createElement('td');
            memberCell.textContent = borrower.memberNames[i];

            row.appendChild(document.createElement('td'));
            row.appendChild(document.createElement('td'));
            row.appendChild(memberCell);

            tableBody.appendChild(row);
        }
    }
    document.getElementById('yesBtn').addEventListener('click', async ()=>{
        const response = await fetch(`/confirmRequest?faculty=${true}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: borrower._id }),
        });
    
        const data = await response.json();
        alert(data.message);
    });
    document.getElementById('noBtn').addEventListener('click', async ()=>{
        const response = await fetch('/declineRequest', {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: borrower._id, tools: borrower.tools})
        });
    
        const data = await response.json();
        alert(data.message);
    });
}