// ===== inova DESIGN INTEGRATION =====

(function() {
  'use strict';

  // Function to update countdown for inova design
  function updateinovaCountdown() {
    // Data do evento: 07-09 Out, 2025 (07 de Outubro às 08:00)
    const eventDate = new Date('2025-10-07T08:00:00-03:00');
    const now = new Date();
    const timeDifference = eventDate - now;

    // Get countdown elements with inova design IDs
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      // Update elements with animation
      updateCountdownElement(daysEl, days);
      updateCountdownElement(hoursEl, hours.toString().padStart(2, '0'));
      updateCountdownElement(minutesEl, minutes.toString().padStart(2, '0'));
      updateCountdownElement(secondsEl, seconds.toString().padStart(2, '0'));
    } else {
      // Evento já aconteceu
      updateCountdownElement(daysEl, '00');
      updateCountdownElement(hoursEl, '00');
      updateCountdownElement(minutesEl, '00');
      updateCountdownElement(secondsEl, '00');
    }
  }

  function updateCountdownElement(element, newValue) {
    if (element && element.textContent !== newValue.toString()) {
      element.textContent = newValue;
    }
  }

  // Navigation enhancements for inova design
  function initinovaNavigation() {
    const navLinks = document.querySelectorAll('.nav-link-inova');
    const sections = document.querySelectorAll('section[id]');
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const headerHeight = 90;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
          
          // Add click effect
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
        }
      });
    });

    // Update active link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    updateActiveNavLink(); // Initial call
  }

  // Mobile menu toggle for inova design
  function initinovaMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle-inova');
    const nav = document.querySelector('.nav-inova');
    
    if (navToggle && nav) {
      navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        
        // Animate hamburger bars
        const bars = this.querySelectorAll('.bar');
        bars.forEach(bar => {
          bar.classList.toggle('active');
        });
      });
      
      // Close menu when clicking on a link
      const navLinks = nav.querySelectorAll('.nav-link-inova');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          nav.classList.remove('active');
          document.body.classList.remove('nav-open');
          
          const bars = navToggle.querySelectorAll('.bar');
          bars.forEach(bar => {
            bar.classList.remove('active');
          });
        });
      });
    }
  }

  // Animate elements on scroll
  function animateOnScroll() {
    const elements = document.querySelectorAll('.countdown-item-inova, .tech-icon-inova');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate-in');
      }
    });
  }

  // Tech icons hover effects
  function initTechIconEffects() {
    document.querySelectorAll('.tech-icon-inova').forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        this.style.boxShadow = '0 15px 40px rgba(139, 97, 194, 0.3)';
      });
      
      icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = '';
      });
    });
  }

  // CTA button ripple effect
  function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button-inova');
    
    if (ctaButton) {
      ctaButton.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
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
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    }
  }

  // Parallax effect on scroll
  function initParallaxEffect() {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.tech-graphics-inova');
      
      parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Throttle function for performance
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Initialize everything when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Start countdown
    updateinovaCountdown();
    setInterval(updateinovaCountdown, 1000);
    
    // Initialize navigation
    initinovaNavigation();
    initinovaMobileMenu();
    
    // Initialize effects only if motion is not reduced
    if (!prefersReducedMotion) {
      initTechIconEffects();
      initParallaxEffect();
      
      // Scroll animations
      window.addEventListener('scroll', throttle(animateOnScroll, 100));
      
      // Add animation classes to elements after page load
      setTimeout(() => {
        document.querySelectorAll('.countdown-item-inova, .tech-icon-inova').forEach(element => {
          element.classList.add('animate-in');
        });
      }, 500);
    } else {
      // Add classes immediately for reduced motion
      document.querySelectorAll('.countdown-item-inova, .tech-icon-inova').forEach(element => {
        element.classList.add('animate-in');
      });
    }
    
    // Always initialize CTA button (important for functionality)
    initCTAButton();
    
    // Initial animation check
    animateOnScroll();
    
    // Add loaded class to body for any CSS-based optimizations
    document.body.classList.add('inova-loaded');
  });

})();
