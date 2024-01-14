const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    minimumCacheTTL: 60,
    domains: ["s3-alpha-sig.figma.com"],
  },
};

module.exports = nextConfig;
