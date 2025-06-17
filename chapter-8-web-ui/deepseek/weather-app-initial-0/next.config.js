/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  }
};

const path = require('path');
module.exports = nextConfig;