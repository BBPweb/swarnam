
// Accessible Brands dropdown for desktop and mobile.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-brands-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-brands-toggle');
    const close = () => { dropdown.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', (event) => {
      event.preventDefault(); event.stopPropagation();
      const open = !dropdown.classList.contains('is-open');
      dropdown.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    document.querySelector('.mobile-menu-toggle')?.addEventListener('click', close);
  });
});
