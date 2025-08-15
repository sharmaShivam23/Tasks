const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('success');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;

    clearErrors();

    if (nameInput.value.trim() === "") {
        showError(nameInput, "Name is required");
        valid = false;
    }

    if (emailInput.value.trim() === "") {
        showError(emailInput, "Email is required");
        valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, "Invalid email format");
        valid = false;
    }

    if (messageInput.value.trim() === "") {
        showError(messageInput, "Message is required");
        valid = false;
    }

    if (valid) {
        successMessage.textContent = "Message sent successfully!";
        form.reset();
    }
});

function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error');
    error.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(e => e.textContent = "");
    successMessage.textContent = "";
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
