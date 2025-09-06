// ===== ANIMATIONS JAVASCRIPT =====

import { 
  throttle, 
  debounce, 
  isInViewport,
  errorHandler 
} from './utils.js';

/**
 * Scroll Animation Manager
 */
export class ScrollAnimationManager {
  constructor() {
    this.elements = new Map();
    this.observer = null;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.bindScrollEvents();
    this.scanForElements();
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: [0, 0.1, 0.5, 1],
          rootMargin: '-10% 0px -10% 0px'
        }
      );
    }
  }

  scanForElements() {
    const animatedElements = document.querySelectorAll(`
      .scroll-reveal,
      .scroll-reveal-left,
      .scroll-reveal-right,
      .scroll-reveal-scale,
      .fade-in-up,
      .fade-in-down,
      .fade-in-left,
      .fade-in-right,
      .zoom-in,
      .slide-up,
      .slide-down,
      .slide-left,
      .slide-right,
      [data-animate],
      [data-stagger]
    `);

    animatedElements.forEach((element, index) => {
      this.registerElement(element, index);
    });
  }

  registerElement(element, index = 0) {
    const animationType = this.getAnimationType(element);
    const delay = this.getAnimationDelay(element, index);
    
    this.elements.set(element, {
      type: animationType,
      delay: delay,
      triggered: false,
      inView: false
    });

    if (this.observer) {
      this.observer.observe(element);
    }
  }

  getAnimationType(element) {
    if (element.classList.contains('scroll-reveal-left') || element.classList.contains('fade-in-left')) {
      return 'fadeInLeft';
    }
    if (element.classList.contains('scroll-reveal-right') || element.classList.contains('fade-in-right')) {
      return 'fadeInRight';
    }
    if (element.classList.contains('scroll-reveal-scale') || element.classList.contains('zoom-in')) {
      return 'zoomIn';
    }
    if (element.classList.contains('fade-in-down') || element.classList.contains('slide-down')) {
      return 'fadeInDown';
    }
    if (element.classList.contains('slide-up')) {
      return 'slideInUp';
    }
    if (element.classList.contains('slide-left')) {
      return 'slideInLeft';
    }
    if (element.classList.contains('slide-right')) {
      return 'slideInRight';
    }
    if (element.dataset.animate) {
      return element.dataset.animate;
    }
    
    return 'fadeInUp'; // default
  }

  getAnimationDelay(element, index) {
    if (element.dataset.delay) {
      return parseInt(element.dataset.delay);
    }
    
    // Stagger animation
    if (element.closest('[data-stagger]')) {
      const staggerDelay = parseInt(element.closest('[data-stagger]').dataset.stagger) || 100;
      return index * staggerDelay;
    }
    
    return 0;
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      const elementData = this.elements.get(element);
      
      if (!elementData) return;

      elementData.inView = entry.isIntersecting;

      if (entry.isIntersecting && !elementData.triggered) {
        this.triggerAnimation(element, elementData);
      }
    });
  }

  triggerAnimation(element, elementData) {
    elementData.triggered = true;
    
    setTimeout(() => {
      element.classList.add('animate-in', `animate-${elementData.type}`);
      element.style.animationFillMode = 'both';
      
      // Trigger custom event
      element.dispatchEvent(new CustomEvent('animation:start', {
        detail: { type: elementData.type }
      }));
      
      // Listen for animation end
      element.addEventListener('animationend', () => {
        element.dispatchEvent(new CustomEvent('animation:complete', {
          detail: { type: elementData.type }
        }));
      }, { once: true });
      
    }, elementData.delay);
  }

  bindScrollEvents() {
    // Fallback for browsers without IntersectionObserver
    if (!this.observer) {
      window.addEventListener('scroll', throttle(() => {
        this.elements.forEach((elementData, element) => {
          if (!elementData.triggered && isInViewport(element, 0.1)) {
            this.triggerAnimation(element, elementData);
          }
        });
      }, 16));
    }
  }

  // Manual trigger for specific elements
  triggerElement(element) {
    const elementData = this.elements.get(element);
    if (elementData && !elementData.triggered) {
      this.triggerAnimation(element, elementData);
    }
  }

  // Reset animation for element
  resetElement(element) {
    const elementData = this.elements.get(element);
    if (elementData) {
      elementData.triggered = false;
      element.classList.remove('animate-in', `animate-${elementData.type}`);
    }
  }
}

/**
 * Particle System
 */
