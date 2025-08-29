/**
 * Portfolio Module
 * Handles portfolio modal, gallery functionality, filtering, and pagination
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Portfolio module
 * Manages portfolio display, filtering, modals, and interactions
 */
window.Portfolio = {
  // Sub-modules
  modal: null,
  gallery: null,
  filter: null,

  /**
   * Initialize portfolio module
   */
  init() {
    this.modal = new PortfolioModal();
    this.gallery = new PortfolioGallery();
    this.filter = new PortfolioFilter();

    // Initialize sub-modules
    this.modal.init();
    this.gallery.init();
    this.filter.init();
  }
};

/**
 * Portfolio modal functionality
 */
class PortfolioModal {
  constructor() {
    this.triggers = null;
    this.modals = null;
    this.currentModal = null;
  }

  init() {
    this.triggers = document.querySelectorAll('.portfolio-modal-trigger');
    this.modals = document.querySelectorAll('.portfolio-modal');

    if (!this.triggers.length || !this.modals.length) return;

    this.bindEvents();
  }

  bindEvents() {
    // Modal triggers
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', this.handleTriggerClick.bind(this));
    });

    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', this.close.bind(this));
    });

    // Close on outside click
    this.modals.forEach(modal => {
      modal.addEventListener('click', this.handleOutsideClick.bind(this));
    });

    // Close on escape key
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleTriggerClick(e) {
    e.preventDefault();
    const projectIndex = e.currentTarget.getAttribute('data-project');
    const modal = document.getElementById(`portfolio-modal-${projectIndex}`);

    if (modal) {
      this.open(modal);
    }
  }

  open(modal) {
    this.currentModal = modal;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  close() {
    if (this.currentModal) {
      this.currentModal.style.display = 'none';
      this.currentModal = null;
    }
    document.body.style.overflow = '';
  }

  handleOutsideClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.currentModal) {
      this.close();
    }
  }
}

/**
 * Portfolio gallery functionality
 */
class PortfolioGallery {
  constructor() {
    this.galleries = null;
  }

  init() {
    this.galleries = document.querySelectorAll('.portfolio-gallery');
    if (!this.galleries.length) return;

    this.setupGalleries();
  }

  setupGalleries() {
    this.galleries.forEach(gallery => {
      this.setupSingleGallery(gallery);
    });
  }

  setupSingleGallery(gallery) {
    const images = gallery.querySelectorAll('.gallery-image');

    images.forEach((image, index) => {
      image.addEventListener('click', () => {
        this.openLightbox(gallery, index);
      });
    });
  }

