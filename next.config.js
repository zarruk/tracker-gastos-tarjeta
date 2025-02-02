/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  distDir: '.next',
  // Agregar logs en desarrollo
  onDemandEntries: {
    // periodo de tiempo en ms donde las páginas se mantienen en buffer
    maxInactiveAge: 25 * 1000,
    // número de páginas que se mantienen en memoria
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer, dev }) => {
    // Aquí puedes agregar logs de webpack si es necesario
    if (dev && isServer) {
      console.log('Webpack config is running in development mode')
    }
    return config
  },
}

module.exports = nextConfig 