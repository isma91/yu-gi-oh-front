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
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: process.env["NEXT_PUBLIC_API_HOSTNAME"],
            },
        ],
    },
};

export default nextConfig;
