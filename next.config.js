/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
    WEBHOOK_URL: process.env.WEBHOOK_URL
  }
}

module.exports = nextConfig 