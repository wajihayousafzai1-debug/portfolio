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
}

navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks?.classList.toggle('is-open', !isOpen);
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
        currentScrollY > previousScrollY && currentScrollY > 240 && !navLinks?.classList.contains('is-open')
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

const navigationAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = navigationAnchors
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navigationAnchors.forEach((link) => {
                const isCurrent = link.getAttribute('href') === '#' + entry.target.id;
                if (isCurrent) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
