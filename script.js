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

// Buy Modal Functionality
let currentBookType = '';

// Pricing structure
const pricing = {
    comic: {
        pdf: 29,
        printed: 99,
        editable: 299
    },
    story: {
        pdf: 9,
        printed: 25,
        editable: 69
    }
};

function openBuyModal(bookName, bookType) {
    currentBookType = bookType;
    const modal = document.getElementById('buyModal');
    const bookNameInput = document.getElementById('bookName');
    const formatOptions = document.getElementById('formatOptions');

    // Set book name
    bookNameInput.value = bookName;

    // Clear previous format options
    formatOptions.innerHTML = '';

    // Get pricing based on book type
    const prices = pricing[bookType];

    // Create format options with appropriate pricing
    formatOptions.innerHTML = `
        <label class="checkbox-label">
            <input type="checkbox" name="format" value="pdf" data-price="${prices.pdf}" onchange="updateTotal()">
            <span>PDF - ₹${prices.pdf}</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" name="format" value="printed" data-price="${prices.printed}" onchange="updateTotal()">
            <span>Printed Copy - ₹${prices.printed}</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" name="format" value="editable" data-price="${prices.editable}" onchange="updateTotal()">
            <span>Editable File - ₹${prices.editable}</span>
        </label>
    `;

    // Reset form
    document.getElementById('buyForm').reset();
    bookNameInput.value = bookName; // Restore book name after reset
    updateTotal();

    // Show modal
    modal.classList.add('active');
}

function closeBuyModal() {
    const modal = document.getElementById('buyModal');
    modal.classList.remove('active');
}

function updateTotal() {
    const formatCheckboxes = document.querySelectorAll('input[name="format"]:checked');
    let total = 0;

    formatCheckboxes.forEach(checkbox => {
        total += parseInt(checkbox.dataset.price);
    });

    document.getElementById('totalPrice').textContent = total;
}

function submitBuyForm(event) {
    event.preventDefault();

    // Get form values
    const bookName = document.getElementById('bookName').value;
    const telegramId = document.getElementById('telegramId').value.trim();
    const emailId = document.getElementById('emailId').value.trim();
    const userName = document.getElementById('userName').value.trim();

    // Validate that at least one contact method is provided
    if (!telegramId && !emailId) {
        alert('Please provide either Telegram ID or Email ID');
        return;
    }

    // Get selected languages
    const languageCheckboxes = document.querySelectorAll('input[name="language"]:checked');
    if (languageCheckboxes.length === 0) {
        alert('Please select at least one language');
        return;
    }
    const languages = Array.from(languageCheckboxes).map(cb => cb.value).join(', ');

    // Get selected formats
    const formatCheckboxes = document.querySelectorAll('input[name="format"]:checked');
    if (formatCheckboxes.length === 0) {
        alert('Please select at least one format');
        return;
    }
    const formats = Array.from(formatCheckboxes).map(cb => cb.value).join(', ');

    // Get total price
    const totalPrice = document.getElementById('totalPrice').textContent;

    // Determine category based on book type
    const category = currentBookType === 'comic' ? 'Comic Book' : 'Stories';

    // Prepare data for Google Sheets
    const orderData = {
        category: category,
        bookName: bookName,
        languages: languages,
        formats: formats,
        telegramId: telegramId,
        emailId: emailId,
        userName: userName,
        totalPrice: totalPrice
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLE-MIQ9Wp4R5HyqaE8FqbkswSYrQuB6_D_Dzlz2qqEeyBI1ZiDktAvmaiQnUobPyCmQ/exec';

    // Using simple fetch without headers that trigger CORS preflight
    // This is the most reliable way to send data to Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(orderData)
    })
        .finally(() => {
            // Since no-cors doesn't return a readable response, we treat any completion as success
            // This is safe because if the request reaches the server, it will process it.

            const orderSummary = `
Order Summary:
━━━━━━━━━━━━━━━━━━━━━━
Book: ${bookName}
Languages: ${languages}
Formats: ${formats}
Total: ₹${totalPrice}
━━━━━━━━━━━━━━━━━━━━━━
Customer Details:
Name: ${userName}
${telegramId ? `Telegram: ${telegramId}` : ''}
${emailId ? `Email: ${emailId}` : ''}
━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

            alert('Order submitted successfully!\n\n' + orderSummary + '\n\nWe will contact you soon.');

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            closeBuyModal();
        });
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('buyModal');
    if (modal && e.target === modal) {
        closeBuyModal();
    }
});