  openLightbox(gallery, startIndex) {
    // Simple lightbox implementation
    const images = gallery.querySelectorAll('.gallery-image img');
    const overlay = this.createLightboxOverlay();
    let currentIndex = startIndex;

    const showImage = (index) => {
      const img = overlay.querySelector('.lightbox-image');
      img.src = images[index].src;
      img.alt = images[index].alt;
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }
    });

    showImage(currentIndex);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  createLightboxOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img class="lightbox-image" src="" alt="">
      </div>
    `;
    return overlay;
  }
}

/**
 * Portfolio filtering and pagination functionality
 */
class PortfolioFilter {
  constructor() {
    this.state = {
      search: '',
      tags: new Set(),
      page: 1,
      pageSize: 10,
      filtered: []
    };

    this.els = {
      grid: null,
      pagination: null,
      search: null,
      tagFilters: null,
      clearBtn: null,
      noResults: null
    };
  }

  init() {
    // Only initialize on work page
    if (!document.querySelector('#work-app')) return;

    this.bindElements();
    if (!this.els.grid) return;

    this.setupFiltering();
  }

  bindElements() {
    this.els.grid = document.getElementById('projects-grid');
    this.els.pagination = document.getElementById('pagination');
    this.els.search = document.getElementById('blog-search-input');
    this.els.tagFilters = document.getElementById('tag-filters');
    this.els.clearBtn = document.getElementById('clear-filters');
    this.els.noResults = document.getElementById('no-results');
  }

  setupFiltering() {
    try {
      if (!window.PROJECTS_DATA || !Array.isArray(window.PROJECTS_DATA)) {
        throw new Error('PROJECTS_DATA missing');
      }

      this.buildTagChips();
      this.bindEvents();
      this.state.filtered = window.PROJECTS_DATA.slice();
      this.render();
      this.fallbackStyling();

    } catch (e) {
      this.els.grid.innerHTML = '<p style="padding:1rem;">Projects failed to load.</p>';
      console.error(e);
    }
  }

  uniqueTags(projects) {
    const tags = new Set();
    projects.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }

  buildTagChips() {
    const tags = this.uniqueTags(window.PROJECTS_DATA || []);
    this.els.tagFilters.innerHTML = '';

    tags.forEach(tag => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-filter-btn';
      btn.textContent = tag;
      btn.setAttribute('data-tag', tag);
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => this.toggleTag(tag, btn));
      this.els.tagFilters.appendChild(btn);
    });
  }

  bindEvents() {
    // Search input
    this.els.search.addEventListener('input', (e) => {
      this.state.search = e.target.value;
      this.updateClearButton();
      this.state.page = 1;
      this.applyFilters();
    });

    // Clear filters button
    this.els.clearBtn.addEventListener('click', () => {
      this.clearAllFilters();
    });
  }

  toggleTag(tag, btn) {
    if (this.state.tags.has(tag)) {
      this.state.tags.delete(tag);
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      this.state.tags.add(tag);
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }

    this.updateClearButton();
    this.state.page = 1;
    this.applyFilters();
  }

  updateClearButton() {
    this.els.clearBtn.hidden = this.state.tags.size === 0 && !this.state.search;
  }

  clearAllFilters() {
    this.state.tags.clear();
    this.state.search = '';
    this.els.search.value = '';

    Array.from(this.els.tagFilters.querySelectorAll('.tag-filter-btn')).forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    this.els.clearBtn.hidden = true;
    this.state.page = 1;
    this.applyFilters();
  }

  applyFilters() {
    const query = this.state.search.trim().toLowerCase();
    const tagSet = this.state.tags;

    this.state.filtered = (window.PROJECTS_DATA || []).filter(project => {
      const matchesSearch = !query ||
        project.title.toLowerCase().includes(query) ||
        project.excerpt.toLowerCase().includes(query) ||
        (project.tags || []).some(tag => tag.toLowerCase().includes(query));

      const matchesTags = tagSet.size === 0 ||
        (project.tags || []).some(tag => tagSet.has(tag));

      return matchesSearch && matchesTags;
    });

    this.render();
  }

  render() {
    const totalPages = this.pageCount();
    if (this.state.page > totalPages) this.state.page = totalPages;

    const start = (this.state.page - 1) * this.state.pageSize;
    const items = this.state.filtered.slice(start, start + this.state.pageSize);

    this.els.grid.innerHTML = items.map(project => this.templateCard(project)).join('');
    this.els.noResults.hidden = this.state.filtered.length !== 0;
    this.renderPagination(totalPages);
  }

  pageCount() {
    return Math.max(1, Math.ceil(this.state.filtered.length / this.state.pageSize));
  }

  templateCard(project) {
    const tagsHtml = (project.tags || [])
      .map(tag => `<span class='post-chip'>${this.escapeHtml(tag)}</span>`)
      .join('');

    return `<article class="project-card" style="background-image:url('${this.escapeHtml(project.image)}')">
      <a href="${project.url}" class="project-card-link" aria-label="View ${this.escapeHtml(project.title)}">
        <div class="project-card-overlay">
          <div class="project-card-tags">${tagsHtml}</div>
          <h2 class="project-card-title">${this.escapeHtml(project.title)}</h2>
          <div>
            <span class="project-view-btn" aria-hidden="true">View Project →</span>
          </div>
        </div>
      </a>
    </article>`;
  }

  renderPagination(total) {
    if (total <= 1) {
      this.els.pagination.innerHTML = '';
      return;
    }

    let html = '';
    html += `<button type="button" class="page-btn prev" ${this.state.page === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - this.state.page) <= 1) {
        html += `<button type="button" class="page-btn ${i === this.state.page ? 'active' : ''}" data-page="${i}" aria-current="${i === this.state.page ? 'page' : 'false'}">${i}</button>`;
      } else if (Math.abs(i - this.state.page) === 2) {
        html += `<span class="page-ellipsis" aria-hidden="true">…</span>`;
      }
    }

    html += `<button type="button" class="page-btn next" ${this.state.page === total ? 'disabled' : ''} aria-label="Next page">›</button>`;
    this.els.pagination.innerHTML = html;

    // Bind pagination events
    this.els.pagination.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.page = parseInt(btn.dataset.page, 10);
        this.render();
      });
    });

    const prev = this.els.pagination.querySelector('.prev');
    const next = this.els.pagination.querySelector('.next');

    if (prev) {
      prev.addEventListener('click', () => {
        if (this.state.page > 1) {
          this.state.page--;
          this.render();
        }
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        if (this.state.page < total) {
          this.state.page++;
          this.render();
        }
      });
    }
  }

  escapeHtml(str) {
    return String(str).replace(/[&<>"]+/g, s => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[s]));
  }

  fallbackStyling() {
    // Fallback styling if CSS doesn't load properly
    requestAnimationFrame(() => {
      const first = this.els.grid.querySelector('.project-card');
      if (first) {
        const rect = first.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          this.els.grid.style.display = 'block';
          Array.from(this.els.grid.children).forEach(card => {
            card.style.display = 'inline-block';
            card.style.width = '300px';
            card.style.minHeight = '400px';
            card.style.margin = '1rem';
          });
          console.warn('Project cards had zero size; applied fallback inline styles.');
        }
      }
    });
  }
}

// Register with App
if (window.App) {
  App.registerModule('Portfolio', Portfolio);
}
