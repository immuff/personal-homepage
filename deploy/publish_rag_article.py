"""Publish only the reviewed RAG article, preserving all other site content."""
import argparse
import json
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "agent-rag-03-retrieval-design"
FIELDS = ("slug", "title", "excerpt", "published_at", "tags", "content", "is_example")


def publish(path, dry_run=False):
    seed = json.loads((ROOT / "backend/seed.json").read_text(encoding="utf-8"))
    matches = [p for p in seed["posts"] if p["slug"] == SLUG]
    if len(matches) != 1:
        raise ValueError("Expected exactly one RAG article in seed.json")
    article = matches[0]
    markdown = (ROOT / "content/agent-rag/03-rag-retrieval-design.md").read_text(encoding="utf-8")
    heading, body = markdown.split("\n", 1)
    if heading != "# " + article["title"] or body.strip() != article["content"].strip():
        raise ValueError("Reviewed Markdown and seed content differ")
    if article["is_example"]:
        raise ValueError("The RAG article must be a real post")
    values = tuple(json.dumps(article[f], ensure_ascii=False) if f == "tags" else int(article[f]) if f == "is_example" else article[f] for f in FIELDS)
    with closing(sqlite3.connect(path.resolve().as_uri() + "?mode=rw", uri=True, timeout=15)) as db:
        existing = db.execute("SELECT * FROM posts WHERE slug = ?", (SLUG,)).fetchone()
        if existing is not None:
            if existing != values:
                raise ValueError("An article with this slug already exists with different content; no changes made")
            return {"status": "unchanged", "slug": SLUG}
        if dry_run:
            return {"status": "ready", "slug": SLUG, "content_characters": len(article["content"])}
        backup = ROOT / ".runtime" / ("content-before-rag-" + datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f") + ".db")
        backup.parent.mkdir(parents=True, exist_ok=True)
        with closing(sqlite3.connect(backup)) as target:
            db.backup(target)
        # Hold a write transaction while comparing all unrelated records.
        db.execute("BEGIN IMMEDIATE")
        try:
            def snapshot():
                return (
                    db.execute("SELECT * FROM posts WHERE slug != ? ORDER BY slug", (SLUG,)).fetchall(),
                    db.execute("SELECT * FROM profile ORDER BY id").fetchall(),
                    db.execute("SELECT * FROM projects ORDER BY id").fetchall(),
                )
            before = snapshot()
            db.execute("INSERT INTO posts (" + ",".join(FIELDS) + ") VALUES (?, ?, ?, ?, ?, ?, ?)", values)
            if before != snapshot():
                raise RuntimeError("Unrelated site content changed")
            if db.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                raise RuntimeError("Database integrity check failed")
            db.commit()
        except Exception:
            db.rollback()
            raise
    return {"status": "published", "slug": SLUG, "backup": str(backup), "unrelated_content_unchanged": True}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--path", type=Path, default=ROOT / "backend/data/content.db")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    print(json.dumps(publish(args.path, args.dry_run), ensure_ascii=False))
