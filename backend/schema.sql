CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    published_at TEXT NOT NULL,
    tags TEXT NOT NULL,
    content TEXT NOT NULL,
    is_example INTEGER NOT NULL CHECK (is_example IN (0, 1))
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('已完成', '开发中')),
    image_url TEXT NOT NULL,
    url TEXT NOT NULL,
    link_label TEXT NOT NULL,
    tags TEXT NOT NULL,
    featured INTEGER NOT NULL CHECK (featured IN (0, 1)),
    is_example INTEGER NOT NULL CHECK (is_example IN (0, 1)),
    sort_order INTEGER NOT NULL
);
