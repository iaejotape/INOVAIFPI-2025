// ===== MAIN JAVASCRIPT =====

import { 
  throttle, 
  debounce, 
  smoothScrollTo, 
  isInViewport,
  getTimeDifference,
  padNumber,
  storage,
  errorHandler
} from './utils.js';

/**
 * Main Application Class
 */
class InovaApp {
  constructor() {
    this.isLoaded = false;
    this.scrollPosition = 0;
    this.isScrolling = false;
    this.countdownInterval = null;
    this.eventDate = new Date('2025-10-07T09:00:00'); // Ajustar data do evento
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents();
    this.initializeComponents();
    this.startCountdown();
    this.handleLoading();
    
    // Mark as loaded
    this.isLoaded = true;
    console.log('Inova 2025 - Site carregado com sucesso! 🚀');
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Window events
    window.addEventListener('load', this.handleWindowLoad.bind(this));
    window.addEventListener('scroll', throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));
    
    // Navigation events
    this.bindNavigationEvents();
    
    // Form events
    this.bindFormEvents();
    
    // Modal events
    this.bindModalEvents();
    
    // Back to top button
    this.bindBackToTopEvents();
    
    // Keyboard events
    this.bindKeyboardEvents();
  }

  /**
   * Handle window load event
   */
  handleWindowLoad() {
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 1000);
    }

    // Initialize scroll animations
    this.initScrollAnimations();
    
    // Initialize lazy loading
    this.initLazyLoading();
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const currentScroll = window.pageYOffset;
    const scrollDirection = currentScroll > this.scrollPosition ? 'down' : 'up';
    
    // Update header on scroll
    this.updateHeaderOnScroll(currentScroll);
    
    // Update back to top button
    this.updateBackToTop(currentScroll);
    
    // Handle scroll animations
    this.handleScrollAnimations();
    
    // Update scroll position
    this.scrollPosition = currentScroll;
    
    // Set scrolling flag
    this.isScrolling = true;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update mobile menu if needed
    this.updateMobileMenu();
    
    // Recalculate scroll animations
    this.initScrollAnimations();
    
    // Update countdown layout if needed
    this.updateCountdownLayout();
  }

  /**
   * Update header appearance on scroll
   */
  updateHeaderOnScroll(scrollPosition) {
    const header = document.querySelector('.header');
    if (!header) return;

    if (scrollPosition > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /**
   * Update back to top button visibility
   */
  updateBackToTop(scrollPosition) {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    if (scrollPosition > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  /**
   * Initialize scroll animations
   */
  initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    elements.forEach((element, index) => {
      if (isInViewport(element, 0.1)) {
        setTimeout(() => {
          element.classList.add('revealed');
        }, index * 100);
      }
    });
  }

  /**
   * Handle scroll animations
   */
  handleScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-reveal-left:not(.revealed), .scroll-reveal-right:not(.revealed), .scroll-reveal-scale:not(.revealed)');
    
    elements.forEach((element, index) => {
      if (isInViewport(element, 0.1)) {
        setTimeout(() => {
          element.classList.add('revealed');
        }, index * 50);
      }
    });

    // Handle stagger animations
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    staggerContainers.forEach(container => {
      if (isInViewport(container, 0.1)) {
        const items = container.querySelectorAll('.stagger-item:not(.revealed)');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('revealed');
          }, index * 100);
        });
      }
    });
  }

  /**
   * Initialize lazy loading for images
   */
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Bind navigation events
   */
  bindNavigationEvents() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
      });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          smoothScrollTo(targetElement, 800, 100);
          
          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
          }
        }
      });
    });

    // Update active navigation link
    this.updateActiveNavLink();
  }

  /**
   * Update active navigation link based on scroll position
   */
  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    window.addEventListener('scroll', throttle(() => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 100));
  }

  /**
   * Update mobile menu state
   */
  updateMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 1024) {
      if (navToggle) navToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  }

  /**
   * Bind form events
   */
  bindFormEvents() {
    // Newsletter form
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
    }

    // Contact form
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
    }
  }

  /**
   * Handle newsletter form submission
   */
  handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Basic email validation
    if (!this.validateEmail(email)) {
      this.showNotification('Por favor, insira um email válido.', 'error');
      return;
    }

    // Simulate form submission
    this.showNotification('Obrigado! Você foi inscrito na nossa newsletter.', 'success');
    form.reset();
  }

  /**
   * Handle contact form submission
   */
  handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Basic validation
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
      this.showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }

    if (!this.validateEmail(email)) {
      this.showNotification('Por favor, insira um email válido.', 'error');
      return;
    }

    // Simulate form submission
    this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    form.reset();
  }

  /**
   * Validate email address
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Fechar notificação">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideNotification(notification);
    }, 5000);

    // Close button event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });
  }

  /**
   * Hide notification
   */
  hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  /**
   * Bind modal events
   */
  bindModalEvents() {
    // Modal triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        this.openModal(modalId);
      });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal();
        }
      });
    });
  }

  /**
   * Open modal
   */
  openModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      
      // Focus trap
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }

  /**
   * Close modal
   */
  closeModal() {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * Bind back to top events
   */
  bindBackToTopEvents() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        smoothScrollTo(0, 800);
      });
    }
  }

  /**
   * Bind keyboard events
   */
  bindKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      // Close modal on Escape key
      if (e.key === 'Escape') {
        this.closeModal();
      }

      // Close mobile menu on Escape key
      if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu && navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('nav-open');
        }
      }
    });
  }

  /**
   * Initialize components
   */
  initializeComponents() {
    this.initializeProgramming();
    this.initializeFAQ();
    this.initializePartnersCarousel();
  }

  /**
   * Initialize programming section
   */
  initializeProgramming() {
    const dayIndicators = document.querySelectorAll('.day-indicator');
    const daySchedules = document.querySelectorAll('.day-schedule');
    const dayControls = document.querySelectorAll('.day-btn');
    
    let currentDay = 0;

    // Day indicator clicks
    dayIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.switchDay(index);
      });
    });

    // Day control buttons
    dayControls.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'prev' && currentDay > 0) {
          this.switchDay(currentDay - 1);
        } else if (action === 'next' && currentDay < dayIndicators.length - 1) {
          this.switchDay(currentDay + 1);
        }
      });
    });

    // Switch day function
    this.switchDay = (dayIndex) => {
      currentDay = dayIndex;
      
      // Update indicators
      dayIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === dayIndex);
      });
      
      // Update schedules
      daySchedules.forEach((schedule, index) => {
        schedule.classList.toggle('active', index === dayIndex);
      });
      
      // Update controls
      const prevBtn = document.querySelector('.day-btn[data-action="prev"]');
      const nextBtn = document.querySelector('.day-btn[data-action="next"]');
      
      if (prevBtn) prevBtn.disabled = dayIndex === 0;
      if (nextBtn) nextBtn.disabled = dayIndex === dayIndicators.length - 1;
    };

    // Initialize first day
    if (dayIndicators.length > 0) {
      this.switchDay(0);
    }
  }

  /**
   * Initialize FAQ section
   */
  initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== question) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            const otherAnswer = otherQuestion.closest('.faq-item').querySelector('.faq-answer');
            otherAnswer.classList.remove('open');
          }
        });
        
        // Toggle current FAQ item
        question.setAttribute('aria-expanded', !isOpen);
        answer.classList.toggle('open');
      });
    });
  }

  /**
   * Initialize partners carousel
   */
  initializePartnersCarousel() {
    const track = document.querySelector('.partners-track');
    if (!track) return;

    // Clone items for infinite scroll
    const items = track.children;
    const itemsArray = Array.from(items);
    
    itemsArray.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    // Pause animation on hover
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  /**
   * Start countdown timer
   */
  startCountdown() {
    const countdownElements = {
      days: document.querySelector('.countdown-days'),
      hours: document.querySelector('.countdown-hours'),
      minutes: document.querySelector('.countdown-minutes'),
      seconds: document.querySelector('.countdown-seconds')
    };

    // Check if countdown elements exist
    const hasCountdown = Object.values(countdownElements).some(el => el !== null);
    if (!hasCountdown) return;

    this.updateCountdown = () => {
      const timeDiff = getTimeDifference(this.eventDate);
      
      if (timeDiff.total <= 0) {
        // Event has started or passed
        Object.values(countdownElements).forEach(el => {
          if (el) el.textContent = '00';
        });
        
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        return;
      }

      // Update countdown display
      if (countdownElements.days) {
        countdownElements.days.textContent = padNumber(timeDiff.days);
      }
      if (countdownElements.hours) {
        countdownElements.hours.textContent = padNumber(timeDiff.hours);
      }
      if (countdownElements.minutes) {
        countdownElements.minutes.textContent = padNumber(timeDiff.minutes);
      }
      if (countdownElements.seconds) {
        countdownElements.seconds.textContent = padNumber(timeDiff.seconds);
      }
    };

    // Initial update
    this.updateCountdown();

    // Start interval
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
  }

  /**
   * Update countdown layout for mobile
   */
  updateCountdownLayout() {
    // This can be used to adjust countdown layout on resize
    // Currently handled by CSS, but can be extended if needed
  }

  /**
   * Handle loading state
   */
  handleLoading() {
    // Show loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }

    // Preload critical images
    this.preloadImages([
      'assets/images/logo.png',
      'assets/images/hero-bg.jpg'
      // Add more critical images here
    ]);
  }

  /**
   * Preload images
   */
  preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    Promise.allSettled(promises).then(() => {
      console.log('Critical images preloaded');
    });
  }

  /**
   * Destroy the application (cleanup)
   */
  destroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    // Remove event listeners
    // This would be implemented if the app needs to be destroyed
    console.log('Inova 2025 - App destroyed');
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.inovaApp = new InovaApp();
  } catch (error) {
    errorHandler.handle(error, 'App Initialization');
  }
});

// Export for potential external use
export default InovaApp;

