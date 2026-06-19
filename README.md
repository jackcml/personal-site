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

### Holding a post back (human-in-the-loop publishing)

Add `unpublished: true` to a post's front matter to keep it from going live, even
once its date has passed:

```yaml
---
layout: post
title: "Post Title"
date: 2026-06-04
description: "A short summary for the homepage."
unpublished: true
---
```

While the flag is set, the post stays an `Upcoming.` teaser (no link) on the
homepage and its page renders a placeholder instead of the body. A post only goes
live when its date has passed **and** the flag is absent — so a dated post never
auto-publishes on date-change while it is held. To publish, delete the
`unpublished:` line.

## Add Projects

Edit `_data/projects.yml`.
