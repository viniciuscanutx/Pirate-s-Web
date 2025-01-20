
const API_BASE_URL = "https://web-films-api.vercel.app";

const API_MOVIES_ENDPOINTS = {
  movies: "https://web-films-api.vercel.app/found",
  search: "/search?titulo=",
  perid: "https://web-films-api.vercel.app/",
  forreleasedate: "https://web-films-api.vercel.app/releasedate",
};

const API_SERIES_ENDPOINTS = {
  series: "https://web-films-api.vercel.app/series/found",
  search: "https://web-films-api.vercel.app/series/search?titulo=",
  perid: "https://web-films-api.vercel.app/series/",
  forreleasedate: "https://web-films-api.vercel.app/series/releasedate",
};

const API_CHANNELS_ENDPOINTS = {
  channels: "https://web-films-api.vercel.app/channels",
};

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  moviesendpoints: API_MOVIES_ENDPOINTS,
  seriesendpoints: API_SERIES_ENDPOINTS,
  channelsendpoints: API_CHANNELS_ENDPOINTS 
};
