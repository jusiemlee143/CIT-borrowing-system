document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    const searchInput = document.querySelector('.searchTools input');
    searchInput.addEventListener('input', findTool);

    const showSelect = document.getElementById('show-select');
    showSelect.addEventListener('change', filterTools);
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
    const dataContainer = document.getElementById('availabilityBody');
    dataContainer.innerHTML = '';
    const tableContainer = document.querySelector('.availabilityHeader');

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
        
        const availabilityCell = document.createElement('td');
        const availabilityContainer = document.createElement('div');
        const availabilitySelect = document.createElement('select');
        const availableOption = document.createElement('option');
        availableOption.value = 'available';
        availableOption.textContent = 'Available';
        const unavailableOption = document.createElement('option');
        unavailableOption.value = 'unavailable';
        unavailableOption.textContent = 'Unavailable';
        
        const defaultAvailability = tool.availability === 'available' ? 'available' : 'unavailable';
        row.dataset.defaultAvailability = defaultAvailability;
        
        if (tool.availability === 'available') {
            availableOption.selected = 'available';
        } else {
            unavailableOption.selected = 'unavailable';
        }
        availabilitySelect.addEventListener('change', (event) => updateAvailability(event, tool));

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '✅';
        confirmButton.style.display = 'none';

        availabilitySelect.appendChild(availableOption);
        availabilitySelect.appendChild(unavailableOption);
        availabilityContainer.appendChild(availabilitySelect);
        availabilityContainer.appendChild(confirmButton);

        availabilityCell.appendChild(availabilityContainer);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = tool.quantity;

        row.appendChild(nameCell);
        row.appendChild(availabilityCell);
        row.appendChild(quantityCell);

        dataContainer.appendChild(row);
    });
    if(dataContainer.children.length === 0){
        messageDiv.textContent = 'NO TOOLS ADDED';
        return;
    }
}

function filterTools(event) {
    const query = '';
    const availability = event.target.value;
    fetchData(query, availability);
}

function updateAvailability(event, tool) {
    const selectedOption = event.target.value;
    const row = event.target.closest('tr');
    const confirmButton = row.querySelector('button');
    
    const defaultAvailability = row.dataset.defaultAvailability;
    const availability = selectedOption;
    if (confirmButton) {
        if (defaultAvailability !== selectedOption) {
            confirmButton.style.display = 'inline-block';
            confirmButton.classList.add('confirm-button');
            
            confirmButton.addEventListener('click', () => confirmAvailabilityChange(tool, availability, confirmButton));
        } else {
            confirmButton.style.display = 'none';
        }
    }
}

async function confirmAvailabilityChange(tool, availability, button) {
    button.style.display = 'none';
    try {
        const response = await fetch(`/updateToolAvailability`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tool: tool, availability })
        });

        // if (!response.ok) {
        //     throw new Error('Failed to update tool availabilty');
        // }
        const data = await response.json();  
        if(data.error){
            alert(data.error);
            return;
        }
        alert(data.message);
    } catch (error) {
        throw new Error(error.message);
    }
}