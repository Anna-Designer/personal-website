/**
 * Utility functions for performance and error handling
 * @author Anna Designer
 * @version 1.0.0
 */

'use strict';

/**
 * Error handling utility
 */
window.ErrorHandler = {
  log(error, context = '') {
    if (typeof console !== 'undefined' && console.error) {
      console.error(`[App Error${context ? ` - ${context}` : ''}]:`, error);
    }

    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${context}: ${error.message}`,
        fatal: false
      });
    }
  },

  wrap(fn, context = '') {
    return function(...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        ErrorHandler.log(error, context);
        return null;
      }
    };
  }
};

/**
 * Performance utilities
 */
window.Performance = {
  // Debounce function for performance optimization
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Lazy loading utility
  lazyLoad(elements, options = {}) {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      elements.forEach(el => {
        if (el.dataset.src) {
          el.src = el.dataset.src;
        }
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01,
      ...options
    });

    elements.forEach(img => observer.observe(img));
  },

  // Core Web Vitals monitoring
  measureWebVitals() {
    if (!('performance' in window)) return;

    // Measure and log performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          const metrics = {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstByte: perfData.responseStart - perfData.requestStart
          };

          // Send to analytics if available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              name: 'load_time',
              value: Math.round(metrics.loadTime)
            });
          }
        }
      }, 1000);
    });
  }
};

// Initialize performance monitoring
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Performance.measureWebVitals();
  });
} else {
  Performance.measureWebVitals();
}
