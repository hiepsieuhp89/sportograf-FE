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
  webpack: (config, { isServer }) => {
    // Exclude nodemailer and other Node.js-only modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
        url: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
      };
      
      // Exclude nodemailer and googleapis from client bundle
      config.externals = config.externals || [];
      config.externals.push('nodemailer', 'googleapis');
    }
    return config;
  },
}

export default nextConfig
