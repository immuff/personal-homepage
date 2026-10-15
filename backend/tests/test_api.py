import json
import os
import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

from fastapi.testclient import TestClient

from init_db import initialize
from main import app


class WebsiteApiTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.path = Path(self.directory.name) / "test.db"
        os.environ["DATABASE_PATH"] = str(self.path)
        initialize(self.path)
        self.client = TestClient(app)

    def tearDown(self):
        self.client.close()
        del os.environ["DATABASE_PATH"]
        self.directory.cleanup()

    def test_profile_and_projects_are_seeded_records(self):
        profile = self.client.get("/api/profile")
        self.assertEqual(profile.status_code, 200)
        self.assertTrue(profile.json()["is_example"])
        self.assertEqual(profile.json()["avatar_url"], "/images/personal-avatar.png")
        projects = self.client.get("/api/projects").json()
        self.assertEqual({p["status"] for p in projects}, {"已完成", "开发中"})
        self.assertTrue(all(p["is_example"] for p in projects))

    def test_search_matches_title_or_excerpt_and_orders_by_date(self):
        posts = self.client.get("/api/posts").json()
        self.assertEqual(len(posts), 5)
        self.assertEqual(posts[0]["slug"], "when-you-feel-unimportant")
        self.assertNotIn("content", posts[0])
        for term, slug in [("SQLite", "from-page-to-database"), ("小世界", "making-a-small-game")]:
            with self.subTest(term=term):
                result = self.client.get("/api/posts", params={"q": term})
                self.assertEqual([p["slug"] for p in result.json()], [slug])
        self.assertEqual(len(self.client.get("/api/posts", params={"q": "   "}).json()), 5)

    def test_user_search_is_literal_and_parameterized(self):
        for term in ["%", "_", "' OR 1=1 --", "无此关键词"]:
            with self.subTest(term=term):
                self.assertEqual(self.client.get("/api/posts", params={"q": term}).json(), [])
        self.assertEqual(self.client.get("/api/posts", params={"q": "x" * 121}).status_code, 422)

    def test_post_content_and_missing_post(self):
        response = self.client.get("/api/posts/from-page-to-database")
        self.assertEqual(response.status_code, 200)
        self.assertIn("```python", response.json()["content"])
        self.assertIsInstance(response.json()["tags"], list)
        missing = self.client.get("/api/posts/does-not-exist")
        self.assertEqual(missing.status_code, 404)
        self.assertEqual(missing.json()["detail"], "文章不存在")

    def test_kafka_article_is_a_real_post_and_searchable(self):
        response = self.client.get("/api/posts/kafka-from-backlog")
        self.assertEqual(response.status_code, 200)
        post = response.json()
        self.assertEqual(post["title"], "从消息积压开始，理解 Kafka")
        self.assertFalse(post["is_example"])
        self.assertIn("## 1. 消息积压，为什么需要队列", post["content"])
        self.assertIn("ZooKeeper", post["content"])
        self.assertIn("KRaft", post["content"])
        self.assertIn("https://kafka.apache.org/", post["content"])
        result = self.client.get("/api/posts", params={"q": "Kafka"}).json()
        self.assertEqual([item["slug"] for item in result], ["kafka-from-backlog"])

    def test_author_essay_is_real_and_searchable(self):
        response = self.client.get("/api/posts/when-you-feel-unimportant")
        self.assertEqual(response.status_code, 200)
        essay = response.json()
        self.assertFalse(essay["is_example"])
        self.assertIn("随笔", essay["tags"])
        self.assertIn("森林里的一棵树", essay["content"])
        self.assertIn("保护自己的边界", essay["content"])
        result = self.client.get("/api/posts", params={"q": "不重要"}).json()
        self.assertEqual([item["slug"] for item in result], ["when-you-feel-unimportant"])

    def test_database_changes_survive_initialization_and_new_client(self):
        with closing(sqlite3.connect(self.path)) as db, db:
            db.execute("UPDATE posts SET title = ? WHERE slug = ?", ("修改后的文章", "a-small-place-on-the-web"))
            profile = json.loads(db.execute("SELECT data FROM profile WHERE id = 1").fetchone()[0])
            profile["display_name"] = "数据库中的新名字"
            db.execute("UPDATE profile SET data = ? WHERE id = 1", (json.dumps(profile, ensure_ascii=False),))
        initialize(self.path)
        with TestClient(app) as restarted:
            self.assertEqual(restarted.get("/api/posts/a-small-place-on-the-web").json()["title"], "修改后的文章")
            self.assertEqual(restarted.get("/api/profile").json()["display_name"], "数据库中的新名字")


if __name__ == "__main__":
    unittest.main()
