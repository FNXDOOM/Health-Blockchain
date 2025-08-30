/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We'll handle type checking separately in CI/CD
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd()),
      '@/lib': path.resolve(process.cwd(), 'lib'),
      '@/components': path.resolve(process.cwd(), 'components'),
      '@/app': path.resolve(process.cwd(), 'app'),
    };

    // Handle Node.js modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        buffer: false,
        util: false,
        events: false,
        querystring: false,
        child_process: false,
        cluster: false,
        dgram: false,
        dns: false,
        domain: false,
        module: false,
        punycode: false,
        readline: false,
        repl: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        v8: false,
        vm: false,
        worker_threads: false,
      };
    }

    // Handle specific module issues
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'ipfs-http-client': 'commonjs ipfs-http-client',
        'fabric-network': 'commonjs fabric-network',
        'fabric-common': 'commonjs fabric-common',
      });
    }

    return config;
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
