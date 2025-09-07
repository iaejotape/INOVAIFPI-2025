// ===== INOVA 2025 - ENHANCED APPLICATION =====

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

  // Modal data for activities
  const modalData = {
    'modal-1': {
      title: 'Credenciamento',
      date: '07 de Outubro - 18:00',
      description: 'Recepção dos participantes e entrega de materiais do evento. Local: Hall de entrada do IFPI Campus Floriano.',
      instructor: 'Equipe Organizadora'
    },
    'modal-2': {
      title: 'Apresentação Cultural',
      date: '07 de Outubro - 18:15',
      description: 'Valorização da cultura regional com apresentações artísticas locais. Uma celebração da diversidade cultural do Piauí.',
      instructor: 'Grupos Culturais Locais'
    },
    'modal-3': {
      title: 'Abertura Oficial',
      date: '07 de Outubro - 18:45',
      description: 'Cerimônia oficial de abertura do evento com autoridades locais e apresentação da programação completa.',
      instructor: 'Direção do IFPI'
    },
    'modal-4': {
      title: 'Palestra Magna',
      date: '07 de Outubro - 19:00',
      description: 'Palestra principal sobre Inovação e Propriedade Intelectual no contexto atual. Uma visão abrangente sobre o futuro da inovação.',
      instructor: 'Paulo Coutinho'
    },
    'modal-5': {
      title: 'Minicurso - Internet das Coisas (IoT)',
      date: '08 de Outubro - 08:00 às 12:00',
      description: 'Introdução prática ao mundo da IoT com ênfase em software livre. Aprenda conceitos fundamentais e tenha experiência hands-on com dispositivos reais.',
      instructor: 'Dalson Santos'
    },
    'modal-6': {
      title: 'Minicurso - Pentest e Segurança',
      date: '08 de Outubro - 14:00 às 17:00',
      description: 'Aprenda técnicas de teste de penetração e segurança da informação. Conheça ferramentas e metodologias utilizadas por profissionais da área.',
      instructor: 'Israel Oliveira'
    },
    'modal-7': {
      title: 'Credenciamento Vespertino',
      date: '08 de Outubro - 18:00',
      description: 'Credenciamento para participantes do período vespertino. Recepção e orientações para as atividades do dia.',
      instructor: 'Equipe Organizadora'
    },
    'modal-8': {
      title: 'CyberEduc - Cibersegurança na Educação',
      date: '08 de Outubro - 19:00',
      description: 'Palestra sobre cibersegurança aplicada ao ambiente educacional. Estratégias de proteção e conscientização para instituições de ensino.',
      instructor: 'Especialista em Segurança'
    },
    'modal-9': {
      title: 'Credenciamento Final',
      date: '09 de Outubro - 18:00',
      description: 'Último dia de credenciamento para participantes. Últimas orientações e preparação para o encerramento.',
      instructor: 'Equipe Organizadora'
    },
    'modal-10': {
      title: 'Encerramento e Premiação',
      date: '09 de Outubro - 19:00',
      description: 'Cerimônia de encerramento do evento com premiação dos melhores trabalhos e agradecimentos aos participantes e patrocinadores.',
      instructor: 'Comissão Organizadora'
    }
  };

  // Day information
  const dayInfo = {
    24: { name: 'SEGUNDA-FEIRA', date: '07 DE OUTUBRO' },
    25: { name: 'TERÇA-FEIRA', date: '08 DE OUTUBRO' },
    26: { name: 'QUARTA-FEIRA', date: '09 DE OUTUBRO' }
  };

  // Main Application Class
  class InovaApp {
    constructor() {
      this.isLoaded = false;
      this.scrollPosition = 0;
      this.countdownInterval = null;
      this.eventDate = new Date("2025-10-07T18:00:00");
      this.currentDay = 24;

      this.init();
    }

    init() {
      this.bindEvents();
      this.initializeComponents();
      this.startCountdown();
      this.handleLoading();

      this.isLoaded = true;
      console.log("Inova 2025 - Site melhorado carregado com sucesso! 🚀");
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
      this.bindModalEvents();
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

      // Smooth scroll for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            smoothScrollTo(targetElement, 800, 100);

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(navLink => {
              navLink.classList.remove('active');
            });
            link.classList.add('active');

            if (navMenu && navMenu.classList.contains("active")) {
              navToggle.classList.remove("active");
              navMenu.classList.remove("active");
              document.body.classList.remove("nav-open");
            }
          }
        });
      });

      // Global scroll to section function
      window.scrollToSection = (sectionId) => {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          smoothScrollTo(targetElement, 800, 100);
        }
      };
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
          const modalOverlay = document.querySelector(".modal-overlay");

          if (navMenu && navMenu.classList.contains("active")) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("nav-open");
          }

          if (modalOverlay && modalOverlay.classList.contains("active")) {
            this.closeModal();
          }
        }
      });
    }

    bindModalEvents() {
      // Activity cards click events
      document.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const modalId = card.getAttribute('data-modal');
          if (modalId && modalData[modalId]) {
            this.openModal(modalData[modalId]);
          }
        });

        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const modalId = card.getAttribute('data-modal');
            if (modalId && modalData[modalId]) {
              this.openModal(modalData[modalId]);
            }
          }
        });
      });

      // Modal close events
      const modalOverlay = document.querySelector('.modal-overlay');
      const modalClose = document.querySelector('.modal-close');

      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
            this.closeModal();
          }
        });
      }

      if (modalClose) {
        modalClose.addEventListener('click', () => {
          this.closeModal();
        });
      }
    }

    openModal(data) {
      const modalOverlay = document.querySelector('.modal-overlay');
      const modalBody = document.querySelector('.modal-body');

      if (!modalOverlay || !modalBody) return;

      modalBody.innerHTML = `
        <div class="modal-header">
          <h4>${data.date}</h4>
          <h3>${data.title}</h3>
        </div>
        <div class="modal-content-text">
          <p>${data.description}</p>
          <p><strong>Responsável:</strong> ${data.instructor}</p>
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeModal() {
      const modalOverlay = document.querySelector('.modal-overlay');
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
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
      const dayNameElement = document.querySelector("#day-name");
      const dayDateElement = document.querySelector("#day-date");

      const switchDay = (dayIndex) => {
        this.currentDay = [24, 25, 26][dayIndex];

        // Update indicators
        dayIndicators.forEach((indicator, index) => {
          indicator.classList.toggle("active", index === dayIndex);
          indicator.setAttribute("aria-selected", index === dayIndex);
        });

        // Update schedules
        daySchedules.forEach((schedule, index) => {
          schedule.classList.toggle("active", index === dayIndex);
        });

        // Update day info
        const info = dayInfo[this.currentDay];
        if (dayNameElement && info) dayNameElement.textContent = info.name;
        if (dayDateElement && info) dayDateElement.textContent = info.date;

        // Update controls
        const prevBtn = document.querySelector('#prev-day');
        const nextBtn = document.querySelector('#next-day');

        if (prevBtn) prevBtn.disabled = dayIndex === 0;
        if (nextBtn) nextBtn.disabled = dayIndex === dayIndicators.length - 1;
      };

      // Day indicator clicks
      dayIndicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          switchDay(index);
        });
      });

      // Day control buttons
      dayControls.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          const currentIndex = [24, 25, 26].indexOf(this.currentDay);
          
          if (action === "prev" && currentIndex > 0) {
            switchDay(currentIndex - 1);
          } else if (action === "next" && currentIndex < 2) {
            switchDay(currentIndex + 1);
          }
        });
      });

      // Initialize with first day
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

          // Close all other FAQ items
          faqQuestions.forEach((otherQuestion) => {
            if (otherQuestion !== question) {
              otherQuestion.setAttribute("aria-expanded", "false");
              const otherAnswer = otherQuestion
                .closest(".faq-item")
                .querySelector(".faq-answer");
              otherAnswer.classList.remove("open");
            }
          });

          // Toggle current FAQ item
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

      // Clone items for infinite scroll
      itemsArray.forEach((item) => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });

      // Pause animation on hover
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

        // Add animation to changing numbers
        Object.entries(countdownElements).forEach(([key, element]) => {
          if (element) {
            const newValue = padNumber(timeDiff[key]);
            if (element.textContent !== newValue) {
              element.style.transform = 'scale(1.1)';
              element.textContent = newValue;
              setTimeout(() => {
                element.style.transform = 'scale(1)';
              }, 200);
            }
          }
        });
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

  // Enhanced ripple effect for buttons and cards
  document.addEventListener("click", function (e) {
    if (e.target.matches(".btn, .activity-card, .speaker-card, .minicourse-card")) {
      const element = e.target.closest(".btn, .activity-card, .speaker-card, .minicourse-card");
      const rect = element.getBoundingClientRect();
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
        background: rgba(59, 146, 162, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
      `;

      if (getComputedStyle(element).position === "static") {
        element.style.position = "relative";
      }

      element.style.overflow = "hidden";
      element.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }
  });

  // Add CSS animation for ripple effect
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

})();

