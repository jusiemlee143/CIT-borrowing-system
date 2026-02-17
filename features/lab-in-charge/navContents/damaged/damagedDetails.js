document.addEventListener('DOMContentLoaded', function() {
    fetchBorrower();
});
async function fetchBorrower(){
    const urlParams = new URLSearchParams(window.location.search); 
    const id = urlParams.get('id');
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    console.log(id);
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
            document.getElementById('dateOnHold').textContent = data.dateOnHold;
            document.getElementById('groupNumber').textContent = data.groupNumber;
            document.getElementById('instructorName').textContent = data.instructor;
            document.getElementById('activityTitle').textContent = data.activityTitle;
            let memberIndex = 0;
            if(data.damage){
                populateDamageTools(data.damageTools);
            }
            if(data.lost){
                populateLostTools(data.lostTools);
            }
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
            
            document.getElementById('resolvedBtn').addEventListener('click', async () =>{
                const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '-');
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                const response = await fetch('/returned', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: id, 
                        returned: true,
                        dateReturned: currentDate,
                        timeReturned: currentTime,
                    }),
                });
                const data = await response.json();
                alert(data.message);
                window.location.href = `/lab-in-charge/navContents/damaged/damaged.html`;
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
function populateDamageTools(damageTools){
    const table = document.querySelector('.damageTable');
    table.style.display = 'table';
    const tableBody = document.querySelector('.damageTable tbody');
    tableBody.innerHTML = '';
    let total = 0;
    damageTools.forEach(tool => {
        const row = document.createElement('tr');
        const toolNameCell = document.createElement('td');
        toolNameCell.textContent = tool.toolName;
        const quantityCell = document.createElement('td');
        quantityCell.textContent = tool.quantity;
        const priceCell = document.createElement('td');
        priceCell.textContent = tool.price;
        const totalCell = document.createElement('td');
        totalCell.textContent = tool.price * tool.quantity;

        total += tool.price * tool.quantity; 

        row.appendChild(toolNameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
    const row = document.createElement('tr');
    row.appendChild(document.createElement('td'));
    row.appendChild(document.createElement('td'));
    row.appendChild(document.createElement('td'));
    const totalCost = document.createElement('td');
    totalCost.textContent = total;
    row.appendChild(totalCost);
    tableBody.appendChild(row);
}
function populateLostTools(lostTools){
    const table = document.querySelector('.lostTable');
    table.style.display = 'table';
    const tableBody = document.querySelector('.lostTable tbody');
    tableBody.innerHTML = '';
    let total = 0;
    lostTools.forEach(tool => {
        const row = document.createElement('tr');
        const toolNameCell = document.createElement('td');
        toolNameCell.textContent = tool.toolName;
        const quantityCell = document.createElement('td');
        quantityCell.textContent = tool.quantity;
        const priceCell = document.createElement('td');
        priceCell.textContent = tool.price;
        const totalCell = document.createElement('td');
        totalCell.textContent = tool.price * tool.quantity;

        total += tool.price * tool.quantity; 

        row.appendChild(toolNameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
    const row = document.createElement('tr');
    row.appendChild(document.createElement('td'));
    row.appendChild(document.createElement('td'));
    row.appendChild(document.createElement('td'));
    const totalCost = document.createElement('td');
    totalCost.textContent = total;
    row.appendChild(totalCost);
    tableBody.appendChild(row);
}