/**
 * Blog Page Module
 * Handles blog filtering, pagination, and search functionality
 * @author Anna Designer
 * @version 3.0.0
 */

'use strict';

/**
 * Blog module
 * Manages blog post filtering, search, and pagination
 */
window.BlogPage = {
  init() {
    // Only initialize on blog page
    if (!document.querySelector('#blog-app')) return;

    this.filter = new BlogFilter();
    this.filter.init();
  }
};

/**
 * Blog filtering and pagination functionality
 */
class BlogFilter {
  constructor() {
    this.state = {
      search: '',
      tags: new Set(),
      category: null,
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
    this.els.grid = document.getElementById('posts-grid');
    this.els.pagination = document.getElementById('pagination');
    this.els.search = document.getElementById('blog-search-input');
    this.els.tagFilters = document.getElementById('tag-filters');
    this.els.clearBtn = document.getElementById('clear-filters');
    this.els.noResults = document.getElementById('no-results');
  }

  setupFiltering() {
    try {
      if (!window.BLOG_POSTS || !Array.isArray(window.BLOG_POSTS)) {
        throw new Error('BLOG_POSTS data missing');
      }

      this.buildTagChips();
      this.bindEvents();
      this.state.filtered = window.BLOG_POSTS.slice();
      this.render();

    } catch (e) {
      this.els.grid.innerHTML = '<p style="padding:1rem;">Blog posts failed to load.</p>';
      console.error(e);
    }
  }

  uniqueTags(posts) {
    const tags = new Set();
    posts.forEach(post => (post.tags || []).forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }

  buildTagChips(posts = window.BLOG_POSTS) {
    const tags = this.uniqueTags(posts);
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

    // Remove any selected tags that are no longer available in the filtered posts
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

    // Category change event listener
    document.addEventListener('categoryChange', () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      this.setCategory(category);
    });

    // Initialize category from URL on page load
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category');
    if (initialCategory) {
      this.setCategory(initialCategory);
    }
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

  setCategory(category) {
    this.state.category = category;
    this.updateClearButton();
    this.state.page = 1;
    this.applyFilters();
  }

  updateClearButton() {
    this.els.clearBtn.hidden = this.state.tags.size === 0 && !this.state.search && !this.state.category;
  }

  clearAllFilters() {
    this.state.tags.clear();
    this.state.search = '';
    this.state.category = null;
    this.els.search.value = '';

    Array.from(this.els.tagFilters.querySelectorAll('.tag-filter-btn')).forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    // Clear category selection in URL and UI
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    history.replaceState(null, '', url.toString());

    // Update category link active state
    const categoryLinks = document.querySelectorAll('.blog-category-bar .category-link');
    categoryLinks.forEach(link => link.classList.remove('active'));
    const allLink = document.querySelector('.blog-category-bar [data-cat="all"]');
    if (allLink) allLink.classList.add('active');

    this.els.clearBtn.hidden = true;
    this.state.page = 1;
    this.applyFilters();
  }

  applyFilters() {
    const query = this.state.search.trim().toLowerCase();
    const tagSet = this.state.tags;
    const category = this.state.category;

    this.state.filtered = (window.BLOG_POSTS || []).filter(post => {
      const matchesSearch = !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags || []).some(tag => tag.toLowerCase().includes(query));

      const matchesTags = tagSet.size === 0 ||
        (post.tags || []).some(tag => tagSet.has(tag));

      const matchesCategory = !category ||
        (post.category && post.category.toLowerCase() === category.toLowerCase());

      return matchesSearch && matchesTags && matchesCategory;
    });

    // Rebuild tag chips based on filtered posts
    this.buildTagChips(this.state.filtered);

    this.render();
  }

  render() {
    const totalPages = this.pageCount();
    if (this.state.page > totalPages) this.state.page = totalPages;

    const start = (this.state.page - 1) * this.state.pageSize;
    const items = this.state.filtered.slice(start, start + this.state.pageSize);

    this.els.grid.innerHTML = items.map(post => this.templateCard(post)).join('');
    this.els.noResults.hidden = this.state.filtered.length !== 0;
    this.renderPagination(totalPages);
  }

  pageCount() {
    return Math.max(1, Math.ceil(this.state.filtered.length / this.state.pageSize));
  }

  templateCard(post) {
    const tagsHtml = (post.tags || [])
      .map(tag => `<span class='post-chip'>${this.escapeHtml(tag)}</span>`)
      .join('');

    const backgroundImage = post.image ? `style="background-image: url('${this.escapeHtml(post.image)}');"` : '';

    return `<article class="post-card" ${backgroundImage}>
      <a href="${post.url}" class="post-card-link" aria-label="Read ${this.escapeHtml(post.title)}">
        <div class="post-card-overlay">
          <div class="post-card-tags">${tagsHtml}</div>
          <h2 class="post-card-title">${this.escapeHtml(post.title)}</h2>
          <div><span class="post-read-btn" aria-hidden="true">Read →</span></div>
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
    // Scroll to the top of the blog content area smoothly
    const blogApp = document.querySelector('#blog-app');
    if (blogApp) {
      blogApp.scrollIntoView({
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

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
}

// Register with App
if (window.App) {
  App.registerModule('BlogPage', BlogPage);
} else {
  // Fallback: Initialize directly if App not available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BlogPage.init());
  } else {
    BlogPage.init();
  }
}

// Global function for category filtering (called from blog.html)
window.applyBlogCategory = function(category) {
  if (window.BlogPage && window.BlogPage.filter) {
    window.BlogPage.filter.setCategory(category);
  }
};
