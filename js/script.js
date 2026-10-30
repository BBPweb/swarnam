
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('enquiry').value || 'info@swarnamgroup.com';
            window.location.href = 'mailto:' + email + '?subject=Swarnam Website Enquiry';
        });
    }
});
