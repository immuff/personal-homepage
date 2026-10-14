const nextConfig = {
  poweredByHeader: false,
  // 此项目位于现有学习项目中，构建和模块查找始终以自身目录为根。
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://127.0.0.1:8001/api/:path*' }];
  },
};

export default nextConfig;
