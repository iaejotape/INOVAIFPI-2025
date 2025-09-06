// ===== COMPONENTS JAVASCRIPT =====

import { 
  throttle, 
  debounce, 
  createElement, 
  addEventListenerWithCleanup,
  errorHandler 
} from './utils.js';

/**
 * Ripple Effect Component
 */
export class RippleEffect {
  constructor(selector = '.btn, .activity-card, .speaker-card') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('click', this.createRipple.bind(this));
    });
  }

  createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = createElement('span', {
      className: 'ripple-effect',
      style: `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
      `
    });

    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }

    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
}

/**
 * Parallax Component
 */
export class ParallaxEffect {
  constructor(selector = '[data-parallax]') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    this.handleScroll = throttle(this.updateParallax.bind(this), 16);
    window.addEventListener('scroll', this.handleScroll);
    this.updateParallax(); // Initial call
  }

  updateParallax() {
    const scrollTop = window.pageYOffset;

    this.elements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

/**
 * Typewriter Effect Component
 */
export class TypewriterEffect {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      speed: 50,
      deleteSpeed: 30,
      pauseTime: 1000,
      loop: true,
      cursor: true,
      ...options
    };
    
    this.texts = this.options.texts || [this.element.textContent];
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    
    this.init();
  }

  init() {
    if (!this.element) return;

    this.element.textContent = '';
    
    if (this.options.cursor) {
      this.element.style.borderRight = '2px solid';
      this.element.style.animation = 'blinkCursor 1s infinite';
    }

    this.type();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.speed;

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.options.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    if (this.options.loop || this.currentTextIndex < this.texts.length - 1 || this.currentCharIndex > 0) {
      setTimeout(() => this.type(), typeSpeed);
    }
  }
}

/**
 * Image Lazy Loading Component
 */
export class LazyImageLoader {
  constructor(selector = 'img[data-src]') {
    this.images = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.images.forEach(img => {
        this.observer.observe(img);
      });
    } else {
      // Fallback for older browsers
      this.images.forEach(img => this.loadImage(img));
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    img.src = src;
    img.classList.add('loading');

    img.onload = () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    };

    img.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
    };
  }
}

/**
 * Smooth Scroll Component
 */
export class SmoothScroll {
  constructor(selector = 'a[href^="#"]') {
    this.links = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', this.handleClick.bind(this));
    });
  }

  handleClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      
      this.smoothScrollTo(targetPosition);
    }
  }

  smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}

/**
 * Form Validator Component
 */
export class FormValidator {
  constructor(form, options = {}) {
    this.form = typeof form === 'string' ? document.querySelector(form) : form;
    this.options = {
      errorClass: 'error',
      successClass: 'success',
      errorMessageClass: 'error-message',
      validateOnBlur: true,
      validateOnInput: false,
      ...options
    };
    
    this.rules = {};
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    if (this.options.validateOnBlur || this.options.validateOnInput) {
      this.bindFieldEvents();
    }
  }

