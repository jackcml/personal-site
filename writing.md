---
layout: page
title: Writing
description: Notes, essays, and project write-ups.
permalink: /writing/
---

<div class="list">
  {% for post in site.posts %}
    <article class="list-item">
      <p class="meta">{{ post.date | date: "%B %-d, %Y" }}</p>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      {% if post.description %}
        <p>{{ post.description }}</p>
      {% endif %}
    </article>
  {% endfor %}
</div>
