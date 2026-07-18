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

  {% assign reading_items = site.data.reading %}
  {% assign current_items = reading_items | where: "status", "in-progress" | sort: "started_date" | reverse %}
  {% assign completed_items = reading_items | where_exp: "item", "item.status != 'in-progress'" | sort: "read_date" | reverse %}

  {% assign notes_count = 0 %}
  {% assign current_plain_count = 0 %}
  {% assign quick_count = 0 %}
  {% for item in reading_items %}
    {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
    {% if matching_note %}
      {% assign notes_count = notes_count | plus: 1 %}
    {% elsif item.status == "in-progress" %}
      {% assign current_plain_count = current_plain_count | plus: 1 %}
    {% else %}
      {% assign quick_count = quick_count | plus: 1 %}
    {% endif %}
  {% endfor %}

  {% if notes_count > 0 %}
    <section class="reading-ledger reading-noted" aria-labelledby="reading-notes-heading">
      <div class="reading-ledger-titlebar">
        <span id="reading-notes-heading">notes</span>
        <span>{{ notes_count }} entr{% if notes_count == 1 %}y{% else %}ies{% endif %}</span>
      </div>
      <div class="reading-items">
        {% for item in current_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% if matching_note %}{% include reading-item.html item=item current=true %}{% endif %}
        {% endfor %}
        {% for item in completed_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% if matching_note %}{% include reading-item.html item=item %}{% endif %}
        {% endfor %}
      </div>
    </section>
  {% endif %}

  {% if current_plain_count > 0 %}
    <section class="reading-ledger reading-current" aria-labelledby="currently-reading-heading">
      <div class="reading-ledger-titlebar">
        <span id="currently-reading-heading">currently reading</span>
        <span>{{ current_plain_count }} active</span>
      </div>
      <div class="reading-items">
        {% for item in current_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% unless matching_note %}{% include reading-item.html item=item current=true %}{% endunless %}
        {% endfor %}
      </div>
    </section>
  {% endif %}

  {% if quick_count > 0 %}
    <section class="reading-ledger reading-quick" aria-labelledby="quick-log-heading">
      <div class="reading-ledger-titlebar">
        <span id="quick-log-heading">quick log</span>
        <span>{{ quick_count }} item{% if quick_count != 1 %}s{% endif %}</span>
      </div>
      <div class="reading-items">
        {% for item in completed_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% unless matching_note %}{% include reading-item.html item=item compact=true %}{% endunless %}
        {% endfor %}
      </div>
    </section>
  {% endif %}

  {% if reading_items.size == 0 %}
    <div class="empty-shelf">
      <span aria-hidden="true">[&nbsp;&nbsp;&nbsp;]</span>
      <p><strong>The shelf is empty for now.</strong> The next thing will go here.</p>
    </div>
  {% endif %}
</div>
