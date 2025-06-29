import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**'
        }]
    },
    experimental: {
        useCache: true,
    },
    output: "standalone"
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);