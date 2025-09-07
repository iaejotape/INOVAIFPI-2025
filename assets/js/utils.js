// ===== UTILITY FUNCTIONS =====

/**
 * Throttle function to limit the rate of function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function to delay function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  return vertInView && horInView;
}

/**
 * Get element offset from top of document
 * @param {Element} element - Element to get offset for
 * @returns {number} Offset in pixels
 */
export function getElementOffset(element) {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}

/**
 * Smooth scroll to element or position
 * @param {Element|number} target - Element or Y position
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} offset - Additional offset
 */
export function smoothScrollTo(target, duration = 800, offset = 0) {
  const targetPosition = typeof target === 'number' 
    ? target 
    : getElementOffset(target) - offset;
  
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

/**
 * Format number with leading zeros
 * @param {number} num - Number to format
 * @param {number} size - Minimum number of digits
 * @returns {string} Formatted number
 */
export function padNumber(num, size = 2) {
  return num.toString().padStart(size, '0');
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 * @returns {boolean} True if touch is supported
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get CSS custom property value
 * @param {string} property - CSS custom property name
 * @param {Element} element - Element to get property from (default: document.documentElement)
 * @returns {string} Property value
 */
export function getCSSCustomProperty(property, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * Set CSS custom property value
 * @param {string} property - CSS custom property name
 * @param {string} value - Property value
 * @param {Element} element - Element to set property on (default: document.documentElement)
 */
export function setCSSCustomProperty(property, value, element = document.documentElement) {
  element.style.setProperty(property, value);
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Element to add listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 * @returns {Function} Cleanup function
 */
export function addEventListenerWithCleanup(element, event, handler, options = {}) {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Wait for element to exist in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Element>} Promise that resolves with element
 */
export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Create element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Element|Array} content - Element content
 * @returns {Element} Created element
 */
export function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Set content
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof Element) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Element) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Format date to locale string
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(date, locale = 'pt-BR', options = {}) {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Calculate time difference
 * @param {Date|string|number} targetDate - Target date
 * @param {Date|string|number} currentDate - Current date (default: now)
 * @returns {Object} Time difference object
 */
export function getTimeDifference(targetDate, currentDate = new Date()) {
  const target = new Date(targetDate);
  const current = new Date(currentDate);
  const difference = target.getTime() - current.getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: difference };
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage:`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage:`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn(`Error clearing localStorage:`, error);
      return false;
    }
  }
};

/**
 * URL utilities
 */
export const url = {
  /**
   * Get URL parameter value
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value
   */
  getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Set URL parameter
   * @param {string} param - Parameter name
   * @param {string} value - Parameter value
   * @param {boolean} pushState - Whether to push new state to history
   */
  setParam(param, value, pushState = true) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    
    if (pushState) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  },

  /**
   * Remove URL parameter
   * @param {string} param - Parameter name
   * @param {boolean} pushState - Whether to push new state to history
   */
  removeParam(param, pushState = true) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    
    if (pushState) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }
};

/**
 * Performance utilities
 */
export const performance = {
  /**
   * Measure function execution time
   * @param {Function} func - Function to measure
   * @param {string} label - Label for measurement
   * @returns {*} Function result
   */
  measure(func, label = 'Function') {
    const start = window.performance.now();
    const result = func();
    const end = window.performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  },

  /**
   * Get page load metrics
   * @returns {Object} Performance metrics
   */
  getPageMetrics() {
    if (!window.performance || !window.performance.timing) {
      return null;
    }

    const timing = window.performance.timing;
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: timing.responseStart - timing.navigationStart,
      firstByte: timing.responseStart - timing.requestStart
    };
  }
};

/**
 * Animation frame utilities
 */
export const animation = {
  /**
   * Request animation frame with fallback
   * @param {Function} callback - Animation callback
   * @returns {number} Animation frame ID
   */
  request(callback) {
    return (window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            function(callback) { return setTimeout(callback, 16); })(callback);
  },

  /**
   * Cancel animation frame with fallback
   * @param {number} id - Animation frame ID
   */
  cancel(id) {
    (window.cancelAnimationFrame || 
     window.webkitCancelAnimationFrame || 
     window.mozCancelAnimationFrame || 
     clearTimeout)(id);
  }
};

/**
 * Error handling utilities
 */
export const errorHandler = {
  /**
   * Global error handler
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  handle(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    
    // You can extend this to send errors to a logging service
    // Example: sendToLoggingService(error, context);
  },

  /**
   * Wrap function with error handling
   * @param {Function} func - Function to wrap
   * @param {string} context - Error context
   * @returns {Function} Wrapped function
   */
  wrap(func, context) {
    return function(...args) {
      try {
        return func.apply(this, args);
      } catch (error) {
        errorHandler.handle(error, context);
      }
    };
  }
};

// Set up global error handlers
window.addEventListener('error', (event) => {
  errorHandler.handle(event.error, 'Global Error');
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.handle(event.reason, 'Unhandled Promise Rejection');
});

// Export all utilities as default object
export default {
  throttle,
  debounce,
  isInViewport,
  getElementOffset,
  smoothScrollTo,
  padNumber,
  generateId,
  deepClone,
  isMobile,
  isTouchDevice,
  getCSSCustomProperty,
  setCSSCustomProperty,
  addEventListenerWithCleanup,
  waitForElement,
  createElement,
  formatDate,
  getTimeDifference,
  storage,
  url,
  performance,
  animation,
  errorHandler
};

