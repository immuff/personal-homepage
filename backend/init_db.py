import argparse
import json
import sqlite3
from contextlib import closing
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def initialize(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    seed = json.loads((ROOT / "seed.json").read_text(encoding="utf-8"))
    with closing(sqlite3.connect(path)) as db, db:
        db.executescript((ROOT / "schema.sql").read_text(encoding="utf-8"))
        db.execute("INSERT OR IGNORE INTO profile (id, data) VALUES (1, ?)", (json.dumps(seed["profile"], ensure_ascii=False),))
        db.executemany(
            "INSERT OR IGNORE INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)",
            [(p["slug"], p["title"], p["excerpt"], p["published_at"], json.dumps(p["tags"], ensure_ascii=False), p["content"], p["is_example"]) for p in seed["posts"]],
        )
        db.executemany(
            "INSERT OR IGNORE INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [(p["id"], p["name"], p["category"], p["description"], p["status"], p["image_url"], p["url"], p["link_label"], json.dumps(p["tags"], ensure_ascii=False), p["featured"], p["is_example"], p["sort_order"]) for p in seed["projects"]],
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="创建表并插入缺失的示例记录；保留已有内容。")
    parser.add_argument("--path", type=Path, default=ROOT / "data" / "content.db")
    args = parser.parse_args()
    initialize(args.path)
    print(f"数据库已初始化：{args.path.resolve()}")
