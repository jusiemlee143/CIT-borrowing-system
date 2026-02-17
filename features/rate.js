document.addEventListener("DOMContentLoaded", function() {
    fetchRatings();
    // To access the stars
    let stars = document.getElementsByClassName("star");
    let output = document.getElementById("output");
    let starRating = 0;

    // Function to update rating
    function updateRating(n) {
        remove();
        for (let i = 0; i < n; i++) {
            let cls;
            if (n == 1) cls = "one";
            else if (n == 2) cls = "two";
            else if (n == 3) cls = "three";
            else if (n == 4) cls = "four";
            else if (n == 5) cls = "five";
            stars[i].className = "star " + cls;
        }
        output.innerText = "Rating is: " + n + "/5";
        starRating = n; // Update starRating here
    }

    // To remove the pre-applied styling
    function remove() {
        let i = 0;
        while (i < 5) {
            stars[i].className = "star";
            i++;
        }
    }

    // Add click event listeners to stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].addEventListener('click', function() {
            updateRating(i + 1);
        });
    }

    // Disabling submit button when textareas are both empty
    const ratingsTextarea = document.getElementById('ratings');
    const borrowerTextarea = document.getElementById('borrower');
    const submitIcon = document.querySelector('.submit-icon');

    function toggleSubmitIcon() {
        if (ratingsTextarea.value.trim() !== "" && borrowerTextarea.value.trim() !== "") {
            submitIcon.classList.remove('disabled');
        } else {
            submitIcon.classList.add('disabled');
        }
    }

    ratingsTextarea.addEventListener('input', toggleSubmitIcon);
    borrowerTextarea.addEventListener('input', toggleSubmitIcon);

    // Initial check in case the textareas are already filled
    toggleSubmitIcon();

    // Stores the rating in the container
    document.getElementById('submitFeedback').addEventListener('click', async (event) => {
        event.preventDefault();
        const name = document.getElementById('borrower').value;
        const feedback = document.getElementById('ratings').value;

        if (name && feedback && starRating) {
            const rateDetails = document.querySelector('.ratedetails');
            const feedbackEntry = document.createElement('div');
            feedbackEntry.classList.add('feedback-entry');

            let starsHtml = '';
            for (let i = 0; i < 5; i++) {
                if (i < starRating) {
                    if (starRating == 1) starsHtml += '<span class="star one">★</span>';
                    else if (starRating == 2) starsHtml += '<span class="star two">★</span>';
                    else if (starRating == 3) starsHtml += '<span class="star three">★</span>';
                    else if (starRating == 4) starsHtml += '<span class="star four">★</span>';
                    else if (starRating == 5) starsHtml += '<span class="star five">★</span>';
                } else {
                    starsHtml += '<span class="star">★</span>';
                }
            }
            feedbackEntry.innerHTML = `
                <strong>${name}</strong><br>
                <div class="rating">${starsHtml}</div>
                <div class="feedback-text">${feedback}</div>
            `;
            rateDetails.appendChild(feedbackEntry);

            const response = await fetch(`/addRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, starRating, feedback})
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            if (data.error) {
                alert(data.error);
            }
            alert(data.message);

            // Reset form and star rating
            document.getElementById('ratings').value = '';
            document.getElementById('borrower').value = '';
            document.getElementById('output').innerText = `Rating is: 0/5`;
            starRating = 0;
            remove(); // Clear the stars

            checkOverflow(); // Check if overflow occurs after adding new feedback
        } else {
            alert('Please fill in all fields and select a star rating.');
        }
    });

    // Function to fetch ratings
    async function fetchRatings() {
        const response = await fetch('/getRatings');
        if (!response.ok) {
            throw new Error('Failed to fetch Ratings');
        }
        const data = await response.json();
        const rateDetails = document.querySelector('.ratedetails');
        const modalRateDetails = document.querySelector('.modal-ratedetails');

        data.forEach(rating => {
            const feedbackEntry = createFeedbackEntry(rating);
            rateDetails.appendChild(feedbackEntry);
            const modalFeedbackEntry = createFeedbackEntry(rating);
            modalRateDetails.appendChild(modalFeedbackEntry);
        });

        checkOverflow(); // Check for overflow after fetching ratings
    }

    // Function to create feedback entry
    function createFeedbackEntry(rating) {
        const feedbackEntry = document.createElement('div');
        feedbackEntry.classList.add('feedback-entry');
        let starRating = rating.rating;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < starRating) {
                if (starRating == 1) starsHtml += '<span class="star one">★</span>';
                else if (starRating == 2) starsHtml += '<span class="star two">★</span>';
                else if (starRating == 3) starsHtml += '<span class="star three">★</span>';
                else if (starRating == 4) starsHtml += '<span class="star four">★</span>';
                else if (starRating == 5) starsHtml += '<span class="star five">★</span>';
            } else {
                starsHtml += '<span class="star">★</span>';
            }
        }

        feedbackEntry.innerHTML = `
            <strong>${rating.name}</strong><br>
            <div class="rating">${starsHtml}</div>
            <div class="feedback-text">${rating.feedback}</div>
        `;
        return feedbackEntry;
    }

    // Function to check if overflow occurs and show "See more" link
    function checkOverflow() {
        const rateDetails = document.querySelector('.ratedetails');
        const seeMoreLink = document.querySelector('.see-more');
        if (rateDetails.scrollHeight > rateDetails.clientHeight) {
            seeMoreLink.style.display = 'block';
        } else {
            seeMoreLink.style.display = 'none';
        }
    }

    // Modal functionality
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const seeMoreLink = document.querySelector('.see-more');

    seeMoreLink.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflowY = 'hidden'; 
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflowY = 'auto'; 
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflowY = 'auto'; 
        }
    });
});
