// ================== PAGE NAVIGATION ==================
const initNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });
};

const showSection = (sectionId) => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// ================== SLIDER CONTROL ==================
const initSlider = () => {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    
    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    };

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 4000);

    // Allow manual slide advancement (optional enhancement)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        } else if (e.key === 'ArrowLeft') {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
    });
};

// ================== FORM VALIDATION ==================
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    const phoneRegex = /^[0-9\-\s()]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateCaptcha = (input) => {
    const correctAnswer = '45H2';
    return input.toUpperCase().replace(/\s/g, '') === correctAnswer;
};

const clearError = (fieldId) => {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
};

const showError = (fieldId, message) => {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
};

const initFormValidation = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Real-time validation
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            if (nameInput.value.trim() === '') {
                showError('name', 'お名前を入力してください');
            } else {
                clearError('name');
            }
        });
    }

    const furiganaInput = document.getElementById('furigana');
    if (furiganaInput) {
        furiganaInput.addEventListener('blur', () => {
            if (furiganaInput.value.trim() === '') {
                showError('furigana', 'ふりがなを入力してください');
            } else {
                clearError('furigana');
            }
        });
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email === '') {
                showError('email', 'メールアドレスを入力してください');
            } else if (!validateEmail(email)) {
                showError('email', '有効なメールアドレスを入力してください');
            } else {
                clearError('email');
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            const phone = phoneInput.value.trim();
            if (phone === '') {
                showError('phone', '電話番号を入力してください');
            } else if (!validatePhone(phone)) {
                showError('phone', '有効な電話番号を入力してください');
            } else {
                clearError('phone');
            }
        });
    }

    const messageInput = document.getElementById('message');
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            if (messageInput.value.trim() === '') {
                showError('message', 'お問い合わせ内容を入力してください');
            } else {
                clearError('message');
            }
        });
    }

    const captchaInput = document.getElementById('captcha');
    if (captchaInput) {
        captchaInput.addEventListener('blur', () => {
            if (captchaInput.value.trim() === '') {
                showError('captcha', 'CAPTCHA を入力してください');
            } else if (!validateCaptcha(captchaInput.value)) {
                showError('captcha', '正しいCAPTCHAを入力してください');
            } else {
                clearError('captcha');
            }
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear all errors
        ['name', 'furigana', 'email', 'phone', 'message', 'agree', 'captcha'].forEach(id => clearError(id));

        // Validate all fields
        let isValid = true;

        const name = nameInput.value.trim();
        if (name === '') {
            showError('name', 'お名前を入力してください');
            isValid = false;
        }

        const furigana = furiganaInput.value.trim();
        if (furigana === '') {
            showError('furigana', 'ふりがなを入力してください');
            isValid = false;
        }

        const email = emailInput.value.trim();
        if (email === '') {
            showError('email', 'メールアドレスを入力してください');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', '有効なメールアドレスを入力���てください');
            isValid = false;
        }

        const phone = phoneInput.value.trim();
        if (phone === '') {
            showError('phone', '電話番号を入力してください');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phone', '有効な電話番号を入力してください');
            isValid = false;
        }

        const message = messageInput.value.trim();
        if (message === '') {
            showError('message', 'お問い合わせ内容を入力してください');
            isValid = false;
        }

        const agreeCheckbox = document.getElementById('agree');
        if (!agreeCheckbox.checked) {
            showError('agree', '同意が必要です');
            isValid = false;
        }

        const captcha = captchaInput.value.trim();
        if (captcha === '') {
            showError('captcha', 'CAPTCHA を入力してください');
            isValid = false;
        } else if (!validateCaptcha(captcha)) {
            showError('captcha', '正しいCAPTCHAを入力してください');
            isValid = false;
        }

        if (isValid) {
            // Here you would normally send the form data to a server
            const formData = new FormData(form);
            console.log('Form data ready to send:', Object.fromEntries(formData));
            
            // Success message (replace with actual backend submission)
            alert('お問い合わせありがとうございます。確認いたします。');
            form.reset();
            clearError('captcha');
        }
    });
};

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSlider();
    initFormValidation();
});