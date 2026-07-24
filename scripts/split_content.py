#!/usr/bin/env python3
"""One-time migration: split content-data.js's single ARTICLES array into
one JSON file per article under content/articles/<key>.json.

Run once: python3 scripts/split_content.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_DATA_FILE = os.path.join(ROOT, "content-data.js")
ARTICLES_DIR = os.path.join(ROOT, "content", "articles")


def load_articles():
    with open(SITE_DATA_FILE, encoding="utf-8") as f:
        raw = f.read().strip()
    body = re.sub(r"^const ARTICLES\s*=\s*", "", raw)
    body = re.sub(r";\s*$", "", body)
    return json.loads(body)


def main():
    articles = load_articles()
    os.makedirs(ARTICLES_DIR, exist_ok=True)

    seen_keys = set()
    for article in articles:
        key = article.get("key")
        if not key:
            raise ValueError("Article missing 'key' field: " + json.dumps(article)[:200])
        if key in seen_keys:
            raise ValueError("Duplicate article key: " + key)
        seen_keys.add(key)

        file_path = os.path.join(ARTICLES_DIR, key + ".json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(article, f, ensure_ascii=False, indent=2)
            f.write("\n")

    # Several legacy articles share the same `order` value (app.js sorts by
    # `order` with a stable sort, so ties fall back to array position). To
    # rebuild the exact original display sequence, record the original key
    # order here. Lives outside content/articles/ so Decap CMS's folder
    # collection (content/articles/*.json) never picks it up as a document.
    order_manifest_path = os.path.join(ROOT, "content", "_order-manifest.json")
    with open(order_manifest_path, "w", encoding="utf-8") as f:
        json.dump([a["key"] for a in articles], f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Split {len(articles)} articles into {ARTICLES_DIR}")
    print(f"Wrote original ordering manifest to {order_manifest_path}")


if __name__ == "__main__":
    main()
