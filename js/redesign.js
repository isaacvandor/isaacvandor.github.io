/**
 * Isaac Vandor Portfolio - JavaScript
 * Modern, accessible, and performant interactions
 */

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit rate of function execution
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===================================
// MOBILE NAVIGATION
// ===================================

function initMobileNav() {
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarItems = document.querySelectorAll('.navbar-item');

  if (!navbarToggle || !navbarMenu) return;

  // Toggle mobile menu
  navbarToggle.addEventListener('click', () => {
    const isActive = navbarMenu.classList.toggle('active');
    navbarToggle.classList.toggle('active');
    navbarToggle.setAttribute('aria-expanded', isActive);
  });

  // Close menu when clicking on nav items
  navbarItems.forEach(item => {
    item.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = debounce(() => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 10);

  window.addEventListener('scroll', handleScroll);
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without triggering scroll
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

// ===================================
// INTERSECTION OBSERVER ANIMATIONS
// ===================================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('animated'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// DARK MODE TOGGLE
// ===================================

function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  if (!themeToggle) return;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // Toggle theme
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (!sunIcon || !moonIcon) return;

    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
}

// ===================================
// CONTACT FORM VALIDATION & HANDLING
// ===================================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formStatus = document.getElementById('form-status');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation functions
  function validateName() {
    const name = nameInput.value.trim();
    const errorEl = document.getElementById('name-error');

    if (name.length < 2) {
      errorEl.textContent = 'Name must be at least 2 characters';
      return false;
    }

    errorEl.textContent = '';
    return true;
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const errorEl = document.getElementById('email-error');

    if (!emailRegex.test(email)) {
      errorEl.textContent = 'Please enter a valid email address';
      return false;
    }

    errorEl.textContent = '';
    return true;
  }

  function validateMessage() {
    const message = messageInput.value.trim();
    const errorEl = document.getElementById('message-error');

    if (message.length < 10) {
      errorEl.textContent = 'Message must be at least 10 characters';
      return false;
    }

    errorEl.textContent = '';
    return true;
  }

  // Real-time validation
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      formStatus.innerHTML = '<p class="form-error">Please fix the errors above</p>';
      return;
    }

    // Get form data
    const formData = new FormData(form);

    try {
      // Show loading state
      formStatus.innerHTML = '<p style="color: var(--color-text-secondary);">Sending message...</p>';

      // Submit form
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.innerHTML = '<p class="form-success">Thanks for your message! I\'ll get back to you soon.</p>';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formStatus.innerHTML = '<p class="form-error">Oops! There was a problem sending your message. Please try again or email me directly.</p>';
    }
  });
}

// ===================================
// LAZY LOAD IMAGES
// ===================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    return;
  }

  // Fallback for browsers that don't support native lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback: load all images immediately
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================

function initKeyboardNav() {
  // Focus trap for mobile menu when open
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarToggle = document.getElementById('navbar-toggle');

  if (!navbarMenu || !navbarToggle) return;

  const focusableElements = navbarMenu.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  navbarMenu.addEventListener('keydown', (e) => {
    if (!navbarMenu.classList.contains('active')) return;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// ===================================
// ACTIVE SECTION HIGHLIGHTING
// ===================================

function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.navbar-item');

  if (!sections.length || !navItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');

        // Remove active class from all nav items
        navItems.forEach(item => {
          const href = item.getAttribute('href');
          if (href === `#${sectionId}`) {
            // Add visual indicator (you can style this in CSS)
            item.style.color = 'var(--color-accent-primary)';
          } else {
            item.style.color = '';
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

function logPerformance() {
  if (!window.performance) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.log('Performance Metrics:');
      console.log(`Total Page Load Time: ${pageLoadTime}ms`);
      console.log(`Server Response Time: ${connectTime}ms`);
      console.log(`DOM Render Time: ${renderTime}ms`);
    }, 0);
  });
}

// ===================================
// INITIALIZATION
// ===================================

function init() {
  // Initialize all features
  initMobileNav();
  initNavbarScroll();
  initSmoothScroll();
  initScrollAnimations();
  initDarkMode();
  initContactForm();
  initLazyLoading();
  initKeyboardNav();
  initActiveSection();

  // Log performance in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
  }

  console.log('Portfolio initialized successfully');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
