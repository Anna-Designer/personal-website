---
layout: page
title: "Work"
permalink: /work/
blog_page: true
description: "Explore my portfolio of design and development projects."
---

<section id="work-app" class="work-app">
  <div class="container blog-container-full">
    <div class="work-layout">
      <div class="work-main">
        <h1 class="work-heading">My Projects</h1>
        <div id="projects-grid" class="post-grid" aria-live="polite"></div>
        <div id="pagination" class="pagination" aria-label="Pagination"></div>
        <div id="no-results" class="no-results" hidden>No projects match your search.</div>
      </div>
      <aside class="work-sidebar" aria-label="Search and filters">
        <div class="blog-search">
          <label for="blog-search-input" class="visually-hidden">Search projects</label>
          <input type="search" id="blog-search-input" placeholder="Search projects..." autocomplete="off" aria-label="Search projects" />
        </div>
        <div class="blog-filters">
          <h3 class="filters-heading">Tags</h3>
          <div id="tag-filters" class="tag-filter-list" role="group" aria-label="Filter by tags"></div>
          <button type="button" id="clear-filters" class="clear-filters-btn" hidden>Clear filters</button>
        </div>
      </aside>
    </div>
  </div>
</section>

{% comment %}Generate JSON for projects - using new collections structure{% endcomment %}
{% assign current_lang = page.lang | default: site.default_lang %}
{% assign projects_sorted = site.projects | default: empty | sort: 'date' | reverse %}

<script id="projects-data" type="application/json">[
{%- for project in projects_sorted -%}
{"title":{{ project.title | jsonify }},"url":{{ project.url | jsonify }},"date":{{ project.date | date_to_xmlschema | jsonify }},"date_formatted":{{ project.date | date: "%b %-d, %Y" | jsonify }},"tags":{{ project.tags | jsonify }},"image":{{ project.image | default: '/assets/images/bgs/starry_bg.png' | jsonify }},"link":{{ project.link | jsonify }},"excerpt":{{ project.excerpt | jsonify }}}{% unless forloop.last %},{% endunless %}
{%- endfor -%}
]</script>
<script>
// Parse embedded JSON into global variable
window.PROJECTS_DATA = JSON.parse(document.getElementById('projects-data').textContent);
</script>
<script src="{{ '/assets/js/projects.js' | relative_url }}"></script>
