// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig

module.exports = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination:
                    "https://seashell-app-5u4ct.ondigitalocean.app/api/:path*", // Proxy to Backend
            },
        ]
    },
}
