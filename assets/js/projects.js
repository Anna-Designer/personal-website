/**
 * Projects Page Module
 * Handles project filtering, pagination, and search functionality
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Projects module
 * Manages project filtering, search, and pagination
 */
window.ProjectsPage = {
  init() {
    // Only initialize on work/projects page
    if (!document.querySelector('#work-app')) return;

    this.filter = new ProjectsFilter();
    this.filter.init();
  }
};

/**
 * Projects filtering and pagination functionality
 */
class ProjectsFilter {
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
        throw new Error('PROJECTS_DATA data missing');
      }

      this.buildTagChips();
      this.bindEvents();
      this.state.filtered = window.PROJECTS_DATA.slice();
      this.render();

    } catch (e) {
      this.els.grid.innerHTML = '<p style="padding:1rem;">Projects failed to load.</p>';
      console.error(e);
    }
  }

  uniqueTags(projects) {
    const tags = new Set();
    projects.forEach(project => (project.tags || []).forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }

  buildTagChips(projects = window.PROJECTS_DATA) {
    const tags = this.uniqueTags(projects);
    const currentSelectedTags = new Set(this.state.tags);

    this.els.tagFilters.innerHTML = '';

    tags.forEach(tag => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-filter-btn';
      btn.textContent = tag;
      btn.setAttribute('data-tag', tag);
      btn.setAttribute('aria-pressed', currentSelectedTags.has(tag) ? 'true' : 'false');

      // Only add active class if the tag is still available and was previously selected
      if (currentSelectedTags.has(tag)) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => this.toggleTag(tag, btn));
      this.els.tagFilters.appendChild(btn);
    });

    // Remove any selected tags that are no longer available in the filtered projects
    const availableTags = new Set(tags);
    for (const selectedTag of currentSelectedTags) {
      if (!availableTags.has(selectedTag)) {
        this.state.tags.delete(selectedTag);
      }
    }

    // Update clear button visibility after potentially removing tags
    this.updateClearButton();
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

    // Rebuild tag chips based on filtered projects
    this.buildTagChips(this.state.filtered);

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

    const backgroundImage = project.image ? `style="background-image: url('${this.escapeHtml(project.image)}');"` : '';

    return `<article class="project-card" ${backgroundImage}>
      <a href="${project.url}" class="project-card-link" aria-label="View ${this.escapeHtml(project.title)}">
        <div class="project-card-overlay">
          <div class="project-card-tags">${tagsHtml}</div>
          <h2 class="project-card-title">${this.escapeHtml(project.title)}</h2>
          <div><span class="project-view-btn" aria-hidden="true">View Project →</span></div>
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
        this.scrollToTop();
      });
    });

    const prev = this.els.pagination.querySelector('.prev');
    const next = this.els.pagination.querySelector('.next');

    if (prev) {
      prev.addEventListener('click', () => {
        if (this.state.page > 1) {
          this.state.page--;
          this.render();
          this.scrollToTop();
        }
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        if (this.state.page < total) {
          this.state.page++;
          this.render();
          this.scrollToTop();
        }
      });
    }
  }

  scrollToTop() {
    // Scroll to the top of the work content area smoothly
    const workApp = document.querySelector('#work-app');
    if (workApp) {
      workApp.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
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
}

// Register with App
if (window.App) {
  App.registerModule('ProjectsPage', ProjectsPage);
} else {
  // Fallback: Initialize directly if App not available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProjectsPage.init());
  } else {
    ProjectsPage.init();
  }
}
