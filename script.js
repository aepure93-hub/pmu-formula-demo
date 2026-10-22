const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const campaign = new URLSearchParams(window.location.search).get('utm_campaign');
if (campaign === 'studio_origin') {
  document.querySelectorAll('[data-track="app-store"]').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set('itsct', 'studio_origin');
    link.href = url.toString();
  });
}
