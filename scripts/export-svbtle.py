#!/usr/bin/env python3
"""Convert locally backed-up Svbtle post HTML into portable Markdown."""

from pathlib import Path
import html
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "work" / "svbtle-backup" / "html"
DEST = ROOT / "src" / "posts"


def yaml_quote(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def extract(pattern: str, source: str, label: str) -> str:
    match = re.search(pattern, source, re.I | re.S)
    if not match:
        raise RuntimeError(f"Could not recover {label}")
    return html.unescape(re.sub(r"<[^>]+>", "", match.group(1))).strip()


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    for path in sorted(SOURCE.glob("*.html")):
        if path.name == "index.html":
            continue
        source = path.read_text(encoding="utf-8")
        slug = path.stem
        title = extract(r'<h1 class="article_title">\s*<a[^>]*>(.*?)</a>', source, "title")
        date = extract(r'<time[^>]+datetime="([^"]+)"', source, "date")
        canonical = extract(r'<link rel="canonical" href="([^"]+)"', source, "canonical")
        body_match = re.search(
            r'<h1 class="article_title">.*?</h1>(.*?)<figure class="postend', source, re.I | re.S
        )
        if not body_match:
            raise RuntimeError(f"Could not recover article body for {path.name}")
        body_html = body_match.group(1).strip()
        converted = subprocess.run(
            ["pandoc", "--from=html", "--to=gfm", "--wrap=none"],
            input=body_html,
            text=True,
            capture_output=True,
            check=True,
        ).stdout.strip()
        frontmatter = "\n".join([
            "---",
            f"title: {yaml_quote(title)}",
            f"date: {date}",
            f"legacyCanonical: {yaml_quote(canonical)}",
            f"slug: {yaml_quote(slug)}",
            "---",
            "",
        ])
        (DEST / f"{slug}.md").write_text(frontmatter + converted + "\n", encoding="utf-8")
        print(f"exported {slug}")


if __name__ == "__main__":
    main()
