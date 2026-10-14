export async function requestJson(url, options = {}) {
  const response = await fetch(url, { ...options, cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`内容读取失败（HTTP ${response.status}）。请确认后端已启动，再重试。`);
  }
  return response.json();
}
