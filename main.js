// ── Splash overlay ────────────────────────────────────────────────────────────
(function initSplash() {
  const splash = document.getElementById('splash-overlay');
  if (!splash) return;

  function dismissSplash() {
    splash.classList.add('hidden');
    splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    window.removeEventListener('scroll', onScrollDismiss);
  }

  function onScrollDismiss() {
    if (window.scrollY > 10) dismissSplash();
  }

  document.getElementById('splash-close').addEventListener('click', dismissSplash);
  window.addEventListener('scroll', onScrollDismiss);
})();

// ── Nav sticky on scroll ──────────────────────────────────────────────────────
const nav = document.querySelector('nav');
const banner = document.querySelector('.banner');
const konten = document.querySelector('.konten');

function onScroll() {
  const bannerBottom = banner.getBoundingClientRect().bottom;
  if (bannerBottom <= 0) {
    if (!nav.classList.contains('nav-fixed')) {
      nav.classList.add('nav-fixed');
      konten.style.paddingTop = nav.offsetHeight + 'px';
    }
  } else {
    if (nav.classList.contains('nav-fixed')) {
      nav.classList.remove('nav-fixed');
      konten.style.paddingTop = '';
    }
  }
}

window.addEventListener('scroll', onScroll);

// ── Nav active link tracking ──────────────────────────────────────────────────
function setNavActive(href) {
  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === href);
  });
}

(function initNavTracking() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // All nav links pointing to the current page (with or without anchor)
  const pageNavLinks = Array.from(document.querySelectorAll('nav a')).filter(a => {
    const href = a.getAttribute('href') || '';
    return (href.split('#')[0] || 'index.html') === currentPage;
  });

  if (pageNavLinks.length === 0) return;

  const baseNavLink = pageNavLinks.find(a => !a.getAttribute('href').includes('#'));
  const anchorNavLinks = pageNavLinks.filter(a => a.getAttribute('href').includes('#'));

  // Build anchorMap from explicit anchor links (e.g. page.html#section)
  const anchorMap = anchorNavLinks.map(a => {
    const href = a.getAttribute('href');
    return { id: href.split('#')[1], href };
  });

  // Also observe the section whose id matches the page name (e.g. #kesimpulan on kesimpulan.html)
  // so the base nav link activates when that section is in view
  if (baseNavLink) {
    const pageId = currentPage.replace('.html', '');
    if (document.getElementById(pageId)) {
      anchorMap.unshift({ id: pageId, href: baseNavLink.getAttribute('href') });
    }
  }

  if (anchorMap.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = anchorMap.find(s => s.id === entry.target.id);
          if (match) setNavActive(match.href);
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

    anchorMap.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // When near top of page, activate the base link
  if (baseNavLink) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 50) setNavActive(baseNavLink.getAttribute('href'));
    });
  }
})();

// ── Carousel ──────────────────────────────────────────────────────────────────
let currentSlide = 0;

function showSlide(n) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');

  if (n >= slides.length) currentSlide = 0;
  else if (n < 0) currentSlide = slides.length - 1;

  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

function currentSlideIndicator(n) {
  currentSlide = n;
  showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.carousel-slide')) {
    showSlide(currentSlide);
  }
});
