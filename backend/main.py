import json
import os
import sqlite3
from contextlib import closing
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query, Response

app = FastAPI(title="个人主页 API", version="1.0.0")


def connection():
    path = Path(os.environ.get("DATABASE_PATH", Path(__file__).resolve().parent / "data" / "content.db"))
    # mode=rw：未初始化时明确失败，避免悄悄创建一个空数据库。
    # FastAPI 的同步处理可能跨工作线程，每个请求仍使用独立连接。
    with closing(sqlite3.connect(path.resolve().as_uri() + "?mode=rw", uri=True, check_same_thread=False)) as db:
        db.row_factory = sqlite3.Row
        yield db


Database = Annotated[sqlite3.Connection, Depends(connection)]


def post_record(row):
    record = dict(row)
    record["tags"] = json.loads(record["tags"])
    record["is_example"] = bool(record["is_example"])
    return record


@app.get("/api/profile")
def profile(db: Database, response: Response):
    response.headers["Cache-Control"] = "no-store"
    return json.loads(db.execute("SELECT data FROM profile WHERE id = 1").fetchone()["data"])


@app.get("/api/posts")
def posts(db: Database, response: Response, q: Annotated[str, Query(max_length=120)] = ""):
    response.headers["Cache-Control"] = "no-store"
    term = q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    rows = db.execute(
        "SELECT slug, title, excerpt, published_at, tags, is_example FROM posts "
        "WHERE title LIKE ? ESCAPE '\\' OR excerpt LIKE ? ESCAPE '\\' "
        "ORDER BY published_at DESC, slug ASC",
        (f"%{term}%", f"%{term}%"),
    ).fetchall()
    return [post_record(row) for row in rows]


@app.get("/api/posts/{slug}")
def post(slug: str, db: Database, response: Response):
    response.headers["Cache-Control"] = "no-store"
    row = db.execute("SELECT * FROM posts WHERE slug = ?", (slug,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="文章不存在")
    return post_record(row)


@app.get("/api/projects")
def projects(db: Database, response: Response):
    response.headers["Cache-Control"] = "no-store"
    records = [dict(row) for row in db.execute("SELECT * FROM projects ORDER BY sort_order, id").fetchall()]
    for record in records:
        record["tags"] = json.loads(record["tags"])
        record["featured"] = bool(record["featured"])
        record["is_example"] = bool(record["is_example"])
    return records
