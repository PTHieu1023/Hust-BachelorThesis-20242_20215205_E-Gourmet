import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: 'localhost',
            port: '8080',
            pathname: '/**'
        },
            {
                protocol: 'http',
                hostname: '192.168.100.145',
                port: '8080',
                pathname: '/**'
            }]
    },
    output: "standalone"
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);