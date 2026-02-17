document.addEventListener("DOMContentLoaded", function() {
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
            console.log(data);
        });
}

function displayFaculty(data) {
    const nameBox = document.getElementById('name');
    nameBox.innerHTML += data.name;
}