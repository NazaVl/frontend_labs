let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
slides.forEach(slide => slide.classList.remove('active'));
slides[(index + slides.length) % slides.length].classList.add('active');
}

function changeSlide(step) {
currentSlide = (currentSlide + step + slides.length) % slides.length;
showSlide(currentSlide);
}


setInterval(() => {
changeSlide(1);
}, 4000);

function filterInstruments(category, clickedBtn = null) {
    const sections = document.querySelectorAll('.instrument-category');
    sections.forEach(section => {
        section.style.display = (category === 'all' || section.classList.contains(category)) ? 'block' : 'none';
    });

    const allButtons = document.querySelectorAll('.filter_button');
    allButtons.forEach(btn => btn.classList.remove('active'));


    if (clickedBtn) {
        clickedBtn.classList.add('active');
    } else {

        const target = document.querySelector(`.filter_button[data-category="${category}"]`);
        if (target) target.classList.add('active');
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    filterInstruments(category);
});