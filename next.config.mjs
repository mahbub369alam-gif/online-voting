/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent static generation for dynamic routes
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  // Disable static optimization for pages that need dynamic rendering
  // Enable more aggressive dynamic rendering detection
  serverExternalPackages: [],
  experimental: {},
  // Force dynamic rendering for specific patterns
  async rewrites() {
    return {
      beforeFiles: [
        // Add any rewrite rules if needed
      ],
    };
  },
};

export default nextConfig;
