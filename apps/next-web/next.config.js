/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui", "repo/prisma"],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "vercel.com","avatars.githubusercontent.com","github.com"],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/jogeshwar01/tesior-web",
        permanent: false,
      },
    ];
  },
  // need to add this for the instrumentation hook to work
  experimental: {
    instrumentationHook: true,
  },
  // to ignore import trace warnings in console => ../../node_modules/bullmq/dist/esm/classes/child-processor.js
  // Critical dependency: the request of a dependency is an expression. Import trace for requested module:
  webpack: config => {             // can ignore as everything is working fine
    config.ignoreWarnings = [
      { module: /node_modules\/bullmq\/dist\/esm\/classes\/child-processor\.js/ },
      { file: /node_modules\/bullmq\/dist\/esm\/classes\/child-processor\.js/ },
    ];
    return config;
  }
};
