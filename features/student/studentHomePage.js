document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    const searchInput = document.querySelector('.searchTools input');
    searchInput.addEventListener('input', findTool);

    const showSelect = document.getElementById('show-select');
    showSelect.addEventListener('change', filterTools);
});

document.getElementById('borrowerSlip').addEventListener('click', ()=>{
    window.location.href = '/student/studentBorrowersSlip.html';
});

async function fetchData(query = '', availability = 'all') {
    await fetch(`/getTools?query=${query}&availability=${availability}`)
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            displayData(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function findTool(event) {
    const query = event.target.value.trim();
    const showSelect = document.getElementById('show-select');
    const availability = showSelect.value;
    fetchData(query, availability);
}

function displayData(data) {
    const dataContainer = document.getElementById('studentBody');
    dataContainer.innerHTML = '';
    const tableContainer = document.querySelector('.studentHeader');
    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    messageDiv.textContent = '';

    data.forEach(tool => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = tool.name;

        const quantityCell = document.createElement('td');
        quantityCell.textContent = tool.quantity;        

        const availabilityCell = document.createElement('td');
        if(tool.availability === 'available'){
            availabilityCell.textContent = 'Available';
            availabilityCell.value = tool.availability;
        }else{
            availabilityCell.textContent = 'Unavailable';
            availabilityCell.value = tool.availability;
        }

        const inputCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = tool.quantity;
        input.value = 1;
        inputCell.appendChild(input);
        inputCell.classList.add('inputCell');
        input.addEventListener('keydown', function(event) {
            event.preventDefault();
        });

        const buttonCell = document.createElement('td');
        buttonCell.classList.add('buttonCell');
        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.classList.add('plus-button');
        buttonCell.appendChild(plusButton);

        plusButton.addEventListener('click', async () => {
            if(tool.availability == "unavailable"){
                alert(`${tool.name} is unavailable`);
                fetchData();
                return;
            }
            const toolName = tool.name;
            const price = tool.price;
            const storedTools = sessionStorage.getItem('tools');
            let quantity = parseInt(input.value);
            let tools = [];
            if(storedTools){
                tools = JSON.parse(storedTools);
            }
            if (tools.some(tool => tool.toolName === toolName)) {
                alert(`${toolName} is already added to the borrower slip!`);
                return;
            }
            const toolObj = { _id: tool._id, quantity: quantity, toolName: toolName, price: price, maxQuantity: tool.quantity-quantity};
            tools.push(toolObj);
            sessionStorage.setItem('tools', JSON.stringify(tools));
            alert(`Added ${toolName} to the borrower slip`);

            await updateToolQuantity(tool, -quantity);

            fetchData();
        });
        row.appendChild(buttonCell);
        row.appendChild(inputCell);
        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(availabilityCell);

        dataContainer.appendChild(row);
    });
    if(dataContainer.children.length === 0){
        messageDiv.textContent = 'No tools found';
        return;
    }
}

function filterTools(event) {
    const query = '';
    const availability = event.target.value;
    fetchData(query, availability);
}
async function updateToolQuantity(tool, quantity) {
    try {
        const response = await fetch(`/updateToolQuantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: tool._id, quantity: quantity })
        });

        if (!response.ok) {
            throw new Error('Failed to update tool quantity');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}
