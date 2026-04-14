import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        '3000-firebase-gst-genie-1762851762608.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev',
        'localhost:3000'
      ],
      bodySizeLimit: '10mb',
    },
  },

  // 👇 THIS REWRITES RULE IS CRITICAL FOR CLOUD WORKSTATIONS
  async rewrites() {
    return [
      {
        source: '/api/flask/:path*', 
        destination: 'http://127.0.0.1:5000/api/:path*', 
      },
    ];
  },
};

export default nextConfig;