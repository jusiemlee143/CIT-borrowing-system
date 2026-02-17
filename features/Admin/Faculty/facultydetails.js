document.addEventListener("DOMContentLoaded", function () {
    fetchFaculty();
});
async function fetchFaculty(){
    const urlParams = new URLSearchParams(window.location.search); 
    const facultyID = urlParams.get('id');
    await fetch(`/getFaculty?id=${facultyID}`)
        .then(response =>{
            if(!response.ok){
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data =>{
            displayFaculty(data);
            highlightSchedule(data.schedules);
        });
}
function displayFaculty(data) {
    const nameBox = document.getElementById('nameFaculty');
    nameBox.value = data.name;
    const idBox = document.getElementById('idFaculty');
    idBox.value = data.idNumber;
    const emailBox = document.getElementById('emailFaculty');
    emailBox.value = data.email;

    const tableBody = document.querySelector('.scheduleTableForm tbody');
    tableBody.innerHTML = '';
    data.schedules.forEach(schedule => {
        const scheduleBox = document.createElement('tr');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '➖';
        deleteButton.className = 'deleteBtn'; // Add a class for easier selection
        deleteButton.style.display = 'none'; // Initially hide the delete button
        deleteButton.addEventListener('click', () => {
            // Remove the row when delete button is clicked
            scheduleBox.remove();
        });

        // Append delete button to the row
        scheduleBox.appendChild(deleteButton);

        const subjectCode = document.createElement('td');
        const subjectCodeInput = document.createElement('input');
        subjectCodeInput.value = schedule.subjectCode;
        subjectCode.appendChild(subjectCodeInput);

        const section = document.createElement('td');
        const sectionInput = document.createElement('input');
        sectionInput.value = schedule.section;
        section.appendChild(sectionInput);

        const day = document.createElement('td');
        const dayInput = document.createElement('input');
        dayInput.value = schedule.day;
        day.appendChild(dayInput);

        const startTime = document.createElement('td');
        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'time';
        startTimeInput.required = true;
        startTimeInput.min = '07:00';
        startTimeInput.max = '18:00';
        startTimeInput.step = '1800';
        let startTimeValue = convertTo24Hour(schedule.startTime);
        startTimeInput.value = startTimeValue;
        startTime.appendChild(startTimeInput);

        const endTime = document.createElement('td');
        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'time';
        endTimeInput.required = true;
        endTimeInput.min = '08:00';
        endTimeInput.max = '21:00';
        endTimeInput.step = '1800';
        let endTimeValue = convertTo24Hour(schedule.endTime);
        endTimeInput.value = endTimeValue; 
        endTime.appendChild(endTimeInput);

        scheduleBox.appendChild(subjectCode);
        scheduleBox.appendChild(section);
        scheduleBox.appendChild(day);
        scheduleBox.appendChild(startTime);
        scheduleBox.appendChild(endTime);

        scheduleBox.querySelectorAll('input').forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('input').forEach(input => {
            input.disabled = true;
        });

        tableBody.appendChild(scheduleBox);    
    });
    let editMode = false;

    document.getElementById('editBtn').addEventListener('click', (event) => {
        event.preventDefault();
        if (!editMode) {
            // Enable all input fields
            document.querySelectorAll('input').forEach(input => {
                input.disabled = false;
            });

            // Display delete buttons
            document.querySelectorAll('.deleteBtn').forEach(button => {
                button.style.display = 'inline-block';
            });

            // Add 'Actions' header
            const deleteHeader = document.createElement('th');
            deleteHeader.textContent = 'Actions';
            const tableHead = document.querySelector('.scheduleTableForm thead tr');
            const firstHeader = tableHead.querySelector('th:first-child');
            tableHead.insertBefore(deleteHeader, firstHeader);
            
            editMode = true;   
        }
    });
    document.getElementById('formSchedule').addEventListener('submit', async (event) => {
        event.preventDefault();
        // Enable all input fields
        document.querySelectorAll('.scheduleTableForm input').forEach(input => {
            input.disabled = true;
        });
        
        editMode = false;
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.style.display = 'none';
        });
        
        const tableHead = document.querySelector('.scheduleTableForm thead tr');
        const deleteHeader = tableHead.querySelector('th:first-child');
        if (deleteHeader && deleteHeader.textContent === 'Actions') {
            tableHead.removeChild(deleteHeader);
        }
        
        // Collect updated schedule data
        const updatedSchedules = [];
        document.querySelectorAll('.scheduleTableForm tbody tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            const schedule = {
                subjectCode: inputs[0].value,
                section: inputs[1].value,
                day: inputs[2].value,
                startTime: convertTimeTo12HourFormat(inputs[3].value),
                endTime: convertTimeTo12HourFormat(inputs[4].value)
            };
            updatedSchedules.push(schedule);
        });
        
        const isEqual = updatedSchedules.length === data.schedules.length && updatedSchedules.every((updatedSchedule, index) => {
            const originalSchedule = data.schedules[index];
            return (
                updatedSchedule.subjectCode === originalSchedule.subjectCode &&
                updatedSchedule.section === originalSchedule.section &&
                updatedSchedule.day === originalSchedule.day &&
                updatedSchedule.startTime === originalSchedule.startTime &&
                updatedSchedule.endTime === originalSchedule.endTime
            );
        }) && 
            nameBox.value === data.name &&
            idBox.value === data.idNumber &&
            emailBox.value === data.email;
            
        if (isEqual) {
            alert("The schedules and other details are identical. No changes made");
            return;
        }
        // Send updated schedule data to server for saving
        try {
            const response = await fetch(`/updateFaculty?id=${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: nameBox.value,
                    idNumber: idBox.value,
                    email: emailBox.value,
                    schedules: updatedSchedules 
                })
            });
            if (!response.ok) {
                throw new Error('Failed to save updated data');
            }
            const responseData = await response.json();
            alert(responseData.message);
        } catch (error) {
            console.error('Error saving updated data:', error);
            alert('Failed to save updated data');
        }
    });
    document.getElementById('deleteBtn').addEventListener('click', async (event)=>{
        event.preventDefault();
        const confirm = window.confirm("Are you sure you want to delete?"); 
        if(confirm){
            const response = await fetch(`/deleteFaculty?id=${data._id}`, {
                method: 'DELETE'
            });
            if(!response.ok){
                throw new Error('Failed to delete faculty data');
            }
            const responseData = await response.json();
            alert(responseData.message);
            window.location.href = `/Admin/Faculty/faculty.html`;
        }
    });
}
function highlightSchedule(schedules) {
    console.log(schedules);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const table = document.querySelector(".tableDetails");
    
    schedules.forEach(schedule => {
        const dayIndex = daysOfWeek.indexOf(schedule.day);
        if (dayIndex === -1) return;

        const rows = table.getElementsByTagName("tr");

        let startHighlight = false;
        const endMinutes = schedule.endTime.split(':')[1].split(' ')[0];
        for (let i = 1; i < rows.length; i++) {
            const timeCell = rows[i].cells[0];
            const timeText = timeCell ? timeCell.innerText.trim() : "";

            if (timeText.includes(schedule.startTime)) {
                startHighlight = true;
            }
            if (startHighlight) {
                if(i%2 == 0){
                    rows[i].cells[dayIndex-1].classList.add("highlight");
                }
                else{
                    rows[i].cells[dayIndex].classList.add("highlight");
                }
            }
            if (timeText.includes(schedule.endTime)) {
                if(i%2 != 0 && endMinutes !== '30'){
                    rows[i].cells[dayIndex].classList.remove("highlight");
                }
                break;
            }
        }
    });
}
function convertTimeTo12HourFormat(time24h) {
    const [hours, minutes] = time24h.split(':');

    let formattedHours = parseInt(hours);
    let formattedModifier = 'AM';

    if (formattedHours === 0) {
        formattedHours = 12;
    } else if (formattedHours >= 12) {
        formattedModifier = 'PM';
        if (formattedHours > 12) {
            formattedHours -= 12;
        }
    }
    formattedHours = formattedHours.toString().padStart(2, '0');

    return `${formattedHours}:${minutes} ${formattedModifier}`;
}
const convertTo24Hour = (time12h) => {
    const [time, period] = time12h.split(' '); // Split time and period (AM/PM)
    let [hours, minutes] = time.split(':'); // Split hours and minutes
    hours = parseInt(hours, 10); // Parse hours to integer
    if (period === 'PM' && hours < 12) {
        hours += 12; // Convert PM to 24-hour format by adding 12 hours
    } else if (period === 'AM' && hours === 12) {
        hours = 0; // Convert 12AM to 0 hours
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`; // Format hours with leading zero if necessary
};
