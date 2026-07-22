# thenickhuber.com

Portable Markdown archive and static Eleventy site for Nick Huber.

## Local use

```sh
npm install
npm run build
npm run audit
npm run dev
```

Posts live in `src/posts/`. Each filename is the historical Svbtle slug, so the generated URL remains unchanged.

## Publish a new post

1. Create a Markdown file in `src/posts/`. Use a lowercase, hyphenated filename; it becomes the public URL. For example, `my-new-post.md` becomes `/my-new-post/`.
2. Begin the file with this front matter:

```md
---
title: "My New Post"
date: 2026-07-21
---

Write the post here using Markdown.
```

3. Preview it locally with `npm run dev`, then open `http://localhost:8080`.
4. Commit and push the file to the `main` branch. Cloudflare Pages automatically builds and publishes it.

Images belong in `src/assets/` and can be embedded with `![Description](/assets/image-name.jpg)`.

If you prefer, ask Codex to create or publish a post from a draft. The Markdown file in this repository remains the source of truth.

## Migration safety

- The untouched source capture is preserved separately in the migration backup archive.
- `legacyCanonical` records the canonical URL emitted by Svbtle.
- The replacement emits HTTPS canonical URLs on the same paths.
- HTTP and `www` normalization will be configured during the approved domain cutover.
- Do not change DNS until a preview has been reviewed and the domain renewed.
