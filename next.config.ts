import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
        // Disable ESLint during build
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disable TypeScript checking during build
        ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/en',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
