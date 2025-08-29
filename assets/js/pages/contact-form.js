/**
 * Contact Form Handler
 * Enhanced with performance optimizations, accessibility, and better UX
 * @author Anna Designer
 * @version 2.0.0
 */

'use strict';

/**
 * Contact Form Module
 */
const ContactForm = {

  form: null,
  submitButton: null,
  isSubmitting: false,

  // Configuration
  config: {
    debounceDelay: 300,
    messageAutoRemoveDelay: 10000,
    validationRules: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[1-9][\d]{0,15}$/,
      url: /^https?:\/\/.+/
    }
  },

  /**
   * Initialize the contact form
   */
  init() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;

    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.bindEvents();
    this.setupValidation();
  },

  /**
   * Bind form events
   */
  bindEvents() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Add real-time validation
    const fields = this.form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.addEventListener('blur', this.handleFieldBlur.bind(this));
      field.addEventListener('input', this.debounce(this.handleFieldInput.bind(this), this.config.debounceDelay));
    });
  },

  /**
   * Setup form validation
   */
  setupValidation() {
    const requiredFields = this.form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      // Add ARIA attributes for accessibility
      field.setAttribute('aria-required', 'true');

      // Create error container
      if (!field.parentNode.querySelector('.field-error')) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'field-error';
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'polite');
        field.parentNode.appendChild(errorContainer);
      }
    });
  },

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    // Validate all fields
    if (!this.validateForm()) {
      this.showFormMessage(
        'Please correct the errors below before submitting.',
        'error'
      );
      return;
    }

    this.isSubmitting = true;
    this.setSubmitState(true);

    try {
      const formData = this.prepareFormData();
      const response = await this.submitForm(formData);

      if (response.ok) {
        this.handleSuccess();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isSubmitting = false;
      this.setSubmitState(false);
    }
  },

  /**
   * Prepare form data for submission
   */
  prepareFormData() {
    const formData = new FormData(this.form);

    // Add metadata
    formData.append('_subject', 'New Project Inquiry from Portfolio');
    formData.append('_next', `${window.location.origin}/thank-you`);
    formData.append('_language', document.documentElement.lang || 'en');
    formData.append('_timestamp', new Date().toISOString());
    formData.append('_source', window.location.href);

    return formData;
  },

  /**
   * Submit form data
   */
  async submitForm(formData) {
    return fetch(this.form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Handle successful submission
   */
  handleSuccess() {
    this.showFormMessage(
      'Thank you! Your message has been sent successfully. I\'ll get back to you within 24-48 hours.',
      'success'
    );

    this.form.reset();
    this.clearAllErrors();

    // Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        'event_category': 'Contact',
        'event_label': 'Success'
      });
    }
  },

  /**
   * Handle form submission error
   */
  handleError(error) {
    console.error('Form submission error:', error);

    this.showFormMessage(
      'Sorry, there was an error sending your message. Please try again or contact me directly via email.',
      'error'
    );

    // Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        'event_category': 'Contact',
        'event_label': 'Error'
      });
    }
  },

  /**
   * Set submit button state
   */
  setSubmitState(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.textContent = 'Sending...';
      this.submitButton.disabled = true;
      this.submitButton.setAttribute('aria-busy', 'true');
    } else {
      this.submitButton.textContent = this.submitButton.dataset.originalText || 'Send Message';
      this.submitButton.disabled = false;
      this.submitButton.setAttribute('aria-busy', 'false');
    }
  },

  /**
   * Show form message to user
   */
  showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');

    messageEl.innerHTML = `
      <p>${this.escapeHtml(message)}</p>
      <button type="button" class="message-close" aria-label="Close message">&times;</button>
    `;

    // Insert message
    this.form.parentNode.insertBefore(messageEl, this.form);

    // Add close functionality
    const closeBtn = messageEl.querySelector('.message-close');
    closeBtn.addEventListener('click', () => messageEl.remove());

    // Auto-remove success messages
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, this.config.messageAutoRemoveDelay);
    }

    // Scroll to message for better UX
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  /**
   * Handle field blur event
   */
  handleFieldBlur(e) {
    this.validateField(e.target);
  },

  /**
   * Handle field input event (debounced)
   */
  handleFieldInput(e) {
    const field = e.target;

    // Clear error state when user starts typing
    if (field.classList.contains('error')) {
      this.clearFieldError(field);
    }
  },

  /**
   * Validate entire form
   */
  validateForm() {
    const fields = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear existing error
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value && !this.config.validationRules.email.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
    // URL validation
    else if (field.type === 'url' && value && !this.config.validationRules.url.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid URL (starting with http:// or https://)';
    }
    // Phone validation
    else if (field.type === 'tel' && value && !this.config.validationRules.phone.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
    // Minimum length validation
    else if (field.minLength && value.length < field.minLength) {
      isValid = false;
      errorMessage = `Minimum ${field.minLength} characters required`;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  },

  /**
   * Show field error
   */
  showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    const errorContainer = field.parentNode.querySelector('.field-error');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
    }
  },

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');

    const errorContainer = field.parentNode.querySelector('.field-error');
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.style.display = 'none';
    }
  },

  /**
   * Clear all form errors
   */
  clearAllErrors() {
    const errorFields = this.form.querySelectorAll('.error');
    errorFields.forEach(field => this.clearFieldError(field));
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Debounce utility function
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
};

// Register with App
if (window.App) {
  App.registerModule('ContactForm', ContactForm);
} else {
  // Fallback: Initialize directly if App not available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContactForm.init());
  } else {
    ContactForm.init();
  }
}
