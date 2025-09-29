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
    "modal-1": {
      title: "Palestra e Oficina",
      date: "07 de Outubro - 08:00 às 10:00",
      description:
        "Palestra sobre Saúde Mental e Física no Mundo Digital seguida de oficina prática com técnicas de respiração e micro exercícios para liberar estresse. Local: Auditório.",
      instructor: "Luna Rhara Martins Moura",
    },
    "modal-2": {
      title: "Palestra de Abertura",
      date: "07 de Outubro - 19:00 às 21:30",
      description:
        "Este talk show reunirá especialistas como o Prof. Mba. Ricardo Gomes de Queiroz (Sebrae), Prof. Me. Rogério da Silva Batista (IFPI – Teresina), Me. Thais Trajano (Cais Valley) e Prof. Me. Felipe Ibiapino para uma conversa dinâmica sobre as inovações no ecossistema de saúde. O debate abordará como o desenvolvimento e a proteção de propriedades intelectuais se tornam fatores-chave para impulsionar a inovação, garantir competitividade e fortalecer a sustentabilidade do setor, trazendo diferentes perspectivas acadêmicas e de mercado. Local: Auditório do IFPI.",
      instructor: "Prof Dr. Robson Freitas ( IFPI - FLO)",
    },
    "modal-3": {
      title: "Oficina 1",
      date: "08 de Outubro - 08:00 às 10:00",
      description:
        "Oficina ministrada pela enfermeira do CAPS Maria Bianca Pereira Freitas com tema: Uso de Ferramentas Digitais na Otimização da Produção de Artigos e Trabalhos Académicos. Local: Auditório do IFPI.",
      instructor: "Bianca - Enfermeira do Caps",
    },
    "modal-4": {
      title: "Mini Curso 2",
      date: "08 de Outubro - 08:00 às 12:00",
      description:
        "Este minicurso apresenta uma introdução prática ao universo da Internet das Coisas (IoT), com foco em soluções baseadas em software livre. Os participantes aprenderão conceitos fundamentais da área e terão uma experiência hands-on, explorando na prática como integrar tecnologias e criar aplicações, incluindo um atendente virtual com chatbot. Local: Laboratório.",
      instructor: "Prof. Me. Ronaldo Pires Borges - IFPI Floriano",
    },
    "modal-5": {
      title: "Mini Curso 3 - Análise de Dados na Saúde",
      date: "08 de Outubro - 08:00 às 12:00",
      description:
        "Um guia prático para preparação e exploração de dados na área da saúde. Ministrado por Ivan Rodrigues do IFPI - São Raimundo. SIAPE: 1294193. Observação: Precisará de Laboratório e não precisa de dormitório.",
      instructor: "Ivan Rodrigues - IFPI São Raimundo",
    },
    "modal-6": {
      title:
        "Mini Curso 4 - Primeiros Passos em Sistemas Embarcados com Raspberry Pi",
      date: "08 de Outubro - 08:00 às 12:00",
      description:
        "Aprenda os conceitos fundamentais de sistemas embarcados e dê seus primeiros passos no desenvolvimento de projetos práticos utilizando a placa BitDogLab, baseada no Raspberry Pi. Neste minicurso, você entenderá o que são sistemas embarcados, onde eles estão presentes no nosso dia a dia e como programar uma aplicação básica que integra sensores e atuadores. Uma oportunidade prática para iniciar no universo da programação embarcada de forma simples e didática! Local: Laboratório.",
      instructor: "Vinicius, Samuel e Deilson, Coordenação Prof. Me. Silvino Marques - IFPI Floriano",
    },
    "modal-7": {
      title: "Oficina - A Revolução Tecnológica do Bem Estar",
      date: "08 de Outubro - 15:30 às 17:30",
      description:
        "Oficina sobre como a tecnologia pode revolucionar o bem-estar das pessoas. Ministrada por Marcelo Prado Santiago do CTF - Colégio Técnico de Floriano. SIAPE: 2714888. Local: Auditório.",
      instructor: "Marcelo Prado Santiago - CTF",
    },
    // 'modal-8': {
    //   title: 'Palestra 1',
    //   date: '08 de Outubro - 19:00 às 20:00',
    //   description: 'Palestra a ser confirmada com Thais do Cais Valley. Local: Auditório do IFPI.',
    //   instructor: 'A confirmar - Thais do Cais Valley'
    // },
    "modal-9": {
      title: "Palestra 2 - Criando com Inteligência Artificial",
      date: "08 de Outubro - 20:00 às 21:30",
      description:
        "Palestra sobre criação e desenvolvimento utilizando Inteligência Artificial. Palestrante a definir do SEBRAE. Local: Auditório do IFPI.",
      instructor: "A Definir - SEBRAE",
    },
    "modal-10": {
      title: "IA na Saúde: Transformando sua pesquisa em uma startup.",
      date: "09 de Outubro - 19:00 às 20:00",
      description:
        "Esta palestra explora como a Inteligência Artificial está revolucionando o setor da saúde e abrindo caminho para a criação de startups inovadoras. Serão discutidos os passos necessários para transformar pesquisas acadêmicas em soluções de impacto no mercado, destacando desafios, oportunidades e estratégias para empreender com base em tecnologia e inovação em saúde. Local: Auditório do IFPI.",
      instructor: "Prof. Dr.  Otílio Paulo da Silva Neto (IFPI- THE)",
    },
    "modal-11": {
      title: "Mini Curso: Pensando como um invasor",
      date: "09 de Outubro - 09:00 às 12:00",
      description:
        "Pensando como o Invasor é uma imersão de uma única aula que coloca você no lugar do hacker. Em poucas horas você vivencia cada etapa de um ataque do reconhecimento à pós-exploração e aprende a pensar de forma ofensiva para depois reforçar a defesa de sistemas, aplicativos e redes. Local: Laboratório.",
      instructor: "Keoma Souza, João Pedro Mendes e Vitória Rafaela - ETIPI",
    },
    "modal-12": {
      title:
        "Piauí Saúde Digital: Rumo à Fila Zero - Como tecnologia e gestão estão redesenhando o acesso ao SUS",
      date: "09 de Outubro - 15:00 às 17:00",
      description:
        "Como tecnologia e gestão estão redesenhando o acesso ao SUS. Palestra sobre inovações tecnológicas aplicadas à saúde pública no Piauí. Local: Auditório do IFPI.",
      instructor: "Rodrigo e Silva Souza - ETIPI",
    },
    "modal-13": {
      title: "Palestra de Encerramento",
      date: "09 de Outubro - 20:00 às 21:40",
      description:
        "Nesta palestra, exploraremos o papel essencial da cibersegurança na era da inteligência artificial, analisando como avanços tecnológicos trazem novos desafios e oportunidades para a proteção de dados e sistemas críticos. A partir de casos reais de ciberataques em hospitais, discutiremos as vulnerabilidades do setor da saúde, os impactos desses incidentes e as lições aprendidas que podem orientar melhores práticas de defesa no ambiente digital.",
      instructor: "Keoma e Cristiano",
    },
    "modal-14": {
      title: "Palestra de Encerramento Final",
      date: "09 de Outubro - 20:00 às 21:00",
      description:
        "Palestra final de encerramento do evento. Tema a definir. Ministrada pelo Professor Otílio do IFPI - THE. Local: Auditório do IFPI.",
      instructor: "Professor Otílio - IFPI THE",
    },
  };

  // Day information
  const dayInfo = {
    24: { name: "TERÇA-FEIRA", date: "07 DE OUTUBRO" },
    25: { name: "QUARTA-FEIRA", date: "08 DE OUTUBRO" },
    26: { name: "QUINTA-FEIRA", date: "09 DE OUTUBRO" },
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
      this.updateTimerOnScroll(currentScroll);
      this.updateBackToTop(currentScroll);
      this.updateActiveNavOnScroll(currentScroll);
      this.handleScrollAnimations();

      this.scrollPosition = currentScroll;
    }

    handleResize() {
      this.updateMobileMenu();
      this.initScrollAnimations();
      // Recheck timer state on resize
      this.updateTimerOnScroll(window.pageYOffset);
    }

    updateHeaderOnScroll(scrollPosition) {
      const header = document.querySelector(".header-inova");
      if (!header) return;

      // Detect if we're past the hero section (which has dark background)
      const heroSection = document.querySelector(".hero-inova");
      const heroHeight = heroSection ? heroSection.offsetHeight : 0;

      // Apply solid background when scrolled past hero section
      if (scrollPosition > heroHeight - 100) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }

      // Alternative: detect specific sections with light backgrounds
      const lightSections = [
        document.querySelector("#programacao"),
        document.querySelector("#ministrantes"),
        document.querySelector("#minicursos"),
        document.querySelector("#parcerias"),
        document.querySelector("#duvidas"),
      ];

      let isInLightSection = false;

      lightSections.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const headerHeight = header.offsetHeight;

          // Check if header overlaps with light section
          if (rect.top <= headerHeight && rect.bottom >= 0) {
            isInLightSection = true;
          }
        }
      });

      // Apply solid header class when over light sections
      if (isInLightSection) {
        header.classList.add("header-solid");
      } else {
        header.classList.remove("header-solid");
      }
    }

    updateTimerOnScroll(scrollPosition) {
      const timerSection = document.querySelector(".timer-section");
      if (!timerSection) return;

      // Detecta se é mobile (tablet pequeno incluído)
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // No mobile/tablet, torna compacto após 150px de scroll
        if (scrollPosition > 150) {
          timerSection.classList.add("compact");
        } else {
          timerSection.classList.remove("compact");
        }
      } else {
        // No desktop, aplica versão "light" do compacto após 100px
        if (scrollPosition > 100) {
          timerSection.classList.add("compact");
        } else {
          timerSection.classList.remove("compact");
        }
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

    updateActiveNavOnScroll(scrollPosition) {
      // Get all sections that have navigation links
      const sections = [
        { id: "inicio", element: document.querySelector("#inicio") },
        { id: "programacao", element: document.querySelector("#programacao") },
        {
          id: "ministrantes",
          element: document.querySelector("#ministrantes"),
        },
        { id: "minicursos", element: document.querySelector("#minicursos") },
        { id: "parcerias", element: document.querySelector("#parcerias") },
        { id: "duvidas", element: document.querySelector("#duvidas") },
      ];

      const navLinks = document.querySelectorAll(".nav-link-inova");
      let currentSection = "inicio"; // default

      // Find which section is currently in view
      sections.forEach((section) => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const sectionTop = rect.top + scrollPosition;
          const sectionBottom = sectionTop + section.element.offsetHeight;

          // Check if we're in this section (with some offset for header)
          if (
            scrollPosition + 150 >= sectionTop &&
            scrollPosition + 150 < sectionBottom
          ) {
            currentSection = section.id;
          }
        }
      });

      // Update active nav link
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          const targetId = href.substring(1); // remove #
          if (targetId === currentSection) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        }
      });
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
            document.querySelectorAll(".nav-link-inova").forEach((navLink) => {
              navLink.classList.remove("active");
            });
            link.classList.add("active");

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
      document.querySelectorAll(".activity-card").forEach((card) => {
        card.addEventListener("click", (e) => {
          const modalId = card.getAttribute("data-modal");
          if (modalId && modalData[modalId]) {
            this.openModal(modalData[modalId]);
          }
        });

        // Keyboard accessibility
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const modalId = card.getAttribute("data-modal");
            if (modalId && modalData[modalId]) {
              this.openModal(modalData[modalId]);
            }
          }
        });
      });

      // Modal close events
      const modalOverlay = document.querySelector(".modal-overlay");
      const modalClose = document.querySelector(".modal-close");

      if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
          if (e.target === modalOverlay) {
            this.closeModal();
          }
        });
      }

      if (modalClose) {
        modalClose.addEventListener("click", () => {
          this.closeModal();
        });
      }
    }

    openModal(data) {
      const modalOverlay = document.querySelector(".modal-overlay");
      const modalBody = document.querySelector(".modal-body");

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

      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    closeModal() {
      const modalOverlay = document.querySelector(".modal-overlay");
      if (modalOverlay) {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
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
        const prevBtn = document.querySelector("#prev-day");
        const nextBtn = document.querySelector("#next-day");

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
              element.style.transform = "scale(1.1)";
              element.textContent = newValue;
              setTimeout(() => {
                element.style.transform = "scale(1)";
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
    if (
      e.target.matches(".btn, .activity-card, .speaker-card, .minicourse-card")
    ) {
      const element = e.target.closest(
        ".btn, .activity-card, .speaker-card, .minicourse-card"
      );
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
  const style = document.createElement("style");
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

(() => {
  const timer = document.querySelector(".timer-section");
  if (!timer) return;

  const SHRINK_AT = 150; // ajuste o ponto de encolher conforme necessário

  const onScroll = () => {
    if (window.scrollY > SHRINK_AT) {
      timer.classList.add("compact");
    } else {
      timer.classList.remove("compact");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // aplica estado correto ao carregar
})();
