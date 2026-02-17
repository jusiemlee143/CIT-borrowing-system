document.addEventListener("DOMContentLoaded", async function() {
  // Fetch user data when the page loads
  await fetchData();

  // Add event listener to the search input
  const searchInput = document.querySelector('.searchTools input');
  searchInput.addEventListener('input', findLic);

  // Add event listener to the Add button
  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', function() {
      window.location.href = 'licAddDetails.html';
  });
});

async function fetchData(query = '') {
  try {
      const response = await fetch(`/getUsers?query=${query}`);
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      displayLic(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

async function findLic(event) {
  const query = event.target.value.trim();
  await fetchData(query);
}

function displayLic(data) {
  const licList = document.getElementById('licLists');
  licList.innerHTML = '';
  const tableContainer = document.querySelector('.Liccontent');

    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        tableContainer.appendChild(messageDiv);
    }
    messageDiv.textContent = '';

  data.forEach(lic => {
      const row = document.createElement('tr');
      // Set the user ID as a data attribute
      row.setAttribute('data-user-id', lic._id); 
      // Create cells and populate them with user data
      const nameCell = document.createElement('td');
      nameCell.textContent = lic.name;
      row.appendChild(nameCell);
      
      const codeCell = document.createElement('td');
      codeCell.textContent = lic.username;
      row.appendChild(codeCell);
      
      const emailCell = document.createElement('td');
      emailCell.textContent = lic.email;
      row.appendChild(emailCell);
      
      const courseYearCell = document.createElement('td');
      courseYearCell.textContent = lic.courseYear;
      row.appendChild(courseYearCell);
      
      licList.appendChild(row);
  });
  if(licList.children.length === 0){
    messageDiv.textContent = 'NO LABORATORY IN-CHARGE ADDED';
    return;
  }

  // Add event listener to the rows in the table
  const licRows = document.querySelectorAll('#licLists tr');
  licRows.forEach(row => {
      row.addEventListener('click', function() {
          const userId = row.getAttribute('data-user-id');
          console.log("uid: ",userId);
          window.location.href = `/Admin/LIC/licDetails.html?id=${userId}`;
      });
  });
} 