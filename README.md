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

## Migration safety

- The untouched source capture is under `work/svbtle-backup/`.
- `legacyCanonical` records the canonical URL emitted by Svbtle.
- The replacement emits HTTPS canonical URLs on the same paths.
- `_redirects` normalizes HTTP and `www` traffic to the HTTPS apex domain on compatible hosts.
- Do not change DNS until a preview has been reviewed and the domain renewed.
