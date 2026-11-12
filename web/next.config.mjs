const nextConfig = {
  async rewrites() {
    const origin = process.env.EXPRESS_API_ORIGIN || 'http://localhost:4000';
    return [{ source: '/api/:path*', destination: `${origin.replace(/\/$/, '')}/api/:path*` }];
  }
};
export default nextConfig;
