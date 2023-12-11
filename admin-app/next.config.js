/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    NEXT_PUBLIC_MAIN_SERVICE: 'http://calvary-main-service:8080',
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_MAIN_SERVICE: 'http://localhost:8080',
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
    ],
  },
};

module.exports = nextConfig;
