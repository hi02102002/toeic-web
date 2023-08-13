/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer');
const nextConfig = {
   images: {
      domains: [
         'lh3.googleusercontent.com',
         'res.cloudinary.com',
         'study4.com',
         'lh4.googleusercontent.com',
      ],
   },
};

module.exports = withContentlayer(nextConfig);
