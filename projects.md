---
layout: page
title: Projects
description: Selected work and experiments.
permalink: /projects/
---

<div class="project-list">
  {% for project in site.data.projects %}
    <article class="project">
      <div>
        <h2><a href="{{ project.url }}">{{ project.name }}</a></h2>
        <p>{{ project.description }}</p>
      </div>

      {% if project.tags %}
        <ul class="tags" aria-label="{{ project.name }} tags">
          {% for tag in project.tags %}
            <li>{{ tag }}</li>
          {% endfor %}
        </ul>
      {% endif %}
    </article>
  {% endfor %}
</div>
