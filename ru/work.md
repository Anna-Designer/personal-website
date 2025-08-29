---
layout: page
title: "Работы"
permalink: /ru/work/
blog_page: true
lang: ru
description: "Изучите мое портфолио проектов дизайна и разработки."
---

<section id="work-app" class="work-app">
  <div class="container blog-container-full">
    <div class="work-layout">
      <div class="work-main">
        <h1 class="work-heading">Мои Проекты</h1>
        <div id="projects-grid" class="post-grid" aria-live="polite"></div>
        <div id="pagination" class="pagination" aria-label="Pagination"></div>
        <div id="no-results" class="no-results" hidden>Нет проектов, соответствующих вашему поиску.</div>
      </div>
      <aside class="work-sidebar" aria-label="Search and filters">
        <div class="blog-search">
          <label for="blog-search-input" class="visually-hidden">Поиск проектов</label>
          <input type="search" id="blog-search-input" placeholder="Поиск проектов..." autocomplete="off" aria-label="Поиск проектов" />
        </div>
        <div class="blog-filters">
          <h3 class="filters-heading">Теги</h3>
          <div id="tag-filters" class="tag-filter-list" role="group" aria-label="Фильтр по тегам"></div>
          <button type="button" id="clear-filters" class="clear-filters-btn" hidden>Очистить фильтры</button>
        </div>
      </aside>
    </div>
  </div>
</section>

{% comment %}Generate JSON for Russian projects - using new collections structure{% endcomment %}
{% assign current_lang = page.lang | default: 'ru' %}
{% assign projects_sorted = site.projects_ru | default: empty | sort: 'date' | reverse %}

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
