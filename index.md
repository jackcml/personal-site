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
        {% assign post_timestamp = post.date | date: "%s" %}
        {% assign site_timestamp = site.time | date: "%s" %}
        {% comment %}
          A post is "live" only when its date has passed AND it is not held back
          with `unpublished: true`. The flag is the human-in-the-loop gate: a
          dated post never auto-publishes on date-change while the flag is set.
          Remove the flag to publish.
        {% endcomment %}
        {% assign is_upcoming = false %}
        {% if post.unpublished or post_timestamp > site_timestamp %}
          {% assign is_upcoming = true %}
        {% endif %}

        <article class="list-item">
          <p class="meta">{% if post.display_date %}{{ post.display_date }}{% else %}{{ post.date | date: "%B %-d, %Y" }}{% endif %}</p>
          <h3>
            {% if is_upcoming %}
              {{ post.title }}
            {% else %}
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            {% endif %}
          </h3>
          {% if post.description %}
            <p>{% if is_upcoming %}Upcoming. {% endif %}{{ post.description }}</p>
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
