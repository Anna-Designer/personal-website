/**
 * Navigation Module
 * Handles header, mobile menu, smooth scroll, and language switcher
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Navigation module
 * Manages all navigation-related functionality
 */
window.Navigation = {
  // Sub-modules
  smoothScroll: null,
  header: null,
  mobileMenu: null,
  languageSwitcher: null,

  /**
   * Initialize navigation module
   */
  init() {
    this.smoothScroll = new SmoothScroll();
    this.header = new Header();
    this.mobileMenu = new MobileMenu();
    this.languageSwitcher = new LanguageSwitcher();

    // Initialize all sub-modules
    this.smoothScroll.init();
    this.header.init();
    this.mobileMenu.init();
    this.languageSwitcher.init();
  }
};

/**
 * Smooth scrolling functionality
 */
class SmoothScroll {
  init() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', this.handleClick.bind(this), { passive: false });
    });
  }

  handleClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    // Enhanced smooth scroll with reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });

    // Update URL without triggering navigation
    if (history.pushState) {
      history.pushState(null, null, targetId);
    }
  }
}

/**
 * Header scroll effects
 */
class Header {
  constructor() {
    this.element = null;
    this.isScrolled = false;
    this.ticking = false;
  }

  init() {
    this.element = document.querySelector('.modern-header');
    if (!this.element) return;

    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(this.updateHeader.bind(this));
      this.ticking = true;
    }
  }

  updateHeader() {
    const scrolled = window.scrollY > 50;

    if (scrolled !== this.isScrolled) {
      this.element.classList.toggle('scrolled', scrolled);
      this.isScrolled = scrolled;
    }

    this.ticking = false;
  }
}

/**
 * Mobile menu functionality
 */
class MobileMenu {
  constructor() {
    this.toggle = null;
    this.overlay = null;
    this.isOpen = false;
  }

  init() {
    this.toggle = document.querySelector('.mobile-menu-btn');
    this.overlay = document.querySelector('.mobile-nav-overlay');

    if (!this.toggle || !this.overlay) return;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Toggle button
    this.toggle.addEventListener('click', this.handleToggle.bind(this));

    // Close on overlay click
    this.overlay.addEventListener('click', this.close.bind(this));

    // Close on resize to desktop
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });

    // Close when clicking nav links
    const navLinks = this.overlay.querySelectorAll('.mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.close.bind(this));
    });
  }

  handleToggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.overlay.classList.add('active');
    this.toggle.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  close() {
    this.overlay.classList.remove('active');
    this.toggle.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    this.isOpen = false;
  }

  handleResize() {
    if (window.innerWidth >= 768 && this.isOpen) {
      this.close();
    }
  }
}

/**
 * Language switcher functionality
 */
class LanguageSwitcher {
  constructor() {
    this.button = null;
    this.dropdown = null;
    this.container = null;
  }

  init() {
    this.button = document.querySelector('.language-switcher-btn');
    this.dropdown = document.querySelector('.language-dropdown');
    this.container = document.querySelector('.language-switcher');

    if (!this.button || !this.dropdown) return;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Toggle dropdown on button click
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Keyboard navigation for button
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.openDropdown();
        this.focusFirstOption();
      }
    });

    // Keyboard navigation for dropdown
    this.dropdown.addEventListener('keydown', (e) => {
      this.handleDropdownKeydown(e);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Close on global escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }

  handleDropdownKeydown(e) {
    const options = this.dropdown.querySelectorAll('.language-option');
    const currentIndex = Array.from(options).indexOf(document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        options[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        options[prevIndex].focus();
        break;
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        this.button.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        document.activeElement.click();
        break;
    }
  }

  toggleDropdown() {
    const isExpanded = this.button.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.button.setAttribute('aria-expanded', 'true');
  }

  closeDropdown() {
    this.button.setAttribute('aria-expanded', 'false');
  }

  focusFirstOption() {
    const firstOption = this.dropdown.querySelector('.language-option');
    if (firstOption) {
      firstOption.focus();
    }
  }
}

// Register with App
if (window.App) {
  App.registerModule('Navigation', Navigation);
}
