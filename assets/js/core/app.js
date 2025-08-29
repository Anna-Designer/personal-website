/**
 * Main app initialization and orchestration
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Main application controller
 * Coordinates all modules and handles global initialization
 */
window.App = {
  // Module registry
  modules: new Map(),

  // Initialization state
  isInitialized: false,

  /**
   * Register a module
   * @param {string} name - Module name
   * @param {Object} module - Module object with init method
   */
  registerModule(name, module) {
    if (typeof module.init !== 'function') {
      console.warn(`Module ${name} does not have an init method`);
      return;
    }

    this.modules.set(name, module);
  },

  /**
   * Initialize all registered modules
   */
  async init() {
    if (this.isInitialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      // Wait a moment for modules to register themselves
      await new Promise(resolve => setTimeout(resolve, 50));

      // Initialize core modules first
      const coreModules = ['Navigation', 'Animations'];
      for (const moduleName of coreModules) {
        await this.initModule(moduleName);
      }

      // Initialize remaining modules
      for (const [name] of this.modules) {
        if (!coreModules.includes(name)) {
          await this.initModule(name);
        }
      }

      this.isInitialized = true;

      // Dispatch custom event for other scripts
      document.dispatchEvent(new CustomEvent('app:initialized'));

    } catch (error) {
      console.error('App initialization failed:', error);
    }
  },

  /**
   * Initialize a specific module
   * @param {string} name - Module name
   */
  async initModule(name) {
    const module = this.modules.get(name);
    if (!module) {
      console.warn(`Module ${name} not found - skipping`);
      return;
    }

    try {
      await module.init();
    } catch (error) {
      console.error(`Failed to initialize module ${name}:`, error);
    }
  },

  /**
   * Get a registered module
   * @param {string} name - Module name
   * @returns {Object|null} Module instance
   */
  getModule(name) {
    return this.modules.get(name) || null;
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
