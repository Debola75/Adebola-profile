const backToTopBtn = document.querySelector('.back-to-top');
const currentYear = document.getElementById('current-year');
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const setTheme = (theme) => {
    root.dataset.theme = theme;

    if (!themeToggle) return;

    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
};

if (themeToggle) {
    setTheme(root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    themeToggle.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);

        try {
            localStorage.setItem('adebola-theme', nextTheme);
        } catch (error) {
            console.warn('Theme preference could not be saved.', error);
        }
    });
}

const toggleBackToTop = () => {
    if (!backToTopBtn) return;

    if (window.scrollY > 140) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
};

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addEventListener('scroll', toggleBackToTop, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

if (contactForm instanceof HTMLFormElement && formStatus) {
    const nameField = contactForm.elements.namedItem('name');
    const messageField = contactForm.elements.namedItem('message');

    if (nameField instanceof HTMLInputElement) {
        nameField.addEventListener('input', () => {
            nameField.setCustomValidity(nameField.value.trim() ? '' : 'Please enter your name.');
        });
    }

    if (messageField instanceof HTMLTextAreaElement) {
        messageField.addEventListener('input', () => {
            messageField.setCustomValidity(
                messageField.value.trim().length >= 20
                    ? ''
                    : 'Please enter at least 20 non-space characters about your project.'
            );
        });
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        formStatus.classList.remove('is-error');

        if (nameField instanceof HTMLInputElement) {
            nameField.setCustomValidity(nameField.value.trim() ? '' : 'Please enter your name.');
        }
        if (messageField instanceof HTMLTextAreaElement) {
            messageField.setCustomValidity(
                messageField.value.trim().length >= 20
                    ? ''
                    : 'Please enter at least 20 non-space characters about your project.'
            );
        }

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            formStatus.textContent = 'Please check the highlighted fields and try again.';
            formStatus.classList.add('is-error');
            return;
        }

        const fields = new FormData(contactForm);
        const name = String(fields.get('name')).trim();
        const email = String(fields.get('email')).trim();
        const service = String(fields.get('service'));
        const message = String(fields.get('message')).trim();
        const subject = `Website project inquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`;

        formStatus.textContent = 'Your email app should open with the message ready to send.';
        window.location.href = `mailto:adebolaogunsanya75@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

const counters = document.querySelectorAll('.counter');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';

    if (!Number.isFinite(target) || target < 0 || prefersReducedMotion) {
        counter.textContent = `${counter.dataset.target}${suffix}`;
        return;
    }

    const duration = 1400;
    const startTime = performance.now();
    counter.textContent = `0${suffix}`;

    const updateCounter = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * easedProgress)}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(updateCounter);
        }
    };

    window.requestAnimationFrame(updateCounter);
};

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach((element) => {
        revealObserver.observe(element);
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });
} else {
    document.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('visible');
    });
}

toggleBackToTop();