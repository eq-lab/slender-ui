/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // NB: We should run ESLint externally on build.
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: {
    externalDir: true,
    outputFileTracingRoot: path.join(__dirname, '../..'),
  },
};
