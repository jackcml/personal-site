---
layout: default
title: Home
---

<section class="homepage-feature" aria-label="Featured app and webcat game">
<article class="featured-app" aria-labelledby="misapad-title">
  <div class="featured-app-titlebar">
    <span>featured_deployment.html</span>
  </div>

  <div class="featured-app-body">
    <p class="section-number">new on the internet / 01</p>
    <h1 id="misapad-title">misa<span>pad</span></h1>
    <p class="featured-app-lede">An LLM pair-writing frontend, updated for the chat-completion era.</p>
    <p class="featured-app-copy">
      The app is deployed and ready to use in the browser. Bring a thought,
      find a model, and write something together.
    </p>

    <div class="featured-app-actions">
      <a class="launch-app" href="https://misapad.jackl.cat/">launch misapad <span aria-hidden="true">↗</span></a>
      <a class="repo-link" href="https://github.com/jackcml/misapad">view source on GitHub</a>
    </div>

    <dl class="featured-app-facts">
      <div><dt>type</dt><dd>live web app</dd></div>
      <div><dt>address</dt><dd>misapad.jackl.cat</dd></div>
    </dl>
  </div>

  <div class="featured-app-marquee" aria-hidden="true">
    <span>write / respond / revise / continue /</span>
  </div>
</article>

<section class="webcat-game" aria-labelledby="webcat-title">
  <div class="webcat-titlebar">
    <h2 id="webcat-title">webcat.exe :: purr acquisition terminal</h2>
    <span class="save-status" aria-hidden="true">[ autosave: on ]</span>
  </div>

  <div class="webcat-game-grid">
    <div class="cat-console">
      <div class="purr-display">
        <p>purr balance</p>
        <strong data-purr-count>0</strong>
        <span><b data-purr-rate>0</b> per second</span>
      </div>

      <button class="cat-button" type="button" aria-label="Pet the webcat">
        <span class="cat-face" aria-hidden="true">
          <span>/\_/\</span>
          <span>( o.o )</span>
          <span>&gt; ^ &lt;</span>
        </span>
        <span class="pet-prompt">pet webcat&nbsp; [+<b data-click-power>1</b>]</span>
      </button>

      <p class="cat-message" aria-live="polite">webcat is accepting visitors...</p>
      <p class="cat-rank">friendship status: <strong data-cat-rank>complete stranger</strong></p>
    </div>

    <aside class="cat-shop" aria-labelledby="shop-title">
      <div class="shop-heading">
        <div>
          <p class="section-number">c:/webcat/supplies</p>
          <h2 id="shop-title">cat supply store</h2>
        </div>
        <span aria-hidden="true">$</span>
      </div>
      <p class="shop-help">Spend purrs to improve local cat infrastructure.</p>

      <div class="upgrade-list">
        <button class="upgrade" type="button" data-upgrade="yarn">
          <span class="upgrade-icon" aria-hidden="true">(=)</span>
          <span class="upgrade-copy"><strong>yarn ball</strong><small>+1 purr per pet</small></span>
          <span class="upgrade-meta"><b><span data-cost>10</span> purrs</b><small>owned: <span data-owned>0</span></small></span>
        </button>

        <button class="upgrade" type="button" data-upgrade="scritcher">
          <span class="upgrade-icon" aria-hidden="true">///</span>
          <span class="upgrade-copy"><strong>auto-scritcher</strong><small>+1 purr per second</small></span>
          <span class="upgrade-meta"><b><span data-cost>35</span> purrs</b><small>owned: <span data-owned>0</span></small></span>
        </button>

        <button class="upgrade" type="button" data-upgrade="modem">
          <span class="upgrade-icon" aria-hidden="true">56k</span>
          <span class="upgrade-copy"><strong>catnip modem</strong><small>+5 purrs per second</small></span>
          <span class="upgrade-meta"><b><span data-cost>120</span> purrs</b><small>owned: <span data-owned>0</span></small></span>
        </button>
      </div>
    </aside>
  </div>

  <footer class="game-footer">
    <p>lifetime purrs: <strong data-lifetime-purrs>0</strong></p>
    <p>progress lives in this browser only</p>
    <button class="reset-game" type="button">erase save</button>
  </footer>
</section>
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
