document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.lpimages', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 2000, // Adjust the delay between slides (in milliseconds) as needed
            disableOnInteraction: false, // Continue autoplay even when user interacts with slides
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});