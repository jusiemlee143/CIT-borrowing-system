document.addEventListener("DOMContentLoaded", function() {
    // Check if there is saved schedule data in sessionStorage
    const savedScheduleData = JSON.parse(sessionStorage.getItem('scheduleData'));
    if (savedScheduleData && savedScheduleData.length > 0) {
        savedScheduleData.forEach(schedule => {
            addScheduleBox(schedule); // Call addScheduleBox for each saved schedule
        });     
    } else {
        // If there's no saved data, add a new empty schedule box
        addScheduleBox();
    }

    document.getElementById("AddFaculty").addEventListener("submit", async function(event) {
        event.preventDefault(); 
        const savedScheduleData = JSON.parse(sessionStorage.getItem('scheduleData'));

        if(!savedScheduleData){
            alert('Please add atleast one schedule and save it before submitting');
            return;
        }
        const name = document.getElementById("name").value;
        const idNumber = document.getElementById("idNumber").value;
        const email = document.getElementById("email").value;
        console.log(name);
        console.log(idNumber);
        console.log(email);
        console.log(savedScheduleData);
        try {
            const response = await fetch('/addFaculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    idNumber: idNumber,
                    email: email,
                    schedules: savedScheduleData
                })
            });
    
            const data = await response.json();
            if (response.ok || response.status === 201) {
                console.log(data.message); 
                alert("Instructor added");
                sessionStorage.removeItem('scheduleData');
                // Clear the form after successful submission
                document.getElementById("AddFaculty").reset();
            } else {
                console.error(data.error); 
                alert("Already Exist");
            }
        } catch (error) {
            console.error('Error:', error); 
        }
    });

});
document.getElementById('addBtnSched').addEventListener('click', (event) => {
    event.preventDefault();
    addScheduleBox();

});
function addScheduleBox(savedScheduleData) {
    //Container for all the Schedule
    const scheduleBox = document.getElementById('scheduleBox');

    //Container for the details of each Schedule
    const schedule = document.createElement('form');
    schedule.classList.add('schedule');
    
    //Select Subject Here
    const subjectCodeBox = document.createElement('div');
    subjectCodeBox.classList.add('selectSection');
    const labelSubject = document.createElement('label');
    labelSubject.textContent = 'Subject: ';
    subjectCodeBox.appendChild(labelSubject);
    const selectSubject = document.createElement('select');
    selectSubject.id = 'subjectSelect'
    selectSubject.required = true;
    const subjectOptions = [
        { value: '', text: 'Select Subject', disabled: true, selected: true},
        { value: 'CPE366', text: 'CPE366'},
        { value: 'CPE362', text: 'CPE362'},
        { value: 'CPE368', text: 'CPE368'},
        { value: 'CPE361', text: 'CPE361'},
        { value: 'CPE364', text: 'CPE364'},
    ];
    subjectOptions.forEach(optionData => {
        const optionElement = document.createElement('option');
        optionElement.value = optionData.value;
        optionElement.text = optionData.text;
        if (optionData.disabled) optionElement.disabled = true;
        if (optionData.selected) optionElement.selected = true;
        selectSubject.appendChild(optionElement); // Append the option to the select element
    });
    subjectCodeBox.appendChild(selectSubject);
    
    //Select Section Here
    const sectionBox = document.createElement('div');
    sectionBox.classList.add('selectSection');
    const labelSection = document.createElement('label');
    labelSection.textContent = 'Section: ';
    sectionBox.appendChild(labelSection);
    const selectSection = document.createElement('select');
    selectSubject.id = 'sectionSelect'
    selectSection.required = true;
    const sectionOptions = [
        { value: '', text: 'Select Section', disabled: true, selected: true},
        { value: 'H1', text: 'H1'},
        { value: 'H2', text: 'H2'},
        { value: 'H3', text: 'H3'},
    ];
    sectionOptions.forEach(optionData => {
        const optionElement = document.createElement('option');
        optionElement.value = optionData.value;
        optionElement.text = optionData.text;
        if (optionData.disabled) optionElement.disabled = true;
        if (optionData.selected) optionElement.selected = true;
        selectSection.appendChild(optionElement); // Append the option to the select element
    });
    sectionBox.appendChild(selectSection);

    //Select Day Here
    const dayBox = document.createElement('div');
    dayBox.classList.add('selectDay');
    const labelDay = document.createElement('label');
    labelDay.textContent = 'Day: ';
    dayBox.appendChild(labelDay);
    const selectDay = document.createElement('select');
    selectDay.id = 'daySelect';
    selectDay.required = true;
    const dayOptions = [
        { value: '', text: 'Select Day', disabled: true, selected: true},
        { value: 'Monday', text: 'Monday'},
        { value: 'Tuesday', text: 'Tuesday'},
        { value: 'Wednesday', text: 'Wednesday'},
        { value: 'Thursday', text: 'Thursday'},
        { value: 'Friday', text: 'Friday'},
        { value: 'Saturday', text: 'Saturday'},
        { value: 'Sunday', text: 'Sunday'},
    ];
    dayOptions.forEach(optionData => {
        const optionElement = document.createElement('option');
        optionElement.value = optionData.value;
        optionElement.text = optionData.text;
        if (optionData.disabled) optionElement.disabled = true;
        if (optionData.selected) optionElement.selected = true;
        selectDay.appendChild(optionElement); // Append the option to the select element
    });
    dayBox.appendChild(selectDay);

    //Select Time Here
    const timeBox = document.createElement('div');
    timeBox.classList.add('time');

    const startTimeBox = document.createElement('div');
    startTimeBox.classList.add('startTime');
    const labelStartTime = document.createElement('label');
    labelStartTime.textContent = 'Start Time:';
    startTimeBox.appendChild(labelStartTime);
    const inputStartTime = document.createElement('input');
    inputStartTime.id = 'startTime';
    inputStartTime.required = true;
    inputStartTime.type = 'time';
    inputStartTime.name = 'startTime';
    inputStartTime.min = '07:00';
    inputStartTime.max = '18:00';
    inputStartTime.step = '1800';
    startTimeBox.appendChild(inputStartTime);

    const endTimeBox = document.createElement('div');
    endTimeBox.classList.add('endtime');
    const labelEndTime = document.createElement('label');
    labelEndTime.textContent = 'End Time:';
    endTimeBox.appendChild(labelEndTime);
    const inputEndTime = document.createElement('input');
    inputEndTime.id = 'endTime';
    inputEndTime.required = true;
    inputEndTime.type = 'time';
    inputEndTime.name = 'endTime';
    inputEndTime.min = '08:00';
    inputEndTime.max = '21:00';
    inputEndTime.step = '1800'; 
    endTimeBox.appendChild(inputEndTime);

    timeBox.appendChild(startTimeBox);
    timeBox.appendChild(endTimeBox);

    //Subject Here
    const addSchedBtn = document.createElement('input');
    addSchedBtn.classList.add('buttonSched');
    addSchedBtn.id = 'addSched';
    addSchedBtn.type = 'submit';
    addSchedBtn.value = '✅';

    schedule.addEventListener('submit', (event) => { 
        event.preventDefault();
        if(addSchedBtn.value === '✅'){
            addSched(selectSubject, selectSection, selectDay, inputStartTime, inputEndTime, addSchedBtn);
        }
        else if(addSchedBtn.value === '❎'){
            addSchedBtn.value = '✅';
            selectSubject.disabled = false;
            selectSection.disabled = false;
            selectDay.disabled = false;
            inputStartTime.disabled = false;
            inputEndTime.disabled = false;
            const savedScheduleData = JSON.parse(sessionStorage.getItem('scheduleData'));
            const filterData = savedScheduleData.filter(schedule => !(schedule.subjectCode === selectSubject.value && schedule.section === selectSection.value));
            sessionStorage.setItem('scheduleData', JSON.stringify(filterData));
        }
    });

    if(savedScheduleData){
        selectSubject.value = savedScheduleData.subjectCode;
        selectSection.value = savedScheduleData.section;
        selectDay.value = savedScheduleData.day;
        inputStartTime.value = savedScheduleData.startTime;
        inputEndTime.value = savedScheduleData.endTime;
        addSchedBtn.value = '❎';
        selectSubject.disabled = true;
        selectSection.disabled = true;
        selectDay.disabled = true;
        inputStartTime.disabled = true;
        inputEndTime.disabled = true;
    }
    
    //Append all the details of the schedule
    schedule.appendChild(subjectCodeBox);
    schedule.appendChild(sectionBox);
    schedule.appendChild(dayBox);
    schedule.appendChild(timeBox);
    schedule.appendChild(addSchedBtn);

    //Append the schedule here
    scheduleBox.appendChild(schedule);
}
function addSched(selectSubject, selectSection, selectDay, inputStartTime, inputEndTime, addSchedBtn) {
    // Retrieve existing schedule data from local storage or initialize an empty array
    let existingScheduleData = JSON.parse(sessionStorage.getItem('scheduleData')) || [];
    // Retrieve input values from schedule fields
    const subject = selectSubject.value;
    const section = selectSection.value;
    const day = selectDay.value;
    const startTime = inputStartTime.value;
    const endTime = inputEndTime.value;

    const sectionExist = existingScheduleData.some(schedule => schedule.section === section && schedule.subjectCode === subject);
    
    const startDateTime = new Date(`1970-01-01T${startTime}:00`);
    const endDateTime = new Date(`1970-01-01T${endTime}:00`);
    const invalidTime = endDateTime <= startDateTime;
    const insufficientGap = (endDateTime - startDateTime) < (60 * 60 * 1000); // 1 hour in milliseconds

    const conflictingSchedule = existingScheduleData.some(schedule => 
        schedule.day === day && 
        ((schedule.startTime <= startTime && startTime < schedule.endTime) ||
        (schedule.startTime < endTime && endTime <= schedule.endTime) ||
        (startTime <= schedule.startTime && schedule.endTime <= endTime))
    );

    if(sectionExist){
        alert('You can only have 1 section per subject code');
        return;
    }
    if(invalidTime){
        alert('End Time must be later than Start Time');
        return;
    }
    if (insufficientGap) {
        alert('There must be at least a 1-hour gap between Start Time and End Time');
        return;
    }
    if(conflictingSchedule){
        alert('Conflicting schedule exists for the same day');
        return;
    }
    const startTimeValue = startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const endTimeValue = endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // Construct an object with the schedule data
    const scheduleData = {
        subjectCode: subject,
        section: section,
        day: day,
        startTime: startTimeValue,
        endTime: endTimeValue
    };

    
    // Push the new schedule data to the existing array
    existingScheduleData.push(scheduleData);

    // Store the updated schedule data back in the local storage
    sessionStorage.setItem('scheduleData', JSON.stringify(existingScheduleData));
    
    addSchedBtn.value = '❎';
    selectSubject.disabled = true;
    selectSection.disabled = true;
    selectDay.disabled = true;
    inputStartTime.disabled = true;
    inputEndTime.disabled = true;
}
