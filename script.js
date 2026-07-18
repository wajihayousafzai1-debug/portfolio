const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const header = document.querySelector('[data-header]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    themeToggle?.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
        'content',
        theme === 'dark' ? '#090b0f' : '#f5f6f8'
    );
}

setTheme(root.dataset.theme);

themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

function closeNavigation() {
    navLinks?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
}

navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navLinks?.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
});

document.addEventListener('click', (event) => {
    if (!navLinks?.contains(event.target) && !navToggle?.contains(event.target)) {
        closeNavigation();
    }
});

let previousScrollY = window.scrollY;
let scrollFrame;

function updateHeader() {
    const currentScrollY = window.scrollY;
    header?.classList.toggle('is-scrolled', currentScrollY > 16);
    header?.classList.toggle(
        'is-hidden',
        window.innerWidth > 960 && currentScrollY > previousScrollY && currentScrollY > 240 && !navLinks?.classList.contains('is-open')
    );
    previousScrollY = currentScrollY;
    scrollFrame = undefined;
}

window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
}, { passive: true });

const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => revealObserver.observe(item));
}

const currentPage = document.body.dataset.page;
if (currentPage) {
    document.querySelector(`.nav-links [data-page="${currentPage}"]`)?.setAttribute('aria-current', 'page');
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
