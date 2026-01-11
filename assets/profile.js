// Back to Top Button Visibility
window.addEventListener('scroll', function() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (window.pageYOffset > 100) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            entry.target.offsetHeight; // Trigger reflow
            entry.target.style.animation = '';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .skill-badge, .portfolio-item').forEach(el => {
    observer.observe(el);
});