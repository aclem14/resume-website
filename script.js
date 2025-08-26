// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Dark mode
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
if (initialTheme === 'dark') {
  root.classList.add('dark');
  if (themeToggle) {
    themeToggle.textContent = '☀️ Light Mode';
    themeToggle.setAttribute('aria-pressed', 'true');
  }
}
themeToggle?.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark');
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Print
document.getElementById('printBtn')?.addEventListener('click', () => window.print());

// Skill Focus (radio)
const focusRadios = document.querySelectorAll('.focus-toggle input[type="radio"]');
const skillItems = Array.from(document.querySelectorAll('[data-skill-group]'));
const jobCards = Array.from(document.querySelectorAll('.job'));
function setFocus(mode) {
  [...skillItems, ...jobCards].forEach(el => el.classList.remove('dim', 'highlight'));
  if (mode === 'all') return;
  skillItems.forEach(li => {
    const groups = (li.dataset.skillGroup || '').split(/\s+/);
    if (groups.includes(mode)) li.classList.add('highlight');
    else if (!groups.includes('neutral')) li.classList.add('dim');
  });
  jobCards.forEach(card => {
    const roles = (card.dataset.role || '').split(/\s+/);
    if (roles.includes(mode)) card.classList.add('highlight');
    else if (!roles.includes('neutral')) card.classList.add('dim');
  });
}
focusRadios.forEach(r => r.addEventListener('change', () => r.checked && setFocus(r.value)));
setFocus('all');

// Contact form → your local API
// Use local API in dev, Render API in production
const API_BASE =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://resume-contact-api.onrender.com'; // ← replace with your Render URL after you deploy

const API_CONTACT = `${API_BASE}/api/contact`;
const contactForm = document.getElementById('contactForm');
const contactSubmit = document.getElementById('contactSubmit');
const contactStatus = document.getElementById('contactStatus');
if (contactForm && contactSubmit && contactStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactStatus.textContent = '';
    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending...';

    const payload = Object.fromEntries(new FormData(contactForm).entries());
    try {
      const res = await fetch(API_CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        contactStatus.textContent = 'Thanks! Your message has been sent.';
        contactForm.reset();
      } else {
        contactStatus.textContent = data.error || 'Something went wrong. Please try again.';
      }
    } catch {
      contactStatus.textContent = 'Network error. Please try again later.';
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = 'Send Message';
    }
  });
}
