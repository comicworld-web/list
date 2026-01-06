document.addEventListener('DOMContentLoaded', () => {
    // Age Verification Logic
    const ageModal = document.getElementById('ageModal');
    if (!localStorage.getItem('ageVerified')) {
        if (ageModal) {
            // Small delay to ensure smooth loading
            setTimeout(() => {
                ageModal.classList.add('active');
            }, 500);
        }
    }

    // Scroll Animation for Cards
    const cards = document.querySelectorAll('.card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s, box-shadow 0.4s ease, border-color 0.4s ease`; // Keep hover transitions separate
        observer.observe(card);
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

function readComic(title) {
    alert(`Opening reader for: ${title}\n(This is a demo interaction)`);
}

function enterSite() {
    localStorage.setItem('ageVerified', 'true');
    const ageModal = document.getElementById('ageModal');
    if (ageModal) {
        ageModal.classList.remove('active');
    }
}

function exitSite() {
    window.location.href = "https://www.google.com";
}
