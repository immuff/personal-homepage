import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requestJson } from '../lib/api.js';

test('the API reader returns the server record', async () => {
  const original = global.fetch;
  global.fetch = async (url, options) => {
    assert.equal(url, '/api/posts?q=SQLite');
    assert.equal(options.cache, 'no-store');
    return new Response(JSON.stringify([{ title: '来自数据库' }]));
  };
  try { assert.deepEqual(await requestJson('/api/posts?q=SQLite'), [{ title: '来自数据库' }]); }
  finally { global.fetch = original; }
});

test('HTTP failures reject with their status instead of returning sample data', async () => {
  const original = global.fetch;
  global.fetch = async () => new Response('Internal Server Error', { status: 500 });
  try { await assert.rejects(requestJson('/api/profile'), /500/); }
  finally { global.fetch = original; }
});

test('network failures propagate', async () => {
  const original = global.fetch;
  global.fetch = async () => { throw new TypeError('Failed to fetch'); };
  try { await assert.rejects(requestJson('/api/projects'), /Failed to fetch/); }
  finally { global.fetch = original; }
});
