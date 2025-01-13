/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'm.media-amazon.com',
      'web-films-api.vercel.app',
      'warezcdn.link', 
      'via.placeholder.com',
      'www.justwatch.com',
      'images.plex.tv',
      'i.pinimg.com',
      'resizing.flixster.com',
      'image.tmdb.org',
      'media.themoviedb.org'
    ],
  },
};

export default nextConfig;
