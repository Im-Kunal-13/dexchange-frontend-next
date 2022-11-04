/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

// module.exports = () => {
//   const rewrites = () => {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'https://mail.google.com/api/:path*' // Proxy to Backend
//       }
//     ]
//   }

//   return {
//     rewrites
//   }
// }
