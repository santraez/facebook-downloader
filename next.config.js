/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://video.xx.fbcdn.net/:path*'
      }
    ]
  }
}

module.exports = nextConfig
