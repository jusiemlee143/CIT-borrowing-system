document.addEventListener('DOMContentLoaded', function() {
    const containerGroups = document.querySelectorAll('.containerGroup');
    const infoBoxQuestion = document.querySelector('.InfoBox .Question');
    const infoBoxContent = document.querySelector('.InfoBox .content');

    // Object containing content for each container
    const containerContent = {
        container1: {
            question: "How do I borrow tools and Equipments?",
            content: "To borrow tools, you just have to fill up the details needed."
        },
        /*container2: {
            question: "What happens if I return borrowed tools and equipment late?",
            content: "Overdue items may result in penalties or additional fees. Please make sure to return borrowed items on time to avoid any inconvenience."
        },*/
        container3: {
            question: "What type of laboratory tools and equipment are available for borrowing?",
            content: "We offer a wide range of laboratory tools and equipment for borrowing, including but not limited to microscopes, test tubes, pipettes, and more. Visit our website for a complete list."
        },
        container4: {
            question: "Is it possible to renew borrowed items?",
            content: "Yes, it is possible to renew borrowed items, provided there are no pending reservations on the item. You can renew items online through our website or by contacting the library staff."
        },
        container5: {
            question: "What should I do if I lose or damage an item?",
            content: "If you lose or damage an item, please report it immediately to the assigned staff. Depending on the item's value and condition, you may be asked to replace it or pay for the damages."
        },
        container6: {
            question: "How do i create an account to borrow items?",
            content: "The borrowing system does not require an account, if you're a student, it will just ask you to fill the items needed. However, if you're an LIC, the admin will be the one to give you an account."
        }
    };

    // Function to update InfoBox content based on container clicked
    function updateInfoBox(containerId) {
        const content = containerContent[containerId];
        infoBoxQuestion.textContent = content.question;
        infoBoxContent.textContent = content.content;
    }

    // Event listener for each container click
    containerGroups.forEach(function(container) {
        container.addEventListener('click', function() {
            const containerId = container.id;
            updateInfoBox(containerId);
        });
    });
});
