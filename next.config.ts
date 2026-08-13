/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your dev origins for local testing
  allowedDevOrigins: ['192.168.0.162', '10.66.137.104', '10.16.228.104', '192.168.114.104', '10.21.83.104', '10.42.209.104', '172.16.0.2', '172.31.40.104'],

  // CRITICAL for Google Cloud Run / Docker
  output: 'standalone',

  // Optional: If you are using external images (like from Firebase Storage)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

module.exports = nextConfig;
