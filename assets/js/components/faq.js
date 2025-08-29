/**
 * FAQ Accordion Component - Simplified
 * Clean and minimal FAQ functionality
 * @author Anna Designer
 * @version 1.0.0
 */

(function() {
  'use strict';

  /**
   * Initialize FAQ functionality when DOM is ready
   */
  function initFAQ() {
    // Check if FAQ elements exist
    const faqItems = document.querySelectorAll('.faq-item');
    const navLinks = document.querySelectorAll('.faq-navigation a');

    if (faqItems.length === 0) return;

    // Initialize accordion
    initAccordion(faqItems);

    // Initialize navigation if present
    if (navLinks.length > 0) {
      initNavigation(navLinks);
    }
  }

  /**
   * Initialize accordion functionality
   */
  function initAccordion(items) {
    items.forEach((item, index) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      // Set up click handler
      question.addEventListener('click', () => toggleItem(item));

      // Set up keyboard navigation
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem(item);
        }
      });

      // Set accessibility attributes
      const answerId = `faq-answer-${index}`;
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('aria-controls', answerId);
      answer.setAttribute('id', answerId);
    });
  }

  /**
   * Toggle FAQ item open/closed
   */
  function toggleItem(item) {
    const isActive = item.classList.contains('active');
    const question = item.querySelector('.faq-question');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        const otherQuestion = otherItem.querySelector('.faq-question');
        if (otherQuestion) {
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Toggle current item
    if (isActive) {
      item.classList.remove('active');
      question.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Initialize navigation functionality
   */
  function initNavigation(links) {
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Update active state
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Smooth scroll to section
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });

    // Simple scroll-based active state (no IntersectionObserver)
    let currentSection = '';
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.faq-section');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          if (currentSection !== section.id) {
            currentSection = section.id;
            links.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${section.id}`) {
                link.classList.add('active');
              }
            });
          }
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }

})();
