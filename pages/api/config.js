
const API_BASE_URL = "https://web-films-api-test.vercel.app";

const API_MOVIES_ENDPOINTS = {
  movies: "https://web-films-api-test.vercel.app/found",
  search: "/search?titulo=",
  perid: "https://web-films-api-test.vercel.app/",
  forreleasedate: "https://web-films-api-test.vercel.app/releasedate",
};

const API_SERIES_ENDPOINTS = {
  series: "https://web-films-api-test.vercel.app/series/found",
  search: "https://web-films-api-test.vercel.app/series/search?titulo=",
  perid: "https://web-films-api-test.vercel.app/series/",
  forreleasedate: "https://web-films-api-test.vercel.app/series/releasedate",
};

const API_CHANNELS_ENDPOINTS = {
  channels: "https://web-films-api-test.vercel.app/channels",
};

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  moviesendpoints: API_MOVIES_ENDPOINTS,
  seriesendpoints: API_SERIES_ENDPOINTS,
  channelsendpoints: API_CHANNELS_ENDPOINTS 
};
