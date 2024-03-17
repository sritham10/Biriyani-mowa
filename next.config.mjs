/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com'
            },
            {   
                protocol: 'https',
                hostname: 'avatars.tzador.com'
            }
        ]
    }
};

export default nextConfig;
