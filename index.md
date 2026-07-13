---
layout: default
title: Home
---

<section class="intro" aria-labelledby="intro-title">
  <div class="intro-copy">
    <p class="eyebrow"><span class="status-light" aria-hidden="true"></span> jack’s homepage · online!</p>
    <h1 id="intro-title">
      <span>words,</span>
      <span>code &amp;</span>
      <span>rabbit holes.</span>
    </h1>
    <p class="intro-lede">
      Hi, I’m Jack. I write about computers, books, and whichever rabbit hole is
      winning; I also make small software projects when writing about them isn’t enough.
    </p>
    <div class="intro-links" aria-label="Jump to a section">
      <a class="button-link" href="#writing">read the blog <span aria-hidden="true">→</span></a>
      <a class="text-link" href="#projects">see my projects ↓</a>
    </div>
  </div>

  <aside class="webcat" aria-label="Resident webcat">
    <div class="webcat-titlebar">
      <span>webcat.exe</span>
      <span aria-hidden="true">×</span>
    </div>
    <div class="webcat-body">
      <div class="cat-face" aria-hidden="true">
        <span class="cat-ears">/\_/\</span>
        <span>( o.o )</span>
        <span>&gt; ^ &lt;</span>
      </div>
      <p class="cat-message" aria-live="polite">the webcat is thinking...</p>
      <button class="pet-button" type="button">pet the webcat <span aria-hidden="true">♡</span></button>
      <p class="pet-count"><span data-purr-count>0</span> purrs on this browser</p>
    </div>
  </aside>
</section>

<div class="tiny-divider" aria-hidden="true"><span>*</span><span>+</span><span>*</span></div>

<section class="section-grid" aria-label="Recent writing and projects">
  <div class="window-card writing-card" id="writing">
    <div class="section-heading">
      <div>
        <p class="section-number">01 / words</p>
        <h2>recent writing</h2>
      </div>
      <span class="section-doodle" aria-hidden="true">Aa</span>
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
          <p class="meta">{% if post.display_date %}{{ post.display_date }}{% else %}{{ post.date | date: "%b %-d, %Y" }}{% endif %}</p>
          <h3>
            {% if is_upcoming %}
              {{ post.title }}
            {% else %}
              <a href="{{ post.url | relative_url }}">{{ post.title }} <span class="arrow" aria-hidden="true">↗</span></a>
            {% endif %}
          </h3>
          {% if post.description %}
            <p>{% if is_upcoming %}<span class="upcoming">coming soon</span> {% endif %}{{ post.description }}</p>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </div>

  <div class="window-card projects-card" id="projects">
    <div class="section-heading">
      <div>
        <p class="section-number">02 / things</p>
        <h2>projects &amp; experiments</h2>
      </div>
      <span class="section-doodle" aria-hidden="true">&lt;/&gt;</span>
    </div>

    <div class="list">
      {% for project in site.data.projects %}
        <article class="list-item project-item">
          <h3><a href="{{ project.url }}">{{ project.name }} <span class="arrow" aria-hidden="true">↗</span></a></h3>
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

<aside class="site-note">
  <span aria-hidden="true">☻</span>
  <p><strong>you made it to the bottom!</strong> Thanks for visiting my website. Please imagine that I have a cool guestbook here.</p>
</aside>
