/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  compress: true
}

module.exports = nextConfig 