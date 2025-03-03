// Main JavaScript file for LIZENA Construction website

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initHeader();
  initMobileMenu();

  // Only initialize components if their elements exist on the page
  if (document.querySelector('.portfolio-slider__container')) {
    initPortfolioSlider();
  }

  if (document.querySelector('.testimonials-slider__container')) {
    initTestimonialsSlider();
  }

  if (document.querySelector('.portfolio-filter__btn')) {
    initPortfolioFilter();
  }

  if (document.getElementById('lightbox')) {
    initLightbox();
  }

  if (document.getElementById('contactForm')) {
    initFormValidation();
  }

  initSmoothScroll();
  initScrollAnimations();
});

// Header scroll effect
function initHeader() {
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    // Add phone number to mobile menu
    const phoneLink = document.querySelector('.header__phone-link');
    if (phoneLink && window.innerWidth < 768) {
      const phoneMobile = document.createElement('div');
      phoneMobile.className = 'header__phone-mobile';
      phoneMobile.innerHTML = phoneLink.outerHTML;
      nav.appendChild(phoneMobile);
    }

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      nav.classList.toggle('nav--active');
    });
  }
}

// Portfolio slider functionality
function initPortfolioSlider() {
  const sliderContainer = document.querySelector('.portfolio-slider__container');

  if (!sliderContainer) {
    return; // Exit if the slider container doesn't exist
  }

  const prevBtn = document.querySelector('.portfolio-slider__arrow--prev');
  const nextBtn = document.querySelector('.portfolio-slider__arrow--next');

  if (sliderContainer && prevBtn && nextBtn) {
    let slideIndex = 0;
    const slides = sliderContainer.querySelectorAll('.portfolio-slider__item');
    const slideCount = slides.length;
    let slidesToShow = 1;

    // Determine how many slides to show based on screen width
    function updateSlidesToShow() {
      if (window.innerWidth >= 1024) {
        slidesToShow = 3;
      } else if (window.innerWidth >= 768) {
        slidesToShow = 2;
      } else {
        slidesToShow = 1;
      }
    }

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);

    function updateSlider() {
      const translateValue = -slideIndex * (100 / slidesToShow) + '%';
      sliderContainer.style.transform = 'translateX(' + translateValue + ')';
    }

    prevBtn.addEventListener('click', function () {
      slideIndex = Math.max(0, slideIndex - 1);
      updateSlider();
    });

    nextBtn.addEventListener('click', function () {
      slideIndex = Math.min(slideCount - slidesToShow, slideIndex + 1);
      updateSlider();
    });
  }
}

// Testimonials slider functionality
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider__container');
  const dotsContainer = document.querySelector('.testimonials-slider__dots');

  if (!slider || !dotsContainer) {
    return; // Exit if either element doesn't exist
  }

  const slides = slider.querySelectorAll('.testimonial-card');
  const slideCount = slides.length;
  let currentSlide = 0;

  // Create dots
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('button');
    dot.classList.add('testimonials-slider__dot');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', function () {
      goToSlide(i);
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.testimonials-slider__dot');

  function goToSlide(index) {
    currentSlide = index;
    const translateValue = -currentSlide * 100 + '%';
    slider.style.transform = 'translateX(' + translateValue + ')';

    // Update active dot
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Initialize first slide
  goToSlide(0);

  // Auto slide every 5 seconds
  setInterval(function () {
    currentSlide = (currentSlide + 1) % slideCount;
    goToSlide(currentSlide);
  }, 5000);
}

// Portfolio filter functionality
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter__btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('portfolio-filter__btn--active'));
        this.classList.add('portfolio-filter__btn--active');

        const filterValue = this.getAttribute('data-filter');

        // Filter items
        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

// Lightbox functionality
function initLightbox() {
  const lightbox = document.getElementById('lightbox');

  if (!lightbox) {
    return; // Exit if lightbox doesn't exist
  }

  const lightboxImage = document.querySelector('.lightbox__image');
  const lightboxCaption = document.querySelector('.lightbox__caption');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__arrow--prev');
  const lightboxNext = document.querySelector('.lightbox__arrow--next');
  const portfolioItems = document.querySelectorAll('.portfolio-item__zoom');

  if (!lightboxImage || !lightboxCaption || !lightboxClose || !lightboxPrev || !lightboxNext || !portfolioItems.length) {
    return; // Exit if any required element doesn't exist
  }

  let currentIndex = 0;
  const images = [];
  const captions = [];

  // Collect all portfolio images and captions
  portfolioItems.forEach((item, index) => {
    const imgContainer = item.closest('.portfolio-item__image');
    if (!imgContainer) return;

    const img = imgContainer.querySelector('img');
    if (!img) return;

    const portfolioItem = item.closest('.portfolio-item');
    if (!portfolioItem) return;

    const captionElement = portfolioItem.querySelector('.portfolio-item__title');
    if (!captionElement) return;

    images.push(img.src);
    captions.push(captionElement.textContent);

    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = images[currentIndex];
    lightboxCaption.textContent = captions[currentIndex];
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
    lightboxCaption.textContent = captions[currentIndex];
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex];
    lightboxCaption.textContent = captions[currentIndex];
  }

  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    }
  });
}

// Form validation
function initFormValidation() {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) {
    return; // Exit if form doesn't exist
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    // Name validation
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');

    if (nameInput && nameError) {
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name';
        nameInput.classList.add('form__input--error');
        isValid = false;
      } else {
        nameError.textContent = '';
        nameInput.classList.remove('form__input--error');
      }
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput && emailError) {
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address';
        emailInput.classList.add('form__input--error');
        isValid = false;
      } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.classList.add('form__input--error');
        isValid = false;
      } else {
        emailError.textContent = '';
        emailInput.classList.remove('form__input--error');
      }
    }

    // Subject validation
    const subjectInput = document.getElementById('subject');
    const subjectError = document.getElementById('subjectError');

    if (subjectInput && subjectError) {
      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please enter a subject';
        subjectInput.classList.add('form__input--error');
        isValid = false;
      } else {
        subjectError.textContent = '';
        subjectInput.classList.remove('form__input--error');
      }
    }

    // Message validation
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('messageError');

    if (messageInput && messageError) {
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter your message';
        messageInput.classList.add('form__textarea--error');
        isValid = false;
      } else {
        messageError.textContent = '';
        messageInput.classList.remove('form__textarea--error');
      }
    }

    // Privacy checkbox validation
    const privacyCheckbox = document.getElementById('privacy');
    const privacyError = document.getElementById('privacyError');

    if (privacyCheckbox && privacyError) {
      if (!privacyCheckbox.checked) {
        privacyError.textContent = 'You must agree to the Privacy Policy';
        isValid = false;
      } else {
        privacyError.textContent = '';
      }
    }

    // If form is valid, submit it (in a real scenario, this would send data to a server)
    if (isValid) {
      // Show success message
      const formContainer = contactForm.closest('.form-container');
      if (formContainer) {
        formContainer.innerHTML = `
          <div class="form-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you shortly.</p>
          </div>
        `;
      }
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length) {
    function checkReveal() {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    }

    // Check on initial load
    checkReveal();

    // Check on scroll
    window.addEventListener('scroll', checkReveal);
  }
}