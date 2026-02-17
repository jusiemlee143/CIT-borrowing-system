document.addEventListener('DOMContentLoaded', function() {
    fetchBorrower();
});
let headersCreated = false;
async function fetchBorrower(){
    const urlParams = new URLSearchParams(window.location.search); 
    const id = urlParams.get('id');
    const button = urlParams.get('button');
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    const tableHeader = document.querySelector('thead tr');

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
            if (!headersCreated) {
                const damageHeader = document.createElement('th');
                damageHeader.textContent = 'Damage Equipment';
                damageHeader.colSpan = 2;
                const lostHeader = document.createElement('th');
                lostHeader.textContent = 'Lost Equipment';
                lostHeader.colSpan = 2;

                if(button === 'damageBtn' || button === 'bothBtn'){
                    tableHeader.insertBefore(damageHeader, tableHeader.firstChild);
                }
                if(button === 'lostBtn' || button === 'bothBtn'){
                    tableHeader.insertBefore(lostHeader, tableHeader.firstChild);
                }
                headersCreated = true;
            }
            data.tools.forEach(tool => {
                const row = document.createElement('tr');
                const quantityCell = document.createElement('td');
                quantityCell.textContent = tool.quantity;
    
                const toolNameCell = document.createElement('td');
                toolNameCell.textContent = tool.toolName;
                
                const damageInputBox = createInputCell('number', 1, tool.quantity);
                const damageBtnBox = createButtonCell('+', 'plus-button');
                const lostInputBox = createInputCell('number', 1, tool.quantity);
                const lostBtnBox = createButtonCell('+', 'plus-button');
                
                if(button === 'lostBtn' || button === 'bothBtn'){
                    row.appendChild(lostBtnBox);
                    row.appendChild(lostInputBox);
                    populateLostTools();
                }
                if(button === 'damageBtn' || button === 'bothBtn'){
                    row.appendChild(damageBtnBox);
                    row.appendChild(damageInputBox);
                    populateDamageTools();
                }
                const memberCell = document.createElement('td');
                memberCell.textContent = memberIndex < data.memberNames.length ? data.memberNames[memberIndex] : "";
                memberIndex = Math.min(memberIndex + 1, data.memberNames.length);

                row.appendChild(quantityCell);
                row.appendChild(toolNameCell);
                row.appendChild(memberCell);
    
                tableBody.appendChild(row);
                
                damageBtnBox.firstChild.addEventListener('click', () => plusButtonClick('damageTools', damageInputBox, tool, 'damage'));
                lostBtnBox.firstChild.addEventListener('click', () => plusButtonClick('lostTools', lostInputBox, tool, 'lost'));
            });
            if(data.memberNames.length > data.tools.length){
                for(let i = data.tools.length; i < data.memberNames.length ; i++){
                    const row = document.createElement('tr');
                    const memberCell = document.createElement('td');
                    memberCell.textContent = data.memberNames[i];
                    if(button === 'damageBtn' || button === 'bothBtn'){
                        row.appendChild(document.createElement('td'));
                        row.appendChild(document.createElement('td'));
                    }
                    if(button === 'lostBtn' || button === 'bothBtn'){
                        row.appendChild(document.createElement('td'));
                        row.appendChild(document.createElement('td'));
                    }
                    row.appendChild(document.createElement('td'));
                    row.appendChild(document.createElement('td'));
                    row.appendChild(memberCell);
        
                    tableBody.appendChild(row);
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}
function createInputCell(type, min, max) {
    const inputBox = document.createElement('td');
    const input = document.createElement('input');
    input.type = type;
    input.min = min;
    input.max = max;
    input.value = 1;
    inputBox.appendChild(input);
    inputBox.classList.add('inputCell');
    input.addEventListener('keydown', function(event) {
        event.preventDefault();
    });
    return inputBox;
}
function createButtonCell(text, className) {
    const buttonBox = document.createElement('td');
    buttonBox.classList.add('buttonCell');
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    buttonBox.appendChild(button);
    return buttonBox;
}
async function plusButtonClick(storageKey, inputBox, tool, type) {
    const storedDamagedTools = sessionStorage.getItem('damageTools');
    const storedLostTools = sessionStorage.getItem('lostTools');
    let damagedToolsArray = [];
    let lostToolsArray = [];

    if (storedDamagedTools) {
        damagedToolsArray = JSON.parse(storedDamagedTools);
    }

    if (storedLostTools) {
        lostToolsArray = JSON.parse(storedLostTools);
    }
    
    let toolsArray = [];
    let totalSum;
    if(type === 'damage'){
        const lostToolQuantity =  await calculateSumOfQuantities(lostToolsArray, tool.toolName);
        const inputValue = parseInt(inputBox.firstChild.value);

        totalSum = lostToolQuantity + inputValue;

        toolsArray = damagedToolsArray;
    }
    else if(type === 'lost'){
        const damageToolQuantity =  await calculateSumOfQuantities(damagedToolsArray, tool.toolName);
        const inputValue = parseInt(inputBox.firstChild.value);

        totalSum = damageToolQuantity + inputValue;

        toolsArray = lostToolsArray;
    }

    const maxQuantity = parseInt(tool.quantity);
    const toolName = tool.toolName;

    if (toolsArray.some(tool => tool.toolName === toolName)) {
        alert(`${toolName} is already added to the ${type} section!`);
        fetchBorrower();
        return;
    }

    if (totalSum > maxQuantity) {
        alert(`Maximum quantity (${maxQuantity}) for ${toolName} has been reached!`);
        fetchBorrower();
        return;
    }

    const newTool = { quantity: inputBox.firstChild.value, toolName: toolName, price: tool.price };
    toolsArray.push(newTool);
    sessionStorage.setItem(storageKey, JSON.stringify(toolsArray));
    
    fetchBorrower();
}
function calculateSumOfQuantities(toolsArray, toolName) {
    const specificTool = toolsArray.find(tool => tool.toolName === toolName);
    return specificTool ? parseInt(specificTool.quantity) : 0;
}
function populateDamageTools(){
    const table = document.querySelector('.damageTable');
    table.style.display = 'table';
    const tableBody = document.querySelector('.damageTable tbody');
    tableBody.innerHTML = '';
    const storedDamagedTools = sessionStorage.getItem('damageTools');
    let damagedToolsArray = [];
    if (storedDamagedTools) {
        damagedToolsArray = JSON.parse(storedDamagedTools);
        damagedToolsArray.forEach(tool => {
            const row = document.createElement('tr');
            const deleteCell = document.createElement('td');
            deleteCell.textContent = 'x';
            const toolNameCell = document.createElement('td');
            toolNameCell.textContent = tool.toolName;
            const quantityCell = document.createElement('td');
            quantityCell.textContent = tool.quantity;

            row.appendChild(deleteCell);
            row.appendChild(toolNameCell);
            row.appendChild(quantityCell);

            tableBody.appendChild(row);
            deleteCell.addEventListener('click', () => {
                removeTool('damageTools', tool.toolName);
            });
        });
    }
}
function populateLostTools(){
    const table = document.querySelector('.lostTable');
    table.style.display = 'table';
    const tableBody = document.querySelector('.lostTable tbody');
    tableBody.innerHTML = '';
    const storedLostTools = sessionStorage.getItem('lostTools');
    let lostToolsArray = [];
    if (storedLostTools) {
        lostToolsArray = JSON.parse(storedLostTools);
        lostToolsArray.forEach(tool => {
            const row = document.createElement('tr');
            const deleteCell = document.createElement('td');
            deleteCell.textContent = 'x';
            const toolNameCell = document.createElement('td');
            toolNameCell.textContent = tool.toolName;
            const quantityCell = document.createElement('td');
            quantityCell.textContent = tool.quantity;

            row.appendChild(deleteCell);
            row.appendChild(toolNameCell);
            row.appendChild(quantityCell);

            tableBody.appendChild(row);
            deleteCell.addEventListener('click', () => {
                removeTool('lostTools', tool.toolName);
            });
        });
    }
}
function removeTool(storageKey, toolToRemove){
    const storedTools = sessionStorage.getItem(storageKey);
    if(storedTools){
        let toolsArray = JSON.parse(storedTools);
        toolsArray = toolsArray.filter(tool => tool.toolName !== toolToRemove);

        sessionStorage.setItem(storageKey, JSON.stringify(toolsArray));

        if(storageKey === 'lostTools'){
            populateLostTools();
        }else{
            populateDamageTools();
        }
        const checkTool = JSON.parse(sessionStorage.getItem(storageKey));
        console.log(checkTool.length);
        if (checkTool.length === 0) {
            sessionStorage.removeItem(storageKey);
        }
    }
}
window.addEventListener('beforeunload', function(event) {
    sessionStorage.clear();
});
document.getElementById('submitBtn').addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search); 
    const id = urlParams.get('id');
    const button = urlParams.get('button');

    let studentNameObject = {};

    if(button === 'bothBtn'){
        const storedDamagedTools = sessionStorage.getItem('damageTools');
        const storedLostTools = sessionStorage.getItem('lostTools');
        let damagedToolsArray = [];
        let lostToolsArray = [];

        if (storedDamagedTools && storedLostTools) {
            damagedToolsArray = JSON.parse(storedDamagedTools);
            lostToolsArray = JSON.parse(storedLostTools);

            studentNameObject = { ...studentNameObject, damageTools: damagedToolsArray, lostTools: lostToolsArray };
        }else{
            alert('Please add atleast one tool in each table');
            return;
        }
    }else{
        let storageKey;
        if(button === 'damageBtn'){
            storageKey = 'damageTools';
        }
        else if(button === 'lostBtn'){
            storageKey = 'lostTools';
        }
        else{
            alert(`Storage Key invalid: ${storageKey}`);
        }
        const storedTools = sessionStorage.getItem(storageKey);
        let storedToolsArray = [];
        if(storedTools){
            storedToolsArray = JSON.parse(storedTools);
            
            studentNameObject = { ...studentNameObject, [storageKey]: storedToolsArray };
        }else{
            alert('Please add atleast one tool in the table');
            return;
        }
    }
    const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '-');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    studentNameObject = { ...studentNameObject, _id: id, dateOnHold: currentDate, timeOnHold: currentTime};
    console.log(studentNameObject);
    const response = await fetch(`/onHoldBorrower`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentNameObject })
    });

    if (!response.ok) {
        throw new Error('Failed to submit');
    }
    else{
        sessionStorage.clear();
    }
    window.location.href = '/lab-in-charge/navContents/status/status.html';
    const data = await response.json();  
    alert(data.message);
});