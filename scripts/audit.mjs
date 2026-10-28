import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const postsDir = join(root, "src/posts");
const distDir = join(root, "dist");
const postFiles = (await readdir(postsDir)).filter((file) => file.endsWith(".md"));
const failures = [];

for (const file of postFiles) {
  const source = await readFile(join(postsDir, file), "utf8");
  for (const key of ["title:", "date:", "legacyCanonical:", "slug:"]) {
    if (!source.includes(`\n${key}`)) failures.push(`${file}: missing ${key}`);
  }
  const slug = file.replace(/\.md$/, "");
  try {
    const built = join(distDir, slug, "index.html");
    if ((await stat(built)).size < 500) failures.push(`${slug}: built page is unexpectedly small`);
  } catch {
    failures.push(`${slug}: built page missing`);
  }
}

const homepage = await readFile(join(distDir, "index.html"), "utf8");
const sitemap = await readFile(join(distDir, "sitemap.xml"), "utf8");
for (const file of postFiles) {
  const slug = file.replace(/\.md$/, "");
  const source = await readFile(join(postsDir, file), "utf8");
  const hiddenFromHomepage = /^hideFromHomepage: true\s*$/m.test(source.split("---")[1]);
  const linkedFromHomepage = homepage.includes(`href="/${slug}/"`);
  if (hiddenFromHomepage && linkedFromHomepage) failures.push(`${slug}: should be hidden from homepage`);
  if (!hiddenFromHomepage && !linkedFromHomepage) failures.push(`${slug}: absent from homepage`);
  if (!sitemap.includes(`/${slug}/</loc>`)) failures.push(`${slug}: absent from sitemap`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Audit passed: ${postFiles.length} Markdown posts and ${postFiles.length} built legacy URLs.`);
