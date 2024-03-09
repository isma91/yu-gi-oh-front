/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/card",
                destination: "/card/card-search",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
