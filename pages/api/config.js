
const API_BASE_URL = "https://web-films-api-test.vercel.app";

const API_MOVIES_ENDPOINTS = {
  movies: "/found",
  search: "/search?titulo=",
  forreleasedate: "/releasedate",
};

const API_SERIES_ENDPOINTS = {
  series: "/series/found",
  search: "/series/search?titulo=",
  forreleasedate: "/series/releasedate",
};

const API_CHANNELS_ENDPOINTS = {
  channels: "/channels",
};

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  moviesendpoints: API_MOVIES_ENDPOINTS,
  seriesendpoints: API_SERIES_ENDPOINTS,
  channelsendpoints: API_CHANNELS_ENDPOINTS 
};
