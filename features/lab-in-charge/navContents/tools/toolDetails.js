document.addEventListener('DOMContentLoaded', ()=>{
    // Get the tool ID from the query parameter
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get("id");

    let tool = null;

    // Fetch tool details using the tool ID
    fetch(`/getToolDetails?id=${toolId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tool details');
            }
            return response.json();
        })
        .then(fetchedTool => {
            displayToolDetails(fetchedTool);
        })
        .catch(error => console.error('Error fetching tool details:', error));

    const displayToolDetails = (tool) => {
        document.getElementById("name").textContent = tool.name;
        document.getElementById("description").textContent = tool.description;
        document.getElementById("quantity").textContent = `Quantity: ${tool.quantity}`;
        document.getElementById("price").textContent = `Price: ₱${tool.price}`;
        const imgElement = document.getElementById('uploadedImage');
        imgElement.src = `/images/${tool.img}`;
        imgElement.style.display = 'block';
    };
});