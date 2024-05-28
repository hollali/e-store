/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.sanity.io'],
    },
    webpack:(config) =>{
        config.resolve.fallback = {fa:false};
    }
};

export default nextConfig;
