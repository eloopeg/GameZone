const navToggle = document.querySelector('[data-nav-toggle]');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const sections = document.querySelectorAll('main section[id]');
const navbar = document.querySelector('nav');
const backToTopButton = document.getElementById('backToTop');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));

    if (!expanded) {
      navToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    mobileMenu.classList.toggle('hidden');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768 && mobileMenu) {
      mobileMenu.classList.add('hidden');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    }
  });
});

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const active = href === `#${id}`;
    link.classList.toggle('active', active);
    link.classList.toggle('text-yellow-300', active);
    link.classList.toggle('text-white/80', !active);
    link.classList.remove('text-white');
    link.setAttribute('aria-current', active ? 'page' : 'false');
  });
};

const updateScrollSpy = () => {
  const activationLine = (navbar?.getBoundingClientRect().height ?? 0) + 24;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) {
      activeSection = section;
    }
  });

  if (activeSection) {
    setActiveLink(activeSection.id);
  }
};

window.addEventListener('scroll', updateScrollSpy, { passive: true });
window.addEventListener('resize', updateScrollSpy);
window.addEventListener('hashchange', updateScrollSpy);
updateScrollSpy();

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const indicators = Array.from(carousel.querySelectorAll('[data-carousel-indicator]'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');

  let currentIndex = 0;
  let autoSlideId = null;

  const renderSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle('active', isActive);
      slide.classList.toggle('opacity-100', isActive);
      slide.classList.toggle('opacity-0', !isActive);
      slide.classList.toggle('translate-x-0', isActive);
      slide.classList.toggle('translate-x-full', !isActive && slideIndex > index);
      slide.classList.toggle('-translate-x-full', !isActive && slideIndex < index);
    });

    indicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === index;
      indicator.classList.toggle('bg-yellow-400', isActive);
      indicator.classList.toggle('w-8', isActive);
      indicator.classList.toggle('w-3', !isActive);
      indicator.classList.toggle('bg-white/40', !isActive);
      indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    renderSlide(currentIndex);
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideId);
    autoSlideId = setInterval(() => showSlide(currentIndex + 1), 4000);
  };

  prevButton?.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    startAutoSlide();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    startAutoSlide();
  });

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      const targetIndex = Number(indicator.dataset.carouselIndicator);
      showSlide(targetIndex);
      startAutoSlide();
    });
  });

  carousel.addEventListener('mouseenter', () => clearInterval(autoSlideId));
  carousel.addEventListener('mouseleave', startAutoSlide);

  renderSlide(currentIndex);
  startAutoSlide();
}

const faqButtons = document.querySelectorAll('[data-faq-button]');
faqButtons.forEach((button) => {
  const panel = button.nextElementSibling;
  if (button.getAttribute('aria-expanded') === 'true') {
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    button.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
  }

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    faqButtons.forEach((item) => {
      const itemPanel = item.nextElementSibling;
      item.setAttribute('aria-expanded', 'false');
      if (itemPanel) {
        itemPanel.style.maxHeight = '0px';
        itemPanel.style.opacity = '0';
      }
      const itemIcon = item.querySelector('.faq-icon');
      if (itemIcon) {
        itemIcon.style.transform = 'rotate(0deg)';
      }
    });

    if (!isExpanded) {
      button.setAttribute('aria-expanded', 'true');
      if (panel) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.style.opacity = '1';
      }
      const icon = button.querySelector('.faq-icon');
      if (icon) {
        icon.style.transform = 'rotate(180deg)';
      }
    }
  });
});

const handleBackToTop = () => {
  if (window.scrollY > 420) {
    backToTopButton?.classList.remove('opacity-0', 'pointer-events-none');
  } else {
    backToTopButton?.classList.add('opacity-0', 'pointer-events-none');
  }
};

window.addEventListener('scroll', handleBackToTop);
handleBackToTop();

backToTopButton?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const registrationForm = document.getElementById('gaming-registration-form');
const formStatus = document.getElementById('form-status');

if (registrationForm && formStatus) {
  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.classList.remove('hidden');
    formStatus.textContent = 'Registration submitted successfully. Welcome to the arena!';
    registrationForm.reset();
  });

  registrationForm.addEventListener('reset', () => {
    setTimeout(() => {
      formStatus.classList.add('hidden');
    }, 100);
  });
}
