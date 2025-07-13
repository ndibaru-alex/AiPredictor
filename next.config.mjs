/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
}

export default nextConfig
