import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bbashlasnlphhsciulbs.supabase.co',
      },
    ],
  },
};

export default nextConfig;
