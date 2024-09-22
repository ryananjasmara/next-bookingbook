/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ryanlearnawsbucket.s3.ap-southeast-2.amazonaws.com',
                port: '',
                pathname: '/book-covers/**'
            }
        ]
    },
    experimental: {
        serverActions: true,
    }
};

export default nextConfig;
