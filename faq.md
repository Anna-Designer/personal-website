---
layout: page
title: "Frequently Asked Questions"
lang: en
description: "Answers to common questions about my freelance design and development services."
permalink: /faq/
---

<div class="faq-container">
  <div class="faq-sidebar">
    <nav class="faq-navigation">
      <ul>
        {% for section in site.data.faq.en.sections %}
        <li>
          <a href="#{{ section.id }}">{{ section.title }}</a>
        </li>
        {% endfor %}
      </ul>
    </nav>
  </div>

  <div class="faq-content">
    {% for section in site.data.faq.en.sections %}
    <div class="faq-section" id="{{ section.id }}">
      <h2 class="faq-section-title">{{ section.title }}</h2>
      
      <div class="faq-accordion">
        {% for item in section.questions %}
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>{{ item.question }}</span>
            <span class="faq-icon" aria-hidden="true"></span>
          </button>
          <div class="faq-answer">
            <div class="faq-answer-content">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
    {% endfor %}

    <div class="faq-submit">
      <h3 class="faq-submit-title">{{ site.data.translations.en.faq.submit_question.title }}</h3>
      <p class="faq-submit-description">{{ site.data.translations.en.faq.submit_question.description }}</p>

      <a href="/contact/" class="btn btn-primary">
        {{ site.data.translations.en.faq.submit_question.cta }}
      </a>

      <div class="faq-submit-email">
        <span class="email-label">{{ site.data.translations.en.faq.submit_question.email_label }}</span>
        <a href="mailto:{{ site.help_email }}" class="email-link">{{ site.help_email }}</a>
      </div>
    </div>

  </div>
</div>

### Do you offer consultations?

Yes! I provide free 30-minute consultations to discuss your project and determine if we're a good fit to work together.

### What information do you need to provide a quote?

To provide an accurate quote, I need to understand your project scope, timeline, and goals. The more detail you can provide, the better I can serve you.

---

Still have questions? [Get in touch](/contacts) and I'll be happy to help!
