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
```

The `date` field drives order/release, but you can override the
date *shown* on the index with an arbitrary string with `display_date`.
This is useful if an exact date is unknown and you only want to
show, say, a year or month.

An `updated` date notes the most recent revision after first publishing,
and is shown alongside the published date on the post page
(but not the index) as "(updated ...)".

The `unpublished` boolean holds back auto-publication on `date`.

## Project link format

Edit `_data/projects.yml`.
