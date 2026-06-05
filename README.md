# Personal Site

A small Jekyll site with a one-page index, linked writing posts, and project links.

## Run Locally

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Add Writing

Create Markdown files in `_posts/` using this filename format:

```text
YYYY-MM-DD-title.md
```

Each post should start with front matter:

```yaml
---
layout: post
title: "Post Title"
date: 2026-06-04
description: "A short summary for the homepage."
---
```

Future-dated posts are shown on the homepage as upcoming items. They are not linked
from the homepage until their date arrives, and their description is prefixed with
`Upcoming.`

## Add Projects

Edit `_data/projects.yml`.
