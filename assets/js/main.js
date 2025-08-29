/**
 * Main JavaScript entry point for Anna Designer Portfolio
 * Loads and initializes all required modules
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Module loader and initializer
 * Manages dynamic loading of JavaScript modules based on page requirements
 */
window.ModuleLoader = {
  // Track loaded modules
  loadedModules: new Set(),

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Load core modules (always needed)
      await this.loadCoreModules();

      // Load page-specific modules
      await this.loadPageModules();

      // Load component modules
      await this.loadComponentModules();

      // Initialize the main app
      if (window.App) {
        await window.App.init();
      }

    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  },

  /**
   * Load core modules that are always needed
   */
  async loadCoreModules() {
    const coreModules = [
      '/assets/js/core/app.js',
      '/assets/js/core/utils.js',
      '/assets/js/modules/navigation.js',
      '/assets/js/modules/animations.js'
    ];

    await this.loadModules(coreModules);
  },

  /**
   * Load page-specific modules based on current page
   */
  async loadPageModules() {
    const pageModules = [];

    // Detect page type and load appropriate modules
    if (document.querySelector('#work-app') || document.querySelector('.portfolio-modal-trigger')) {
      pageModules.push('/assets/js/modules/portfolio.js');
    }

    if (document.querySelector('.contact-form')) {
      pageModules.push('/assets/js/pages/contact-form.js');
    }

    if (pageModules.length > 0) {
      await this.loadModules(pageModules);
    }
  },

  /**
   * Load component modules based on page content
   */
  async loadComponentModules() {
    const componentModules = [];

    if (document.querySelector('.faq-section') || document.querySelector('.faq-item')) {
      componentModules.push('/assets/js/components/faq.js');
    }

    if (componentModules.length > 0) {
      await this.loadModules(componentModules);
    }
  },

  /**
   * Load multiple modules
   * @param {Array} modules - Array of module paths
   */
  async loadModules(modules) {
    const promises = modules.map(module => this.loadModule(module));
    await Promise.all(promises);
  },

  /**
   * Load a single module
   * @param {string} modulePath - Path to the module
   */
  async loadModule(modulePath) {
    if (this.loadedModules.has(modulePath)) {
      return; // Already loaded
    }

    try {
      const script = document.createElement('script');
      script.src = modulePath;
      script.async = false; // Maintain order

      const loadPromise = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load module: ${modulePath}`));
      });

      document.head.appendChild(script);
      await loadPromise;

      this.loadedModules.add(modulePath);

    } catch (error) {
      console.error(`Error loading module ${modulePath}:`, error);
      throw error;
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ModuleLoader.init());
} else {
  ModuleLoader.init();
}