export class ParticleSystem {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      particleCount: 50,
      particleSize: 2,
      particleSpeed: 1,
      particleColor: '#3b92a2',
      connectionDistance: 100,
      mouseInteraction: true,
      ...options
    };
    
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    
    this.init();
  }

  init() {
    if (!this.container) return;

    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    
    this.container.style.position = 'relative';
    this.container.appendChild(this.canvas);
    
    this.resize();
  }

  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.options.particleSpeed,
        vy: (Math.random() - 0.5) * this.options.particleSpeed,
        size: Math.random() * this.options.particleSize + 1
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', debounce(() => this.resize(), 250));
    
    if (this.options.mouseInteraction) {
      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
    }
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update particles
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Mouse interaction
      if (this.options.mouseInteraction) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.x -= dx * 0.01;
          particle.y -= dy * 0.01;
        }
      }
    });
    
    // Draw particles
    this.ctx.fillStyle = this.options.particleColor;
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Draw connections
    this.ctx.strokeStyle = this.options.particleColor;
    this.ctx.lineWidth = 0.5;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.options.connectionDistance) {
          this.ctx.globalAlpha = 1 - distance / this.options.connectionDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    this.ctx.globalAlpha = 1;
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

/**
 * Morphing Shapes Animation
 */
export class MorphingShapes {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      shapeCount: 3,
      colors: ['#3b92a2', '#8b61c2', '#4d0d9f'],
      animationDuration: 8000,
      ...options
    };
    
    this.shapes = [];
    this.init();
  }

  init() {
    if (!this.container) return;

    this.createShapes();
    this.startAnimation();
  }

  createShapes() {
    for (let i = 0; i < this.options.shapeCount; i++) {
      const shape = document.createElement('div');
      shape.className = 'morphing-shape';
      shape.style.cssText = `
        position: absolute;
        width: ${60 + Math.random() * 40}px;
        height: ${60 + Math.random() * 40}px;
        background: ${this.options.colors[i % this.options.colors.length]};
        opacity: 0.1;
        border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%;
        animation: morph ${this.options.animationDuration}ms ease-in-out infinite;
        animation-delay: ${i * 1000}ms;
        top: ${Math.random() * 80}%;
        left: ${Math.random() * 80}%;
        z-index: 1;
        pointer-events: none;
      `;
      
      this.container.appendChild(shape);
      this.shapes.push(shape);
    }
  }

  startAnimation() {
    this.shapes.forEach((shape, index) => {
      // Add floating animation
      shape.style.animation += `, float ${6000 + index * 1000}ms ease-in-out infinite`;
    });
  }

  destroy() {
    this.shapes.forEach(shape => {
      if (shape.parentNode) {
        shape.parentNode.removeChild(shape);
      }
    });
    this.shapes = [];
  }
}

/**
 * Text Animation Effects
 */
export class TextAnimations {
  static splitText(element, type = 'chars') {
    const text = element.textContent;
    element.innerHTML = '';
    
    if (type === 'chars') {
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.animationDelay = `${index * 50}ms`;
        element.appendChild(span);
      });
    } else if (type === 'words') {
      text.split(' ').forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.25em';
        span.style.animationDelay = `${index * 100}ms`;
        element.appendChild(span);
      });
    }
  }

  static animateText(element, animation = 'fadeInUp') {
    this.splitText(element);
    const spans = element.querySelectorAll('span');
    
    spans.forEach(span => {
      span.classList.add('animate-char', `animate-${animation}`);
    });
  }

  static typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  static glitchText(element, duration = 2000) {
    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    
    let iterations = 0;
    const maxIterations = duration / 50;
    
    const glitch = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      iterations += 1/3;
      
      if (iterations >= originalText.length) {
        clearInterval(glitch);
        element.textContent = originalText;
      }
    }, 50);
  }
}

/**
 * Loading Animations
 */
export class LoadingAnimations {
  static createSpinner(container, type = 'default') {
    const spinner = document.createElement('div');
    spinner.className = `loading-spinner spinner-${type}`;
    
    switch (type) {
      case 'dots':
        spinner.innerHTML = '<div></div><div></div><div></div><div></div>';
        break;
      case 'pulse':
        spinner.innerHTML = '<div class="pulse-dot"></div>';
        break;
      case 'wave':
        spinner.innerHTML = '<div></div><div></div><div></div><div></div><div></div>';
        break;
      default:
        // Default circular spinner
        break;
    }
    
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    container.appendChild(spinner);
    return spinner;
  }

  static createProgressBar(container, options = {}) {
    const { 
      height = '4px',
      color = '#3b92a2',
      backgroundColor = '#e0e0e0',
      animated = true 
    } = options;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.style.cssText = `
      width: 100%;
      height: ${height};
      background: ${backgroundColor};
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.cssText = `
      height: 100%;
      background: ${color};
      width: 0%;
      transition: width 0.3s ease;
      ${animated ? 'animation: progressShine 2s infinite;' : ''}
    `;
    
    progressContainer.appendChild(progressBar);
    
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    container.appendChild(progressContainer);
    
    return {
      container: progressContainer,
      bar: progressBar,
      setProgress: (percent) => {
        progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
      }
    };
  }
}

/**
 * Hover Effects Manager
 */
export class HoverEffectsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupMagneticEffect();
    this.setupTiltEffect();
    this.setupGlowEffect();
  }

  setupMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = parseFloat(element.dataset.magnetic) || 0.3;
        
        element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }

  setupTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  setupGlowEffect() {
    const glowElements = document.querySelectorAll('[data-glow]');
    
    glowElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize scroll animations
    window.scrollAnimationManager = new ScrollAnimationManager();
    
    // Initialize hover effects
    new HoverEffectsManager();
    
    // Initialize particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      new ParticleSystem(heroSection, {
        particleCount: 30,
        particleColor: 'rgba(59, 146, 162, 0.3)',
        connectionDistance: 120
      });
    }
    
    // Initialize morphing shapes for floating elements
    const floatingContainer = document.querySelector('.floating-elements');
    if (floatingContainer) {
      new MorphingShapes(floatingContainer);
    }
    
    // Animate hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      setTimeout(() => {
        TextAnimations.animateText(heroTitle, 'fadeInUp');
      }, 500);
    }
    
    console.log('Animations initialized successfully');
  } catch (error) {
    errorHandler.handle(error, 'Animations Initialization');
  }
});

// Export animation classes
export default {
  ScrollAnimationManager,
  ParticleSystem,
  MorphingShapes,
  TextAnimations,
  LoadingAnimations,
  HoverEffectsManager
};

