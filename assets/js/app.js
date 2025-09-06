// ===== INOVA 2025 - MAIN APPLICATION =====

(function () {
  "use strict";

  // Utility functions
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    return (
      rect.top <= windowHeight * (1 - threshold) &&
      rect.bottom >= windowHeight * threshold
    );
  }

  function smoothScrollTo(target, duration = 800, offset = 0) {
    const targetPosition =
      typeof target === "number" ? target : target.offsetTop - offset;

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  function padNumber(num, size = 2) {
    return num.toString().padStart(size, "0");
  }

  function getTimeDifference(targetDate, currentDate = new Date()) {
    const target = new Date(targetDate);
    const current = new Date(currentDate);
    const difference = target.getTime() - current.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: difference };
  }

  // Main Application Class
  class InovaApp {
    constructor() {
      this.isLoaded = false;
      this.scrollPosition = 0;
      this.countdownInterval = null;
      this.eventDate = new Date("2025-10-07T18:00:00");

      this.init();
    }

    init() {
      this.bindEvents();
      this.initializeComponents();
      this.startCountdown();
      this.handleLoading();

      this.isLoaded = true;
      console.log("Inova 2025 - Site carregado com sucesso! 🚀");
    }

    bindEvents() {
      window.addEventListener("load", this.handleWindowLoad.bind(this));
      window.addEventListener(
        "scroll",
        throttle(this.handleScroll.bind(this), 16)
      );
      window.addEventListener(
        "resize",
        debounce(this.handleResize.bind(this), 250)
      );

      this.bindNavigationEvents();
      this.bindBackToTopEvents();
      this.bindKeyboardEvents();
    }

    handleWindowLoad() {
      const loadingScreen = document.querySelector(".loading-screen");
      if (loadingScreen) {
        setTimeout(() => {
          loadingScreen.classList.add("hidden");
          setTimeout(() => {
            loadingScreen.remove();
          }, 500);
        }, 1500);
      }

      this.initScrollAnimations();
    }

    handleScroll() {
      const currentScroll = window.pageYOffset;

      this.updateHeaderOnScroll(currentScroll);
      this.updateBackToTop(currentScroll);
      this.handleScrollAnimations();

      this.scrollPosition = currentScroll;
    }

    handleResize() {
      this.updateMobileMenu();
      this.initScrollAnimations();
    }

    updateHeaderOnScroll(scrollPosition) {
      const header = document.querySelector(".header");
      if (!header) return;

      if (scrollPosition > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    updateBackToTop(scrollPosition) {
      const backToTop = document.querySelector(".back-to-top");
      if (!backToTop) return;

      if (scrollPosition > 500) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    initScrollAnimations() {
      const elements = document.querySelectorAll(
        ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale"
      );

      elements.forEach((element, index) => {
        if (isInViewport(element, 0.1)) {
          setTimeout(() => {
            element.classList.add("revealed");
          }, index * 100);
        }
      });
    }

    handleScrollAnimations() {
      const elements = document.querySelectorAll(
        ".scroll-reveal:not(.revealed), .scroll-reveal-left:not(.revealed), .scroll-reveal-right:not(.revealed), .scroll-reveal-scale:not(.revealed)"
      );

      elements.forEach((element, index) => {
        if (isInViewport(element, 0.1)) {
          setTimeout(() => {
            element.classList.add("revealed");
          }, index * 50);
        }
      });

      const staggerContainers = document.querySelectorAll("[data-stagger]");
      staggerContainers.forEach((container) => {
        if (isInViewport(container, 0.1)) {
          const items = container.querySelectorAll(
            ".stagger-item:not(.revealed)"
          );
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("revealed");
            }, index * 100);
          });
        }
      });
    }

    bindNavigationEvents() {
      const navToggle = document.querySelector(".nav-toggle");
      const navMenu = document.querySelector(".nav-menu");

      if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
          navToggle.classList.toggle("active");
          navMenu.classList.toggle("active");
          document.body.classList.toggle("nav-open");
        });
      }

      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            smoothScrollTo(targetElement, 800, 100);

            if (navMenu && navMenu.classList.contains("active")) {
              navToggle.classList.remove("active");
              navMenu.classList.remove("active");
              document.body.classList.remove("nav-open");
            }
          }
        });
      });
    }

    updateMobileMenu() {
      const navToggle = document.querySelector(".nav-toggle");
      const navMenu = document.querySelector(".nav-menu");

      if (window.innerWidth > 1024) {
        if (navToggle) navToggle.classList.remove("active");
        if (navMenu) navMenu.classList.remove("active");
        document.body.classList.remove("nav-open");
      }
    }

    bindBackToTopEvents() {
      const backToTop = document.querySelector(".back-to-top");
      if (backToTop) {
        backToTop.addEventListener("click", () => {
          smoothScrollTo(0, 800);
        });
      }
    }

    bindKeyboardEvents() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const navToggle = document.querySelector(".nav-toggle");
          const navMenu = document.querySelector(".nav-menu");

          if (navMenu && navMenu.classList.contains("active")) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("nav-open");
          }
        }
      });
    }

    initializeComponents() {
      this.initializeProgramming();
      this.initializeFAQ();
      this.initializePartnersCarousel();
    }

    initializeProgramming() {
      const dayIndicators = document.querySelectorAll(".day-indicator");
      const daySchedules = document.querySelectorAll(".day-schedule");
      const dayControls = document.querySelectorAll(".day-btn");

      let currentDay = 0;

      const switchDay = (dayIndex) => {
        currentDay = dayIndex;

        dayIndicators.forEach((indicator, index) => {
          indicator.classList.toggle("active", index === dayIndex);
        });

        daySchedules.forEach((schedule, index) => {
          schedule.classList.toggle("active", index === dayIndex);
        });

        const prevBtn = document.querySelector('.day-btn[data-action="prev"]');
        const nextBtn = document.querySelector('.day-btn[data-action="next"]');

        if (prevBtn) prevBtn.disabled = dayIndex === 0;
        if (nextBtn) nextBtn.disabled = dayIndex === dayIndicators.length - 1;
      };

      dayIndicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          switchDay(index);
        });
      });

      dayControls.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          if (action === "prev" && currentDay > 0) {
            switchDay(currentDay - 1);
          } else if (
            action === "next" &&
            currentDay < dayIndicators.length - 1
          ) {
            switchDay(currentDay + 1);
          }
        });
      });

      if (dayIndicators.length > 0) {
        switchDay(0);
      }
    }

    initializeFAQ() {
      const faqQuestions = document.querySelectorAll(".faq-question");

      faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
          const faqItem = question.closest(".faq-item");
          const answer = faqItem.querySelector(".faq-answer");
          const isOpen = question.getAttribute("aria-expanded") === "true";

          faqQuestions.forEach((otherQuestion) => {
            if (otherQuestion !== question) {
              otherQuestion.setAttribute("aria-expanded", "false");
              const otherAnswer = otherQuestion
                .closest(".faq-item")
                .querySelector(".faq-answer");
              otherAnswer.classList.remove("open");
            }
          });

          question.setAttribute("aria-expanded", !isOpen);
          answer.classList.toggle("open");
        });
      });
    }

    initializePartnersCarousel() {
      const track = document.querySelector(".partners-track");
      if (!track) return;

      const items = track.children;
      const itemsArray = Array.from(items);

      itemsArray.forEach((item) => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });

      track.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
      });

      track.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
      });
    }

    startCountdown() {
      const countdownElements = {
        days: document.querySelector("#days"),
        hours: document.querySelector("#hours"),
        minutes: document.querySelector("#minutes"),
        seconds: document.querySelector("#seconds"),
      };

      const hasCountdown = Object.values(countdownElements).some(
        (el) => el !== null
      );
      if (!hasCountdown) return;

      const updateCountdown = () => {
        const timeDiff = getTimeDifference(this.eventDate);

        if (timeDiff.total <= 0) {
          Object.values(countdownElements).forEach((el) => {
            if (el) el.textContent = "00";
          });

          if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
          }
          return;
        }

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

      updateCountdown();
      this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    handleLoading() {
      const loadingScreen = document.querySelector(".loading-screen");
      if (loadingScreen) {
        loadingScreen.classList.remove("hidden");
      }
    }
  }

  // Initialize the application when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    try {
      window.inovaApp = new InovaApp();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  });

  // Add ripple effect to buttons
  document.addEventListener("click", function (e) {
    if (e.target.matches(".btn, .activity-card, .speaker-card")) {
      const button = e.target;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
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
                z-index: 1;
            `;

      if (getComputedStyle(button).position === "static") {
        button.style.position = "relative";
      }

      button.style.overflow = "hidden";
      button.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }
  });
})();
