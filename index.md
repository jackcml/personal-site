---
layout: default
title: Home
---

<section class="intro">
  <p>
    writing, links, notes, etc.
  </p>
</section>

<section class="section-grid" aria-label="Recent writing and projects">
  <div>
    <div class="section-heading">
      <h2>writing</h2>
    </div>

    <div class="list">
      {% for post in site.posts %}
        <article class="list-item">
          <p class="meta">{{ post.date | date: "%B %-d, %Y" }}</p>
          <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          {% if post.description %}
            <p>{{ post.description }}</p>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </div>

  <div>
    <div class="section-heading">
      <h2>projects</h2>
    </div>

    <div class="list">
      {% for project in site.data.projects %}
        <article class="list-item">
          <h3><a href="{{ project.url }}">{{ project.name }}</a></h3>
          <p>{{ project.description }}</p>
          {% if project.tags %}
            <ul class="tags inline-tags" aria-label="{{ project.name }} tags">
              {% for tag in project.tags %}
                <li>{{ tag }}</li>
              {% endfor %}
            </ul>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </div>
</section>
