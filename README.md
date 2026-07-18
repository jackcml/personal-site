# personal-site

A small Jekyll site with a one-page index, blogposts, and project links.

## Run

```sh
bundle install
bundle exec jekyll serve
```

## Post format

Markdown files in `_posts/` with filenames: `YYYY-MM-DD-title.md`

Each post should start with front matter:

```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD
description: "A short summary for the index."
---
```

Future-dated posts are shown on the index as upcoming items, unlinked.

Addtional optional values described below:

```yaml
display_date: "Custom override date string"
updated: YYYY-MM-DD
unpublished: true
drop_cap: false
```

The `date` field drives order/release, but you can override the
date *shown* on the index with an arbitrary string with `display_date`.
This is useful if an exact date is unknown and you only want to
show, say, a year or month.

An `updated` date notes the most recent revision after first publishing,
and is shown alongside the published date on the post page
(but not the index) as "(updated ...)".

The `unpublished` boolean holds back auto-publication on `date`.

Set `drop_cap: false` to disable the oversized first letter on a post whose
opening paragraph is too short for it. Drop caps are enabled by default.

## Post images

Keep each post's images in a folder named with the post's URL slug:

```text
assets/images/posts/post-title/image-name.png
```

For a plain image without a caption, use ordinary Markdown with Jekyll's
`relative_url` filter:

```markdown
![Alt text]({{ '/assets/images/posts/post-title/image-name.png' | relative_url }})
```

For a captioned image, use the figure include:

```liquid
{% include figure.html
  src="/assets/images/posts/post-title/image-name.png"
  alt="Alt text"
  caption="An optional caption."
%}
```

## Project link format

Edit `_data/projects.yml`.

## Reading log format

Add reading-log entries to `_data/reading.yml`. Each entry needs a stable `id`
and title. Finished entries use an ISO-formatted `read_date`:

```yaml
- id: the-dispossessed
  title: The Dispossessed
  author: Ursula K. Le Guin
  kind: book
  status: finished
  read_date: 2026-07-13
  url: https://example.com/the-dispossessed
```

For something currently underway, use `status: in-progress` and a
`started_date` instead. An optional `progress` string is shown alongside its
kind:

```yaml
- id: the-brothers-karamazov
  title: The Brothers Karamazov
  author: Fyodor Dostoevsky
  kind: book
  status: in-progress
  started_date: 2026-07-17
  progress: "p. 184 / 824"
```

Entries with associated notes appear first, regardless of reading status.
Note-less entries that are currently underway appear next, followed by a compact
quick log of finished entries without notes. Each group is sorted newest-first.

For an entry with notes, add a Markdown file to `_reading_notes/`. Its
`reading_id` must match the entry's `id`; no title, author, or date needs to be
duplicated:

```markdown
---
reading_id: the-dispossessed
---

Notes go here. They can use ordinary Markdown.
```

The note will automatically receive a `/reading/<filename>/` page and a link
from its reading-log entry. Entries without a matching note remain plain log
items.
