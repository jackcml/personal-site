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
  {% assign paused_items = reading_items | where: "status", "paused" | sort: "started_date" | reverse %}
  {% assign completed_items = reading_items | where: "status", "finished" | sort: "read_date" | reverse %}
  {% assign to_read_items = reading_items | where: "status", "to-read" | sort: "added_date" | reverse %}

  {% assign notes_count = 0 %}
  {% assign current_plain_count = 0 %}
  {% assign paused_count = 0 %}
  {% assign quick_count = 0 %}
  {% assign to_read_count = 0 %}
  {% for item in reading_items %}
    {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
    {% if matching_note %}
      {% assign notes_count = notes_count | plus: 1 %}
    {% elsif item.status == "in-progress" %}
      {% assign current_plain_count = current_plain_count | plus: 1 %}
    {% elsif item.status == "paused" %}
      {% assign paused_count = paused_count | plus: 1 %}
    {% elsif item.status == "finished" %}
      {% assign quick_count = quick_count | plus: 1 %}
    {% elsif item.status == "to-read" %}
      {% assign to_read_count = to_read_count | plus: 1 %}
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
        {% for item in paused_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% if matching_note %}{% include reading-item.html item=item paused=true %}{% endif %}
        {% endfor %}
        {% for item in completed_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% if matching_note %}{% include reading-item.html item=item %}{% endif %}
        {% endfor %}
        {% for item in to_read_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% if matching_note %}{% include reading-item.html item=item to_read=true %}{% endif %}
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

  {% if paused_count > 0 %}
    <section class="reading-ledger reading-paused" aria-labelledby="paused-reading-heading">
      <div class="reading-ledger-titlebar">
        <span id="paused-reading-heading">paused</span>
        <span>{{ paused_count }} on hold</span>
      </div>
      <div class="reading-items">
        {% for item in paused_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% unless matching_note %}{% include reading-item.html item=item paused=true %}{% endunless %}
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

  {% if to_read_count > 0 %}
    <section class="reading-ledger reading-to-read" aria-labelledby="to-read-heading">
      <div class="reading-ledger-titlebar">
        <span id="to-read-heading">to read</span>
        <span>{{ to_read_count }} item{% if to_read_count != 1 %}s{% endif %}</span>
      </div>
      <div class="reading-items">
        {% for item in to_read_items %}
          {% assign matching_note = site.reading_notes | where: "reading_id", item.id | first %}
          {% unless matching_note %}{% include reading-item.html item=item compact=true to_read=true %}{% endunless %}
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
