document.addEventListener('DOMContentLoaded', function() {
    fetchBorrower();
});

async function fetchBorrower(){
    const urlParams = new URLSearchParams(window.location.search); 
    const id = urlParams.get('id');
    const tableBody = document.querySelector('tbody');

    await fetch(`/getBorrower?id=${id}`)
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to fetch data');
            }
            return response.json();
        }) 
        .then(data => { 
            document.getElementById('borrowerName').textContent = data.studentName;
            document.getElementById('section').textContent = data.section;
            document.getElementById('dateBorrowed').textContent = data.dateBorrowed;
            document.getElementById('groupNumber').textContent = data.groupNumber;
            document.getElementById('instructorName').textContent = data.instructor;
            document.getElementById('activityTitle').textContent = data.activityTitle;

            let memberIndex = 0;
            
            data.tools.forEach(tool => {
                const row = document.createElement('tr');
    
                const quantityCell = document.createElement('td');
                quantityCell.textContent = tool.quantity;
    
                const toolNameCell = document.createElement('td');
                toolNameCell.textContent = tool.toolName;
                
                const memberCell = document.createElement('td');
                memberCell.textContent = memberIndex < data.memberNames.length ? data.memberNames[memberIndex] : "";
                memberIndex = Math.min(memberIndex + 1, data.memberNames.length);

                row.appendChild(quantityCell);
                row.appendChild(toolNameCell);
                row.appendChild(memberCell);
    
                tableBody.appendChild(row);
            });
            if(data.memberNames.length > data.tools.length){
                for(let i = data.tools.length; i < data.memberNames.length ; i++){
                    const row = document.createElement('tr');
                    const memberCell = document.createElement('td');
                    memberCell.textContent = data.memberNames[i];

                    row.appendChild(document.createElement('td'));
                    row.appendChild(document.createElement('td'));
                    row.appendChild(memberCell);
        
                    tableBody.appendChild(row);
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}