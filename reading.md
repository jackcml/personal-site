---
layout: default
title: Reading
description: book/paper/article log, some with notes.
permalink: /reading/
---

<div class="reading-page">
  <header class="reading-header">
    <p class="eyebrow">personal index / reading.log</p>
    <h1>bookshelf</h1>
  </header>

  {% assign reading_items = site.data.reading | sort: "read_date" | reverse %}
  {% if reading_items.size > 0 %}
    <div class="reading-ledger">
      <div class="reading-ledger-titlebar">
        <span>reading.log</span>
        <span>{{ reading_items.size }} item{% if reading_items.size != 1 %}s{% endif %}</span>
      </div>

      {% assign previous_year = "" %}
      {% for item in reading_items %}
        {% assign item_year = item.read_date | date: "%Y" %}
        {% if item_year != previous_year %}
          {% unless forloop.first %}</div></section>{% endunless %}
          <section class="reading-year" aria-labelledby="year-{{ item_year }}">
            <div class="reading-year-label">
              <h2 id="year-{{ item_year }}">{{ item_year }}</h2>
            </div>
            <div class="reading-items">
          {% assign previous_year = item_year %}
        {% endif %}

        {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
        <article class="reading-item">
          <time datetime="{{ item.read_date | date: '%Y-%m-%d' }}">{{ item.read_date | date: "%b %-d" }}</time>
          <div class="reading-item-copy">
            <h3>{{ item.title }}</h3>
            {% if item.author %}<p>{{ item.author }}</p>{% endif %}
            <div class="reading-item-meta">
              {% if item.kind %}<span>{{ item.kind }}</span>{% endif %}
              {% if item.status %}<span>{{ item.status }}</span>{% endif %}
            </div>
          </div>
          <div class="reading-item-links">
            {% if matching_note %}<a class="reading-notes-link" href="{{ matching_note.url | relative_url }}">notes →</a>{% endif %}
            {% if item.url %}<a href="{{ item.url }}">source ↗</a>{% endif %}
          </div>
        </article>

        {% if forloop.last %}</div></section>{% endif %}
      {% endfor %}
    </div>
  {% else %}
    <div class="empty-shelf">
      <span aria-hidden="true">[&nbsp;&nbsp;&nbsp;]</span>
      <p><strong>The shelf is empty for now.</strong> The next finished thing will go here.</p>
    </div>
  {% endif %}
</div>
