/**
 * Animations Module
 * Handles scroll animations, transitions, and performance optimizations
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Animations module
 * Manages scroll-based animations and visual effects
 */
window.Animations = {
  // Sub-modules
  scrollAnimations: null,
  performance: null,

  /**
   * Initialize animations module
   */
  init() {
    this.scrollAnimations = new ScrollAnimations();
    this.performance = new PerformanceOptimizer();

    // Initialize sub-modules
    this.scrollAnimations.init();
    this.performance.init();
  }
};

/**
 * Scroll-based animations with performance optimization
 */
class ScrollAnimations {
  constructor() {
    this.observer = null;
  }

  init() {
    // Only initialize if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.addImmediateAnimations();
      return;
    }

    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
    this.observeElements();
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Stop observing once animated to improve performance
        this.observer.unobserve(entry.target);
      }
    });
  }

  observeElements() {
    const selectors = [
      '.process-step',
      '.testimonial-card',
      '.pricing-card',
      '.portfolio-item',
      '.service-card',
      '.feature-card'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    elements.forEach(el => this.observer.observe(el));
  }

  addImmediateAnimations() {
    // For users with reduced motion preference, add animations immediately
    const selectors = [
      '.process-step',
      '.testimonial-card',
      '.pricing-card',
      '.portfolio-item',
      '.service-card',
      '.feature-card'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    elements.forEach(el => el.classList.add('animate-in'));
  }

  /**
   * Cleanup method for destroying observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Performance optimization utilities
 */
class PerformanceOptimizer {
  constructor() {
    this.imageObserver = null;
  }

  init() {
    this.lazyLoadImages();
    this.optimizeBackgroundImages();
  }

  /**
   * Lazy load images for performance
   */
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => this.imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => this.loadImage(img));
    }
  }

  /**
   * Load individual image
   * @param {HTMLImageElement} img - Image element to load
   */
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    img.src = src;
    img.classList.remove('lazy');
    img.classList.add('loaded');

    // Remove data-src after loading
    img.removeAttribute('data-src');
  }

  /**
   * Optimize background images loading
   */
  optimizeBackgroundImages() {
    const bgElements = document.querySelectorAll('[data-bg-src]');

    if ('IntersectionObserver' in window) {
      const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const bgSrc = element.dataset.bgSrc;

            if (bgSrc) {
              element.style.backgroundImage = `url(${bgSrc})`;
              element.classList.add('bg-loaded');
              element.removeAttribute('data-bg-src');
            }

            bgObserver.unobserve(element);
          }
        });
      });

      bgElements.forEach(el => bgObserver.observe(el));
    } else {
      // Fallback
      bgElements.forEach(el => {
        const bgSrc = el.dataset.bgSrc;
        if (bgSrc) {
          el.style.backgroundImage = `url(${bgSrc})`;
          el.classList.add('bg-loaded');
          el.removeAttribute('data-bg-src');
        }
      });
    }
  }

  /**
   * Cleanup method for destroying observers
   */
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }
  }
}

// Register with App
if (window.App) {
  App.registerModule('Animations', Animations);
}
