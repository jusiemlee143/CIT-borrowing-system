var nameInput = document.getElementById('name');
var selectSection = document.getElementById('selectSection');
var groupNumberInput = document.getElementById('groupNumber');
var dateInput = document.getElementById('date');
var titleInput = document.getElementById('title');
var instructorSelector = document.getElementById('instructorSelect');

const submitButton = document.getElementById('submitButton');

groupNumberInput.addEventListener('keydown', function(event) {
    event.preventDefault();
});
document.addEventListener('DOMContentLoaded', () => {
    dateInput.valueAsDate = new Date();
    fetchInstructors();
    fetchData();
}); // end of the world (DOM)
function fetchData(){
    const tableBody = document.querySelector('tbody');
    const storedTools = sessionStorage.getItem('tools');
    if (storedTools) {
        const toolsArray = JSON.parse(storedTools);
        tableBody.innerHTML = '';

        toolsArray.forEach(tool => {
            const row = document.createElement('tr');

            const toolNameCell = document.createElement('td');
            toolNameCell.textContent = decodeURIComponent(tool.toolName);

            const deleteCell = document.createElement('td');
            deleteCell.classList.add('deleteCell');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '-';
            deleteButton.classList.add('delete-button');
            deleteCell.appendChild(deleteButton);

            deleteButton.addEventListener('click', async () => {
                const storedTools = sessionStorage.getItem('tools');
                if (storedTools) {
                    let toolsArray = JSON.parse(storedTools);
                    const quantity = parseInt(tool.quantity);

                    await updateToolQuantity(tool, quantity);

                    toolsArray = toolsArray.filter(tool => tool.toolName !== toolNameCell.textContent);
                    sessionStorage.setItem('tools', JSON.stringify(toolsArray));
                    
                    fetchData();
                }
            });

            const quantityCell = document.createElement('td');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = tool.quantity;
            quantityInput.min = 1;
            quantityInput.max = tool.maxQuantity + tool.quantity;

            const updateButton = document.createElement('button');
            updateButton.textContent = '✅';
            updateButton.style.display = 'none';

            quantityInput.addEventListener('keydown', function(event) {
                event.preventDefault();
            });
            quantityInput.addEventListener('input', function(event) {
                let currentValue = parseInt(event.target.value);
                let originalValue = parseInt(tool.quantity);
                if (currentValue !== originalValue) {
                    showUpdateButton(event);
                }else if(currentValue === originalValue){
                    hideUpdateButton(event);
                }
            });
            updateButton.addEventListener('click', (event) => {
                updateQuantity(quantityInput.value, tool, tool.quantity);
                hideUpdateButton(event);
            });
            
            quantityCell.appendChild(quantityInput);
            quantityCell.appendChild(updateButton);
            row.appendChild(deleteCell);
            row.appendChild(quantityCell);
            row.appendChild(toolNameCell);

            tableBody.appendChild(row);
        });
    }
    populateNames();
}
function populateNames(){
    const columnMember = document.getElementById('names');
    const savedNameOfMembers = sessionStorage.getItem('savedNameOfMembers');
    if (savedNameOfMembers) {
        const namesArray = JSON.parse(savedNameOfMembers);
        namesArray.forEach(name => {
            if (name) {
                const nameContainer = document.createElement('div'); 
                const nameMember = document.createElement('input');
                nameMember.classList.add('inputName');
                nameMember.value = name;

                const checkButton = document.createElement('button');
                checkButton.textContent = '❎';
                checkButton.classList.add('check-button');
                
                nameContainer.appendChild(nameMember);
                nameContainer.appendChild(checkButton);
                columnMember.appendChild(nameContainer);
            }
        });
    }
}
const addButtonName = document.getElementById('addButtonName');
addButtonName.addEventListener('click', ()=>{

    const columnMember = document.getElementById('names');
    const nameContainer = document.createElement('div'); 
    const nameMember = document.createElement('input');
    nameMember.classList.add('inputName');

    const checkButton = document.createElement('button');
    checkButton.textContent = '✅';
    checkButton.classList.add('check-button');
    
    nameContainer.appendChild(nameMember);
    nameContainer.appendChild(checkButton);
    columnMember.appendChild(nameContainer);
});
const columnMember = document.getElementById('names');
columnMember.addEventListener('click', (event) => {
    if (event.target.classList.contains('check-button')) {
        const checkButton = event.target;
        const nameContainer = checkButton.parentNode;
        const nameMember = nameContainer.querySelector('.inputName');
        let names = [];
        const savedNameOfMembers = sessionStorage.getItem('savedNameOfMembers');
        if (savedNameOfMembers) {
            names = JSON.parse(savedNameOfMembers);
        }
        if (checkButton.textContent === '✅') {
            trimName = nameMember.value.trim();
            if (!names.includes(trimName)) {
                if (trimName.value !== '') {
                    nameMember.disabled = true;
                    checkButton.textContent = '❎';
                    names.push(trimName);
                    sessionStorage.setItem('savedNameOfMembers', JSON.stringify(names));
                }
            } else {
                alert(`${trimName} is already added!`);
            }
        } else if (checkButton.textContent === '❎') {
            nameMember.disabled = false;
            checkButton.textContent = '✅';
            names = names.filter(name => name !== nameMember.value);
            sessionStorage.setItem('savedNameOfMembers', JSON.stringify(names));
        }
    }
});
submitButton.addEventListener('click', async () => {
    if(!nameInput.value.trim() || !groupNumberInput.value.trim() || !titleInput.value.trim() || selectSection.value === ""){
        alert('Please fill in all required fields!');
        return;
    }
    const storedTools = sessionStorage.getItem('tools');
    if(storedTools){
        const tools = JSON.parse(storedTools);
        if(tools.length === 0){
            alert('Please add atleast one tool/equipment!');
            return;
        }
    }
    
    const selectedInstructor = instructorSelector.value.trim();
    if (selectedInstructor === "Select Instructor") {
        alert('Please select an instructor before submitting.');
        return;
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    // const dateBorrowed = new Date(dateInput.value.split('T')[0]).toLocaleDateString('en-US').replace(/\//g, '-');
    const dateBorrowed = new Date().toLocaleDateString('en-US').replace(/\//g, '-');
    const selectedOption = instructorSelector.options[instructorSelector.selectedIndex];
    const selectedInstructorEmail = selectedOption.getAttribute('data-email');

    var student = {
        name: nameInput.value.trim(),
        section: selectSection.value,
        groupNumber: groupNumberInput.value,
        dateBorrowed: dateBorrowed,
        timeBorrowed: currentTime,
        activityTitle: titleInput.value.trim(),
        instructor: instructorSelector.value,
        requestConfirmed: false,
    };
    let tools = JSON.parse(storedTools);
    tools = tools.map(({maxQuantity, ...rest}) => rest);
    const savedNameOfMembers = sessionStorage.getItem('savedNameOfMembers');
    var memberNames;
    if(savedNameOfMembers){
        memberNames = JSON.parse(savedNameOfMembers);
        if(memberNames.length === 0 ){
            alert('Please add atleast one member');
            return;
        }
    }
    else{
        alert('Please add atleast one member');
        return;
    }
    try {
        const response = await fetch('/borrowRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName: student.name,
                section: student.section,
                groupNumber: student.groupNumber,
                dateBorrowed: student.dateBorrowed,
                timeBorrowed: student.timeBorrowed,
                activityTitle: student.activityTitle,
                instructor: student.instructor,
                tools: tools,
                memberNames: memberNames,
                requestConfirmed: student.requestConfirmed,
                returned: false,
            })
        });

        if (response.status === 409) {
            // Handle conflict error
            const data = await response.json();
            alert(data.error); // Alert the error message
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data && data.message) {
            alert(data.message);
            resetStoredData();
            console.log(data.borrower);

            // Send email
            try {
                const emailResponse = await sendEmailToRecipient(data.borrower, selectedInstructorEmail);
                console.log(emailResponse);
            } catch (error) {
                console.error('Error sending email:', error);
            }

            window.location.reload();
        }
    } catch (error) {
        console.error('Error request:', error);
    }

});
function resetStoredData() {
    sessionStorage.removeItem('tools');
    sessionStorage.removeItem('savedNameOfMembers');
}
async function fetchInstructors(){
    const instructorSelect = document.querySelector('.instructorBox select');
    await fetch(`/getFaculties`)
        .then(response => {
            if(!response.ok){
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(instructor => {
                const option = document.createElement('option');
                option.text = instructor.name;
                option.setAttribute('data-email', instructor.email); // Store name as data attribute
                instructorSelect.add(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
async function updateToolQuantity(tool, quantity) {
    try {
        console.log("Tool inside the fetch: ", tool);
        const response = await fetch(`/updateToolQuantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: tool._id, quantity: quantity})
        });

        if (!response.ok) {
            throw new Error('Failed to update tool quantity');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}
function showUpdateButton(event) {
    const quantityBox = event.target.parentElement;
    const updateButton = quantityBox.querySelector('button');
    quantityBox.classList.add('quantityCell');
    updateButton.classList.add('quantityButton');
    updateButton.style.display = 'inline-block';
}
function hideUpdateButton(event) {
    const quantityBox = event.target.parentElement;
    const updateButton = quantityBox.querySelector('button');
    quantityBox.classList.remove('quantityCell');
    updateButton.classList.remove('quantityButton');
    updateButton.style.display = 'none';
}
function updateQuantity(currentValue, targetTool, originalValue){
    console.log("Target tool: ", targetTool);
    const storedTools = sessionStorage.getItem('tools');
    if(storedTools){
        let toolsArray = JSON.parse(storedTools);
        const index = toolsArray.findIndex(tool => tool.toolName === targetTool.toolName);

        if (toolsArray[index].toolName === targetTool.toolName) {
            // Update the quantity of the target tool
            toolsArray[index].quantity = parseInt(currentValue);
            let updateValue;
            updateValue = 0;
            if(originalValue < currentValue){
                updateValue = originalValue - currentValue;
                alert(`Original Value: ${originalValue}, Current Value: ${currentValue}, Update Value: ${updateValue}`);
                toolsArray[index].maxQuantity += updateValue;
                alert(toolsArray[index].maxQuantity);
            }else if(originalValue > currentValue){
                updateValue = originalValue - currentValue;
                alert(`Original Value: ${originalValue}, Current Value: ${currentValue}, Update Value: ${updateValue}`);
                toolsArray[index].maxQuantity += updateValue;
            }
            
            hideUpdateButton(event);
            sessionStorage.setItem('tools', JSON.stringify(toolsArray));
            updateToolQuantity(targetTool, updateValue);
        }
    }
}
async function sendEmailToRecipient(borrower, instructorEmail) {
    try {
        const response = await fetch('/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: instructorEmail,
                // email: 'imbagalaxy1@gmail.com',
                borrowerData: borrower
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return await response.text();
    } catch (error) {
        throw new Error(error.message);
    }
}