  bindFieldEvents() {
    const fields = this.form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
      if (this.options.validateOnBlur) {
        field.addEventListener('blur', () => this.validateField(field));
      }
      
      if (this.options.validateOnInput) {
        field.addEventListener('input', debounce(() => this.validateField(field), 300));
      }
    });
  }

  addRule(fieldName, validator, message) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    
    this.rules[fieldName].push({ validator, message });
    return this;
  }

  validateField(field) {
    const fieldName = field.name;
    const fieldRules = this.rules[fieldName];
    
    if (!fieldRules) return true;

    this.clearFieldError(field);

    for (const rule of fieldRules) {
      if (!rule.validator(field.value, field)) {
        this.showFieldError(field, rule.message);
        return false;
      }
    }

    this.showFieldSuccess(field);
    return true;
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.onSuccess?.(this.form);
    } else {
      this.onError?.(this.form);
    }
  }

  showFieldError(field, message) {
    field.classList.add(this.options.errorClass);
    field.classList.remove(this.options.successClass);
    
    const errorElement = this.getOrCreateErrorElement(field);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  showFieldSuccess(field) {
    field.classList.remove(this.options.errorClass);
    field.classList.add(this.options.successClass);
    
    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  clearFieldError(field) {
    field.classList.remove(this.options.errorClass, this.options.successClass);
    
    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  getOrCreateErrorElement(field) {
    let errorElement = this.getErrorElement(field);
    
    if (!errorElement) {
      errorElement = createElement('div', {
        className: this.options.errorMessageClass,
        style: 'display: none; color: #e74c3c; font-size: 0.875rem; margin-top: 0.25rem;'
      });
      
      field.parentNode.appendChild(errorElement);
    }
    
    return errorElement;
  }

  getErrorElement(field) {
    return field.parentNode.querySelector(`.${this.options.errorMessageClass}`);
  }

  onSuccess(callback) {
    this.onSuccess = callback;
    return this;
  }

  onError(callback) {
    this.onError = callback;
    return this;
  }
}

/**
 * Modal Component
 */
export class Modal {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.options = {
      closeOnOverlayClick: true,
      closeOnEscape: true,
      focusTrap: true,
      ...options
    };
    
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.modal) return;

    this.bindEvents();
  }

  bindEvents() {
    // Close button
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Overlay click
    if (this.options.closeOnOverlayClick) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Escape key
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  }

  open() {
    if (this.isOpen) return;

    this.modal.classList.add('active');
    document.body.classList.add('modal-open');
    this.isOpen = true;

    // Focus trap
    if (this.options.focusTrap) {
      this.trapFocus();
    }

    // Trigger custom event
    this.modal.dispatchEvent(new CustomEvent('modal:open'));
  }

  close() {
    if (!this.isOpen) return;

    this.modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    this.isOpen = false;

    // Trigger custom event
    this.modal.dispatchEvent(new CustomEvent('modal:close'));
  }

  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
}

/**
 * Tooltip Component
 */
export class Tooltip {
  constructor(selector = '[data-tooltip]') {
    this.elements = document.querySelectorAll(selector);
    this.tooltip = null;
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('mouseenter', (e) => this.show(e));
      element.addEventListener('mouseleave', () => this.hide());
      element.addEventListener('focus', (e) => this.show(e));
      element.addEventListener('blur', () => this.hide());
    });
  }

  show(e) {
    const element = e.currentTarget;
    const text = element.dataset.tooltip;
    const position = element.dataset.tooltipPosition || 'top';
    
    if (!text) return;

    this.tooltip = createElement('div', {
      className: `tooltip tooltip-${position}`,
      style: `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      `
    }, text);

    document.body.appendChild(this.tooltip);
    this.positionTooltip(element, position);

    // Show tooltip
    requestAnimationFrame(() => {
      this.tooltip.style.opacity = '1';
    });
  }

  hide() {
    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
      setTimeout(() => {
        if (this.tooltip && this.tooltip.parentNode) {
          this.tooltip.parentNode.removeChild(this.tooltip);
        }
        this.tooltip = null;
      }, 200);
    }
  }

  positionTooltip(element, position) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    let top, left;

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
    }

    this.tooltip.style.top = `${top + window.scrollY}px`;
    this.tooltip.style.left = `${left + window.scrollX}px`;
  }
}

/**
 * Accordion Component
 */
export class Accordion {
  constructor(selector = '.accordion') {
    this.accordions = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.accordions.forEach(accordion => {
      const triggers = accordion.querySelectorAll('.accordion-trigger');
      
      triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          this.toggle(trigger);
        });
      });
    });
  }

  toggle(trigger) {
    const accordion = trigger.closest('.accordion');
    const item = trigger.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    
    // Close all other items in the same accordion
    const otherTriggers = accordion.querySelectorAll('.accordion-trigger');
    otherTriggers.forEach(otherTrigger => {
      if (otherTrigger !== trigger) {
        otherTrigger.setAttribute('aria-expanded', 'false');
        const otherContent = otherTrigger.closest('.accordion-item').querySelector('.accordion-content');
        otherContent.style.maxHeight = null;
      }
    });

    // Toggle current item
    trigger.setAttribute('aria-expanded', !isOpen);
    
    if (!isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = null;
    }
  }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize all components
    new RippleEffect();
    new ParallaxEffect();
    new LazyImageLoader();
    new SmoothScroll();
    new Tooltip();
    new Accordion();
    
    console.log('Components initialized successfully');
  } catch (error) {
    errorHandler.handle(error, 'Components Initialization');
  }
});

// Export components
export default {
  RippleEffect,
  ParallaxEffect,
  TypewriterEffect,
  LazyImageLoader,
  SmoothScroll,
  FormValidator,
  Modal,
  Tooltip,
  Accordion
};

